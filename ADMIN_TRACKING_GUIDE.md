# Admin Dashboard & Tracking Implementation Guide

## ✅ What's Ready

1. **Admin Dashboard** - `/app/frontend/app/admin-dashboard.tsx`
2. **Tracking Utility** - `/app/frontend/utils/analytics.ts`
3. **Backend APIs** - All endpoints live and running

---

## 🎯 How to Access Admin Dashboard

### Option 1: Navigate Directly
```typescript
router.push('/admin-dashboard');
```

### Option 2: Add to Profile Menu (Recommended)
Add an admin button to your profile page for easy access.

---

## 📊 What the Admin Dashboard Shows

**Real-time Platform Metrics:**
- 👥 **Total Users** - All registered users
- 💚 **Active Users** - Users with activity in selected period
- 📅 **Daily Active Users** - Users active today
- ➕ **New Users** - New sign-ups in period

**Engagement Data:**
- Total workouts completed
- Total posts created
- Retention rate %
- Average workouts per active user

**Popular Moods Chart:**
- Bar chart showing most popular workout moods
- Detailed ranked list

**Quick Insights:**
- User engagement summary
- Workout activity trends
- Growth metrics

**Time Periods:** Toggle between 7, 30, or 90 days

---

## 🔌 How to Add Tracking Calls

I've created a super simple utility that makes tracking one line of code!

### Step 1: Import the Analytics Utility

```typescript
import { Analytics } from '../utils/analytics';
import { useAuth } from '../contexts/AuthContext';
```

### Step 2: Add Tracking Calls

Here are the **exact files** and **exact locations** to add tracking:

---

## 📍 EXACT FILE LOCATIONS FOR TRACKING

### 1. **Track Workout Completion**

**File:** `/app/frontend/app/workout-session.tsx` (or wherever workouts complete)

**Where to add:** After the workout is successfully completed

```typescript
// Example location: in the handleCompleteWorkout function
const handleCompleteWorkout = async () => {
  const { token } = useAuth();
  
  // Your existing workout completion logic
  // ...
  
  // ADD THIS: Track workout completion
  await Analytics.workoutCompleted(token, {
    mood_category: selectedMood,
    difficulty: selectedDifficulty,
    duration_minutes: workoutDuration,
    exercises_completed: exercises.length
  });
};
```

---

### 2. **Track Post Creation**

**File:** `/app/frontend/app/(tabs)/explore.tsx`

**Where to add:** In the `createPost` function after successful post creation

```typescript
// Around line 140-180 where posts are created
const createPost = async () => {
  const { token } = useAuth();
  
  // Your existing post creation logic
  const response = await fetch(`${API_URL}/api/posts`, {
    // ... existing code
  });
  
  if (response.ok) {
    const newPost = await response.json();
    
    // ADD THIS: Track post creation
    await Analytics.postCreated(token, {
      has_media: mediaUris.length > 0,
      media_count: mediaUris.length,
      caption_length: caption.length
    });
  }
};
```

---

### 3. **Track Likes**

**File:** `/app/frontend/app/(tabs)/explore.tsx`

**Where to add:** In the `handleLike` function

```typescript
// Around line 200-250 where likes are handled
const handleLike = async (postId: string) => {
  const { token } = useAuth();
  
  // Your existing like logic
  await fetch(`${API_URL}/api/posts/${postId}/like`, {
    // ... existing code
  });
  
  // ADD THIS: Track like
  await Analytics.postLiked(token, {
    post_id: postId
  });
};
```

---

### 4. **Track Comments**

**File:** `/app/frontend/components/CommentsBottomSheet.tsx`

**Where to add:** After comment is successfully posted

```typescript
// In the handleSubmitComment function
const handleSubmitComment = async () => {
  const { token } = useAuth();
  
  // Your existing comment logic
  const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
    // ... existing code
  });
  
  if (response.ok) {
    // ADD THIS: Track comment
    await Analytics.postCommented(token, {
      post_id: postId,
      comment_length: newComment.length
    });
  }
};
```

