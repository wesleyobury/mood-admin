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

import { additionalWorkoutDatabase } from '../data/calisthenics-workouts-data';

// Comprehensive calisthenics workout database
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Pure bodyweight',
    icon: 'body',
    workouts: {
      beginner: [
        {
          name: 'Body Start',
          duration: '16–20 min',
          description: 'Squats and incline pushups, dead bugs for core stability.',
          battlePlan: 'Bodyweight Squat\n• 3 × 12–15 (RPE 4), 60s rest\nIncline Pushup (hands on bench/wall)\n• 3 × 8–12 (RPE 4), 60s rest\nDead Bug\n• 3 × 8–10/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/8pq54s9o_download%20%2816%29.png',
          intensityReason: 'Simple patterns build control without loading demands.',
          moodTips: [
            {
              icon: 'body',
              title: 'Own shallow ranges',
              description: 'Own shallow ranges'
            },
            {
              icon: 'leaf',
              title: 'Exhale on effort; slow lowers',
              description: 'Exhale on effort; slow lowers'
            }
          ]
        },
        {
          name: 'Hinge Intro',
          duration: '16–20 min',
          description: 'Hip hinge, step-back lunges, plank hold for midline.',
          battlePlan: 'Hip Hinge (bodyweight RDL pattern)\n• 3 × 12 (RPE 4), 60s rest\nReverse Lunge\n• 3 × 8/side (RPE 4), 60s rest\nFront Plank\n• 3 × 20–40s (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/dvx5s4v8_download%20%2817%29.png',
          intensityReason: 'Hip hinge and knee patterns build base body control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hips back, shins quiet',
              description: 'Hips back, shins quiet'
            },
            {
              icon: 'leaf',
              title: 'Brace light; breathe steady',
              description: 'Brace light; breathe steady'
            }
          ]
        },
        {
          name: 'Vertical Intro',
          duration: '16–20 min',
          description: 'Doorframe rows, incline pushups, hollow holds finish.',
          battlePlan: 'Towel/Doorframe Row (light angle)\n• 3 × 10–12 (RPE 4), 60s rest\nIncline Pushup\n• 3 × 8–12 (RPE 4), 60s rest\nHollow Hold\n• 3 × 15–25s (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/3v9vj2rl_download%20%2820%29.png',
          intensityReason: 'Vertical pulls regress to build scap control safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Shoulders down/back',
              description: 'Shoulders down/back'
            },
            {
              icon: 'body',
              title: 'Ribs down in hollow',
              description: 'Ribs down in hollow'
            }
          ]
        },
        {
          name: 'Flow Basics',
          duration: '18–22 min',
          description: 'Squats, wall sits, pushups from knees, side planks.',
          battlePlan: 'Bodyweight Squat\n• 3 × 12–15 (RPE 4), 60s rest\nWall Sit\n• 3 × 30–45s (RPE 4), 45–60s rest\nKnee Pushup\n• 3 × 8–12 (RPE 4), 60s rest\nSide Plank\n• 3 × 15–25s/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/udye11gr_download%20%2821%29.png',
          intensityReason: 'Controlled flow builds capacity with minimal strain.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Move smooth, no rush',
              description: 'Move smooth, no rush'
            },
            {
              icon: 'body',
              title: 'Keep neck long; soft lock',
              description: 'Keep neck long; soft lock'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Body Lines',
          duration: '22–28 min',
          description: 'Split squats, pushups, hip lifts, hollow rocks for bodyweight challenge.',
          battlePlan: 'Rear-Foot Flat Split Squat\n• 4 × 8/side (RPE 5), 60–75s rest\nPushup (standard)\n• 4 × 8–12 (RPE 5), 60–75s rest\nGlute Bridge\n• 3 × 12–15 (RPE 5), 60s rest\nHollow Rock\n• 3 × 10–15 (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/dvx5s4v8_download%20%2817%29.png',
          intensityReason: 'Moderate volume builds strength with steady control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Control 3s lowers',
              description: 'Control 3s lowers'
            },
            {
              icon: 'body',
              title: 'Ribs down on pushups',
              description: 'Ribs down on pushups'
            }
          ]
        },
        {
          name: 'Single-Leg Start',
          duration: '22–28 min',
          description: 'Step-downs, skater squats, pushups, dead bugs.',
          battlePlan: 'Heel Tap Step-Down (low step)\n• 4 × 6–8/side (RPE 5), 60–75s rest\nSkater Squat (assisted)\n• 3 × 6–8/side (RPE 5), 60–75s rest\nPushup\n• 3 × 8–12 (RPE 5), 60s rest\nDead Bug\n• 3 × 10–12/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/t0xtqts3_download%20%2819%29.png',
          intensityReason: 'Unilateral patterns build balance and hip stability.',
          moodTips: [
            {
              icon: 'body',
              title: 'Reach long; soft knee',
              description: 'Reach long; soft knee'
            },
            {
              icon: 'body',
              title: 'Quiet torso on pushes',
              description: 'Quiet torso on pushes'
            }
          ]
        },
        {
          name: 'Hinge + Pull',
          duration: '22–28 min',
          description: 'Good mornings, table rows, pushups, side planks.',
          battlePlan: 'Bodyweight Good Morning\n• 4 × 12 (RPE 5), 60s rest\nTable/Ring Row Regression (feet bent)\n• 4 × 8–10 (RPE 5), 60–75s rest\nPushup\n• 3 × 8–12 (RPE 5), 60s rest\nSide Plank\n• 3 × 25–35s/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/jb142mdj_download%20%2822%29.png',
          intensityReason: 'Hip hinge pairs with row regressions for posture.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hips back; neutral neck',
              description: 'Hips back; neutral neck'
            },
            {
              icon: 'body',
              title: 'Row to ribs, no shrug',
              description: 'Row to ribs, no shrug'
            }
          ]
        },
        {
          name: 'Flow Builder',
          duration: '22–28 min',
          description: 'Squat to lunge flow, pushups, hollow hold finisher.',
          battlePlan: 'Squat → Reverse Lunge (alt sides)\n• 4 × 6/side (RPE 5), 60–75s rest\nPushup\n• 4 × 8–12 (RPE 5), 60–75s rest\nHollow Hold\n• 3 × 25–35s (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/8pq54s9o_download%20%2816%29.png',
          intensityReason: 'Alternating patterns elevate capacity with control.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Smooth transitions',
              description: 'Smooth transitions'
            },
            {
              icon: 'leaf',
              title: 'Keep breath rhythmic',
              description: 'Keep breath rhythmic'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Power Lines',
          duration: '26–34 min',
          description: 'Pistol regressions, decline pushups, hollow rocks.',
          battlePlan: 'Pistol Box Squat (to box/bench)\n• 4 × 5–7/side (RPE 6), 75s rest\nDecline Pushup (feet elevated)\n• 4 × 8–12 (RPE 6), 60–75s rest\nHollow Rock\n• 4 × 10–15 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/h7zvxkan_PS.jpg',
          intensityReason: 'Higher tension bodyweight builds strength under control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stay balanced, slow lowers',
              description: 'Stay balanced, slow lowers'
            },
            {
              icon: 'body',
              title: 'Pushups: ribs down, no flare',
              description: 'Pushups: ribs down, no flare'
            }
          ]
        },
        {
          name: 'Hinge Power',
          duration: '26–34 min',
          description: 'Single-leg RDL reach, hard rows, side plank holds.',
          battlePlan: 'Single-Leg RDL Reach (unloaded)\n• 4 × 6–8/side (RPE 6), 75s rest\nTable/Ring Row (feet forward)\n• 4 × 8–10 (RPE 6), 60–75s rest\nSide Plank\n• 3 × 35–45s/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/voz31xv4_download%20%2823%29.png',
          intensityReason: 'Single-leg hinge and rows increase posterior demand.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hips square; soft knee',
              description: 'Hips square; soft knee'
            },
            {
              icon: 'body',
              title: 'Row: pause 1s at ribs',
              description: 'Row: pause 1s at ribs'
            }
          ]
        },
        {
          name: 'Volume Push–Pull',
          duration: '26–34 min',
          description: 'Pushups, rows, squat jumps light, hollow hold closer.',
          battlePlan: 'Pushup\n• 5 × 8–12 (RPE 6), 60–75s rest\nInverted Row (low table or rail)\n• 4 × 8–10 (RPE 6), 60–75s rest\nSquat Jump (small height)\n• 3 × 8 (RPE 6), 60s rest\nHollow Hold\n• 3 × 30–40s (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/e6le95i4_download%20%2818%29.png',
          intensityReason: 'Higher push–pull volume builds endurance and control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep reps smooth',
              description: 'Keep reps smooth'
            },
            {
              icon: 'walk',
              title: 'Land soft; quiet feet',
              description: 'Land soft; quiet feet'
            }
          ]
        },
        {
          name: 'Midrange Core',
          duration: '26–34 min',
          description: '1.5 tempo adds time under tension for safe progress.',
          battlePlan: 'Bodyweight Squat (1.5 reps)\n• 4 × 8–10 (RPE 6), 60–75s rest\nPushup (1.5 reps)\n• 4 × 6–8 (RPE 6), 60–75s rest\nSide Plank with Top-Arm Reach\n• 3 × 8–10/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/8pq54s9o_download%20%2816%29.png',
          intensityReason: '1.5 tempo adds time under tension for safe progress.',
          moodTips: [
            {
              icon: 'body',
              title: '1s pause mid; 3s return',
              description: '1s pause mid; 3s return'
            },
            {
              icon: 'leaf',
              title: 'Keep ribs stacked, nose breathe',
              description: 'Keep ribs stacked, nose breathe'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Pull up bar',
    icon: 'remove-outline',
    workouts: {
      beginner: [
        {
          name: 'Bar Start',
          duration: '16–22 min',
          description: 'Dead hangs, band-assisted pulls, incline inverted rows.',
          battlePlan: 'Dead Hang (feet supported if needed)\n• 3 × 20–30s (RPE 4), 60s rest\nBand-Assisted Pullup (light angle)\n• 3 × 4–6 (RPE 4), 75s rest\nInverted Row (high bar, feet bent)\n• 3 × 8–10 (RPE 4), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/cvdrz3i5_inverted%20rows.png',
          intensityReason: 'Assisted hangs and rows build grip and scap control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Shoulders down; long neck',
              description: 'Shoulders down; long neck'
            },
            {
              icon: 'leaf',
              title: 'Smooth breath under tension',
              description: 'Smooth breath under tension'
            }
          ]
        },
        {
          name: 'Scap Basics',
          duration: '16–22 min',
          description: 'Scap pullups, eccentric lowers, hollow hold for core.',
          battlePlan: 'Scapular Pullups (top to bottom)\n• 3 × 8–10 (RPE 4), 60s rest\nEccentric Pullup (3–4s lowers, band if needed)\n• 3 × 3–5 (RPE 4), 75s rest\nHollow Hold\n• 3 × 20–30s (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/fh1b52aj_dead%20hang.png',
          intensityReason: 'Scapular movement priming builds safer pull strength.',
          moodTips: [
            {
              icon: 'body',
              title: 'Move only the scaps',
              description: 'Move only the scaps'
            },
            {
              icon: 'body',
              title: 'Ribs down in hollow hold',
              description: 'Ribs down in hollow hold'
            }
          ]
        },
        {
          name: 'Mixed Angle',
          duration: '16–22 min',
          description: 'Neutral band pulls, chin-up eccentrics, rows to close.',
          battlePlan: 'Neutral-Grip Band-Assisted Pullup\n• 3 × 5–7 (RPE 4), 75s rest\nEccentric Chin-Up (4s down)\n• 3 × 3–4 (RPE 4), 75s rest\nInverted Row (bar chest height)\n• 3 × 8–10 (RPE 4), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/7475d60t_chin%20ups.png',
          intensityReason: 'Different bar grips distribute load and teach control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Elbows track down',
              description: 'Elbows track down'
            },
            {
              icon: 'body',
              title: 'Avoid neck craning up',
              description: 'Avoid neck craning up'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Volume Pull',
          duration: '22–28 min',
          description: 'Assisted pullups, inverted rows, hollow rocks finish.',
          battlePlan: 'Band-Assisted Pullup\n• 4 × 6–8 (RPE 5), 90s rest\nInverted Row (feet flat)\n• 4 × 8–10 (RPE 5), 75s rest\nHollow Rock\n• 3 × 10–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/cvdrz3i5_inverted%20rows.png',
          intensityReason: 'Moderate band assist allows higher-quality volume.',
          moodTips: [
            {
              icon: 'body',
              title: 'Smooth 2–1–3 tempo',
              description: 'Smooth 2–1–3 tempo'
            },
            {
              icon: 'body',
              title: 'Keep ribs down in rocks',
              description: 'Keep ribs down in rocks'
            }
          ]
        },
        {
          name: 'Eccentric Lines',
          duration: '22–28 min',
          description: 'Chin-up eccentrics, isometric holds, knee raises.',
          battlePlan: 'Eccentric Chin-Up\n• 4 × 3–4 (RPE 5–6), 90s rest\nTop Isometric Pullup Hold (chin over bar)\n• 3 × 10–15s (RPE 5), 75s rest\nHanging Knee Raise\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/7475d60t_chin%20ups.png',
          intensityReason: 'Negatives build strength through full, safe range.',
          moodTips: [
            {
              icon: 'body',
              title: '4–5s negatives',
              description: '4–5s negatives'
            },
            {
              icon: 'body',
              title: 'Hold chest-up position',
              description: 'Hold chest-up position'
            }
          ]
        },
        {
          name: 'Mixed Grips',
          duration: '22–28 min',
          description: 'Neutral pullups, pronated rows, dead hangs for grip.',
          battlePlan: 'Neutral-Grip Pullup (light band if needed)\n• 4 × 5–7 (RPE 5–6), 90s rest\nPronated Inverted Row (feet bent)\n• 4 × 8–10 (RPE 5), 75s rest\nDead Hang\n• 3 × 30–40s (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/fh1b52aj_dead%20hang.png',
          intensityReason: 'Grip variations balance forearm and lat engagement.',
          moodTips: [
            {
              icon: 'body',
              title: 'Drive elbows to ribs',
              description: 'Drive elbows to ribs'
            },
            {
              icon: 'hand-right',
              title: 'Keep hands quiet, no twist',
              description: 'Keep hands quiet, no twist'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Strict Pull',
          duration: '26–34 min',
          description: 'Pullups strict, chest-to-bar rows, hanging leg raises.',
          battlePlan: 'Strict Pullup (bodyweight)\n• 5 × 4–6 (RPE 6), 90s rest\nChest-to-Bar Inverted Row (feet extended)\n• 4 × 8–10 (RPE 6), 75s rest\nHanging Leg Raise\n• 3 × 8–12 (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/kzuswott_download%20%2815%29.png',
          intensityReason: 'Strict sets prioritize clean strength and scap control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Pull chest to bar',
              description: 'Pull chest to bar'
            },
            {
              icon: 'body',
              title: 'No swing; smooth lowers',
              description: 'No swing; smooth lowers'
            }
          ]
        },
        {
          name: 'Eccentric Power',
          duration: '26–34 min',
          description: 'Eccentric pullups weighted, hollow rocks, grip holds.',
          battlePlan: 'Weighted Eccentric Pullup (dip belt/DB)\n• 5 × 2–3 (RPE 6–7), 120s rest\nHollow Rock\n• 4 × 12–16 (RPE 6), 60–75s rest\nBar Hang (thick grip/towel)\n• 3 × 30–40s (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/iqs19xds_weighted%20pullup.png',
          intensityReason: 'Weighted negatives push strength beyond sticking zones.',
          moodTips: [
            {
              icon: 'body',
              title: '5s negatives; solid brace',
              description: '5s negatives; solid brace'
            },
            {
              icon: 'body',
              title: 'Avoid shrug; pack shoulder',
              description: 'Avoid shrug; pack shoulder'
            }
          ]
        },
        {
          name: 'Volume Mix',
          duration: '26–34 min',
          description: 'Neutral pullups, pronated pullups, chin hold finisher.',
          battlePlan: 'Neutral-Grip Pullup\n• 4 × 5–7 (RPE 6), 90s rest\nPronated Pullup\n• 3 × 4–6 (RPE 6), 90s rest\nTop Isometric Chin-Up Hold\n• 3 × 10–15s (RPE 6), 75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/7475d60t_chin%20ups.png',
          intensityReason: 'Higher total pulls with varied grips improve capacity.',
          moodTips: [
            {
              icon: 'body',
              title: 'Full depth, calm chest',
              description: 'Full depth, calm chest'
            },
            {
              icon: 'body',
              title: '2–1–3 tempo throughout',
              description: '2–1–3 tempo throughout'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Parallel bars / dip station',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Dip Prep',
          duration: '16–22 min',
          description: 'Support holds, band-assisted dips, knee tucks closer.',
          battlePlan: 'Parallel Bar Support Hold\n• 3 × 15–25s (RPE 4), 60s rest\nBand-Assisted Dips\n• 3 × 5–7 (RPE 4), 75s rest\nParallel Bar Knee Tucks\n• 3 × 10–12 (RPE 4), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/eyqn2a9a_download%20%2810%29.png',
          intensityReason: 'Support holds and assisted dips teach body alignment.',
          moodTips: [
            {
              icon: 'body',
              title: 'Shoulders down; long neck',
              description: 'Shoulders down; long neck'
            },
            {
              icon: 'body',
              title: 'Small depth you control',
              description: 'Small depth you control'
            }
          ]
        },
        {
          name: 'Angle Rows',
          duration: '16–22 min',
          description: 'Bar rows, band dips light, dead bug finish for light challenge.',
          battlePlan: 'Parallel Bar Inverted Row (knees bent)\n• 3 × 8–10 (RPE 4), 60s rest\nBand-Assisted Dips\n• 3 × 5–7 (RPE 4), 75s rest\nDead Bug\n• 3 × 10–12/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/bhu7tjin_download%20%2814%29.png',
          intensityReason: 'Bar rows build scap control with simple setup.',
          moodTips: [
            {
              icon: 'body',
              title: 'Elbows to ribs line',
              description: 'Elbows to ribs line'
            },
            {
              icon: 'body',
              title: 'Ribs down on dip reps',
              description: 'Ribs down on dip reps'
            }
          ]
        },
        {
          name: 'Support + Core',
          duration: '16–22 min',
          description: 'Support holds, assisted dip eccentrics, knee raises.',
          battlePlan: 'Parallel Bar Support Hold\n• 3 × 20–30s (RPE 4), 60s rest\nAssisted Dip Eccentric (3–4s down)\n• 3 × 3–5 (RPE 4), 75s rest\nHanging Knee Raise (on bars)\n• 3 × 8–10 (RPE 4), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/v42ceu0x_download%20%2811%29.png',
          intensityReason: 'Stable support positions teach shoulder packing.',
          moodTips: [
            {
              icon: 'body',
              title: 'Pack shoulders down',
              description: 'Pack shoulders down'
            },
            {
              icon: 'body',
              title: 'Slow 3–4s lowers',
              description: 'Slow 3–4s lowers'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Dip Lines',
          duration: '22–28 min',
          description: 'Dips banded, bar rows, knee raise strict to finish.',
          battlePlan: 'Band-Assisted Dips\n• 4 × 6–8 (RPE 5), 90s rest\nParallel Bar Inverted Row (feet flat)\n• 4 × 8–10 (RPE 5), 75s rest\nParallel Bar Knee Raise\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/bhu7tjin_download%20%2814%29.png',
          intensityReason: 'Moderate dip volume strengthens chest and triceps.',
          moodTips: [
            {
              icon: 'body',
              title: 'Slight torso forward',
              description: 'Slight torso forward'
            },
            {
              icon: 'body',
              title: 'Elbows 45–60° track',
              description: 'Elbows 45–60° track'
            }
          ]
        },
        {
          name: 'Support Strength',
          duration: '22–28 min',
          description: 'Support holds, tempo dips, dead bugs for brace.',
          battlePlan: 'Parallel Bar Support Hold\n• 4 × 25–35s (RPE 5), 60–75s rest\nTempo Dips (3s down) with Band\n• 4 × 5–7 (RPE 5–6), 90s rest\nDead Bug\n• 3 × 12–14/side (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/acv740pg_download%20%2812%29.png',
          intensityReason: 'Isometrics add control for safer pressing patterns.',
          moodTips: [
            {
              icon: 'body',
              title: 'Lock shoulder position',
              description: 'Lock shoulder position'
            },
            {
              icon: 'body',
              title: '2–1–3 tempo on dips',
              description: '2–1–3 tempo on dips'
            }
          ]
        },
        {
          name: 'Mixed Angle',
          duration: '22–28 min',
          description: 'Pronated bar rows, dips, knee tucks controlled.',
          battlePlan: 'Parallel Bar Row (pronated, feet bent)\n• 4 × 8–10 (RPE 5), 75s rest\nBand-Assisted Dips\n• 4 × 6–8 (RPE 5–6), 90s rest\nParallel Bar Knee Tucks\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/v42ceu0x_download%20%2811%29.png',
          intensityReason: 'Pair rows with dips for balanced push–pull control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Chest to bar line',
              description: 'Chest to bar line'
            },
            {
              icon: 'body',
              title: 'Keep tucks slow, no swing',
              description: 'Keep tucks slow, no swing'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Strict Dips',
          duration: '26–34 min',
          description: 'Strict dips, feet-elevated rows, L-sit tuck holds.',
          battlePlan: 'Strict Parallel Bar Dips\n• 5 × 5–7 (RPE 6), 90s rest\nFeet-Elevated Parallel Bar Row\n• 4 × 8–10 (RPE 6), 75s rest\nParallel Bar Tuck L-Sit Hold\n• 4 × 10–15s (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/acv740pg_download%20%2812%29.png',
          intensityReason: 'Bodyweight dips build pressing power and stability.',
          moodTips: [
            {
              icon: 'body',
              title: 'Shoulders packed down',
              description: 'Shoulders packed down'
            },
            {
              icon: 'body',
              title: 'Control depth; no bounce',
              description: 'Control depth; no bounce'
            }
          ]
        },
        {
          name: 'Eccentric Power',
          duration: '26–34 min',
          description: 'Dip negatives weighted, hard rows, strict knee raises.',
          battlePlan: 'Weighted Eccentric Dip\n• 5 × 2–3 (RPE 6–7), 120s rest\nParallel Bar Row (feet extended)\n• 4 × 8–10 (RPE 6), 75s rest\nParallel Bar Knee Raise\n• 4 × 10–12 (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/bhu7tjin_download%20%2814%29.png',
          intensityReason: 'Weighted eccentrics increase force in safe ranges.',
          moodTips: [
            {
              icon: 'body',
              title: '4–5s controlled lowers',
              description: '4–5s controlled lowers'
            },
            {
              icon: 'body',
              title: 'Keep elbows 45–60°',
              description: 'Keep elbows 45–60°'
            }
          ]
        },
        { // Midrange Control workout
          name: 'Midrange Control',
          duration: '26–34 min',
          description: 'Dip 1.5 reps, chest-to-bar rows, tuck L-sit holds for advanced challenge.',
          battlePlan: 'Dips (1.5 reps: half up, down, full press)\n• 4 × 4–6 (RPE 6), 120s rest\nChest-to-Bar Parallel Bar Row\n• 4 × 8–10 (RPE 6), 75s rest\nTuck L-Sit Hold\n• 4 × 12–18s (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/gua5r4vy_download%20%2813%29.png',
          intensityReason: '1.5 dip reps increase time under tension efficiently.',
          moodTips: [
            {
              icon: 'body',
              title: 'Pause mid, then press',
              description: 'Pause mid, then press'
            },
            {
              icon: 'body',
              title: 'Keep ribs down; no sway',
              description: 'Keep ribs down; no sway'
            }
          ]
        }
      ]
    }
  },
  ...additionalWorkoutDatabase
];

// Workout Card Component - moved outside for memoization
interface WorkoutCardProps {
  equipment: string;
  icon: keyof typeof Ionicons.glyphMap;
  workouts: Workout[];
  difficulty: string;
  workoutType: string;
  moodTitle: string;
  onStartWorkout: (workout: Workout, equipment: string, difficulty: string) => void;
  isInCart: (workoutId: string) => boolean;
  createWorkoutId: (workout: Workout, equipment: string, difficulty: string) => string;
  handleAddToCart: (workout: Workout, equipment: string) => void;
}

const WorkoutCard = React.memo(({ 
  equipment, 
  icon, 
  workouts, 
  difficulty,
  workoutType,
  moodTitle,
  onStartWorkout,
  isInCart,
  createWorkoutId,
  handleAddToCart,
}: WorkoutCardProps) => {
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
          <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
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
          <Text style={styles.workoutDescription}>{item.description}</Text>
        </View>

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
      <View style={[styles.workoutList, { height: 380 }]}>
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

export default function CalisthenicsWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Parse URL parameters
  const moodTitle = params.mood as string || 'I want to do calisthenics';
  const workoutType = params.workoutType as string || 'Bodyweight exercises';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse selected equipment from comma-separated string
  const selectedEquipmentNames = equipmentParam.split(',').filter(name => name.trim() !== '');
  
  console.log('Calisthenics Debug:', {
    equipmentParam,
    selectedEquipmentNames,
    difficulty,
    workoutType,
    moodTitle
  });

  // Get workout data for selected equipment
  const selectedWorkoutData = workoutDatabase.filter(eq => 
    selectedEquipmentNames.some(name => 
      eq.equipment.toLowerCase().trim() === name.toLowerCase().trim()
    )
  );

  console.log('Selected workout data count:', selectedWorkoutData.length);

  // Cart hooks
  const { addToCart, isInCart } = useCart();
  const { token } = useAuth();

  const createWorkoutId = (workout: Workout, equipment: string, difficulty: string) => {
    return `${workout.name}-${equipment}-${difficulty}`;
  };

  const handleAddToCart = (workout: Workout, equipment: string) => {
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
      workoutType: workoutType,
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
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    try {
      console.log('🚀 Starting workout:', workout.name, 'on', equipment);
      
      if (!workout.name || !equipment || !difficulty) {
        console.error('❌ Missing required parameters for workout navigation');
        return;
      }
      
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
      { key: 'mood', icon: 'flame', text: moodTitle },
      { key: 'difficulty', icon: 'speedometer', text: difficulty === 'intermediate' ? 'Intermed.' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `Equipment (${selectedEquipmentNames.length})` },
    ];

    // Return single row
    return [steps];
  };

  if (selectedWorkoutData.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Calisthenics</Text>
            <Text style={styles.headerSubtitle}>{moodTitle}</Text>
          </View>
          <HomeButton />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="body" size={64} color="rgba(255, 215, 0, 0.3)" />
          <Text style={styles.emptyStateText}>No workouts found for selected equipment</Text>
          <Text style={styles.emptyStateSubtext}>Try selecting different equipment or difficulty level</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <View style={styles.progressContent}>
          {progressRows[0].map((step, stepIndex) => (
            <React.Fragment key={step.key}>
              <View style={styles.progressStep}>
                <View style={styles.progressStepActive}>
                  {step.key === 'equipment' || step.key === 'difficulty' ? (
                    <Text style={styles.progressStepBadgeText}>{stepIndex + 1}</Text>
                  ) : (
                    <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={14} color="#000000" />
                  )}
                </View>
                <Text style={styles.progressStepText}>{step.text}</Text>
              </View>
              
              {stepIndex < progressRows[0].length - 1 && (
                <View style={styles.progressConnector} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Scrollable Workout Cards */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedWorkoutData.map((equipmentData, index) => {
          const workouts = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
          return (
            <WorkoutCard
              key={`${equipmentData.equipment}-${index}`}
              equipment={equipmentData.equipment}
              icon={equipmentData.icon}
              workouts={workouts}
              difficulty={difficulty}
              workoutType=""
              moodTitle={moodTitle}
              onStartWorkout={handleStartWorkout}
              isInCart={isInCart}
              createWorkoutId={createWorkoutId}
              handleAddToCart={handleAddToCart}
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
    color: '#FFFFFF',
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
    zIndex: 10,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  progressStep: {
    alignItems: 'center',
    width: 70,
    flex: 0,
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
  },
  progressStepBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 70,
    lineHeight: 12,
  },
  progressConnector: {
    width: 12,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 1,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
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
    borderBottomColor: 'rgba(255, 215, 0, 0.3)',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  addButtonWrapper: {
    position: 'relative',
    overflow: 'visible',
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
  workoutList: {
    backgroundColor: '#000000',
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  workoutImageContainer: {
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'visible',
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
    zIndex: 10,
  },
  swipeText: {
    fontSize: 11,
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  workoutContent: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  difficultyBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
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
    marginBottom: 15,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
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
    marginTop: 0,
    marginBottom: 1,
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
    marginBottom: 6,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
});