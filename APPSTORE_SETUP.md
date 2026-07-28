# Connecting App Store Connect (real download numbers)

The dashboard can pull Apple's daily Sales reports so real App Store download
units appear next to your tracked "first opens". Setup takes about 10 minutes
and happens entirely in App Store Connect plus your backend host's environment
variables. Until it's configured, the dashboard shows a "not connected" card
and everything else works normally.

## Step 1 — Create an API key in App Store Connect

1. Sign in to [App Store Connect](https://appstoreconnect.apple.com) as the
   Account Holder or an Admin.
2. Go to **Users and Access → Integrations → App Store Connect API** (the
   "Team Keys" tab).
3. If this is your first key, click **Request Access** and accept the terms.
4. Click **＋** to generate a new key:
   - Name: `mood-admin-analytics` (anything works)
   - Access: **Finance** (or Admin) — Sales & Trends reports require the
     Finance role; the lower "Sales" role also works for sales reports.
5. **Download the .p8 file immediately** — Apple only lets you download it
   once. Keep it somewhere safe; treat it like a password.
6. Note two values shown on that page:
   - **Issuer ID** (top of the page, a UUID like `57246542-96fe-…`)
   - **Key ID** for the key you just made (10 characters, like `2X9R4HXF34`)

## Step 2 — Find your Vendor Number

Go to **Payments and Financial Reports** in App Store Connect — your vendor
number is shown at the top left (usually 8 digits, like `87654321`).

## Step 3 — Set four environment variables on the backend

Wherever the FastAPI backend runs (the same place `MONGO_URL` etc. are set),
add:

```
APPSTORE_ISSUER_ID=57246542-96fe-1a63-e053-0824d011072a
APPSTORE_KEY_ID=2X9R4HXF34
APPSTORE_VENDOR_NUMBER=87654321
APPSTORE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM4...\n-----END PRIVATE KEY-----
```

For `APPSTORE_PRIVATE_KEY`, paste the **contents** of the .p8 file. Any of
these formats work:

- The raw file contents with real newlines (fine in a `.env` file with quotes)
- Newlines escaped as `\n` on a single line (easiest in hosting dashboards)
- The whole file base64-encoded (`base64 -i AuthKey_2X9R4HXF34.p8`)

Then redeploy/restart the backend.

## Step 4 — Sync

On startup the backend now syncs the trailing 30 days automatically and
re-syncs every 6 hours (Apple restates recent days, so the last week is always
re-fetched). To backfill further or pull immediately, open the dashboard's
**Growth** page and hit **Sync now** (backfills 90 days), or call:

```
POST /api/analytics/admin/appstore/sync?days=365
```

with your admin token to backfill a full year.

## What you'll see

- **Overview → All-time totals**: an "App Store Downloads" card next to
  "First Opens (tracked)" — the install funnel reads left to right:
  Downloads → First Opens → Accounts → Conversions.
- **Growth**: a "Downloads vs first opens" chart with both lines on the same
  daily/weekly/monthly buckets as the rest of the dashboard.

## Semantics (what the number means)

Sales-report units count **new downloads, deduped per Apple ID** —
redownloads and app updates are excluded, so this tracks App Store Connect's
"first-time downloads" closely (App Analytics and Sales reports are separate
Apple pipelines, so counts can differ by a hair). Reports for a day are
published roughly the next day Pacific time and may be restated for a few
days; days Apple hasn't published yet show as gaps, not zeros.

## Troubleshooting

- **401 from Apple** — Issuer ID, Key ID, and private key don't match, or the
  key was revoked. Regenerate the key and update all three values.
- **403** — the key's role can't access sales reports; use Finance (or Admin).
- **Card shows "—" with "not connected"** — one or more env vars are missing;
  the card lists which. Check spelling and restart the backend.
- **Recent days missing** — normal; Apple publishes with ~1-day lag. The sync
  loop picks them up automatically.
