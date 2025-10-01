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

// Complete Compound Leg workout database with detailed battle plans and MOOD tips
const compoundWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Goblet Squat',
          duration: '10–12 min',
          description: 'Simple squat variation teaches control\nand balance with front load support.\n ',
          battlePlan: '• 3 rounds\n• 10–12 Goblet Squats\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Front load squat builds posture and safe depth.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hold dumbbell at chest to keep torso upright',
              description: 'Chest up, core tight for proper spinal alignment during movement.'
            },
            {
              icon: 'trending-down',
              title: 'Push knees out, sit hips down under control',
              description: 'Slow descent builds strength and prevents knee valgus collapse.'
            }
          ]
        },
        {
          name: 'DB RDL',
          duration: '10–12 min',
          description: 'Dumbbell hinge builds strength safely\nfor beginners with proper form.\n ',
          battlePlan: '• 3 rounds\n• 8–10 Dumbbell RDLs\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Hip hinge pattern develops hamstrings + glutes.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep back flat, hinge hips not spine',
              description: 'Neutral spine protects back while maximizing hamstring engagement.'
            },
            {
              icon: 'flash',
              title: 'Glide DBs down thighs until hamstring stretch',
              description: 'Feel the stretch in hamstrings before driving hips forward to stand.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Bulgarian Split Squat',
          duration: '14–16 min',
          description: 'Advanced split squat builds quads\nand glute drive with elevated rear foot.\n ',
          battlePlan: '• 4 rounds\n• 8–10 Bulgarian Split Squats per leg\n• Rest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Rear foot elevated squat raises ROM + intensity.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Front shin vertical, stay upright',
              description: 'Avoid leaning forward; keep torso tall for proper quad loading.'
            },
            {
              icon: 'timer',
              title: 'Descend slow, avoid bouncing knee',
              description: 'Control prevents injury and maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Lateral Lunge',
          duration: '14–16 min',
          description: 'Trains quads, glutes, and groin through\nlateral range of motion.\n ',
          battlePlan: '• 3 rounds\n• 8 per side Lateral Lunges\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Side lunge develops stability and hip strength.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Step wide, sit hips over working leg',
              description: 'Load the working side while keeping opposite leg straight.'
            },
            {
              icon: 'body',
              title: 'Keep chest tall, toes forward entire set',
              description: 'Maintain posture to prevent compensations and maximize effectiveness.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Squat + RDL Superset',
          duration: '16–18 min',
          description: 'Superset floods quads + hamstrings\nwith volume for complete development.\n ',
          battlePlan: '• 4 rounds\n• 8 DB Squats\n• 8 DB RDLs\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Push pull pairing overloads full lower body range.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Perform squats fast, RDLs slow and strict',
              description: 'Different tempos maximize both power and muscle tension.'
            },
            {
              icon: 'timer',
              title: 'Transition quickly to maintain time under tension',
              description: 'Minimal rest between exercises keeps muscles working continuously.'
            }
          ]
        },
        {
          name: 'Squat Iso Hold + Pulses',
          duration: '16–18 min',
          description: 'Brutal high tension squat burns and\nbuilds depth strength.\n ',
          battlePlan: '• 3 rounds\n• 10 Squats + 10s Hold + 6 Pulses\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Long isos with pulses maximize quad fatigue.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold bottom squat 10s, then pulse small reps',
              description: 'Isometric hold followed by mini-reps creates intense muscle burn.'
            },
            {
              icon: 'construct',
              title: 'Keep heels planted, chest upright whole time',
              description: 'Maintain proper position throughout hold and pulses for safety.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Squat Rack',
    icon: 'square-outline',
    workouts: {
      beginner: [
        {
          name: 'Back Squat',
          duration: '10–12 min',
          description: 'Classic barbell squat lays foundation\nfor leg strength and control.\n ',
          battlePlan: '• 3 rounds\n• 8–10 Back Squats\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Foundational squat builds strength + control.',
          moodTips: [
            {
              icon: 'shield',
              title: 'Brace core, grip bar tight, chest lifted',
              description: 'Create full-body tension before descending for stability and power.'
            },
            {
              icon: 'trending-down',
              title: 'Sit hips back, knees out, heels planted',
              description: 'Proper movement pattern prevents knee stress and maximizes power.'
            }
          ]
        },
        {
          name: 'Reverse Lunge',
          duration: '10–12 min',
          description: 'Reverse lunge reduces strain while\nbuilding single leg strength.\n ',
          battlePlan: '• 3 rounds\n• 8 per leg Reverse Lunges\n• Rest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Teaches single leg balance with less knee stress.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Step backward, front shin vertical',
              description: 'Reverse pattern is easier on knees than forward lunges.'
            },
            {
              icon: 'fitness',
              title: 'Keep torso upright, drive through front heel',
              description: 'Front leg does the work while maintaining proper posture.'
            }
          ]
        },
        {
          name: 'Rack RDL',
          duration: '10–12 min',
          description: 'Beginner hinge teaches depth and\nhamstring control with barbell.\n ',
          battlePlan: '• 3 rounds\n• 8–10 Rack RDLs\n• Rest 75–90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Barbell hinge pattern develops glutes + hams.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Bar close to legs, hinge hips not spine',
              description: 'Keep barbell path straight and spine neutral throughout.'
            },
            {
              icon: 'shield',
              title: 'Stop at stretch, don\'t let back round',
              description: 'Maintain back position - flexibility comes with time and practice.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Front Squat',
          duration: '14–16 min',
          description: 'Front squat builds quads while\ndemanding upright posture.\n ',
          battlePlan: '• 4 rounds\n• 6–8 Front Squats\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Upright bar placement drives quad and core load.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Elbows high, bar on shoulders not wrists',
              description: 'Proper rack position distributes load safely across shoulders.'
            },
            {
              icon: 'construct',
              title: 'Stay upright, descend slow, drive up',
              description: 'Front load forces good posture - lean forward and you\'ll drop the bar.'
            }
          ]
        },
        {
          name: 'Bulgarian Split Squat',
          duration: '14–16 min',
          description: 'Advanced unilateral builder with\ndeeper range and balance challenge.\n ',
          battlePlan: '• 4 rounds\n• 8–10 Bulgarians per side\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Rear foot squat overloads quads and balance.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Rear foot on bench, front shin vertical',
              description: 'Setup position determines effectiveness - get positioning right first.'
            },
            {
              icon: 'fitness',
              title: 'Lower straight down — avoid hip shift',
              description: 'Keep hips square and descend vertically for maximum quad activation.'
            }
          ]
        },
        {
          name: 'Rack Deficit RDL',
          duration: '14–16 min',
          description: 'Longer range hinge boosts hamstring\nhypertrophy with elevated position.\n ',
          battlePlan: '• 3 rounds\n• 8–10 Deficit RDLs\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8TVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Standing on plates increases hamstring stretch.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hinge hips back, spine neutral',
              description: 'Longer range requires even more attention to back position.'
            },
            {
              icon: 'timer',
              title: 'Slow 2–3s lower, drive up fast',
              description: 'Eccentric control with explosive concentric maximizes development.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Pause Back Squat',
          duration: '16–18 min',
          description: 'Keeps muscles under control in deepest\nrange with bottom pause.\n ',
          battlePlan: '• 4 rounds\n• 6 Pause Back Squats\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Bottom pause builds strength and eliminates bounce.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Sit into depth, 2s pause, don\'t relax core',
              description: 'Maintain tension throughout pause - don\'t let core go soft.'
            },
            {
              icon: 'flash',
              title: 'Explode upward with controlled breath',
              description: 'Drive up fast after pause while maintaining breathing pattern.'
            }
          ]
        },
        {
          name: 'Walking Lunges',
          duration: '16–18 min',
          description: 'Combination of strength, balance,\nand conditioning challenge.\n ',
          battlePlan: '• 3 rounds\n• 20 steps total Walking Lunges\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHcxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Continuous walking pattern overloads endurance.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Long deliberate steps, plant heel fully',
              description: 'Quality steps with full foot contact for stability and power.'
            },
            {
              icon: 'construct',
              title: 'Keep torso tall, slow controlled descent',
              description: 'Don\'t rush - control each step for maximum effectiveness.'
            }
          ]
        },
        {
          name: 'Squat + RDL Superset',
          duration: '16–18 min',
          description: 'Hybrid superset crushes quads,\nglutes, and hamstrings together.\n ',
          battlePlan: '• 4 rounds\n• 6 Back Squats\n• 6 Rack RDLs\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Pair squat + hinge for full lower body overload.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Transition quickly; squats upright, RDLs hinging',
              description: 'Opposite movement patterns work complementary muscle groups.'
            },
            {
              icon: 'construct',
              title: 'Breathe steady; stay tight on both',
              description: 'Maintain core bracing throughout both exercises for safety.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Leg Press Machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Neutral Leg Press',
          duration: '10–12 min',
          description: 'Basic press builds safety, posture,\nand control with machine support.\n ',
          battlePlan: '• 3 rounds\n• 10–12 Neutral Leg Press\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Teaches full ROM with stable machine support.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Feet shoulder width, push through heels',
              description: 'Proper foot placement distributes force evenly across legs.'
            },
            {
              icon: 'shield',
              title: 'Avoid locking knees, control descent',
              description: 'Soft lockout protects joints while maintaining muscle tension.'
            }
          ]
        },
        {
          name: 'Narrow Stance Press',
          duration: '10–12 min',
          description: 'Targets quads more directly in\nsafe range of motion.\n ',
          battlePlan: '• 3 rounds\n• 10–12 Narrow Stance Press\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Close foot stance emphasizes quad activation.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Feet hip width, press knees in line with toes',
              description: 'Narrower stance shifts emphasis to quadriceps muscles.'
            },
            {
              icon: 'timer',
              title: 'Keep reps slow; don\'t bounce at bottom',
              description: 'Control prevents momentum and maximizes muscle tension.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Wide Glute Press',
          duration: '14–16 min',
          description: 'Outside placement recruits posterior\nchain harder than narrow stance.\n ',
          battlePlan: '• 4 rounds\n• 8–10 Wide Stance Press\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wider stance shifts target to glutes + hamstrings.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Feet wide, press outward through heels',
              description: 'Drive knees out in line with toes for glute activation.'
            },
            {
              icon: 'construct',
              title: 'Keep knees tracking over mid foot',
              description: 'Proper alignment prevents knee stress and maximizes power.'
            }
          ]
        },
        {
          name: 'Single Leg Press',
          duration: '14–16 min',
          description: 'One leg at a time reduces imbalances\nin strength development.\n ',
          battlePlan: '• 4 rounds\n• 8 per leg Single Leg Press\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Unilateral training balances quads + hamstrings.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Work one leg, keep other foot relaxed',
              description: 'Let non-working leg rest while focusing on working side.'
            },
            {
              icon: 'construct',
              title: 'Don\'t let hips lift off pad',
              description: 'Keep hips square and pressed into back pad throughout.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Set Press',
          duration: '16–18 min',
          description: 'Extends time under tension with\nprogressive load reduction.\n ',
          battlePlan: '• 3 rounds\n• 8 Heavy Press → Drop x2 (6–8 reps each)\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Strip weight quickly to overload muscle fatigue.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Start heavy, drop 20% to continue without rest',
              description: 'Quick weight changes maximize fatigue and muscle recruitment.'
            },
            {
              icon: 'construct',
              title: 'Keep range consistent all drops',
              description: 'Don\'t shorten range as you fatigue - maintain quality reps.'
            }
          ]
        },
        {
          name: 'Pause Press',
          duration: '16–18 min',
          description: 'Pausing forces muscles to do all\nthe hard work without momentum.\n ',
          battlePlan: '• 4 rounds\n• 8 Leg Press Reps (2s pause at bottom)\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8TVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Mid rep pause kills momentum and builds tension.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at bottom, don\'t bounce knees',
              description: 'Hold depth position while maintaining muscle tension throughout.'
            },
            {
              icon: 'construct',
              title: 'Push out smooth, no jerking stack',
              description: 'Controlled movement from pause prevents joint stress.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Hack Squat Machine',
    icon: 'triangle',
    workouts: {
      beginner: [
        {
          name: 'Neutral Hack Squat',
          duration: '10–12 min',
          description: 'Basic hack squat introduces form\nand confidence with machine guidance.\n ',
          battlePlan: '• 3 rounds\n• 10–12 Hack Squats\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Machine guidance builds squat mechanics safely.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stand tall, feet shoulder width, spine braced',
              description: 'Proper setup position ensures safe and effective movement.'
            },
            {
              icon: 'trending-down',
              title: 'Lower until thighs parallel, push through heels',
              description: 'Good depth with heel drive maximizes leg muscle activation.'
            }
          ]
        },
        {
          name: 'Narrow Hack Squat',
          duration: '10–12 min',
          description: 'Builds quad dominant strength with\nstable machine support.\n ',
          battlePlan: '• 3 rounds\n• 8–10 Narrow Hack Squats\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Narrow stance emphasizes quads more directly.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Feet close, knees track forward with toes',
              description: 'Narrow stance shifts load to quadriceps muscles.'
            },
            {
              icon: 'shield',
              title: 'Maintain upright back pressing into pad',
              description: 'Use back pad for support while maintaining spine position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Wide Hack Squat',
          duration: '14–16 min',
          description: 'Trains posterior chain through\ndeeper ROM with wide stance.\n ',
          battlePlan: '• 4 rounds\n• 8–10 Wide Hack Squats\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wide stance targets glute and hamstring drive.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Feet wider set, push knees outward',
              description: 'Wide stance with knee tracking engages glutes more.'
            },
            {
              icon: 'construct',
              title: 'Sink into hips, don\'t lift heels',
              description: 'Heel contact maintains stability and power transfer.'
            }
          ]
        },
        {
          name: 'Hack Squat Calf Raise',
          duration: '14–16 min',
          description: 'Doubles lower leg work without\nswitching machines for efficiency.\n ',
          battlePlan: '• 4 rounds\n• 8 Hack Squats\n• Immediately 12 Hack Calf Raises\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Add calf emphasis within heavy squat structure.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'After squats, push only with calves in ROM',
              description: 'Transition to calf-only movement using balls of feet.'
            },
            {
              icon: 'shield',
              title: 'Keep shoulders pinned hard to pad',
              description: 'Maintain shoulder contact for stability during calf raises.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: '1½ Rep Hack Squat',
          duration: '16–18 min',
          description: 'Blends controlled pulses with full ROM\nsquatting for hypertrophy.\n ',
          battlePlan: '• 3 rounds\n• 6–8 Hack Squats (1 full + ½ rep = 1 rep)\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Partial + full reps increase hypertrophy tension.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Lower fully, rise halfway, drop, then stand',
              description: 'Complex rep pattern maximizes time under tension.'
            },
            {
              icon: 'timer',
              title: 'Move smoothly, no bouncing at bottom',
              description: 'Control throughout entire rep sequence for safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Reverse Hack Squat',
          duration: '16–18 min',
          description: 'Reverse stance hack builds posterior\nchain strength and development.\n ',
          battlePlan: '• 4 rounds\n• 8–10 Reverse Hack Squats\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Facing pad emphasizes glutes and hamstrings.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Face pad chest, hinge slightly forward',
              description: 'Reverse position changes muscle emphasis to posterior chain.'
            },
            {
              icon: 'fitness',
              title: 'Push heels downward, squeeze glutes at top',
              description: 'Focus on glute contraction for maximum muscle activation.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Single Stack Cable',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Cable Squat',
          duration: '10–12 min',
          description: 'Cable tension mimics goblet squat\nwith safety and control.\n ',
          battlePlan: '• 3 rounds\n• 10–12 Cable Squats\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Front loaded setup controls posture + squat form.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold bar/rope close, chest tall, brace core',
              description: 'Front load helps maintain upright posture throughout movement.'
            },
            {
              icon: 'trending-down',
              title: 'Hips down, knees out, control down + up',
              description: 'Proper squat mechanics with cable assistance for learning.'
            }
          ]
        },
        {
          name: 'Cable Step Through',
          duration: '10–12 min',
          description: 'Crossover cable step engages quads +\nglutes together with unilateral work.\n ',
          battlePlan: '• 3 rounds\n• 8 per side Step Throughs\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Split stance improves single leg drive and balance.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Step forward strongly, keep torso upright',
              description: 'Drive through front leg while maintaining posture against cable.'
            },
            {
              icon: 'construct',
              title: 'Push front heel, let cable guide back',
              description: 'Cable provides assistance returning to start position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Cable RDL',
          duration: '14–16 min',
          description: 'Cable variation keeps constant load\non posterior chain throughout ROM.\n ',
          battlePlan: '• 4 rounds\n• 8–10 Cable RDLs\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Hip hinge move teaches tension through hamstrings.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Step a foot back from weight stack for tension',
              description: 'Distance from stack creates pre-tension for better muscle activation.'
            },
            {
              icon: 'fitness',
              title: 'Hinge hips back, pull cable tight each rep',
              description: 'Maintain cable tension while performing hip hinge pattern.'
            }
          ]
        },
        {
          name: 'Cable Split Squat',
          duration: '14–16 min',
          description: 'Great hypertrophy builder with guided\nconstant tension throughout movement.\n ',
          battlePlan: '• 4 rounds\n• 8–10 Cable Split Squats per leg\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Unilateral squat keeps quads under stable load.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold handle chest height tight, stand tall',
              description: 'Cable helps maintain upright posture during split squat.'
            },
            {
              icon: 'fitness',
              title: 'Drop rear knee close, drive evenly upward',
              description: 'Controlled descent with powerful drive through front leg.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Cable Front Squat',
          duration: '16–18 min',
          description: 'Replicates barbell front squat with\ncable constant tension loading.\n ',
          battlePlan: '• 4 rounds\n• 6–8 Heavy Cable Front Squats\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Heavy stack front squat overloads safe quads.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stand tall, hands under bar attachment',
              description: 'Proper grip and posture essential for heavy cable front squats.'
            },
            {
              icon: 'shield',
              title: 'Keep upright torso even under heavier load',
              description: 'Cable front load helps maintain position but requires core strength.'
            }
          ]
        },
        {
          name: 'Cable Squat to RDL',
          duration: '16–18 min',
          description: 'Superset blend targets both push +\nhinge chains with constant tension.\n ',
          battlePlan: '• 4 rounds\n• 8 Cable Squats\n• 8 Cable RDLs\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combo pairing keeps full leg tension loading.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Keep squats smooth; hinge immediately after',
              description: 'Quick transition maintains muscle tension throughout superset.'
            },
            {
              icon: 'construct',
              title: 'Stay close to stack for strong pull angle',
              description: 'Positioning relative to cable stack affects resistance curve.'
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
      {/* Workout Image with Rounded Edges */}
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
        {/* Workout Title */}
        <Text style={styles.workoutName}>{item.name}</Text>
        
        {/* Duration & Intensity Level on Same Line */}
        <View style={styles.durationIntensityRow}>
          <Text style={styles.workoutDuration}>{item.duration}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.difficultyBadgeText}>{difficulty.toUpperCase()}</Text>
          </View>
        </View>

        {/* Intensity Reason - Same Width as Photo */}
        <View style={styles.intensityContainer}>
          <Ionicons name="information-circle" size={16} color="#FFD700" />
          <Text style={styles.intensityReason}>{item.intensityReason}</Text>
        </View>

        {/* Workout Description - Same Width as Photo */}
        <View style={styles.workoutDescriptionContainer}>
          <Text style={styles.workoutDescription}>{item.description}</Text>
        </View>

        {/* Start Workout Button - Same Width as Photo */}
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
        style={[styles.workoutList, { width: width - 48 }]}
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

