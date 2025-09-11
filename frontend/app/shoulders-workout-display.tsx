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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Workout {
  name: string;
  duration: string;
  description: string;
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

// Shoulders workout database with all equipment types
const shouldersWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Seated Shoulder Builder',
          duration: '12–14 min',
          description: `• 3x12 Seated Shoulder Press
• 3x12 Lateral Raises
Rest 60s between sets.

Mood Tips:
• Hard exhale on each rep = more core stability and shoulder efficiency.
• On lateral raises, stop at shoulder height and pause — over-raising shifts load away from delts.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Perfect starting intensity for building shoulder foundation',
          moodTips: [
            {
              icon: 'bulb-outline',
              title: 'Core Stability',
              description: 'Hard exhale on each rep = more core stability and shoulder efficiency'
            },
            {
              icon: 'fitness-outline',
              title: 'Lateral Raise Form',
              description: 'On lateral raises, stop at shoulder height and pause — over-raising shifts load away from delts'
            },
          ]
        },
        {
          name: 'Dynamic Shoulder Flow',
          duration: '12–15 min',
          description: `30s alternating single-arm overhead press (march in place)
30s lateral raise with 2-sec hold at top
30s bent-over reverse flys
30s rest
Repeat 3x.

Mood Tips:
• Isometric pauses make light weights feel heavy — perfect for growth.
• Marching during the press ramps core activation and shoulder stability.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Dynamic flow with isometric holds for enhanced muscle activation',
          moodTips: [
            {
              icon: 'time-outline',
              title: 'Isometric Growth',
              description: 'Isometric pauses make light weights feel heavy — perfect for growth'
            },
            {
              icon: 'walk-outline',
              title: 'Core Activation',
              description: 'Marching during the press ramps core activation and shoulder stability'
            },
          ]
        },
      ],
      intermediate: [
        {
          name: 'Arnold Power Set',
          duration: '14–16 min',
          description: `• 4x10 Standing Arnold Press
• 4x10 Upright Row
Rest 75s between sets.

Mood Tips:
• Rotate fully on Arnold presses — it recruits more deltoid fibers.
• Upright rows: pull elbows higher than wrists for maximum trap-to-delt tension.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Moderate intensity with varied movements for balanced development',
          moodTips: [
            {
              icon: 'refresh-outline',
              title: 'Arnold Rotation',
              description: 'Rotate fully on Arnold presses — it recruits more deltoid fibers'
            },
            {
              icon: 'trending-up-outline',
              title: 'Upright Row Form',
              description: 'Upright rows: pull elbows higher than wrists for maximum trap-to-delt tension'
            },
          ]
        },
        {
          name: 'Shoulder Circuit Challenge',
          duration: '14–16 min',
          description: `10 Arnold presses
10 "bus driver" raises (hold plate or dumbbell, rotate at top)
10 push presses
10 plank dumbbell drags (push-up position, drag side to side)
Repeat 3x. Rest 75s between rounds.

Mood Tips:
• Explosive push presses overload shoulders better than light strict raises.
• Plank drags double as a shoulder/core integration move without extra time.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Circuit training with compound movements for enhanced conditioning',
          moodTips: [
            {
              icon: 'flash-outline',
              title: 'Explosive Power',
              description: 'Explosive push presses overload shoulders better than light strict raises'
            },
            {
              icon: 'fitness-outline',
              title: 'Dual Purpose',
              description: 'Plank drags double as a shoulder/core integration move without extra time'
            },
          ]
        },
      ],
      advanced: [
        {
          name: 'Explosive Press Builder',
          duration: '18–20 min',
          description: `• 4x8 Push Press
• 4x10 Lateral Raises
• 4x10 Bent-Over Reverse Flys
Rest 90s between sets.

Mood Tips:
• Push from legs on push press — more load capacity = more growth.
• Reverse flys: keep rear delts under tension by stopping just shy of lockout.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'High intensity for experienced lifters seeking maximum gains',
          moodTips: [
            {
              icon: 'body-outline',
              title: 'Leg Drive Power',
              description: 'Push from legs on push press — more load capacity = more growth'
            },
            {
              icon: 'timer-outline',
              title: 'Tension Control',
              description: 'Reverse flys: keep rear delts under tension by stopping just shy of lockout'
            },
          ]
        },
        {
          name: 'Dumbbell Power Flow',
          duration: '16–18 min',
          description: `8 clean to press
8 lateral raise to front raise combo
8 alternating single-arm snatch (light, explosive)
Repeat 4x. Rest 90s between rounds.

Mood Tips:
• Pairing lateral + front raise = double delt pump from one motion.
• Single-arm snatches teach max intent and fire up fast-twitch fibers in shoulders.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Elite level training with complex movements and explosive power',
          moodTips: [
            {
              icon: 'flash-outline',
              title: 'Double Pump',
              description: 'Pairing lateral + front raise = double delt pump from one motion'
            },
            {
              icon: 'rocket-outline',
              title: 'Fast-Twitch Activation',
              description: 'Single-arm snatches teach max intent and fire up fast-twitch fibers in shoulders'
            },
          ]
        },
      ],
    },
  },
  {
    equipment: 'Barbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Barbell Press Builder',
          duration: '12–14 min',
          description: `• 3x10 Standing Overhead Press
• 3x10 Upright Row
Rest 60–75s between sets.

Mood Tips:
• Drive bar in a straight path, not arced — shoulders stay loaded, not joints.
• Upright rows hit better with a shoulder-width grip.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Foundation building with basic barbell movements',
          moodTips: [
            {
              icon: 'trending-up-outline',
              title: 'Bar Path',
              description: 'Drive bar in a straight path, not arced — shoulders stay loaded, not joints'
            },
            {
              icon: 'resize-outline',
              title: 'Grip Width',
              description: 'Upright rows hit better with a shoulder-width grip'
            },
          ]
        },
        {
          name: 'Intro Shoulder Flow',
          duration: '12–14 min',
          description: `8 strict presses
8 behind-the-neck presses (light)
8 barbell "rainbows" (arc overhead side to side)
Repeat 3x. Rest 1 min between rounds.

Mood Tips:
• Behind-the-neck: only go as low as shoulder mobility allows to prevent strain.
• Rainbows add lateral movement, recruiting stabilizers neglected in pressing.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Introduces range of motion and movement patterns safely',
          moodTips: [
            {
              icon: 'warning-outline',
              title: 'Mobility Safety',
              description: 'Behind-the-neck: only go as low as shoulder mobility allows to prevent strain'
            },
            {
              icon: 'refresh-outline',
              title: 'Stabilizer Recruitment',
              description: 'Rainbows add lateral movement, recruiting stabilizers neglected in pressing'
            },
          ]
        },
      ],
      intermediate: [
        {
          name: 'Power Press Combo',
          duration: '16–18 min',
          description: `• 4x8 Push Press
• 4x8 Barbell High Pull
Rest 75s between sets.

Mood Tips:
• Drive power from legs into push press for heavy overload.
• High pulls: elbows drive wide and high to maximize delt stretch.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Moderate to high intensity for strength building',
          moodTips: [
            {
              icon: 'body-outline',
              title: 'Leg Drive Power',
              description: 'Drive power from legs into push press for heavy overload'
            },
            {
              icon: 'expand-outline',
              title: 'Delt Stretch',
              description: 'High pulls: elbows drive wide and high to maximize delt stretch'
            },
          ]
        },
        {
          name: 'Barbell Shoulder Circuit',
          duration: '14–16 min',
          description: `8 push presses
8 barbell Z-presses (seated on floor)
8 overhead lunges (alternate legs)
Repeat 3x. Rest 90s between rounds.

Mood Tips:
• Z-press: no lower body = strict shoulder strength.
• Overhead lunges build stability under fatigue, great for functional hypertrophy.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Circuit format with strict movements for enhanced shoulder strength',
          moodTips: [
            {
              icon: 'shield-outline',
              title: 'Strict Strength',
              description: 'Z-press: no lower body = strict shoulder strength'
            },
            {
              icon: 'walk-outline',
              title: 'Functional Stability',
              description: 'Overhead lunges build stability under fatigue, great for functional hypertrophy'
            },
          ]
        },
      ],
      advanced: [
        {
          name: 'Advanced Barbell Builder',
          duration: '18–20 min',
          description: `• 4x8 Strict Press
• 4x8 Upright Row
• 4x8 Front Raise (Barbell)
Rest 90s between sets.

Mood Tips:
• Strict pressing keeps body honest—no cheating momentum.
• Front raise with barbell = constant tension different from dumbbells.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Elite level training for maximum strength and power',
          moodTips: [
            {
              icon: 'checkmark-circle-outline',
              title: 'No Cheating',
              description: 'Strict pressing keeps body honest—no cheating momentum'
            },
            {
              icon: 'barbell-outline',
              title: 'Constant Tension',
              description: 'Front raise with barbell = constant tension different from dumbbells'
            },
          ]
        },
        {
          name: 'Barbell Power Complex',
          duration: '18–20 min',
          description: `6 push jerks
6 snatch grip high pulls
6 Sots presses (overhead squat position, strict press)
Repeat 4x. Rest 90–120s after each round.

Mood Tips:
• Push jerk = heavy overload, vital for breaking growth plateaus.
• Sots press pushes shoulders under maximum tension + mobility demand.`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Elite complex training with maximum tension and mobility requirements',
          moodTips: [
            {
              icon: 'trophy-outline',
              title: 'Plateau Breaker',
              description: 'Push jerk = heavy overload, vital for breaking growth plateaus'
            },
            {
              icon: 'body-outline',
              title: 'Maximum Demand',
              description: 'Sots press pushes shoulders under maximum tension + mobility demand'
            },
          ]
        },
      ],
    },
  },
];

export default function ShouldersWorkoutDisplayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Shoulders';
  const selectedEquipmentParam = params.equipment as string || '';
  const difficultyLevel = params.difficulty as string || 'beginner';

  // Decode and split equipment names
  const selectedEquipmentNames = decodeURIComponent(selectedEquipmentParam).split(',').filter(name => name.trim());

  // Filter workouts based on selected equipment
  const getWorkoutsForEquipment = () => {
    const filteredWorkouts: Workout[] = [];
    
    selectedEquipmentNames.forEach(equipmentName => {
      const equipmentData = shouldersWorkoutDatabase.find(eq => 
        eq.equipment.toLowerCase() === equipmentName.toLowerCase().trim()
      );
      
      if (equipmentData) {
        const workoutsForDifficulty = equipmentData.workouts[difficultyLevel as keyof typeof equipmentData.workouts];
        if (workoutsForDifficulty) {
          filteredWorkouts.push(...workoutsForDifficulty);
        }
      }
    });
    
    return filteredWorkouts;
  };

  const availableWorkouts = getWorkoutsForEquipment();

  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleStartWorkout = () => {
    if (selectedWorkout) {
      router.push({
        pathname: '/workout-guidance',
        params: {
          workoutName: selectedWorkout.name,
          workoutDescription: selectedWorkout.description,
          workoutDuration: selectedWorkout.duration,
          equipment: selectedEquipmentParam,
          difficulty: difficultyLevel,
          mood: moodTitle,
          workoutType: workoutType,
        }
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const getDifficultyColor = () => {
    switch (difficultyLevel) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#FFD700';
    }
  };

  const getDifficultyLabel = () => {
    return difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Shoulders Workouts</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Equipment and Difficulty Info */}
      <View style={styles.infoContainer}>
        <View style={styles.equipmentInfo}>
          <Text style={styles.infoLabel}>Equipment:</Text>
          <Text style={styles.infoText}>{selectedEquipmentNames.join(', ')}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={styles.difficultyText}>{getDifficultyLabel()}</Text>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {availableWorkouts.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Choose Your Workout</Text>
            <Text style={styles.sectionSubtitle}>
              Select a workout that matches your energy level and available time
            </Text>

            {availableWorkouts.map((workout, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.workoutCard,
                  selectedWorkout?.name === workout.name && styles.selectedWorkoutCard
                ]}
                onPress={() => handleWorkoutSelect(workout)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: workout.imageUrl }} style={styles.workoutImage} />
                <View style={styles.workoutContent}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <View style={styles.durationBadge}>
                      <Ionicons name="time-outline" size={16} color="#FFD700" />
                      <Text style={styles.durationText}>{workout.duration}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.workoutDescription}>{workout.description}</Text>
                  
                  <View style={styles.intensityContainer}>
                    <Text style={styles.intensityReason}>{workout.intensityReason}</Text>
                  </View>

                  {selectedWorkout?.name === workout.name && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
                      <Text style={styles.selectedText}>Selected</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="barbell-outline" size={48} color="#666" />
            <Text style={styles.noWorkoutsTitle}>No Workouts Available</Text>
            <Text style={styles.noWorkoutsText}>
              No workouts found for the selected equipment and difficulty level. Please go back and try different selections.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Start Workout Button */}
      {selectedWorkout && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
            <Ionicons name="play-circle" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  equipmentInfo: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 24,
    lineHeight: 22,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  selectedWorkoutCard: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  workoutImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#222',
  },
  workoutContent: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  intensityContainer: {
    marginBottom: 12,
  },
  intensityReason: {
    fontSize: 13,
    color: '#FFD700',
    fontStyle: 'italic',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  selectedText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noWorkoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  startButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});