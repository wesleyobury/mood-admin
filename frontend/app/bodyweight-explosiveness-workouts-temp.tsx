import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Workout {
  name: string;
  duration: string;
  description: string;
  battlePlan: string;
  imageUrl: string;
  intensityReason: string;
  moodTips: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
  }[];
}

interface EquipmentWorkouts {
  equipment: string;
  icon: keyof typeof Ionicons.glyphMap;
  workouts: {
    beginner: Workout[];
    intermediate: Workout[];
    advanced: Workout[];
  };
}

// Explosiveness workout database with all equipment types - UPDATED FOR CONSISTENCY
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Battle Ropes',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Explosive Rope Slams',
          duration: '8–10 min',
          description: 'Short all-out bursts build crisp explosive intent and fast resets',
          battlePlan: '3 rounds\n• 3 × 8s Max Slams (15s between efforts)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Braced core and hip hinge connection builds safe full-body power',
          moodTips: [
            {
              icon: 'body',
              title: 'Core Bracing',
              description: 'Brace ribs down; hinge slightly on the slam'
            },
            {
              icon: 'trending-down',
              title: 'Handle Drive',
              description: 'Drive handles to floor; elbows track down, not wide'
            }
          ]
        },
        {
          name: 'Alternating Waves',
          duration: '8–10 min',
          description: 'Fast alternating arms with high knees build efficient elastic rhythm',
          battlePlan: '4 rounds\n• 15s Alternating Waves\n• 10s In-place High Knees\nRest 45–60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-knee wave combo builds explosive arm speed and postural control',
          moodTips: [
            {
              icon: 'walk',
              title: 'High Knees',
              description: '"High knees" = fast in-place knee drive on balls of feet'
            },
            {
              icon: 'fitness',
              title: 'Arm Movement',
              description: 'Snap from elbows; shoulders stay low and packed'
            }
          ]
        },
        {
          name: 'Side-to-Side Waves',
          duration: '8–10 min',
          description: 'Hip shifts drive crisp lateral hits without excessive trunk twist',
          battlePlan: '3 rounds\n• 12s Side-to-Side Waves\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Lateral strikes train frontal-plane power control and stability',
          moodTips: [
            {
              icon: 'swap-horizontal',
              title: 'Hip Movement',
              description: 'Shift hips left/right; torso faces forward'
            },
            {
              icon: 'pulse',
              title: 'Rope Control',
              description: 'Keep rope slack minimal; crisp, even strikes'
            }
          ]
        }
      ]
    }
  }
];

export default function BodyweightExplosivenessWorkoutsScreen() {
  return (
    <View>
      <Text>Updated Battle Ropes - Beginner Section</Text>
    </View>
  );
}