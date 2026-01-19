import React, { useState, useRef, useCallback } from 'react';
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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';
import { useCart, WorkoutItem } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Analytics } from '../utils/analytics';
import WigglingAddButton from '../components/WigglingAddButton';

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

// Upper body workout database with all push, pull, and full upper body workouts
const upperBodyWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Push',
    icon: 'arrow-up',
    workouts: {
      beginner: [
        {
          name: 'Push Starter',
          duration: '15–18 min',
          description: 'Press first, laterals next, rope pressdowns finish smoothly.',
          battlePlan: 'Machine Chest Press\n• 3 × 8–10 (RPE 4), 45–60s rest\nMachine Lateral Raise\n• 3 × 10–12 (RPE 4), 45–60s rest\nRope Pressdown\n• 3 × 10–12 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/tp8hgvtb_download%20%2828%29.png',
          intensityReason: 'Simple machines train chest, delts, tris with minimal setup.',
          moodTips: [
            {
              icon: 'body',
              title: 'Shoulders down; soft lockouts',
              description: 'Keep your shoulders depressed throughout and avoid fully locking out your elbows at the top of presses'
            },
            {
              icon: 'leaf',
              title: 'Breathe out on effort',
              description: 'Exhale during the pushing phase of each movement, inhale on the return for proper breathing mechanics'
            }
          ]
        },
        {
          name: 'Incline Balance',
          duration: '15–18 min',
          description: 'Light incline press, reverse fly, overhead triceps closer.',
          battlePlan: 'Machine Incline Chest Press\n• 3 × 8–10 (RPE 4), 60s rest\nReverse Pec Deck\n• 3 × 12 (RPE 4), 45–60s rest\nOverhead Rope Triceps\n• 3 × 10–12 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/inhlehab_download%20%2829%29.png',
          intensityReason: 'Incline press pairs with rear delts and tris for balance.',
          moodTips: [
            {
              icon: 'body',
              title: 'Chest up; elbows 30–45°',
              description: 'Keep your chest proud and position your elbows at a 30-45 degree angle from your torso for shoulder safety'
            },
            {
              icon: 'arrow-down',
              title: 'Ribs down on triceps overhead',
              description: 'Draw your ribcage down during overhead triceps to prevent lower back arching and target the triceps fully'
            }
          ]
        },
        {
          name: 'Vertical Ease',
          duration: '15–18 min',
          description: 'Shoulder press, pec-deck squeeze, dip assist to finish clean.',
          battlePlan: 'Machine Shoulder Press\n• 3 × 8–10 (RPE 4), 60s rest\nPec Deck\n• 3 × 10–12 (RPE 4), 60s rest\nAssisted Dips\n• 3 × 8–10 (RPE 4), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/nj4fggwr_download%20%2830%29.png',
          intensityReason: 'Vertical press with fly and assisted dips keeps effort light.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Elbows under grips; no arch',
              description: 'Position your elbows directly under your hands and avoid arching your lower back during presses'
            },
            {
              icon: 'arrow-down',
              title: 'Control depth on dip assist',
              description: 'Lower yourself with control on assisted dips—don\'t drop into the bottom position'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Press Arc',
          duration: '20–25 min',
          description: 'Machine press, incline cable fly, cable Y-raise to polish.',
          battlePlan: 'Machine Chest Press\n• 4 × 8 (RPE 5), 60–75s rest\nIncline Cable Fly\n• 3 × 10 (RPE 5), 60s rest\nCable Y Raise\n• 3 × 12 (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/tp8hgvtb_download%20%2828%29.png',
          intensityReason: 'Strong press plus fly stretch and Y-raise for delt detail.',
          moodTips: [
            {
              icon: 'time',
              title: '2–1–3 tempo; soft lock',
              description: 'Use a controlled tempo of 2 seconds up, 1 second pause, 3 seconds down with soft lockouts'
            },
            {
              icon: 'pause',
              title: 'Pause mid-arc on fly',
              description: 'Hold briefly at the mid-point of the fly movement to maximize chest stretch and engagement'
            }
          ]
        },
        {
          name: 'Overhead Line',
          duration: '20–25 min',
          description: 'Press for delts, upright row adds caps, overhead tris finish.',
          battlePlan: 'Machine Shoulder Press\n• 4 × 8 (RPE 5–6), 60–75s rest\nCable Upright Row (wide)\n• 3 × 10 (RPE 5), 60s rest\nOverhead Rope Triceps\n• 3 × 10–12 (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/nj4fggwr_download%20%2830%29.png',
          intensityReason: 'Shoulder press, upright row, overhead tris build balance.',
          moodTips: [
            {
              icon: 'arrow-up',
              title: 'Upright row: lead elbows',
              description: 'Lead with your elbows during upright rows, pulling them high while keeping the bar close to your body'
            },
            {
              icon: 'contract',
              title: 'Narrow elbows on OH tris',
              description: 'Keep your elbows narrow and close to your head during overhead triceps extensions for proper isolation'
            }
          ]
        },
        {
          name: 'Lower Line',
          duration: '20–25 min',
          description: 'Decline press base, medial delts next, rope pressdowns close.',
          battlePlan: 'Machine Decline Chest Press\n• 3 × 8–10 (RPE 5), 60s rest\nMachine Lateral Raise\n• 3 × 12 (RPE 5), 60s rest\nRope Pressdown\n• 3 × 10–12 (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/n6oa31c5_download%20%2831%29.png',
          intensityReason: 'Decline chest plus laterals and pressdowns target pressers.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Elbows ~45° on decline',
              description: 'Keep your elbows at approximately 45 degrees from your torso during decline press for optimal chest engagement'
            },
            {
              icon: 'remove-circle',
              title: 'No shrugging on laterals',
              description: 'Avoid shrugging your shoulders during lateral raises—keep traps relaxed to target the medial deltoids'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Drive',
          duration: '25–30 min',
          description: 'Heavy press drops, incline fly control, rope finishers.',
          battlePlan: 'Machine Chest Press\n• 1 × 6 heavy (RPE 7) → drop 15% → 1 × 6 (RPE 6) → drop 15% → 1 × 6 (RPE 6)\n• Rest 90s; repeat for 3 total series\nIncline Cable Fly\n• 3 × 10 (RPE 6), 60s rest\nRope Pressdown\n• 3 × 10–12 (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/tp8hgvtb_download%20%2828%29.png',
          intensityReason: 'Drop-set press boosts volume; fly and pushdown refine.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop ~15% quickly',
              description: 'Reduce the weight by approximately 15% quickly between drops to maintain intensity and muscle fatigue'
            },
            {
              icon: 'time',
              title: 'Control 3s lowers on fly',
              description: 'Lower the cables over 3 seconds during flys to maximize chest stretch and time under tension'
            }
          ]
        },
        {
          name: 'Cluster Overhead',
          duration: '25–30 min',
          description: 'Shoulder press clusters; rear delts next; overhead tris close.',
          battlePlan: 'Machine Shoulder Press\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nReverse Pec Deck\n• 3 × 12 (RPE 6), 60–75s rest\nOverhead Rope Triceps\n• 3 × 10–12 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/nj4fggwr_download%20%2830%29.png',
          intensityReason: 'Cluster presses maintain power while technique stays tidy.',
          moodTips: [
            {
              icon: 'leaf',
              title: '15s breaths in clusters',
              description: 'Use the 15-second mini-rests to take 2-3 deep breaths and reset your focus before the next mini-set'
            },
            {
              icon: 'barbell',
              title: 'Same load within cluster',
              description: 'Keep the weight constant throughout all mini-sets within each cluster for consistent training stimulus'
            }
          ]
        },
        {
          name: 'Midrange Squeeze',
          duration: '25–30 min',
          description: 'Cable fly one-and-a-halfs; laterals and rope pressdowns.',
          battlePlan: 'Cable Fly (1.5 reps)\n• 3 × 8–10 (RPE 6), 60–75s rest\nMachine Lateral Raise\n• 3 × 12 (RPE 6), 60s rest\nRope Pressdown\n• 3 × 10–12 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/bbb40x4e_download%20%2832%29.png',
          intensityReason: '1.5 fly increases tension; delts and tris support work.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep chest lifted',
              description: 'Maintain a proud, lifted chest position throughout cable flys to maximize pectoral engagement'
            },
            {
              icon: 'time',
              title: '1s squeeze; 3s return',
              description: 'Hold a 1-second squeeze at peak contraction, then take 3 seconds to return for maximum tension'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Pull',
    icon: 'arrow-down',
    workouts: {
      beginner: [
        {
          name: 'Pull Primer',
          duration: '15–18 min',
          description: 'Lats first, mid-back next, rear delts and posture finish.',
          battlePlan: 'Lat Pulldown (wide or neutral)\n• 3 × 8–10 (RPE 4), 45–60s rest\nSeated Row (neutral)\n• 3 × 8–10 (RPE 4), 45–60s rest\nCable Face Pull\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/224yyt9s_download%20%2834%29.png',
          intensityReason: 'Pulldown, row, face pull cover back and biceps simply.',
          moodTips: [
            {
              icon: 'arrow-down',
              title: 'Elbows drive down/back',
              description: 'Think about driving your elbows down and back during pulldowns and rows for optimal lat engagement'
            },
            {
              icon: 'body',
              title: 'Chin tucked on face pulls',
              description: 'Keep your chin slightly tucked during face pulls to maintain proper neck position and target rear delts'
            }
          ]
        },
        {
          name: 'Chest-Supported',
          duration: '15–18 min',
          description: 'Row machine, straight-arm pulldown, cable curls finish.',
          battlePlan: 'Chest-Supported Row Machine\n• 3 × 8–10 (RPE 4), 60s rest\nCable Straight-Arm Pulldown\n• 3 × 12 (RPE 4), 45–60s rest\nCable Curl (EZ or rope)\n• 3 × 10–12 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/8wag7xpf_Screenshot%202025-12-04%20at%2012.00.14%E2%80%AFAM.png',
          intensityReason: 'Supported rows reduce bracing and simplify posture.',
          moodTips: [
            {
              icon: 'body',
              title: 'Chest to pad; no heave',
              description: 'Keep your chest pressed against the pad throughout—avoid rocking or using momentum to cheat reps'
            },
            {
              icon: 'hand-right',
              title: 'Long arms on straight-arm',
              description: 'Maintain nearly straight arms during the pulldown, focusing on the lat stretch and contraction'
            }
          ]
        },
        {
          name: 'High Line',
          duration: '15–18 min',
          description: 'High cable row, reverse pec deck, cable curls sequence.',
          battlePlan: 'High Cable Row\n• 3 × 8–10 (RPE 4), 60s rest\nReverse Pec Deck\n• 3 × 12 (RPE 4), 45–60s rest\nCable Curl\n• 3 × 10–12 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/4gyd3y66_download%20%2835%29.png',
          intensityReason: 'Upper-back bias plus curls for balanced pulling day.',
          moodTips: [
            {
              icon: 'arrow-up',
              title: 'Row to collarbone line',
              description: 'Pull the cable toward your collarbone level to target the upper back and rear deltoids effectively'
            },
            {
              icon: 'hand-right',
              title: 'Wrists quiet on curls',
              description: 'Keep your wrists in a neutral position during curls—avoid flexing or extending them during the movement'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Lat Ladder',
          duration: '20–25 min',
          description: 'Pulldown work, straight-arm sweeps, incline cable curls.',
          battlePlan: 'Lat Pulldown\n• 4 × 8 (RPE 5), 60–75s rest\nCable Straight-Arm Pulldown\n• 3 × 10–12 (RPE 5), 60s rest\nIncline Cable Curl (low to high)\n• 3 × 10–12 (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/224yyt9s_download%20%2834%29.png',
          intensityReason: 'Vertical pull pairs with length-tension lat training.',
          moodTips: [
            {
              icon: 'body',
              title: 'Tall chest on pulldowns',
              description: 'Maintain a proud, upright chest position during pulldowns to maximize lat engagement and minimize shoulder strain'
            },
            {
              icon: 'fitness',
              title: 'Hinge slight on straight-arm',
              description: 'Allow a slight hip hinge during straight-arm pulldowns to fully stretch the lats at the top'
            }
          ]
        },
        {
          name: 'Midback Focus',
          duration: '20–25 min',
          description: 'Neutral rows, reverse fly sets, rope hammer curls finish.',
          battlePlan: 'Seated Row (neutral)\n• 4 × 8 (RPE 5), 60–75s rest\nReverse Pec Deck\n• 3 × 12 (RPE 5), 60s rest\nRope Hammer Curl\n• 3 × 10–12 (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/51z4cigt_download%20%2833%29.png',
          intensityReason: 'Rows, rear delts, and hammers build the mid-back chain.',
          moodTips: [
            {
              icon: 'contract',
              title: 'Squeeze 1–2s on row',
              description: 'Hold a 1-2 second squeeze at the peak contraction of each row to maximize mid-back engagement'
            },
            {
              icon: 'hand-right',
              title: 'Elbows soft on rear delts',
              description: 'Maintain a slight bend in your elbows during reverse flys—don\'t lock them straight'
            }
          ]
        },
        {
          name: 'High Row Line',
          duration: '20–25 min',
          description: 'High cable rows, reverse pec deck, preacher curl machine.',
          battlePlan: 'High Cable Row\n• 4 × 8 (RPE 5–6), 60–75s rest\nReverse Pec Deck\n• 3 × 12 (RPE 5), 60s rest\nPreacher Curl Machine\n• 3 × 10–12 (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/5z9stzyy_Screenshot%202025-12-04%20at%2012.01.30%E2%80%AFAM.png',
          intensityReason: 'High rows, rear delts, preacher curls cover pull angles.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Elbows 45–60° path',
              description: 'Pull your elbows in a 45-60 degree path during high rows to target the upper back and rear deltoids'
            },
            {
              icon: 'expand',
              title: 'Full stretch on preacher',
              description: 'Allow a full stretch at the bottom of preacher curls before curling up for complete bicep engagement'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Pull',
          duration: '25–30 min',
          description: 'Heavy pulldown drops, rows next, cable curls to close.',
          battlePlan: 'Lat Pulldown\n• 1 × 6 heavy (RPE 7) → drop 15% → 1 × 6 (RPE 6) → drop 15% → 1 × 6 (RPE 6)\n• Rest 90s; repeat for 3 total series\nSeated Row\n• 3 × 8–10 (RPE 6), 60–75s rest\nCable Curl\n• 3 × 10–12 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/224yyt9s_download%20%2834%29.png',
          intensityReason: 'Pulldown drops extend time under tension efficiently.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Quick pin changes',
              description: 'Change the weight pin quickly between drops to minimize rest and maintain the intensity of the drop set'
            },
            {
              icon: 'remove-circle',
              title: 'Avoid torso heave',
              description: 'Keep your torso stable throughout—don\'t use momentum or body English to pull the weight down'
            }
          ]
        },
        {
          name: 'Cluster Row',
          duration: '25–30 min',
          description: 'Cluster rows, rear delts after, incline cable curls finish.',
          battlePlan: 'Chest-Supported Row Machine\n• 3 clusters: 4 + 4 + 4 (15s between), 90s between clusters\nReverse Pec Deck\n• 3 × 12 (RPE 6), 60–75s rest\nIncline Cable Curl\n• 3 × 10–12 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/4gyd3y66_download%20%2835%29.png',
          intensityReason: 'Row clusters sustain output with crisp scap control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Chest glued to pad',
              description: 'Keep your chest firmly pressed against the pad throughout cluster rows to maintain proper form'
            },
            {
              icon: 'leaf',
              title: '15s breaths in clusters',
              description: 'Use the 15-second mini-rests to take deep breaths and reset your focus before the next mini-set'
            }
          ]
        },
        {
          name: 'Midrange Pull',
          duration: '25–30 min',
          description: 'Face pull 1.5 reps, high rows next, rope hammer curls.',
          battlePlan: 'Cable Face Pull (1.5 reps)\n• 3 × 10–12 (RPE 6), 60–75s rest\nHigh Cable Row\n• 3 × 8–10 (RPE 6), 60–75s rest\nRope Hammer Curl\n• 3 × 10–12 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/3mysq3rj_Screenshot%202025-12-04%20at%2012.02.09%E2%80%AFAM.png',
          intensityReason: '1.5 face pulls intensify rear delts with safe load.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Thumbs back; 1s hold',
              description: 'Rotate your thumbs back at peak contraction of face pulls and hold for 1 second to maximize rear delt engagement'
            },
            {
              icon: 'time',
              title: 'Smooth 3s returns',
              description: 'Control the return phase over 3 seconds to increase time under tension and muscle development'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Full Upper Body',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Simple Push–Pull',
          duration: '15–18 min',
          description: 'Chest press, row, laterals, pressdowns for simple flow.',
          battlePlan: 'Machine Chest Press\n• 3 × 8–10 (RPE 4), 60s rest\nSeated Row\n• 3 × 8–10 (RPE 4), 60s rest\nMachine Lateral Raise\n• 3 × 12 (RPE 4), 45–60s rest\nRope Pressdown\n• 3 × 10–12 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/2idat5d8_download%20%2829%29.png',
          intensityReason: 'Balanced machines load push and pull with few cues.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Press/row: soft lock',
              description: 'Use soft lockouts on both presses and rows—avoid fully extending your elbows at end ranges'
            },
            {
              icon: 'body',
              title: 'Keep neck long, shoulders down',
              description: 'Maintain a long neck position and keep your shoulders depressed throughout all exercises'
            }
          ]
        },
        {
          name: 'Vertical Pair',
          duration: '15–18 min',
          description: 'Shoulder press, pulldown, pec deck, cable curls lineup.',
          battlePlan: 'Machine Shoulder Press\n• 3 × 8–10 (RPE 4), 60s rest\nLat Pulldown\n• 3 × 8–10 (RPE 4), 60s rest\nPec Deck\n• 3 × 10–12 (RPE 4), 60s rest\nCable Curl\n• 3 × 10–12 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/kwgc495p_download%20%2830%29.png',
          intensityReason: 'Vertical press and pull with easy isolation finishers.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Elbows under on press',
              description: 'Position your elbows directly under your hands during shoulder press for optimal mechanics'
            },
            {
              icon: 'arrow-down',
              title: 'Elbows down on pulldown',
              description: 'Drive your elbows down toward your hips during pulldowns to maximize lat engagement'
            }
          ]
        },
        {
          name: 'Cable Flow',
          duration: '15–18 min',
          description: 'Cable press, high row, Y-raises, rope triceps to finish.',
          battlePlan: 'Cable Chest Press\n• 3 × 10 (RPE 4), 60s rest\nHigh Cable Row\n• 3 × 10 (RPE 4), 60s rest\nCable Y Raise\n• 3 × 12 (RPE 4), 45–60s rest\nRope Pressdown\n• 3 × 10–12 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/4vnqx30z_download%20%2832%29.png',
          intensityReason: 'Cables guide paths and reduce setup, keeping it easy.',
          moodTips: [
            {
              icon: 'arrow-down',
              title: 'Ribs down on presses',
              description: 'Draw your ribcage down during cable presses to prevent lower back arching and engage your core'
            },
            {
              icon: 'contract',
              title: 'Squeeze 1s on rows',
              description: 'Hold a 1-second squeeze at peak contraction during rows to maximize mid-back engagement'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Balanced Lines',
          duration: '20–25 min',
          description: 'Chest press, row, lateral raise, curls; clean sequence.',
          battlePlan: 'Machine Chest Press\n• 4 × 8 (RPE 5), 60–75s rest\nSeated Row\n• 4 × 8 (RPE 5), 60–75s rest\nMachine Lateral Raise\n• 3 × 12 (RPE 5), 60s rest\nCable Curl\n• 3 × 10–12 (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/2idat5d8_download%20%2829%29.png',
          intensityReason: 'Machines train push, pull, and delts with control.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Note seat settings',
              description: 'Record your machine seat positions to ensure consistent setup and save time in future sessions'
            },
            {
              icon: 'time',
              title: 'Keep tempos controlled',
              description: 'Maintain controlled tempos on all exercises—avoid rushing or using momentum to complete reps'
            }
          ]
        },
        {
          name: 'Vertical Stack',
          duration: '20–25 min',
          description: 'Shoulder press, pulldown, pec deck, rope tris; tidy flow.',
          battlePlan: 'Machine Shoulder Press\n• 4 × 8 (RPE 5–6), 60–75s rest\nLat Pulldown\n• 4 × 8 (RPE 5), 60–75s rest\nPec Deck\n• 3 × 10–12 (RPE 5), 60s rest\nRope Pressdown\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/kwgc495p_download%20%2830%29.png',
          intensityReason: 'Overhead press and pulldown anchor simple accessory.',
          moodTips: [
            {
              icon: 'remove-circle',
              title: 'Don\'t arch on press',
              description: 'Avoid excessive lower back arching during shoulder press by bracing your core and keeping ribs down'
            },
            {
              icon: 'body',
              title: 'Tall chest on pulldown',
              description: 'Maintain a proud, upright chest during pulldowns to maximize lat engagement and minimize shoulder strain'
            }
          ]
        },
        {
          name: 'Cable Circuitry',
          duration: '20–25 min',
          description: 'Cable press, high row, rear delts, overhead tris polish.',
          battlePlan: 'Cable Chest Press\n• 4 × 8 (RPE 5), 60–75s rest\nHigh Cable Row\n• 4 × 8 (RPE 5), 60–75s rest\nReverse Pec Deck\n• 3 × 12 (RPE 5), 60s rest\nOverhead Rope Triceps\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/2skt7b9o_Screenshot%202025-12-04%20at%2012.01.30%E2%80%AFAM.png',
          intensityReason: 'Cable paths allow smooth arcs and moderate control.',
          moodTips: [
            {
              icon: 'arrow-down',
              title: 'Press: ribs down',
              description: 'Draw your ribcage down during cable presses to maintain core engagement and prevent lower back arching'
            },
            {
              icon: 'hand-right',
              title: 'Rear delts: soft elbows',
              description: 'Maintain a slight bend in your elbows during reverse pec deck—don\'t lock them straight'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Push–Pull Drops',
          duration: '25–30 min',
          description: 'Chest and row drops, then laterals and cable curls.',
          battlePlan: 'Machine Chest Press\n• 1 × 6 heavy (RPE 7) → drop 15% → 1 × 6 (RPE 6) → drop 15% → 1 × 6 (RPE 6)\n• Rest 90s; repeat for 3 total series\nSeated Row\n• 1 × 6 heavy (RPE 7) → drop 15% → 1 × 6 (RPE 6) → drop 15% → 1 × 6 (RPE 6)\n• Rest 90s; repeat for 3 total series\nMachine Lateral Raise\n• 3 × 12 (RPE 6), 60–75s rest\nCable Curl\n• 3 × 10–12 (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/tbt1jia8_download%20%2835%29.png',
          intensityReason: 'Drop sets increase volume without extra complexity.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Swift pin changes',
              description: 'Change the weight pin quickly between drops to minimize rest and maintain the intensity throughout'
            },
            {
              icon: 'checkmark-circle',
              title: 'Keep reps smooth',
              description: 'Maintain smooth, controlled rep quality throughout all drop set portions—avoid getting sloppy as you fatigue'
            }
          ]
        },
        {
          name: 'Cluster Stack',
          duration: '25–30 min',
          description: 'Press and row clusters, then rear delts and rope tris.',
          battlePlan: 'Machine Chest Press\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nSeated Row\n• 3 clusters: 4 + 4 + 4 (15s between), 90s between clusters\nReverse Pec Deck\n• 3 × 12 (RPE 6), 60–75s rest\nRope Pressdown\n• 3 × 10–12 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/12gt6fvb_download%20%282%29.png',
          intensityReason: 'Cluster sets keep output high with preserved form.',
          moodTips: [
            {
              icon: 'time',
              title: '15s mini-rests',
              description: 'Use the 15-second mini-rests to take 2-3 deep breaths and reset your focus before continuing'
            },
            {
              icon: 'barbell',
              title: 'Same load in clusters',
              description: 'Keep the weight constant throughout all mini-sets within each cluster for consistent training stimulus'
            }
          ]
        },
        {
          name: 'Cable Finish',
          duration: '25–30 min',
          description: 'Fly 1.5s, high rows, Y raises, overhead triceps finisher.',
          battlePlan: 'Cable Fly (1.5 reps)\n• 3 × 8–10 (RPE 6), 60–75s rest\nHigh Cable Row\n• 3 × 8–10 (RPE 6), 60–75s rest\nCable Y Raise\n• 3 × 12 (RPE 6), 60s rest\nOverhead Rope Triceps\n• 3 × 10–12 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_lazy-workout-images/artifacts/jjomvfxr_download%20%281%29.png',
          intensityReason: 'Midrange focus with cables adds tension at modest load.',
          moodTips: [
            {
              icon: 'contract',
              title: '1s squeeze on peak',
              description: 'Hold a 1-second squeeze at peak contraction on all exercises to maximize muscle engagement'
            },
            {
              icon: 'time',
              title: 'Control 3s returns',
              description: 'Lower the weight slowly over 3 seconds on all movements to increase time under tension and build strength'
            }
          ]
        }
      ]
    }
  }
];

