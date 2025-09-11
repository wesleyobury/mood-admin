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

// Complete workout database with all 12 equipment types and MOOD tips
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Treadmill',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Walk & Jog Mixer',
          duration: '20 min',
          description: '• 5 min walk (3.5 mph)\n• 3 min jog (5 mph)\n• 2 min walk (3 mph)\n• 4 min jog (5.2 mph)\n• 3 min walk (3.5 mph)\n• 3 min jog (5 mph)',
          imageUrl: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction with walk-jog intervals that build endurance gradually without overwhelming new exercisers.',
          moodTips: [
            {
              icon: 'body',
              title: 'Posture & Form',
              description: 'Stay tall, no rail-holding; land mid-foot to protect knees.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Pattern',
              description: 'Breathe rhythmically: 3 steps inhale, 2 steps exhale.'
            }
          ]
        },
        {
          name: 'Rolling Hills',
          duration: '20 min',
          description: '• 3 min walk (3.5 mph)\n• 4 min incline walk (3.8 mph, 4% incline)\n• 2 min walk (3.5 mph)\n• 5 min incline walk (4 mph, 6% incline)\n• 3 min walk (3.5 mph)\n• 3 min incline walk (3.8 mph, 3% incline)',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHx3YWxraW5nJTIwdHJlYWRtaWxsfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle incline progression helps beginners build leg strength and cardiovascular endurance safely.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Incline Technique',
              description: 'Shorten stride, drive knees on inclines; avoid leaning.'
            },
            {
              icon: 'refresh',
              title: 'Core Engagement',
              description: 'Engage core for posture; use arms for momentum.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Speed Ladder',
          duration: '25 min',
          description: '• 3 min jog (5.5 mph)\n• 2 min run (6.5 mph)\n• 1 min fast run (7.5 mph)\n• 2 min walk (3.5 mph\n• incline 3%)\n• repeat 3x\n• finish with 3 min jog (5.5 mph)',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressively increases speed while maintaining good recovery periods for intermediate fitness levels.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Cadence Focus',
              description: 'Increase cadence, not stride length, for speed.'
            },
            {
              icon: 'eye',
              title: 'Posture & Breathing',
              description: 'Gaze forward, shoulders relaxed for open lungs.'
            }
          ]
        },
        {
          name: 'Incline Intervals',
          duration: '30 min',
          description: '• 2 min run (6.0 mph, incline 1%)\n• 1 min run (6.0 mph, incline 5%)\n• 2 min walk (3.5 mph, incline 2%)\n• Repeat 5x\n• Finish with 3 min walk (3.0 mph)',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Combines consistent running pace with challenging inclines to build both cardiovascular and muscular endurance.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Glute Drive',
              description: 'Drive through glutes on inclines; keep upper body loose.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Breathing',
              description: 'Use walk intervals for deep, belly-focused recovery breaths.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Sprint Pyramid',
          duration: '30 min',
          description: '• 2 min jog (6.0 mph)\n• 30 sec sprint (9.0 mph)\n• 1 min jog\n• 45 sec sprint\n• 1 min jog\n• 1 min sprint\n• 2 min jog\n• repeat pyramid\n• finish with 5 min incline walk (4.0 mph\n• incline 8%)',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints at 9.0 mph challenge maximum cardiovascular capacity and anaerobic power.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Technique',
              description: 'Explode from balls of feet; quick, short steps for sprints.'
            },
            {
              icon: 'refresh',
              title: 'Active Recovery',
              description: 'Jogs are active recovery; shake out limbs, control breathing.'
            }
          ]
        },
        {
          name: 'Tempo & Hill Challenge',
          duration: '35 min',
          description: '• 5 min warm-up (jog)\n• 10 min tempo run (7.0 mph\n• incline 2%)\n• 5 x 1 min hill sprints (8.0 mph\n• incline 6%\n• 1 min walk between)\n• 5 min cool-down',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Extended tempo runs plus high-intensity hill sprints demand advanced cardiovascular fitness and mental toughness.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Tempo Control',
              description: '"Comfortably hard" tempo; set incline changes beforehand.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Technique',
              description: 'Drive through glutes on hills; maintain steady, deep breathing.'
            }
          ]
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
          description: '• 3 min easy (resistance 3)\n• 2 min moderate (resistance 6)\n• 1 min fast (resistance 4)\n• repeat 4x\n• finish with 3 min easy (resistance 2)',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Low-impact movement with gentle resistance changes, ideal for building cardio base without joint stress.',
          moodTips: [
            {
              icon: 'body',
              title: 'Heel Engagement',
              description: 'Heels down throughout stride for glute engagement.'
            },
            {
              icon: 'fitness',
              title: 'Posture & Power',
              description: 'Upright posture; 70% power from legs, light grip on handles.'
            }
          ]
        },
        {
          name: 'Cadence Play',
          duration: '18 min',
          description: '• 2 min steady (RPM 55)\n• 1 min fast (RPM 70)\n• 2 min moderate (RPM 60)\n• 1 min slow (RPM 50\n• resistance 5)\n• repeat 3x',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Moderate RPM variations help beginners learn rhythm control while building steady-state endurance.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Breathing Rhythm',
              description: 'Match breathing to RPM; smooth, circular motion.'
            },
            {
              icon: 'body',
              title: 'Chest Position',
              description: 'Keep chest lifted; avoid folding forward.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Climb & Sprint',
          duration: '25 min',
          description: '• 2 min moderate (resistance 5)\n• 1 min climb (resistance 10)\n• 1 min sprint (resistance 4\n• RPM 80+)\n• repeat 5x\n• finish with 3 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternates between high resistance climbs and fast sprints to challenge both strength and speed.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Climb Technique',
              description: 'Push through heels on climbs; drive knees higher.'
            },
            {
              icon: 'flash',
              title: 'Sprint Focus',
              description: 'Sprints are for cadence, not just resistance; light grip.'
            }
          ]
        },
        {
          name: 'Reverse & Forward',
          duration: '30 min',
          description: '• 3 min forward (resistance 6)\n• 2 min reverse (resistance 4)\n• 1 min sprint (forward\n• resistance 5)\n• repeat 4x\n• finish with 2 min easy',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Direction changes engage different muscle groups while maintaining consistent cardiovascular demand.',
          moodTips: [
            {
              icon: 'body',
              title: 'Core Control',
              description: 'Core tight, avoid knee overextension in reverse.'
            },
            {
              icon: 'refresh',
              title: 'Direction Switch',
              description: 'Exhale fully when switching direction to reset rhythm.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tabata Elliptical',
          duration: '24 min',
          description: '• 8 rounds: 20 sec max effort (resistance 8)\n• 10 sec easy (resistance 3)\n• 2 min recovery\n• repeat for 3 cycles',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Tabata protocol demands maximum effort bursts, pushing VO2 max and anaerobic capacity to limits.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Max Effort',
              description: 'Explode into each 20-sec effort; no pacing.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Form',
              description: 'Stay loose in shoulders; use recovery for deep breaths.'
            }
          ]
        },
        {
          name: 'Endurance Builder',
          duration: '35 min',
          description: '• 5 min easy\n• 10 min moderate (resistance 7)\n• 5 min hard (resistance 10)\n• 5 min fast (resistance 5\n• RPM 80+)\n• 5 min reverse (resistance 6)\n• 5 min cool-down',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Long duration with varied intensities tests cardiovascular endurance and mental resilience.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Energy Management',
              description: 'Conserve energy early; focus on consistent effort.'
            },
            {
              icon: 'refresh',
              title: 'Reverse Control',
              description: 'Control momentum in reverse for targeted muscle work.'
            }
          ]
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
          description: '• 2 min easy (resistance 2)\n• 1 min moderate (resistance 4)\n• 1 min fast (resistance 2)\n• repeat 3x\n• finish with 2 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals with varied resistance help beginners build upper body endurance gradually.',
          moodTips: [
            {
              icon: 'body',
              title: 'Wrist & Elbow',
              description: 'Keep elbows soft, wrists neutral; avoid locking out.'
            },
            {
              icon: 'fitness',
              title: 'Core Stability',
              description: 'Engage core for stability; maintain even, smooth cadence.'
            }
          ]
        },
        {
          name: 'Interval Builder',
          duration: '15 min',
          description: '• 1 min easy\n• 1 min moderate\n• 30 sec fast\n• 1 min easy\n• 1 min reverse\n• repeat 3x',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Basic interval structure with reverse motion introduces beginners to upper body cardio safely.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Pull Technique',
              description: 'Pull, don\'t just push, in reverse sets.'
            },
            {
              icon: 'body',
              title: 'Breathing Control',
              description: 'Focus on controlled breathing to match effort.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Pyramid Challenge',
          duration: '18 min',
          description: '• 1 min easy\n• 1 min moderate\n• 1 min hard\n• 1 min moderate\n• 1 min easy\n• repeat 3x',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive intensity pyramid challenges intermediate upper body strength and endurance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Speed Efficiency',
              description: 'Shorten strokes at faster speeds for efficiency.'
            },
            {
              icon: 'body',
              title: 'Core Bracing',
              description: 'Keep core braced; avoid leaning or rocking.'
            }
          ]
        },
        {
          name: 'Reverse & Forward',
          duration: '20 min',
          description: '• 2 min forward (resistance 5)\n• 1 min reverse (resistance 3)\n• 1 min sprint (forward\n• resistance 4)\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternating directions engage different muscle groups while building intermediate cardiovascular capacity.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Grip Variation',
              description: 'Alternate hand grip to balance muscle use.'
            },
            {
              icon: 'body',
              title: 'Smooth Transitions',
              description: 'Stay braced in core; smooth transitions between directions.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'HIIT Sprints',
          duration: '20 min',
          description: '• 30 sec max effort (resistance 8)\n• 1 min easy (resistance 3)\n• repeat 10x\n• finish with 5 min moderate',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxhcm0lMjBiaWN5Y2xlJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints demand maximum upper body power and anaerobic capacity.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Shoulder Power',
              description: 'Attack sprints from shoulders, not just arms.'
            },
            {
              icon: 'refresh',
              title: 'Deep Recovery',
              description: 'Use recovery for deep, diaphragmatic breathing.'
            }
          ]
        },
        {
          name: 'Endurance & Power',
          duration: '25 min',
          description: '• 5 min moderate\n• 10 x 30 sec sprint (resistance 10) with 30 sec easy\n• 5 min reverse\n• 5 min cool-down',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended power intervals with reverse work test advanced upper body endurance and strength.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Speed Focus',
              description: 'Sprints: focus on speed turnover, not just resistance.'
            },
            {
              icon: 'body',
              title: 'Posture Control',
              description: 'Reverse block improves posture; maintain control.'
            }
          ]
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
          description: '• 3 min easy (resistance 2)\n• 2 min moderate (resistance 5)\n• 1 min fast (resistance 3)\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzdGF0aW9uYXJ5JTIwYmlrZSUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle resistance changes help beginners build leg strength and cardiovascular base.',
          moodTips: [
            {
              icon: 'bicycle',
              title: 'Seat Height',
              description: 'Adjust seat height so legs get nearly full extension'
            },
            {
              icon: 'settings',
              title: 'Glute Power',
              description: 'Drive from glutes; maintain smooth, light cadence (70+ RPM).'
            }
          ]
        },
        {
          name: 'Cadence Intervals',
          duration: '18 min',
          description: '• 2 min steady (70 RPM)\n• 1 min fast (90 RPM)\n• 2 min moderate (80 RPM)\n• 1 min slow (60 RPM\n• resistance 6)\n• repeat 3x',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'RPM variations teach beginners pedaling rhythm while maintaining moderate intensity.',
          moodTips: [
            {
              icon: 'bicycle',
              title: 'Seat Height',
              description: 'Adjust seat height so legs get nearly full extension'
            },
            {
              icon: 'body',
              title: 'Core Stability',
              description: 'Engage core to prevent bouncing in saddle at high RPMs.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Hill & Sprint',
          duration: '25 min',
          description: '• 2 min moderate (resistance 6)\n• 1 min hill (resistance 10)\n• 1 min sprint (resistance 4\n• 100+ RPM)\n• repeat 5x',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternates between strength-building hills and speed-focused sprints for balanced intermediate training.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Hip Position',
              description: 'Shift hips back on climbs, push through heels.'
            },
            {
              icon: 'flash',
              title: 'Sprint Cadence',
              description: 'Sprints: high, consistent cadence; avoid stomping.'
            }
          ]
        },
        {
          name: 'Pyramid Ride',
          duration: '30 min',
          description: '• 3 min easy\n• 2 min moderate\n• 1 min hard\n• 2 min moderate\n• 3 min easy\n• repeat 3x',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive intensity pyramids challenge intermediate riders with sustained effort periods.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Active Recovery',
              description: 'Moderate phases are active recovery; track cadence.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Rhythm',
              description: 'Use strong, steady breathing to maintain rhythm.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tabata Bike',
          duration: '24 min',
          description: '• 8 rounds: 20 sec max effort (resistance 8)\n• 10 sec easy (resistance 3)\n• 2 min recovery\n• repeat for 3 cycles',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzdGF0aW9uYXJ5JTIwYmlrZSUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Tabata protocol pushes advanced cyclists to maximum anaerobic power and VO2 capacity.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Power Bursts',
              description: 'Out-of-saddle sprints for power; maintain form.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Control',
              description: 'Control breathing during recovery; don\'t fully relax.'
            }
          ]
        },
        {
          name: 'Endurance & Power',
          duration: '35 min',
          description: '• 5 min easy\n• 10 min moderate (resistance 7)\n• 5 min hard (resistance 10)\n• 5 min fast (resistance 5\n• 100+ RPM)\n• 5 min standing climb (resistance 8)\n• 5 min cool-down',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended workout with varied challenges tests advanced cardiovascular endurance and power.',
          moodTips: [
            {
              icon: 'trophy',
              title: 'Effort Pacing',
              description: 'Pace "hard" sections; drive through heels on standing climbs.'
            },
            {
              icon: 'refresh',
              title: 'Consistent Focus',
              description: 'Focus on consistent effort and smooth transitions.'
            }
          ]
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
          description: '• 1 min easy\n• 30 sec moderate\n• 1 min easy\n• 30 sec fast\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxhc3NhdWx0JTIwYmlrZSUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals introduce beginners to assault bike intensity while allowing adequate recovery.',
          moodTips: [
            {
              icon: 'sync',
              title: 'Arm-Leg Sync',
              description: 'Push and pull equally on handles; synchronize.'
            },
            {
              icon: 'settings',
              title: 'Seat Height',
              description: 'Adjust seat height so legs get nearly full extension'
            }
          ]
        },
        {
          name: 'Resistance Play',
          duration: '15 min',
          description: '• 2 min easy\n• 1 min moderate (increase resistance)\n• 1 min fast\n• repeat 3x\n• finish with 2 min easy',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Gradual resistance increases help beginners adapt to full-body assault bike movement.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Seat Height',
              description: 'Adjust seat height so legs get nearly full extension'
            },
            {
              icon: 'body',
              title: 'Leg Priority',
              description: 'Use legs as primary driver, especially when fatigued.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Sprint & Recover',
          duration: '18 min',
          description: '• 20 sec sprint\n• 40 sec easy\n• repeat 10x\n• 5 min moderate',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Classic 1:2 work-to-rest ratio challenges intermediate full-body power and recovery.',
          moodTips: [
            {
              icon: 'flash',
              title: 'All-Out Effort',
              description: 'Go all out on sprints; don\'t hold back.'
            },
            {
              icon: 'refresh',
              title: 'RPM Control',
              description: 'Steady RPM in recovery; don\'t slow too much.'
            }
          ]
        },
        {
          name: 'Ladder Intervals',
          duration: '20 min',
          description: '• 30 sec sprint\n• 1 min easy\n• 45 sec sprint\n• 1 min easy\n• 1 min sprint\n• 1 min easy\n• repeat sequence',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive interval lengths challenge intermediate athletes with increasing demands.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Mini-Max Effort',
              description: 'Treat each sprint as a mini-max effort.'
            },
            {
              icon: 'body',
              title: 'Core Control',
              description: 'Brace core to control upper-body movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tabata Assault',
          duration: '16 min',
          description: '• 8 rounds: 20 sec max effort\n• 10 sec rest\n• 2 min easy\n• repeat for 2 cycles',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxhc3NhdWx0JTIwYmlrZSUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Tabata on assault bike demands maximum full-body power and elite anaerobic capacity.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Start',
              description: 'Explode at start of each 20-sec bout.'
            },
            {
              icon: 'refresh',
              title: 'Active Phases',
              description: 'Don\'t coast; easy phases should still move.'
            }
          ]
        },
        {
          name: 'EMOM Challenge',
          duration: '20 min',
          description: '• Every minute: 20 sec sprint\n• 40 sec moderate\n• repeat for 20 min',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended EMOM format tests advanced endurance under consistent high-intensity demands.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Fresh Set Approach',
              description: 'Attack each sprint as a fresh set.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Window',
              description: 'Use moderate window to find breathing rhythm.'
            }
          ]
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
          description: '• 1 min easy\n• 30 sec moderate\n• 1 min easy\n• 30 sec fast\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxyb3dpbmclMjBtYWNoaW5lJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODM2NTJ8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals with rest periods make this ideal for beginners learning rowing technique and building base endurance.',
          moodTips: [
            {
              icon: 'boat',
              title: 'Sequence Form',
              description: 'Legs, then hips, then arms; reverse for recovery.'
            },
            {
              icon: 'body',
              title: 'Chain Position',
              description: 'Keep chain at mid-chest; spine neutral, eyes forward.'
            }
          ]
        },
        {
          name: 'Stroke Play',
          duration: '15 min',
          description: '• 2 min steady (22 SPM)\n• 1 min fast (28 SPM)\n• 2 min slow (20 SPM)\n• repeat 3x',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Varied stroke rates help beginners develop rhythm control while building steady cardiovascular base.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Recovery Control',
              description: 'Control recovery (2x drive time); conserve energy.'
            },
            {
              icon: 'speedometer',
              title: 'Breathing Match',
              description: 'Match stroke rate with breathing; smooth transitions.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Intervals',
          duration: '20 min',
          description: '• 1 min hard (28 SPM)\n• 2 min moderate (24 SPM)\n• 1 min slow (20 SPM)\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternates between power strokes and recovery periods, perfect for building intermediate strength and endurance.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Explosive Drive',
              description: 'Drive explosively from heels (60% legs, 30% core, 10% arms).'
            },
            {
              icon: 'settings',
              title: 'Form Drills',
              description: 'Use slower segments for perfect form drills.'
            }
          ]
        },
        {
          name: 'Pyramid Row',
          duration: '25 min',
          description: '• 1 min easy\n• 1 min hard\n• 2 min easy\n• 2 min hard\n• 3 min easy\n• 3 min hard\n• then back down',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive time intervals challenge intermediate rowers with increasing demands on both power and mental focus.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Stroke Control',
              description: 'Control stroke rate (20-26 SPM); avoid wild pulling.'
            },
            {
              icon: 'refresh',
              title: 'Core Breathing',
              description: 'Strong belly breathing to stabilize core on hard stretches.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Sprint & Recover',
          duration: '20 min',
          description: '• 30 sec sprint (32 SPM)\n• 1 min moderate (24 SPM)\n• repeat 10x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxyb3dpbmclMjBtYWNoaW5lJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODM2NTJ8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints at 32 SPM demand maximum power output and anaerobic capacity from advanced rowers.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Grip Relaxation',
              description: 'Snap at the catch for power; relax grip.'
            },
            {
              icon: 'refresh',
              title: 'Quick Rhythm',
              description: 'Quick rhythm, but complete each stroke fully.'
            }
          ]
        },
        {
          name: 'Endurance Builder',
          duration: '30 min',
          description: '• 5 min easy\n• 10 min moderate\n• 5 min hard\n• 5 min fast\n• 5 min cool-down',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended duration with progressive intensity builds elite-level cardiovascular endurance and mental toughness.',
          moodTips: [
            {
              icon: 'trophy',
              title: 'Split Consistency',
              description: 'Consistent split time across zones; focus on efficiency.'
            },
            {
              icon: 'refresh',
              title: 'Deep Breathing',
              description: 'Maintain steady, deep breathing throughout.'
            }
          ]
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
          description: '• 1 min easy\n• 30 sec moderate\n• 1 min easy\n• 30 sec fast\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzdGFpcm1hc3RlciUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle step intervals with recovery periods help beginners build leg strength and cardiovascular base safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Full Foot',
              description: 'Push through full foot, not just toes.'
            },
            {
              icon: 'trending-up',
              title: 'Upright Posture',
              description: 'Stay upright; avoid leaning heavily on rails.'
            }
          ]
        },
        {
          name: 'Pace Changer',
          duration: '15 min',
          description: '• 2 min steady\n• 1 min double step (skip a step)\n• 2 min slow\n• repeat 3x',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Varied stepping patterns introduce beginners to different movement patterns while maintaining moderate intensity.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Glute Engagement',
              description: 'Double steps: engage glutes deliberately.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Control',
              description: 'Use slow phases to regain breathing control.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Interval Climb',
          duration: '20 min',
          description: '• 1 min fast\n• 2 min moderate\n• 1 min side step (face sideways)\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Mixed stepping patterns and intensities challenge intermediate users with both speed and coordination demands.',
          moodTips: [
            {
              icon: 'body',
              title: 'Side Step Form',
              description: 'Side steps: keep knees soft, engage outer glutes.'
            },
            {
              icon: 'flash',
              title: 'Arm Swing',
              description: 'Strong arm swing aids rhythm and balance.'
            }
          ]
        },
        {
          name: 'Hill Climb',
          duration: '25 min',
          description: '• 2 min moderate\n• 1 min fast\n• 1 min slow\n• 1 min double step\n• repeat 5x',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Continuous climbing with varied techniques builds intermediate-level lower body strength and endurance.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Double Step Power',
              description: 'Treat double steps as strength work.'
            },
            {
              icon: 'trending-up',
              title: 'Pace Maintenance',
              description: 'Don\'t let steady pace drift; maintain effort.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Speed & Endurance',
          duration: '30 min',
          description: '• 2 min fast\n• 1 min side step\n• 1 min double step\n• 2 min moderate\n• repeat 5x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzdGFpcm1hc3RlciUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-speed stepping with complex patterns demands advanced coordination, power, and cardiovascular fitness.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Rhythm Control',
              description: 'Maintain rhythm on fast sets; avoid choppy steps.'
            },
            {
              icon: 'fitness',
              title: 'Full Engagement',
              description: 'Master side/double steps for full leg engagement.'
            }
          ]
        },
        {
          name: 'HIIT Steps',
          duration: '20 min',
          description: '• 30 sec sprint\n• 90 sec moderate\n• 30 sec skip-step\n• 90 sec easy\n• repeat 5x',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'High-intensity intervals with plyometric skip-steps challenge advanced explosive power and recovery.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Power',
              description: 'Explode on sprint and skip-step phases.'
            },
            {
              icon: 'body',
              title: 'Light Footwork',
              description: 'Stay light-footed to protect knees.'
            }
          ]
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
          description: '• 1 min easy\n• 30 sec moderate\n• 1 min easy\n• 30 sec fast\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1551716652-ddc80b66aaae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxza2klMjBtYWNoaW5lJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODM2NTJ8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals with rest periods help beginners learn ski machine technique while building base fitness.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hip Power',
              description: 'Power from hips hinging back; use primarily lats, not just arms.'
            },
            {
              icon: 'body',
              title: 'Posture Control',
              description: 'Keep knees soft, back neutral; avoid hunching.'
            }
          ]
        },
        {
          name: 'Resistance Play',
          duration: '15 min',
          description: '• 2 min steady (resistance 3)\n• 1 min moderate (resistance 5)\n• 2 min slow (resistance 2)\n• repeat 3x',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Varied resistance levels introduce beginners to full-body ski motion gradually.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Pull Control',
              description: 'Explosive pull, smooth recovery; control downstroke.'
            },
            {
              icon: 'refresh',
              title: 'Core Breathing',
              description: 'Breathe out forcefully with each pull for core engagement.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Interval Ski',
          duration: '18 min',
          description: '• 1 min hard\n• 2 min moderate\n• 1 min slow\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Interval structure challenges intermediate users with varying intensity demands on full-body coordination.',
          moodTips: [
            {
              icon: 'body',
              title: 'Full Stroke',
              description: 'Hands finish low near thighs for full stroke.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Patience',
              description: 'Avoid rushing recovery; allow power spikes to be effective.'
            }
          ]
        },
        {
          name: 'Pyramid Ski',
          duration: '20 min',
          description: '• 1 min easy\n• 1 min hard\n• 2 min easy\n• 2 min hard\n• 3 min easy\n• 3 min hard',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive time increases test intermediate endurance and mental focus during sustained efforts.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Output Building',
              description: 'Build output slowly during longer "hard" sets.'
            },
            {
              icon: 'timer',
              title: 'Split Tracking',
              description: 'Track split time to ensure consistent performance.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Sprint & Recover',
          duration: '20 min',
          description: '• 30 sec sprint\n• 1 min moderate\n• repeat 10x',
          imageUrl: 'https://images.unsplash.com/photo-1551716652-ddc80b66aaae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxza2klMjBtYWNoaW5lJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODM2NTJ8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints demand maximum power and coordination from advanced full-body athletes.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hip Power',
              description: 'Keep arms loose; power from hips.'
            },
            {
              icon: 'flash',
              title: 'Stroke Completion',
              description: 'Quick rhythm, but don\'t cut the pull short.'
            }
          ]
        },
        {
          name: 'HIIT Ski',
          duration: '16 min',
          description: '• 8 rounds: 20 sec max effort\n• 10 sec rest\n• 2 min easy\n• repeat for 2 cycles',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Tabata-style intervals push advanced users to maximum anaerobic capacity with full-body engagement.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Pull Maximum',
              description: 'Max pulls per 20-sec interval; stay tall.'
            },
            {
              icon: 'refresh',
              title: 'Controlled Recovery',
              description: 'Controlled recovery; focus on deep breaths.'
            }
          ]
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
          description: '• 2 min walk\n• 1 min jog\n• 2 min walk\n• 1 min jog\n• repeat 2x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxjdXJ2ZSUyMHRyZWFkbWlsbCUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Self-powered curve treadmill naturally moderates pace, perfect for beginners learning running form.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Mid-Curve Control',
              description: 'Step mid-curve for control; use natural arm swing.'
            },
            {
              icon: 'trending-up',
              title: 'Belt Position',
              description: 'Stay near front of belt to maintain speed.'
            }
          ]
        },
        {
          name: 'Speed Play',
          duration: '15 min',
          description: '• 1 min walk\n• 30 sec jog\n• 1 min walk\n• 30 sec fast walk\n• repeat 4x',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Variable pace work helps beginners understand effort control on self-powered equipment.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Stride Variation',
              description: 'Short strides for jog, longer for fast walk.'
            },
            {
              icon: 'flash',
              title: 'Foot Turnover',
              description: 'Focus on light, quick foot turnover.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Interval Run',
          duration: '18 min',
          description: '• 1 min run\n• 2 min walk\n• 1 min fast run\n• 2 min walk\n• repeat 3x',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Interval structure on curve treadmill challenges intermediate runners with self-regulated intensity.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Active Reset',
              description: 'Walks are for active reset, not coasting.'
            },
            {
              icon: 'body',
              title: 'Light Impact',
              description: 'Light foot placement; avoid heavy impact.'
            }
          ]
        },
        {
          name: 'Pyramid Pace',
          duration: '20 min',
          description: '• 1 min walk\n• 1 min jog\n• 1 min run\n• 1 min jog\n• 1 min walk\n• repeat 3x',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive pace pyramids develop intermediate pacing skills on self-powered running surface.',
          moodTips: [
            {
              icon: 'sync',
              title: 'Smooth Transitions',
              description: 'Smooth transitions between paces.'
            },
            {
              icon: 'pulse',
              title: 'Heart Rate Control',
              description: 'Consciously lower heart rate during jog recovery.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Sprint Intervals',
          duration: '20 min',
          description: '• 20 sec sprint\n• 40 sec walk\n• repeat 15x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxjdXJ2ZSUyMHRyZWFkbWlsbCUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints on curve treadmill demand maximum power output and advanced running mechanics.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Acceleration',
              description: 'Explosive acceleration for each sprint.'
            },
            {
              icon: 'walk',
              title: 'Active Recovery',
              description: 'Active walk recovery; maintain cadence.'
            }
          ]
        },
        {
          name: 'EMOM Challenge',
          duration: '15 min',
          description: '• Every minute: 20 sec sprint\n• 40 sec moderate jog\n• repeat for 15 min',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Sustained high-intensity work tests advanced cardiovascular capacity with self-regulated pace control.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Fresh Sprint',
              description: 'Treat each sprint as a fresh, max effort.'
            },
            {
              icon: 'body',
              title: 'Relaxed Form',
              description: 'Relax shoulders and jaw to conserve energy.'
            }
          ]
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
          description: '• 30 sec jab-cross\n• 30 sec rest\n• 30 sec jab-cross-hook\n• 30 sec rest\n• repeat 5x',
          imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbeb7dfc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxwdW5jaGluZyUyMGJhZyUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Basic combinations with rest allow beginners to learn proper punching form while building cardio base.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hip Rotation',
              description: 'Rotate hips with punches; don\'t just arm-swing.'
            },
            {
              icon: 'shield',
              title: 'Guard Position',
              description: 'Keep guard tight between combos; protect face.'
            }
          ]
        },
        {
          name: 'Movement Mix',
          duration: '12 min',
          description: '• 30 sec light punches\n• 30 sec footwork (move around bag)\n• 30 sec rest\n• repeat 4x',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Combines punching with movement patterns to introduce beginners to boxing cardio safely.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Light Movement',
              description: 'Stay light on feet, constantly circling the bag.'
            },
            {
              icon: 'flash',
              title: 'Sharp Punches',
              description: 'Punch sharp, not pushing; snap back quickly.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Rounds',
          duration: '15 min',
          description: '• 1 min combos (jab-cross-hook-uppercut)\n• 30 sec rest\n• 1 min power punches\n• 30 sec rest\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Complex combinations and power work challenge intermediate coordination and cardiovascular fitness.',
          moodTips: [
            {
              icon: 'body',
              title: 'Power Punches',
              description: 'Sit into punches for power; brace core.'
            },
            {
              icon: 'flash',
              title: 'Clean Returns',
              description: 'Focus on crisp, clean punch return.'
            }
          ]
        },
        {
          name: 'Speed & Defense',
          duration: '16 min',
          description: '• 30 sec fast punches\n• 30 sec slips/ducks\n• 30 sec rest\n• repeat 6x',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Speed work plus defensive movement develops intermediate boxing skills and agility.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Speed Focus',
              description: 'Fast punches: focus on speed, not just power.'
            },
            {
              icon: 'body',
              title: 'Minimal Movement',
              description: 'Practice smooth slips/ducks; minimal head movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'HIIT Boxing',
          duration: '20 min',
          description: '• 45 sec max effort combos\n• 15 sec rest\n• repeat 15x',
          imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbeb7dfc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxwdW5jaGluZyUyMGJhZyUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity intervals demand maximum power, speed, and coordination from advanced fighters.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Max Combos',
              description: 'Max effort combos every round; explosive bursts.'
            },
            {
              icon: 'walk',
              title: 'Light Recovery',
              description: 'Stay light-footed during rest periods; active recovery.'
            }
          ]
        },
        {
          name: 'Endurance Rounds',
          duration: '20 min',
          description: '• 2 min all-out\n• 1 min rest\n• 2 min footwork & defense\n• 1 min rest\n• repeat 3x',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended rounds test advanced cardiovascular endurance under high-skill technical demands.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Breathing Control',
              description: 'Control breathing for sustained effort.'
            },
            {
              icon: 'body',
              title: 'Head Movement',
              description: 'Constant head movement; don\'t stay static.'
            }
          ]
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
          description: '• 1 min climb\n• 1 min rest\n• repeat 5x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHx2ZXJ0aWNhbCUyMGNsaW1iZXIlMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzY1Mnww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Equal work-to-rest ratio helps beginners adapt to full-body climbing motion safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Smooth Control',
              description: 'Smooth, controlled steps; avoid jerky movements.'
            },
            {
              icon: 'fitness',
              title: 'Leg Priority',
              description: 'Engage legs primarily; arms assist lightly.'
            }
          ]
        },
        {
          name: 'Pace Play',
          duration: '12 min',
          description: '• 30 sec slow\n• 30 sec moderate\n• 30 sec fast\n• 30 sec rest\n• repeat 3x',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Varied pace work introduces beginners to different climbing intensities with adequate recovery.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Breathing Match',
              description: 'Match breathing rhythm to pace changes.'
            },
            {
              icon: 'fitness',
              title: 'Push-Pull Sequence',
              description: 'Push with legs, then pull with arms.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Interval Climb',
          duration: '15 min',
          description: '• 1 min hard\n• 1 min moderate\n• 1 min slow\n• repeat 5x',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Sustained interval structure challenges intermediate full-body endurance and coordination.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'High Knees',
              description: 'High knees in "hard" phase for power.'
            },
            {
              icon: 'body',
              title: 'Upright Posture',
              description: 'Maintain upright posture; avoid hunching.'
            }
          ]
        },
        {
          name: 'Ladder Climb',
          duration: '18 min',
          description: '• 30 sec fast\n• 1 min moderate\n• 30 sec slow\n• repeat 6x',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Variable interval lengths develop intermediate pacing skills during vertical climbing movement.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stride Adjustment',
              description: 'Adjust stride length for different paces.'
            },
            {
              icon: 'flash',
              title: 'Steady Tension',
              description: 'Keep tension steady; avoid wasted effort.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Sprint & Recover',
          duration: '20 min',
          description: '• 20 sec sprint\n• 40 sec moderate\n• repeat 15x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHx2ZXJ0aWNhbCUyMGNsaW1iZXIlMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzY1Mnww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints demand maximum full-body power and advanced climbing coordination.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Drive',
              description: 'Explosive arm-leg drive on sprints.'
            },
            {
              icon: 'body',
              title: 'Controlled Motion',
              description: 'Slow phases: focus on controlled, deliberate motion.'
            }
          ]
        },
        {
          name: 'Endurance Climb',
          duration: '20 min',
          description: '• 2 min hard\n• 1 min moderate\n• repeat 6x',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended hard efforts test advanced cardiovascular endurance during sustained vertical climbing.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pacing Control',
              description: 'Pace yourself; don\'t peak early.'
            },
            {
              icon: 'hand-right',
              title: 'Grip Relaxation',
              description: 'Relax grip to prevent forearm burnout.'
            }
          ]
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
          description: '• 30 sec jump\n• 30 sec rest\n• repeat 10x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxqdW1wJTIwcm9wZSUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Equal work-to-rest ratio helps beginners learn proper jumping technique while building cardiovascular base.',
          moodTips: [
            {
              icon: 'body',
              title: 'Light Hops',
              description: 'Stay on balls of feet; light, small hops.'
            },
            {
              icon: 'hand-right',
              title: 'Wrist Control',
              description: 'Keep elbows tucked close; wrists turn the rope.'
            }
          ]
        },
        {
          name: 'Step Touch',
          duration: '12 min',
          description: '• 30 sec basic jump\n• 30 sec step touch (no rope)\n• 30 sec basic jump\n• 30 sec rest\n• repeat 4x',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Alternates between rope work and footwork practice to build coordination gradually.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'High Knees Form',
              description: 'Lift knees for high knees; don\'t kick heels back.'
            },
            {
              icon: 'timer',
              title: 'Speed Building',
              description: 'Start slow for coordination; build speed gradually.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Combo Jumps',
          duration: '15 min',
          description: '• 1 min basic jump\n• 30 sec alternate foot\n• 30 sec double bounce\n• 1 min rest\n• repeat 4x',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Multiple jumping patterns challenge intermediate coordination and cardiovascular fitness.',
          moodTips: [
            {
              icon: 'body',
              title: 'Soft Landing',
              description: 'Land softly to protect shins and joints.'
            },
            {
              icon: 'flash',
              title: 'Efficient Turns',
              description: 'Use short, efficient rope turns; minimize arm movement.'
            }
          ]
        },
        {
          name: 'Speed Intervals',
          duration: '18 min',
          description: '• 45 sec fast jump\n• 15 sec slow jump\n• repeat 12x',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Speed variations challenge intermediate jumpers with intense cardio demands and active recovery.',
          moodTips: [
            {
              icon: 'body',
              title: 'Shoulder Relaxation',
              description: 'Relax shoulders; prevent upper body fatigue.'
            },
            {
              icon: 'flash',
              title: 'Double-Under Technique',
              description: 'Double-unders: quick wrist snap, not higher jumps.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'HIIT Rope',
          duration: '20 min',
          description: '• 30 sec max speed\n• 10 sec rest\n• repeat 20x',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxqdW1wJTIwcm9wZSUyMHdvcmtvdXR8ZW58MXx8fHwxNzU2ODgzNjUyfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum speed intervals with minimal rest demand elite cardiovascular fitness and coordination.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Wrist Efficiency',
              description: 'Explosive wrist action for double-unders; efficiency over height.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Pattern',
              description: 'Lock in a steady, deep breathing pattern.'
            }
          ]
        },
        {
          name: 'Complex Patterns',
          duration: '18 min',
          description: '• 1 min cross-over\n• 1 min double under\n• 1 min basic jump\n• repeat 6x',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Advanced jumping patterns demand elite coordination, timing, and cardiovascular endurance.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Energy Conservation',
              description: 'Conserve energy with small, controlled jumps.'
            },
            {
              icon: 'flash',
              title: 'Crossover Technique',
              description: 'Crossovers: quick wrist snap, minimal arm swing.'
            }
          ]
        }
      ]
    }
  },
  // Weight Equipment Workouts
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Dumbbell Cardio Circuit',
          duration: '16 min',
          description: 'Perform 4 rounds (4 min each):\n• 30s goblet squat\n• 30s alternating reverse lunge\n• 30s push press\n• 30s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571390263724-7e0bd2cb3b77?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxkdW1iYmVsbCUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner circuit combining functional movements with rest periods for gradual strength building.',
          moodTips: [
            {
              icon: 'body',
              title: 'Form Focus',
              description: 'Chest tall in squats/lunges; knees track toes.'
            },
            {
              icon: 'refresh',
              title: 'Core Stability',
              description: 'Exhale hard on push press to stabilize core.'
            }
          ]
        },
        {
          name: 'Dumbbell Flow',
          duration: '15 min',
          description: 'Perform 3 rounds:\n• 8 squat to press\n• 8 alternating snatch (light)\n• 8 bent-over row\n• 1 min rest',
          imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxkdW1iYmVsbCUyMHRyYWluaW5nfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Smooth movement flow that teaches basic dumbbell transitions and builds coordination.',
          moodTips: [
            {
              icon: 'body',
              title: 'Spine Alignment',
              description: 'Neutral spine in rows; hinge at hips, not back.'
            },
            {
              icon: 'flash',
              title: 'Movement Flow',
              description: 'Smooth transitions—don\'t drop dumbbells between moves.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Dumbbell Complex',
          duration: '28–30 min',
          description: 'Perform 4 rounds:\n• 6 deadlifts\n• 6 hang cleans\n• 6 front squats\n• 6 push presses\n• 6 reverse lunges\n• Rest 1 min',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxkdW1iYmVsbCUyMGNvbXBsZXh8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Challenging complex that combines multiple movement patterns for increased strength and conditioning.',
          moodTips: [
            {
              icon: 'body',
              title: 'Grip Control',
              description: 'Reset grip/stance each move; protect wrists.'
            },
            {
              icon: 'refresh',
              title: 'Power Breathing',
              description: 'Exhale forcefully on press/lunge for power.'
            }
          ]
        },
        {
          name: 'EMOM 12',
          duration: '12 min',
          description: 'Every odd minute (for 12 minutes):\n• 10 dumbbell thrusters\nEvery even minute:\n• 12 alternating renegade rows',
          imageUrl: 'https://images.unsplash.com/photo-1598971861713-54ad16c5b44b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxkdW1iYmVsbCUyMGNpcmN1aXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Time-based intervals challenge muscular endurance and cardiovascular capacity with precise rest periods.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hip Drive',
              description: 'Thrusters—hips drive press, don\'t isolate arms.'
            },
            {
              icon: 'body',
              title: 'Core Stability',
              description: 'Renegade rows—hips stable, no twisting.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Dumbbell Ladder',
          duration: '20-24 min',
          description: '• 10-8-6-4-2 reps sequence:\nsquat clean\npush press\nburpee over dumbbell\nDo all three moves before dropping reps\nRest as needed and complete all five sets',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxkdW1iYmVsbCUyMGFkdmFuY2VkfGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Descending ladder format with complex movements demands advanced strength, power, and conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Clean Technique',
              description: 'Catch dumbbells close to shoulders, not out front.'
            },
            {
              icon: 'body',
              title: 'Landing Control',
              description: 'Controlled burpee jump—tight core, avoid sloppy landings.'
            }
          ]
        },
        {
          name: 'Dumbbell AMRAP',
          duration: '15 min',
          description: '• Max rounds in 15 min of:\n10 alternating snatches\n10 goblet jump squats\n10 push-up to row (5/side)\n10 alternating reverse lunges (holding dumbbells)',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxkdW1iYmVsbCUyMGNhcmRpb3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity AMRAP combining power movements with plyometrics for maximum metabolic challenge.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Snatch Power',
              description: 'Snatches—hips drive, lock arms overhead.'
            },
            {
              icon: 'body',
              title: 'Joint Protection',
              description: 'Land soft in squat jumps to save knees.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettle bells',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Kettlebell Swing & Carry',
          duration: '15 min',
          description: '20 sec swings\n40 sec farmer\'s carry\n1 min rest\nRepeat 5 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1566241134850-541012f1d4cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxrZXR0bGViZWxsJTIwd29ya291dHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Basic kettlebell introduction combining hip hinge movement with stability training.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hip Hinge Technique',
              description: 'Swings—hinge hips, power from glutes.'
            },
            {
              icon: 'body',
              title: 'Posture Control',
              description: 'Farmer\'s carry—shoulders back, core tight.'
            }
          ]
        },
        {
          name: 'Kettlebell Cardio Flow',
          duration: '12-15 min',
          description: '• 8 goblet squats\n8 single-arm swings each side\n8 overhead presses each side\n1 min rest\nRepeat 3 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxrZXR0bGViZWxsJTIwZmxvd3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive flow that builds kettlebell familiarity with controlled movement patterns.',
          moodTips: [
            {
              icon: 'body',
              title: 'Press Technique',
              description: 'Elbows tucked on presses.'
            },
            {
              icon: 'flash',
              title: 'Swing Control',
              description: 'Control swing arc, no forward pull.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Kettlebell Ladder',
          duration: '20-24 min',
          description: '• 10 swings\n8 cleans (4/side)\n6 snatches (3/side)\n4 goblet squats\n2 push presses each side\n1 min rest\n• repeat 4 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxrZXR0bGViZWxsJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Complex ladder format challenging coordination and strength across multiple kettlebell movements.',
          moodTips: [
            {
              icon: 'body',
              title: 'Clean Technique',
              description: 'Rotate wrist under on cleans to protect forearm.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Control',
              description: 'Exhale at top of snatch/press for core stability.'
            }
          ]
        },
        {
          name: 'Tabata Kettlebell',
          duration: '16 min',
          description: '• 20 sec work\n• 10 sec rest\nCycle: swings\n• goblet squats\n• alternating lunges\n• high pulls\n4 rounds each move (16 total intervals)',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxrZXR0bGViZWxsJTIwdGFiYXRhfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity intervals that push cardiovascular limits with varied kettlebell movements.',
          moodTips: [
            {
              icon: 'body',
              title: 'Form Under Fatigue',
              description: 'Keep spine neutral under fatigue.'
            },
            {
              icon: 'flash',
              title: 'Glute Engagement',
              description: 'Drive glutes in squats/lunges.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Kettlebell Complex',
          duration: '25-26 min',
          description: '• 6 reps each side\n• back-to-back:\nswing\nclean\nfront squat\npush press\nsnatch\nRest 1 min\n• repeat 5 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxrZXR0bGViZWxsJTIwYWR2YW5jZWR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex demanding mastery of all major kettlebell movements with minimal rest.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flow Efficiency',
              description: 'Flow smoothly with no pauses.'
            },
            {
              icon: 'body',
              title: 'Bell Control',
              description: 'Core tight; bell stays close.'
            }
          ]
        },
        {
          name: 'Kettlebell AMRAP',
          duration: '15 min',
          description: '• Max rounds in 15 min of:\n10 double swings\n8 alternating snatches\n6 goblet squat jumps\n4 Turkish get-ups (2/side)',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxrZXR0bGViZWxsJTIwYW1yYXB8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity AMRAP combining power, agility, and complex movement patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Double Swing Power',
              description: 'Double swings—engage lats, neutral wrists.'
            },
            {
              icon: 'body',
              title: 'Turkish Get-up Control',
              description: 'Turkish get-up—go slow, stack joints overhead.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Barbell Metcon',
          duration: '12-15 min',
          description: '• 8 deadlifts\n8 front squats\n8 push presses\n1 min rest\nRepeat 3 rounds (use light weight)',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxiYXJiZWxsJTIwd29ya291dHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Light barbell introduction focusing on proper movement patterns and form development.',
          moodTips: [
            {
              icon: 'body',
              title: 'Deadlift Form',
              description: 'Deadlift—bar close, hips hinge, not squat.'
            },
            {
              icon: 'fitness',
              title: 'Front Squat Technique',
              description: 'Front squat—elbows high, bar rests on shoulders.'
            }
          ]
        },
        {
          name: 'Barbell Cardio Flow',
          duration: '14-16 min',
          description: '• 6 reps each:\nhang clean\npush press\nback squat\nbent-over row\nRest 90 sec\n• repeat 3 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxiYXJiZWxsJTIwZmxvd3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Smooth barbell flow that teaches coordination between major compound movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Clean Technique',
              description: 'Cleans—triple extension, chest tall on catch.'
            },
            {
              icon: 'body',
              title: 'Row Form',
              description: 'Rows—flat back, elbows sweep to ribs.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Barbell Complex',
          duration: '28-30 min',
          description: '• 5 reps each\n• no rest between:\ndeadlift\nhang power clean\nfront squat\npush press\nback squat\nbent row\n1 min rest\n• repeat 4 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxiYXJiZWxsJTIwY29tcGxleHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Challenging barbell complex requiring strength, endurance, and technical proficiency.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip Efficiency',
              description: 'Hook grip saves grip fatigue.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Strategy',
              description: 'Breathe out strongly on presses/squats.'
            }
          ]
        },
        {
          name: 'Barbell EMOM',
          duration: '12 min',
          description: '• Odd minutes: 8 thrusters\nEven minutes: 10 sumo deadlift high pulls\n12 minutes total',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxiYXJiZWxsJTIwZW1vbXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Time-constrained intervals building power endurance with two demanding barbell movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Thruster Power',
              description: 'Thrusters—ride squat bounce into press.'
            },
            {
              icon: 'trending-up',
              title: 'High Pull Technique',
              description: 'High pulls—elbows above wrists, bar stays close.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Barbell Ladder',
          duration: '20-24 min',
          description: '• 10-8-6-4-2 reps:\npower clean\npush jerk\nfront squat\nburpee over bar\nRest as needed until ladder complete',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxiYXJiZWxsJTIwYWR2YW5jZWR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced ladder requiring explosive power, strength, and conditioning with complex movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Power Clean Form',
              description: 'Power clean—catch low, chest tall, core braced.'
            },
            {
              icon: 'body',
              title: 'Burpee Control',
              description: 'Burpees—land flat-foot, avoid toe springing.'
            }
          ]
        },
        {
          name: 'Barbell AMRAP',
          duration: '15 min',
          description: '• Max rounds in 15 min of:\n6 deadlifts\n6 hang cleans\n6 push presses\n6 back squats\n6 bar-facing burpees',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxiYXJiZWxsJTIwYW1yYXB8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity AMRAP testing maximum work capacity with full-body barbell movements.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Barbell Efficiency',
              description: 'Cycle barbell smoothly, minimize bar resets.'
            },
            {
              icon: 'flash',
              title: 'Breathing Management',
              description: 'Burpees—steady breathing, don\'t over gas.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Med balls',
    icon: 'basketball',
    workouts: {
      beginner: [
        {
          name: 'Medicine Ball Foundation Circuit',
          duration: '18-20 min',
          description: '• 10 wall balls (8-12 lb ball\n• target 9-10 feet)\n10 medicine ball slams (8-10 lb ball)\n10 Russian twists each side (6-8 lb ball)\n90 seconds rest\nRepeat for 4 complete rounds\nFinish with 2 minutes gentle stretching',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMGJhbGwlMjB3b3Jrb3V0fGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to medicine ball training emphasizing proper throwing mechanics, core stability, and functional movement patterns with appropriate rest periods.',
          moodTips: [
            {
              icon: 'eye',
              title: 'Wall Ball Precision',
              description: 'Target eye-level mark on wall; catch ball in deep squat position with chest tall and arms extended.'
            },
            {
              icon: 'body',
              title: 'Slam Mechanics',
              description: 'Drive through hips on slams; keep spine neutral and engage core throughout entire movement pattern.'
            }
          ]
        },
        {
          name: 'Dynamic Medicine Ball Flow',
          duration: '16-18 min',
          description: '• 8 chest passes against wall (10-12 lb ball)\n8 overhead throws to ground (8-10 lb ball)\n8 squat to overhead press (6-8 lb ball)\n8 single-leg Romanian deadlift each leg (6 lb ball)\n90 seconds rest\nRepeat for 3 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxtZWRpY2luZSUyMGJhbGwlMjBmbG93fGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive movement flow that builds upper body power, coordination, and unilateral strength through varied medicine ball movement patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Power Development',
              description: 'Drive chest passes with full arm extension and core engagement; focus on powerful hip drive rather than arm strength alone.'
            },
            {
              icon: 'refresh',
              title: 'Balance and Control',
              description: 'Single-leg RDL—keep standing leg strong, control the descent and maintain neutral spine throughout entire range of motion.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Medicine Ball AMRAP Challenge',
          duration: '22-25 min',
          description: '• 10 wall balls (14-16 lb ball\n• target 10 feet)\n10 medicine ball slams (12-14 lb ball)\n10 alternating overhead reverse lunges (10-12 lb ball)\n8 rotational tosses each side (8-10 lb ball)\nAMRAP for 12 minutes\n3 minutes rest\n6 minutes AMRAP of same movements\nFinish with 3 minutes mobility work',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxtZWRpY2luZSUyMGJhbGwlMjBhbXJhcHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate AMRAP protocol that challenges cardiovascular capacity, overhead stability, and rotational power with progressive volume demands.',
          moodTips: [
            {
              icon: 'body',
              title: 'Overhead Lunge Stability',
              description: 'Lock arms overhead during lunges; maintain vertical torso and control knee tracking over toes throughout entire range.'
            },
            {
              icon: 'refresh',
              title: 'Power Generation',
              description: 'Drive slam power from hip hinge, not arms; exhale forcefully on impact and maintain core tension throughout.'
            }
          ]
        },
        {
          name: 'High-Intensity Medicine Ball Tabata',
          duration: '24-26 min',
          description: '• Tabata Protocol: 20 seconds work\n• 10 seconds rest\nRound 1: Wall balls (12-14 lb ball) - 8 intervals\n2 minutes rest\nRound 2: Medicine ball slams (10-12 lb ball) - 8 intervals\n2 minutes rest\nRound 3: Rotational throws (8-10 lb ball) - 8 intervals\n2 minutes rest\nRound 4: Squat to overhead press (8-10 lb ball) - 8 intervals\nFinish with 4 minutes gentle stretching',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxtZWRpY2luZSUyMGJhbGwlMjB0YWJhdGF8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced Tabata intervals that maximize anaerobic power development through varied medicine ball movements with proper work-to-rest ratios.',
          moodTips: [
            {
              icon: 'eye',
              title: 'Wall Ball Consistency',
              description: 'Maintain target accuracy throughout intervals; catch ball in full squat and reset posture between every repetition.'
            },
            {
              icon: 'refresh',
              title: 'Rotational Power Safety',
              description: 'Pivot from feet during rotational throws, never from knees; engage obliques and maintain strong core connection.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Elite Medicine Ball Complex',
          duration: '28-32 min',
          description: '• 12 wall balls (16-20 lb ball\n• target 10-11 feet)\n10 overhead slams (14-16 lb ball)\n8 rotational throws each side (12-14 lb ball)\n6 burpee to slam combo (10-12 lb ball)\n90 seconds rest\nRepeat for 5 complete rounds\nFinish with 4 minutes dynamic stretching and core work',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxtZWRpY2luZSUyMGJhbGwlMjBhZHZhbmNlZHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite-level complex demanding maximal power output, rotational strength, and metabolic conditioning through progressive ball weights and extended volume.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Rotational Power Mechanics',
              description: 'Generate rotation from hip drive and core; pivot feet fully and maintain strong oblique engagement throughout entire throwing motion.'
            },
            {
              icon: 'body',
              title: 'Burpee-Slam Integration',
              description: 'Maintain neutral spine during slam pickup; explode up from burpee position and immediately engage core for powerful slam.'
            }
          ]
        },
        {
          name: 'Medicine Ball Sprint Conditioning',
          duration: '25-28 min',
          description: '• 10 wall balls (14-16 lb ball)\n20-meter sprint carrying ball chest-level\n10 overhead slams (12-14 lb ball)\n20-meter backward sprint with ball\n8 rotational slams each side (10-12 lb ball)\n20-meter lateral shuffles with ball\n2 minutes rest\nRepeat for 4 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxtZWRpY2luZSUyMGJhbGwlMjBzcHJpbnR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Peak-intensity circuit integrating medicine ball power movements with multi-directional sprint conditioning for complete athletic development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Stability Control',
              description: 'Maintain ball close to chest during forward sprints; keep core tight and avoid excessive vertical bounce for efficiency.'
            },
            {
              icon: 'refresh',
              title: 'Multi-Directional Transitions',
              description: 'Reset body position between movement directions; engage stabilizer muscles and maintain ball control through all planes of motion.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Slam balls',
    icon: 'basketball',
    workouts: {
      beginner: [
        {
          name: 'Slam Ball Basics',
          duration: '12-16 min',
          description: '• 10 slams\n10 squat-to-press\n10 reverse lunges (ball at chest)\n1 min rest\nRepeat 3 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzbGFtJTIwYmFsbCUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduction to slam ball fundamentals focusing on proper lifting mechanics and control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Safe Pickup',
              description: 'Pick up via squat, not back bend.'
            },
            {
              icon: 'fitness',
              title: 'Lunge Position',
              description: 'Lunges—ball close, posture upright.'
            }
          ]
        },
        {
          name: 'Slam Ball Flow',
          duration: '12-15 min',
          description: '• 8 slams\n8 overhead throws\n8 Russian twists (per side)\n1 min rest\nRepeat 3 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxzbGFtJTIwYmFsbCUyMGZsb3d8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Movement progression adding overhead power and core rotation to basic slam patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Overhead Safety',
              description: 'OH throw—legs drive, avoid spine arch.'
            },
            {
              icon: 'refresh',
              title: 'Core Rotation',
              description: 'Twists—rotate torso, not just arms.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Slam Ball AMRAP',
          duration: '10 min',
          description: '• Max rounds in 10 min of:\n10 slams\n10 lateral slams (5 per side)\n10 squat jumps (ball at chest)',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxzbGFtJTIwYmFsbCUyMGFtcmFwfGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity AMRAP incorporating lateral movement and plyometric elements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Lateral Slam Safety',
              description: 'Lateral slams—pivot hips fully, protect knees.'
            },
            {
              icon: 'body',
              title: 'Jump Landing',
              description: 'Land squat jumps softly, chest tall.'
            }
          ]
        },
        {
          name: 'Slam Ball Tabata',
          duration: '16 min',
          description: '• 20s work\n• 10s rest alternating:\nslams\n• squat-to-press\n• lateral slams\n• burpee-slams\n4 rounds each (16 intervals total)',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzbGFtJTIwYmFsbCUyMHRhYmF0YXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intense Tabata protocol pushing anaerobic power with explosive slam ball movements.',
          moodTips: [
            {
              icon: 'body',
              title: 'Burpee Form',
              description: 'Burpee-slam—ball set dead center before drop.'
            },
            {
              icon: 'refresh',
              title: 'Control Descent',
              description: 'Exhale sharply with each overhead drive.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Slam Ball Complex',
          duration: '20-24 min',
          description: '• 12 slams\n10 lateral slams\n8 burpee-slams\n6 overhead throws\n1 min rest\nRepeat 4 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxzbGFtJTIwYmFsbCUyMGFkdmFuY2VkfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex demanding maximum power output and conditioning with varied slam movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Power',
              description: 'Lateral slams—generate power from sides of core.'
            },
            {
              icon: 'body',
              title: 'Overhead Throw Power',
              description: 'OH throw—hips snap, arms guide.'
            }
          ]
        },
        {
          name: 'Slam Ball Sprint Circuit',
          duration: '20-25 min',
          description: '• 10 slams\n20 meters sprint (with ball)\n10 lateral slams\n20 meters sprint\n1 min rest\nRepeat 5 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxzbGFtJTIwYmFsbCUyMHNwcmludHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Peak performance circuit combining slam ball power with sprint conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Control',
              description: 'Sprint holding ball high and tight to chest.'
            },
            {
              icon: 'refresh',
              title: 'Quick Resets',
              description: 'Reset stance instantly after each slam.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Battle ropes',
    icon: 'git-compare',
    workouts: {
      beginner: [
        {
          name: 'Rope Waves & Slams',
          duration: '12-14 min',
          description: '• 20s alternating waves\n20s rest\n20s double slams\n20s rest\nRepeat 5 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxiYXR0bGUlMjByb3BlcyUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduction to battle rope fundamentals with manageable work-to-rest ratios.',
          moodTips: [
            {
              icon: 'body',
              title: 'Athletic Stance',
              description: 'Hips and core engaged, knees bent.'
            },
            {
              icon: 'refresh',
              title: 'Power Breathing',
              description: 'Exhale with impact on each slam.'
            }
          ]
        },
        {
          name: 'Rope Circuit',
          duration: '12-15 min',
          description: '• 20s waves\n20s side-to-side waves\n20s slams\n1 min rest\nRepeat 4 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxiYXR0bGUlMjByb3BlcyUyMGNpcmN1aXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Varied rope movements building coordination and cardiovascular endurance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Rope Control',
              description: 'Maintain steady rope slack.'
            },
            {
              icon: 'body',
              title: 'Shoulder Position',
              description: 'Relax shoulders, no trap shrugging.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Battle Rope Tabata',
          duration: '16 min',
          description: '• 20s work\n• 10s rest alternating:\nwaves\n• slams\n• circles\n• jumping jacks\n4 rounds each (16 intervals total)',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxiYXR0bGUlMjByb3BlcyUyMHRhYmF0YXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity Tabata protocol with varied rope movements for maximum cardiovascular stress.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Core Power',
              description: 'Generate force from hips/core, not just arms.'
            },
            {
              icon: 'refresh',
              title: 'Maintain Volume',
              description: 'Keep efforts sharp—focus on short bursts.'
            }
          ]
        },
        {
          name: 'Rope & Burpee Combo',
          duration: '20-22 min',
          description: '• 30s waves\n5 burpees\n30s slams\n5 burpees\n1 min rest\nRepeat 4 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxiYXR0bGUlMjByb3BlcyUyMGJ1cnBlZXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combination training adding bodyweight movements to rope work for total body conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Quick Transitions',
              description: 'Transition rope-to-burpee fluidly.'
            },
            {
              icon: 'body',
              title: 'Landing Control',
              description: 'Land gently on each burpee push.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Battle Rope Gauntlet',
          duration: '24-26 min',
          description: '• 30s waves\n30s slams\n30s side-to-side\n30s jacks\n30s circles\n1 min rest\nRepeat 4 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxiYXR0bGUlMjByb3BlcyUyMGFkdmFuY2VkfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Extended high-intensity gauntlet testing advanced cardiovascular capacity and rope mastery.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rhythm Control',
              description: 'Keep steady rhythm across all rope patterns.'
            },
            {
              icon: 'flash',
              title: 'Breathing Technique',
              description: 'Sync breathing pattern with wave count.'
            }
          ]
        },
        {
          name: 'Rope & Sprint Circuit',
          duration: '20-25 min',
          description: '• 20s waves\n20 meters sprint\n20s slams\n20 meters sprint\n1 min rest\nRepeat 5 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxiYXR0bGUlMjByb3BlcyUyMHNwcmludHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate conditioning circuit combining rope power with sprint speed for peak athletic performance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Form',
              description: 'Sprints—tall posture, full arm drive.'
            },
            {
              icon: 'refresh',
              title: 'Maximum Effort',
              description: 'Commit max intensity in rope bursts before each sprint.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Sled',
    icon: 'triangle',
    workouts: {
      beginner: [
        {
          name: 'Sled Push & Pull',
          duration: '12-15 min',
          description: '• 10 meters push (light)\n10 meters backward pull\n1 min rest\nRepeat 5 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzbGVkJTIwd29ya291dHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduction to sled training with light loads focusing on proper pushing and pulling mechanics.',
          moodTips: [
            {
              icon: 'body',
              title: 'Push Angle',
              description: 'Push at ~45° lean, arms straight.'
            },
            {
              icon: 'flash',
              title: 'Pull Technique',
              description: 'Backward pulls—fast, short steps.'
            }
          ]
        },
        {
          name: 'Sled March',
          duration: '12-16 min',
          description: '• 15 meters slow push\n15 meters slow pull\n1 min rest\nRepeat 4 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxzbGVkJTIwbWFyY2h8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Controlled movement patterns building strength endurance and proper sled mechanics.',
          moodTips: [
            {
              icon: 'body',
              title: 'Heel Drive',
              description: 'Heel-to-toe push, core braced.'
            },
            {
              icon: 'refresh',
              title: 'Core Stability',
              description: 'Chest upright on pulls, no leaning back.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Sled Sprint Intervals',
          duration: '20 min',
          description: '• 10 meters sprint push\nslow walk back (rest)\nRepeat 10 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxzbGVkJTIwc3ByaW50fGVufDB8fHx8TVc1Mjg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Power-focused sprint intervals building explosive leg drive and conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Drive',
              description: 'Explode forward with leg drive.'
            },
            {
              icon: 'body',
              title: 'Sprint Mechanics',
              description: 'Keep steps short and rapid.'
            }
          ]
        },
        {
          name: 'Push & Drag Circuit',
          duration: '20-22 min',
          description: '• 10 meters push (moderate)\n10 meters backward drag\n10 meters lateral push (sideways)\n1 min rest\nRepeat 4 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzbGVkJTIwZHJhZ3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Multi-directional sled work challenging different movement patterns and muscle groups.',
          moodTips: [
            {
              icon: 'body',
              title: 'Sideways Technique',
              description: 'Sideways—hips square, shuffles controlled.'
            },
            {
              icon: 'refresh',
              title: 'Drag Position',
              description: 'Backward drag—knees bent, chest tall.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Sled Gauntlet',
          duration: '24-28 min',
          description: '• 10 meters heavy push\n10 meters sprint push (light)\n10 meters backward drag\n10 meters lateral push\n1 min rest\nRepeat 5 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxzbGVkJTIwYWR2YW5jZWR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced gauntlet combining maximum load with speed work for elite conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy Load Technique',
              description: 'Heavy pushes—glutes and hamstrings drive.'
            },
            {
              icon: 'refresh',
              title: 'Fast Transitions',
              description: 'Transition quickly for conditioning effect.'
            }
          ]
        },
        {
          name: 'Sled & Burpee Circuit',
          duration: '24-26 min',
          description: '• 10 meters heavy push\n10 burpees\n10 meters backward drag\n10 burpees\n1 min rest\nRepeat 4 rounds',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc2fHxzbGVkJTIwYnVycGVlfGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate challenge combining heavy sled work with burpees for maximum conditioning stress.',
          moodTips: [
            {
              icon: 'body',
              title: 'Burpee Transition',
              description: 'Drop tight into burpees—no sagging hips.'
            },
            {
              icon: 'flash',
              title: 'Reset Power',
              description: 'Push explosively out of burpees.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Resistance bands',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Resistance Band Foundation Circuit',
          duration: '18-22 min',
          description: '• 10 banded squats (medium resistance)\n10 seated rows (medium resistance)\n10 chest presses (light-medium resistance)\n10 bicep curls (light resistance)\n8 shoulder lateral raises (light resistance)\n90 seconds rest\nRepeat for 4 complete rounds\nFinish with 3 minutes band-assisted stretching',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxyZXNpc3RhbmNlJTIwYmFuZCUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to resistance band training emphasizing controlled movement patterns, proper tension maintenance, and progressive muscle activation.',
          moodTips: [
            {
              icon: 'body',
              title: 'Squat Tension Control',
              description: 'Keep knees tracking over toes against band resistance; maintain tension throughout entire squat range of motion.'
            },
            {
              icon: 'flash',
              title: 'Rowing Technique',
              description: 'Pull elbows close to ribcage during rows; squeeze shoulder blades together and control the return phase slowly.'
            }
          ]
        },
        {
          name: 'Band Activation and Mobility Flow',
          duration: '16-20 min',
          description: '• 10 lateral band walks each direction (light resistance)\n10 overhead shoulder presses (light-medium resistance)\n10 band pull-aparts (light resistance)\n10 standing wood chops each side (medium resistance)\n8 banded glute bridges (medium resistance)\n90 seconds rest\nRepeat for 3 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxyZXNpc3RhbmNlJTIwYmFuZCUyMHdhbGt8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Activation-focused workout targeting glute engagement, shoulder stability, and rotational strength through controlled band movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Consistent Band Tension',
              description: 'Never allow band to go slack during lateral walks; maintain constant knee bend and step wide to preserve tension.'
            },
            {
              icon: 'body',
              title: 'Overhead Press Stability',
              description: 'Avoid arching back during overhead presses; engage core strongly and press bands straight up overhead.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'High-Intensity Band Tabata Protocol',
          duration: '26-28 min',
          description: '• Tabata Protocol: 20 seconds work\n• 10 seconds rest\nRound 1: Banded squat jumps (medium-heavy resistance) - 8 intervals\n2 minutes rest\nRound 2: Band-assisted push-ups (light resistance) - 8 intervals\n2 minutes rest\nRound 3: Seated rows (medium-heavy resistance) - 8 intervals\n2 minutes rest\nRound 4: Mountain climbers with ankle bands (light resistance) - 8 intervals\nFinish with 4 minutes stretching',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxyZXNpc3RhbmNlJTIwYmFuZCUyMHRhYmF0YXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced Tabata intervals utilizing band resistance to maximize anaerobic power development and metabolic conditioning across multiple movement patterns.',
          moodTips: [
            {
              icon: 'body',
              title: 'Jump Landing Control',
              description: 'Land softly with slight knee bend during squat jumps; maintain control against band resistance throughout entire range.'
            },
            {
              icon: 'flash',
              title: 'Rowing Power Generation',
              description: 'Drive rows from lat engagement and shoulder blade retraction; squeeze fully at end range and control eccentric phase.'
            }
          ]
        },
        {
          name: 'Resistance Band Sprint Power Circuit',
          duration: '22-25 min',
          description: '• 10 banded squat jumps (medium resistance)\n10 resisted sprint accelerations (heavy resistance\n• 10 yards)\n10 band-assisted push-ups (light-medium resistance)\n8 lateral band walks each direction (medium resistance)\n8 single-arm rows each arm (medium-heavy resistance)\n2 minutes rest\nRepeat for 4 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxyZXNpc3RhbmNlJTIwYmFuZCUyMHNwcmludHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dynamic power circuit integrating plyometric movements with resisted acceleration work to develop explosive strength and sprint mechanics.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Acceleration Setup',
              description: 'Secure band anchor point solidly; maintain forward body lean and drive arms powerfully during resisted sprints.'
            },
            {
              icon: 'body',
              title: 'Multi-Planar Movement',
              description: 'Engage core during lateral walks; maintain tension without letting bands go slack between movements.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Elite Resistance Band Complex',
          duration: '30-35 min',
          description: '• 12 banded squat jumps with pause (heavy resistance)\n10 single-arm push-ups with band assistance (medium resistance)\n8 resisted sprint intervals (heavy resistance\n• 15 yards)\n6 burpee to band overhead press (medium-heavy resistance)\n4 single-leg Romanian deadlifts each leg (medium resistance)\n2 minutes rest\nRepeat for 5 complete rounds\nFinish with 5 minutes recovery stretching',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxyZXNpc3RhbmNlJTIwYmFuZCUyMGFkdmFuY2VkfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite-level complex demanding maximal power output, unilateral strength, and metabolic conditioning through progressive resistance patterns and extended volume.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Tension Maintenance Mastery',
              description: 'Never allow bands to lose tension during any movement; control eccentric phase and maintain constant resistance throughout entire range.'
            },
            {
              icon: 'body',
              title: 'Single-Limb Stability',
              description: 'Engage stabilizer muscles during single-arm and single-leg movements; maintain core rigidity and prevent compensatory movements.'
            }
          ]
        },
        {
          name: 'Advanced Band and Plyometric Integration',
          duration: '28-32 min',
          description: '• 10 jump lunges with band resistance (medium-heavy)\n10 explosive mountain climbers with ankle bands (light-medium)\n10 single-arm rows to rotation each arm (heavy resistance)\n10 band-assisted pistol squats each leg (light-medium resistance)\n8 resisted broad jumps (heavy resistance)\n90 seconds rest\nRepeat for 5 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxyZXNpc3RhbmNlJTIwYmFuZCUyMHBseW98ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity integration combining advanced plyometric patterns with resistance band strength work for elite athletic development.',
          moodTips: [
            {
              icon: 'body',
              title: 'Advanced Landing Mechanics',
              description: 'Land with perfect knee tracking during jump lunges; absorb impact through hip flexion and maintain band tension throughout.'
            },
            {
              icon: 'refresh',
              title: 'Core Integration',
              description: 'Engage deep core muscles during rotational rows; coordinate breathing with resistance and maintain postural stability.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Sledge hammer & tire',
    icon: 'hammer',
    workouts: {
      beginner: [
        {
          name: 'Sledgehammer Foundation Training',
          duration: '18-22 min',
          description: '• 10 overhead strikes each side (10-12 lb hammer)\n10 tire step-ups (focus on balance)\n8 lateral strikes each side (light hammer)\n8 tire toe taps for agility\n90 seconds rest\nRepeat for 4 complete rounds\nFinish with 3 minutes stretching and shoulder mobility',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzbGVkZ2VoYW1tZXIlMjB3b3Jrb3V0fGVufDB8fHx8TVc1Mjg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to sledgehammer training emphasizing proper striking mechanics, grip technique, and tire integration with safety-first approach.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Proper Grip Mechanics',
              description: 'Start with hands together, slide top hand down during strike; maintain loose grip to prevent fatigue and improve power transfer.'
            },
            {
              icon: 'body',
              title: 'Step-up Balance Control',
              description: 'Place entire foot on tire during step-ups; drive through glutes and maintain upright posture throughout movement.'
            }
          ]
        },
        {
          name: 'Hammer and Agility Flow',
          duration: '16-20 min',
          description: '• 8 controlled overhead strikes each side (8-10 lb hammer)\n8 tire toe taps (quick feet pattern)\n6 diagonal strikes each side (light hammer)\n10 tire step-overs (lateral movement)\n8 tire punches with gloves\n90 seconds rest\nRepeat for 3 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxzbGVkZ2VoYW1tZXIlMjBtYXJjaHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive coordination workout building relationship between striking power, footwork agility, and multi-directional movement patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hip-Driven Power',
              description: 'Generate striking force from hip rotation and core engagement rather than arm strength alone; let gravity assist the downward motion.'
            },
            {
              icon: 'body',
              title: 'Agility Footwork',
              description: 'Stay light on balls of feet during toe taps; maintain athletic position with slight knee bend throughout agility work.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Sledgehammer Power Circuit',
          duration: '24-28 min',
          description: '• 10 explosive overhead strikes each side (12-16 lb hammer)\n8 burpees with tire touch\n10 tire jumps (lateral and forward)\n8 alternating diagonal strikes each side\n6 tire step-ups with hammer carry\n90 seconds rest\nRepeat for 5 complete rounds\nFinish with 3 minutes recovery stretching',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxzbGVkZ2VoYW1tZXIlMjBidXJwZWV8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate circuit combining sledgehammer power development with plyometric and bodyweight movements for comprehensive conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Core Integration',
              description: 'Drive strikes through explosive core rotation and hip snap; maintain strong spinal alignment throughout entire striking motion.'
            },
            {
              icon: 'body',
              title: 'Plyometric Landing Control',
              description: 'Land tire jumps with soft knees and centered balance; keep chest tall and immediately prepare for next movement transition.'
            }
          ]
        },
        {
          name: 'High-Intensity Sledgehammer Tabata',
          duration: '22-25 min',
          description: '• Tabata Protocol: 20 seconds work\n• 10 seconds rest\nRound 1: Overhead strikes alternating sides (14-16 lb hammer) - 8 intervals\n2 minutes rest\nRound 2: Lateral strikes left side (12-14 lb hammer) - 8 intervals\n2 minutes rest\nRound 3: Lateral strikes right side (12-14 lb hammer) - 8 intervals\n2 minutes rest\nFinish with 4 minutes mobility work',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxzbGVkZ2VoYW1tZXIlMjB0YWJhdGF8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity Tabata intervals focused on developing sledgehammer-specific power endurance and anaerobic capacity.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hip Snap Efficiency',
              description: 'Maintain strong hip snap on every strike even as fatigue sets in; focus on technique over pure force during intervals.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Coordination',
              description: 'Exhale forcefully with each strike; establish rhythmic breathing pattern to maintain power output throughout intervals.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Elite Sledgehammer Complex',
          duration: '30-35 min',
          description: '• 12 maximum-power overhead strikes each side (16-20 lb hammer)\n10 burpees with tire slam landing\n8 tire jumps with 180-degree rotation\n6 single-arm farmer carry with hammer (25 yards each arm)\n4 tire step-ups with overhead hammer hold\n2 minutes rest\nRepeat for 6 complete rounds\nFinish with 5 minutes comprehensive stretching',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxzbGVkZ2VoYW1tZXIlMjBhZHZhbmNlZHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite-level complex demanding maximum striking power, rotational stability, and integrated strength through extended volume and advanced movement patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Maximum Strike Efficiency',
              description: 'Generate maximum power with minimal wasted motion; maintain perfect technique even under fatigue and high volume demands.'
            },
            {
              icon: 'body',
              title: 'Complex Movement Transitions',
              description: 'Execute smooth transitions between movements; maintain spatial awareness and control during rotational tire jumps and carries.'
            }
          ]
        },
        {
          name: 'Sledgehammer Sprint Conditioning',
          duration: '28-32 min',
          description: '• 20 explosive strikes each side (16-18 lb hammer)\n10 tire flips (focus on proper mechanics)\n20-yard sprint with hammer carry\n8 tire jumps (forward and lateral combination)\n6 hammer overhead carries (30 yards)\n90 seconds rest\nRepeat for 5 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxzbGVkZ2VoYW1tZXIlMjBzcHJpbnR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Peak-intensity conditioning integrating sledgehammer power, tire manipulation, and sprint work for complete athletic development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Power Endurance Maintenance',
              description: 'Maintain striking power and speed throughout high-volume sets; focus on explosiveness rather than grinding through fatigue.'
            },
            {
              icon: 'refresh',
              title: 'Active Sprint Recovery',
              description: 'Use sprint intervals as active recovery while maintaining speed; coordinate breathing and maintain hammer control during carries.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Flipping tire',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Tire Flipping Foundation',
          duration: '16-20 min',
          description: '• 5 proper tire flips (focus on technique)\n10 tire step-ups (controlled pace)\n8 tire toe taps for footwork\n6 tire push-ups (hands on tire edge)\n90 seconds rest\nRepeat for 4 complete rounds\nFinish with 3 minutes stretching and lower back mobility',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHx0aXJlJTIwZmxpcCUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to tire flipping emphasizing proper lifting mechanics, hip hinge technique, and complementary movements for comprehensive strength development.',
          moodTips: [
            {
              icon: 'body',
              title: 'Proper Flip Mechanics',
              description: 'Keep chest close to tire during setup; drive powerfully through heels and hips while maintaining neutral spine alignment throughout the flip.'
            },
            {
              icon: 'flash',
              title: 'Step-up Control',
              description: 'Place entire foot securely on tire during step-ups; engage glutes to drive upward and maintain balance throughout the movement.'
            }
          ]
        },
        {
          name: 'Tire Flip and Agility Training',
          duration: '18-22 min',
          description: '• 4 controlled tire flips (emphasis on form)\n20 tire toe taps (quick feet pattern)\n8 tire lateral step-overs each direction\n6 tire mountain climbers (hands on tire)\n8 tire bear crawls around perimeter\n90 seconds rest\nRepeat for 3 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHx0aXJlJTIwZmxpcCUyMHRhcHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive strength and agility workout building tire flipping power while incorporating multi-directional movement patterns and core stability.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Hip Drive',
              description: 'Generate flipping power through explosive hip extension rather than back strain; coordinate leg drive with upper body push for efficient tire movement.'
            },
            {
              icon: 'body',
              title: 'Agility and Balance',
              description: 'Stay light on balls of feet during toe taps and step-overs; maintain athletic position with knees slightly bent throughout agility work.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Tire Flip Circuit',
          duration: '22-26 min',
          description: '• 6 explosive tire flips (focus on speed)\n8 tire jumps (forward and lateral)\n10 tire push-ups with feet elevated\n8 tire burpees (hands on tire edge)\n6 single-leg tire step-ups each leg\n90 seconds rest\nRepeat for 5 complete rounds\nFinish with 4 minutes recovery stretching',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHx0aXJlJTIwZmxpcCUyMGp1bXB8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate circuit combining tire flipping power development with plyometric jumps and unilateral strength for comprehensive athletic conditioning.',
          moodTips: [
            {
              icon: 'body',
              title: 'Advanced Flip Technique',
              description: 'Maintain flat back throughout tire flip setup; position arms under tire edge and drive through legs while pushing with upper body simultaneously.'
            },
            {
              icon: 'flash',
              title: 'Plyometric Landing Safety',
              description: 'Land tire jumps with soft knees and centered balance; absorb impact through hip flexion and prepare immediately for next movement.'
            }
          ]
        },
        {
          name: 'Tire Flip Strength Circuit',
          duration: '20-24 min',
          description: '• 5 tire flips with 2-second pause at top\n10 tire push-ups (hands and feet on tire)\n10 lateral tire jumps each direction\n8 tire sit-ups (back against tire)\n6 tire farmer walks (carry tire 20 yards)\n2 minutes rest\nRepeat for 4 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0aXJlJTIwZmxpcCUyMGNpcmN1aXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Strength-focused circuit integrating tire manipulation with upper body, core, and carrying patterns for comprehensive functional development.',
          moodTips: [
            {
              icon: 'body',
              title: 'Tire Push-up Stability',
              description: 'Maintain stable hand placement on tire edge during push-ups; engage core strongly to prevent wobbling and maintain proper alignment.'
            },
            {
              icon: 'flash',
              title: 'Controlled Movement Quality',
              description: 'Execute lateral jumps with controlled landing mechanics; maintain compact foot positioning and soft landing absorption.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Elite Tire Flip Complex',
          duration: '28-32 min',
          description: '• 8 maximum-power tire flips (explosive technique)\n8 tire jumps with 180-degree rotation\n8 single-arm tire push-ups each arm\n8 tire burpees with jump over tire\n6 tire overhead carries (30 yards)\n4 tire flips into immediate sprint (15 yards)\n2 minutes rest\nRepeat for 5 complete rounds\nFinish with 5 minutes comprehensive stretching',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHx0aXJlJTIwZmxpcCUyMGFkdmFuY2VkfGVufDB8fHx8TVc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite-level complex demanding maximal tire flipping power, rotational stability, unilateral strength, and integrated conditioning through advanced movement patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Maximum Power Output',
              description: 'Generate maximum explosiveness on every tire flip; maintain technique integrity even under high-volume fatigue demands.'
            },
            {
              icon: 'body',
              title: 'Complex Movement Integration',
              description: 'Execute smooth transitions between tire flip and sprint; maintain spatial awareness during rotational jumps and overhead carries.'
            }
          ]
        },
        {
          name: 'Tire Flip Conditioning Challenge',
          duration: '26-30 min',
          description: '• 10 explosive tire flips (maximum speed)\n10 tire box jumps (full tire height)\n20-yard tire drag (rope attachment)\n8 tire slam alternatives (if available)\n6 tire deadlifts (if tire has handles)\n10-yard tire bear crawl push\n90 seconds rest\nRepeat for 4 complete rounds',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHx0aXJlJTIwZmxpcCUyMHNwcmludHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Peak-intensity conditioning challenge integrating maximum tire manipulation, dragging, and multi-planar movement for complete functional strength development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rapid Recovery Mechanics',
              description: 'Execute quick transitions between tire flips and subsequent movements; maintain breathing rhythm and movement efficiency despite high intensity.'
            },
            {
              icon: 'flash',
              title: 'Sustained Power Output',
              description: 'Maintain tire flipping speed and power throughout extended sets; focus on explosive intent rather than grinding through fatigue.'
            }
          ]
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
  onStartWorkout: (workout: Workout, equipment: string, difficulty: string) => void;
}

const WorkoutCard = ({ equipment, icon, workouts, difficulty, difficultyColor, onStartWorkout }: WorkoutCardProps) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);

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

        {/* Start Workout Button */}
        <TouchableOpacity 
          style={styles.startWorkoutButton}
          onPress={() => onStartWorkout(item, equipment, difficulty)}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={20} color="#000000" />
          <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Simple touch-based swipe detection for reliable web compatibility
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: any) => {
    const touch = e.nativeEvent.touches ? e.nativeEvent.touches[0] : e.nativeEvent;
    setTouchEnd(null);
    setTouchStart(touch.pageX || touch.clientX);
    console.log('👆 Touch started at:', touch.pageX || touch.clientX);
  };

  const handleTouchMove = (e: any) => {
    const touch = e.nativeEvent.touches ? e.nativeEvent.touches[0] : e.nativeEvent;
    setTouchEnd(touch.pageX || touch.clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    console.log('🎯 Swipe detected! Distance:', distance);
    
    if (isLeftSwipe && currentWorkoutIndex < workouts.length - 1) {
      const newIndex = currentWorkoutIndex + 1;
      console.log('👉 Swiped left, changing to workout index:', newIndex);
      setCurrentWorkoutIndex(newIndex);
    }
    
    if (isRightSwipe && currentWorkoutIndex > 0) {
      const newIndex = currentWorkoutIndex - 1;
      console.log('👈 Swiped right, changing to workout index:', newIndex);
      setCurrentWorkoutIndex(newIndex);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
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
          <Text style={styles.workoutCount}>{currentWorkoutIndex + 1}/{workouts.length}</Text>
        </View>
      </View>

      {/* Swipeable Workouts - Touch-based Implementation */}
      <View 
        style={[styles.workoutList, { width: width - 48, height: 420 }]}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {renderWorkout({ item: workouts[currentWorkoutIndex], index: currentWorkoutIndex })}
      </View>

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
                console.log('🔘 Dot clicked, changing to workout index:', index);
                setCurrentWorkoutIndex(index);
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
  const workoutType = params.workoutType as string || 'Cardio Based';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
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

  const handleStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    try {
      console.log('🚀 Starting workout:', workout.name, 'on', equipment);
      
      // Validate required parameters
      if (!workout.name || !equipment || !difficulty) {
        console.error('❌ Missing required parameters for workout navigation');
        return;
      }
      
      // Use navigation state instead of URL parameters to avoid encoding issues
      router.push({
        pathname: '/workout-guidance',
        params: {
          workoutName: workout.name,
          equipment: equipment,
          description: workout.description || '',
          duration: workout.duration || '20 min',
          difficulty: difficulty,
          workoutType: workoutType,
          // Pass MOOD tips as properly encoded JSON string
          moodTips: encodeURIComponent(JSON.stringify(workout.moodTips || []))
        }
      });
      
      console.log('✅ Navigation completed - using simplified parameters');
    } catch (error) {
      console.error('❌ Error starting workout:', error);
    }
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

      {/* Progress Bar - Single Non-Scrolling Section */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          {/* Step 1: Mood Selection */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="flame" size={12} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {/* Step 2: Workout Type */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="heart" size={12} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{workoutType}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {/* Step 3: Intensity Level */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="speedometer" size={12} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {/* Steps 4+: Individual Equipment Items */}
          {selectedEquipmentNames.map((equipment, index) => {
            // Get appropriate icon for each equipment type
            const getEquipmentIcon = (equipmentName: string) => {
              const equipmentIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
                'Treadmill': 'walk',
                'Elliptical': 'ellipse',
                'Arm bicycle': 'bicycle',
                'Stationary bike': 'bicycle',
                'Assault bike': 'bicycle',
                'Row machine': 'boat',
                'Stair master': 'trending-up',
                'Ski machine': 'snow',
                'Curve treadmill': 'walk',
                'Punching bag': 'hand-left',
                'Vertical Climber': 'triangle',
                'Jump rope': 'git-compare'
              };
              return equipmentIconMap[equipmentName] || 'fitness';
            };

            return (
              <React.Fragment key={equipment}>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <Ionicons name={getEquipmentIcon(equipment)} size={12} color="#000000" />
                  </View>
                  <Text style={styles.progressStepText}>{equipment}</Text>
                </View>
                {index < selectedEquipmentNames.length - 1 && <View style={styles.progressConnector} />}
              </React.Fragment>
            );
          })}
        </View>
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
                onStartWorkout={handleStartWorkout}
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
  progressStep: {
    alignItems: 'center',
    minWidth: 60,
    maxWidth: 80,
  },
  progressStepActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  progressStepNumberActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 70,
  },
  progressConnector: {
    width: 16,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
    marginTop: 14,
  },
  progressContainer: {
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
    height: 420,
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
    fontWeight: '600',
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
    maxHeight: 80,
  },
  workoutDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
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