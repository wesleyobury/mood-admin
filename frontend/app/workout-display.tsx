import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
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

// Sample data for main equipment (reduced for token limit)
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Treadmill',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Walk & Jog Mixer',
          duration: '20 min',
          description: '3 min brisk walk (3.0 mph), 2 min power walk (4.0 mph, incline 2%), 1 min light jog (5.0 mph), repeat 3x, finish with 3 min walk (3.0 mph, incline 1%).',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect for beginners with alternating walking and light jogging to gradually build cardiovascular endurance.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Heel-to-Toe Stride',
              description: 'Land on your heel and roll through to your toes for optimal energy transfer and reduced impact on joints.'
            },
            {
              icon: 'heart',
              title: 'Maintain 70% Max Heart Rate',
              description: 'Keep your heart rate at comfortable talking pace during walks, slightly breathless during jogs for maximum fat burn.'
            }
          ]
        },
        {
          name: 'Rolling Hills',
          duration: '20 min',
          description: '2 min walk (3.0 mph, incline 0%), 2 min walk (3.0 mph, incline 4%), 2 min walk (3.5 mph, incline 2%), 2 min jog (4.5 mph, incline 0%), repeat sequence, finish with 2 min walk (3.0 mph).',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Uses gentle incline changes and moderate pace increases to build basic strength and endurance safely.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Lean Into Inclines',
              description: 'Slightly lean forward on inclines and pump your arms more to engage core muscles and maintain momentum.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Breathing',
              description: 'Use flat sections for deep recovery breathing - inhale for 3 steps, exhale for 3 steps to optimize oxygen flow.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Speed Ladder',
          duration: '25 min',
          description: '3 min jog (5.5 mph), 2 min run (6.5 mph), 1 min fast run (7.5 mph), 2 min walk (3.5 mph, incline 3%), repeat 3x, finish with 3 min jog (5.5 mph).',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressively increases speed while maintaining good recovery periods for intermediate fitness levels.'
        },
        {
          name: 'Incline Intervals',
          duration: '30 min',
          description: '2 min run (6.0 mph, incline 1%), 1 min run (6.0 mph, incline 5%), 2 min walk (3.5 mph, incline 2%), repeat 5x, finish with 3 min walk (3.0 mph).',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Combines consistent running pace with challenging inclines to build both cardiovascular and muscular endurance.'
        }
      ],
      advanced: [
        {
          name: 'Sprint Pyramid',
          duration: '30 min',
          description: '2 min jog (6.0 mph), 30 sec sprint (9.0 mph), 1 min jog, 45 sec sprint, 1 min jog, 1 min sprint, 2 min jog, repeat pyramid, finish with 5 min incline walk (4.0 mph, incline 8%).',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints at 9.0 mph challenge maximum cardiovascular capacity and anaerobic power.'
        },
        {
          name: 'Tempo & Hill Challenge',
          duration: '35 min',
          description: '5 min warm-up (jog), 10 min tempo run (7.0 mph, incline 2%), 5 x 1 min hill sprints (8.0 mph, incline 6%, 1 min walk between), 5 min cool-down.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Extended tempo runs plus high-intensity hill sprints demand advanced cardiovascular fitness and mental toughness.'
        }
      ]
    }
  },
  {
    equipment: 'Elliptical',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Resistance Rounds',
          duration: '20 min',
          description: '3 min easy (resistance 3), 2 min moderate (resistance 6), 1 min fast (resistance 4), repeat 4x, finish with 3 min easy (resistance 2).',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Low-impact movement with gentle resistance changes, ideal for building cardio base without joint stress.'
        },
        {
          name: 'Cadence Play',
          duration: '18 min',
          description: '2 min steady (RPM 55), 1 min fast (RPM 70), 2 min moderate (RPM 60), 1 min slow (RPM 50, resistance 5), repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Moderate RPM variations help beginners learn rhythm control while building steady-state endurance.'
        }
      ],
      intermediate: [
        {
          name: 'Climb & Sprint',
          duration: '25 min',
          description: '2 min moderate (resistance 5), 1 min climb (resistance 10), 1 min sprint (resistance 4, RPM 80+), repeat 5x, finish with 3 min easy.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternates between high resistance climbs and fast sprints to challenge both strength and speed.'
        },
        {
          name: 'Reverse & Forward',
          duration: '30 min',
          description: '3 min forward (resistance 6), 2 min reverse (resistance 4), 1 min sprint (forward, resistance 5), repeat 4x, finish with 2 min easy.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Direction changes engage different muscle groups while maintaining consistent cardiovascular demand.'
        }
      ],
      advanced: [
        {
          name: 'Tabata Elliptical',
          duration: '24 min',
          description: '8 rounds: 20 sec max effort (resistance 8), 10 sec easy (resistance 3), 2 min recovery, repeat for 3 cycles.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Tabata protocol demands maximum effort bursts, pushing VO2 max and anaerobic capacity to limits.'
        },
        {
          name: 'Endurance Builder',
          duration: '35 min',
          description: '5 min easy, 10 min moderate (resistance 7), 5 min hard (resistance 10), 5 min fast (resistance 5, RPM 80+), 5 min reverse (resistance 6), 5 min cool-down.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Long duration with varied intensities tests cardiovascular endurance and mental resilience.'
        }
      ]
    }
  },
  {
    equipment: 'Arm bicycle',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Speed & Resistance Mix',
          duration: '12 min',
          description: '2 min easy (resistance 2), 1 min moderate (resistance 4), 1 min fast (resistance 2), repeat 3x, finish with 2 min easy.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals with varied resistance help beginners build upper body endurance gradually.'
        },
        {
          name: 'Interval Builder',
          duration: '15 min',
          description: '1 min easy, 1 min moderate, 30 sec fast, 1 min easy, 1 min reverse, repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Basic interval structure with reverse motion introduces beginners to upper body cardio safely.'
        }
      ],
      intermediate: [
        {
          name: 'Pyramid Challenge',
          duration: '18 min',
          description: '1 min easy, 1 min moderate, 1 min hard, 1 min moderate, 1 min easy, repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive intensity pyramid challenges intermediate upper body strength and endurance.'
        },
        {
          name: 'Reverse & Forward',
          duration: '20 min',
          description: '2 min forward (resistance 5), 1 min reverse (resistance 3), 1 min sprint (forward, resistance 4), repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternating directions engage different muscle groups while building intermediate cardiovascular capacity.'
        }
      ],
      advanced: [
        {
          name: 'HIIT Sprints',
          duration: '20 min',
          description: '30 sec max effort (resistance 8), 1 min easy (resistance 3), repeat 10x, finish with 5 min moderate.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints demand maximum upper body power and anaerobic capacity.'
        },
        {
          name: 'Endurance & Power',
          duration: '25 min',
          description: '5 min moderate, 10 x 30 sec sprint (resistance 10) with 30 sec easy, 5 min reverse, 5 min cool-down.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended power intervals with reverse work test advanced upper body endurance and strength.'
        }
      ]
    }
  },
  {
    equipment: 'Stationary bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Rolling Ride',
          duration: '20 min',
          description: '3 min easy (resistance 2), 2 min moderate (resistance 5), 1 min fast (resistance 3), repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle resistance changes help beginners build leg strength and cardiovascular base.'
        },
        {
          name: 'Cadence Intervals',
          duration: '18 min',
          description: '2 min steady (70 RPM), 1 min fast (90 RPM), 2 min moderate (80 RPM), 1 min slow (60 RPM, resistance 6), repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'RPM variations teach beginners pedaling rhythm while maintaining moderate intensity.'
        }
      ],
      intermediate: [
        {
          name: 'Hill & Sprint',
          duration: '25 min',
          description: '2 min moderate (resistance 6), 1 min hill (resistance 10), 1 min sprint (resistance 4, 100+ RPM), repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternates between strength-building hills and speed-focused sprints for balanced intermediate training.'
        },
        {
          name: 'Pyramid Ride',
          duration: '30 min',
          description: '3 min easy, 2 min moderate, 1 min hard, 2 min moderate, 3 min easy, repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive intensity pyramids challenge intermediate riders with sustained effort periods.'
        }
      ],
      advanced: [
        {
          name: 'Tabata Bike',
          duration: '24 min',
          description: '8 rounds: 20 sec max effort (resistance 8), 10 sec easy (resistance 3), 2 min recovery, repeat for 3 cycles.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Tabata protocol pushes advanced cyclists to maximum anaerobic power and VO2 capacity.'
        },
        {
          name: 'Endurance & Power',
          duration: '35 min',
          description: '5 min easy, 10 min moderate (resistance 7), 5 min hard (resistance 10), 5 min fast (resistance 5, 100+ RPM), 5 min standing climb (resistance 8), 5 min cool-down.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended workout with varied challenges tests advanced cardiovascular endurance and power.'
        }
      ]
    }
  },
  {
    equipment: 'Assault bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Intro Intervals',
          duration: '12 min',
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals introduce beginners to assault bike intensity while allowing adequate recovery.'
        },
        {
          name: 'Resistance Play',
          duration: '15 min',
          description: '2 min easy, 1 min moderate (increase resistance), 1 min fast, repeat 3x, finish with 2 min easy.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Gradual resistance increases help beginners adapt to full-body assault bike movement.'
        }
      ],
      intermediate: [
        {
          name: 'Sprint & Recover',
          duration: '18 min',
          description: '20 sec sprint, 40 sec easy, repeat 10x, 5 min moderate.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Classic 1:2 work-to-rest ratio challenges intermediate full-body power and recovery.'
        },
        {
          name: 'Ladder Intervals',
          duration: '20 min',
          description: '30 sec sprint, 1 min easy, 45 sec sprint, 1 min easy, 1 min sprint, 1 min easy, repeat sequence.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive interval lengths challenge intermediate athletes with increasing demands.'
        }
      ],
      advanced: [
        {
          name: 'Tabata Assault',
          duration: '16 min',
          description: '8 rounds: 20 sec max effort, 10 sec rest, 2 min easy, repeat for 2 cycles.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Tabata on assault bike demands maximum full-body power and elite anaerobic capacity.'
        },
        {
          name: 'EMOM Challenge',
          duration: '20 min',
          description: 'Every minute: 20 sec sprint, 40 sec moderate, repeat for 20 min.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended EMOM format tests advanced endurance under consistent high-intensity demands.'
        }
      ]
    }
  },
  {
    equipment: 'Row machine',
    icon: 'boat',
    workouts: {
      beginner: [
        {
          name: 'Row & Rest',
          duration: '12 min',
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals with rest periods make this ideal for beginners learning rowing technique and building base endurance.'
        },
        {
          name: 'Stroke Play',
          duration: '15 min',
          description: '2 min steady (22 SPM), 1 min fast (28 SPM), 2 min slow (20 SPM), repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Varied stroke rates help beginners develop rhythm control while building steady cardiovascular base.'
        }
      ],
      intermediate: [
        {
          name: 'Power Intervals',
          duration: '20 min',
          description: '1 min hard (28 SPM), 2 min moderate (24 SPM), 1 min slow (20 SPM), repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternates between power strokes and recovery periods, perfect for building intermediate strength and endurance.'
        },
        {
          name: 'Pyramid Row',
          duration: '25 min',
          description: '1 min easy, 1 min hard, 2 min easy, 2 min hard, 3 min easy, 3 min hard, then back down.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive time intervals challenge intermediate rowers with increasing demands on both power and mental focus.'
        }
      ],
      advanced: [
        {
          name: 'Sprint & Recover',
          duration: '20 min',
          description: '30 sec sprint (32 SPM), 1 min moderate (24 SPM), repeat 10x.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints at 32 SPM demand maximum power output and anaerobic capacity from advanced rowers.'
        },
        {
          name: 'Endurance Builder',
          duration: '30 min',
          description: '5 min easy, 10 min moderate, 5 min hard, 5 min fast, 5 min cool-down.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended duration with progressive intensity builds elite-level cardiovascular endurance and mental toughness.'
        }
      ]
    }
  },
  {
    equipment: 'Stair master',
    icon: 'trending-up',
    workouts: {
      beginner: [
        {
          name: 'Step & Recover',
          duration: '12 min',
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle step intervals with recovery periods help beginners build leg strength and cardiovascular base safely.'
        },
        {
          name: 'Pace Changer',
          duration: '15 min',
          description: '2 min steady, 1 min double step (skip a step), 2 min slow, repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Varied stepping patterns introduce beginners to different movement patterns while maintaining moderate intensity.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Climb',
          duration: '20 min',
          description: '1 min fast, 2 min moderate, 1 min side step (face sideways), repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Mixed stepping patterns and intensities challenge intermediate users with both speed and coordination demands.'
        },
        {
          name: 'Hill Climb',
          duration: '25 min',
          description: '2 min moderate, 1 min fast, 1 min slow, 1 min double step, repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Continuous climbing with varied techniques builds intermediate-level lower body strength and endurance.'
        }
      ],
      advanced: [
        {
          name: 'Speed & Endurance',
          duration: '30 min',
          description: '2 min fast, 1 min side step, 1 min double step, 2 min moderate, repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-speed stepping with complex patterns demands advanced coordination, power, and cardiovascular fitness.'
        },
        {
          name: 'HIIT Steps',
          duration: '20 min',
          description: '30 sec sprint, 1 min moderate, 30 sec skip steps, 1 min slow, repeat 5x.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'High-intensity intervals with skip steps push advanced users to maximum power and agility limits.'
        }
      ]
    }
  },
  {
    equipment: 'Ski machine',
    icon: 'snow',
    workouts: {
      beginner: [
        {
          name: 'Ski & Glide',
          duration: '12 min',
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals with rest periods help beginners learn ski machine technique while building base fitness.'
        },
        {
          name: 'Resistance Play',
          duration: '15 min',
          description: '2 min steady (resistance 3), 1 min moderate (resistance 5), 2 min slow (resistance 2), repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Varied resistance levels introduce beginners to full-body ski motion gradually.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Ski',
          duration: '18 min',
          description: '1 min hard, 2 min moderate, 1 min slow, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Interval structure challenges intermediate users with varying intensity demands on full-body coordination.'
        },
        {
          name: 'Pyramid Ski',
          duration: '20 min',
          description: '1 min easy, 1 min hard, 2 min easy, 2 min hard, 3 min easy, 3 min hard.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive time increases test intermediate endurance and mental focus during sustained efforts.'
        }
      ],
      advanced: [
        {
          name: 'Sprint & Recover',
          duration: '20 min',
          description: '30 sec sprint, 1 min moderate, repeat 10x.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints demand maximum power and coordination from advanced full-body athletes.'
        },
        {
          name: 'HIIT Ski',
          duration: '16 min',
          description: '8 rounds: 20 sec max effort, 10 sec rest, 2 min easy, repeat for 2 cycles.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Tabata-style intervals push advanced users to maximum anaerobic capacity with full-body engagement.'
        }
      ]
    }
  },
  {
    equipment: 'Curve treadmill',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Walk & Jog',
          duration: '12 min',
          description: '2 min walk, 1 min jog, 2 min walk, 1 min jog, repeat 2x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Self-powered curve treadmill naturally moderates pace, perfect for beginners learning running form.'
        },
        {
          name: 'Speed Play',
          duration: '15 min',
          description: '1 min walk, 30 sec jog, 1 min walk, 30 sec fast walk, repeat 4x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Variable pace work helps beginners understand effort control on self-powered equipment.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Run',
          duration: '18 min',
          description: '1 min run, 2 min walk, 1 min fast run, 2 min walk, repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Interval structure on curve treadmill challenges intermediate runners with self-regulated intensity.'
        },
        {
          name: 'Pyramid Pace',
          duration: '20 min',
          description: '1 min walk, 1 min jog, 1 min run, 1 min jog, 1 min walk, repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive pace pyramids develop intermediate pacing skills on self-powered running surface.'
        }
      ],
      advanced: [
        {
          name: 'Sprint Intervals',
          duration: '20 min',
          description: '20 sec sprint, 40 sec walk, repeat 15x.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints on curve treadmill demand maximum power output and advanced running mechanics.'
        },
        {
          name: 'EMOM Challenge',
          duration: '15 min',
          description: 'Every minute: 20 sec sprint, 40 sec moderate jog, repeat for 15 min.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Sustained high-intensity work tests advanced cardiovascular capacity with self-regulated pace control.'
        }
      ]
    }
  },
  {
    equipment: 'Punching bag',
    icon: 'hand-left',
    workouts: {
      beginner: [
        {
          name: 'Combo Builder',
          duration: '10 min',
          description: '30 sec jab-cross, 30 sec rest, 30 sec jab-cross-hook, 30 sec rest, repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Basic combinations with rest allow beginners to learn proper punching form while building cardio base.'
        },
        {
          name: 'Movement Mix',
          duration: '12 min',
          description: '30 sec light punches, 30 sec footwork (move around bag), 30 sec rest, repeat 4x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Combines punching with movement patterns to introduce beginners to boxing cardio safely.'
        }
      ],
      intermediate: [
        {
          name: 'Power Rounds',
          duration: '15 min',
          description: '1 min combos (jab-cross-hook-uppercut), 30 sec rest, 1 min power punches, 30 sec rest, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Complex combinations and power work challenge intermediate coordination and cardiovascular fitness.'
        },
        {
          name: 'Speed & Defense',
          duration: '16 min',
          description: '30 sec fast punches, 30 sec slips/ducks, 30 sec rest, repeat 6x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Speed work plus defensive movement develops intermediate boxing skills and agility.'
        }
      ],
      advanced: [
        {
          name: 'HIIT Boxing',
          duration: '20 min',
          description: '45 sec max effort combos, 15 sec rest, repeat 15x.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity intervals demand maximum power, speed, and coordination from advanced fighters.'
        },
        {
          name: 'Endurance Rounds',
          duration: '20 min',
          description: '2 min all-out, 1 min rest, 2 min footwork & defense, 1 min rest, repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended rounds test advanced cardiovascular endurance under high-skill technical demands.'
        }
      ]
    }
  },
  {
    equipment: 'Vertical Climber',
    icon: 'triangle',
    workouts: {
      beginner: [
        {
          name: 'Climb & Rest',
          duration: '10 min',
          description: '1 min climb, 1 min rest, repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Equal work-to-rest ratio helps beginners adapt to full-body climbing motion safely.'
        },
        {
          name: 'Pace Play',
          duration: '12 min',
          description: '30 sec slow, 30 sec moderate, 30 sec fast, 30 sec rest, repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Varied pace work introduces beginners to different climbing intensities with adequate recovery.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Climb',
          duration: '15 min',
          description: '1 min hard, 1 min moderate, 1 min slow, repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Sustained interval structure challenges intermediate full-body endurance and coordination.'
        },
        {
          name: 'Ladder Climb',
          duration: '18 min',
          description: '30 sec fast, 1 min moderate, 30 sec slow, repeat 6x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Variable interval lengths develop intermediate pacing skills during vertical climbing movement.'
        }
      ],
      advanced: [
        {
          name: 'Sprint & Recover',
          duration: '20 min',
          description: '20 sec sprint, 40 sec moderate, repeat 15x.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints demand maximum full-body power and advanced climbing coordination.'
        },
        {
          name: 'Endurance Climb',
          duration: '20 min',
          description: '2 min hard, 1 min moderate, repeat 6x.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended hard efforts test advanced cardiovascular endurance during sustained vertical climbing.'
        }
      ]
    }
  },
  {
    equipment: 'Jump rope',
    icon: 'git-compare',
    workouts: {
      beginner: [
        {
          name: 'Jump & Rest',
          duration: '10 min',
          description: '30 sec jump, 30 sec rest, repeat 10x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Equal jump-to-rest ratio allows beginners to build coordination and cardio base safely.'
        },
        {
          name: 'Skill Builder',
          duration: '12 min',
          description: '20 sec jump, 20 sec high knees, 20 sec rest, repeat 6x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Combines basic jumping with high knees to develop beginner coordination and rhythm.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Jumps',
          duration: '15 min',
          description: '1 min jump, 30 sec rest, 1 min high knees, 30 sec rest, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Extended work periods challenge intermediate cardiovascular fitness and jumping coordination.'
        },
        {
          name: 'Combo Rounds',
          duration: '16 min',
          description: '30 sec jump, 30 sec double-unders, 30 sec rest, repeat 6x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Double-unders add skill complexity and intensity for intermediate rope jumping development.'
        }
      ],
      advanced: [
        {
          name: 'HIIT Rope',
          duration: '20 min',
          description: '40 sec double-unders, 20 sec rest, repeat 15x.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Extended double-unders demand advanced coordination, speed, and anaerobic power.'
        },
        {
          name: 'Endurance Challenge',
          duration: '20 min',
          description: '2 min jump, 1 min high knees, 1 min crossovers, 1 min rest, repeat 4x.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Complex movement patterns with minimal rest test advanced cardiovascular endurance and skill.'
        }
      ]
    }
  }
];

