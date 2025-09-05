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
          description: '5 min walk (3.5 mph), 3 min jog (5 mph), 2 min walk (3 mph), 4 min jog (5.2 mph), 3 min walk (3.5 mph), 3 min jog (5 mph).',
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
          description: '3 min walk (3.5 mph), 4 min incline walk (3.8 mph, 4% incline), 2 min walk (3.5 mph), 5 min incline walk (4 mph, 6% incline), 3 min walk (3.5 mph), 3 min incline walk (3.8 mph, 3% incline).',
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
          description: '3 min jog (5.5 mph), 2 min run (6.5 mph), 1 min fast run (7.5 mph), 2 min walk (3.5 mph, incline 3%), repeat 3x, finish with 3 min jog (5.5 mph).',
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
          description: '2 min run (6.0 mph, incline 1%), 1 min run (6.0 mph, incline 5%), 2 min walk (3.5 mph, incline 2%), repeat 5x, finish with 3 min walk (3.0 mph).',
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
          description: '2 min jog (6.0 mph), 30 sec sprint (9.0 mph), 1 min jog, 45 sec sprint, 1 min jog, 1 min sprint, 2 min jog, repeat pyramid, finish with 5 min incline walk (4.0 mph, incline 8%).',
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
          description: '5 min warm-up (jog), 10 min tempo run (7.0 mph, incline 2%), 5 x 1 min hill sprints (8.0 mph, incline 6%, 1 min walk between), 5 min cool-down.',
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
          description: '3 min easy (resistance 3), 2 min moderate (resistance 6), 1 min fast (resistance 4), repeat 4x, finish with 3 min easy (resistance 2).',
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
          description: '2 min steady (RPM 55), 1 min fast (RPM 70), 2 min moderate (RPM 60), 1 min slow (RPM 50, resistance 5), repeat 3x.',
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
          description: '2 min moderate (resistance 5), 1 min climb (resistance 10), 1 min sprint (resistance 4, RPM 80+), repeat 5x, finish with 3 min easy.',
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
          description: '3 min forward (resistance 6), 2 min reverse (resistance 4), 1 min sprint (forward, resistance 5), repeat 4x, finish with 2 min easy.',
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
          description: '8 rounds: 20 sec max effort (resistance 8), 10 sec easy (resistance 3), 2 min recovery, repeat for 3 cycles.',
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
          description: '5 min easy, 10 min moderate (resistance 7), 5 min hard (resistance 10), 5 min fast (resistance 5, RPM 80+), 5 min reverse (resistance 6), 5 min cool-down.',
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
          description: '2 min easy (resistance 2), 1 min moderate (resistance 4), 1 min fast (resistance 2), repeat 3x, finish with 2 min easy.',
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
          description: '1 min easy, 1 min moderate, 30 sec fast, 1 min easy, 1 min reverse, repeat 3x.',
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
          description: '1 min easy, 1 min moderate, 1 min hard, 1 min moderate, 1 min easy, repeat 3x.',
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
          description: '2 min forward (resistance 5), 1 min reverse (resistance 3), 1 min sprint (forward, resistance 4), repeat 4x.',
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
          description: '30 sec max effort (resistance 8), 1 min easy (resistance 3), repeat 10x, finish with 5 min moderate.',
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
          description: '5 min moderate, 10 x 30 sec sprint (resistance 10) with 30 sec easy, 5 min reverse, 5 min cool-down.',
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
          description: '3 min easy (resistance 2), 2 min moderate (resistance 5), 1 min fast (resistance 3), repeat 4x.',
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
          description: '2 min steady (70 RPM), 1 min fast (90 RPM), 2 min moderate (80 RPM), 1 min slow (60 RPM, resistance 6), repeat 3x.',
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
          description: '2 min moderate (resistance 6), 1 min hill (resistance 10), 1 min sprint (resistance 4, 100+ RPM), repeat 5x.',
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
          description: '3 min easy, 2 min moderate, 1 min hard, 2 min moderate, 3 min easy, repeat 3x.',
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
          description: '8 rounds: 20 sec max effort (resistance 8), 10 sec easy (resistance 3), 2 min recovery, repeat for 3 cycles.',
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
          description: '5 min easy, 10 min moderate (resistance 7), 5 min hard (resistance 10), 5 min fast (resistance 5, 100+ RPM), 5 min standing climb (resistance 8), 5 min cool-down.',
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
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.',
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
          description: '2 min easy, 1 min moderate (increase resistance), 1 min fast, repeat 3x, finish with 2 min easy.',
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
          description: '20 sec sprint, 40 sec easy, repeat 10x, 5 min moderate.',
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
          description: '30 sec sprint, 1 min easy, 45 sec sprint, 1 min easy, 1 min sprint, 1 min easy, repeat sequence.',
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
          description: '8 rounds: 20 sec max effort, 10 sec rest, 2 min easy, repeat for 2 cycles.',
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
          description: 'Every minute: 20 sec sprint, 40 sec moderate, repeat for 20 min.',
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
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.',
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
          description: '2 min steady (22 SPM), 1 min fast (28 SPM), 2 min slow (20 SPM), repeat 3x.',
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
          description: '1 min hard (28 SPM), 2 min moderate (24 SPM), 1 min slow (20 SPM), repeat 4x.',
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
          description: '1 min easy, 1 min hard, 2 min easy, 2 min hard, 3 min easy, 3 min hard, then back down.',
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
          description: '30 sec sprint (32 SPM), 1 min moderate (24 SPM), repeat 10x.',
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
          description: '5 min easy, 10 min moderate, 5 min hard, 5 min fast, 5 min cool-down.',
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
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.',
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
          description: '2 min steady, 1 min double step (skip a step), 2 min slow, repeat 3x.',
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
          description: '1 min fast, 2 min moderate, 1 min side step (face sideways), repeat 4x.',
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
          description: '2 min moderate, 1 min fast, 1 min slow, 1 min double step, repeat 5x.',
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
          description: '2 min fast, 1 min side step, 1 min double step, 2 min moderate, repeat 5x.',
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
          description: '30 sec sprint, 90 sec moderate, 30 sec skip-step, 90 sec easy, repeat 5x.',
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
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.',
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
          description: '2 min steady (resistance 3), 1 min moderate (resistance 5), 2 min slow (resistance 2), repeat 3x.',
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
          description: '1 min hard, 2 min moderate, 1 min slow, repeat 4x.',
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
          description: '1 min easy, 1 min hard, 2 min easy, 2 min hard, 3 min easy, 3 min hard.',
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
          description: '30 sec sprint, 1 min moderate, repeat 10x.',
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
          description: '8 rounds: 20 sec max effort, 10 sec rest, 2 min easy, repeat for 2 cycles.',
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
          description: '2 min walk, 1 min jog, 2 min walk, 1 min jog, repeat 2x.',
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
          description: '1 min walk, 30 sec jog, 1 min walk, 30 sec fast walk, repeat 4x.',
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
          description: '1 min run, 2 min walk, 1 min fast run, 2 min walk, repeat 3x.',
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
          description: '1 min walk, 1 min jog, 1 min run, 1 min jog, 1 min walk, repeat 3x.',
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
          description: '20 sec sprint, 40 sec walk, repeat 15x.',
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
          description: 'Every minute: 20 sec sprint, 40 sec moderate jog, repeat for 15 min.',
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
          description: '30 sec jab-cross, 30 sec rest, 30 sec jab-cross-hook, 30 sec rest, repeat 5x.',
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
          description: '30 sec light punches, 30 sec footwork (move around bag), 30 sec rest, repeat 4x.',
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
          description: '1 min combos (jab-cross-hook-uppercut), 30 sec rest, 1 min power punches, 30 sec rest, repeat 4x.',
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
          description: '30 sec fast punches, 30 sec slips/ducks, 30 sec rest, repeat 6x.',
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
          description: '45 sec max effort combos, 15 sec rest, repeat 15x.',
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
          description: '2 min all-out, 1 min rest, 2 min footwork & defense, 1 min rest, repeat 3x.',
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
          description: '1 min climb, 1 min rest, repeat 5x.',
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
          description: '30 sec slow, 30 sec moderate, 30 sec fast, 30 sec rest, repeat 3x.',
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
          description: '1 min hard, 1 min moderate, 1 min slow, repeat 5x.',
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
          description: '30 sec fast, 1 min moderate, 30 sec slow, repeat 6x.',
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
          description: '20 sec sprint, 40 sec moderate, repeat 15x.',
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
          description: '2 min hard, 1 min moderate, repeat 6x.',
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
          description: '30 sec jump, 30 sec rest, repeat 10x.',
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
          description: '30 sec basic jump, 30 sec step touch (no rope), 30 sec basic jump, 30 sec rest, repeat 4x.',
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
          description: '1 min basic jump, 30 sec alternate foot, 30 sec double bounce, 1 min rest, repeat 4x.',
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
          description: '45 sec fast jump, 15 sec slow jump, repeat 12x.',
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
          description: '30 sec max speed, 10 sec rest, repeat 20x.',
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
          description: '1 min cross-over, 1 min double under, 1 min basic jump, repeat 6x.',
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
          description: '30 sec goblet squat, 30 sec alternating reverse lunge, 30 sec push press, 30 sec rest, repeat 4 rounds.',
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
          duration: '12 min',
          description: 'Flow Sequence: 8 reps squat to press → 8 reps alternating snatch (light weight) → 8 reps bent-over row → 1 min rest. Complete 3 total rounds.',
          imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxkdW1iYmVsbCUyMHRyYWluaW5nfGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
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
          duration: '16 min',
          description: 'Complex Circuit: 6 reps each movement, no rest between exercises: deadlift → hang clean → front squat → push press → reverse lunge. Rest 1 min between rounds. Complete 4 total rounds.',
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
          name: 'EMOM 12 min',
          duration: '12 min',
          description: 'Every Minute on the Minute: Odd minutes (1,3,5,7,9,11) - 10 dumbbell thrusters. Even minutes (2,4,6,8,10,12) - 12 alternating renegade rows.',
          imageUrl: 'https://images.unsplash.com/photo-1598971861713-54ad16c5b44b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxkdW1iYmVsbCUyMGNpcmN1aXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Time-based intervals challenge muscular endurance and cardiovascular capacity with precise rest periods.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hip Drive',
              description: 'Thrusters—power from hips, not arms.'
            },
            {
              icon: 'body',
              title: 'Core Stability',
              description: 'Renegade rows—keep hips steady; avoid twisting.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Dumbbell Ladder',
          duration: '15 min',
          description: 'Ladder Format: Complete 10 reps of each movement, then 8 reps, then 6, then 4, then 2. Movements: squat clean → push press → burpee over dumbbell. Rest as needed between rounds.',
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
          name: 'AMRAP 15 min',
          duration: '15 min',
          description: 'AMRAP (As Many Rounds As Possible) for 15 minutes: 10 alternating snatches, 10 goblet jump squats, 10 push-up to row (5 per side), 10 alternating lunges (holding dumbbells). Complete as many full rounds as possible.',
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
          name: 'Swing & Carry',
          duration: '15 min',
          description: '20 sec swings → 40 sec farmer\'s carry (walk) → 1 min rest. Repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1566241134850-541012f1d4cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxrZXR0bGViZWxsJTIwd29ya291dHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Basic kettlebell introduction combining hip hinge movement with stability training.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hip Hinge Technique',
              description: 'Swings—hinge hips, glutes drive; don\'t squat.'
            },
            {
              icon: 'body',
              title: 'Posture Control',
              description: 'Farmer\'s carry—shoulders back, core tight, walk tall.'
            }
          ]
        },
        {
          name: 'Cardio Flow',
          duration: '12 min',
          description: '8 goblet squats → 8 single-arm swings (each side) → 8 overhead presses (each side) → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxrZXR0bGViZWxsJTIwZmxvd3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive flow that builds kettlebell familiarity with controlled movement patterns.',
          moodTips: [
            {
              icon: 'body',
              title: 'Press Technique',
              description: 'Elbows tucked on presses—avoid flaring.'
            },
            {
              icon: 'flash',
              title: 'Swing Control',
              description: 'Control swing arc; don\'t let bell pull forward.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Kettlebell Ladder',
          duration: '16 min',
          description: 'Ladder Sequence: 10 swings, 8 cleans (4 per side), 6 snatches (3 per side), 4 goblet squats, 2 push presses (each side). Rest 1 min between rounds, complete 4 total rounds.',
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
          description: 'Tabata Protocol: 20 sec work, 10 sec rest. Cycle through: swings, goblet squats, alternating lunges, high pulls. Complete 4 rounds of each exercise (16 total intervals).',
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
              description: 'Engage glutes fully on squats/lunges.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Kettlebell Complex',
          duration: '20 min',
          description: '6 reps each, no rest: swing → clean → front squat → push press → snatch (each side). Rest 1 min, repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxrZXR0bGViZWxsJTIwYWR2YW5jZWR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex demanding mastery of all major kettlebell movements with minimal rest.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flow Efficiency',
              description: 'Flow smoothly; minimize pausing.'
            },
            {
              icon: 'body',
              title: 'Bell Control',
              description: 'Core tight—bell close to body always.'
            }
          ]
        },
        {
          name: 'AMRAP 15 min',
          duration: '15 min',
          description: '10 double swings → 8 alternating snatches → 6 goblet jump squats → 4 Turkish get-ups (2/side).',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxrZXR0bGViZWxsJTIwYW1yYXB8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity AMRAP combining power, agility, and complex movement patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Double Swing Power',
              description: 'Double swings—lats engaged, neutral wrists.'
            },
            {
              icon: 'body',
              title: 'Turkish Get-up Control',
              description: 'Turkish get-up—slow, stacked joints overhead.'
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
          duration: '12 min',
          description: '8 deadlifts → 8 front squats → 8 push presses → 1 min rest. Repeat 3x (light weight).',
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
              description: 'Front squat—elbows high; bar rests on shoulders.'
            }
          ]
        },
        {
          name: 'Barbell Cardio Flow',
          duration: '13 min',
          description: '6 reps each: hang clean → push press → back squat → bent-over row. Rest 90 sec, repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxiYXJiZWxsJTIwZmxvd3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Smooth barbell flow that teaches coordination between major compound movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Clean Technique',
              description: 'Cleans—triple extension, catch tall.'
            },
            {
              icon: 'body',
              title: 'Row Form',
              description: 'Row—flat back, elbows drive to ribs.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Barbell Complex',
          duration: '16 min',
          description: '5 reps each, no rest: deadlift → hang power clean → front squat → push press → back squat → bent-over row. Rest 1 min, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxiYXJiZWxsJTIwY29tcGxleHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Challenging barbell complex requiring strength, endurance, and technical proficiency.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip Efficiency',
              description: 'Hook grip helps efficiency in long sets.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Strategy',
              description: 'Exhale on heavy presses/squats for bracing.'
            }
          ]
        },
        {
          name: 'Barbell EMOM 12 min',
          duration: '12 min',
          description: 'Odd minutes: 8 thrusters. Even minutes: 10 sumo deadlift high pulls.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxiYXJiZWxsJTIwZW1vbXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Time-constrained intervals building power endurance with two demanding barbell movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Thruster Power',
              description: 'Thrusters—ride bounce out of squat for press.'
            },
            {
              icon: 'trending-up',
              title: 'High Pull Technique',
              description: 'High pulls—keep bar close, elbows higher than wrists.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Barbell Ladder',
          duration: '18 min',
          description: '10-8-6-4-2 reps: power clean → push jerk → front squat → burpee over bar. Rest as needed.',
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
              description: 'Burpees—flat landings, avoid sloppy spring.'
            }
          ]
        },
        {
          name: 'AMRAP 15 min',
          duration: '15 min',
          description: '6 deadlifts → 6 hang cleans → 6 push presses → 6 back squats → 6 bar-facing burpees.',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxiYXJiZWxsJTIwYW1yYXB8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity AMRAP testing maximum work capacity with full-body barbell movements.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Barbell Efficiency',
              description: 'Cycle barbell efficiently with minimal regrip.'
            },
            {
              icon: 'flash',
              title: 'Breathing Management',
              description: 'Burpees—control breathing to avoid burnout.'
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
          name: 'Cardio Circuit',
          duration: '12 min',
          description: '10 wall balls → 10 slams → 10 Russian twists (each side) → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMGJhbGwlMjB3b3Jrb3V0fGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Basic medicine ball movements introducing wall work and core engagement patterns.',
          moodTips: [
            {
              icon: 'eye',
              title: 'Wall Ball Accuracy',
              description: 'Wall balls—aim eye-level, full squat range.'
            },
            {
              icon: 'body',
              title: 'Slam Technique',
              description: 'Ball slams—hinge hips, flat back.'
            }
          ]
        },
        {
          name: 'Flow',
          duration: '12 min',
          description: '8 chest passes (wall) → 8 overhead throws → 8 squat to press → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxtZWRpY2luZSUyMGJhbGwlMjBmbG93fGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Movement flow building upper body power and coordination with medicine ball variations.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Chest Pass Power',
              description: 'Chest passes—drive with arms and chest together.'
            },
            {
              icon: 'refresh',
              title: 'Core Engagement',
              description: 'Squat to press—tight abs, exhale on drive.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'AMRAP 10 min',
          duration: '10 min',
          description: '10 wall balls → 10 slams → 10 alternating lunges (ball overhead).',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxtZWRpY2luZSUyMGJhbGwlMjBhbXJhcHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Continuous movement AMRAP challenging cardiovascular endurance with overhead stability.',
          moodTips: [
            {
              icon: 'body',
              title: 'Overhead Control',
              description: 'Lock arms overhead during lunges.'
            },
            {
              icon: 'refresh',
              title: 'Slam Power',
              description: 'Exhale strongly with every slam.'
            }
          ]
        },
        {
          name: 'Tabata',
          duration: '16 min',
          description: '20 sec work, 10 sec rest: wall balls, slams, rotational throws, squat to press. 4 rounds each, 16 total.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxtZWRpY2luZSUyMGJhbGwlMjB0YWJhdGF8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity interval training pushing anaerobic capacity with varied medicine ball movements.',
          moodTips: [
            {
              icon: 'eye',
              title: 'Wall Ball Reset',
              description: 'Wall ball—catch clean, reset tall chest.'
            },
            {
              icon: 'refresh',
              title: 'Rotation Safety',
              description: 'Rotational throws—pivot feet, not knees.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Med Ball Complex',
          duration: '16 min',
          description: '12 wall balls → 10 slams → 8 rotations → 6 burpee to slam. Rest 1 min, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxtZWRpY2luZSUyMGJhbGwlMjBhZHZhbmNlZHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex combining power, core rotation, and explosive movements for maximum challenge.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Rotation Power',
              description: 'Rotations—big hip drive, protect knees.'
            },
            {
              icon: 'body',
              title: 'Burpee Form',
              description: 'Burpees—keep spine straight on slam pickup.'
            }
          ]
        },
        {
          name: 'Sprint Circuit',
          duration: '20 min',
          description: '10 wall balls → 20 meters sprint (with ball) → 10 slams → 20 meters sprint → 1 min rest. Repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxtZWRpY2luZSUyMGJhbGwlMjBzcHJpbnR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity circuit combining medicine ball work with sprint conditioning for peak performance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Control',
              description: 'Keep ball close and centered when sprinting.'
            },
            {
              icon: 'refresh',
              title: 'Transition Speed',
              description: 'Explosive slams, reset quickly for transition.'
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
          name: 'Basics',
          duration: '12 min',
          description: '10 slams → 10 squat to press → 10 alternating lunges (ball at chest) → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzbGFtJTIwYmFsbCUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduction to slam ball fundamentals focusing on proper lifting mechanics and control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Safe Pickup',
              description: 'Pick up with squat, not waist bend.'
            },
            {
              icon: 'fitness',
              title: 'Lunge Position',
              description: 'Lunges—ball close to chest; spine tall.'
            }
          ]
        },
        {
          name: 'Flow',
          duration: '12 min',
          description: '8 slams → 8 OH throws → 8 Russian twists (each side) → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxzbGFtJTIwYmFsbCUyMGZsb3d8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Movement progression adding overhead power and core rotation to basic slam patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Overhead Safety',
              description: 'Overhead throws—hips drive, protect back.'
            },
            {
              icon: 'refresh',
              title: 'Core Rotation',
              description: 'Russian twists—rotate torso, not just arms.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'AMRAP 10 min',
          duration: '10 min',
          description: '10 slams → 10 lateral slams (5/side) → 10 squat jumps (ball at chest).',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxzbGFtJTIwYmFsbCUyMGFtcmFwfGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity AMRAP incorporating lateral movement and plyometric elements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Lateral Slam Safety',
              description: 'Lateral slams—pivot hips fully; don\'t twist knees.'
            },
            {
              icon: 'body',
              title: 'Jump Landing',
              description: 'Land squat jumps with soft knees, chest up.'
            }
          ]
        },
        {
          name: 'Tabata',
          duration: '16 min',
          description: '20s work, 10s rest: slams, squat to press, lateral slams, burpee to slam. 4 rounds each, 16 total.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzbGFtJTIwYmFsbCUyMHRhYmF0YXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intense Tabata protocol pushing anaerobic power with explosive slam ball movements.',
          moodTips: [
            {
              icon: 'body',
              title: 'Burpee Form',
              description: 'Burpee-to-slam—center ball, don\'t round back.'
            },
            {
              icon: 'refresh',
              title: 'Control Descent',
              description: 'Control ball descent each rep.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complex',
          duration: '16 min',
          description: '12 slams → 10 lateral slams → 8 burpee/slam → 6 OH throws. Rest 1 min, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxzbGFtJTIwYmFsbCUyMGFkdmFuY2VkfGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex demanding maximum power output and conditioning with varied slam movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Power',
              description: 'Explosive slams—brace ribs/core.'
            },
            {
              icon: 'body',
              title: 'Overhead Throw Power',
              description: 'OH throws—legs drive, arms guide.'
            }
          ]
        },
        {
          name: 'Sprint Circuit',
          duration: '20 min',
          description: '10 slams → 20 meters sprint (with ball) → 10 lateral slams → 20 meters sprint → 1 min rest. Repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxzbGFtJTIwYmFsbCUyMHNwcmludHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Peak performance circuit combining slam ball power with sprint conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Control',
              description: 'Hug ball tight on sprints; minimize bounce.'
            },
            {
              icon: 'refresh',
              title: 'Quick Resets',
              description: 'Reset stance quickly after pickups.'
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
          name: 'Waves & Slams',
          duration: '10 min',
          description: '20 sec waves → 20 sec rest → 20 sec slams → 20 sec rest. Repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxiYXR0bGUlMjByb3BlcyUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduction to battle rope fundamentals with manageable work-to-rest ratios.',
          moodTips: [
            {
              icon: 'body',
              title: 'Athletic Stance',
              description: 'Athletic stance; knees bent, core braced.'
            },
            {
              icon: 'refresh',
              title: 'Power Breathing',
              description: 'Exhale with each slam for power.'
            }
          ]
        },
        {
          name: 'Rope Circuit',
          duration: '12 min',
          description: '20 sec waves → 20 sec side-to-side → 20 sec slams → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxiYXR0bGUlMjByb3BlcyUyMGNpcmN1aXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Varied rope movements building coordination and cardiovascular endurance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Rope Control',
              description: 'Maintain consistent rope slack.'
            },
            {
              icon: 'body',
              title: 'Shoulder Position',
              description: 'Shoulders down—avoid shrug.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Tabata',
          duration: '16 min',
          description: '20s work, 10s rest: waves, slams, circles, jacks. 4 rounds each, 16 intervals.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxiYXR0bGUlMjByb3BlcyUyMHRhYmF0YXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity Tabata protocol with varied rope movements for maximum cardiovascular stress.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Core Power',
              description: 'Hips/core generate force, not arms alone.'
            },
            {
              icon: 'refresh',
              title: 'Maintain Volume',
              description: 'Keep volume high, don\'t fade early.'
            }
          ]
        },
        {
          name: 'Rope & Burpee Combo',
          duration: '16 min',
          description: '30 sec waves → 5 burpees → 30 sec slams → 5 burpees → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxiYXR0bGUlMjByb3BlcyUyMGJ1cnBlZXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combination training adding bodyweight movements to rope work for total body conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Quick Transitions',
              description: 'Quick rope-to-burpee transition.'
            },
            {
              icon: 'body',
              title: 'Landing Control',
              description: 'Control burpee landings.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Battle Rope Gauntlet',
          duration: '20 min',
          description: '30 sec waves → 30 sec slams → 30 sec side-to-side → 30 sec jacks → 30 sec alt circles → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxiYXR0bGUlMjByb3BlcyUyMGFkdmFuY2VkfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Extended high-intensity gauntlet testing advanced cardiovascular capacity and rope mastery.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rhythm Control',
              description: 'Consistent rhythm across moves; avoid burnout.'
            },
            {
              icon: 'flash',
              title: 'Breathing Technique',
              description: 'Breathing control per wave set.'
            }
          ]
        },
        {
          name: 'Rope & Sprint Circuit',
          duration: '20 min',
          description: '20 sec waves → 20 meters sprint → 20 sec slams → 20 meters sprint → 1 min rest. Repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxiYXR0bGUlMjByb3BlcyUyMHNwcmludHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate conditioning circuit combining rope power with sprint speed for peak athletic performance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Form',
              description: 'Sprint tall with full arm drive.'
            },
            {
              icon: 'refresh',
              title: 'Maximum Effort',
              description: 'Commit max effort before sprints.'
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
          name: 'Push & Pull',
          duration: '15 min',
          description: '10 meters push (light) → 10 meters pull (backwards) → 1 min rest. Repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzbGVkJTIwd29ya291dHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduction to sled training with light loads focusing on proper pushing and pulling mechanics.',
          moodTips: [
            {
              icon: 'body',
              title: 'Push Angle',
              description: 'Push at ~45°, arms straight.'
            },
            {
              icon: 'flash',
              title: 'Pull Technique',
              description: 'Backward pull—short fast steps.'
            }
          ]
        },
        {
          name: 'March',
          duration: '12 min',
          description: '15 meters slow push → 15 meters slow pull → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxzbGVkJTIwbWFyY2h8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Controlled movement patterns building strength endurance and proper sled mechanics.',
          moodTips: [
            {
              icon: 'body',
              title: 'Heel Drive',
              description: 'Heel-to-toe drive; keep spine neutral.'
            },
            {
              icon: 'refresh',
              title: 'Core Stability',
              description: 'Braced core, no back arch.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Sprint Intervals',
          duration: '10 min',
          description: '10 meters sprint push → walk back → repeat 10x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxzbGVkJTIwc3ByaW50fGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Power-focused sprint intervals building explosive leg drive and conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Drive',
              description: 'Explosive leg drive each push.'
            },
            {
              icon: 'body',
              title: 'Sprint Mechanics',
              description: 'Short, rapid steps off balls of feet.'
            }
          ]
        },
        {
          name: 'Push & Drag',
          duration: '16 min',
          description: '10 meters push → 10 meters backward drag → 10 meters sideways push → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzbGVkJTIwZHJhZ3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Multi-directional sled work challenging different movement patterns and muscle groups.',
          moodTips: [
            {
              icon: 'body',
              title: 'Sideways Technique',
              description: 'Side push—hips square, small steps.'
            },
            {
              icon: 'refresh',
              title: 'Drag Position',
              description: 'Backward drag—knees bent, core tight.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Sled Gauntlet',
          duration: '20 min',
          description: '10 meters heavy push → 10 meters sprint push → 10 meters back drag → 10 meters side push → 1 min rest. Repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxzbGVkJTIwYWR2YW5jZWR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced gauntlet combining maximum load with speed work for elite conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy Load Technique',
              description: 'Heavy loads—glutes drive, torso rigid.'
            },
            {
              icon: 'refresh',
              title: 'Fast Transitions',
              description: 'Fast transitions maximize burn.'
            }
          ]
        },
        {
          name: 'Sled & Burpee Circuit',
          duration: '16 min',
          description: '10 meters heavy push → 10 burpees → 10 meters back drag → 10 burpees → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc2fHxzbGVkJTIwYnVycGVlfGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate challenge combining heavy sled work with burpees for maximum conditioning stress.',
          moodTips: [
            {
              icon: 'body',
              title: 'Burpee Transition',
              description: 'Tight-core drop into burpees.'
            },
            {
              icon: 'flash',
              title: 'Reset Power',
              description: 'Explosive resets after each burpee.'
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
          name: 'Cardio Circuit',
          duration: '12 min',
          description: '10 squats → 10 rows → 10 presses → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxyZXNpc3RhbmNlJTIwYmFuZCUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduction to resistance band training with basic movement patterns and controlled tension.',
          moodTips: [
            {
              icon: 'body',
              title: 'Squat Form',
              description: 'Knees push out vs. band tension.'
            },
            {
              icon: 'flash',
              title: 'Row Technique',
              description: 'Rows—elbows close, mid-ribcage pull.'
            }
          ]
        },
        {
          name: 'Walks & Presses',
          duration: '12 min',
          description: '10 lateral band walks (each way) → 10 OH presses → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxyZXNpc3RhbmNlJTIwYmFuZCUyMHdhbGt8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Activation-focused workout combining lateral movement with upper body pressing patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Band Tension',
              description: 'Band walks—knees bent, never let tension slack.'
            },
            {
              icon: 'body',
              title: 'Press Position',
              description: 'OH press—avoid leaning back, brace abs.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Band Tabata',
          duration: '16 min',
          description: '20s work, 10s rest: squat jumps, push-ups, rows, mountain climbers. 4 rounds each.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxyZXNpc3RhbmNlJTIwYmFuZCUyMHRhYmF0YXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity Tabata protocol using band resistance for maximum metabolic challenge.',
          moodTips: [
            {
              icon: 'body',
              title: 'Jump Landing',
              description: 'Land lightly during squat jumps.'
            },
            {
              icon: 'flash',
              title: 'Row Power',
              description: 'Rows—squeeze shoulder blades fully.'
            }
          ]
        },
        {
          name: 'Band Sprint Circuit',
          duration: '16 min',
          description: '10 squat jumps → 10 band sprints → 10 push-ups → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxyZXNpc3RhbmNlJTIwYmFuZCUyMHNwcmludHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dynamic circuit combining plyometrics with resisted sprint work for power development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Setup',
              description: 'Anchor band secure before sprints.'
            },
            {
              icon: 'body',
              title: 'Sprint Form',
              description: 'Forward lean sprint, pump arms aggressively.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Band Complex',
          duration: '16 min',
          description: '12 squat jumps → 10 push-ups → 8 sprints → 6 burpees → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxyZXNpc3RhbmNlJTIwYmFuZCUyMGFkdmFuY2VkfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex challenging power, strength, and conditioning with constant band tension.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Constant Tension',
              description: 'Maintain constant band tension.'
            },
            {
              icon: 'body',
              title: 'Recoil Control',
              description: 'Control band recoil—don\'t "snap" back.'
            }
          ]
        },
        {
          name: 'Band & Plyo Circuit',
          duration: '16 min',
          description: '10 jump lunges → 10 mountain climbers → 10 rows → 10 push-ups → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxyZXNpc3RhbmNlJTIwYmFuZCUyMHBseW98ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity circuit combining plyometric power with resistance band strength work.',
          moodTips: [
            {
              icon: 'body',
              title: 'Landing Mechanics',
              description: 'Land soft, knees tracked.'
            },
            {
              icon: 'refresh',
              title: 'Core Engagement',
              description: 'Core tight on every press/push.'
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
          name: 'Hammer Basics',
          duration: '12 min',
          description: '10 strikes (each side) → 10 tire step-ups → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzbGVkZ2VoYW1tZXIlMjB3b3Jrb3V0fGVufDB8fHx8TVc1Mjg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduction to sledgehammer fundamentals with proper striking technique and tire integration.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip Technique',
              description: 'Slide top hand down; loose grip.'
            },
            {
              icon: 'body',
              title: 'Step-up Form',
              description: 'Step-ups—whole foot on tire, glutes drive.'
            }
          ]
        },
        {
          name: 'Hammer & March',
          duration: '12 min',
          description: '8 strikes (each side) → 8 tire toe taps → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxzbGVkZ2VoYW1tZXIlMjBtYXJjaHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive workout building coordination between striking power and agility movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hip Power',
              description: 'Strikes driven from hips, not arms.'
            },
            {
              icon: 'body',
              title: 'Toe Tap Agility',
              description: 'Toe taps—stay light, balls of feet.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Hammer & Burpee Circuit',
          duration: '16 min',
          description: '10 strikes (per side) → 8 burpees → 10 tire jumps → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxzbGVkZ2VoYW1tZXIlMjBidXJwZWV8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate circuit combining hammer power with plyometric and bodyweight movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Core Power',
              description: 'Explosive core twist with strikes.'
            },
            {
              icon: 'body',
              title: 'Jump Landing',
              description: 'Tire jumps—land softly, chest tall.'
            }
          ]
        },
        {
          name: 'Hammer Tabata',
          duration: '12 min',
          description: '20s strikes (switch halfway), 10s rest. 8 rounds. 1 min rest. 3 cycles.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzbGVkZ2VoYW1tZXIlMjB0YWJhdGF8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity Tabata format focusing purely on striking power and endurance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hip Snap',
              description: 'Strong hip snap on every strike.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Rhythm',
              description: 'Breathing cadence—exhale with each hit.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Hammer Gauntlet',
          duration: '16 min',
          description: '12 strikes (each side) → 10 tire jumps → 8 burpees → 6 flips → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxzbGVkZ2VoYW1tZXIlMjBhZHZhbmNlZHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced gauntlet combining maximum striking power with tire manipulation and conditioning.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Core Endurance',
              description: 'Maintain core tightness under fatigue.'
            },
            {
              icon: 'flash',
              title: 'Flip Power',
              description: 'Explosive flips—hips drop low, arms secondary.'
            }
          ]
        },
        {
          name: 'Hammer & Sprint Circuit',
          duration: '20 min',
          description: '10 strikes (each side) → 20 meters sprint → 10 tire jumps → 20 meters sprint → 1 min rest. Repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxzbGVkZ2VoYW1tZXIlMjBzcHJpbnR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate conditioning combining hammer power with maximum sprint speed for elite performance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Mechanics',
              description: 'Sprint ballistics—extend stride fully.'
            },
            {
              icon: 'refresh',
              title: 'Quick Resets',
              description: 'Quick strike resets, no time wasted.'
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
          name: 'Tire Flip & Step',
          duration: '12 min',
          description: '5 flips → 10 step-ups on tire → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHx0aXJlJTIwZmxpcCUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduction to tire flipping with proper technique and complementary step-up movements.',
          moodTips: [
            {
              icon: 'body',
              title: 'Flip Technique',
              description: 'Chest tight to tire, drive through heels.'
            },
            {
              icon: 'flash',
              title: 'Step-up Power',
              description: 'Step-ups—whole foot, glute engaged.'
            }
          ]
        },
        {
          name: 'Tire Flip & Tap',
          duration: '12 min',
          description: '4 flips → 20 toe taps on tire → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHx0aXJlJTIwZmxpcCUyMHRhcHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Building flip strength while incorporating agility work for comprehensive conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hip Drive',
              description: 'Explosive hip drive on flips.'
            },
            {
              icon: 'body',
              title: 'Agility Technique',
              description: 'Toe taps—quick, light, balls of feet.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Flip & Jump',
          duration: '16 min',
          description: '6 flips → 8 jumps on tire → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHx0aXJlJTIwZmxpcCUyMGp1bXB8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate progression adding plyometric jumps to build explosive power and conditioning.',
          moodTips: [
            {
              icon: 'body',
              title: 'Flip Form',
              description: 'Flat back on flips, arms under tire edge.'
            },
            {
              icon: 'flash',
              title: 'Jump Landing',
              description: 'Land softly on jumps.'
            }
          ]
        },
        {
          name: 'Tire Flip Circuit',
          duration: '12 min',
          description: '5 flips → 10 push-ups on tire → 10 lateral jumps → 1 min rest. Repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0aXJlJTIwZmxpcCUyMGNpcmN1aXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Circuit training integrating tire work with upper body and lateral movement patterns.',
          moodTips: [
            {
              icon: 'body',
              title: 'Push-up Stability',
              description: 'Push-ups—hands stable, core braced.'
            },
            {
              icon: 'flash',
              title: 'Lateral Movement',
              description: 'Lateral jumps—compact feet, soft landings.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tire Flip Gauntlet',
          duration: '16 min',
          description: '8 flips → 8 burpees → 8 jumps → 8 push-ups → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHx0aXJlJTIwZmxpcCUyMGFkdmFuY2VkfGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced gauntlet testing maximum strength, power, and conditioning with tire manipulation.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Hip Power',
              description: 'Explosive hip power on flips.'
            },
            {
              icon: 'refresh',
              title: 'Pacing Strategy',
              description: 'Pace burpees to survive full circuit.'
            }
          ]
        },
        {
          name: 'Tire Flip & Sprint',
          duration: '16 min',
          description: '6 flips → 20 meters sprint → 6 flips → 20 meters sprint → 1 min rest. Repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHx0aXJlJTIwZmxpcCUyMHNwcmludHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate power-speed combination challenging maximum strength output followed by speed work.',
          moodTips: [
            {
              icon: 'body',
              title: 'Grip Technique',
              description: 'Grip low under tire, chest close.'
            },
            {
              icon: 'flash',
              title: 'Sprint Efficiency',
              description: 'Sprint tall to keep efficiency after heavy flips.'
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