---

### 5. **Track Follows/Unfollows**

**File:** `/app/frontend/app/(tabs)/explore.tsx` or wherever follow buttons are

**Where to add:** In follow/unfollow handlers

```typescript
const handleFollow = async (userId: string) => {
  const { token } = useAuth();
  
  // Your existing follow logic
  await fetch(`${API_URL}/api/users/${userId}/follow`, {
    // ... existing code
  });
  
  // ADD THIS: Track follow
  await Analytics.userFollowed(token, {
    followed_user_id: userId
  });
};
```

---

### 6. **Track Equipment Selection**

**File:** All equipment selection files:
- `/app/frontend/app/cardio-equipment.tsx`
- `/app/frontend/app/chest-equipment.tsx`
- `/app/frontend/app/*-equipment.tsx` (all equipment files)

**Where to add:** When equipment is selected

```typescript
const handleEquipmentSelect = (equipment: Equipment) => {
  const { token } = useAuth();
  
  // Your existing selection logic
  setSelectedEquipment(equipment);
  
  // ADD THIS: Track equipment selection
  Analytics.equipmentSelected(token, {
    equipment: equipment.name,
    mood_category: currentMood
  });
};
```

---

### 7. **Track Mood Selection**

**File:** `/app/frontend/app/(tabs)/index.tsx` (home screen with mood cards)

**Where to add:** When user clicks a mood card

```typescript
const handleMoodSelect = (mood: string) => {
  const { token } = useAuth();
  
  // ADD THIS: Track mood selection
  Analytics.moodSelected(token, {
    mood_category: mood
  });
  
  // Your existing navigation logic
  router.push(`/mood-path/${mood}`);
};
```

---

### 8. **Track Difficulty Selection**

**File:** Equipment files (where difficulty is selected)

**Where to add:** When difficulty is chosen

```typescript
const handleDifficultySelect = (difficulty: string) => {
  const { token } = useAuth();
  
  setSelectedDifficulty(difficulty);
  
  // ADD THIS: Track difficulty selection
  Analytics.difficultySelected(token, {
    difficulty: difficulty,
    mood_category: currentMood
  });
};
```

---

### 9. **Track Profile Views**

**File:** `/app/frontend/app/(tabs)/user-profile.tsx`

**Where to add:** When profile loads (useEffect)

```typescript
useEffect(() => {
  const { token, user } = useAuth();
  
  if (userId && userId !== user?.id) {
    // User is viewing someone else's profile
    Analytics.profileViewed(token, {
      viewed_user_id: userId
    });
  }
}, [userId]);
```

---

### 10. **Track Search**

**File:** `/app/frontend/app/(tabs)/explore.tsx`

**Where to add:** In the search function after results are fetched

```typescript
const searchUsers = async (query: string) => {
  const { token } = useAuth();
  
  // Your existing search logic
  const results = await fetch(`${API_URL}/api/users/search/query?q=${query}`, {
    // ... existing code
  }).then(r => r.json());
  
  // ADD THIS: Track search
  Analytics.searchPerformed(token, {
    search_query: query,
    results_count: results.length
  });
};
```

---

## 🎯 Quick Start: Track 3 Key Events

**Start with these 3 for immediate value:**

1. **Workout Completions** - Gives you workout activity
2. **Post Creations** - Shows social engagement
3. **Mood Selections** - Tells you what users want

Once these are working, add the rest!

---

## 📋 Complete Tracking Checklist

Copy this and check off as you implement:

```
Workouts:
- [ ] workout_started
- [ ] workout_completed
- [ ] workout_saved
- [ ] exercise_completed

Social:
- [ ] post_created
- [ ] post_liked
- [ ] post_commented
- [ ] user_followed
- [ ] user_unfollowed
- [ ] profile_viewed

Navigation:
- [ ] screen_viewed
- [ ] tab_switched
- [ ] search_performed

Engagement:
- [ ] app_opened
- [ ] app_backgrounded

Features:
- [ ] equipment_selected
- [ ] difficulty_selected
- [ ] mood_selected
```

