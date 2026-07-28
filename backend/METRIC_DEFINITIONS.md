# MOOD Admin Analytics - Metric Definitions

## Overview
All backend aggregations are computed in **UTC**. Frontend displays may use local timezone for labels but all data is UTC-based.

---

## Core Metrics

### Daily Active Users (DAU)
- **Definition**: Unique users with at least one `app_session_start` event in a ROLLING 24-hour window (now - 24h), not a calendar day
- **Primary Event**: `app_session_start`
- **Computation**: `COUNT(DISTINCT user_id) WHERE event_type = 'app_session_start' AND timestamp >= (now - 24 hours)`
- **Timezone**: UTC

### Weekly Active Users (WAU)
- **Definition**: Unique users with at least one `app_session_start` event in a ROLLING 7-day window
- **Computation**: `COUNT(DISTINCT user_id) WHERE event_type = 'app_session_start' AND timestamp >= (now - 7 days)`

### Monthly Active Users (MAU)
- **Definition**: Unique users with at least one `app_session_start` event in a ROLLING 30-day window
- **Computation**: `COUNT(DISTINCT user_id) WHERE event_type = 'app_session_start' AND timestamp >= (now - 30 days)`

### DAU/MAU Stickiness
- **Definition**: Ratio of DAU to MAU, indicating how "sticky" the app is
- **Computation**: `DAU / MAU * 100`
- **Interpretation**: Higher = users return more frequently

---

### New Users
- **Definition**: Users whose account was created in the date range
- **Source**: `users.created_at`
- **NOT**: First event timestamp (unless specified)
- **Computation**: `COUNT(*) FROM users WHERE created_at >= start AND created_at <= end`

---

### Workouts Started
- **Definition**: Total count of `workout_started` events in the date range
- **Event**: `workout_started`
- **Note**: Counts events, not unique users (a user can start multiple workouts)

### Workouts Completed
- **Definition**: Total count of `workout_completed` events in the date range
- **Event**: `workout_completed`

### Completion Rate
- **Definition**: Percentage of started workouts that were completed
- **Computation**: `(workouts_completed / workouts_started) * 100`
- **Scope**: Same date range for both numerator and denominator
- **Note**: This is event-based, not session-based (doesn't track same-workout completion)

---

### Posts Created
- **Definition**: Total count of `post_created` events
- **Event**: `post_created`

### Likes
- **Definition**: Total count of `post_liked` events
- **Event**: `post_liked`

### Comments
- **Definition**: Total count of `post_commented` events
- **Event**: `post_commented`

### Follows
- **Definition**: Total count of `user_followed` events
- **Event**: `user_followed`

---

## Retention Metrics

### Retention Cohorts
- **Cohort Definition**: Users grouped by `users.created_at` (signup date) in UTC
- **Cohort Periods**: Day, Week, or Month
- **Retention Event**: "Returned" means the user had ANY tracked event (not just `app_session_start`)
- **Anchoring**: Day D is anchored to each user's EXACT signup timestamp: the window is `[signup + D days, signup + D + 1 days)`, not calendar days
- **Young Cohorts**: Cohorts too young to have reached day D (cohort period start + D days > now) report `null` for that cell (frontend renders "—") and are EXCLUDED from `average_retention` for that day

### D1 Retention
- **Definition**: Percentage of cohort users with any tracked event in `[signup + 1 day, signup + 2 days)`
- **Computation**: `(users with activity in the day-1 window) / (cohort size) * 100`

### D7 Retention
- **Definition**: Percentage of cohort users with any tracked event in `[signup + 7 days, signup + 8 days)`

### D28 Retention
- **Definition**: Percentage of cohort users with any tracked event in `[signup + 28 days, signup + 29 days)`

---

## Funnel Metrics

### Default Funnel Steps
1. `app_session_start` - User opened the app
2. `mood_selected` - User engaged with workout builder
3. `workout_started` - User started a workout
4. `workout_completed` - User completed a workout
5. `post_created` - User created a post

### Funnel Matching
- **Within-period matching**: A user counts for a step if they performed the step's event anywhere in the date range. Event ORDER is NOT enforced (a user who completed a workout before selecting a mood in the period still counts through both steps).
- **Cumulative counts**: Each step's `unique_users` is the CUMULATIVE intersection — users who did this step AND all previous steps in the period. `raw_unique_users` is the raw per-step count regardless of previous steps. The funnel is therefore monotonically decreasing.

### Conversion Rate (Step N)
- **Definition**: Percentage of users from step N-1 (cumulative) who also completed step N
- **Computation**: `(cumulative users at step N) / (cumulative users at step N-1) * 100`

### Overall Funnel Conversion
- **Definition**: Percentage of entry users who completed ALL steps in the period
- **Computation**: `(users in step1 ∩ step2 ∩ ... ∩ stepN) / (first step users) * 100`

---

## Data Quality Notes

### Excluded Users
Internal/staff users are excluded from most analytics via the `users.is_internal` flag (accounts with `is_internal: true`). Endpoints accept an `include_internal` query param (default false) to include them.

**Endpoints that do NOT exclude internal users** (they count everyone):
- `comprehensive-stats`
- `users/active`
- `daily-active`
- `users/list`
- `try-workout-stats`
- `session-completion-stats`
- `chart-data/*`
- breakdowns (`breakdown/*`)

### Timezone Handling
- **Backend**: All aggregations use UTC
- **Frontend**: Display labels may show local timezone with indicator "(UTC)"
- **Event Grouping**: Always UTC day boundaries

### Date Range Limits
- **Default**: 30 days
- **Maximum**: 180 days for standard endpoints
- **Retention**: Up to 90 days of cohorts

---

## Downloads vs App Store Connect

`unique_guest_devices` (and guest metrics generally) count **tracked first opens**, NOT App Store downloads. Differences from App Store Connect (ASC) first-time download numbers:

- **Device-ID based**: counts unique device identifiers seen by our analytics, not store transactions
- **Only since tracking shipped**: devices that first opened the app before analytics tracking was released are never counted
- **Requires a successful network call**: a first open with no connectivity (or a failed request) is not recorded
- **Analytics opt-out**: users who opt out of analytics in the app are never tracked
- **No download without open**: a download that is never opened produces no event

For these reasons `unique_guest_devices` will always UNDERCOUNT ASC first-time downloads. Use ASC for true download numbers; use this metric for tracked first-open engagement.

---

## MongoDB Collections Used

| Collection | Purpose | Key Indexes |
|------------|---------|-------------|
| `user_events` | Event tracking | `(timestamp)`, `(user_id, timestamp)`, `(event_type, timestamp)` |
| `users` | User accounts | `(created_at)`, `(username)`, `(email)` |
| `daily_activity` | Daily aggregates | `(date)`, `(user_id, date)` |
| `login_events` | Auth history | `(user_id, timestamp)`, `(timestamp)` |
| `admin_audit_logs` | Admin action audit | `(timestamp_utc)`, `(admin_user_id, timestamp_utc)` |

---

## Validation Checklist

Run periodically to ensure metric accuracy:

```javascript
// Example: Validate DAU for a specific date
db.user_events.distinct("user_id", {
  event_type: "app_session_start",
  timestamp: {
    $gte: ISODate("2025-02-01T00:00:00Z"),
    $lt: ISODate("2025-02-02T00:00:00Z")
  }
}).length

// Compare with dashboard value for Feb 1, 2025
```

---

*Last Updated: 2026-07-25*
*Version: 1.1*
