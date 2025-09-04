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
              icon: 'hand-right',
              title: 'Grip Variation',
              description: 'Alternate between overhand and underhand grips to engage different muscle groups and prevent fatigue.'
            },
            {
              icon: 'body',
              title: 'Core Stability',
              description: 'Keep your core engaged and avoid swaying - this maximizes upper body workout and protects your back.'
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
              icon: 'repeat',
              title: 'Reverse Benefits',
              description: 'Reverse pedaling targets your triceps and back muscles more - feel the difference in muscle engagement.'
            },
            {
              icon: 'pulse',
              title: 'Heart Rate Focus',
              description: 'Upper body cardio raises heart rate quickly - monitor your effort and breathe steadily throughout.'
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
              icon: 'trending-up',
              title: 'Pyramid Strategy',
              description: 'Build intensity gradually to the peak, then actively recover on the way down for optimal training effect.'
            },
            {
              icon: 'battery-charging',
              title: 'Energy Management',
              description: 'Save some energy during moderate phases to really push during the hard interval at each pyramid peak.'
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
              icon: 'swap-horizontal',
              title: 'Direction Transition',
              description: 'Smoothly transition between forward and reverse - avoid jerky movements to maintain rhythm and efficiency.'
            },
            {
              icon: 'flame',
              title: 'Sprint Technique',
              description: 'During sprints, use quick, controlled movements rather than wild flailing for maximum power output.'
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
              title: 'Max Effort Protocol',
              description: 'During 30-second sprints, aim for RPM that you could not sustain for even 10 seconds longer.'
            },
            {
              icon: 'refresh',
              title: 'Active Recovery',
              description: 'Keep arms moving during rest periods - complete stop will make the next sprint much more difficult.'
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
              icon: 'barbell',
              title: 'Power Endurance',
              description: 'Maintain explosive power through all 10 sprints - this builds elite upper body anaerobic capacity.'
            },
            {
              icon: 'repeat',
              title: 'Reverse Recovery',
              description: 'Use reverse section as active recovery while still engaging muscles - targets different fiber types.'
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
              title: 'Pedal Stroke Efficiency',
              description: 'Focus on smooth, circular pedaling motion - push down and pull up for maximum power transfer.'
            },
            {
              icon: 'settings',
              title: 'Seat Position',
              description: 'Adjust seat height so your leg is almost fully extended at the bottom of the pedal stroke for optimal efficiency.'
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
              icon: 'speedometer',
              title: 'Cadence Control',
              description: 'Use the display to monitor your RPM and maintain steady cadence throughout each interval.'
            },
            {
              icon: 'body',
              title: 'Upper Body Relaxation',
              description: 'Keep your shoulders and arms relaxed - tension in upper body wastes energy needed for pedaling.'
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
              title: 'Hill Climbing Power',
              description: 'During hill intervals, slow your cadence but increase power output - focus on strong pedal strokes.'
            },
            {
              icon: 'flash',
              title: 'Sprint Explosiveness',
              description: 'For sprints, keep resistance lower and focus on quick leg turnover - aim for 100+ RPM.'
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
              title: 'Pacing Strategy',
              description: 'Build intensity gradually through each pyramid - save your hardest effort for the 1-minute peak.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Discipline',
              description: 'Use easy periods for true recovery - resist the urge to maintain high intensity throughout.'
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
              icon: 'stopwatch',
              title: 'Maximum Effort Protocol',
              description: 'During 20-second intervals, give everything you have - this should feel impossible to maintain longer.'
            },
            {
              icon: 'battery-charging',
              title: 'Recovery Efficiency',
              description: 'Use 10-second rest periods to prepare mentally for the next all-out effort while keeping legs moving.'
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
              title: 'Mental Toughness',
              description: 'This workout tests your mental limits - break it into segments and focus on completing each phase.'
            },
            {
              icon: 'body',
              title: 'Standing Position',
              description: 'During standing climbs, keep core engaged and avoid rocking side to side for maximum power efficiency.'
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
              title: 'Coordinate Arms & Legs',
              description: 'Push and pull with your arms while pedaling - this full-body coordination maximizes calorie burn.'
            },
            {
              icon: 'pulse',
              title: 'Heart Rate Awareness',
              description: 'Assault bikes raise heart rate quickly - start conservatively and build intensity gradually.'
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
              title: 'Resistance Control',
              description: 'Learn to adjust resistance based on your effort level - more resistance for strength, less for speed.'
            },
            {
              icon: 'body',
              title: 'Posture Maintenance',
              description: 'Keep your core stable and avoid excessive leaning forward or backward during intense intervals.'
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
              title: 'Sprint Intensity',
              description: 'During 20-second sprints, coordinate explosive arm and leg movements for maximum power output.'
            },
            {
              icon: 'refresh',
              title: 'Active Recovery',
              description: 'Keep moving during rest periods at a sustainable pace to maintain blood flow and prepare for next sprint.'
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
              icon: 'trending-up',
              title: 'Progressive Challenge',
              description: 'Each interval gets longer - pace yourself so you can maintain intensity throughout the progression.'
            },
            {
              icon: 'timer',
              title: 'Mental Preparation',
              description: 'Use rest periods to mentally prepare for the next longer interval - visualization helps performance.'
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
              icon: 'flame',
              title: 'All-Out Commitment',
              description: 'Give absolute maximum effort for 20 seconds - this should feel unsustainable beyond the time limit.'
            },
            {
              icon: 'stopwatch',
              title: 'Rest Discipline',
              description: 'Use 10-second rests to briefly recover while staying mentally focused for the next explosive effort.'
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
              icon: 'repeat',
              title: 'Consistency Challenge',
              description: 'Maintain the same effort level for all 20 minutes - resist the urge to go too hard early.'
            },
            {
              icon: 'trophy',
              title: 'Mental Endurance',
              description: 'This tests mental toughness as much as physical - break into 5-minute segments to stay focused.'
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
              title: 'Proper Rowing Form',
              description: 'Drive with your legs first, then engage your back and arms - this sequence maximizes power and prevents injury.'
            },
            {
              icon: 'body',
              title: 'Core Engagement',
              description: 'Keep your core tight throughout the stroke to maintain proper posture and protect your lower back.'
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
              icon: 'speedometer',
              title: 'Stroke Rate Control',
              description: 'Monitor your strokes per minute (SPM) and focus on maintaining consistent rhythm for each interval.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Phase',
              description: 'Use the return phase of each stroke as active recovery - controlled and relaxed movement back to catch position.'
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
              title: 'Power Development',
              description: 'During hard intervals, focus on explosive leg drive and strong back engagement for maximum power output.'
            },
            {
              icon: 'pulse',
              title: 'Heart Rate Management',
              description: 'Use moderate intervals to control heart rate while maintaining good rowing technique.'
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
              icon: 'trending-up',
              title: 'Progressive Building',
              description: 'Build intensity gradually through the pyramid - save your best effort for the 3-minute peak intervals.'
            },
            {
              icon: 'timer',
              title: 'Time Management',
              description: 'Break longer intervals into smaller mental segments to maintain focus and technique throughout.'
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
              title: 'Sprint Technique',
              description: 'During sprints, maintain form while maximizing stroke rate - power comes from technique, not just speed.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Strategy',
              description: 'Use moderate intervals for active recovery while maintaining good rowing rhythm and technique.'
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
              title: 'Endurance Mindset',
              description: 'This workout tests mental endurance - maintain consistent technique even as fatigue builds throughout.'
            },
            {
              icon: 'time',
              title: 'Pacing Strategy',
              description: 'Each 5-minute segment has a purpose - respect the progression and don\'t go too hard too early.'
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
              icon: 'trending-up',
              title: 'Step Placement',
              description: 'Place your entire foot on each step and avoid toe-stepping to engage all leg muscles and prevent injury.'
            },
            {
              icon: 'body',
              title: 'Posture Control',
              description: 'Keep your torso upright and avoid leaning forward - engage your core for stability and balance.'
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
              icon: 'swap-horizontal',
              title: 'Step Variation',
              description: 'Alternate between single steps and double steps to work different muscle groups and prevent monotony.'
            },
            {
              icon: 'pulse',
              title: 'Heart Rate Monitoring',
              description: 'Stepping movements quickly elevate heart rate - maintain a pace where you can still hold a conversation.'
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
              icon: 'repeat',
              title: 'Side Step Technique',
              description: 'When side stepping, lead with one leg and follow with the other - this engages different muscle fibers.'
            },
            {
              icon: 'flash',
              title: 'Speed Control',
              description: 'During fast intervals, maintain control and form - speed without technique leads to inefficient movement.'
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
              icon: 'trending-up',
              title: 'Progressive Challenge',
              description: 'Each round should feel slightly harder as fatigue builds - focus on maintaining good form throughout.'
            },
            {
              icon: 'battery-charging',
              title: 'Energy Conservation',
              description: 'Use slow intervals to recover while still working - this builds endurance without complete exhaustion.'
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
              title: 'Maximum Intensity',
              description: 'During fast intervals, push your stepping rate to the limit while maintaining perfect form and control.'
            },
            {
              icon: 'trophy',
              title: 'Mental Focus',
              description: 'Complex stepping patterns require intense concentration - stay mentally engaged throughout the workout.'
            }
          ]
        },
        {
          name: 'HIIT Steps',
          duration: '20 min',
          description: '30 sec sprint, 1 min moderate, 30 sec skip steps, 1 min slow, repeat 5x.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'High-intensity intervals with skip steps push advanced users to maximum power and agility limits.',
          moodTips: [
            {
              icon: 'stopwatch',
              title: 'Sprint Protocol',
              description: 'During 30-second sprints, step as fast as possible while maintaining control - this builds explosive power.'
            },
            {
              icon: 'settings',
              title: 'Skip Step Mastery',
              description: 'Skip steps require precise timing and power - focus on landing softly and maintaining rhythm.'
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
              icon: 'snow',
              title: 'Ski Motion Fundamentals',
              description: 'Coordinate your arms and legs in opposition - when right leg goes forward, left arm pulls back.'
            },
            {
              icon: 'body',
              title: 'Core Stability',
              description: 'Keep your core engaged throughout the movement to maintain balance and maximize power transfer.'
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
              icon: 'settings',
              title: 'Resistance Strategy',
              description: 'Higher resistance builds strength, lower resistance allows for speed - learn to adjust based on your goals.'
            },
            {
              icon: 'sync',
              title: 'Rhythm Development',
              description: 'Focus on finding a sustainable rhythm that you can maintain throughout longer intervals.'
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
              icon: 'trending-up',
              title: 'Power Generation',
              description: 'During hard intervals, focus on powerful arm pulls and leg drives to maximize calorie burn and fitness gains.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Technique',
              description: 'Use moderate and slow intervals to maintain movement while allowing your heart rate to recover.'
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
              icon: 'timer',
              title: 'Time Progression',
              description: 'Build intensity gradually through the pyramid - the 3-minute hard intervals are the real test.'
            },
            {
              icon: 'trophy',
              title: 'Mental Preparation',
              description: 'Use easy intervals to mentally prepare for the next challenge - visualization improves performance.'
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
              icon: 'flash',
              title: 'Sprint Explosiveness',
              description: 'During sprints, maximize both arm and leg speed while maintaining coordination - this builds explosive power.'
            },
            {
              icon: 'refresh',
              title: 'Active Recovery',
              description: 'Keep moving during recovery at moderate pace to maintain blood flow and prepare for next sprint.'
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
              icon: 'stopwatch',
              title: 'Maximum Effort',
              description: 'Give everything you have for 20 seconds - this protocol demands absolute maximum intensity.'
            },
            {
              icon: 'battery-charging',
              title: 'Rest Efficiency',
              description: 'Use 10-second rests to prepare mentally for the next all-out effort while staying loosely active.'
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
              title: 'Self-Paced Learning',
              description: 'Curve treadmills respond to your effort - start conservatively and let the belt speed match your natural pace.'
            },
            {
              icon: 'body',
              title: 'Forward Lean',
              description: 'Maintain a slight forward lean to keep the belt moving - this engages your core and improves running efficiency.'
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
              icon: 'speedometer',
              title: 'Effort Control',
              description: 'Learn to control your effort level - the belt will respond immediately to changes in your intensity.'
            },
            {
              icon: 'refresh',
              title: 'Natural Recovery',
              description: 'Use walking intervals to naturally slow the belt and allow for recovery between higher intensity efforts.'
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
              icon: 'trending-up',
              title: 'Self-Regulation',
              description: 'Push yourself harder during run intervals - the curve treadmill will challenge you to maintain speed.'
            },
            {
              icon: 'timer',
              title: 'Interval Discipline',
              description: 'Resist the urge to slow down too much during walk intervals - maintain active recovery pace.'
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
              icon: 'trending-up',
              title: 'Pyramid Strategy',
              description: 'Build intensity gradually to the run phase, then actively recover back down the pyramid.'
            },
            {
              icon: 'pulse',
              title: 'Heart Rate Awareness',
              description: 'Monitor how your heart rate responds to each pace change - learn your body\'s response patterns.'
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
              title: 'Maximum Sprint Power',
              description: 'During sprints, drive with maximum leg turnover and arm swing - the curve will challenge your top speed.'
            },
            {
              icon: 'refresh',
              title: 'Quick Recovery',
              description: 'Use walking intervals to quickly recover while staying ready for the next explosive sprint effort.'
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
              icon: 'repeat',
              title: 'Consistency Challenge',
              description: 'Maintain the same sprint intensity for all 15 minutes - pace yourself but don\'t hold back.'
            },
            {
              icon: 'trophy',
              title: 'Mental Toughness',
              description: 'This workout tests your ability to maintain intensity under fatigue - stay mentally strong throughout.'
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
              icon: 'hand-left',
              title: 'Proper Punching Form',
              description: 'Keep your wrists straight and punch through the target - rotate your hips for maximum power generation.'
            },
            {
              icon: 'body',
              title: 'Stance & Balance',
              description: 'Maintain a balanced stance with feet shoulder-width apart - this provides stability for powerful strikes.'
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
              title: 'Footwork Fundamentals',
              description: 'Move around the bag with small steps, staying on the balls of your feet for quick directional changes.'
            },
            {
              icon: 'eye',
              title: 'Target Focus',
              description: 'Keep your eyes on the bag and visualize different targets - this improves accuracy and mental engagement.'
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
              icon: 'flash',
              title: 'Power Punch Technique',
              description: 'For power punches, engage your whole body - drive from your legs, rotate your core, and snap your punches.'
            },
            {
              icon: 'repeat',
              title: 'Combination Flow',
              description: 'Practice smooth transitions between punches in combinations - rhythm and flow increase effectiveness.'
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
              title: 'Speed Development',
              description: 'During fast punches, focus on hand speed over power - quick, snappy punches build speed and endurance.'
            },
            {
              icon: 'refresh',
              title: 'Defensive Movement',
              description: 'Practice slips and ducks as active recovery - these movements keep you moving while reducing punch impact.'
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
              icon: 'flame',
              title: 'Maximum Intensity',
              description: 'Give everything you have for 45 seconds - combine power, speed, and complex combinations at maximum effort.'
            },
            {
              icon: 'stopwatch',
              title: 'Rest Discipline',
              description: 'Use 15-second rests to briefly recover while staying mentally focused for the next explosive round.'
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
              icon: 'trophy',
              title: 'Endurance Under Pressure',
              description: 'Maintain technique quality even as fatigue builds - this develops elite-level boxing conditioning.'
            },
            {
              icon: 'refresh',
              title: 'Active Recovery',
              description: 'Use footwork and defense rounds as active recovery while maintaining boxing-specific movement patterns.'
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
              icon: 'triangle',
              title: 'Climbing Coordination',
              description: 'Coordinate opposite arm and leg movements - when right arm pulls up, left leg steps up.'
            },
            {
              icon: 'body',
              title: 'Core Engagement',
              description: 'Keep your core tight throughout the climbing motion to maintain stability and maximize efficiency.'
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
              icon: 'speedometer',
              title: 'Pace Control',
              description: 'Learn to control your climbing pace - faster isn\'t always better if it compromises form and coordination.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Importance',
              description: 'Use rest periods to reset your form and breathing - this prevents fatigue from degrading technique.'
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
              title: 'Progressive Challenge',
              description: 'Each hard interval should push your limits - use moderate and slow phases for active recovery.'
            },
            {
              icon: 'sync',
              title: 'Rhythm Maintenance',
              description: 'Maintain consistent climbing rhythm throughout all intensities - this improves efficiency and endurance.'
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
              icon: 'timer',
              title: 'Time Awareness',
              description: 'Learn to pace yourself for different interval lengths - 30 seconds requires different strategy than 1 minute.'
            },
            {
              icon: 'battery-charging',
              title: 'Energy Management',
              description: 'Use moderate phases to maintain movement while allowing partial recovery between intense efforts.'
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
              title: 'Sprint Explosiveness',
              description: 'During sprints, maximize both arm and leg speed while maintaining perfect climbing coordination.'
            },
            {
              icon: 'refresh',
              title: 'Active Recovery',
              description: 'Keep climbing during moderate phases - this maintains movement pattern while allowing recovery.'
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
              icon: 'trophy',
              title: 'Endurance Mindset',
              description: 'This workout tests mental toughness as much as physical - stay focused throughout extended efforts.'
            },
            {
              icon: 'time',
              title: 'Long Interval Strategy',
              description: 'Break 2-minute hard intervals into smaller mental segments to maintain intensity and form.'
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
              icon: 'git-compare',
              title: 'Basic Jump Form',
              description: 'Stay on the balls of your feet and keep jumps low - just enough to clear the rope efficiently.'
            },
            {
              icon: 'hand-right',
              title: 'Wrist Rotation',
              description: 'Turn the rope with your wrists, not your arms - this conserves energy and improves speed.'
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
              icon: 'walk',
              title: 'Footwork Practice',
              description: 'Use step touch intervals to practice footwork patterns without the rope - this builds coordination.'
            },
            {
              icon: 'refresh',
              title: 'Active Recovery',
              description: 'Step touch serves as active recovery while maintaining the jumping movement pattern.'
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
              icon: 'repeat',
              title: 'Pattern Transitions',
              description: 'Practice smooth transitions between different jumping patterns - this improves agility and coordination.'
            },
            {
              icon: 'settings',
              title: 'Technique Focus',
              description: 'Maintain proper form even as patterns get more complex - quality over speed builds better fitness.'
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
              icon: 'flash',
              title: 'Speed Development',
              description: 'During fast intervals, increase rope speed while maintaining light, quick jumps - avoid jumping higher.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Jumping',
              description: 'Use slow intervals for active recovery - keep moving but allow your heart rate to come down.'
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
              title: 'Maximum Speed',
              description: 'Push your rope speed to the absolute limit while maintaining perfect jumping form and rhythm.'
            },
            {
              icon: 'stopwatch',
              title: 'Rest Efficiency',
              description: 'Use 10-second rests to prepare mentally for the next sprint - stay loose but focused.'
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
              icon: 'settings',
              title: 'Complex Coordination',
              description: 'Master cross-overs and double unders through practice - these patterns require perfect timing and technique.'
            },
            {
              icon: 'trophy',
              title: 'Mental Focus',
              description: 'Advanced patterns require intense concentration - stay mentally engaged throughout the workout.'
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
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle });

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
          // Pass MOOD tips as JSON string so they can be displayed
          moodTips: JSON.stringify(workout.moodTips || [])
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
            <Text style={styles.progressStepText}>Cardio</Text>
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