export default function CompoundWorkoutDisplayScreen() {
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
    selectedEquipmentNames = ['Dumbbells'];
  }
  
  const difficulty = (params.difficulty as string || 'beginner').toLowerCase();
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Compound';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Get difficulty color - all the same neon gold
  // Get equipment icon for progress bar
  const getEquipmentIcon = (equipmentName: string): keyof typeof Ionicons.glyphMap => {
    const equipmentIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'Dumbbells': 'barbell',
      'Squat Rack': 'square-outline',
      'Leg Press Machine': 'hardware-chip',
      'Hack Squat Machine': 'triangle',
      'Single Stack Cable': 'reorder-three'
    };
    return equipmentIconMap[equipmentName] || 'fitness';
  };

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  // Create rows of progress steps with max 4 per row (matching chest format)
  const createProgressRows = () => {
    const allSteps = [
      { icon: 'flame', text: moodTitle, key: 'mood' },
      { icon: 'walk', text: 'Legs', key: 'legs' },
      { icon: 'layers', text: workoutType, key: 'type' },
      { icon: 'speedometer', text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1), key: 'difficulty' },
      ...selectedEquipmentNames.map((equipment, index) => ({
        icon: getEquipmentIcon(equipment),
        text: equipment,
        key: `equipment-${index}`
      }))
    ];

    const rows = [];
    for (let i = 0; i < allSteps.length; i += 4) {
      rows.push(allSteps.slice(i, i + 4));
    }
    return rows;
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment
  const userWorkouts = compoundWorkoutDatabase.filter(equipment => 
    selectedEquipmentNames.includes(equipment.equipment)
  ).map(equipment => ({
    ...equipment,
    workouts: equipment.workouts[difficulty as keyof typeof equipment.workouts] || []
  }));

  console.log('User workouts:', userWorkouts.length, 'for difficulty:', difficulty);

  const handleStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    console.log('🚀 Starting workout:', workout.name);
    
    // Navigate to workout guidance with simplified parameters
    const params = {
      workoutName: workout.name,
      equipment: equipment,
      description: workout.description,
      duration: workout.duration,
      intensity: difficulty,
      battlePlan: workout.battlePlan.replace(/•/g, '').trim(),
      moodTipsCount: workout.moodTips.length.toString()
    };
    
    console.log('📝 Workout data:', params);
    console.log('🔄 Navigation params:', params);
    
    try {
      router.push({
        pathname: '/workout-guidance',
        params
      });
      console.log('✅ Navigation completed - using simplified parameters');
    } catch (error) {
      console.error('❌ Navigation failed:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (userWorkouts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>No Workouts Found</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.noWorkoutsContainer}>
          <Text style={styles.noWorkoutsText}>
            No workouts available for the selected equipment and difficulty level.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Your Workouts</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar with Row Layout */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          {createProgressRows().map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.progressRow}>
              {row.map((step, stepIndex) => (
                <React.Fragment key={step.key}>
                  <View style={styles.progressStep}>
                    <View style={styles.progressStepActive}>
                      <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={10} color="#000000" />
                    </View>
                    <Text style={styles.progressStepText}>{step.text}</Text>
                  </View>
                  {stepIndex < row.length - 1 && <View style={styles.progressConnector} />}
                </React.Fragment>
              ))}
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Workout Cards */}
          {userWorkouts.map((equipmentWorkout, index) => (
            <WorkoutCard
              key={equipmentWorkout.equipment}
              equipment={equipmentWorkout.equipment}
              icon={equipmentWorkout.icon}
              workouts={equipmentWorkout.workouts}
              difficulty={difficulty}
              difficultyColor={difficultyColor}
              onStartWorkout={handleStartWorkout}
            />
          ))}
        </View>
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
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginTop: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginTop: 12,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 80,
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
    marginBottom: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 80,
  },
  progressConnector: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
    marginTop: -12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  equipmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  workoutList: {
    height: 420,
    overflow: 'hidden',
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  workoutImageContainer: {
    height: 120,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 16,
  },
  workoutImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  swipeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  swipeText: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '600',
  },
  workoutContent: {
    paddingHorizontal: 0,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  workoutDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 6,
  },
  intensityReason: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginLeft: 8,
  },
  workoutDescriptionContainer: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    paddingHorizontal: 6,
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 0,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 8,
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  dotsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noWorkoutsText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
});