---

## 🧪 Testing Your Tracking

### 1. Add tracking to one event (e.g., post creation)
### 2. Perform the action in your app
### 3. Go to admin dashboard
### 4. Verify the numbers increase!

### Debug with console:
```typescript
// Add this temporarily to see if tracking is called
await Analytics.postCreated(token, { has_media: true });
console.log('✅ Tracked post creation');
```

---

## 🎨 Customize Admin Dashboard

The admin dashboard is at `/app/frontend/app/admin-dashboard.tsx`

**You can:**
- Add more charts
- Change time periods
- Add user lists
- Export data
- Add filters
- Show trending data
- Add real-time updates

---

## 📊 Example: Complete Tracking Implementation

Here's a complete example for post creation:

```typescript
// File: /app/frontend/app/(tabs)/explore.tsx

import { Analytics } from '../../utils/analytics';
import { useAuth } from '../../contexts/AuthContext';

const ExploreScreen = () => {
  const { token } = useAuth();

  const createPost = async () => {
    try {
      // 1. Create the post
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caption: caption,
          media_urls: uploadedMediaUrls
        })
      });

      if (response.ok) {
        const newPost = await response.json();
        
        // 2. Track the event (non-blocking)
        Analytics.postCreated(token, {
          has_media: uploadedMediaUrls.length > 0,
          media_count: uploadedMediaUrls.length,
          caption_length: caption.length
        });

        // 3. Continue with your UI updates
        setCaption('');
        setMediaUris([]);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    // Your UI
  );
};
```

---

## 🚀 What Happens After You Add Tracking

1. **Data flows into database** automatically
2. **Daily summaries** are calculated
3. **Admin dashboard** shows real-time metrics
4. **You can make data-driven decisions!**

**Within 24 hours of tracking:**
- See which moods are most popular
- Understand user engagement
- Identify drop-off points
- Track growth metrics

---

## 💡 Pro Tips

1. **Wrap in try-catch**: Analytics should never break your app
2. **Track silently**: Users shouldn't notice
3. **Rich metadata**: More data = better insights
4. **Start simple**: 3-5 key events, then expand
5. **Check dashboard daily**: Watch your metrics grow!

---

## 🔐 Admin Access Control (Future)

Right now, any authenticated user can access `/admin-dashboard`.

**To restrict to admins only:**

1. Add `is_admin` field to user model
2. Check in dashboard:
```typescript
useEffect(() => {
  if (!user?.is_admin) {
    router.back(); // Redirect non-admins
  }
}, [user]);
```

---

## 📞 Files Summary

**Created:**
- `/app/frontend/app/admin-dashboard.tsx` - Admin UI
- `/app/frontend/utils/analytics.ts` - Tracking utility

**Where to edit:**
- `/app/frontend/app/(tabs)/explore.tsx` - Posts, likes, comments, search
- `/app/frontend/app/workout-session.tsx` - Workout completion
- `/app/frontend/app/*-equipment.tsx` - Equipment/difficulty selection
- `/app/frontend/app/(tabs)/index.tsx` - Mood selection
- `/app/frontend/components/CommentsBottomSheet.tsx` - Comments

**Backend (already done):**
- `/app/backend/user_analytics.py` - Analytics logic
- `/app/backend/server.py` - API endpoints

---

## 🎉 You're All Set!

1. **View admin dashboard**: Navigate to `/admin-dashboard`
2. **Add tracking calls**: Use the examples above
3. **Watch data flow**: Check the dashboard regularly
4. **Make decisions**: Use insights to improve your app!

Start with tracking workout completions and post creations - you'll see results immediately!
