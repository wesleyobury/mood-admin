import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
const LAST_NOTIFICATION_VIEW_KEY = 'last_notification_view_ids';
const NOTIFICATION_BASELINE_SET_KEY = 'notification_baseline_set';

interface BadgeContextType {
  unreadNotifications: number;
  unreadMessages: number;
  totalBadgeCount: number;
  setUnreadNotifications: (count: number) => void;
  setUnreadMessages: (count: number) => void;
  refreshBadges: () => void;
  markNotificationsAsRead: () => void;
  markMessagesAsRead: () => void;
  isInitialized: boolean;
}

const BadgeContext = createContext<BadgeContextType>({
  unreadNotifications: 0,
  unreadMessages: 0,
  totalBadgeCount: 0,
  setUnreadNotifications: () => {},
  setUnreadMessages: () => {},
  refreshBadges: () => {},
  markNotificationsAsRead: () => {},
  markMessagesAsRead: () => {},
  isInitialized: false,
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
  const [isInitialized, setIsInitialized] = useState(false);
  const initializingRef = useRef(false);

  // Fetch unread notifications - count those NOT in the seen list
  const fetchUnreadNotifications = useCallback(async () => {
    if (!token || isGuest) {
      setUnreadNotifications(0);
      return;
    }
    
    try {
      // Check if we've ever set a baseline for this user
      const baselineSet = await AsyncStorage.getItem(NOTIFICATION_BASELINE_SET_KEY);
      const seenIdsStr = await AsyncStorage.getItem(LAST_NOTIFICATION_VIEW_KEY);
      
      let seenIds: string[] = [];
      try {
        if (seenIdsStr) {
          const parsed = JSON.parse(seenIdsStr);
          if (Array.isArray(parsed)) {
            seenIds = parsed;
          }
        }
      } catch {
        seenIds = [];
      }
      
      // Fetch all notifications from server
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const allNotifications = data.notifications || [];
        
        // FIRST TIME EVER using the app - baseline has never been set
        // Only do this ONCE per user (tracked by NOTIFICATION_BASELINE_SET_KEY)
        if (!baselineSet && allNotifications.length > 0) {
          console.log('🔔 First time setup: setting notification baseline');
          const notificationIds = allNotifications.map((n: any) => n.id);
          await AsyncStorage.setItem(LAST_NOTIFICATION_VIEW_KEY, JSON.stringify(notificationIds));
          await AsyncStorage.setItem(NOTIFICATION_BASELINE_SET_KEY, 'true');
          setUnreadNotifications(0);
          return;
        }
        
        // Count notifications that are NOT in the seen list (new notifications)
        const unseenNotifications = allNotifications.filter(
          (n: any) => !seenIds.includes(n.id)
        );
        
        // Log for debugging
        console.log(`🔔 Badge: ${unseenNotifications.length} new, ${allNotifications.length} total, ${seenIds.length} seen`);
        if (unseenNotifications.length > 0) {
          console.log(`🔔 New notification IDs: ${unseenNotifications.map((n: any) => n.id.slice(-6)).join(', ')}`);
        }
        
        setUnreadNotifications(unseenNotifications.length);
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  }, [token, isGuest]);

  // Fetch unread message count from server
  const fetchUnreadMessages = useCallback(async () => {
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
        const count = data.unread_count || 0;
        console.log(`🔔 Messages: ${count} unread`);
        setUnreadMessages(count);
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  }, [token, isGuest]);

  // Refresh both badge counts
  const refreshBadges = useCallback(async () => {
    if (initializingRef.current) return;
    initializingRef.current = true;
    
    try {
      await Promise.all([
        fetchUnreadNotifications(),
        fetchUnreadMessages()
      ]);
    } finally {
      initializingRef.current = false;
      setIsInitialized(true);
    }
  }, [fetchUnreadNotifications, fetchUnreadMessages]);

  // Mark notifications as read - update seen list with ALL current notification IDs
  const markNotificationsAsRead = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const allNotifications = data.notifications || [];
        const notificationIds = allNotifications.map((n: any) => n.id);
        await AsyncStorage.setItem(LAST_NOTIFICATION_VIEW_KEY, JSON.stringify(notificationIds));
        setUnreadNotifications(0);
        console.log(`🔔 Marked ${notificationIds.length} notifications as read`);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }, [token]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(() => {
    setUnreadMessages(0);
  }, []);

  // Initialize on mount and token change
  useEffect(() => {
    if (token && !isGuest) {
      setIsInitialized(false);
      refreshBadges();
    } else {
      setUnreadNotifications(0);
      setUnreadMessages(0);
      setIsInitialized(true);
    }
  }, [token, isGuest]);

  // Periodic refresh every 2 minutes
  useEffect(() => {
    if (!token || isGuest) return;
    
    const interval = setInterval(() => {
      fetchUnreadNotifications();
      fetchUnreadMessages();
    }, 120000);
    
    return () => clearInterval(interval);
  }, [token, isGuest, fetchUnreadNotifications, fetchUnreadMessages]);

  // Calculate total badge count (notifications + messages)
  const totalBadgeCount = unreadNotifications + unreadMessages;

  const value: BadgeContextType = {
    unreadNotifications,
    unreadMessages,
    totalBadgeCount,
    setUnreadNotifications,
    setUnreadMessages,
    refreshBadges,
    markNotificationsAsRead,
    markMessagesAsRead,
    isInitialized,
  };

  return (
    <BadgeContext.Provider value={value}>
      {children}
    </BadgeContext.Provider>
  );
}

export { BadgeContext };
