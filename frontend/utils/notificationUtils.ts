/**
 * Notification utilities for consistent behavior across the app
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const NOTIFICATION_SESSION_KEY = '@mood_notification_session';
export const LAST_NOTIFICATION_VIEW_KEY = '@mood_last_notification_view';

/**
 * Format time ago for notifications with user-friendly granularity
 * - Within 10 minutes: exact minutes (e.g., "3m ago")
 * - Within 30 minutes: increments of 10 (e.g., "10m ago", "20m ago")
 * - Within 1 day: in hours (e.g., "2h ago")
 * - Within 7 days: in days (e.g., "3d ago")
 * - Beyond: date format
 */
export const formatNotificationTime = (dateString: string): string => {
  try {
    if (!dateString) {
      return 'recently';
    }
    
    // Parse the ISO date string - handle both with and without timezone
    let date: Date;
    
    // If the string doesn't end with Z or +/- timezone, assume UTC
    if (dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
      date = new Date(dateString);
    } else {
      // Append Z to treat as UTC if no timezone specified
      date = new Date(dateString + 'Z');
    }
    
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return 'recently';
    }
    
    const diffMs = now.getTime() - date.getTime();
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    
    // Handle future dates (clock sync issues) - allow up to 2 min drift
    if (seconds < -120) {
      // Significantly in the future - show actual time
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit'
      });
    }
    
    // Handle slight clock drift - treat as "just now"
    if (seconds < 60) {
      return 'just now';
    }
    
    // Within 10 minutes - show exact minutes
    if (minutes < 10) {
      return `${minutes}m ago`;
    }
    
    // Within 30 minutes - show in increments of 5
    if (minutes < 30) {
      const rounded = Math.floor(minutes / 5) * 5;
      return `${rounded}m ago`;
    }
    
    // Within 1 hour - show in increments of 15
    if (minutes < 60) {
      const rounded = Math.floor(minutes / 15) * 15;
      return `${rounded}m ago`;
    }
    
    // Within 24 hours - show hours
    if (hours < 24) {
      return hours === 1 ? '1h ago' : `${hours}h ago`;
    }
    
    // Within 7 days - show days
    if (days < 7) {
      return days === 1 ? '1d ago' : `${days}d ago`;
    }
    
    // Within 4 weeks - show weeks
    if (weeks < 4) {
      return weeks === 1 ? '1w ago' : `${weeks}w ago`;
    }
    
    // Beyond - show date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'recently';
  }
};

/**
 * Get session ID - creates new one if none exists
 * Session resets when app is freshly opened
 */
export const getSessionId = async (): Promise<string> => {
  try {
    let sessionId = await AsyncStorage.getItem(NOTIFICATION_SESSION_KEY);
    if (!sessionId) {
      sessionId = Date.now().toString();
      await AsyncStorage.setItem(NOTIFICATION_SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch (error) {
    return Date.now().toString();
  }
};

/**
 * Reset session - call this when user logs in or app freshly opens
 */
export const resetNotificationSession = async (): Promise<void> => {
  try {
    const newSessionId = Date.now().toString();
    await AsyncStorage.setItem(NOTIFICATION_SESSION_KEY, newSessionId);
    // Also reset the last viewed time
    await AsyncStorage.removeItem(LAST_NOTIFICATION_VIEW_KEY);
  } catch (error) {
    console.error('Error resetting notification session:', error);
  }
};

/**
 * Mark notifications as viewed for this session
 */
export const markNotificationsViewed = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_NOTIFICATION_VIEW_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error marking notifications viewed:', error);
  }
};

/**
 * Get last notification view time
 */
export const getLastNotificationViewTime = async (): Promise<number | null> => {
  try {
    const lastViewed = await AsyncStorage.getItem(LAST_NOTIFICATION_VIEW_KEY);
    return lastViewed ? parseInt(lastViewed, 10) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Calculate unread notification count
 */
export const calculateUnreadCount = (
  notifications: Array<{ created_at: string }>,
  lastViewedTime: number | null,
  sessionStartTime: number
): number => {
  if (!notifications || notifications.length === 0) return 0;
  
  // Use the later of: session start time or last viewed time
  const cutoffTime = lastViewedTime 
    ? Math.max(lastViewedTime, sessionStartTime)
    : sessionStartTime;
  
  return notifications.filter((n) => {
    const notifTime = new Date(n.created_at).getTime();
    return notifTime > cutoffTime;
  }).length;
};
