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

// Complete Chest workout database with all equipment types
const chestWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Adjustable bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Adjustable Press Circuit',
          duration: '15-18 min',
          description: '• 3 rounds:\n  • 10 flat press\n  • 10 incline press\n  • 10 decline press (light)\n  • Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction targeting pecs from multiple angles with flat = mid, incline = upper, decline = lower chest development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Think of targeting pecs from multiple angles',
              description: 'Flat = mid, incline = upper, decline = lower for complete development.'
            },
            {
              icon: 'trending-up',
              title: 'Drive elbows slightly inward',
              description: 'On all presses to maximize chest fiber recruitment and activation.'
            }
          ]
        },
        {
          name: 'Fly Flow',
          duration: '12-15 min',
          description: '3 rounds:\n• 10 flat fly\n• 10 incline fly\n• 10 decline fly (light)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle fly progression that teaches proper chest isolation across multiple angles for comprehensive beginners development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause at stretch position 1s',
              description: 'To expand pec fibers and maximize muscle growth stimulus.'
            },
            {
              icon: 'flash',
              title: 'Bring dumbbells together until they meet',
              description: 'Not just overhead-to force full contraction and muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Angle Ladder',
          duration: '14-16 min',
          description: '3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive recruitment training that starts more pec-dominant and progresses to fatigue lower range for intermediate development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Think progressive recruitment',
              description: 'Start more pec-dominant, progress to fatigue lower range.'
            },
            {
              icon: 'timer',
              title: "Don't rush-feel pec stretch",
              description: 'On each angle for maximum muscle activation and growth.'
            }
          ]
        },
        {
          name: 'Bench Plyo Push-Ups',
          duration: '14-16 min',
          description: '4 rounds:\n• 8 explosive plyo push-ups (vary bench angle each round)\n• 10 single-arm press\n• Rest 75s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Explosive plyometric work with varied angles forces pec adaptation for greater growth stimulus.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Varying angle forces pec adaptation',
              description: 'Greater growth stimulus through multi-angle training.'
            },
            {
              icon: 'trending-up',
              title: 'Press across midline with single-arm',
              description: 'For deeper chest contraction and unilateral strength.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Adjustable Complex',
          duration: '15-20 min',
          description: '3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\n• 8 fly (choose angle)\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced hypertrophy density training with near-failure at each angle and minimal rest for maximum chest development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Go for hypertrophy density',
              description: 'Aim for near-failure each angle, minimal rest for growth.'
            },
            {
              icon: 'body',
              title: 'On fly, think chest-to-chest squeeze',
              description: 'At top for maximum muscle contraction and activation.'
            }
          ]
        },
        {
          name: 'Drop Set',
          duration: '16-20 min',
          description: '2 rounds:\n• 10 heavy press (any angle)\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity drop sets push muscle failure across multiple weight ranges with focus on time under tension for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: "Don't save energy",
              description: 'Heavy set should be all-out near failure for maximum recruitment.'
            },
            {
              icon: 'timer',
              title: 'Focus on time under tension',
              description: 'During final drops for growth and muscle development.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Flat bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Bench Push-Up Circuit',
          duration: '10-12 min',
          description: '3 rounds:\n• 10 push-ups (hands on bench)\n• 10 bench dips\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction combining bench-assisted push-ups with dips to build foundational chest and tricep strength.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push-ups: Lower slow, drive up hard',
              description: 'Squeeze pecs together at the top. Think 'push the floor apart.''
            },
            {
              icon: 'body',
              title: 'Dips: Keep chest slightly forward',
              description: 'Shift load onto pecs vs. triceps for better chest activation.'
            }
          ]
        },
        {
          name: 'Bench Chest Press',
          duration: '12-15 min',
          description: '3 rounds:\n• 12 light dumbbell or Smith bench press\n• 10 dumbbell bench fly\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combines pressing and isolation movements to teach proper bench technique while building chest strength.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Bench press: Drag elbows slightly in',
              description: 'Move toward midline as you press for max pec activation.'
            },
            {
              icon: 'body',
              title: 'Fly: Focus on stretching fibers',
              description: 'Stretch at bottom, then forcefully contract chest to bring dumbbells together.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Bench Plyo Push-Ups',
          duration: '14-16 min',
          description: '4 rounds:\n• 8 explosive push-ups (hands on bench)\n• 10 single-arm bench press\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive plyometric training combined with unilateral strength work for intermediate power development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plyo push-ups: Push off with max intent',
              description: 'Builds fast-twitch fiber recruitment for growth every rep.'
            },
            {
              icon: 'fitness',
              title: 'Single-arm press: Lock shoulders down',
              description: 'Bring dumbbell in slight inward arc to increase inner-chest tension.'
            }
          ]
        },
        {
          name: 'Bench Chest Flow',
          duration: '12-15 min',
          description: '3 rounds:\n• 10 bench press\n• 10 fly\n• 10 close-grip bench press\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Continuous flow training that overloads pecs through combined pressing and isolation movements.',
          moodTips: [
            {
              icon: 'refresh',
              title: "Fly → press transition, don't rest",
              description: 'Overloads pecs by hitting both stretch and contraction.'
            },
            {
              icon: 'hand-left',
              title: 'Close-grip: Press palms inward',
              description: 'Into bar/dumbbells to increase pec activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Bench Complex',
          duration: '15-18 min',
          description: '3 rounds:\n• 8 bench press\n• 8 bench fly\n• 8 plyo push-ups (hands on bench)\n• 8 dips\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex training combining pressing, isolation, plyometric, and bodyweight movements for maximum chest development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Bench press: Use slight pause at bottom',
              description: 'Kill momentum and force pec drive for better activation.'
            },
            {
              icon: 'trending-down',
              title: 'Dips: Lean forward, chest toward floor',
              description: 'Shifts tension from triceps into pec stretch/contraction.'
            }
          ]
        },
        {
          name: 'Bench Drop Set',
          duration: '16-20 min',
          description: '2 rounds:\n• 10 heavy bench press\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity drop sets push muscle failure across multiple weight ranges for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'shield',
              title: 'Keep reps 0-1 shy of failure',
              description: 'Maximize recruitment without burnout for optimal results.'
            },
            {
              icon: 'speedometer',
              title: 'Lighter sets: slow eccentric',
              description: '3s descent to maximize muscle tension and growth.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Incline bench',
    icon: 'trending-up',
    workouts: {
      beginner: [
        {
          name: 'Incline Push-Up Circuit',
          duration: '10-12 min',
          description: '3 rounds:\n• 10 incline push-ups\n• 10 light incline bench press\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to incline training targeting upper chest development with bodyweight and light resistance.',
          moodTips: [
            {
              icon: 'body',
              title: 'Push-ups: Push through hands',
              description: "As if you're wrapping chest around ribcage for better activation."
            },
            {
              icon: 'trending-up',
              title: 'Incline press: Bring bar/bells below clavicles',
              description: 'Elbows just inside wrists for better upper pec stretch.'
            }
          ]
        },
        {
          name: 'Incline Chest Press',
          duration: '12-15 min',
          description: '3 rounds:\n• 12 incline bench press (light)\n• 10 incline fly\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combines incline pressing and isolation to build upper chest strength and definition for beginners.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Exhale and squeeze pecs hard',
              description: 'As dumbbells come together; imagine bringing elbows to midline.'
            },
            {
              icon: 'construct',
              title: 'Keep bench angle at ~30°',
              description: 'To avoid shoulder takeover and maximize chest activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Incline Plyo Push-Ups',
          duration: '14-16 min',
          description: '4 rounds:\n• 8 incline plyo push-ups\n• 10 single-arm incline press\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive plyometric training combined with unilateral incline work for intermediate upper chest power development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plyo push-ups: Think 'fast hands'',
              description: 'Maximal intent recruits more fibers for better development.'
            },
            {
              icon: 'trending-up',
              title: 'Single-arm press: Press toward midline',
              description: 'Not straight up, for maximum pec contraction and activation.'
            }
          ]
        },
        {
          name: 'Incline Chest Flow',
          duration: '12-15 min',
          description: '3 rounds:\n• 10 incline bench press\n• 10 incline fly\n• 10 close-grip incline press\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Continuous flow training that overloads upper chest through combined pressing, isolation, and close-grip movements.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Minimal rest transitions overload pecs',
              description: 'Forces metabolic stress, a key growth driver for muscle development.'
            },
            {
              icon: 'hand-left',
              title: 'Close-grip: Apply inward force',
              description: 'On dumbbells/bar to emphasize chest squeeze and contraction.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Incline Complex',
          duration: '15-18 min',
          description: '3 rounds:\n• 8 incline bench press\n• 8 incline fly\n• 8 incline plyo push-ups\n• 8 dips\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex training combining incline pressing, isolation, plyometric, and dip movements for maximum upper chest development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Incline presses: Drive bar/dumbbells',
              description: 'In straight bar path angled slightly toward nose for max chest fiber alignment.'
            },
            {
              icon: 'body',
              title: 'Dips: Aim chin slightly down',
              description: 'Chest forward, elbows flared slightly = deep pec stretch and activation.'
            }
          ]
        },
        {
          name: 'Incline Drop Set',
          duration: '16-20 min',
          description: '2 rounds:\n• 10 heavy incline press\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity incline drop sets push upper chest muscle failure across multiple weight ranges for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive concentric on heavy sets',
              description: 'On light sets, slow eccentric + peak contraction squeeze for growth.'
            },
            {
              icon: 'shield',
              title: 'Keep scapula pinned',
              description: "Don't let shoulders roll forward under fatigue for safety and effectiveness."
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Decline bench',
    icon: 'trending-down',
    workouts: {
      beginner: [
        {
          name: 'Decline Push-Up Circuit',
          duration: '10-12 min',
          description: '3 rounds:\n• 8 decline push-ups (feet on bench)\n• 10 decline bench press (light)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to decline training targeting lower chest development with bodyweight and light resistance.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep chest low between hands',
              description: 'Push up forcefully for pec tension and activation.'
            },
            {
              icon: 'trending-down',
              title: 'Lower chest stretch emphasized',
              description: 'At decline; control eccentric for better muscle development.'
            }
          ]
        },
        {
          name: 'Decline Chest Press',
          duration: '12-15 min',
          description: '3 rounds:\n• 12 decline press\n• 10 decline fly\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combines decline pressing and isolation to build lower chest strength and definition for beginners.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Set bench 20-30° decline',
              description: 'For optimal lower pec activation and muscle targeting.'
            },
            {
              icon: 'shield',
              title: 'Fly: stretch deeply',
              description: 'But stop just before shoulder strain for safety.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Decline Plyo Push-Ups',
          duration: '14-15 min',
          description: '4 rounds:\n• 6 explosive feet-elevated push-ups\n• 10 single-arm decline press\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive plyometric training combined with unilateral decline work for intermediate lower chest power development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push hard enough that hands leave ground',
              description: 'For explosive chest drive and power development.'
            },
            {
              icon: 'trending-down',
              title: 'Angle dumbbell slightly inward',
              description: 'Across chest for more pec squeeze and activation.'
            }
          ]
        },
        {
          name: 'Decline Chest Flow',
          duration: '12-15 min',
          description: '3 rounds:\n• 10 decline press\n• 10 decline fly\n• 10 close-grip press\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Continuous flow training that overloads lower chest through combined pressing, isolation, and close-grip movements.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Pump-style sequence',
              description: "Don't rack weights; keep pecs loaded for maximum effect."
            },
            {
              icon: 'hand-left',
              title: 'Close-grip: squeeze chest',
              description: 'By pushing hands inward for enhanced muscle activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Decline Complex',
          duration: '15-18 min',
          description: '3 rounds:\n• 8 decline press\n• 8 decline fly\n• 8 decline plyo push-ups\n• 8 dips\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex training combining decline pressing, isolation, plyometric, and dip movements for maximum lower chest development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 1s at bottom of press',
              description: 'For stronger stretch and better muscle activation.'
            },
            {
              icon: 'trending-down',
              title: 'Dips with forward lean',
              description: 'Make lower chest fire maximally for enhanced development.'
            }
          ]
        },
        {
          name: 'Decline Drop Set',
          duration: '16-20 min',
          description: '2 rounds:\n• 10 heavy decline press\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity decline drop sets push lower chest muscle failure across multiple weight ranges for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy set near failure',
              description: 'Drops controlled and slower for maximum muscle tension.'
            },
            {
              icon: 'trending-down',
              title: 'Focus contraction on lower pec line',
              description: 'During lighter sets for enhanced muscle development.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Cable crossover',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Cable Chest Foundation',
          duration: '12-15 min',
          description: '3 rounds:\n• 12 high cable fly\n• 12 mid cable fly\n• 12 low cable fly\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to cable training targeting all areas of chest development with constant tension.',
          moodTips: [
            {
              icon: 'body',
              title: 'Maintain constant tension',
              description: 'Keep tension on chest throughout entire range of motion.'
            },
            {
              icon: 'flash',
              title: 'Focus on the squeeze',
              description: 'Contract chest hard at the end of each rep for maximum activation.'
            }
          ]
        },
        {
          name: 'Cable Press Circuit',
          duration: '10-12 min',
          description: '3 rounds:\n• 10 standing cable press\n• 10 single-arm cable press\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds chest pressing strength with cable resistance and unilateral training for balanced development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stand tall with core engaged',
              description: 'Maintain stable base for optimal power transfer.'
            },
            {
              icon: 'trending-up',
              title: 'Press across body midline',
              description: 'For maximum chest fiber recruitment and activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Cable Fly Complex',
          duration: '14-16 min',
          description: '4 rounds:\n• 10 high cable fly\n• 10 mid cable fly\n• 8 cable press\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive cable training combining isolation and pressing movements for intermediate chest development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Smooth transitions between exercises',
              description: 'Keep muscles under constant tension for growth stimulus.'
            },
            {
              icon: 'flash',
              title: 'Emphasize the stretch',
              description: 'Full range of motion on flyes for maximum muscle activation.'
            }
          ]
        },
        {
          name: 'Cable Power Circuit',
          duration: '12-15 min',
          description: '3 rounds:\n• 8 explosive cable press\n• 10 single-arm cable fly\n• 8 cable punches\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Power-focused cable training with explosive movements for intermediate athletic development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive press with control',
              description: 'Fast concentric, controlled eccentric for power development.'
            },
            {
              icon: 'fitness',
              title: 'Cable punches: Full extension',
              description: 'Drive through chest and maintain core stability.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Cable Drop Complex',
          duration: '16-20 min',
          description: '3 rounds:\n• 8 heavy cable fly (all angles)\n• Drop → 10 moderate\n• Drop → 12 light\n• 8 cable press\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set training with cables providing constant tension for maximum chest hypertrophy.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Time under tension focus',
              description: 'Slow eccentrics on drop sets for maximum muscle growth.'
            },
            {
              icon: 'flash',
              title: 'Peak contraction emphasis',
              description: 'Hold squeeze for 1s at peak contraction on every rep.'
            }
          ]
        },
        {
          name: 'Cable Finisher',
          duration: '15-18 min',
          description: '2 rounds:\n• 15 high cable fly\n• 15 mid cable fly\n• 15 low cable fly\n• 10 cable press\n• Rest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-volume cable finisher for advanced trainees seeking maximum chest pump and metabolic stress.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Maintain perfect form',
              description: 'Even under fatigue, prioritize form over speed.'
            },
            {
              icon: 'body',
              title: 'Feel the chest working',
              description: 'Mind-muscle connection crucial for high-volume training.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Chest press machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Machine Press Foundation',
          duration: '12-15 min',
          description: '3 rounds:\n• 12 chest press (light)\n• 10 wide grip press\n• 10 narrow grip press\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Safe machine-based introduction to chest pressing with different grip positions for comprehensive development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Adjust seat height properly',
              description: 'Handles should align with mid-chest for optimal pressing angle.'
            },
            {
              icon: 'body',
              title: 'Keep back flat against pad',
              description: 'Maintain contact throughout entire range of motion.'
            }
          ]
        },
        {
          name: 'Machine Chest Circuit',
          duration: '10-12 min',
          description: '3 rounds:\n• 10 chest press\n• 10 pec deck (if available)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Simple machine circuit combining pressing and isolation for beginner chest development.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Control the tempo',
              description: '2s down, 1s pause, 2s up for muscle control.'
            },
            {
              icon: 'flash',
              title: 'Focus on chest squeeze',
              description: 'Contract chest hard at the top of each press.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Machine Press Pyramid',
          duration: '14-16 min',
          description: '4 rounds:\n• 12 light chest press\n• 10 moderate chest press\n• 8 heavy chest press\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive loading pyramid that builds strength across different rep ranges for intermediate development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Increase weight progressively',
              description: 'Each set should challenge you at the target rep range.'
            },
            {
              icon: 'timer',
              title: 'Rest between weight changes',
              description: 'Take time to adjust weight properly between sets.'
            }
          ]
        },
        {
          name: 'Machine Strength Circuit',
          duration: '12-15 min',
          description: '3 rounds:\n• 8 heavy chest press\n• 10 single-arm chest press\n• 12 pec deck\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Strength-focused machine training with unilateral work for intermediate power and stability.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Single-arm challenges core',
              description: 'Maintain stable torso during unilateral pressing.'
            },
            {
              icon: 'body',
              title: 'Feel the stretch on pec deck',
              description: 'Full range of motion for maximum muscle activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Machine Drop Set',
          duration: '16-20 min',
          description: '3 rounds:\n• 8 heavy chest press\n• Drop → 10 moderate\n• Drop → 12 light\n• 10 pec deck\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set protocol using machine safety for maximum intensity and chest hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push to near failure',
              description: 'Machines provide safety to train intensely.'
            },
            {
              icon: 'speedometer',
              title: 'Quick weight adjustments',
              description: 'Minimize rest between drop set weights.'
            }
          ]
        },
        {
          name: 'Machine Power Complex',
          duration: '15-18 min',
          description: '3 rounds:\n• 6 explosive chest press\n• 8 controlled chest press\n• 10 pec deck\n• 8 single-arm press\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced power and control complex using machine stability for maximum chest development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive concentric',
              description: 'Drive the weight up with maximum intent.'
            },
            {
              icon: 'timer',
              title: 'Controlled eccentric',
              description: '3s descent for maximum time under tension.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Dip station',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Assisted Dip Circuit',
          duration: '10-12 min',
          description: '3 rounds:\n• 8 assisted dips (use band or machine)\n• 10 bench dips\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to dip movements with assistance to build strength progressively.',
          moodTips: [
            {
              icon: 'body',
              title: 'Lean slightly forward',
              description: 'Engage chest more than triceps during the movement.'
            },
            {
              icon: 'trending-down',
              title: 'Control the descent',
              description: 'Lower slowly to protect shoulders and maximize muscle activation.'
            }
          ]
        },
        {
          name: 'Dip Progression',
          duration: '12-15 min',
          description: '3 rounds:\n• 6 assisted dips\n• 8 bench dips\n• 10 push-ups\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive dip training combined with complementary movements for comprehensive beginner chest development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Use assistance as needed',
              description: 'Gradually reduce assistance as strength improves.'
            },
            {
              icon: 'flash',
              title: 'Focus on chest engagement',
              description: 'Feel the stretch and contraction in chest muscles.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Dip Strength Circuit',
          duration: '14-16 min',
          description: '4 rounds:\n• 8 bodyweight dips\n• 10 bench dips\n• 8 diamond push-ups\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate bodyweight dip training with supporting movements for strength and endurance development.',
          moodTips: [
            {
              icon: 'body',
              title: 'Maintain forward lean',
              description: 'Keep chest engaged throughout entire range of motion.'
            },
            {
              icon: 'fitness',
              title: 'Full range of motion',
              description: 'Lower until shoulders are below elbows, press to full extension.'
            }
          ]
        },
        {
          name: 'Dip Power Complex',
          duration: '12-15 min',
          description: '3 rounds:\n• 6 explosive dips\n• 8 controlled dips\n• 10 incline push-ups\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Power-focused dip training combining explosive and controlled movements for intermediate athletic development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive up, controlled down',
              description: 'Drive up with maximum intent, control the descent.'
            },
            {
              icon: 'timer',
              title: 'Quality over quantity',
              description: 'Perfect form is more important than speed.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Dip Complex',
          duration: '16-20 min',
          description: '3 rounds:\n• 8 weighted dips\n• 10 bodyweight dips\n• 12 bench dips\n• 10 push-ups\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced weighted dip complex with descending difficulty for maximum chest and tricep development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Start with appropriate weight',
              description: 'Add weight gradually as strength improves over time.'
            },
            {
              icon: 'shield',
              title: 'Warm up thoroughly',
              description: 'Heavy dips require proper shoulder and chest preparation.'
            }
          ]
        },
        {
          name: 'Dip Endurance Challenge',
          duration: '15-18 min',
          description: '2 rounds:\n• Max bodyweight dips\n• 20 bench dips\n• 15 diamond push-ups\n• 20 regular push-ups\n• Rest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced endurance challenge testing maximum dip capacity and muscular endurance.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pace yourself on max set',
              description: 'Start strong but maintain form throughout.'
            },
            {
              icon: 'refresh',
              title: 'Mental toughness required',
              description: 'Push through fatigue while maintaining perfect form.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Pec dec machine',
    icon: 'contract',
    workouts: {
      beginner: [
        {
          name: 'Pec Dec Foundation',
          duration: '10-12 min',
          description: '3 rounds:\n• 12 pec dec fly\n• 10 reverse pec dec (rear delts)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to pec dec training focusing on chest isolation and shoulder balance.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Adjust seat height properly',
              description: 'Upper arms should be parallel to floor at mid-chest level.'
            },
            {
              icon: 'body',
              title: 'Keep back flat against pad',
              description: 'Maintain contact and avoid arching during the movement.'
            }
          ]
        },
        {
          name: 'Isolation Circuit',
          duration: '12-15 min',
          description: '3 rounds:\n• 10 pec dec fly\n• 8 chest press (if available)\n• 10 pec dec fly\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Isolation-focused circuit combining pec dec with pressing movements for comprehensive beginner chest development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Focus on the squeeze',
              description: 'Contract chest hard as pads come together.'
            },
            {
              icon: 'timer',
              title: 'Control the negative',
              description: 'Slow descent to maximize muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Pec Dec Pyramid',
          duration: '14-16 min',
          description: '4 rounds:\n• 12 light pec dec\n• 10 moderate pec dec\n• 8 heavy pec dec\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive loading pyramid that challenges chest isolation across different rep ranges for intermediate development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Increase weight progressively',
              description: 'Each set should challenge you at the target rep range.'
            },
            {
              icon: 'body',
              title: 'Feel the chest working',
              description: 'Mind-muscle connection is crucial for isolation work.'
            }
          ]
        },
        {
          name: 'Pre-Exhaust Circuit',
          duration: '12-15 min',
          description: '3 rounds:\n• 12 pec dec fly\n• 8 chest press (immediately after)\n• 10 push-ups\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Pre-exhaustion protocol using pec dec to fatigue chest before pressing movements for intermediate intensity.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'No rest between exercises',
              description: 'Move immediately from pec dec to pressing movements.'
            },
            {
              icon: 'flash',
              title: 'Push through fatigue',
              description: 'Chest will be pre-fatigued, focus on quality reps.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Pec Dec Drop Set',
          duration: '16-20 min',
          description: '3 rounds:\n• 10 heavy pec dec\n• Drop → 12 moderate\n• Drop → 15 light\n• 8 chest press\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set protocol maximizing chest isolation and hypertrophy through machine safety and control.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Quick weight adjustments',
              description: 'Minimize rest time between drop set weights.'
            },
            {
              icon: 'timer',
              title: 'Time under tension focus',
              description: 'Slow eccentrics even under fatigue for maximum growth.'
            }
          ]
        },
        {
          name: 'Pec Dec Finisher',
          duration: '15-18 min',
          description: '2 rounds:\n• 20 pec dec fly\n• 15 chest press\n• 20 pec dec fly\n• Max push-ups\n• Rest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-volume pec dec finisher for advanced trainees seeking maximum chest pump and metabolic stress.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Maintain perfect form',
              description: 'Even under fatigue, prioritize form over speed.'
            },
            {
              icon: 'flash',
              title: 'Push through the burn',
              description: 'Mental toughness required for high-volume training.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Smith machine',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Smith Machine Basics',
          duration: '12-15 min',
          description: '3 rounds:\n• 10 Smith bench press\n• 8 Smith incline press\n• 10 push-ups\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Safe introduction to barbell movements using Smith machine stability for beginner chest development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Set safety bars properly',
              description: 'Position safety bars just below chest level for protection.'
            },
            {
              icon: 'body',
              title: 'Maintain natural arch',
              description: 'Keep slight natural arch in back during pressing movements.'
            }
          ]
        },
        {
          name: 'Smith Press Circuit',
          duration: '10-12 min',
          description: '3 rounds:\n• 8 Smith bench press\n• 8 Smith close-grip press\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Basic Smith machine pressing circuit with grip variations for comprehensive beginner chest training.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip width matters',
              description: 'Wide grip targets outer chest, close grip emphasizes inner chest.'
            },
            {
              icon: 'speedometer',
              title: 'Control the tempo',
              description: '2s down, 1s pause, 2s up for muscle control.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Smith Machine Strength',
          duration: '14-16 min',
          description: '4 rounds:\n• 8 Smith bench press\n• 6 Smith incline press\n• 8 Smith close-grip press\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Strength-focused Smith machine training with multiple angles for intermediate chest development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Progressive overload',
              description: 'Gradually increase weight as strength improves.'
            },
            {
              icon: 'construct',
              title: 'Adjust bench angles',
              description: 'Use different bench angles to target all areas of chest.'
            }
          ]
        },
        {
          name: 'Smith Complex Circuit',
          duration: '12-15 min',
          description: '3 rounds:\n• 6 Smith bench press\n• 8 Smith incline press\n• 10 push-ups\n• 8 dips\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Complex training combining Smith machine pressing with bodyweight movements for intermediate power development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Smooth transitions',
              description: 'Move efficiently between Smith machine and bodyweight exercises.'
            },
            {
              icon: 'flash',
              title: 'Maintain intensity',
              description: 'Keep workout intensity high throughout entire circuit.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Smith Machine Drop Set',
          duration: '16-20 min',
          description: '3 rounds:\n• 6 heavy Smith bench press\n• Drop → 8 moderate\n• Drop → 10 light\n• 8 Smith incline press\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set protocol using Smith machine safety features for maximum intensity and chest hypertrophy.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Quick weight changes',
              description: 'Practice efficient weight changes for minimal rest.'
            },
            {
              icon: 'shield',
              title: 'Safety first',
              description: 'Use safety bars and proper form even under fatigue.'
            }
          ]
        },
        {
          name: 'Smith Power Complex',
          duration: '15-18 min',
          description: '3 rounds:\n• 5 explosive Smith bench press\n• 6 controlled Smith bench press\n• 8 Smith incline press\n• 10 push-ups\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced power and control complex using Smith machine stability for maximum chest development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive concentric',
              description: 'Drive the bar up with maximum speed and intent.'
            },
            {
              icon: 'timer',
              title: 'Controlled eccentric',
              description: '3s descent for maximum time under tension.'
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
          <Ionicons name="play" size={20} color='#000000' />
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
          <Ionicons name={icon} size={24} color='#FFD700' />
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

export default function ChestWorkoutDisplayScreen() {
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
    selectedEquipmentNames = ['Adjustable bench'];
  }
  
  const difficulty = (params.difficulty as string || 'beginner').toLowerCase();
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Chest';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment
  const userWorkouts = chestWorkoutDatabase.filter(item => 
    selectedEquipmentNames.includes(item.equipment)
  );

  console.log('Debug info:', {
    selectedEquipmentNames,
    chestWorkoutDatabaseEquipment: chestWorkoutDatabase.map(w => w.equipment),
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
          duration: workout.duration || '15 min',
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
              <Ionicons name="fitness" size={12} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{workoutType}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {/* Step 3: Intensity Level */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="speedometer" size={12} color='#000000' />
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
                'Adjustable bench': 'square',
                'Flat bench': 'square',
                'Incline bench': 'trending-up',
                'Decline bench': 'trending-down',
                'Cable crossover': 'reorder-three',
                'Chest press machine': 'hardware-chip',
                'Dip station': 'remove',
                'Pec dec machine': 'contract',
                'Smith machine': 'barbell'
              };
              return equipmentIconMap[equipmentName] || 'fitness';
            };

            return (
              <React.Fragment key={equipment}>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <Ionicons name={getEquipmentIcon(equipment)} size={12} color='#000000' />
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