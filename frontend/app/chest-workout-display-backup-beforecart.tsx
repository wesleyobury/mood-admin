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

// Complete Chest workout database with 1-line titles and summaries for cards and detailed battle plans for guidance
const chestWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Flat bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Push-Up Circuit',
          duration: '10-12 min',
          description: 'Push-ups and dips using the bench to\nbuild beginner chest strength and control.\n ',
          battlePlan: '3 rounds:\n• 10 push-ups (hands on bench)\n• 10 bench dips\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect bench-assisted introduction to chest and tricep strength.',
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
          name: 'Chest Press',
          duration: '12-15 min',
          description: 'Light bench press and fly pairing to\ndevelop chest contraction and stretch.\n ',
          battlePlan: '3 rounds:\n• 12 light dumbbell or Smith bench press\n• 10 dumbbell bench fly\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Beginner-friendly pressing and isolation movement foundation.',
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
          name: 'Plyo Push-Ups',
          duration: '14-16 min',
          description: 'Explosive push-ups and single-arm presses\nfor power and unilateral strength.\n ',
          battlePlan: '4 rounds:\n• 8 explosive push-ups (hands on bench)\n• 10 single-arm bench press\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive plyometric training with unilateral strength development.',
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
          name: 'Chest Flow',
          duration: '12-15 min',
          description: 'Bench press, fly, and close-grip sequence\nfor balanced chest hypertrophy.\n ',
          battlePlan: '3 rounds:\n• 10 bench press\n• 10 fly\n• 10 close-grip bench press\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Continuous flow training for chest overload and development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Fly → press transition, don't rest',
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
          description: 'Multi-move complex combining presses,\nflys, push-ups, and dips for overload.\n ',
          battlePlan: '3 rounds:\n• 8 bench press\n• 8 bench fly\n• 8 plyo push-ups (hands on bench)\n• 8 dips\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex training for maximum chest development.',
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
          name: 'Drop Set',
          duration: '16-20 min',
          description: 'Heavy-to-light drop set presses to\nmaximize fatigue and muscle growth.\n ',
          battlePlan: '2 rounds:\n• 10 heavy bench press\n• Drop → 10 moderate\n• Drop → 10 light\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity drop sets for advanced muscle failure.',
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
          name: 'Push-Up Circuit',
          duration: '10-12 min',
          description: 'Incline push-ups and presses to\ntarget upper chest endurance.\n ',
          battlePlan: '3 rounds:\n• 10 incline push-ups\n• 10 light incline bench press\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to upper chest development training.',
          moodTips: [
            {
              icon: 'body',
              title: 'Push-ups: Push through hands',
              description: 'As if you're wrapping chest around ribcage for better activation.'
            },
            {
              icon: 'trending-up',
              title: 'Incline press: Bring bar/bells below clavicles',
              description: 'Elbows just inside wrists for better upper pec stretch.'
            }
          ]
        },
        {
          name: 'Chest Press',
          duration: '12-15 min',
          description: 'Incline press and fly combo for\nupper pec activation.\n ',
          battlePlan: '3 rounds:\n• 12 incline bench press (light)\n• 10 incline fly\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Beginner incline pressing and isolation combination.',
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
          name: 'Plyo Push-Ups',
          duration: '14-16 min',
          description: 'Plyo push-ups and single-arm presses\nfor explosive upper chest strength.\n ',
          battlePlan: '4 rounds:\n• 8 incline plyo push-ups\n• 10 single-arm incline press\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive training for intermediate upper chest power.',
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
          name: 'Chest Flow',
          duration: '12-15 min',
          description: 'Incline press, fly, and close-grip press\nsequence for growth density.\n ',
          battlePlan: '3 rounds:\n• 10 incline bench press\n• 10 incline fly\n• 10 close-grip incline press\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Continuous flow training for upper chest overload.',
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
          description: 'Press, fly, push-ups, and dips for\ncomplete incline overload.\n ',
          battlePlan: '3 rounds:\n• 8 incline bench press\n• 8 incline fly\n• 8 incline plyo push-ups\n• 8 dips\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex training for maximum upper chest development.',
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
          name: 'Drop Set',
          duration: '16-20 min',
          description: 'Heavy-to-light incline presses for\nmaximum fatigue and hypertrophy.\n ',
          battlePlan: '2 rounds:\n• 10 heavy incline press\n• Drop → 10 moderate\n• Drop → 10 light\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity incline drop sets for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive concentric on heavy sets',
              description: 'On light sets, slow eccentric + peak contraction squeeze for growth.'
            },
            {
              icon: 'shield',
              title: 'Keep scapula pinned',
              description: 'Don't let shoulders roll forward under fatigue for safety and effectiveness.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Adjustable bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Press Circuit',
          duration: '15-18 min',
          description: 'Presses at flat, incline, and decline\nangles for full pec coverage.\n ',
          battlePlan: '3 rounds:\n• 10 flat press\n• 10 incline press\n• 10 decline press (light)\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect multi-angle introduction targeting all pec areas.',
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
          description: 'Flat, incline, and decline flys for\nchest isolation from all angles.\n ',
          battlePlan: '3 rounds:\n• 10 flat fly\n• 10 incline fly\n• 10 decline fly (light)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle fly progression across multiple angles.',
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
          description: 'Press progression across flat, incline,\nand decline angles for fiber recruitment.\n ',
          battlePlan: '3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive recruitment training across all chest angles.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Think progressive recruitment',
              description: 'Start more pec-dominant, progress to fatigue lower range.'
            },
            {
              icon: 'timer',
              title: 'Don't rush-feel pec stretch',
              description: 'On each angle for maximum muscle activation and growth.'
            }
          ]
        },
        {
          name: 'Plyo Push-Ups',
          duration: '14-16 min',
          description: 'Explosive push-ups at varying angles\nplus single-arm presses for adaptation.\n ',
          battlePlan: '4 rounds:\n• 8 explosive plyo push-ups (vary bench angle each round)\n• 10 single-arm press\nRest 75s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Explosive multi-angle training for pec adaptation.',
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
          name: 'Complex',
          duration: '15-20 min',
          description: 'Multi-angle presses and fly for\nhypertrophy density.\n ',
          battlePlan: '3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\n• 8 fly (choose angle)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced hypertrophy density training with multi-angle work.',
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
          description: 'Heavy-to-light pressing at any angle\nfor intense chest burnout.\n ',
          battlePlan: '2 rounds:\n• 10 heavy press (any angle)\n• Drop → 10 moderate\n• Drop → 10 light\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity drop sets with time under tension focus.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Don't save energy',
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
    equipment: 'Decline bench',
    icon: 'trending-down',
    workouts: {
      beginner: [
        {
          name: 'Push-Up Circuit',
          duration: '10-12 min',
          description: 'Decline push-ups and presses for\nlower chest activation.\n ',
          battlePlan: '3 rounds:\n• 8 decline push-ups (feet on bench)\n• 10 decline bench press (light)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to lower chest development training.',
          moodTips: [
            {
              icon: 'body',
              title: 'Decline push-ups: Keep core tight',
              description: 'Maintain straight line from head to feet throughout the movement.'
            },
            {
              icon: 'trending-down',
              title: 'Decline press: Lower to nipple line',
              description: 'Focus on lower pec stretch and contraction for optimal activation.'
            }
          ]
        },
        {
          name: 'Chest Press',
          duration: '12-15 min',
          description: 'Decline press and fly combo for\nlower pec focus.\n ',
          battlePlan: '3 rounds:\n• 12 decline bench press (light)\n• 10 decline fly\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Beginner decline pressing and isolation combination.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Focus on lower pec squeeze',
              description: 'At the top of each rep to maximize lower chest activation.'
            },
            {
              icon: 'construct',
              title: 'Secure feet properly',
              description: 'Good foot placement prevents sliding and ensures safety.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Plyo Push-Ups',
          duration: '14-15 min',
          description: 'Explosive decline push-ups and single-arm\npresses for power and tension.\n ',
          battlePlan: '4 rounds:\n• 8 decline plyo push-ups\n• 10 single-arm decline press\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive training for intermediate lower chest power.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plyo push-ups: Explosive drive',
              description: 'Push with maximum intent to recruit fast-twitch fibers.'
            },
            {
              icon: 'fitness',
              title: 'Single-arm: Control the negative',
              description: 'Slow descent creates more time under tension for growth.'
            }
          ]
        },
        {
          name: 'Chest Flow',
          duration: '12-15 min',
          description: 'Decline press, fly, and close-grip bench\npress for metabolic stress.\n ',
          battlePlan: '3 rounds:\n• 10 decline bench press\n• 10 decline fly\n• 10 close-grip decline press\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Continuous flow training for lower chest overload.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Flow training creates metabolic stress',
              description: 'Key driver for lower chest hypertrophy and development.'
            },
            {
              icon: 'hand-left',
              title: 'Close-grip: Focus on inner chest',
              description: 'Emphasize adduction movement for maximum inner pec activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complex',
          duration: '15-18 min',
          description: 'Decline press, fly, push-ups, and dips\nfor complete chest overload.\n ',
          battlePlan: '3 rounds:\n• 8 decline bench press\n• 8 decline fly\n• 8 decline plyo push-ups\n• 8 dips\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex training for maximum lower chest development.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Decline angle maximizes lower chest',
              description: 'Focus on lower pec contraction throughout all movements.'
            },
            {
              icon: 'body',
              title: 'Dips complement decline work',
              description: 'Similar angle targets lower chest fibers effectively.'
            }
          ]
        },
        {
          name: 'Drop Set',
          duration: '16-20 min',
          description: 'Heavy-to-light decline presses for\nprogressive hypertrophy.\n ',
          battlePlan: '2 rounds:\n• 10 heavy decline press\n• Drop → 10 moderate\n• Drop → 10 light\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity decline drop sets for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy set: All-out effort',
              description: 'Push to near failure for maximum muscle recruitment.'
            },
            {
              icon: 'speedometer',
              title: 'Light sets: Focus on control',
              description: 'Slow eccentrics maximize time under tension for growth.'
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
          name: 'Chest Press',
          duration: '12-14 min',
          description: 'Flat and incline Smith presses for\nguided pressing strength.\n ',
          battlePlan: '3 rounds:\n• 10 Smith bench press\n• 8 Smith incline press\n• 10 push-ups\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Safe introduction to barbell movements with stability.',
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
          name: 'Push-Up Circuit',
          duration: '10-12 min',
          description: 'Push-ups and close-grip Smith presses\nfor foundational chest endurance.\n ',
          battlePlan: '3 rounds:\n• 8 Smith bench press\n• 8 Smith close-grip press\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Basic Smith machine pressing with grip variations.',
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
          name: 'Angle Ladder',
          duration: '14-15 min',
          description: 'Flat, incline, and decline Smith presses\nto stress fibers at all angles.\n ',
          battlePlan: '4 rounds:\n• 8 Smith bench press\n• 6 Smith incline press\n• 8 Smith close-grip press\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Strength-focused Smith machine training with multiple angles.',
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
          name: 'Plyo Push-Ups',
          duration: '14-16 min',
          description: 'Explosive bar push-ups and single-arm\npresses for power and hypertrophy.\n ',
          battlePlan: '3 rounds:\n• 6 Smith bench press\n• 8 Smith incline press\n• 10 push-ups\n• 8 dips\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Complex training combining Smith machine with bodyweight.',
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
          name: 'Complex',
          duration: '15-18 min',
          description: 'Pressing complex at multiple angles\nfor sustained chest tension.\n ',
          battlePlan: '3 rounds:\n• 6 heavy Smith bench press\n• Drop → 8 moderate\n• Drop → 10 light\n• 8 Smith incline press\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set protocol using Smith machine safety.',
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
          name: 'Drop Set',
          duration: '16-20 min',
          description: 'Heavy-to-light Smith pressing for\nchest fatigue and growth.\n ',
          battlePlan: '3 rounds:\n• 5 explosive Smith bench press\n• 6 controlled Smith bench press\n• 8 Smith incline press\n• 10 push-ups\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced power and control complex using Smith stability.',
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
  },
  {
    equipment: 'Chest press machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Press Circuit',
          duration: '12-14 min',
          description: 'Machine press variations with close-grip\nfocus for controlled activation.\n ',
          battlePlan: '3 rounds:\n• 12 chest press (light)\n• 10 wide grip press\n• 10 narrow grip press\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Safe machine-based introduction with different grip positions.',
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
          name: 'Press & Fly',
          duration: '12-14 min',
          description: 'Press and fly pairing for contraction\nand stretch under load.\n ',
          battlePlan: '3 rounds:\n• 10 chest press\n• 10 pec deck (if available)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Simple machine circuit combining pressing and isolation.',
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
          name: 'Drop Set',
          duration: '16-18 min',
          description: 'Heavy-to-light machine press drop set\nfor maximum pump.\n ',
          battlePlan: '4 rounds:\n• 12 light chest press\n• 10 moderate chest press\n• 8 heavy chest press\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive loading pyramid across different rep ranges.',
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
          name: 'Ladder',
          duration: '14-16 min',
          description: 'Wide, neutral, and close grips to\ntarget full chest fibers.\n ',
          battlePlan: '3 rounds:\n• 8 heavy chest press\n• 10 single-arm chest press\n• 12 pec deck\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Strength-focused machine training with unilateral work.',
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
          name: 'AMRAP',
          duration: '10 min',
          description: '10-minute maximum volume chest\npress challenge.\n ',
          battlePlan: '3 rounds:\n• 8 heavy chest press\n• Drop → 10 moderate\n• Drop → 12 light\n• 10 pec deck\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set protocol using machine safety.',
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
          name: 'Complex',
          duration: '15-18 min',
          description: 'Wide, close, and single-arm presses\nfor hypertrophy and stability.\n ',
          battlePlan: '3 rounds:\n• 6 explosive chest press\n• 8 controlled chest press\n• 10 pec deck\n• 8 single-arm press\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced power and control complex using machine stability.',
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
    equipment: 'Pec dec machine',
    icon: 'contract',
    workouts: {
      beginner: [
        {
          name: 'Pec Dec Circuit',
          duration: '12-14 min',
          description: 'Pec fly and rear delt fly combo for\nchest-shoulder balance.\n ',
          battlePlan: '3 rounds:\n• 12 pec dec fly\n• 10 reverse pec dec (rear delts)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to pec dec training and shoulder balance.',
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
          name: 'Pec Dec Hold',
          duration: '10-12 min',
          description: 'Pec flys with static holds for\ncontraction emphasis.\n ',
          battlePlan: '3 rounds:\n• 10 pec dec fly\n• 8 chest press (if available)\n• 10 pec dec fly\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Isolation-focused circuit combining pec dec with pressing.',
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
          name: 'Drop Set',
          duration: '16-18 min',
          description: 'Heavy-to-light pec deck flys for\nstretch and squeeze combo.\n ',
          battlePlan: '4 rounds:\n• 12 light pec dec\n• 10 moderate pec dec\n• 8 heavy pec dec\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive loading across different rep ranges.',
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
          name: 'Ladder',
          duration: '14-15 min',
          description: 'Wide-to-close grip fly ladder for\nfull fiber recruitment.\n ',
          battlePlan: '3 rounds:\n• 12 pec dec fly\n• 8 chest press (immediately after)\n• 10 push-ups\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Pre-exhaustion protocol using pec dec to fatigue chest.',
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
          name: 'AMRAP',
          duration: '10 min',
          description: 'Max pec deck fly reps in 10 minutes\nfor burnout.\n ',
          battlePlan: '3 rounds:\n• 10 heavy pec dec\n• Drop → 12 moderate\n• Drop → 15 light\n• 8 chest press\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set protocol maximizing chest isolation.',
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
          name: 'Complex',
          duration: '15-18 min',
          description: 'Fly variations including rear delt and\nsingle-arm for chest/shoulder isolation.\n ',
          battlePlan: '2 rounds:\n• 20 pec dec fly\n• 15 chest press\n• 20 pec dec fly\n• Max push-ups\nRest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-volume pec dec finisher for maximum chest pump.',
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
    equipment: 'Cable crossover',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Fly Circuit',
          duration: '12-14 min',
          description: 'Cable flys at standing and low-to-high\nangles for tension and stretch.\n ',
          battlePlan: '3 rounds:\n• 10 cable fly (high position)\n• 10 cable fly (low position)\n• 8 cable press\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to cable chest training with angles.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Adjust cable height for target area',
              description: 'High = upper chest, mid = middle chest, low = lower chest.'
            },
            {
              icon: 'body',
              title: 'Maintain slight forward lean',
              description: 'Stable stance with one foot forward for balance.'
            }
          ]
        },
        {
          name: 'Press Circuit',
          duration: '12-14 min',
          description: 'Standing and single-arm presses with\ncables for chest isolation.\n ',
          battlePlan: '3 rounds:\n• 10 standing cable press\n• 8 single-arm cable press (each arm)\n• 10 cable fly\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlknwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Functional cable training combining bilateral and unilateral work.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Engage core throughout',
              description: 'Standing position requires core stability for balance.'
            },
            {
              icon: 'flash',
              title: 'Control the cables',
              description: 'Smooth movement prevents momentum and maximizes tension.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Fly Ladder',
          duration: '14-16 min',
          description: 'High-to-low, low-to-high, and mid flys\nto hit pecs at every line.\n ',
          battlePlan: '3 rounds:\n• 8 high cable fly\n• 8 mid cable fly\n• 8 low cable fly\n• 10 cable press\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Comprehensive cable training targeting all chest angles.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Different angles target different fibers',
              description: 'High = upper, mid = middle, low = lower chest emphasis.'
            },
            {
              icon: 'refresh',
              title: 'Smooth transitions between angles',
              description: 'Keep muscles under constant tension for growth stimulus.'
            }
          ]
        },
        {
          name: 'Press & Fly',
          duration: '14-16 min',
          description: 'Press, fly, and single-arm fly sequence\nfor hypertrophy density.\n ',
          battlePlan: '3 rounds:\n• 8 explosive cable press\n• 10 single-arm cable fly\n• 8 cable punches\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Power-focused cable training with explosive movements.',
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
          name: 'Complex',
          duration: '15-18 min',
          description: 'Multi-plane cable presses and flys\nfor total pec tension.\n ',
          battlePlan: '3 rounds:\n• 8 heavy cable fly (all angles)\n• Drop → 10 moderate\n• Drop → 12 light\n• 8 cable press\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set training with constant cable tension.',
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
          name: 'Drop Set',
          duration: '16-18 min',
          description: 'Heavy-to-light flys with holds for\ndeep chest pump.\n ',
          battlePlan: '2 rounds:\n• 15 high cable fly\n• 15 mid cable fly\n• 15 low cable fly\n• 10 cable press\nRest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-volume cable finisher for maximum chest pump.',
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
    equipment: 'Dip station',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Assisted Dips',
          duration: '12-14 min',
          description: 'Assisted dips and bench dips for\nbeginner chest activation.\n ',
          battlePlan: '3 rounds:\n• 8 assisted dips (use band or machine)\n• 10 bench dips\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to dip movements with assistance.',
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
          name: 'Dip & Push-Up',
          duration: '10-12 min',
          description: 'Dips and push-ups paired for\nchest pump endurance.\n ',
          battlePlan: '3 rounds:\n• 6 assisted dips\n• 8 bench dips\n• 10 push-ups\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive dip training with complementary movements.',
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
          name: 'Dip Ladder',
          duration: '14-15 min',
          description: 'Standard, elevated, and negative dips\nfor progressive overload.\n ',
          battlePlan: '4 rounds:\n• 8 bodyweight dips\n• 10 bench dips\n• 8 diamond push-ups\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate bodyweight dip training with supporting movements.',
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
          name: 'Dip & Plyo',
          duration: '15 min',
          description: 'Dips and plyo push-ups combined for\nstrength and power.\n ',
          battlePlan: '3 rounds:\n• 6 explosive dips\n• 8 controlled dips\n• 10 incline push-ups\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Power-focused dip training combining explosive and control.',
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
          name: 'Weighted Dips',
          duration: '10 min',
          description: 'Max dips in 10 minutes, adding\nweight if possible.\n ',
          battlePlan: '3 rounds:\n• 8 weighted dips\n• 10 bodyweight dips\n• 12 bench dips\n• 10 push-ups\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced weighted dip complex with descending difficulty.',
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
          name: 'Complex',
          duration: '15-18 min',
          description: 'Dips, push-ups, plyo push-ups, and\nnegatives for chest finishing burnout.\n ',
          battlePlan: '2 rounds:\n• Max bodyweight dips\n• 20 bench dips\n• 15 diamond push-ups\n• 20 regular push-ups\nRest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced endurance challenge testing maximum dip capacity.',
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
  const flatListRef = useRef<FlatList>(null);

  console.log(`💪 WorkoutCard for ${equipment}: received ${workouts.length} workouts for ${difficulty} difficulty`);

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

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentWorkoutIndex(viewableItems[0].index || 0);
    }
  }).current;

  const onScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    
    // Calculate current index based on scroll position
    const currentIndex = Math.round(contentOffset.x / viewSize.width);
    setCurrentWorkoutIndex(currentIndex);
  };

  if (workouts.length === 0) {
    return null;
  }

  return (
    <View style={styles.workoutCard}>
      {/* Equipment Header */}
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentIconContainer}>
          <Ionicons name={icon} size={16} color='#FFD700' />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <View style={styles.workoutIndicator}>
          <Text style={styles.workoutCount}>{currentWorkoutIndex + 1}/{workouts.length}</Text>
        </View>
      </View>

      {/* Workout List */}
      <View style={styles.workoutList}>
        <FlatList
          ref={flatListRef}
          data={workouts}
          renderItem={renderWorkout}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50
          }}
          getItemLayout={(data, index) => ({
            length: width - 48,
            offset: (width - 48) * index,
            index,
          })}
          keyExtractor={(item, index) => `${equipment}-${item.name}-${index}`}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      </View>

      {/* Navigation Dots */}
      <View style={styles.dotsContainer}>
        <Text style={styles.dotsLabel}>Swipe to explore</Text>
        <View style={styles.dotsRow}>
          {workouts.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dotTouchArea,
                currentWorkoutIndex === index && styles.activeDotTouchArea,
              ]}
              onPress={() => {
                console.log(`🔥 Dot clicked: index ${index}, width: ${width - 48}`);
                const offset = (width - 48) * index;
                console.log(`🔥 Scrolling to offset: ${offset}`);
                
                // Use scrollToOffset instead of scrollToIndex for better web compatibility
                flatListRef.current?.scrollToOffset({
                  offset: offset,
                  animated: true
                });
                setCurrentWorkoutIndex(index);
              }}
              activeOpacity={0.7}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <View style={[
                styles.dot,
                currentWorkoutIndex === index && styles.activeDot,
              ]} />
            </TouchableOpacity>
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
    userWorkoutsLength: userWorkouts.length,
    equipmentParam: equipmentParam
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
          battlePlan: workout.battlePlan || '',
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

  // Create progress bar - single row with requested order
  const createProgressRows = () => {
    const steps = [
      { key: 'mood', icon: 'flame', text: moodTitle },
      { key: 'bodyPart', icon: 'fitness', text: workoutType },
      { key: 'difficulty', icon: 'speedometer', text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `${selectedEquipmentNames.length} Equipment` },
    ];

    // Return single row
    return [steps];
  };

  const getEquipmentIcon = (equipmentName: string): keyof typeof Ionicons.glyphMap => {
    const equipmentIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'Adjustable bench': 'square',
      'Cable crossover': 'reorder-three',
      'Chest press machine': 'hardware-chip',
      'Decline bench': 'trending-down',
      'Dip station': 'remove',
      'Flat bench': 'square',
      'Incline bench': 'trending-up',
      'Pec dec machine': 'contract',
      'Smith machine': 'barbell'
    };
    return equipmentIconMap[equipmentName] || 'fitness';
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

      {/* Workouts List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {uniqueUserWorkouts.length > 0 ? (
          uniqueUserWorkouts.map((equipmentData, index) => {
            console.log(`Rendering card ${index + 1}: ${equipmentData.equipment}`);
            const difficultyWorkouts = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
            
            return (
              <WorkoutCard
                key={`${equipmentData.equipment}-${index}`}
                equipment={equipmentData.equipment}
                icon={equipmentData.icon}
                workouts={difficultyWorkouts}
                difficulty={difficulty}
                difficultyColor={difficultyColor}
                onStartWorkout={handleStartWorkout}
              />
            );
          })
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="fitness" size={48} color='#FFD700' />
            <Text style={styles.noWorkoutsTitle}>No Workouts Found</Text>
            <Text style={styles.noWorkoutsSubtitle}>
              Please select different equipment or go back to make new selections.
            </Text>
          </View>
        )}
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
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 60,
  },
  progressStepActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 70,
  },
  progressConnector: {
    width: 20,
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
    marginTop: 12,
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
    marginBottom: 25,
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
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
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
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    marginHorizontal: 0,
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
    width: 12,
    height: 12,
    borderRadius: 6,
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
  dotTouchArea: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
    borderRadius: 16,
  },
  activeDotTouchArea: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  noWorkoutsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noWorkoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 16,
    marginBottom: 8,
  },
  noWorkoutsSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});