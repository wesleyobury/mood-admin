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

// Explosiveness workout database with all equipment types
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Battle Ropes',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Explosive Rope Slams',
          duration: '8–10 min',
          description: 'Short max bursts to learn power and quick resets',
          battlePlan: '3 rounds\n• 3 × 8s Max Slams (15s between efforts)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Teaches full-body intent with braced core mechanics',
          moodTips: [
            {
              icon: 'body',
              title: 'Core Bracing',
              description: 'Brace ribs down; hinge slightly on the slam'
            },
            {
              icon: 'trending-down',
              title: 'Handle Drive',
              description: 'Drive handles to floor; elbows track down, not wide'
            }
          ]
        },
        {
          name: 'Alternating Waves',
          duration: '8–10 min',
          description: 'Fast alternating arms with light athletic footwork',
          battlePlan: '4 rounds\n• 15s Alternating Waves\n• 10s In-place High Knees\nRest 45–60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Rhythm waves build speed endurance and posture',
          moodTips: [
            {
              icon: 'walk',
              title: 'High Knees',
              description: '"High knees" = fast in-place knee drive on balls of feet'
            },
            {
              icon: 'fitness',
              title: 'Arm Movement',
              description: 'Snap from elbows; shoulders stay low and packed'
            }
          ]
        },
        {
          name: 'Side-to-Side Waves',
          duration: '8–10 min',
          description: 'Hip shift drives lateral rope hits without twisting',
          battlePlan: '3 rounds\n• 12s Side-to-Side Waves\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Trains frontal-plane power with torso stability',
          moodTips: [
            {
              icon: 'swap-horizontal',
              title: 'Hip Movement',
              description: 'Shift hips left/right; torso faces forward'
            },
            {
              icon: 'pulse',
              title: 'Rope Control',
              description: 'Keep rope slack minimal; crisp, even strikes'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Slam + Reactive Drop Squats',
          duration: '10–12 min',
          description: 'Learn decel-then-explode with quiet, fast contacts',
          battlePlan: '4 rounds\n• 10 Hard Slams\n• 4 Reactive Drop Squats (stick 1s, then pop)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Pairing slam to quick drop improves reactivity',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Drop Squat',
              description: '"Reactive drop squat" = 6–8" drop into instant soft catch'
            },
            {
              icon: 'checkmark',
              title: 'Landing',
              description: 'Land mid-foot; knees over toes; pop back up'
            }
          ]
        },
        {
          name: 'Alternating Waves + Bounce Steps',
          duration: '10–12 min',
          description: 'Light pogo-style rhythm paired with fast waves',
          battlePlan: '4 rounds\n• 20s Alternating Waves + Bounce Steps\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Foot rhythm improves stiffness and arm speed',
          moodTips: [
            {
              icon: 'basketball',
              title: 'Bounce Steps',
              description: '"Bounce steps" = small ankle pogos; heels kiss ground quietly'
            },
            {
              icon: 'flash',
              title: 'Speed Focus',
              description: 'Keep cadence high; elbows whip; wrists snap'
            }
          ]
        },
        {
          name: 'Hand-Over-Hand Rope Pull',
          duration: '10–12 min',
          description: 'Seated/low stance pull with plate/anchor resistance',
          battlePlan: '3 rounds\n• 1 × 20–25m Weighted Rope Pull (hand-over-hand)\n• 10s Easy Waves reset\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Horizontal pulling power builds acceleration force',
          moodTips: [
            {
              icon: 'body',
              title: 'Body Position',
              description: 'Sit low; core braced; pull to chest, re-grip fast'
            },
            {
              icon: 'barbell',
              title: 'Equipment',
              description: 'Use a sled/plate anchored to rope for load'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Max Slam Density',
          duration: '12–14 min',
          description: 'Short max efforts with tight rests to sustain speed',
          battlePlan: '5 rounds\n• 12s Max Slams\nRest 18s\nRepeat 2 efforts per round (total 10 max efforts)',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-density power repeats stress peak output',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Consistency',
              description: 'Each slam same height and tempo'
            },
            {
              icon: 'leaf',
              title: 'Breathing',
              description: 'Hips hinge, not spine flex; breathe sharp'
            }
          ]
        },
        {
          name: 'Side-to-Side Wave Clusters',
          duration: '12–14 min',
          description: 'Crisp lateral hits in short clusters sustain quality',
          battlePlan: '4 rounds\n• Cluster: 10s Side-to-Side Waves, 10s rest, 10s Waves\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Frontal-plane endurance at high rope velocity',
          moodTips: [
            {
              icon: 'body',
              title: 'Stance',
              description: 'Feet athletic stance; hips shift, torso square'
            },
            {
              icon: 'flash',
              title: 'Hand Movement',
              description: 'Hands travel across midline together, tight snap'
            }
          ]
        },
        {
          name: 'Heavy Rope Pull + Sprint Contrast',
          duration: '12–16 min',
          description: 'Load the pattern, then sprint to express speed',
          battlePlan: '5 rounds\n• 1 × 20m HEAVY Rope Pull (hand-over-hand to sled)\n• 20m Acceleration Sprint\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Heavy pull potentiates acceleration mechanics',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Heavy Pull',
              description: 'Heavy hand-over-hand: long pulls to chest, no shrugging'
            },
            {
              icon: 'walk',
              title: 'Sprint Form',
              description: 'Sprint tall with big knee drive'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Plyo Box',
    icon: 'cube',
    workouts: {
      beginner: [
        {
          name: 'Step-Up Pops',
          duration: '8–10 min',
          description: 'Fast concentric step, small float, soft landing',
          battlePlan: '3 rounds\n• 6 per leg Step-Up Pops (low box)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Teaches vertical force with low impact and control',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Step-Up Pop',
              description: '"Step-up pop" = drive through box, brief air, soft land on box'
            },
            {
              icon: 'footsteps',
              title: 'Step Down',
              description: 'Step down quietly; switch legs each rep'
            }
          ]
        },
        {
          name: 'Low Box Jumps',
          duration: '8–10 min',
          description: 'Jump up and hold 2s to train deceleration',
          battlePlan: '3 rounds\n• 5 Box Jumps (stick 2s)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Landing mechanics and alignment come first',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Jump Form',
              description: 'Arms swing; jump tall; knees track over toes'
            },
            {
              icon: 'checkmark',
              title: 'Landing',
              description: 'Stick landing 2s; full foot on box'
            }
          ]
        },
        {
          name: 'Depth Step Rebound',
          duration: '8–10 min',
          description: 'Step off 6–8", instant rebound onto low box',
          battlePlan: '3 rounds\n• 3 Depth Step → Rebound to Box (low)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Light drop then quick up primes SSC timing',
          moodTips: [
            {
              icon: 'flash',
              title: 'Contact',
              description: 'Minimal ground contact; spring from ankles'
            },
            {
              icon: 'eye',
              title: 'Posture',
              description: 'Chest tall; eyes forward'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Box Jump Repeats',
          duration: '10–12 min',
          description: 'Crisp reps with short resets to keep outputs high',
          battlePlan: '4 rounds\n• 6–8 Box Jumps\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Repeated quality jumps build maintainable power',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Reset',
              description: 'Reset stance and breath each rep'
            },
            {
              icon: 'speedometer',
              title: 'Consistency',
              description: 'Match height and landing each time'
            }
          ]
        },
        {
          name: 'Weighted Step-Up Pops',
          duration: '10–12 min',
          description: 'DBs at sides; quick up; soft land on box',
          battlePlan: '4 rounds\n• 5 per leg Weighted Step-Up Pops\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Light load increases vertical power demands',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Weight Selection',
              description: 'Use light DBs (5–15 lb each); no arm yank'
            },
            {
              icon: 'body',
              title: 'Control',
              description: 'Control the step-down; posture tall'
            }
          ]
        },
        {
          name: 'Depth Drop Rebound',
          duration: '10–12 min',
          description: 'Drop, hold 1s, then quick rebound to box',
          battlePlan: '4 rounds\n• 3 Depth Drop (stick 1s) → Rebound to Box\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Eccentric control then reactive takeoff',
          moodTips: [
            {
              icon: 'body',
              title: 'Landing Position',
              description: 'Heels kiss; knees soft; hips back'
            },
            {
              icon: 'flash',
              title: 'Rebound Timing',
              description: 'Rebound immediately after stick'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Box Jumps',
          duration: '12–14 min',
          description: 'Light DBs or vest; jump to moderate-high box',
          battlePlan: '5 rounds\n• 6–8 Weighted Box Jumps\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Small load raises concentric demand safely',
          moodTips: [
            {
              icon: 'flash',
              title: 'Load Priority',
              description: 'Load stays light; prioritize speed'
            },
            {
              icon: 'footsteps',
              title: 'Landing Control',
              description: 'Land quiet; step down controlled'
            }
          ]
        },
        {
          name: 'Depth Drop Triple',
          duration: '12–14 min',
          description: 'Drop, floor rebound, then box; repeat quickly',
          battlePlan: '5 rounds\n• Triplet: 1 Depth Drop → 1 Floor Rebound → 1 Box Jump\n• Repeat 2 triplets/round (6 jumps)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Multi-contact series trains stiffness and RFD',
          moodTips: [
            {
              icon: 'flash',
              title: 'Contact Speed',
              description: 'Contacts fast; torso stable'
            },
            {
              icon: 'fitness',
              title: 'Arm Drive',
              description: 'Use arms aggressively on last jump'
            }
          ]
        },
        {
          name: 'Bounds + Weighted Finish',
          duration: '12–16 min',
          description: 'Rhythm jumps challenge endurance and posture',
          battlePlan: '4 rounds\n• 8–10 Continuous Box Bounds (no full reset)\n• Immediately 6 Weighted Step-Up Pops (3/leg)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Repeat jumps then loaded step-up pops to finish',
          moodTips: [
            {
              icon: 'basketball',
              title: 'Bounce Quality',
              description: 'Stay bouncy; mid-foot landings'
            },
            {
              icon: 'barbell',
              title: 'Finisher',
              description: 'Finisher: small DBs; crisp vertical intent'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Med Ball',
    icon: 'basketball',
    workouts: {
      beginner: [
        {
          name: 'Chest Pass to Wall',
          duration: '8–10 min',
          description: 'Step-throw; receive; repeat with quick cadence',
          battlePlan: '4 rounds\n• 8–10 Chest Passes (medium ball)\nRest 45–60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Linear force with easy catch-reset timing',
          moodTips: [
            {
              icon: 'walk',
              title: 'Throwing Form',
              description: 'Step into throw; snap wrists through'
            },
            {
              icon: 'hand-right',
              title: 'Catching',
              description: 'Catch softly; reset stance'
            }
          ]
        },
        {
          name: 'Overhead Slam',
          duration: '8–10 min',
          description: 'Tall reach to hard slam without spinal flexion',
          battlePlan: '3 rounds\n• 8–10 Overhead Slams\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Full-body slam builds basic power expression',
          moodTips: [
            {
              icon: 'body',
              title: 'Hip Hinge',
              description: 'Hinge hips; ribs down; slam straight'
            },
            {
              icon: 'hand-right',
              title: 'Ball Control',
              description: 'Follow ball down; re-grip quick'
            }
          ]
        },
        {
          name: 'Short Rotational Toss',
          duration: '8–10 min',
          description: 'Quick whip into wall with controlled rebound',
          battlePlan: '3 rounds\n• 6–8 per side Short Tosses\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Compact rotation trains hip-to-core linkage',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Foot Position',
              description: 'Rear foot pivots; hip leads torso'
            },
            {
              icon: 'swap-horizontal',
              title: 'Hip Drive',
              description: "Don't arm-throw; rotate hips first"
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Scoop Vertical Toss',
          duration: '10–12 min',
          description: 'Hinge load; triple-extend; toss up high',
          battlePlan: '4 rounds\n• 6–8 Vertical Scoop Tosses\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Hip extension velocity with ball release timing',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Ball Position',
              description: 'Long arms; keep ball close on load'
            },
            {
              icon: 'trending-up',
              title: 'Release',
              description: 'Finish tall; track and catch safely'
            }
          ]
        },
        {
          name: 'Full Rotational Throw',
          duration: '10–12 min',
          description: 'Hip turn to shoulder whip into firm wall',
          battlePlan: '4 rounds\n• 6–8 per side Rotational Throws\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Greater ROM increases side power output',
          moodTips: [
            {
              icon: 'swap-horizontal',
              title: 'Hip Rotation',
              description: 'Load back hip; rotate through front foot'
            },
            {
              icon: 'refresh',
              title: 'Reset',
              description: 'Catch; quick reset to stance'
            }
          ]
        },
        {
          name: 'Slam + Quick Pick',
          duration: '10–12 min',
          description: 'Slam then immediate scoop to next slam',
          battlePlan: '4 rounds\n• 8–10 Overhead Slams\n• 8–10 Fast Scoop Resets\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Rapid reset improves repeat power production',
          moodTips: [
            {
              icon: 'body',
              title: 'Spine Position',
              description: 'Keep spine neutral; hinge; reload fast'
            },
            {
              icon: 'speedometer',
              title: 'Consistency',
              description: 'Same slam height every rep'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Counter-Rotation Heave',
          duration: '12–14 min',
          description: 'Stretch away; fast unwind; big lateral heave',
          battlePlan: '4 rounds\n• 5–6 per side Heaves (mark distance)\nRest 90–120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Preload opposite, then explosive side release',
          moodTips: [
            {
              icon: 'swap-horizontal',
              title: 'Preload',
              description: 'Preload trunk opposite direction'
            },
            {
              icon: 'body',
              title: 'Follow Through',
              description: 'Full follow-through; stick stance'
            }
          ]
        },
        {
          name: 'Slam Cluster Density',
          duration: '12–14 min',
          description: 'Small groups with brief in-cluster rests',
          battlePlan: '4 rounds\n• Cluster: 4 Slams, 12s rest, 4 Slams\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Cluster bursts sustain max output quality',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Output Quality',
              description: 'Match slam speed/height across reps'
            },
            {
              icon: 'leaf',
              title: 'Brief Rest',
              description: 'Two deep breaths between clusters'
            }
          ]
        },
        {
          name: 'Rotational Heave + Stick',
          duration: '12–16 min',
          description: 'Big heave to distance; freeze posture at end',
          battlePlan: '5 rounds\n• 4–5 per side Heave + Stick (mark best)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Max side power plus decel control on finish',
          moodTips: [
            {
              icon: 'swap-horizontal',
              title: 'Movement Chain',
              description: 'Hip leads; trunk follows; arm last'
            },
            {
              icon: 'checkmark',
              title: 'Finish Position',
              description: 'Stick finish: hips square; eyes level'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Sled',
    icon: 'car-sport',
    workouts: {
      beginner: [
        {
          name: 'Push Starts',
          duration: '8–10 min',
          description: 'Short 8–10m drives with tall, stiff core',
          battlePlan: '4 rounds\n• 8–10m Sled Push (light)\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Teaches angle, stride, and initial acceleration',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Body Angle',
              description: '45° lean; arms pump big'
            },
            {
              icon: 'footsteps',
              title: 'Foot Strike',
              description: 'Punch ground back under hips'
            }
          ]
        },
        {
          name: 'Backward Drags',
          duration: '8–10 min',
          description: 'Quick steps back with tall posture and tension',
          battlePlan: '3 rounds\n• 12–15m Backward Drag (light)\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Quad-dominant decel and knee drive patterning',
          moodTips: [
            {
              icon: 'body',
              title: 'Posture',
              description: 'Chest high; small quick steps'
            },
            {
              icon: 'remove',
              title: 'Strap Tension',
              description: 'Keep straps taut; even tempo'
            }
          ]
        },
        {
          name: 'Push Turn Pull',
          duration: '8–10 min',
          description: 'Smooth 180 turn; re-set lean; continue drive',
          battlePlan: '3 rounds\n• 10m Push → 10m Pull (harness or rope)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Direction changes improve re-acceleration skill',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Turn Technique',
              description: 'Plant on balls; pivot smoothly'
            },
            {
              icon: 'eye',
              title: 'Re-acceleration',
              description: 'Re-lean instantly; eyes forward'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Sprint Push Repeats',
          duration: '10–12 min',
          description: 'High-quality efforts with measured rest',
          battlePlan: '5 rounds\n• 12–15m Sprint Push (light-moderate)\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Repeated 12–15m drives build acceleration rate',
          moodTips: [
            {
              icon: 'flash',
              title: 'First Steps',
              description: 'Violent first 5 steps'
            },
            {
              icon: 'speedometer',
              title: 'Cadence',
              description: 'Low heel recovery; quick cadence'
            }
          ]
        },
        {
          name: 'Harness Pull Accels',
          duration: '10–12 min',
          description: 'Aggressive steps; constant rope tension forward',
          battlePlan: '4 rounds\n• 20–25m Harness Pull\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Horizontal pulling increases posterior drive',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Body Drive',
              description: 'Long pushes; maintain lean'
            },
            {
              icon: 'remove',
              title: 'Rope Tension',
              description: 'Keep rope taut; no stutter steps'
            }
          ]
        },
        {
          name: 'Push + Backward Drag',
          duration: '10–12 min',
          description: 'Balanced pattern for robust acceleration',
          battlePlan: '4 rounds\n• 15m Sprint Push\n• 15m Backward Drag\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Posterior then anterior chain contrast pairing',
          moodTips: [
            {
              icon: 'body',
              title: 'Core Stability',
              description: 'Brace trunk both directions'
            },
            {
              icon: 'refresh',
              title: 'Transition',
              description: 'Smooth transition at the turn'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wave Starts Cluster',
          duration: '12–16 min',
          description: 'Micro efforts with micro rest to hone output',
          battlePlan: '4 rounds\n• Cluster: 4 × 5m Sled Push, 15s between efforts\nRest 120s between clusters',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Multiple 5m bursts sharpen first-step power',
          moodTips: [
            {
              icon: 'flash',
              title: 'Start Position',
              description: 'Preload; big arm punch out'
            },
            {
              icon: 'body',
              title: 'Shin Angle',
              description: 'Keep shin angle set and stiff'
            }
          ]
        },
        {
          name: 'Push Pull Shuttle',
          duration: '12–16 min',
          description: 'Shuttle changes with quick re-acceleration',
          battlePlan: '5 rounds\n• 10m Push → 10m Pull → 10m Push\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Rapid transitions under load challenge agility',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Direction Change',
              description: 'Plant and pivot under control'
            },
            {
              icon: 'flash',
              title: 'Re-acceleration',
              description: 'Re-lean instantly; sprint-quality steps'
            }
          ]
        },
        {
          name: 'Flying 20s Contrast',
          duration: '12–16 min',
          description: 'Light push loads the pattern, then sprint free',
          battlePlan: '5 rounds\n• 15m Sled Push (light)\n• 20–25m Free Sprint\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Sled priming then free sprint to express speed',
          moodTips: [
            {
              icon: 'car-sport',
              title: 'Sled Phase',
              description: 'Sled: smooth, powerful steps'
            },
            {
              icon: 'walk',
              title: 'Sprint Phase',
              description: 'Sprint: tall, relaxed, fast turnover'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettle Bell',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'KB Swing Hip Snap',
          duration: '8–10 min',
          description: 'Float bell; arms are hooks; hips drive',
          battlePlan: '4 rounds\n• 12–15 Swings\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Teaches hinge timing and hip extension velocity',
          moodTips: [
            {
              icon: 'body',
              title: 'Hip Hinge',
              description: 'Hinge; shins near vertical'
            },
            {
              icon: 'flash',
              title: 'Hip Snap',
              description: 'Snap hips; bell floats to chest'
            }
          ]
        },
        {
          name: 'Dead-Start Swings',
          duration: '8–10 min',
          description: 'Hike-pass start; stand tall with fast hips',
          battlePlan: '3 rounds\n• 6 × 2 Dead-Start Swings\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Reset each rep to reinforce crisp power',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Start Position',
              description: 'Hike deep; lats engaged'
            },
            {
              icon: 'trending-up',
              title: 'Hip Extension',
              description: 'Stand hard; stop at chest height'
            }
          ]
        },
        {
          name: 'KB Clean',
          duration: '8–10 min',
          description: 'Tame arc; quiet catch in front rack',
          battlePlan: '3 rounds\n• 6 per side Cleans\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clean teaches path, rack, and hip pop timing',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Bell Path',
              description: 'Zip bell close; rotate around forearm'
            },
            {
              icon: 'flash',
              title: 'Hip Pop',
              description: "Don't curl; pop hips then rack"
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'KB Swing EMOM',
          duration: '10–12 min',
          description: 'Short bursts on the minute maintain quality',
          battlePlan: 'EMOM 10 min\n• 12 Swings each minute',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Repeated sets sharpen sustainable power rhythm',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Bell Path',
              description: 'Same bell path; neutral neck'
            },
            {
              icon: 'flash',
              title: 'Hip Drive',
              description: 'Grip relaxed; hips drive'
            }
          ]
        },
        {
          name: 'Clean to Squat Chain',
          duration: '10–12 min',
          description: 'Pop to rack; descend fast; stand explosively',
          battlePlan: '4 rounds\n• 5 per side Clean → Squat (alt)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clean then front squat builds full-chain power',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Rack Position',
              description: 'Rack tight; elbows in'
            },
            {
              icon: 'trending-up',
              title: 'Squat Drive',
              description: 'Drive hard out of bottom'
            }
          ]
        },
        {
          name: 'KB Snatch',
          duration: '10–12 min',
          description: 'Punch through at top; smooth turnover',
          battlePlan: '4 rounds\n• 6 per side Snatches\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Overhead power with crisp hip snap and pull',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull Path',
              description: 'High pull path; punch through'
            },
            {
              icon: 'flash',
              title: 'Hip Snap',
              description: 'Hinge load; snap tall'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Two-Hand Swings',
          duration: '12–14 min',
          description: 'Big hip snap while controlling arc and posture',
          battlePlan: '5 rounds\n• 12 Heavy Swings\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Heavier bell raises output per repetition',
          moodTips: [
            {
              icon: 'body',
              title: 'Posture',
              description: 'Lats down; ribs stacked'
            },
            {
              icon: 'fitness',
              title: 'Bell Control',
              description: 'No overpull; bell floats'
            }
          ]
        },
        {
          name: 'Clean to Press Ladder',
          duration: '12–16 min',
          description: 'Clean to rack; strict press; alternate sides',
          battlePlan: '4 rounds\n• Ladder per side: 3-2-1 Clean + Press\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Force production into vertical press expression',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Rack Position',
              description: 'Rack tight; glutes squeezed'
            },
            {
              icon: 'trending-up',
              title: 'Press Path',
              description: 'Press vertical; biceps by ear'
            }
          ]
        },
        {
          name: 'Snatch + Broad Jump',
          duration: '12–16 min',
          description: 'Snatch reps then stick broad jumps',
          battlePlan: '4 rounds\n• 8 per side Snatches\n• 3 Broad Jumps (stick 2s)\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Overhead power potentiates horizontal jumping',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Lockout',
              description: 'Lockout stacked; quick down'
            },
            {
              icon: 'walk',
              title: 'Broad Jump',
              description: 'Broad jump: big arm swing'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Sand Bag',
    icon: 'bag',
    workouts: {
      beginner: [
        {
          name: 'SB Shouldering',
          duration: '8–10 min',
          description: 'Scoop close; hip pop to shoulder; stand tall',
          battlePlan: '3 rounds\n• 5 per side Shouldering (alt)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ground-to-shoulder teaches triple extension',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Grip Position',
              description: 'Hands under/around midline; hug bag close'
            },
            {
              icon: 'trending-up',
              title: 'Hip Pop',
              description: 'Pop hips; shrug and roll to shoulder, elbow high'
            }
          ]
        },
        {
          name: 'Sandbag Clean',
          duration: '8–10 min',
          description: 'From floor to front rack; quick elbows up',
          battlePlan: '3 rounds\n• 6–8 Cleans\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clean path trains fast turnover and catch',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Grip',
              description: 'Grip neutral under seams'
            },
            {
              icon: 'fitness',
              title: 'Catch Position',
              description: 'Drive hips; catch high on forearms'
            }
          ]
        },
        {
          name: 'Short Heave Toss',
          duration: '8–10 min',
          description: 'Hinge load; heave 2–4m; chase and reset',
          battlePlan: '4 rounds\n• 4 Heaves (mark distance)\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Release timing and safe landing control',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Bag Position',
              description: 'Hands under edge; bag close on load'
            },
            {
              icon: 'trending-up',
              title: 'Release Timing',
              description: 'Release on rise; follow through'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Alt Shoulders Volume',
          duration: '10–12 min',
          description: 'Switch shoulders every rep; tight holds',
          battlePlan: '4 rounds\n• 6 per side Shouldering (alt)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Repeated power outputs with symmetry focus',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Shoulder Position',
              description: 'Elbow high; forearm vertical on catch'
            },
            {
              icon: 'bag',
              title: 'Bag Control',
              description: "Keep bag snug; don't let it swing out"
            }
          ]
        },
        {
          name: 'Clean to Jump Squat',
          duration: '10–12 min',
          description: 'Clean, drop bag, quick bodyweight jump',
          battlePlan: '4 rounds\n• 5 Cleans\n• 4 Jump Squats\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clean primes vertical drive for jump power',
          moodTips: [
            {
              icon: 'bag',
              title: 'Bag Safety',
              description: 'Clean crisp; set bag safely before jump'
            },
            {
              icon: 'walk',
              title: 'Jump Quality',
              description: 'Jump small amplitude; land softly'
            }
          ]
        },
        {
          name: 'Lateral Toss',
          duration: '10–12 min',
          description: 'Pivot feet; drive hips; release across body',
          battlePlan: '4 rounds\n• 5 per side Tosses (mark distance)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Frontal-plane power with hip-led rotation',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Grip Position',
              description: 'Hands under corners; chest up'
            },
            {
              icon: 'swap-horizontal',
              title: 'Hip Drive',
              description: "Follow through; don't arm-throw"
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Clean to Thruster',
          duration: '12–16 min',
          description: 'Front rack drop; explode to press; crisp lockout',
          battlePlan: '5 rounds\n• 4 Clean → Thrusters\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clean then fast overhead drive full-chain output',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Front Rack',
              description: 'Elbows up; brace hard'
            },
            {
              icon: 'trending-up',
              title: 'Drive Sequence',
              description: 'Drive legs then arms; head through'
            }
          ]
        },
        {
          name: 'Bear-Hug Loaded Jumps',
          duration: '12–14 min',
          description: 'Hug bag; small reactive jumps; quiet landings',
          battlePlan: '5 rounds\n• 6–8 Loaded Jumps\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Light load adds instability to vertical power',
          moodTips: [
            {
              icon: 'bag',
              title: 'Bag Position',
              description: 'Squeeze bag tight to torso'
            },
            {
              icon: 'walk',
              title: 'Jump Quality',
              description: 'Quick contacts; mid-foot land'
            }
          ]
        },
        {
          name: 'Heave for Distance',
          duration: '12–16 min',
          description: 'Big hinge preload; snap tall; launch to ~45°',
          battlePlan: '5 rounds\n• 3–4 Heaves (measure best)\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Max distance throws test timing and intent',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Loading Position',
              description: 'Hands under lip; bag close on swing'
            },
            {
              icon: 'trending-up',
              title: 'Release Angle',
              description: 'Release on upward path; chase safely'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Body Weight Only',
    icon: 'body',
    workouts: {
      beginner: [
        {
          name: 'Split Squat Jumps',
          duration: '8–10 min',
          description: 'Small amplitude switches with quiet, aligned landings',
          battlePlan: '3 rounds\n• 6–8 per side Split Jumps\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Teaches switching with reduced ground shock',
          moodTips: [
            {
              icon: 'walk',
              title: 'Switch Mechanics',
              description: 'Switch mid-air; keep torso tall'
            },
            {
              icon: 'footsteps',
              title: 'Landing',
              description: 'Knees track; land softly'
            }
          ]
        },
        {
          name: 'Squat Pop Stick',
          duration: '8–10 min',
          description: 'Pop up, hold 2s, stand tall, repeat cleanly',
          battlePlan: '3 rounds\n• 6–8 Squat Pops (stick 2s)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Small pop with rigid stick improves deceleration',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Jump Height',
              description: 'Minimal air; focus on stick'
            },
            {
              icon: 'body',
              title: 'Landing Position',
              description: 'Heels kiss; hips back on land'
            }
          ]
        },
        {
          name: 'Skater Bounds',
          duration: '8–10 min',
          description: 'Bound side-to-side and hold position',
          battlePlan: '3 rounds\n• 6–8 per side Skater Bounds (stick 1–2s)\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Lateral hops teach frontal-plane control',
          moodTips: [
            {
              icon: 'swap-horizontal',
              title: 'Lateral Movement',
              description: 'Push sideways; stick knee over toes'
            },
            {
              icon: 'body',
              title: 'Body Position',
              description: 'Hips low; torso quiet'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Burpees',
          duration: '10–12 min',
          description: 'Plank clean; snap feet in; vertical jump high',
          battlePlan: '4 rounds\n• 10–12 Burpees\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ground-to-air cycle with fast transitions',
          moodTips: [
            {
              icon: 'body',
              title: 'Plank Quality',
              description: 'Solid plank; no sag'
            },
            {
              icon: 'walk',
              title: 'Jump Quality',
              description: 'Jump tall; soft land'
            }
          ]
        },
        {
          name: 'Broad Jumps',
          duration: '10–12 min',
          description: 'Max distance with stable landing mechanics',
          battlePlan: '4 rounds\n• 5–6 Broad Jumps (stick 2s)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Horizontal displacement builds hip drive',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Loading',
              description: 'Big arm swing; hinge load'
            },
            {
              icon: 'checkmark',
              title: 'Landing Control',
              description: 'Stick 2s; measure strides'
            }
          ]
        },
        {
          name: 'Reactive Pogos',
          duration: '10–12 min',
          description: 'Bouncy hops; minimal contact; even rhythm',
          battlePlan: '4 rounds\n• 20s Pogos\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ankle stiffness and fast ground contacts',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Contact Quality',
              description: 'Mid-foot spring; quiet feet'
            },
            {
              icon: 'body',
              title: 'Body Position',
              description: 'Knees soft; ribs stacked'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Depth Jump to Broad',
          duration: '12–16 min',
          description: 'Off box to floor, instant max broad jump',
          battlePlan: '5 rounds\n• Cluster: 1 Depth Jump → 1 Broad Jump, 20s rest, repeat once (2 pairings)\nRest 120s between clusters',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Shock load then horizontal explosion',
          moodTips: [
            {
              icon: 'flash',
              title: 'Contact Speed',
              description: 'Fast contact; no pause'
            },
            {
              icon: 'walk',
              title: 'Jump Quality',
              description: 'Arms swing; land soft'
            }
          ]
        },
        {
          name: 'Split Squat Jump Repeats',
          duration: '12–14 min',
          description: 'High tempo; consistent height; quiet landings',
          battlePlan: '5 rounds\n• 10–12 per side Split Jumps\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Repeated switches challenge elastic stiffness',
          moodTips: [
            {
              icon: 'flash',
              title: 'Switch Speed',
              description: "Switch fast; hips don't collapse"
            },
            {
              icon: 'speedometer',
              title: 'Rhythm',
              description: 'Keep rhythm; posture tall'
            }
          ]
        },
        {
          name: 'Burpee Broad Jump',
          duration: '12–16 min',
          description: 'Burpee pop straight into long broad jump',
          battlePlan: '5 rounds\n• 5 Burpee → Broad Jump\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combined ground-to-air and horizontal power',
          moodTips: [
            {
              icon: 'body',
              title: 'Plank Quality',
              description: 'Strong plank; snap in'
            },
            {
              icon: 'trending-up',
              title: 'Transition',
              description: 'Explode forward decisively'
            }
          ]
        }
      ]
    }
  }
];

