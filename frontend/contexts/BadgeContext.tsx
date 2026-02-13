import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
const LAST_NOTIFICATION_VIEW_KEY = 'last_notification_view_ids';

interface BadgeContextType {
  unreadNotifications: number;
  unreadMessages: number;
  setUnreadNotifications: (count: number) => void;
  setUnreadMessages: (count: number) => void;
  refreshBadges: () => void;
  markNotificationsAsRead: () => void;
  markMessagesAsRead: () => void;
}

const BadgeContext = createContext<BadgeContextType>({
  unreadNotifications: 0,
  unreadMessages: 0,
  setUnreadNotifications: () => {},
  setUnreadMessages: () => {},
  refreshBadges: () => {},
  markNotificationsAsRead: () => {},
  markMessagesAsRead: () => {},
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

  // Fetch unread notification count (likes, follows, comments - NOT messages)
  const fetchUnreadNotifications = useCallback(async () => {
    if (!token || isGuest) {
      setUnreadNotifications(0);
      return;
    }
    
    try {
      // Get the list of notification IDs the user has already seen
      const seenIdsStr = await AsyncStorage.getItem(LAST_NOTIFICATION_VIEW_KEY);
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
      
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const allNotifications = data.notifications || [];
        
        // If no seen IDs exist, initialize them (fresh session)
        if (seenIds.length === 0 && allNotifications.length > 0) {
          const notificationIds = allNotifications.map((n: any) => n.id);
          await AsyncStorage.setItem(LAST_NOTIFICATION_VIEW_KEY, JSON.stringify(notificationIds));
          setUnreadNotifications(0);
          return;
        }
        
        // Count notifications whose IDs are NOT in the seen list
        const unseenCount = allNotifications.filter(
          (n: any) => !seenIds.includes(n.id)
        ).length;
        
        setUnreadNotifications(unseenCount);
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  }, [token, isGuest]);

  // Fetch unread message count
  const fetchUnreadMessages = useCallback(async () => {
    if (!token || isGuest) {
      setUnreadMessages(0);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/messages/unread-count`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadMessages(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  }, [token, isGuest]);

  // Refresh both badge counts
  const refreshBadges = useCallback(() => {
    fetchUnreadNotifications();
    fetchUnreadMessages();
  }, [fetchUnreadNotifications, fetchUnreadMessages]);

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
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }, [token]);

  // Mark messages as read (clear message badge)
  const markMessagesAsRead = useCallback(() => {
    setUnreadMessages(0);
  }, []);

  // Fetch on mount and token change
  useEffect(() => {
    refreshBadges();
    // Refresh every 2 minutes
    const interval = setInterval(refreshBadges, 120000);
    return () => clearInterval(interval);
  }, [refreshBadges]);

  const value: BadgeContextType = {
    unreadNotifications,
    unreadMessages,
    setUnreadNotifications,
    setUnreadMessages,
    refreshBadges,
    markNotificationsAsRead,
    markMessagesAsRead,
  };

  return (
    <BadgeContext.Provider value={value}>
      {children}
    </BadgeContext.Provider>
  );
}

export { BadgeContext };
