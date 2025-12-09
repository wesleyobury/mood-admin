# User Analytics & Tracking System

## Overview
Comprehensive user behavior tracking and analytics system that monitors app usage, engagement metrics, and provides actionable insights about user behavior.

## What Gets Tracked

### 1. User Events (All Activity)
Every user action in the app can be tracked with detailed metadata:

**Workout Events:**
- `workout_started` - User begins a workout
- `workout_completed` - User finishes a workout
- `workout_saved` - User saves a workout for later
- `exercise_completed` - Individual exercise completion

**Social Events:**
- `post_created` - User creates a post
- `post_liked` - User likes a post
- `post_commented` - User comments on a post
- `user_followed` - User follows another user
- `user_unfollowed` - User unfollows someone
- `profile_viewed` - User views a profile

**Navigation Events:**
- `screen_viewed` - Screen navigation tracking
- `tab_switched` - Tab changes in bottom navigation
- `search_performed` - Search queries

**Engagement Events:**
- `app_opened` - App launch
- `app_backgrounded` - App sent to background
- `notification_clicked` - Notification interactions

**Feature Usage:**
- `equipment_selected` - Equipment selection
- `difficulty_selected` - Difficulty level chosen
- `mood_selected` - Mood category selection
- `filter_applied` - Filter usage

### 2. Daily Activity Summaries
Automatic daily rollup of user activity:
- Total events count
- Workouts completed
- Posts created
- Comments made
- Likes given
- Profiles viewed
- Time spent (when tracked)

### 3. Calculated Metrics
- **Workout Streak** - Consecutive days with workouts
- **Completion Rate** - Workouts completed vs started
- **Engagement Score** - Posts + likes + comments
- **Retention Rate** - Active users vs total users
- **Feature Adoption** - Most/least used features

## API Endpoints

### 1. Track Event
```http
POST /api/analytics/track
Authorization: Bearer {token}
Content-Type: application/json

{
  "event_type": "workout_completed",
  "metadata": {
    "mood_category": "I want to sweat",
    "difficulty": "Intermediate",
    "duration_minutes": 45,
    "exercises_completed": 12
  }
}
```

**Response:**
```json
{
  "message": "Event tracked successfully"
}
```

### 2. Get Activity Summary
```http
GET /api/analytics/activity-summary?days=30
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user_id": "user_abc123",
  "period_days": 30,
  "total_workouts": 18,
  "total_posts": 5,
  "total_comments": 12,
  "total_likes": 45,
  "total_events": 234,
  "current_streak": 7,
  "daily_breakdown": [
    {
      "date": "2025-06-15T00:00:00Z",
      "workouts": 1,
      "posts": 0,
      "events": 15
    }
  ]
}
```

### 3. Get Feature Usage Stats
```http
GET /api/analytics/feature-usage?days=30
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user_id": "user_abc123",
  "period_days": 30,
  "by_category": {
    "workout": 120,
    "social": 85,
    "navigation": 200,
    "feature": 45
  },
  "top_features": [
    {
      "feature": "equipment_selected",
      "usage_count": 25
    },
    {
      "feature": "mood_selected",
      "usage_count": 18
    }
  ]
}
```

### 4. Get Workout Analytics
```http
GET /api/analytics/workout-stats?days=30
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user_id": "user_abc123",
  "period_days": 30,
  "total_workouts_completed": 18,
  "total_workouts_started": 20,
  "completion_rate": 90.0,
  "workouts_by_mood": {
    "I want to sweat": 8,
    "I want to gain muscle": 6,
    "I'm feeling lazy": 4
  },
  "workouts_by_difficulty": {
    "Beginner": 3,
    "Intermediate": 10,
    "Advanced": 5
  },
  "average_workouts_per_week": 6.2
}
```

### 5. Get Social Engagement Stats
```http
GET /api/analytics/social-stats?days=30
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user_id": "user_abc123",
  "period_days": 30,
  "posts_created": 5,
  "likes_given": 45,
  "comments_made": 12,
  "follows": 8,
  "unfollows": 2,
  "net_follows": 6,
  "current_followers": 124,
  "current_following": 89,
  "engagement_score": 62
}
```

