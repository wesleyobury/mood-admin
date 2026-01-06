/**
 * Analytics Tracking Utility
 * 
 * Makes it super easy to track user events throughout the app
 */

import Constants from 'expo-constants';

// Prioritize process.env for development/preview environments
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

/**
 * Track any user event with metadata
 */
export const trackEvent = async (
  token: string,
  eventType: string,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: eventType,
        metadata: metadata || {}
      })
    });
    
    if (!response.ok) {
      console.log(`Analytics tracking failed for ${eventType}:`, response.status);
    }
  } catch (error) {
    // Silently fail - don't block user flow
    console.log('Analytics tracking error:', error);
  }
};

// Pre-built tracking functions for common events

export const Analytics = {
  // Workout Events
  workoutStarted: (token: string, metadata: {
    mood_category?: string;
    difficulty?: string;
    equipment?: string;
  }) => trackEvent(token, 'workout_started', metadata),

  workoutCompleted: (token: string, metadata: {
    mood_category?: string;
    difficulty?: string;
    equipment?: string;
    duration_minutes?: number;
    exercises_completed?: number;
  }) => trackEvent(token, 'workout_completed', metadata),

  workoutSkipped: (token: string, metadata: {
    workout_name?: string;
    workout_index?: number;
    total_exercises?: number;
  }) => trackEvent(token, 'workout_skipped', metadata),

  workoutAbandoned: (token: string, metadata: {
    workout_name?: string;
    progress_percentage?: number;
    exercises_completed?: number;
    total_exercises?: number;
  }) => trackEvent(token, 'workout_abandoned', metadata),

  workoutSaved: (token: string, metadata: {
    workout_id?: string;
    mood_category?: string;
  }) => trackEvent(token, 'workout_saved', metadata),

  exerciseCompleted: (token: string, metadata: {
    exercise_name?: string;
    sets?: number;
    reps?: number;
  }) => trackEvent(token, 'exercise_completed', metadata),

  // Social Events
  postCreated: (token: string, metadata: {
    has_media?: boolean;
    media_count?: number;
    caption_length?: number;
  }) => trackEvent(token, 'post_created', metadata),

  postLiked: (token: string, metadata: {
    post_id: string;
    author_id?: string;
  }) => trackEvent(token, 'post_liked', metadata),

  postCommented: (token: string, metadata: {
    post_id: string;
    comment_length?: number;
  }) => trackEvent(token, 'post_commented', metadata),

  userFollowed: (token: string, metadata: {
    followed_user_id: string;
  }) => trackEvent(token, 'user_followed', metadata),

  userUnfollowed: (token: string, metadata: {
    unfollowed_user_id: string;
  }) => trackEvent(token, 'user_unfollowed', metadata),

  profileViewed: (token: string, metadata: {
    viewed_user_id: string;
  }) => trackEvent(token, 'profile_viewed', metadata),

  // Navigation Events
  screenViewed: (token: string, metadata: {
    screen_name: string;
    previous_screen?: string;
  }) => trackEvent(token, 'screen_viewed', metadata),

  tabSwitched: (token: string, metadata: {
    from_tab: string;
    to_tab: string;
  }) => trackEvent(token, 'tab_switched', metadata),

  searchPerformed: (token: string, metadata: {
    search_query: string;
    results_count?: number;
  }) => trackEvent(token, 'search_performed', metadata),

  // Engagement Events
  appOpened: (token: string) => trackEvent(token, 'app_opened'),

  appBackgrounded: (token: string) => trackEvent(token, 'app_backgrounded'),

  notificationClicked: (token: string, metadata: {
    notification_type?: string;
  }) => trackEvent(token, 'notification_clicked', metadata),

  // Feature Usage
  equipmentSelected: (token: string, metadata: {
    equipment: string;
    mood_category?: string;
  }) => trackEvent(token, 'equipment_selected', metadata),

  difficultySelected: (token: string, metadata: {
    difficulty: string;
    mood_category?: string;
  }) => trackEvent(token, 'difficulty_selected', metadata),

  moodSelected: (token: string, metadata: {
    mood_category: string;
  }) => trackEvent(token, 'mood_selected', metadata),

  filterApplied: (token: string, metadata: {
    filter_type: string;
    filter_value: string;
  }) => trackEvent(token, 'filter_applied', metadata),

  // Featured Workout Events
  featuredWorkoutClicked: (token: string, metadata: {
    workout_id: string;
    workout_title: string;
    mood_category: string;
  }) => trackEvent(token, 'featured_workout_clicked', metadata),

  featuredWorkoutStarted: (token: string, metadata: {
    workout_id: string;
    workout_title: string;
    mood_category: string;
    exercise_count: number;
  }) => trackEvent(token, 'featured_workout_started', metadata),

  featuredWorkoutCompleted: (token: string, metadata: {
    workout_id: string;
    workout_title: string;
    mood_category: string;
    exercises_completed: number;
    duration_minutes?: number;
  }) => trackEvent(token, 'featured_workout_completed', metadata),

  // Workout Funnel Events
  workoutFunnelStep: (token: string, metadata: {
    step: string;
    mood_category?: string;
    equipment?: string;
    difficulty?: string;
  }) => trackEvent(token, 'workout_funnel_step', metadata),

  workoutAddedToCart: (token: string, metadata: {
    workout_name: string;
    mood_category?: string;
    equipment?: string;
  }) => trackEvent(token, 'workout_added_to_cart', metadata),

  workoutRemovedFromCart: (token: string, metadata: {
    workout_name: string;
  }) => trackEvent(token, 'workout_removed_from_cart', metadata),

  cartViewed: (token: string, metadata: {
    item_count: number;
  }) => trackEvent(token, 'cart_viewed', metadata),

  // Screen Time Tracking
  screenTimeSpent: (token: string, metadata: {
    screen_name: string;
    duration_seconds: number;
    duration_minutes?: number;
  }) => trackEvent(token, 'screen_time_spent', {
    ...metadata,
    duration_minutes: metadata.duration_minutes || Math.round(metadata.duration_seconds / 60 * 100) / 100
  }),

  screenEntered: (token: string, metadata: {
    screen_name: string;
  }) => trackEvent(token, 'screen_entered', metadata),

  screenExited: (token: string, metadata: {
    screen_name: string;
    duration_seconds: number;
  }) => trackEvent(token, 'screen_exited', metadata),
};

// Screen Time Tracker Hook Helper
export class ScreenTimeTracker {
  private screenName: string;
  private startTime: number;
  private token: string | null;

  constructor(screenName: string, token: string | null) {
    this.screenName = screenName;
    this.startTime = Date.now();
    this.token = token;
    
    // Track screen entered
    if (token) {
      Analytics.screenEntered(token, { screen_name: screenName });
    }
  }

  stop(): number {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    
    if (this.token && duration > 0) {
      Analytics.screenTimeSpent(this.token, {
        screen_name: this.screenName,
        duration_seconds: duration,
      });
    }
    
    return duration;
  }

  reset(): void {
    this.startTime = Date.now();
  }
}