interface WorkoutCardProps {
  equipment: string;
  icon: keyof typeof Ionicons.glyphMap;
  workouts: Workout[];
  difficulty: string;
  difficultyColor: string;
}

const WorkoutCard = ({ equipment, icon, workouts, difficulty, difficultyColor }: WorkoutCardProps) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderWorkout = ({ item, index }: { item: Workout; index: number }) => (
    <View style={[styles.workoutSlide, { width: width - 48 }]}>
      {/* Workout Image */}
      <View style={styles.workoutImageContainer}>
        <Image 
          source={{ uri: item.imageUrl }}
          style={styles.workoutImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
        <View style={styles.swipeIndicator}>
          <Ionicons name="swap-horizontal" size={20} color="#FFD700" />
          <Text style={styles.swipeText}>Swipe for more</Text>
        </View>
      </View>

      {/* Workout Content */}
      <View style={styles.workoutContent}>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutTitleContainer}>
            <Text style={styles.workoutName}>{item.name}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Text style={styles.difficultyBadgeText}>{difficulty.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.workoutDuration}>{item.duration}</Text>
        </View>

        {/* Intensity Reason */}
        <View style={styles.intensityContainer}>
          <Ionicons name="information-circle" size={16} color="#FFD700" />
          <Text style={styles.intensityReason}>{item.intensityReason}</Text>
        </View>

        {/* Workout Description */}
        <ScrollView style={styles.workoutDescriptionContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.workoutDescription}>{item.description}</Text>
        </ScrollView>
      </View>
    </View>
  );

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentWorkoutIndex(viewableItems[0].index);
    }
  };

  return (
    <View style={styles.workoutCard}>
      {/* Equipment Header */}
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentIconContainer}>
          <Ionicons name={icon} size={24} color="#FFD700" />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <View style={styles.workoutIndicator}>
          <Text style={styles.workoutCount}>{currentWorkoutIndex + 1}/2</Text>
        </View>
      </View>

      {/* Swipeable Workouts */}
      <FlatList
        ref={flatListRef}
        data={workouts}
        renderItem={renderWorkout}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={styles.workoutList}
      />

      {/* Enhanced Dots Indicator */}
      <View style={styles.dotsContainer}>
        <Text style={styles.dotsLabel}>Swipe to explore</Text>
        <View style={styles.dotsRow}>
          {workouts.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                currentWorkoutIndex === index && styles.activeDot
              ]}
              onPress={() => {
                flatListRef.current?.scrollToIndex({ index, animated: true });
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default function WorkoutDisplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Parse parameters with error handling and proper URL decoding
  const equipmentParam = params.equipment as string || '';
  let selectedEquipmentNames: string[] = [];
  
  try {
    if (equipmentParam) {
      // Decode URL-encoded parameter and split by comma
      const decodedEquipment = decodeURIComponent(equipmentParam);
      selectedEquipmentNames = decodedEquipment.split(',').map(name => name.trim());
    }
  } catch (error) {
    console.error('Error parsing equipment parameter:', error);
    // Fallback to default equipment for testing
    selectedEquipmentNames = ['Treadmill'];
  }
  
  const difficulty = (params.difficulty as string || 'beginner').toLowerCase();
  const moodTitle = params.mood as string || 'I want to sweat';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle });

  // Get difficulty color - using gold brand variations
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#FFD700';    // Gold for beginners
      case 'intermediate': return '#FFA500'; // Dark gold for intermediate  
      case 'advanced': return '#B8860B';     // Dark golden rod for advanced
      default: return '#FFD700';
    }
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment
  const userWorkouts = workoutDatabase.filter(item => 
    selectedEquipmentNames.includes(item.equipment)
  );

  console.log('Debug info:', {
    selectedEquipmentNames,
    workoutDatabaseEquipment: workoutDatabase.map(w => w.equipment),
    userWorkouts: userWorkouts.map(w => w.equipment),
    userWorkoutsLength: userWorkouts.length
  });

  // Remove any potential duplicates
  const uniqueUserWorkouts = userWorkouts.filter((workout, index, self) => 
    index === self.findIndex(w => w.equipment === workout.equipment)
  );

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Your Workouts</Text>
          <Text style={styles.headerSubtitle}>{moodTitle} • {difficulty}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressContent}
        >
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="flame" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="heart" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Cardio Based</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Text style={styles.progressStepNumberActive}>
                {selectedEquipmentNames.length}
              </Text>
            </View>
            <Text style={styles.progressStepText}>
              Equipment ({selectedEquipmentNames.length})
            </Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="checkmark" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="fitness" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Workouts</Text>
          </View>
        </ScrollView>
      </View>

      {/* Workout Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>
          {uniqueUserWorkouts.length} Equipment • {uniqueUserWorkouts.length * 2} Workouts
        </Text>
        <Text style={styles.summarySubtitle}>
          Swipe left/right on each card to see both workout options
        </Text>
      </View>

      {/* Workouts List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {uniqueUserWorkouts.map((equipmentData, index) => {
          console.log(`Rendering card ${index + 1}:`, equipmentData.equipment);
          return (
            <View key={`container-${equipmentData.equipment}`} style={styles.workoutCardContainer}>
              <WorkoutCard
                key={`workout-card-${equipmentData.equipment}-${index}`}
                equipment={equipmentData.equipment}
                icon={equipmentData.icon}
                workouts={equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts]}
                difficulty={difficulty}
                difficultyColor={difficultyColor}
              />
            </View>
          );
        })}
      </ScrollView>
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
  progressContainer: {
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  progressContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 80,
  },
  progressStepActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  progressStepNumberActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressStepText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 80,
  },
  progressConnector: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 8,
    marginTop: 16,
  },
  summaryContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  workoutCardContainer: {
    marginBottom: 30,
    width: '100%',
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
    marginBottom: 30,
    width: '100%',
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  equipmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  equipmentName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  workoutList: {
    height: 350,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  workoutImageContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  swipeText: {
    fontSize: 11,
    color: '#FFD700',
    marginLeft: 4,
    fontSizes: '600',
  },
  workoutContent: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  workoutDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
  },
  intensityReason: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
    flex: 1,
    fontStyle: 'italic',
  },
  workoutDescriptionContainer: {
    flex: 1,
  },
  workoutDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  dotsLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
});