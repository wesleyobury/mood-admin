# Connecting App Store Connect (real download numbers)

> **Update (Jul 28):** the deployed backend (MoodV10_8 on Emergent) already ships
> its own App Store Connect integration (`backend/app_store_connect.py` +
> `store_metrics`), and the dashboard's App Store cards now read from it via
> adapter endpoints. **Use the `ASC_*` env var names below** — the `APPSTORE_*`
> names from an earlier draft of this guide apply only to the standalone module
> in this repo's backend copy, which is not the deployed backend.
> Full details: `backend/STORE_REPORTING_SETUP.md` in the MoodV10_8 repo (also
> covers Google Play).

## Step 1 — API key in App Store Connect

You already have a key: `AuthKey_F8FY9GALTH.p8` (in the "Official Mood App"
folder) matches the backend's default `ASC_KEY_ID` (`F8FY9GALTH`). If you ever
rotate it: App Store Connect -> Users and Access -> Integrations -> App Store
Connect API -> generate a key with the **Finance** (or Admin) role, download
the .p8 once, note the **Issuer ID** (UUID at the top of that page) and the
key's **Key ID**.

## Step 2 — Vendor number

App Store Connect -> Payments and Financial Reports -> the 8-digit vendor
number, top-left.

## Step 3 — Environment variables on the Emergent backend

| Variable | Required | Value |
|---|---|---|
| `ASC_ISSUER_ID` | yes | the Issuer ID (UUID) |
| `ASC_VENDOR_NUMBER` | yes | the 8-digit vendor number |
| `ASC_PRIVATE_KEY` | one of these | full PEM contents of the .p8 (use \n for newlines on single-line hosts) |
| `ASC_PRIVATE_KEY_PATH` | one of these | ...or an absolute path to the .p8 on the server |
| `ASC_KEY_ID` | no | defaults to `F8FY9GALTH`; set only if you rotate keys |

Set them in the Emergent project's deploy/env settings (backend/.env is no
longer tracked in git there — secrets live in deploy settings), then restart
the backend.

## Step 4 — Sync and verify

A background worker syncs the last ~14 days automatically every 12h. On demand:
the **Growth** page's "Sync now" button (or Acquisition -> Sync downloads), or
`POST /api/analytics/admin/appstore/sync?days=365` to backfill a year.

Check: Overview -> All-time totals should show an App Store Downloads number
(near your App Store Connect first-time downloads), and Growth's
"Downloads vs first opens" chart fills in. If the card shows "not connected",
it lists exactly which env vars are still missing.

## What the number means

First-time download units from Apple's daily Sales reports (redownloads and
updates excluded) — the same basis as App Store Connect's "first-time
downloads". Reports publish with ~1 day lag, in Apple's report timezone, and
recent days can be restated; unpublished days show as gaps, not zeros.
