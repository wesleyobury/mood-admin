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

import { additionalWorkoutDatabase } from './calisthenics-workouts-data';

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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Split squats, pushups, hip lifts, hollow rocks.',
          battlePlan: 'Rear-Foot Flat Split Squat\n• 4 × 8/side (RPE 5), 60–75s rest\nPushup (standard)\n• 4 × 8–12 (RPE 5), 60–75s rest\nGlute Bridge\n• 3 × 12–15 (RPE 5), 60s rest\nHollow Rock\n• 3 × 10–15 (RPE 5), 45–60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Assisted hangs and rows build grip and scap control.',
          battlePlan: 'Dead Hang (feet supported if needed)\n• 3 × 20–30s (RPE 4), 60s rest\nBand-Assisted Pullup (light angle)\n• 3 × 4–6 (RPE 4), 75s rest\nInverted Row (high bar, feet bent)\n• 3 × 8–10 (RPE 4), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Scapular movement priming builds safer pull strength.',
          battlePlan: 'Scapular Pullups (top to bottom)\n• 3 × 8–10 (RPE 4), 60s rest\nEccentric Pullup (3–4s lowers, band if needed)\n• 3 × 3–5 (RPE 4), 75s rest\nHollow Hold\n• 3 × 20–30s (RPE 4), 45–60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Different bar grips distribute load and teach control.',
          battlePlan: 'Neutral-Grip Band-Assisted Pullup\n• 3 × 5–7 (RPE 4), 75s rest\nEccentric Chin-Up (4s down)\n• 3 × 3–4 (RPE 4), 75s rest\nInverted Row (bar chest height)\n• 3 × 8–10 (RPE 4), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Moderate band assist allows higher-quality volume.',
          battlePlan: 'Band-Assisted Pullup\n• 4 × 6–8 (RPE 5), 90s rest\nInverted Row (feet flat)\n• 4 × 8–10 (RPE 5), 75s rest\nHollow Rock\n• 3 × 10–15 (RPE 5), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Negatives build strength through full, safe range.',
          battlePlan: 'Eccentric Chin-Up\n• 4 × 3–4 (RPE 5–6), 90s rest\nTop Isometric Pullup Hold (chin over bar)\n• 3 × 10–15s (RPE 5), 75s rest\nHanging Knee Raise\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Grip variations balance forearm and lat engagement.',
          battlePlan: 'Neutral-Grip Pullup (light band if needed)\n• 4 × 5–7 (RPE 5–6), 90s rest\nPronated Inverted Row (feet bent)\n• 4 × 8–10 (RPE 5), 75s rest\nDead Hang\n• 3 × 30–40s (RPE 5), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Strict sets prioritize clean strength and scap control.',
          battlePlan: 'Strict Pullup (bodyweight)\n• 5 × 4–6 (RPE 6), 90s rest\nChest-to-Bar Inverted Row (feet extended)\n• 4 × 8–10 (RPE 6), 75s rest\nHanging Leg Raise\n• 3 × 8–12 (RPE 6), 60–75s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Weighted negatives push strength beyond sticking zones.',
          battlePlan: 'Weighted Eccentric Pullup (dip belt/DB)\n• 5 × 2–3 (RPE 6–7), 120s rest\nHollow Rock\n• 4 × 12–16 (RPE 6), 60–75s rest\nBar Hang (thick grip/towel)\n• 3 × 30–40s (RPE 6), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Higher total pulls with varied grips improve capacity.',
          battlePlan: 'Neutral-Grip Pullup\n• 4 × 5–7 (RPE 6), 90s rest\nPronated Pullup\n• 3 × 4–6 (RPE 6), 90s rest\nTop Isometric Chin-Up Hold\n• 3 × 10–15s (RPE 6), 75s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Support holds and assisted dips teach body alignment.',
          battlePlan: 'Parallel Bar Support Hold\n• 3 × 15–25s (RPE 4), 60s rest\nBand-Assisted Dips\n• 3 × 5–7 (RPE 4), 75s rest\nParallel Bar Knee Tucks\n• 3 × 10–12 (RPE 4), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Bar rows build scap control with simple setup.',
          battlePlan: 'Parallel Bar Inverted Row (knees bent)\n• 3 × 8–10 (RPE 4), 60s rest\nBand-Assisted Dips\n• 3 × 5–7 (RPE 4), 75s rest\nDead Bug\n• 3 × 10–12/side (RPE 4), 45–60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Stable support positions teach shoulder packing.',
          battlePlan: 'Parallel Bar Support Hold\n• 3 × 20–30s (RPE 4), 60s rest\nAssisted Dip Eccentric (3–4s down)\n• 3 × 3–5 (RPE 4), 75s rest\nHanging Knee Raise (on bars)\n• 3 × 8–10 (RPE 4), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Moderate dip volume strengthens chest and triceps.',
          battlePlan: 'Band-Assisted Dips\n• 4 × 6–8 (RPE 5), 90s rest\nParallel Bar Inverted Row (feet flat)\n• 4 × 8–10 (RPE 5), 75s rest\nParallel Bar Knee Raise\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Isometrics add control for safer pressing patterns.',
          battlePlan: 'Parallel Bar Support Hold\n• 4 × 25–35s (RPE 5), 60–75s rest\nTempo Dips (3s down) with Band\n• 4 × 5–7 (RPE 5–6), 90s rest\nDead Bug\n• 3 × 12–14/side (RPE 5), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Pair rows with dips for balanced push–pull control.',
          battlePlan: 'Parallel Bar Row (pronated, feet bent)\n• 4 × 8–10 (RPE 5), 75s rest\nBand-Assisted Dips\n• 4 × 6–8 (RPE 5–6), 90s rest\nParallel Bar Knee Tucks\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Bodyweight dips build pressing power and stability.',
          battlePlan: 'Strict Parallel Bar Dips\n• 5 × 5–7 (RPE 6), 90s rest\nFeet-Elevated Parallel Bar Row\n• 4 × 8–10 (RPE 6), 75s rest\nParallel Bar Tuck L-Sit Hold\n• 4 × 10–15s (RPE 6), 60–75s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Weighted eccentrics increase force in safe ranges.',
          battlePlan: 'Weighted Eccentric Dip\n• 5 × 2–3 (RPE 6–7), 120s rest\nParallel Bar Row (feet extended)\n• 4 × 8–10 (RPE 6), 75s rest\nParallel Bar Knee Raise\n• 4 × 10–12 (RPE 6), 60–75s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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
        {
          name: 'Midrange Control',
          duration: '26–34 min',
          description: '1.5 dip reps increase time under tension efficiently.',
          battlePlan: 'Dips (1.5 reps: half up, down, full press)\n• 4 × 4–6 (RPE 6), 120s rest\nChest-to-Bar Parallel Bar Row\n• 4 × 8–10 (RPE 6), 75s rest\nTuck L-Sit Hold\n• 4 × 12–18s (RPE 6), 60–75s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWxpc3RoZW5pY3N8ZW58MXx8fHwxVzU2aWNnNMzIyM3ww&ixlib=rb-4.1.0&q=85',
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

const WorkoutCard = ({ 
  workout, 
  onPress 
}: { 
  workout: Workout;
  onPress: (workout: Workout) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => onPress(workout)}
      activeOpacity={0.8}
    >
      {/* Gold gradient at top */}
      <View style={styles.cardGradientTop} />
      
      <View style={styles.cardContent}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color="#FFD700" />
              <Text style={styles.metaText}>{workout.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="flash" size={14} color="#FFD700" />
              <Text style={styles.metaText}>{workout.intensity}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.workoutSummary}>{workout.summary}</Text>

        {/* Intensity reasoning with gold background */}
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityTitle}>MOOD TIP</Text>
          <Text style={styles.intensityText}>{workout.moodTip}</Text>
        </View>

        <View style={styles.battlePlanContainer}>
          <Text style={styles.battlePlanTitle}>BATTLE PLAN</Text>
          {workout.battlePlan.map((step, index) => (
            <View key={index} style={styles.battlePlanItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.battlePlanText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Swipe to explore section with gold gradient */}
      <View style={styles.swipeContainer}>
        <Text style={styles.swipeText}>Swipe to explore</Text>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
      
      {/* Gold gradient at bottom */}
      <View style={styles.cardGradientBottom} />
    </TouchableOpacity>
  );
};

export default function CalisthenicsWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  
  const mood = params.mood as string || 'I want to do calisthenics';
  const workoutType = params.workoutType as string || 'Bodyweight exercises';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';

  useEffect(() => {
    // Decode equipment parameter and get workouts for each equipment type
    const equipmentList = decodeURIComponent(equipmentParam).split(',');
    console.log('Equipment list:', equipmentList);
    console.log('Difficulty:', difficulty);
    
    const workouts: Workout[] = [];
    
    equipmentList.forEach(equipment => {
      const equipmentWorkouts = calisthenicsWorkouts[equipment.trim()];
      if (equipmentWorkouts && equipmentWorkouts[difficulty]) {
        workouts.push(...equipmentWorkouts[difficulty]);
      }
    });
    
    setSelectedWorkouts(workouts);
  }, [equipmentParam, difficulty]);

  const handleWorkoutSelect = (workout: Workout) => {
    console.log('Selected workout:', workout.title);
    // Navigate to workout detail screen (to be implemented)
  };

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
          <Text style={styles.headerSubtitle}>{mood}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="body" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Calisthenics</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="checkmark" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Equipment</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Text style={styles.progressStepBadge}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Text>
            </View>
            <Text style={styles.progressStepText}>Difficulty</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={[styles.scrollView, { marginTop: 16 }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedWorkouts.length > 0 ? (
          selectedWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onPress={handleWorkoutSelect}
            />
          ))
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="fitness" size={48} color="rgba(255, 215, 0, 0.5)" />
            <Text style={styles.noWorkoutsText}>No workouts found for selected equipment and difficulty</Text>
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    overflow: 'hidden',
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
  progressStepBadge: {
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
    paddingBottom: 40,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardGradientTop: {
    height: 4,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGradientBottom: {
    height: 4,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 20,
  },
  workoutHeader: {
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  workoutSummary: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 16,
  },
  intensityContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  intensityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  intensityText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  battlePlanContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  battlePlanTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  battlePlanItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginRight: 12,
    marginTop: 6,
  },
  battlePlanText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  swipeContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  swipeText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
  },
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});