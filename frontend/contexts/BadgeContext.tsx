import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
const LAST_NOTIFICATION_VIEW_KEY = 'last_notification_view_ids';
const BADGE_INITIALIZED_KEY = 'badge_initialized_for_token';

interface BadgeContextType {
  unreadNotifications: number;
  unreadMessages: number;
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
  const lastTokenRef = useRef<string | null>(null);

  // Initialize badge state for a new token/login
  const initializeBadges = useCallback(async () => {
    if (!token || isGuest || initializingRef.current) {
      return;
    }
    
    // Check if this is a new token (new login)
    const isNewLogin = token !== lastTokenRef.current;
    lastTokenRef.current = token;
    
    initializingRef.current = true;
    
    try {
      // Check if we've already initialized for this token
      const initKey = await AsyncStorage.getItem(BADGE_INITIALIZED_KEY);
      const seenIdsStr = await AsyncStorage.getItem(LAST_NOTIFICATION_VIEW_KEY);
      
      // If this is a fresh login OR no seen IDs exist, initialize
      if (isNewLogin || !seenIdsStr || initKey !== token) {
        console.log('🔔 Badge init: Fresh login detected, marking all notifications as seen');
        
        const response = await fetch(`${API_URL}/api/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          const allNotifications = data.notifications || [];
          const notificationIds = allNotifications.map((n: any) => n.id);
          
          // Mark all current notifications as seen
          await AsyncStorage.setItem(LAST_NOTIFICATION_VIEW_KEY, JSON.stringify(notificationIds));
          await AsyncStorage.setItem(BADGE_INITIALIZED_KEY, token);
          
          console.log(`🔔 Badge init: Marked ${notificationIds.length} notifications as seen`);
          setUnreadNotifications(0);
        }
      } else {
        // Already initialized, just count unseen
        console.log('🔔 Badge init: Already initialized, counting unseen');
        await fetchUnreadNotificationsInternal(seenIdsStr);
      }
      
      // Also fetch unread messages
      await fetchUnreadMessagesInternal();
      
    } catch (error) {
      console.error('Error initializing badges:', error);
    } finally {
      initializingRef.current = false;
      setIsInitialized(true);
    }
  }, [token, isGuest]);

  // Internal function to fetch unread notifications count
  const fetchUnreadNotificationsInternal = async (seenIdsStr?: string | null) => {
    if (!token || isGuest) {
      setUnreadNotifications(0);
      return;
    }
    
    try {
      // Get seen IDs if not passed
      if (seenIdsStr === undefined) {
        seenIdsStr = await AsyncStorage.getItem(LAST_NOTIFICATION_VIEW_KEY);
      }
      
      let seenIds: string[] = [];
      try {
        if (seenIdsStr) {
          seenIds = JSON.parse(seenIdsStr);
          if (!Array.isArray(seenIds)) {
            seenIds = [];
          }
        }
      } catch {
        seenIds = [];
      }
      
      // If no seen IDs exist yet, don't count (we're still initializing)
      if (seenIds.length === 0) {
        setUnreadNotifications(0);
        return;
      }
      
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const allNotifications = data.notifications || [];
        
        // Count notifications whose IDs are NOT in the seen list
        const unseenCount = allNotifications.filter(
          (n: any) => !seenIds.includes(n.id)
        ).length;
        
        console.log(`🔔 Badge count: ${unseenCount} unseen out of ${allNotifications.length} total`);
        setUnreadNotifications(unseenCount);
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  // Internal function to fetch unread messages count
  const fetchUnreadMessagesInternal = async () => {
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
      console.error('Error fetching unread messages:', error);
    }
  };

  // Public refresh function (only counts, doesn't re-initialize)
  const refreshBadges = useCallback(() => {
    if (!isInitialized && !initializingRef.current) {
      initializeBadges();
    } else if (isInitialized) {
      fetchUnreadNotificationsInternal();
      fetchUnreadMessagesInternal();
    }
  }, [isInitialized, initializeBadges]);

  // Mark notifications as read (clear notification badge)
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
        console.log('🔔 Marked all notifications as read');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }, [token]);

  // Mark messages as read (clear message badge)
  const markMessagesAsRead = useCallback(() => {
    setUnreadMessages(0);
  }, []);

  // Initialize on mount and token change
  useEffect(() => {
    if (token && !isGuest) {
      setIsInitialized(false);
      initializeBadges();
    } else {
      setUnreadNotifications(0);
      setUnreadMessages(0);
      setIsInitialized(true);
    }
  }, [token, isGuest]);

  // Periodic refresh (only if initialized)
  useEffect(() => {
    if (!isInitialized || !token || isGuest) return;
    
    const interval = setInterval(() => {
      fetchUnreadNotificationsInternal();
      fetchUnreadMessagesInternal();
    }, 120000); // Every 2 minutes
    
    return () => clearInterval(interval);
  }, [isInitialized, token, isGuest]);

  const value: BadgeContextType = {
    unreadNotifications,
    unreadMessages,
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
