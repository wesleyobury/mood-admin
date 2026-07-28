"""
App Store Connect — Sales Reports integration.

Pulls Apple's daily Sales (SUMMARY) reports so the admin dashboard can show
REAL App Store download numbers next to the server-side "first opens (tracked)"
proxy metric.

Configuration (environment variables on the backend host):

  APPSTORE_ISSUER_ID      Issuer ID (App Store Connect > Users and Access >
                          Integrations > App Store Connect API)
  APPSTORE_KEY_ID         Key ID of a team API key with Admin or Finance role
                          (Sales & Trends reports require Finance/Admin access)
  APPSTORE_PRIVATE_KEY    Contents of the downloaded .p8 file. Either the raw
                          PEM (newlines may be escaped as \\n) or base64 of it.
  APPSTORE_VENDOR_NUMBER  Vendor number (App Store Connect > Payments and
                          Financial Reports, top-left)

Data is cached in the `appstore_daily_units` Mongo collection:
  { _id: "YYYY-MM-DD", date: "YYYY-MM-DD", downloads: int, updates: int,
    by_product_type: {ptype: units}, synced_at: datetime }

Notes on semantics:
- Apple's Sales report counts a unit at DOWNLOAD time, deduped per Apple ID.
  Redownloads are NOT included, so `downloads` here ≈ App Store Connect's
  "first-time downloads" (small differences remain: Apple restates recent
  days, and App Analytics vs Sales reports use slightly different pipelines).
- Reports for a given day appear roughly the next day (Pacific time) and can
  be restated for a few days, so the sync loop re-fetches the trailing week.
"""

import asyncio
import base64
import csv
import gzip
import io
import logging
import os
import time
from datetime import datetime, timedelta, timezone, date as date_cls
from typing import Optional

import httpx
import jwt  # PyJWT

logger = logging.getLogger(__name__)

APPSTORE_API_BASE = "https://api.appstoreconnect.apple.com"
COLLECTION = "appstore_daily_units"

# Product Type Identifiers that represent a NEW app download in Sales reports
# (1* = iPhone/universal/iPad purchases & their custom-app variants,
#  F1 = app bundle). Updates (7*) are tracked separately; redownloads are not
# present in Sales reports at all.
DOWNLOAD_PRODUCT_TYPES = {"1", "1F", "1T", "1E", "1EP", "1EU", "F1"}
UPDATE_PRODUCT_TYPES = {"7", "7F", "7T", "7E", "7EP", "7EU", "F7"}


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

def _get_private_key() -> Optional[str]:
    raw = os.environ.get("APPSTORE_PRIVATE_KEY", "").strip()
    if not raw:
        return None
    # Allow escaped newlines (common when set through dashboard env editors)
    if "\\n" in raw and "\n" not in raw:
        raw = raw.replace("\\n", "\n")
    # Allow base64-encoded PEM
    if "BEGIN PRIVATE KEY" not in raw:
        try:
            decoded = base64.b64decode(raw).decode("utf-8")
            if "BEGIN PRIVATE KEY" in decoded:
                raw = decoded
        except Exception:
            return None
    return raw if "BEGIN PRIVATE KEY" in raw else None


def get_config() -> Optional[dict]:
    issuer = os.environ.get("APPSTORE_ISSUER_ID", "").strip()
    key_id = os.environ.get("APPSTORE_KEY_ID", "").strip()
    vendor = os.environ.get("APPSTORE_VENDOR_NUMBER", "").strip()
    key = _get_private_key()
    if not (issuer and key_id and vendor and key):
        return None
    return {"issuer": issuer, "key_id": key_id, "vendor": vendor, "key": key}


def is_configured() -> bool:
    return get_config() is not None


def missing_config_fields() -> list:
    """Which env vars still need to be set (for a helpful status message)."""
    fields = []
    if not os.environ.get("APPSTORE_ISSUER_ID", "").strip():
        fields.append("APPSTORE_ISSUER_ID")
    if not os.environ.get("APPSTORE_KEY_ID", "").strip():
        fields.append("APPSTORE_KEY_ID")
    if _get_private_key() is None:
        fields.append("APPSTORE_PRIVATE_KEY")
    if not os.environ.get("APPSTORE_VENDOR_NUMBER", "").strip():
        fields.append("APPSTORE_VENDOR_NUMBER")
    return fields


# ---------------------------------------------------------------------------
# Auth + fetch
# ---------------------------------------------------------------------------

def _make_token(config: dict) -> str:
    """Short-lived ES256 JWT per Apple's App Store Connect API auth spec."""
    now = int(time.time())
    payload = {
        "iss": config["issuer"],
        "iat": now,
        "exp": now + 15 * 60,  # max allowed is 20 minutes
        "aud": "appstoreconnect-v1",
    }
    return jwt.encode(
        payload,
        config["key"],
        algorithm="ES256",
        headers={"kid": config["key_id"], "typ": "JWT"},
    )


def _parse_sales_tsv(tsv_text: str) -> dict:
    """Sum units by product type from a Sales SUMMARY report TSV."""
    by_type: dict = {}
    reader = csv.DictReader(io.StringIO(tsv_text), delimiter="\t")
    for row in reader:
        ptype = (row.get("Product Type Identifier") or "").strip()
        if not ptype:
            continue
        try:
            units = int(float(row.get("Units") or 0))
        except (TypeError, ValueError):
            continue
        by_type[ptype] = by_type.get(ptype, 0) + units
    downloads = sum(v for k, v in by_type.items() if k in DOWNLOAD_PRODUCT_TYPES)
    updates = sum(v for k, v in by_type.items() if k in UPDATE_PRODUCT_TYPES)
    return {"downloads": downloads, "updates": updates, "by_product_type": by_type}


