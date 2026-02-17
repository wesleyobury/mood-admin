import { Tabs, usePathname } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useBadges } from '../../contexts/BadgeContext';
import { Analytics } from '../../utils/analytics';

// Re-export useBadges for components that import from _layout
export { useBadges } from '../../contexts/BadgeContext';

export default function TabLayout() {
  const { token } = useAuth();
  const previousTab = useRef<string>('index');
  const { unreadNotifications, unreadMessages, totalBadgeCount, refreshBadges } = useBadges();

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
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#0c0c0c',
          borderTopWidth: 1,
          borderTopColor: '#222',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 20,
          paddingTop: 10,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
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
          refreshBadges();
        },
      }}
    >
      {/* Explore - Left position */}
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
              {totalBadgeCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {totalBadgeCount > 99 ? '99+' : totalBadgeCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      {/* Workouts - Center position */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons 
                name={focused ? 'fitness' : 'fitness-outline'} 
                size={24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      {/* Profile - Right position */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={24} 
                color={color} 
              />
            </View>
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