### 6. Get User Journey
```http
GET /api/analytics/user-journey?limit=100
Authorization: Bearer {token}
```

**Response:**
```json
{
  "journey": [
    {
      "event_type": "workout_completed",
      "category": "workout",
      "timestamp": "2025-06-15T14:30:00Z",
      "metadata": {
        "mood_category": "I want to sweat"
      }
    },
    {
      "event_type": "post_created",
      "category": "social",
      "timestamp": "2025-06-15T14:45:00Z",
      "metadata": {}
    }
  ],
  "total": 100
}
```

### 7. Get Platform Analytics (Admin)
```http
GET /api/analytics/admin/platform-stats?days=30
Authorization: Bearer {token}
```

**Response:**
```json
{
  "period_days": 30,
  "total_users": 5420,
  "active_users": 2840,
  "daily_active_users": 892,
  "new_users": 340,
  "total_workouts_completed": 12450,
  "total_posts_created": 1820,
  "retention_rate": 52.4,
  "average_workouts_per_active_user": 4.38,
  "popular_mood_categories": [
    {
      "mood": "I want to sweat",
      "count": 4500
    },
    {
      "mood": "I want to gain muscle",
      "count": 3800
    }
  ]
}
```

## Database Structure

### Collections

#### `user_events`
Stores all individual user events:
```javascript
{
  "_id": ObjectId,
  "user_id": "user_abc123",
  "event_type": "workout_completed",
  "event_category": "workout",
  "metadata": {
    "mood_category": "I want to sweat",
    "difficulty": "Intermediate",
    "duration_minutes": 45
  },
  "timestamp": ISODate("2025-06-15T14:30:00Z"),
  "session_id": "session_xyz"
}
```

#### `daily_activity`
Daily summary aggregations:
```javascript
{
  "_id": ObjectId,
  "user_id": "user_abc123",
  "date": ISODate("2025-06-15T00:00:00Z"),
  "events_count": 25,
  "workouts_completed": 1,
  "posts_created": 2,
  "comments_made": 3,
  "likes_given": 8,
  "profiles_viewed": 5,
  "time_spent_minutes": 45,
  "created_at": ISODate("2025-06-15T14:30:00Z")
}
```

## Implementation in Your App

### Frontend Tracking Examples

#### Track Workout Completion
```typescript
// In workout completion screen
const trackWorkoutCompletion = async (workoutData) => {
  await fetch(`${API_URL}/api/analytics/track`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'workout_completed',
      metadata: {
        mood_category: workoutData.mood,
        difficulty: workoutData.difficulty,
        duration_minutes: workoutData.duration,
        exercises_completed: workoutData.exercises.length
      }
    })
  });
};
```

#### Track Post Creation
```typescript
// After creating a post
await fetch(`${API_URL}/api/analytics/track`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_type: 'post_created',
    metadata: {
      has_media: post.media_urls.length > 0,
      media_count: post.media_urls.length
    }
  })
});
```

#### Track Screen Views
```typescript
// In navigation listener
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'screen_viewed',
        metadata: {
          screen_name: route.name
        }
      })
    });
  });

  return unsubscribe;
}, [navigation]);
```

## Building Analytics Dashboards

### User Profile Stats Screen
Create a screen showing user their own stats:
```typescript
const UserStatsScreen = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const [activity, workouts, social] = await Promise.all([
        fetch(`${API_URL}/api/analytics/activity-summary?days=30`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/workout-stats?days=30`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/social-stats?days=30`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json())
      ]);

      setStats({ activity, workouts, social });
    };

    fetchStats();
  }, []);

  return (
    <View>
      <Text>🔥 Current Streak: {stats?.activity?.current_streak} days</Text>
      <Text>💪 Workouts: {stats?.workouts?.total_workouts_completed}</Text>
      <Text>📝 Posts: {stats?.social?.posts_created}</Text>
      <Text>❤️ Likes Given: {stats?.social?.likes_given}</Text>
    </View>
  );
};
```

