# MOOD Admin Analytics - Metric Definitions

## Overview
All backend aggregations are computed in **UTC**. Frontend displays may use local timezone for labels but all data is UTC-based.

---

## Core Metrics

### Daily Active Users (DAU)
- **Definition**: Unique users with at least one `app_session_start` event on a given day
- **Primary Event**: `app_session_start`
- **Computation**: `COUNT(DISTINCT user_id) WHERE event_type = 'app_session_start' AND date = target_date`
- **Timezone**: UTC day boundaries

### Weekly Active Users (WAU)
- **Definition**: Unique users with at least one `app_session_start` event in the past 7 days
- **Computation**: `COUNT(DISTINCT user_id) WHERE event_type = 'app_session_start' AND timestamp >= (now - 7 days)`

### Monthly Active Users (MAU)
- **Definition**: Unique users with at least one `app_session_start` event in the past 30 days
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
- **Retention Event**: `app_session_start` (PRIMARY)
  - Secondary (future): `workout_completed` for product-quality retention

### D1 Retention
- **Definition**: Percentage of cohort users who had `app_session_start` on day 1 after signup
- **Computation**: `(users with activity on day 1) / (cohort size) * 100`

### D7 Retention
- **Definition**: Percentage of cohort users who had `app_session_start` on day 7 after signup

### D28 Retention
- **Definition**: Percentage of cohort users who had `app_session_start` on day 28 after signup

---

## Funnel Metrics

### Default Funnel Steps
1. `app_session_start` - User opened the app
2. `mood_selected` - User engaged with workout builder
3. `workout_started` - User started a workout
4. `workout_completed` - User completed a workout
5. `post_created` - User created a post

### Conversion Rate (Step N)
- **Definition**: Percentage of users from step N-1 who completed step N
- **Computation**: `(users at step N) / (users at step N-1) * 100`

### Overall Funnel Conversion
- **Definition**: Percentage of entry users who completed final step
- **Computation**: `(final step users) / (first step users) * 100`

---

## Data Quality Notes

### Excluded Users
The following users are excluded from analytics:
- User IDs in `EXCLUDED_USER_IDS` list (test accounts)
- Usernames in `EXCLUDED_USERNAMES` list

### Timezone Handling
- **Backend**: All aggregations use UTC
- **Frontend**: Display labels may show local timezone with indicator "(UTC)"
- **Event Grouping**: Always UTC day boundaries

### Date Range Limits
- **Default**: 30 days
- **Maximum**: 180 days for standard endpoints
- **Retention**: Up to 90 days of cohorts

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

*Last Updated: 2025-02-18*
*Version: 1.0*