// Workout Card Component outside the main component for proper memoization
const WorkoutCard = React.memo(({ 
  equipment, 
  icon, 
  workouts, 
  difficulty,
  isInCart,
  createWorkoutId,
  handleAddToCart,
  handleStartWorkout,
}: { 
  equipment: string; 
  icon: keyof typeof Ionicons.glyphMap; 
  workouts: Workout[]; 
  difficulty: string;
  isInCart: (workoutId: string) => boolean;
  createWorkoutId: (workout: Workout, equipment: string, difficulty: string) => string;
  handleAddToCart: (workout: Workout, equipment: string) => void;
  handleStartWorkout: (workout: Workout, equipment: string) => void;
}) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [localScaleAnim] = useState(new Animated.Value(1));
  const flatListRef = useRef<FlatList>(null);

  const handleAddToCartWithAnimation = (workout: Workout) => {
    // Animate locally without affecting parent
    Animated.sequence([
      Animated.timing(localScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(localScaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(localScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Call parent handler
    handleAddToCart(workout, equipment);
  };

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
        {/* Workout Name */}
        <Text style={styles.workoutName}>{item.name}</Text>
        
        {/* Duration and Intensity on same line */}
        <View style={styles.durationIntensityRow}>
          <Text style={styles.workoutDuration}>{item.duration}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: '#FFD700' }]}>
            <Text style={styles.difficultyBadgeText}>{(difficulty === 'intermediate' ? 'INTERMED.' : difficulty).toUpperCase()}</Text>
          </View>
        </View>

        {/* Intensity Reason */}
        <View style={styles.intensityContainer}>
          <Ionicons name="information-circle" size={16} color="#FFD700" />
          <Text style={styles.intensityReason}>{item.intensityReason}</Text>
        </View>

        {/* Workout Description */}
        <Text style={styles.workoutDescription}>{item.description}</Text>

        {/* Start Workout Button */}
        <TouchableOpacity 
          style={styles.startWorkoutButton}
          onPress={() => handleStartWorkout(item, equipment)}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={20} color="#000000" style={{ marginRight: 8 }} />
          <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.workoutCard}>
      {/* Equipment Header */}
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentIconContainer}>
          <Ionicons name={icon} size={24} color="#FFD700" />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <WigglingAddButton
          isInCart={isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty))}
          onPress={() => handleAddToCartWithAnimation(workouts[currentWorkoutIndex])}
          scaleAnim={localScaleAnim}
        />
      </View>

      {/* Workout List - Native Swipe Enabled */}
      <View style={[styles.workoutList, { height: 355 }]}>
        <FlatList
          ref={flatListRef}
          data={workouts}
          renderItem={renderWorkout}
          horizontal
          pagingEnabled
          snapToInterval={width - 48}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            if (boundedIndex !== currentWorkoutIndex) {
              setCurrentWorkoutIndex(boundedIndex);
            }
          }}
          onMomentumScrollEnd={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            setCurrentWorkoutIndex(boundedIndex);
          }}
          onScrollEndDrag={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            setCurrentWorkoutIndex(boundedIndex);
          }}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: width - 48,
            offset: (width - 48) * index,
            index,
          })}
          keyExtractor={(item, index) => `${equipment}-${difficulty}-${index}`}
        />
      </View>

      {/* Workout Indicator Dots */}
      <View style={styles.dotsContainer}>
        <Text style={styles.dotsLabel}>Swipe to explore</Text>
        <View style={styles.dotsRow}>
          {workouts.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dotTouchArea,
                index === currentWorkoutIndex && styles.activeDotTouchArea
              ]}
              onPress={() => {
                console.log(`Dot clicked: ${index}, Current: ${currentWorkoutIndex}`);
                setCurrentWorkoutIndex(index);
                // Use scrollToOffset for more reliable behavior
                const slideSize = width - 48;
                flatListRef.current?.scrollToOffset({
                  offset: index * slideSize,
                  animated: true
                });
              }}
              activeOpacity={0.7}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <View style={[
                styles.dot,
                index === currentWorkoutIndex && styles.activeDot,
              ]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
});

