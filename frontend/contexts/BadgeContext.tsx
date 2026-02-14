import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
const LAST_NOTIFICATION_VIEW_TIME_KEY = 'last_notification_view_time';

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

  // Fetch unread notifications - count those created AFTER last view time
  const fetchUnreadNotifications = useCallback(async () => {
    if (!token || isGuest) {
      setUnreadNotifications(0);
      return;
    }
    
    try {
      // Get last view time from storage
      const lastViewTimeStr = await AsyncStorage.getItem(LAST_NOTIFICATION_VIEW_TIME_KEY);
      let lastViewTime: Date | null = null;
      
      if (lastViewTimeStr) {
        lastViewTime = new Date(lastViewTimeStr);
        // Validate the date
        if (isNaN(lastViewTime.getTime())) {
          lastViewTime = null;
        }
      }
      
      // Fetch all notifications from server
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const allNotifications = data.notifications || [];
        
        // FIRST TIME EVER - no last view time set
        // Set current time as baseline, show 0 unread
        if (!lastViewTime) {
          console.log('🔔 First time: setting notification baseline time');
          await AsyncStorage.setItem(LAST_NOTIFICATION_VIEW_TIME_KEY, new Date().toISOString());
          setUnreadNotifications(0);
          return;
        }
        
        // Count notifications created AFTER last view time
        const unseenNotifications = allNotifications.filter((n: any) => {
          const notifTime = new Date(n.created_at);
          return notifTime > lastViewTime!;
        });
        
        console.log(`🔔 Badge: ${unseenNotifications.length} new since ${lastViewTime.toISOString()}`);
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

  // Mark notifications as read - update last view time to NOW
  const markNotificationsAsRead = useCallback(async () => {
    if (!token) return;
    
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(LAST_NOTIFICATION_VIEW_TIME_KEY, now);
      setUnreadNotifications(0);
      console.log(`🔔 Marked notifications as read at ${now}`);
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