async def fetch_daily_report(report_date: date_cls) -> Optional[dict]:
    """
    Fetch one day's Sales SUMMARY report.
    Returns {downloads, updates, by_product_type}, or:
      {"downloads": 0, ...} when Apple says there is no report (no activity),
      None when the report is not available yet / request failed.
    """
    config = get_config()
    if config is None:
        return None
    token = _make_token(config)
    params = {
        "filter[frequency]": "DAILY",
        "filter[reportDate]": report_date.strftime("%Y-%m-%d"),
        "filter[reportSubType]": "SUMMARY",
        "filter[reportType]": "SALES",
        "filter[vendorNumber]": config["vendor"],
    }
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/a-gzip"}
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.get(
            f"{APPSTORE_API_BASE}/v1/salesReports", params=params, headers=headers
        )
    if resp.status_code == 404:
        # Apple returns 404 both for "not ready yet" and "no units that day".
        # Treat recent dates as not-ready (retry later); older dates as zero.
        age_days = (datetime.now(timezone.utc).date() - report_date).days
        if age_days >= 3:
            return {"downloads": 0, "updates": 0, "by_product_type": {}}
        return None
    if resp.status_code != 200:
        logger.warning(
            f"App Store Connect salesReports {report_date}: HTTP {resp.status_code} "
            f"{resp.text[:300]}"
        )
        return None
    try:
        tsv = gzip.decompress(resp.content).decode("utf-8", errors="replace")
    except OSError:
        tsv = resp.content.decode("utf-8", errors="replace")  # some proxies pre-unzip
    return _parse_sales_tsv(tsv)


# ---------------------------------------------------------------------------
# Sync + read
# ---------------------------------------------------------------------------

async def sync_days(db, days_back: int = 30, force_recent: int = 7) -> dict:
    """
    Ensure the trailing `days_back` days are in Mongo. Days already cached are
    skipped, except the most recent `force_recent` days which are re-fetched
    because Apple restates them. Sequential + throttled to be API-friendly.
    """
    if not is_configured():
        return {"configured": False, "missing": missing_config_fields()}

    yesterday = datetime.now(timezone.utc).date() - timedelta(days=1)
    synced, skipped, pending, errors = 0, 0, [], 0

    existing = {
        doc["_id"]
        async for doc in db[COLLECTION].find({}, {"_id": 1})
    }

    for offset in range(days_back):
        day = yesterday - timedelta(days=offset)
        key = day.strftime("%Y-%m-%d")
        if key in existing and offset >= force_recent:
            skipped += 1
            continue
        try:
            result = await fetch_daily_report(day)
        except Exception as e:
            logger.warning(f"App Store sync failed for {key}: {e}")
            errors += 1
            continue
        if result is None:
            pending.append(key)
            continue
        await db[COLLECTION].update_one(
            {"_id": key},
            {
                "$set": {
                    "date": key,
                    "downloads": result["downloads"],
                    "updates": result["updates"],
                    "by_product_type": result["by_product_type"],
                    "synced_at": datetime.now(timezone.utc),
                }
            },
            upsert=True,
        )
        synced += 1
        await asyncio.sleep(0.4)  # gentle on Apple's rate limits

    return {
        "configured": True,
        "synced": synced,
        "skipped": skipped,
        "not_ready_yet": pending,
        "errors": errors,
    }


async def get_download_series(db, days: int = 30, period: str = "day") -> dict:
    """
    Downloads bucketed like the dashboard's other time series
    (day: %Y-%m-%d, week: %G-W%V, month: %Y-%m). days=0 → everything cached.
    """
    status: dict = {
        "configured": is_configured(),
        "missing": missing_config_fields(),
    }
    query: dict = {}
    if days and days > 0:
        cutoff = (datetime.now(timezone.utc).date() - timedelta(days=days)).strftime(
            "%Y-%m-%d"
        )
        query = {"_id": {"$gte": cutoff}}

    docs = await db[COLLECTION].find(query).sort("_id", 1).to_list(5000)

    if period == "month":
        fmt = "%Y-%m"
    elif period == "week":
        fmt = "%G-W%V"
    else:
        fmt = "%Y-%m-%d"

    buckets: dict = {}
    total = 0
    last_synced = None
    for doc in docs:
        try:
            d = datetime.strptime(doc["_id"], "%Y-%m-%d")
        except ValueError:
            continue
        key = d.strftime(fmt)
        buckets[key] = buckets.get(key, 0) + int(doc.get("downloads") or 0)
        total += int(doc.get("downloads") or 0)
        ts = doc.get("synced_at")
        if ts is not None and (last_synced is None or ts > last_synced):
            last_synced = ts

    labels = sorted(buckets.keys())
    status.update(
        {
            "labels": labels,
            "values": [buckets[k] for k in labels],
            "total": total,
            "days_cached": len(docs),
            "last_synced_at": last_synced.isoformat() if last_synced else None,
            "note": (
                "Units from Apple's daily Sales reports (new downloads per Apple ID; "
                "redownloads and updates excluded). Apple can restate recent days."
            ),
        }
    )
    return status


async def start_sync_loop(db, interval_hours: int = 6):
    """Background task: keep the trailing 30 days synced. Safe if unconfigured."""
    if not is_configured():
        logger.info(
            "App Store Connect import not configured "
            f"(missing: {', '.join(missing_config_fields())}) — skipping sync loop"
        )
        return
    logger.info("📈 App Store Connect sync loop started")
    while True:
        try:
            result = await sync_days(db, days_back=30)
            logger.info(f"App Store sync: {result}")
        except Exception as e:
            logger.error(f"App Store sync loop error: {e}")
        await asyncio.sleep(interval_hours * 3600)