export default function LazyUpperBodyWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Parse URL parameters
  const rawMoodTitle = params.mood as string || "I'm feeling lazy";
  const moodTitle = rawMoodTitle;
  const workoutType = params.workoutType as string || 'Lift weights';
  const bodyPart = params.bodyPart as string || 'Upper body';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Get workout data
  const selectedEquipmentNames = ['Push', 'Pull', 'Full Upper Body'];
  const workoutDatabase = upperBodyWorkoutDatabase;

  // Cart hooks
  const { addToCart, isInCart } = useCart();
  const { token } = useAuth();

  // Cart helper functions
  const createWorkoutId = useCallback((workout: Workout, equipment: string, difficulty: string) => {
    return `${workout.name}-${equipment}-${difficulty}`;
  }, []);

  const handleAddToCart = useCallback((workout: Workout, equipment: string) => {
    const workoutId = createWorkoutId(workout, equipment, difficulty);
    
    if (isInCart(workoutId)) {
      return; // Already in cart
    }

    // Create WorkoutItem from current workout
    const workoutItem: WorkoutItem = {
      id: workoutId,
      name: workout.name,
      duration: workout.duration,
      description: workout.description,
      battlePlan: workout.battlePlan,
      imageUrl: workout.imageUrl,
      intensityReason: workout.intensityReason,
      equipment: equipment,
      difficulty: difficulty,
      workoutType: `I'm feeling lazy - ${workoutType} - ${bodyPart}`,
      moodCard: moodTitle,
      moodTips: workout.moodTips || [],
    };

    // Add to cart
    if (token) {
      Analytics.workoutAddedToCart(token, {
        workout_name: workout.name,
        mood_category: moodTitle,
        equipment: equipment,
      });
    }
    addToCart(workoutItem);
  }, [addToCart, isInCart, createWorkoutId, difficulty, workoutType, bodyPart, moodTitle]);

  const handleStartWorkout = (workout: Workout, equipment: string) => {
    try {
      console.log('✅ Starting workout navigation with params:', {
        workoutName: workout.name,
        equipment: equipment,
        description: workout.description,
        battlePlan: workout.battlePlan,
        duration: workout.duration,
        difficulty: difficulty,
        workoutType: workoutType,
      });
      
      router.push({
        pathname: '/workout-guidance',
        params: {
          workoutName: workout.name,
          equipment: equipment,
          description: workout.description || '',
          battlePlan: workout.battlePlan || '',
          duration: workout.duration || '20 min',
          difficulty: difficulty,
          workoutType: workoutType,
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
      { key: 'mood', icon: 'bed', text: moodTitle },
      { key: 'bodyPart', icon: 'barbell', text: workoutType },
      { key: 'difficulty', icon: 'body', text: bodyPart },
      { key: 'equipment', icon: 'construct', text: difficulty === 'intermediate' ? 'Intermed.' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
    ];

    // Return single row
    return [steps];
  };

  const handleGoBack = () => {
    router.back();
  };

  const progressRows = createProgressRows();

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
        <HomeButton />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {progressRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.progressRow}>
            {row.map((step, stepIndex) => (
              <React.Fragment key={step.key}>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <Ionicons name={step.icon} size={12} color="#000000" />
                  </View>
                  <Text style={styles.progressStepText}>{step.text}</Text>
                </View>
                {stepIndex < row.length - 1 && <View style={styles.progressConnector} />}
              </React.Fragment>
            ))}
          </View>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Generate workout cards for selected equipment */}
        {workoutDatabase.map((equipmentData) => {
          const workoutsForDifficulty = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
          
          if (workoutsForDifficulty.length === 0) {
            return null;
          }

          return (
            <WorkoutCard
              key={equipmentData.equipment}
              equipment={equipmentData.equipment}
              icon={equipmentData.icon}
              workouts={workoutsForDifficulty}
              difficulty={difficulty}
              isInCart={isInCart}
              createWorkoutId={createWorkoutId}
              handleAddToCart={handleAddToCart}
              handleStartWorkout={handleStartWorkout}
            />
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
    paddingVertical: 8,
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
    color: '#ffffff',
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
    paddingHorizontal: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 60,
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
  },
  progressStepText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 60,
    lineHeight: 11,
  },
  progressConnector: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  workoutCard: {
    backgroundColor: '#111111',
    overflow: 'hidden',
    borderRadius: 20,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    overflow: 'visible',
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
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  workoutList: {
    height: 380,
    marginBottom: 16,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  workoutImageContainer: {
    marginTop: 1,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#222222',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  swipeText: {
    fontSize: 11,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '500',
  },
  workoutContent: {
    flex: 1,
    paddingHorizontal: 0,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    paddingHorizontal: 6,
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  workoutDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  difficultyBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
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
  },
  workoutDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: 10,
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
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: -6,
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
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
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
  addButtonWrapper: {
    position: 'relative',
  },
  addToCartButton: {
    backgroundColor: 'rgba(70, 70, 70, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  addToCartButtonAdded: {
    backgroundColor: 'rgba(70, 70, 70, 0.9)',
    borderColor: '#FFD700',
  },
  addToCartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addToCartButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFD700',
  },
});
