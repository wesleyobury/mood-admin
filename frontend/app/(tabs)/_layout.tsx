import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Analytics } from '../../utils/analytics';

export default function TabLayout() {
  const { token } = useAuth();
  const previousTab = useRef<string>('index');

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
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'fitness' : 'fitness-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'compass' : 'compass-outline'} 
              size={24} 
              color={color} 
            />
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
      <Tabs.Screen
        name="user-profile"
        options={{
          href: null, // Hide from tab bar but keep in navigation stack
        }}
      />
    </Tabs>
  );
}