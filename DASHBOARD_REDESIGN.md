# MOOD Admin Dashboard — Redesign & Metrics Audit

*July 25, 2026*

This document covers three things: why your dashboard numbers didn't match App Store Connect, what was wrong under the hood, and what changed in the redesign.

---

## 1. The 478 vs 535 question

**Your dashboard has never had a "downloads" metric.** The number you were reading as first-time downloads is `unique_guest_devices` — the count of unique devices that opened the app and successfully sent a `guest_session_started` event to your server. App Store Connect's 535 counts something structurally different: Apple IDs that downloaded the app, at download time.

Your number will always be lower, for reasons that are inherent to how it's measured, not bugs:

1. **A download is not an open.** Anyone who downloaded but never launched the app (typically 10–20% of downloads) can never appear in your data. 478/535 ≈ 89%, which is right in the normal range for this gap alone.
2. **Tracking only exists since it shipped.** Installs from before the tracking code deployed are invisible.
3. **The event can be lost.** The app fires tracking as fire-and-forget; a first launch while offline or on flaky network is never recorded. The app also has an analytics opt-out setting.
4. **Different dedup keys.** Apple counts per Apple ID (one person, iPhone + iPad = 1). You count per device ID (same person = 2). A wiped-and-reinstalled phone can also regenerate its ID.

The dashboard now labels this metric **"First Opens (tracked)"** with a tooltip explaining exactly this, plus a callout on the Overview page. If you want true download numbers in the dashboard, the right way is a scheduled import from the **App Store Connect API (Sales & Trends reports)** — happy to build that as a follow-up.

## 2. Bugs found in the metrics (and fixed)

The audit traced every metric from the UI back to the database query. These were real correctness bugs, now fixed in `backend/`:

| # | Bug | Impact |
|---|-----|--------|
| 1 | `platform-stats` endpoint crashed on every call (a variable-name typo, silently swallowed) | The old Overview's fallback stats and popular-moods card were always empty |
| 2 | Guest events added a phantom `null` user to every Active Users time bucket | Active-user trend inflated by 1 every day |
| 3 | The "Workout Completion Rate" chart requested a metric the backend didn't have | Chart was permanently empty |
| 4 | Week labels used the wrong year formula around New Year (`2025-W01` for Dec 29) | Weekly charts mis-sorted at year boundaries |
| 5 | Signup trend didn't exclude staff/test accounts while most other metrics did | Numbers disagreed between tabs |
| 6 | Retention averages counted cohorts too young to have Day-7/Day-28 data as 0% | D7/D28 retention systematically understated — your retention is better than the old dashboard said |
| 7 | Funnel "overall conversion" could exceed 100% and ignored step order | Misleading conversion numbers |

Also fixed: retention cells for too-young cohorts now show "—" instead of 0%, and funnels now report monotonically decreasing user counts (each step = users who did that step *and all previous ones*).

## 3. Things that were fake or dead (removed)

- **The Social tab's Likes, Comments, and Follows were fabricated in the browser** — literally `posts × 3.5`, `posts × 1.2`, `posts × 0.8`. The new Social page uses only real event data (the backend always had the real counts; the page just never called that endpoint).
- **The Onboarding and Monetization tabs called backend endpoints that don't exist**, so they always errored. Deeper: the mobile app doesn't emit any onboarding, paywall, or purchase events, and has no purchases SDK — there was never any data behind those tabs. They're removed. When you're ready to monetize, instrument events like `paywall_viewed`, `purchase_completed` (with `revenue_usd`), `trial_started` in the app first, and the tab can come back with real data.
- Removed dead code: unused Radix/date-picker dependencies were left in package.json (harmless), unused per-chart controls, the broken saved-views widget, and an invisible dismiss button on insights (now visible).

## 4. The redesign

**11 tabs → 7**, organized around the questions an investor (or you) actually asks:

| New tab | Question it answers | Replaces |
|---|---|---|
| Overview | How is MOOD doing at a glance? | Overview (rebuilt) |
| Growth | Are people signing up and activating? | Onboarding, Funnels, half of Insights |
| Engagement | Do they come back? Do workouts get finished? | Retention, half of Insights |
| Content | What do they pick and finish? | Features |
| Social | Is a community forming? | Social (rebuilt, real data) |
| User Explorer | Who is this specific user? | Users (+ drilldown links now work) |
| Admin & Config | Env, access, app config, ops | Access + Ops |

What's consistent everywhere now:

- **One time control on every page**: a date range (7/30/90/180/365 days) plus a **Daily / Weekly / Monthly** granularity switch, shared across pages — set it once, it follows you.
- **Every stat has an ⓘ tooltip** stating exactly what it counts, in plain English, including honest caveats (e.g. DAU is a rolling 24-hour window; retention counts any activity; funnels are directional).
- **"This period vs previous period"** deltas on all headline KPIs.
- **Internal excluded** toggle (staff/test accounts) globally, defaulting to excluded.
- Loading skeletons per section instead of blank pages, and visible error banners instead of silent zeros.
- A colorblind-safe, contrast-validated chart palette.

## 5. Numbers that still deserve a caveat

- `comprehensive-stats` (all-time totals) doesn't exclude internal users — the counts are small enough that this barely matters, but it's noted in the tooltips.
- Deleted accounts are removed from `users`, so historical signup counts can shrink slightly over time. App Store numbers never shrink. (If this bothers you, the fix is soft-delete flags instead of removal — follow-up item.)
- All metrics are UTC; App Store Connect uses your report timezone, so daily edges differ.

## 6. Deploying

- **Frontend** (`mood-admin/`): builds clean (`next build` verified). Push to your repo and Vercel will deploy as usual. Old URLs (/retention, /funnels, etc.) redirect to their new homes.
- **Backend** (`backend/`): `server.py`, `user_analytics.py`, `admin_analytics.py` changed (all compile-checked). Deploy the backend before or together with the frontend — the new Overview uses the fixed `completion_rate` time-series and the retention/funnel fixes.
- Old files were moved to `_to_delete/` at the repo root rather than deleted — review and delete that folder when you're satisfied.

## 7. Recommended next steps

1. ~~App Store Connect API import~~ — **DONE.** The backend now pulls Apple's daily Sales reports (real download units, deduped per Apple ID) into Mongo and the dashboard shows them: an "App Store Downloads" card in Overview's all-time totals, and a "Downloads vs first opens" chart on the Growth page. It auto-syncs every 6 hours once configured, with a manual Sync button on Growth. **Setup takes ~10 minutes — see `APPSTORE_SETUP.md`** (create an API key in App Store Connect, set 4 env vars on the backend). Until configured, the dashboard shows a "not connected" card and works normally otherwise.
2. **Instrument purchases** when monetization ships (paywall + purchase + trial events), then restore a Monetization tab.
3. A dedicated `app_first_open` event with client-side retry, so first-open tracking stops losing offline launches.
4. Consolidate the backend's duplicate endpoints (two user-list endpoints, two breakdown systems, a dead duplicate route) — the audit list is in `backend/METRIC_DEFINITIONS.md`.