export default function BodyweightExplosivenessWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Parse URL parameters
  const rawMoodTitle = params.mood as string || 'Build Explosive';
  // Convert "I want to build explosiveness" to "Build Explosive" for display
  const moodTitle = rawMoodTitle.toLowerCase().includes('explosiveness') ? 'Build Explosive' : rawMoodTitle;
  const workoutType = params.workoutType as string || 'Body Weight';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';

  // Decode equipment names
  const selectedEquipmentNames = equipmentParam ? 
    decodeURIComponent(equipmentParam).split(',').map(name => name.trim()) : [];

  console.log('Bodyweight Explosiveness Debug:', {
    selectedEquipmentNames,
    difficulty,
    workoutType,
    moodTitle
  });

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
          battlePlan: workout.battlePlan || '',
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

  // Create progress bar - single row with requested order
  const createProgressRows = () => {
    const steps = [
      { key: 'mood', icon: 'flash', text: moodTitle },
      { key: 'bodyPart', icon: 'body', text: workoutType },
      { key: 'difficulty', icon: 'speedometer', text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `${selectedEquipmentNames.length} Equipment` },
    ];

    // Return single row
    return [steps];
  };

  // Workout Card Component matching I want to sweat format
  const WorkoutCard = ({ equipment, icon, workouts, difficulty }: { 
    equipment: string; 
    icon: keyof typeof Ionicons.glyphMap; 
    workouts: Workout[]; 
    difficulty: string;
  }) => {
    const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

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
              <Text style={styles.difficultyBadgeText}>{difficulty.toUpperCase()}</Text>
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
            onPress={() => handleStartWorkout(item, equipment, difficulty)}
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

    const minSwipeDistance = 50;

    const onTouchStart = (e: any) => {
      setTouchEnd(null);
      setTouchStart(e.nativeEvent.touches[0].clientX);
    };

    const onTouchMove = (e: any) => {
      setTouchEnd(e.nativeEvent.touches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe && currentWorkoutIndex < workouts.length - 1) {
        setCurrentWorkoutIndex(currentWorkoutIndex + 1);
      }
      if (isRightSwipe && currentWorkoutIndex > 0) {
        setCurrentWorkoutIndex(currentWorkoutIndex - 1);
      }
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

        {/* Workout List with Touch Swiping */}
        <View 
          style={[styles.workoutList, { height: 420 }]}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <FlatList
            ref={flatListRef}
            data={workouts}
            renderItem={renderWorkout}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideSize = width - 48;
              const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
              setCurrentWorkoutIndex(index);
            }}
            initialScrollIndex={currentWorkoutIndex}
            getItemLayout={(data, index) => ({
              length: width - 48,
              offset: (width - 48) * index,
              index,
            })}
            keyExtractor={(item, index) => `${equipment}-${item.name}-${index}`}
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
                  styles.dot,
                  currentWorkoutIndex === index && styles.activeDot,
                ]}
                onPress={() => {
                  setCurrentWorkoutIndex(index);
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                }}
              />
            ))}
          </View>
        </View>
      </View>
    );
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* No Workouts Message */}
        {uniqueUserWorkouts.length === 0 && (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="fitness-outline" size={64} color="rgba(255, 215, 0, 0.3)" />
            <Text style={styles.noWorkoutsTitle}>No Workouts Available</Text>
            <Text style={styles.noWorkoutsText}>
              We couldn't find workouts for the selected equipment. Please go back and select different equipment.
            </Text>
            <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
              <Text style={styles.goBackButtonText}>Select Equipment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Workout Cards */}
        {uniqueUserWorkouts.map((workoutItem) => {
          const workoutsForDifficulty = workoutItem.workouts[difficulty as keyof typeof workoutItem.workouts] || [];
          
          return (
            <WorkoutCard
              key={workoutItem.equipment}
              equipment={workoutItem.equipment}
              icon={workoutItem.icon}
              workouts={workoutsForDifficulty}
              difficulty={difficulty}
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
    gap: 8,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 60,
  },
  progressStepActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 60,
  },
  progressConnector: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
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
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 24,
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
    zIndex: 10,
  },
  swipeText: {
    fontSize: 11,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '600',
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
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 6,
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
    color: '#000000',
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
  },
  workoutDescriptionContainer: {
    flex: 1,
    maxHeight: 80,
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
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
    marginTop: 8,
    marginBottom: 12,
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
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  noWorkoutsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  goBackButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  goBackButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});