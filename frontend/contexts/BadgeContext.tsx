import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

/**
 * SERVER-AUTHORITATIVE BADGE CONTEXT
 * 
 * RULES:
 * 1. Badge count ONLY comes from GET /api/notifications/unread-count
 * 2. No local increment/decrement logic
 * 3. No derived counts from arrays
 * 4. markAllRead() calls server, then fetches fresh count
 */

interface BadgeContextType {
  unreadNotifications: number;
  unreadMessages: number;
  totalBadgeCount: number;
  isFetching: boolean;
  fetchUnreadCount: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  refreshBadges: () => Promise<void>;
}

const BadgeContext = createContext<BadgeContextType>({
  unreadNotifications: 0,
  unreadMessages: 0,
  totalBadgeCount: 0,
  isFetching: false,
  fetchUnreadCount: async () => {},
  markAllNotificationsRead: async () => {},
  refreshBadges: async () => {},
});

export const useBadges = () => useContext(BadgeContext);

interface BadgeProviderProps {
  children: React.ReactNode;
  token: string | null;
  isGuest: boolean;
}

export function BadgeProvider({ children, token, isGuest }: BadgeProviderProps) {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  
  // Prevent duplicate fetches
  const fetchingRef = useRef(false);
  // Track if we've done initial fetch for this token
  const initializedRef = useRef(false);
  // Store token to detect changes
  const tokenRef = useRef<string | null>(null);

  /**
   * AUTHORITATIVE: Fetch unread notification count from server
   * This is the ONLY way to set unreadNotifications
   */
  const fetchUnreadNotificationCount = useCallback(async () => {
    if (!token || isGuest) {
      setUnreadNotifications(0);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const count = data.unread_count || 0;
        console.log(`🔔 Server unread count: ${count}`);
        setUnreadNotifications(count);
      }
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
    }
  }, [token, isGuest]);

  /**
   * Fetch unread message count from server
   */
  const fetchUnreadMessageCount = useCallback(async () => {
    if (!token || isGuest) {
      setUnreadMessages(0);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/conversations/unread-count`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadMessages(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread message count:', error);
    }
  }, [token, isGuest]);

  /**
   * Fetch all badge counts from server
   */
  const fetchUnreadCount = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setIsFetching(true);
    
    try {
      await Promise.all([
        fetchUnreadNotificationCount(),
        fetchUnreadMessageCount()
      ]);
    } finally {
      fetchingRef.current = false;
      setIsFetching(false);
    }
  }, [fetchUnreadNotificationCount, fetchUnreadMessageCount]);

  /**
   * Mark all notifications as read on server, then fetch fresh count
   * This is the ONLY way to clear the notification badge
   */
  const markAllNotificationsRead = useCallback(async () => {
    if (!token || isGuest) return;
    
    try {
      console.log('🔔 Marking all notifications as read on server...');
      
      const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        console.log('🔔 Server confirmed all notifications read');
        // Immediately set to 0 (server confirmed)
        setUnreadNotifications(0);
        // Also fetch fresh count to be absolutely sure
        await fetchUnreadNotificationCount();
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      // On error, still fetch fresh count from server
      await fetchUnreadNotificationCount();
    }
  }, [token, isGuest, fetchUnreadNotificationCount]);

  /**
   * Refresh all badges - calls server for authoritative counts
   */
  const refreshBadges = useCallback(async () => {
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Initialize on token change
  useEffect(() => {
    // Detect token change
    if (token !== tokenRef.current) {
      tokenRef.current = token;
      initializedRef.current = false;
    }
    
    if (token && !isGuest && !initializedRef.current) {
      initializedRef.current = true;
      fetchUnreadCount();
    } else if (!token || isGuest) {
      setUnreadNotifications(0);
      setUnreadMessages(0);
    }
  }, [token, isGuest, fetchUnreadCount]);

  // Periodic refresh every 2 minutes
  useEffect(() => {
    if (!token || isGuest) return;
    
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 120000);
    
    return () => clearInterval(interval);
  }, [token, isGuest, fetchUnreadCount]);

  // Calculate total badge count
  const totalBadgeCount = unreadNotifications + unreadMessages;

  const value: BadgeContextType = {
    unreadNotifications,
    unreadMessages,
    totalBadgeCount,
    isFetching,
    fetchUnreadCount,
    markAllNotificationsRead,
    refreshBadges,
  };

  return (
    <BadgeContext.Provider value={value}>
      {children}
    </BadgeContext.Provider>
  );
}

export { BadgeContext };
