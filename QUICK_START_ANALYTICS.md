# Quick Start: View User Data in Practice

## ✅ What's Already Done

I've set up everything you need to start viewing user data:

1. **Backend analytics system** - All endpoints are live
2. **Stats screen** - Ready to use at `/user-stats`
3. **Profile button** - "Stats" button added to profile page

## 📱 How to View User Data NOW

### Step 1: Access the Stats Screen

**Option A: From Profile Page**
1. Open your app
2. Go to the Profile tab (bottom navigation)
3. Click the **"Stats"** button (gold button next to "Edit Profile")
4. You'll see your personal stats dashboard

**Option B: Direct URL**
- Navigate to `/user-stats` from anywhere in the app

### Step 2: What You'll See

The stats screen shows:
- 🔥 **Current workout streak**
- 💪 **Workout stats** (total workouts, completion rate, workouts per week)
- 📊 **Favorite mood category**
- 📈 **Difficulty breakdown**
- 👥 **Social engagement** (posts, likes, comments, followers)
- 📱 **Activity summary**

You can toggle between **7 days**, **30 days**, or **90 days** views.

---

## 🎯 How to Start Collecting Data

Right now, the stats screen will show **zeros** because no events have been tracked yet. Here's how to start collecting data:

### Option 1: Test with Manual Tracking

Open your browser console and run:

```javascript
// Track a workout completion
fetch('YOUR_API_URL/api/analytics/track', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_type: 'workout_completed',
    metadata: {
      mood_category: 'I want to sweat',
      difficulty: 'Intermediate',
      duration_minutes: 45
    }
  })
});

// Track a post creation
fetch('YOUR_API_URL/api/analytics/track', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_type: 'post_created',
    metadata: {
      has_media: true
    }
  })
});
```

Then refresh the stats screen to see the data!

---

## 🔌 Option 2: Add Tracking to Your App

To automatically track user actions, add tracking calls to your existing code:

### Track Workout Completion

Find where workouts are completed in your app (likely in workout session screens):

```typescript
// Example: In workout-session.tsx or wherever workout completes
const handleWorkoutComplete = async () => {
  // Your existing workout completion logic
  // ...

  // Add tracking
  try {
    await fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'workout_completed',
        metadata: {
          mood_category: selectedMood,
          difficulty: selectedDifficulty,
          duration_minutes: workoutDuration,
          exercises_completed: exercisesList.length
        }
      })
    });
  } catch (error) {
    console.log('Analytics tracking error:', error);
    // Don't block user flow if analytics fails
  }
};
```

### Track Post Creation

In your post creation flow (explore tab):

```typescript
// Example: After creating a post successfully
const handlePostCreated = async (post) => {
  // Your existing post creation logic
  // ...

  // Add tracking
  try {
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
  } catch (error) {
    console.log('Analytics tracking error:', error);
  }
};
```

### Track Likes & Comments

```typescript
// When user likes a post
const handleLike = async (postId) => {
  // Your existing like logic
  // ...

  // Track it
  await fetch(`${API_URL}/api/analytics/track`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'post_liked',
      metadata: { post_id: postId }
    })
  });
};

// When user comments
const handleComment = async (postId, comment) => {
  // Your existing comment logic
  // ...

  // Track it
  await fetch(`${API_URL}/api/analytics/track`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'post_commented',
      metadata: { 
        post_id: postId,
        comment_length: comment.length
      }
    })
  });
};
```

---

## 🔍 View Platform-Wide Analytics (Admin)

To see stats for **all users** (admin view):

```typescript
// Fetch platform analytics
const platformStats = await fetch(
  `${API_URL}/api/analytics/admin/platform-stats?days=30`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
).then(r => r.json());

console.log('Total Users:', platformStats.total_users);
console.log('Daily Active:', platformStats.daily_active_users);
console.log('Retention:', platformStats.retention_rate + '%');
console.log('Total Workouts:', platformStats.total_workouts_completed);
```

---

## 📊 All Available Endpoints

You can call these from your app or test them in Postman/curl:

### User Analytics (Personal)
- `GET /api/analytics/activity-summary?days=30`
- `GET /api/analytics/feature-usage?days=30`
- `GET /api/analytics/workout-stats?days=30`
- `GET /api/analytics/social-stats?days=30`
- `GET /api/analytics/user-journey?limit=100`

### Admin Analytics (Platform-wide)
- `GET /api/analytics/admin/platform-stats?days=30`

### Track Events
- `POST /api/analytics/track` (with event_type and metadata)

---

## 🧪 Testing It Out

### Quick Test Flow:

1. **Track a few test events**:
   - Complete a workout (or fake it with a POST request)
   - Create a post
   - Like some posts
   - Comment on something

2. **View your stats**:
   - Go to Profile → Stats button
   - See your data visualized!

3. **Try different time periods**:
   - Switch between 7, 30, and 90 days
   - Pull to refresh

---

## 📝 Event Types You Can Track

Here's the full list of available event types:

**Workouts:**
- `workout_started`
- `workout_completed`
- `workout_saved`
- `exercise_completed`

**Social:**
- `post_created`
- `post_liked`
- `post_commented`
- `user_followed`
- `user_unfollowed`
- `profile_viewed`

**Navigation:**
- `screen_viewed`
- `tab_switched`
- `search_performed`

**Engagement:**
- `app_opened`
- `app_backgrounded`
- `notification_clicked`

**Features:**
- `equipment_selected`
- `difficulty_selected`
- `mood_selected`
- `filter_applied`

---

## 💡 Pro Tips

1. **Don't block user flow**: Wrap analytics calls in try-catch so errors don't break your app
2. **Track silently**: Analytics should be invisible to users
3. **Add metadata**: Include relevant info in the metadata field for better insights
4. **Start small**: Begin with tracking workouts and posts, then expand
5. **Check the stats screen regularly**: See what data looks good!

---

## 🎨 Customize the Stats Screen

The stats screen is located at:
- `/app/frontend/app/user-stats.tsx`

You can:
- Add more stats cards
- Change colors
- Add charts/graphs
- Customize the layout
- Add export functionality

---

## 🚀 Next Steps

1. **Start tracking** a few key events (workouts, posts)
2. **Test the stats screen** to see data flowing
3. **Add more tracking** as you see what's useful
4. **Build admin dashboard** for platform-wide insights
5. **Use data** to personalize the user experience

---

## 📞 Files Reference

**Backend:**
- `/app/backend/user_analytics.py` - Analytics logic
- `/app/backend/server.py` - API endpoints

**Frontend:**
- `/app/frontend/app/user-stats.tsx` - Stats screen
- `/app/frontend/app/(tabs)/profile.tsx` - Profile with Stats button

**Docs:**
- `/app/USER_ANALYTICS_IMPLEMENTATION.md` - Full technical docs
- `/app/QUICK_START_ANALYTICS.md` - This file

---

**That's it! Your analytics system is live and ready to use.** 🎉

Go to Profile → Stats to see your dashboard, then start adding tracking calls to collect real data!