### Admin Analytics Dashboard
```typescript
const AdminDashboard = () => {
  const [platformStats, setPlatformStats] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/analytics/admin/platform-stats?days=30`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(setPlatformStats);
  }, []);

  return (
    <View>
      <Text>Total Users: {platformStats?.total_users}</Text>
      <Text>Daily Active: {platformStats?.daily_active_users}</Text>
      <Text>Retention: {platformStats?.retention_rate}%</Text>
      <Text>Total Workouts: {platformStats?.total_workouts_completed}</Text>
    </View>
  );
};
```

## Use Cases

### 1. Personalization
- Recommend workouts based on most used mood categories
- Suggest difficulty levels based on completion rates
- Highlight underused features

### 2. Gamification
- Display workout streaks prominently
- Award badges for milestones (10 workouts, 30-day streak, etc.)
- Leaderboards for most active users

### 3. Retention & Engagement
- Identify users at risk of churning (low activity)
- Send re-engagement notifications
- A/B test feature changes and measure impact

### 4. Product Development
- Identify most/least used features
- Understand user journey patterns
- Make data-driven decisions on what to build next

### 5. Business Intelligence
- Track growth metrics (DAU, MAU, retention)
- Measure feature adoption
- Calculate user lifetime value indicators

## MongoDB Indexes (Recommended)

For optimal query performance:

```javascript
// user_events collection
db.user_events.createIndex({ "user_id": 1, "timestamp": -1 })
db.user_events.createIndex({ "event_type": 1, "timestamp": -1 })
db.user_events.createIndex({ "event_category": 1 })
db.user_events.createIndex({ "timestamp": -1 })

// daily_activity collection
db.daily_activity.createIndex({ "user_id": 1, "date": -1 })
db.daily_activity.createIndex({ "date": -1 })
```

## Privacy & Compliance

**Important Considerations:**
1. Inform users about data collection in privacy policy
2. Allow users to opt-out of analytics tracking
3. Don't track sensitive personal information without consent
4. Implement data retention policies (e.g., delete events after 90 days)
5. GDPR compliance: Allow users to export/delete their data

## Next Steps

### Immediate Actions:
1. **Start tracking key events** in the app (workout completion, posts, etc.)
2. **Build a user stats screen** showing streaks and achievements
3. **Monitor platform analytics** to understand user behavior

### Future Enhancements:
1. **Real-time dashboards** using WebSocket for live updates
2. **Cohort analysis** - Track user groups over time
3. **Funnel analysis** - Understand conversion paths
4. **Predictive analytics** - ML models for churn prediction
5. **Export functionality** - Allow users to download their data
6. **A/B testing framework** - Test feature variations
7. **Custom event builder** - Allow defining custom events without code changes

## Example Insights You Can Get

With this system, you can answer questions like:
- "What % of users complete their first workout?"
- "Which mood category is most popular?"
- "What's the average workout streak?"
- "How many daily active users do we have?"
- "What features do power users use most?"
- "When do users typically churn?"
- "What's the best day of week for engagement?"

## Testing the System

### Track a test event:
```bash
curl -X POST http://localhost:8001/api/analytics/track \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "workout_completed",
    "metadata": {
      "mood_category": "I want to sweat",
      "difficulty": "Intermediate"
    }
  }'
```

### Get your stats:
```bash
curl -X GET "http://localhost:8001/api/analytics/activity-summary?days=7" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Files Created

- `/app/backend/user_analytics.py` - Core analytics module (600+ lines)
- `/app/backend/server.py` - Updated with analytics endpoints
- `/app/USER_ANALYTICS_IMPLEMENTATION.md` - This documentation

## Summary

You now have a **production-ready analytics system** that:
✅ Tracks all user activity and behavior
✅ Provides actionable insights via API endpoints  
✅ Calculates engagement metrics automatically
✅ Supports both user and admin analytics views
✅ Enables data-driven product decisions
✅ Ready to power personalization and gamification features

Start tracking events in your app to begin collecting data!
