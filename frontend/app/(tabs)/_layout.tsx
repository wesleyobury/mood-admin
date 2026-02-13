import { Tabs } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Analytics } from '../../utils/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
const LAST_NOTIFICATION_VIEW_KEY = 'last_notification_view_ids';

export default function TabLayout() {
  const { token, isGuest } = useAuth();
  const previousTab = useRef<string>('index');
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Fetch unread notification count
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

  // Fetch on mount
  useEffect(() => {
    fetchUnreadNotifications();
    // Refresh every 2 minutes
    const interval = setInterval(fetchUnreadNotifications, 120000);
    return () => clearInterval(interval);
  }, [fetchUnreadNotifications]);

  const trackTabSwitch = (toTab: string) => {
    if (token && previousTab.current !== toTab) {
      Analytics.tabSwitched(token, {
        from_tab: previousTab.current,
        to_tab: toTab,
      });
      Analytics.screenViewed(token, {
        screen_name: toTab,
        previous_screen: previousTab.current,
      });
      previousTab.current = toTab;
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD700', // Gold color
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#0c0c0c',
          borderTopWidth: 1,
          borderTopColor: '#333',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 20,
          paddingTop: 10,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        sceneStyle: {
          backgroundColor: '#0c0c0c',
        },
      }}
      screenListeners={{
        tabPress: (e) => {
          const tabName = e.target?.split('-')[0] || '';
          trackTabSwitch(tabName);
          // Refresh notification count when switching tabs
          fetchUnreadNotifications();
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.workoutsIconContainer}>
              {/* Subtle glow effect behind the icon */}
              {focused && <View style={styles.workoutsGlow} />}
              <Ionicons 
                name={focused ? 'fitness' : 'fitness-outline'} 
                size={24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons 
                name={focused ? 'compass' : 'compass-outline'} 
                size={24} 
                color={color} 
              />
              {/* Notification badge on Explore tab */}
              {unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutsIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutsGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#0c0c0c',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});