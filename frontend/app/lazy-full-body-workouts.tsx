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
import AddWorkoutIndicator from '../components/AddWorkoutIndicator';

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

// Full body workout database with all push, pull, and full body workouts
const fullBodyWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Push',
    icon: 'arrow-up',
    workouts: {
      beginner: [
        {
          name: 'Push Start',
          duration: '22–28 min',
          description: 'Leg press foundation, chest press next, core crunch close.',
          battlePlan: 'Leg Press (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nMachine Chest Press\n• 3 × 8–10 (RPE 4), 60s rest\nCable Crunch (kneeling)\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/f8k0kcti_download.png',
          intensityReason: 'Simple machines pair leg and press lines with minimal setup.',
          moodTips: [
            {
              icon: 'body',
              title: 'Soft lockouts; heels planted',
              description: 'Soft lockouts; heels planted'
            },
            {
              icon: 'leaf',
              title: 'Exhale on press and crunch',
              description: 'Exhale on press and crunch'
            }
          ]
        },
        {
          name: 'Vertical Push',
          duration: '22–28 min',
          description: 'Hack squats first, shoulder press next, anti-rotation core.',
          battlePlan: 'Hack Squat (machine)\n• 3 × 8–10 (RPE 4), 60s rest\nMachine Shoulder Press\n• 3 × 8–10 (RPE 4), 60s rest\nCable Anti-Rotation Hold or Dead Bug\n• 3 × 20–30s/side (RPE 4), 45s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/uwuwsltl_download%20%2830%29.png',
          intensityReason: 'Guided squats and overhead press reduce bracing demand.',
          moodTips: [
            {
              icon: 'body',
              title: 'Heels down on hack squat',
              description: 'Heels down on hack squat'
            },
            {
              icon: 'arrow-down',
              title: 'Ribs down on overhead press',
              description: 'Ribs down on overhead press'
            }
          ]
        },
        {
          name: 'Smith Push',
          duration: '22–28 min',
          description: 'Smith back squat, Smith bench press, plank for bracing.',
          battlePlan: 'Smith Back Squat\n• 3 × 8–10 (RPE 4), 60–75s rest\nSmith Machine Bench Press\n• 3 × 8–10 (RPE 4), 60s rest\nFront Plank\n• 3 × 20–40s (RPE 4), 45s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/5a61mmh2_sms.jpg',
          intensityReason: 'Smith paths stabilize compound lines for safer control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Brace light; tall torso',
              description: 'Brace light; tall torso'
            },
            {
              icon: 'hand-right',
              title: 'Press: bar over mid-chest',
              description: 'Press: bar over mid-chest'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Press Lines',
          duration: '28–35 min',
          description: 'Leg press volume, chest press sets, cable crunch closer.',
          battlePlan: 'Leg Press (machine)\n• 4 × 10 (RPE 5), 60–75s rest\nMachine Chest Press\n• 4 × 8 (RPE 5), 60–75s rest\nCable Crunch (kneeling)\n• 3 × 12–15 (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/85rxong7_download%20%2829%29.png',
          intensityReason: 'Moderate compounds pair quads, chest, and stable core.',
          moodTips: [
            {
              icon: 'body',
              title: 'Track knee and elbow lines',
              description: 'Track knee and elbow lines'
            },
            {
              icon: 'time',
              title: 'Control 3s lowers each set',
              description: 'Control 3s lowers each set'
            }
          ]
        },
        {
          name: 'Vertical Stack',
          duration: '28–35 min',
          description: 'Hack squats, shoulder press sequence, Pallof press core.',
          battlePlan: 'Hack Squat (machine)\n• 4 × 8 (RPE 5–6), 75s rest\nMachine Shoulder Press\n• 4 × 8 (RPE 5), 60–75s rest\nCable Pallof Press\n• 3 × 10–12/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/e0ct7tlh_hs.avif',
          intensityReason: 'Overhead work with hack squats balances systemic load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Quiet knees; heels planted',
              description: 'Quiet knees; heels planted'
            },
            {
              icon: 'remove-circle',
              title: 'Don\'t arch on overhead work',
              description: 'Don\'t arch on overhead work'
            }
          ]
        },
        {
          name: 'Smith Lines',
          duration: '28–35 min',
          description: 'Smith squat series, Smith bench sets, hanging knees finish.',
          battlePlan: 'Smith Back Squat\n• 4 × 8 (RPE 5–6), 75s rest\nSmith Machine Bench Press\n• 4 × 8 (RPE 5), 60–75s rest\nHanging Knee Raise\n• 3 × 10–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/3wkbxmxc_download.png',
          intensityReason: 'Smith guidance reduces balance while loading safely heavy.',
          moodTips: [
            {
              icon: 'body',
              title: 'Brace; ribs stacked neutral',
              description: 'Brace; ribs stacked neutral'
            },
            {
              icon: 'time',
              title: 'Smooth 2–1–3 cadence',
              description: 'Smooth 2–1–3 cadence'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Push Drop',
          duration: '35–42 min',
          description: 'Leg press plus chest press drops, then controlled abs.',
          battlePlan: 'Leg Press (machine)\n• 1 × 8 heavy (RPE 7) → drop 15% → 1 × 8 (RPE 6) → drop 15% → 1 × 8 (RPE 6)\n• Rest 90s; repeat for 2–3 total series\nMachine Chest Press\n• 1 × 6–8 heavy (RPE 7) → drop 15% → 1 × 6–8 (RPE 6)\nCable Crunch (kneeling)\n• 3 × 12–15 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/f8k0kcti_download.png',
          intensityReason: 'Drop-set presses expand work capacity without complexity.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop ~15% swiftly',
              description: 'Drop ~15% swiftly'
            },
            {
              icon: 'remove-circle',
              title: 'Brace hard; don\'t bounce',
              description: 'Brace hard; don\'t bounce'
            }
          ]
        },
        {
          name: 'Cluster Push',
          duration: '35–42 min',
          description: 'Hack clusters, Smith bench clusters, chops for core.',
          battlePlan: 'Hack Squat (machine)\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nSmith Machine Bench Press\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nHigh-to-Low Cable Chop\n• 3 × 8–10/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/clw7t7y4_smbp.jpg',
          intensityReason: 'Cluster sets keep power high while posture stays crisp.',
          moodTips: [
            {
              icon: 'leaf',
              title: '15s breaths inside sets',
              description: '15s breaths inside sets'
            },
            {
              icon: 'barbell',
              title: 'Same load within cluster',
              description: 'Same load within cluster'
            }
          ]
        },
        {
          name: 'Midrange Push',
          duration: '35–42 min',
          description: 'Cable goblet 1.5s, incline fly 1.5s, anti-rotation hold.',
          battlePlan: 'Cable Goblet Squat (1.5 reps)\n• 3 × 8–10 (RPE 6), 60–75s rest\nIncline Cable Fly (1.5 reps)\n• 3 × 8–10 (RPE 6), 60–75s rest\nCable Anti-Rotation Hold\n• 3 × 25–35s/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/rvk5my8t_cgs.jpg',
          intensityReason: '1.5 reps add time under tension at manageable loads.',
          moodTips: [
            {
              icon: 'time',
              title: '1s squeeze at peak',
              description: '1s squeeze at peak'
            },
            {
              icon: 'time',
              title: 'Control 3s returns',
              description: 'Control 3s returns'
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
          name: 'Pull Start',
          duration: '22–28 min',
          description: 'Seated curls or RDL, row machine, core with Pallof.',
          battlePlan: 'Smith RDL or Seated Leg Curl (machine)\n• 3 × 10 (RPE 4), 60s rest\nSeated Row (neutral)\n• 3 × 8–10 (RPE 4), 60s rest\nCable Pallof Press\n• 3 × 10–12/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/gs71guo5_download%20%285%29.png',
          intensityReason: 'Machines pair hinge and pull lines with minimal setup.',
          moodTips: [
            {
              icon: 'body',
              title: 'Push hips back on hinge',
              description: 'Push hips back on hinge'
            },
            {
              icon: 'arrow-down',
              title: 'Elbows drive back on row',
              description: 'Elbows drive back on row'
            }
          ]
        },
        {
          name: 'Vertical Pull',
          duration: '22–28 min',
          description: '45° back extension, pulldown, dead bug or cable core.',
          battlePlan: '45° Back Extension (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nLat Pulldown\n• 3 × 8–10 (RPE 4), 60s rest\nDead Bug or Cable Anti-Rotation Hold\n• 3 × 20–30s/side (RPE 4), 45s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/gwy2em83_download%20%2834%29.png',
          intensityReason: 'Supported hinge plus vertical pull reduce bracing.',
          moodTips: [
            {
              icon: 'body',
              title: 'Neutral neck on hinges',
              description: 'Neutral neck on hinges'
            },
            {
              icon: 'body',
              title: 'Tall chest on pulldown',
              description: 'Tall chest on pulldown'
            }
          ]
        },
        {
          name: 'Cable Pull',
          duration: '22–28 min',
          description: 'Pull-throughs, high cable row, crunches to complete.',
          battlePlan: 'Cable Pull-Through\n• 3 × 10–12 (RPE 4), 60s rest\nHigh Cable Row\n• 3 × 10 (RPE 4), 60s rest\nCable Crunch (kneeling)\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/1tdr3nmt_download%20%284%29.png',
          intensityReason: 'Cable pull-through and rows guide motion with ease.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hips back; shins quiet',
              description: 'Hips back; shins quiet'
            },
            {
              icon: 'arrow-down',
              title: 'Ribs down on crunch sets',
              description: 'Ribs down on crunch sets'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Hinge Lines',
          duration: '28–35 min',
          description: 'Smith RDLs, seated rows, anti-rotation core to finish.',
          battlePlan: 'Smith RDL\n• 4 × 8 (RPE 5–6), 75s rest\nSeated Row (neutral)\n• 4 × 8 (RPE 5), 60–75s rest\nCable Anti-Rotation Hold\n• 3 × 25–35s/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/wayclwit_download%20%2833%29.png',
          intensityReason: 'Moderate hinge with rows builds pull chain efficiently.',
          moodTips: [
            {
              icon: 'body',
              title: 'Bar tracks thighs; brace',
              description: 'Bar tracks thighs; brace'
            },
            {
              icon: 'time',
              title: 'Smooth 3s eccentrics',
              description: 'Smooth 3s eccentrics'
            }
          ]
        },
        {
          name: 'Vertical Lines',
          duration: '28–35 min',
          description: 'Machine back extensions, pulldowns, cable crunch sets.',
          battlePlan: 'Back Extension (machine)\n• 4 × 10 (RPE 5), 60–75s rest\nLat Pulldown\n• 4 × 8 (RPE 5), 60–75s rest\nCable Crunch (kneeling)\n• 3 × 12–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/gwy2em83_download%20%2834%29.png',
          intensityReason: 'Back extension pairs with pulldown for balanced pull.',
          moodTips: [
            {
              icon: 'body',
              title: 'Extend to neutral only',
              description: 'Extend to neutral only'
            },
            {
              icon: 'arrow-down',
              title: 'Drive elbows down on pulls',
              description: 'Drive elbows down on pulls'
            }
          ]
        },
        {
          name: 'Cable Lines',
          duration: '28–35 min',
          description: 'Pull-through volume, high rows, chops for anti-rotation.',
          battlePlan: 'Cable Pull-Through\n• 4 × 10 (RPE 5), 60–75s rest\nHigh Cable Row\n• 4 × 8–10 (RPE 5), 60–75s rest\nLow-to-High Cable Chop\n• 3 × 8–10/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/1tdr3nmt_download%20%284%29.png',
          intensityReason: 'Cable hinge and rows add control with low setup needs.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hips back; neutral spine',
              description: 'Hips back; neutral spine'
            },
            {
              icon: 'refresh',
              title: 'Chop: rotate from ribs',
              description: 'Chop: rotate from ribs'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Pull Drop',
          duration: '35–42 min',
          description: 'Curl or pulldown drops, rows next, core bracing finish.',
          battlePlan: 'Seated Leg Curl (machine) or Lat Pulldown\n• 1 × 8–10 heavy (RPE 7) → drop 15% → 1 × 8–10 (RPE 6)\n• Rest 90s; repeat for 2–3 total series\nSeated Row\n• 3 × 8–10 (RPE 6), 60–75s rest\nCable Pallof Press\n• 3 × 10–12/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/rdlmprvh_download%20%2819%29.png',
          intensityReason: 'Drop sets extend tension without complex technique.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Swift pin moves between',
              description: 'Swift pin moves between'
            },
            {
              icon: 'remove-circle',
              title: 'Avoid torso heave on rows',
              description: 'Avoid torso heave on rows'
            }
          ]
        },
        {
          name: 'Cluster Pull',
          duration: '35–42 min',
          description: 'Smith RDL clusters, chest-supported row, cable chops.',
          battlePlan: 'Smith RDL\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nChest-Supported Row Machine\n• 3 × 8–10 (RPE 6), 60–75s rest\nHigh-to-Low Cable Chop\n• 3 × 8–10/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/0wssum58_Screenshot%202025-12-04%20at%2012.00.14%E2%80%AFAM.png',
          intensityReason: 'Clusters preserve output while scap control stays crisp.',
          moodTips: [
            {
              icon: 'leaf',
              title: '15s breaths in clusters',
              description: '15s breaths in clusters'
            },
            {
              icon: 'body',
              title: 'Chest glued to pad on rows',
              description: 'Chest glued to pad on rows'
            }
          ]
        },
        {
          name: 'Midrange Pull',
          duration: '35–42 min',
          description: 'Back extension 1.5s, high rows, anti-rotation hold close.',
          battlePlan: 'Back Extension (1.5 reps, machine)\n• 3 × 8–10 (RPE 6), 60–75s rest\nHigh Cable Row\n• 3 × 8–10 (RPE 6), 60–75s rest\nCable Anti-Rotation Hold\n• 3 × 25–35s/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/zpva3a7u_download%20%281%29.png',
          intensityReason: '1.5 reps add time under tension using controlled loads.',
          moodTips: [
            {
              icon: 'time',
              title: '1s squeeze; 3s return',
              description: '1s squeeze; 3s return'
            },
            {
              icon: 'body',
              title: 'Keep hips square on holds',
              description: 'Keep hips square on holds'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Full Body',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Simple Body',
          duration: '25–32 min',
          description: 'Leg press, chest press, row machine, Pallof core finish.',
          battlePlan: 'Leg Press (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nMachine Chest Press\n• 3 × 8–10 (RPE 4), 60s rest\nSeated Row (neutral)\n• 3 × 8–10 (RPE 4), 60s rest\nCable Pallof Press\n• 3 × 10–12/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/v9n7t5ul_download%20%2831%29.png',
          intensityReason: 'Machines guide compound lines with very simple setup.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Note seat/bar settings',
              description: 'Note seat/bar settings'
            },
            {
              icon: 'time',
              title: 'Smooth 2–1–3 tempo',
              description: 'Smooth 2–1–3 tempo'
            }
          ]
        },
        {
          name: 'Vertical Body',
          duration: '25–32 min',
          description: 'Hack squat, shoulder press, pulldown, anti-rotation core.',
          battlePlan: 'Hack Squat (machine)\n• 3 × 8–10 (RPE 4), 60s rest\nMachine Shoulder Press\n• 3 × 8–10 (RPE 4), 60s rest\nLat Pulldown\n• 3 × 8–10 (RPE 4), 60s rest\nCable Anti-Rotation Hold\n• 3 × 20–30s/side (RPE 4), 45s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/e65l9jkf_download%20%2834%29.png',
          intensityReason: 'Vertical push and pull anchor guided lower and core.',
          moodTips: [
            {
              icon: 'body',
              title: 'Heels down on hack',
              description: 'Heels down on hack'
            },
            {
              icon: 'remove-circle',
              title: 'Don\'t arch on press',
              description: 'Don\'t arch on press'
            }
          ]
        },
        {
          name: 'Cable Body',
          duration: '25–32 min',
          description: 'Cable goblet squat, chest press, high row, cable chops.',
          battlePlan: 'Cable Goblet Squat (low cable)\n• 3 × 10–12 (RPE 4), 60s rest\nCable Chest Press\n• 3 × 10 (RPE 4), 60s rest\nHigh Cable Row\n• 3 × 10 (RPE 4), 60s rest\nHigh-to-Low Cable Chop\n• 3 × 8–10/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/ivpc3qvz_cgs.jpg',
          intensityReason: 'Cable squat, press, and row reduce bracing demands.',
          moodTips: [
            {
              icon: 'body',
              title: 'Ribs stacked over hips',
              description: 'Ribs stacked over hips'
            },
            {
              icon: 'expand',
              title: 'Own small ranges calmly',
              description: 'Own small ranges calmly'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Balanced Body',
          duration: '32–40 min',
          description: 'Leg press, chest press, seated row, overhead Pallof.',
          battlePlan: 'Leg Press (machine)\n• 4 × 10 (RPE 5), 60–75s rest\nMachine Chest Press\n• 4 × 8 (RPE 5), 60–75s rest\nSeated Row (neutral)\n• 4 × 8 (RPE 5), 60–75s rest\nCable Overhead Pallof\n• 3 × 10–12/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/re7tjas0_download%20%2833%29.png',
          intensityReason: 'Moderate compound volume across legs, push, and pull.',
          moodTips: [
            {
              icon: 'body',
              title: 'Track knee and elbow lines',
              description: 'Track knee and elbow lines'
            },
            {
              icon: 'time',
              title: 'Control eccentrics 3s',
              description: 'Control eccentrics 3s'
            }
          ]
        },
        {
          name: 'Vertical Lines',
          duration: '32–40 min',
          description: 'Hack squat, shoulder press, pulldown series, core hold.',
          battlePlan: 'Hack Squat (machine)\n• 4 × 8 (RPE 5–6), 75s rest\nMachine Shoulder Press\n• 4 × 8 (RPE 5), 60–75s rest\nLat Pulldown\n• 4 × 8 (RPE 5), 60–75s rest\nCable Anti-Rotation Hold\n• 3 × 25–35s/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/hmkic4v7_hs.avif',
          intensityReason: 'Vertical pairs build balanced output with simple cues.',
          moodTips: [
            {
              icon: 'body',
              title: 'Heels planted; quiet knees',
              description: 'Heels planted; quiet knees'
            },
            {
              icon: 'body',
              title: 'Tall chest on pulldown',
              description: 'Tall chest on pulldown'
            }
          ]
        },
        {
          name: 'Smith Lines',
          duration: '32–40 min',
          description: 'Smith squat, Smith bench, row machine, cable chops.',
          battlePlan: 'Smith Back Squat\n• 4 × 8 (RPE 5–6), 75s rest\nSmith Machine Bench Press\n• 4 × 8 (RPE 5), 60–75s rest\nChest-Supported Row Machine\n• 3 × 8–10 (RPE 5), 60–75s rest\nLow-to-High Cable Chop\n• 3 × 8–10/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/uazsquaz_download%20%288%29.png',
          intensityReason: 'Smith guidance allows heavier compounds with control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Brace light; ribs stacked',
              description: 'Brace light; ribs stacked'
            },
            {
              icon: 'leaf',
              title: 'Exhale on effort segments',
              description: 'Exhale on effort segments'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Body',
          duration: '40–50 min',
          description: 'Leg press drop, chest press drop, rows, Pallof finish.',
          battlePlan: 'Leg Press (machine)\n• 1 × 8 heavy (RPE 7) → drop 15% → 1 × 8 (RPE 6) → drop 15% → 1 × 8 (RPE 6)\n• Rest 90s; repeat for 2–3 total series\nMachine Chest Press\n• 1 × 6–8 heavy (RPE 7) → drop 15% → 1 × 6–8 (RPE 6)\nSeated Row (neutral)\n• 3 × 8–10 (RPE 6), 60–75s rest\nCable Pallof Press\n• 3 × 10–12/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/zpkugltm_download.png',
          intensityReason: 'Drop sets scale volume across lifts without complexity.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Swift pin changes',
              description: 'Swift pin changes'
            },
            {
              icon: 'time',
              title: 'Keep tempo consistent',
              description: 'Keep tempo consistent'
            }
          ]
        },
        {
          name: 'Cluster Body',
          duration: '40–50 min',
          description: 'Hack clusters, Smith bench clusters, rows, cable chops.',
          battlePlan: 'Hack Squat (machine)\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nSmith Machine Bench Press\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nHigh Cable Row\n• 3 × 8–10 (RPE 6), 60–75s rest\nHigh-to-Low Cable Chop\n• 3 × 8–10/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/zjzedsvc_download%20%288%29.png',
          intensityReason: 'Clusters maintain power while form remains reliable.',
          moodTips: [
            {
              icon: 'leaf',
              title: '15s rests in clusters',
              description: '15s rests in clusters'
            },
            {
              icon: 'barbell',
              title: 'Same load within cluster',
              description: 'Same load within cluster'
            }
          ]
        },
        {
          name: 'Midrange Body',
          duration: '40–50 min',
          description: 'Goblet 1.5s, cable fly 1.5s, high rows, overhead Pallof.',
          battlePlan: 'Cable Goblet Squat (1.5 reps)\n• 3 × 8–10 (RPE 6), 60–75s rest\nCable Fly (1.5 reps)\n• 3 × 8–10 (RPE 6), 60–75s rest\nHigh Cable Row\n• 3 × 8–10 (RPE 6), 60–75s rest\nCable Overhead Pallof\n• 3 × 10–12/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/8uykic1g_download%20%282%29.png',
          intensityReason: '1.5 reps add tension at manageable loads across lifts.',
          moodTips: [
            {
              icon: 'time',
              title: '1s squeeze at peak',
              description: '1s squeeze at peak'
            },
            {
              icon: 'time',
              title: 'Control 3s returns',
              description: 'Control 3s returns'
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
  const [showIndicator, setShowIndicator] = useState(true);
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
        <View style={styles.workoutDescriptionContainer}>
          <Text style={styles.workoutDescription} numberOfLines={2}>{item.description}</Text>
        </View>

        {/* Start Workout Button */}
        <TouchableOpacity 
          style={styles.startWorkoutButton}
          onPress={() => handleStartWorkout(item, equipment)}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={20} color="#000000" />
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
        <View style={styles.addButtonWrapper}>
          <TouchableOpacity
          style={[
            styles.addToCartButton,
            isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty)) && 
            styles.addToCartButtonAdded
          ]}
          onPress={() => handleAddToCartWithAnimation(workouts[currentWorkoutIndex])}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.addToCartButtonContent, { transform: [{ scale: localScaleAnim }] }]}>
            {isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty)) ? (
              <Ionicons name="checkmark" size={16} color="#FFD700" />
            ) : (
              <>
                <Ionicons name="add" size={14} color="#FFFFFF" />
                <Text style={styles.addToCartButtonText}>Add workout</Text>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
          <AddWorkoutIndicator visible={showIndicator} />
        </View>
      </View>

      {/* Workout List - Native Swipe Enabled */}
      <View style={[styles.workoutList, { height: 360 }]}>
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

export default function LazyFullBodyWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Parse URL parameters
  const rawMoodTitle = params.mood as string || "I'm feeling lazy";
  const moodTitle = rawMoodTitle;
  const workoutType = params.workoutType as string || 'Lift weights';
  const bodyPart = params.bodyPart as string || 'Full body';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Get workout data
  const selectedEquipmentNames = ['Push', 'Pull', 'Full Body'];
  const workoutDatabase = fullBodyWorkoutDatabase;

  // Cart hooks
  const { addToCart, isInCart } = useCart();

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
      { key: 'difficulty', icon: 'fitness', text: bodyPart },
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
    overflow: 'visible',
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
    color: '#FFD700',
  },
  workoutList: {
    height: 381,
  },
  workoutSlide: {
    paddingHorizontal: 15,
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
    bottom: 8,
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
    color: '#FFD700',
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
  workoutDescriptionContainer: {
    marginBottom: 5,
  },
  workoutDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
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
    marginBottom: 1,
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
    paddingVertical: 10,
    marginTop: -6,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  dotsLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
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
