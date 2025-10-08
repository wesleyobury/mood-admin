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

// Weight-based workout database
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Power Lifting Platform',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Speed Back Squat',
          duration: '8–10 min',
          description: 'Light bar, fast down/up; stick tall finish each repetition.',
          battlePlan: '4 rounds\n• 3 × 3 Speed Squats (40–50% 1RM)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Light load teaches proper speed patterns with safe range.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Speed Focus',
              description: 'Focus on fast concentric; control eccentric descent'
            },
            {
              icon: 'body',
              title: 'Form Check',
              description: 'Keep knees tracking; chest up; drive through heels'
            }
          ]
        },
        {
          name: 'Push Press',
          duration: '8–10 min',
          description: 'Short dip, explosive drive, clean overhead lockout finish.',
          battlePlan: '4 rounds\n• 4–5 Push Press (light–moderate)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dip-drive sequence develops timing and vertical power safely.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Dip Technique',
              description: 'Shallow dip; keep torso vertical; elbows slightly forward'
            },
            {
              icon: 'trending-up',
              title: 'Press Drive',
              description: 'Drive hard through legs; punch bar overhead; lock out'
            }
          ]
        },
        {
          name: 'Speed Deadlift',
          duration: '8–10 min',
          description: 'Fast pulls with control; smooth lockout; reset each rep.',
          battlePlan: '4 rounds\n• 3 × 2 Speed Pulls (50–60% 1RM)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Moderate load maintains speed while building pulling power.',
          moodTips: [
            {
              icon: 'body',
              title: 'Setup Position',
              description: 'Tight lats; neutral spine; feet under hips; grip firm'
            },
            {
              icon: 'flash',
              title: 'Pull Speed',
              description: 'Drive legs; hips through; stand tall; reset between reps'
            }
          ]
        },
        {
          name: 'Box Jump to Platform',
          duration: '8–10 min',
          description: 'Measured jumps to stable platform; soft stick; step down.',
          battlePlan: '4 rounds\n• 5 × 2 Box Jumps (knee-height box)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Platform height challenges vertical projection with safe landing.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Jump Form',
              description: 'Arms swing up; land soft; hold position 1-2 seconds'
            },
            {
              icon: 'walk',
              title: 'Step Down',
              description: 'Always step down; never jump down; reset fully'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Clean',
          duration: '10–12 min',
          description: 'Fast pull to rack position; soft catch; stand tall finish.',
          battlePlan: '5 rounds\n• 3 × 2 Power Clean (60–70% 1RM)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Triple extension develops full-body explosive coordination.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull Timing',
              description: 'First pull slow; second pull explosive; turnover fast'
            },
            {
              icon: 'hand-right',
              title: 'Catch Position',
              description: 'Elbows up; soft catch; stand immediately; control down'
            }
          ]
        },
        {
          name: 'Push Jerk',
          duration: '10–12 min',
          description: 'Dip-drive-split; stable overhead catch; recover to standing.',
          battlePlan: '5 rounds\n• 3–4 Push Jerk (moderate)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Overhead power expression under moderate loading conditions.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Split Landing',
              description: 'Balanced split; front shin vertical; back leg support'
            },
            {
              icon: 'checkmark',
              title: 'Recovery',
              description: 'Front foot back first; then rear foot; stand tall'
            }
          ]
        },
        {
          name: 'Speed Squat Waves',
          duration: '10–12 min',
          description: 'Wave loading 5-4-3 reps; maintain bar speed each set.',
          battlePlan: '3 waves\n• 5-4-3 Speed Squats (build load)\nRest 90s between waves',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive loading while preserving speed-strength qualities.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Speed Maintenance',
              description: 'Same tempo each wave; prioritize speed over load'
            },
            {
              icon: 'trending-up',
              title: 'Wave Progression',
              description: 'Increase load slightly each wave; watch bar speed'
            }
          ]
        },
        {
          name: 'Broad Jump + Sprint',
          duration: '10–12 min',
          description: 'Max broad jump; stick 2 seconds; immediate 20m sprint.',
          battlePlan: '4 rounds\n• 2 Broad Jumps + 20m Sprint\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Horizontal power primes sprint acceleration mechanics.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Jump Distance',
              description: 'Big arm swing; drive horizontal; measure distance'
            },
            {
              icon: 'walk',
              title: 'Sprint Transition',
              description: 'Quick transition; forward body lean; fast turnover'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Power Clean',
          duration: '12–14 min',
          description: 'Singles at 75-85% with crisp turnover and stable catches.',
          battlePlan: '6 rounds\n• 1 Power Clean (75–85% 1RM)\nRest 180s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Near-maximal loads test speed-strength under fatigue.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Max Intent',
              description: 'Every rep maximal speed; perfect technique only'
            },
            {
              icon: 'leaf',
              title: 'Recovery',
              description: 'Full rest between singles; reset completely'
            }
          ]
        },
        {
          name: 'Split Jerk Complex',
          duration: '12–16 min',
          description: 'Clean + Front Squat + Split Jerk; seamless transitions.',
          battlePlan: '5 rounds\n• 1 Clean + 1 Front Squat + 1 Split Jerk\nRest 180s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Complex challenges technical execution under compound fatigue.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Smooth Transition',
              description: 'No pauses between movements; fluid sequence'
            },
            {
              icon: 'checkmark',
              title: 'Position Control',
              description: 'Perfect positions each phase; quality over speed'
            }
          ]
        },
        {
          name: 'Speed Deadlift Clusters',
          duration: '12–16 min',
          description: 'Cluster sets 3+3 with 10s rest; maintain pull speed.',
          battlePlan: '5 rounds\n• Cluster: 3 + 3 Speed Pulls (65–70%)\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Cluster method preserves speed under higher volume density.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Speed Priority',
              description: 'Same speed both clusters; reduce load if speed drops'
            },
            {
              icon: 'leaf',
              title: 'Micro Rest',
              description: '10 seconds between clusters; breathe and reset'
            }
          ]
        },
        {
          name: 'Reactive Box Jump Series',
          duration: '12–16 min',
          description: 'Drop jump + immediate box jump; reactive power expression.',
          battlePlan: '4 rounds\n• 3 Drop Jump → Box Jump\nRest 180s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Reactive jumps maximize elastic energy utilization patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Reactive Speed',
              description: 'Minimal ground contact; explosive rebound'
            },
            {
              icon: 'fitness',
              title: 'Box Landing',
              description: 'Soft box landing; step down; reset for next rep'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Landmine Attachment',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Landmine Split Jerk Pop',
          duration: '8–10 min',
          description: 'Small dip to forceful drive; soft balanced split; one-second hold.',
          battlePlan: '3 rounds\n• 4 per side Split Jerk Pops\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Angled path teaches leg drive and stable split catch safely.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Split Stance',
              description: 'Front foot forward; rear ball; torso tall and braced'
            },
            {
              icon: 'trending-down',
              title: 'Dip Drive',
              description: 'Dip vertical; punch under; freeze one second before recover'
            }
          ]
        },
        {
          name: 'Landmine Squat Jump Press',
          duration: '8–10 min',
          description: 'Shallow squat pop; guide sleeve overhead along smooth arc.',
          battlePlan: '3 rounds\n• 6 × Squat Jump → Press\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Triple extend into press develops seamless force transfer.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Hand Position',
              description: 'Two hands on sleeve; elbows in; ribs down'
            },
            {
              icon: 'fitness',
              title: 'Jump Press',
              description: 'Jump small; press on rise; stick land quietly'
            }
          ]
        },
        {
          name: 'Rotational Landmine Toss',
          duration: '8–10 min',
          description: 'Pivot feet, drive hips, release forward-up with tight control.',
          battlePlan: '3 rounds\n• 6 per side Rotational Tosses\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Hip-led rotation builds lateral power with controlled arc.',
          moodTips: [
            {
              icon: 'swap-horizontal',
              title: 'Hip Drive',
              description: 'Back foot pivots; hips lead; arms guide the path'
            },
            {
              icon: 'body',
              title: 'Control',
              description: 'Keep arc tight; avoid trunk over-rotation; reset stance'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Landmine Push Press',
          duration: '10–12 min',
          description: 'Quick shallow dip, violent drive, clean angled lockout finish.',
          battlePlan: '4 rounds\n• 5–6 Push Press per side (alternate or sets)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dip-drive timing converts leg force to fast overhead speed.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Dip Position',
              description: 'Dip 2–3"; ribs down; knees track; heels grounded'
            },
            {
              icon: 'trending-up',
              title: 'Drive Path',
              description: 'Guide arc; avoid early press-out; own lockout position'
            }
          ]
        },
        {
          name: 'Split Stance Rotation Punch',
          duration: '10–12 min',
          description: 'Load back hip; rotate through; punch sleeve up powerfully.',
          battlePlan: '4 rounds\n• 5 per side Rotation Punch\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Staggered base enhances hip-to-core transfer and speed.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Split Position',
              description: 'Front foot planted; rear heel high; brace ribs'
            },
            {
              icon: 'body',
              title: 'Hip Lead',
              description: 'Hips lead; finish stacked; reset stance between reps'
            }
          ]
        },
        {
          name: 'Hack Squat Jump (Landmine)',
          duration: '10–12 min',
          description: 'Hands low on sleeve; small pop; quiet stick; deliberate reset.',
          battlePlan: '4 rounds\n• 5 × 3 Hack Squat Jumps\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Supported angle reinforces vertical pop with safe landings.',
          moodTips: [
            {
              icon: 'body',
              title: 'Body Position',
              description: 'Torso tall; slight quad sit; heels down on dip'
            },
            {
              icon: 'fitness',
              title: 'Jump Control',
              description: 'Pop straight; elbows soft; absorb softly and reset'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Triple Extension Heave',
          duration: '12–14 min',
          description: 'Dip-drive hard; guide sleeve high and far with full control.',
          battlePlan: '5 rounds\n• 4 Heaves (build load across rounds)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Heavy leg drive expresses long-arc power safely overhead.',
          moodTips: [
            {
              icon: 'body',
              title: 'Extension',
              description: 'Brace; heels down then extend to toes'
            },
            {
              icon: 'trending-up',
              title: 'Follow Through',
              description: 'Hips finish before arms; follow arc; stable stance'
            }
          ]
        },
        {
          name: 'Landmine Split Jerk Ladder',
          duration: '12–16 min',
          description: 'Perform 3-2-1 per side; crisp catches and clean recoveries.',
          battlePlan: '4 rounds\n• Ladder per side: 3-2-1 Split Jerks\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Volume ladder sustains speed-strength under fatigue safely.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Consistency',
              description: 'Same dip depth; balanced split; trunk stable'
            },
            {
              icon: 'refresh',
              title: 'Recovery',
              description: 'Recover feet in order; reset grip between sets'
            }
          ]
        },
        {
          name: 'Rotational Punch + Bound',
          duration: '12–16 min',
          description: 'Hard landmine punch; then long skater bound with firm hold.',
          battlePlan: '4 rounds\n• 5 per side Rotation Punch\n• 3 per side Skater Bounds (stick 1–2s)\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Rotation power primes lateral projection and landing stick.',
          moodTips: [
            {
              icon: 'swap-horizontal',
              title: 'Punch Form',
              description: 'Punch: hips rotate first; ribs stacked; eyes forward'
            },
            {
              icon: 'walk',
              title: 'Bound Landing',
              description: 'Bound: push sideways; land mid-foot; hold one to two seconds'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'DB Jump Squat Stick',
          duration: '8–10 min',
          description: 'Small vertical pop; soft stick; reset tall posture each rep.',
          battlePlan: '3 rounds\n• 5 × 3 Jump Squats (light)\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Light DBs add load while protecting landing and posture.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'DB Position',
              description: 'DBs at sides; shoulders low; eyes forward'
            },
            {
              icon: 'footsteps',
              title: 'Landing',
              description: 'Land quiet mid-foot; reset stance before next rep'
            }
          ]
        },
        {
          name: 'DB Push Press',
          duration: '8–10 min',
          description: 'Quick dip, violent punch, smooth stacked lockout overhead.',
          battlePlan: '3 rounds\n• 5–6 Push Press\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dip-drive coordination turns leg force into press speed.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Dip Form',
              description: 'Dip vertical; heels down; elbows slightly forward'
            },
            {
              icon: 'trending-up',
              title: 'Press Control',
              description: 'Drive hard; finish stacked; control descent to rack'
            }
          ]
        },
        {
          name: 'DB Split Jump Switch',
          duration: '8–10 min',
          description: 'Low-amplitude switches; aligned, quiet landings every time.',
          battlePlan: '3 rounds\n• 6 per side Split Jumps\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Small load refines switching mechanics and stiffness safely.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'DB Control',
              description: 'DBs by sides; torso tall; ribs down; arms quiet'
            },
            {
              icon: 'flash',
              title: 'Switch Form',
              description: 'Switch mid-air; knees track; stick softly, then reset'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'DB Snatch Alternating',
          duration: '10–12 min',
          description: 'Zip bell close; punch through; alternate sides smoothly.',
          battlePlan: '4 rounds\n• 6 per side Alternating Snatch\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Hip snap to overhead hones turnover speed and control.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Snatch Path',
              description: 'Hinge load; elbow high then punch; tame arc'
            },
            {
              icon: 'swap-horizontal',
              title: 'Switch Sides',
              description: 'Control down path; switch on floor or at rack'
            }
          ]
        },
        {
          name: 'DB Clean to Push Press',
          duration: '10–12 min',
          description: 'Fast clean to shoulders; short dip; explosive overhead finish.',
          battlePlan: '4 rounds\n• 5 Clean → Push Press\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clean primes rack; push press expresses vertical power.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Clean Form',
              description: 'Clean close; avoid curl; elbows slightly forward'
            },
            {
              icon: 'trending-up',
              title: 'Press Drive',
              description: 'Dip small; drive hard; stand tall with ribs stacked'
            }
          ]
        },
        {
          name: 'DB Broad Jump Carry',
          duration: '10–12 min',
          description: 'Two broad jumps; grab DBs; fast upright ten-meter carry.',
          battlePlan: '4 rounds\n• 2 Broad Jumps (stick) → 10m Farmer Carry\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Jumps then loaded carry train projection and bracing.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Jump Form',
              description: 'Jumps: big arms; stick one to two seconds; measure'
            },
            {
              icon: 'walk',
              title: 'Carry Form',
              description: 'Carry: posture tall; short, fast steps; firm grip'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'DB Jump Squat Clusters',
          duration: '12–14 min',
          description: 'Three reps, quick rest, three more; match jump heights.',
          battlePlan: '5 rounds\n• Cluster: 3 + 3 Jump Squats (10–12s between)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Cluster density preserves peak speed under fatigue load.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Consistency',
              description: 'Same dip depth; elbows quiet; eyes forward'
            },
            {
              icon: 'leaf',
              title: 'Rest Timing',
              description: 'Land soft; breathe quickly; time micro-rests precisely'
            }
          ]
        },
        {
          name: 'DB Snatch + Bound Contrast',
          duration: '12–16 min',
          description: 'Snatch sets then skater bounds with firm two-second stick.',
          battlePlan: '4 rounds\n• 6 per side DB Snatch\n• 3 per side Skater Bounds (stick 2s)\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Overhead power potentiates lateral projection capacity.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Snatch Form',
              description: 'Snatch: punch tall; smooth down; avoid elbow flare'
            },
            {
              icon: 'walk',
              title: 'Bound Landing',
              description: 'Bound: push sideways; land mid-foot; hold two seconds'
            }
          ]
        },
        {
          name: 'Clean + Push Press Ladder',
          duration: '12–16 min',
          description: 'Perform 3-2-1 per side; crisp clean then vertical push press.',
          battlePlan: '4 rounds\n• Ladder per side: 3-2-1 Clean + Push Press\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ladder volume sustains speed-strength with rising density.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Clean Control',
              description: 'Clean close; no curl; rack quiet and tight'
            },
            {
              icon: 'trending-up',
              title: 'Press Power',
              description: 'Press vertical; ribs stacked; squeeze glutes to finish'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettlebells',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Two-Hand Swing Pop',
          duration: '8–10 min',
          description: 'Snap hips; bell floats to chest; arms act as relaxed hooks.',
          battlePlan: '4 rounds\n• 12–15 Swings\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Hinge rhythm trains hip extension speed and timing safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hip Hinge',
              description: 'Hinge; shins near vertical; lats down; neck neutral'
            },
            {
              icon: 'flash',
              title: 'Hip Snap',
              description: 'Snap hard; plank at top; avoid lifting with arms'
            }
          ]
        },
        {
          name: 'Dead-Start Clean',
          duration: '8–10 min',
          description: 'Hike-pass; pop to rack; soft catch; alternate sides smoothly.',
          battlePlan: '3 rounds\n• 5 per side Dead-Start Cleans\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Full reset engrains path, timing, and quiet turnover.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Clean Path',
              description: 'Thumb back; zip close; rotate around forearm to rack'
            },
            {
              icon: 'leaf',
              title: 'Reset',
              description: 'Pause fully; brace; sharp breath on each pop'
            }
          ]
        },
        {
          name: 'KB Push Press',
          duration: '8–10 min',
          description: 'Short dip; vertical punch; stacked finish; smooth controlled down.',
          battlePlan: '3 rounds\n• 6–8 per side Push Press\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Leg drive channels force into fast overhead lockout safely.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Dip Drive',
              description: 'Dip vertical; heels down; wrist straight under bell'
            },
            {
              icon: 'trending-up',
              title: 'Press Path',
              description: 'Punch through; biceps near ear; control to rack'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Hardstyle Swing EMOM',
          duration: '10–12 min',
          description: 'Sharp hip snaps each minute; crisp float to consistent chest.',
          battlePlan: 'EMOM 10 min\n• 12 Swings each minute',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'EMOM bursts sustain repeatable high-quality power output.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Breathing',
              description: 'Sharp exhales; plank at top; avoid overextension'
            },
            {
              icon: 'speedometer',
              title: 'Consistency',
              description: 'Same height each rep; park bell cleanly each set'
            }
          ]
        },
        {
          name: 'Clean to Jerk',
          duration: '10–12 min',
          description: 'Pop to rack; dip-drive; punch under; stable overhead stick.',
          battlePlan: '4 rounds\n• 4 per side Clean → Jerk\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clean primes rack; jerk expresses rapid vertical force.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Rack Position',
              description: 'Rack thumb in; elbow down/in; wrist neutral'
            },
            {
              icon: 'footsteps',
              title: 'Jerk Landing',
              description: 'Dip shallow; soft land; lock elbows solid'
            }
          ]
        },
        {
          name: 'Snatch Wave Sets',
          duration: '10–12 min',
          description: 'Execute 5-4-3 ladders per side with crisp overhead timing.',
          battlePlan: '3 waves\n• Per side: 5-4-3 Snatches (build slightly)\nRest 90s between waves',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wave loading hones speed, turnover, and endurance quality.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Snatch Pull',
              description: 'Hike deep; high pull then punch; tame arc'
            },
            {
              icon: 'checkmark',
              title: 'Overhead Lock',
              description: 'Own overhead; breathe sharp; park bell clean'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Swing Density',
          duration: '12–14 min',
          description: 'Sets of 10–12; float to chest; ribs stacked; avoid overpull.',
          battlePlan: '5 rounds\n• 10–12 Heavy Swings\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Heavier bell elevates output per rep with posture demand.',
          moodTips: [
            {
              icon: 'body',
              title: 'Posture Control',
              description: 'Lats down; ribs stacked; crush handle; hinge crisp'
            },
            {
              icon: 'flash',
              title: 'Hip Drive',
              description: 'Hips drive; bell floats; no lifting higher with arms'
            }
          ]
        },
        {
          name: 'Clean + Jerk Ladder',
          duration: '12–16 min',
          description: '3-2-1 per side; crisp rack; decisive dip-drive to lockout.',
          battlePlan: '4 rounds\n• Ladder per side: 3-2-1 Clean + Jerk\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ladder volume sustains speed-strength under compounding load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Rack Control',
              description: 'Rack quiet; forearm vertical; no bounce on chest'
            },
            {
              icon: 'walk',
              title: 'Recovery',
              description: 'Jerk tall; recover feet clean; breathe between ladders'
            }
          ]
        },
        {
          name: 'Snatch + Broad Jump Contrast',
          duration: '12–16 min',
          description: 'Snatch sets then broad jumps with firm two-second stick.',
          battlePlan: '4 rounds\n• 8 per side Snatches\n• 3 Broad Jumps (stick 2s)\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Overhead power primes horizontal projection mechanics well.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Snatch Control',
              description: 'Lockout stacked; quick drop; keep bell path close'
            },
            {
              icon: 'fitness',
              title: 'Jump Form',
              description: 'Broad jump: big arms; land mid-foot; hold two seconds'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Chains / Bands',
    icon: 'link',
    workouts: {
      beginner: [
        {
          name: 'Banded Jump Squat',
          duration: '8–10 min',
          description: 'Small vertical jumps versus band; quiet, balanced soft sticks.',
          battlePlan: '3 rounds\n• 5 × 3 Banded Jump Squats\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Band adds accommodating tension to sharpen peak speed top.',
          moodTips: [
            {
              icon: 'link',
              title: 'Band Setup',
              description: 'Anchor band low; equal tension; load centered tightly'
            },
            {
              icon: 'fitness',
              title: 'Jump Form',
              description: 'Hips back then pop; knees track; land soft and stable'
            }
          ]
        },
        {
          name: 'Banded Push Press',
          duration: '8–10 min',
          description: 'Short dip, violent drive, band-accelerated overhead finish.',
          battlePlan: '3 rounds\n• 6–8 Push Press (light band)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Band over-speed finish sharpens timing and lockout speed.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Dip Position',
              description: 'Band under feet; brace ribs; heels grounded'
            },
            {
              icon: 'trending-up',
              title: 'Press Control',
              description: 'Punch vertical; avoid early press; control return'
            }
          ]
        },
        {
          name: 'Banded Broad Jump',
          duration: '8–10 min',
          description: 'Jump forward against band; stable stick; measured resets.',
          battlePlan: '3 rounds\n• 5–6 Banded Broad Jumps (stick 2s)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elastic resistance builds horizontal power with control.',
          moodTips: [
            {
              icon: 'link',
              title: 'Band Setup',
              description: 'Belt or waist band; anchor behind; keep line taut'
            },
            {
              icon: 'walk',
              title: 'Jump Landing',
              description: 'Big arm swing; land mid-foot; freeze two seconds'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Chain Box Squat Speed Sets',
          duration: '10–12 min',
          description: 'Controlled sit to box; explode up; maintain crisp bar speed.',
          battlePlan: '6 rounds\n• 2 reps every 45s (speed focus)\nRest on timer',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Chains deload bottom, overload top to drive fast concentric.',
          moodTips: [
            {
              icon: 'link',
              title: 'Chain Setup',
              description: 'Chains equal both sides; box just below parallel'
            },
            {
              icon: 'flash',
              title: 'Speed Focus',
              description: 'Control down; no relax; drive aggressively to stand'
            }
          ]
        },
        {
          name: 'Banded Deadlift Pop',
          duration: '10–12 min',
          description: 'Fast submax pulls; smooth knees; tall snap finish posture.',
          battlePlan: '4 rounds\n• 3–4 reps (submax, fast)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Band tension reinforces lockout speed and hip extension.',
          moodTips: [
            {
              icon: 'link',
              title: 'Band Position',
              description: 'Mini-bands on pegs or feet; set lats; wedge hard'
            },
            {
              icon: 'trending-up',
              title: 'Pull Finish',
              description: 'Push floor; hips through; avoid hitch; reset clean'
            }
          ]
        },
        {
          name: 'Banded Split Jerk',
          duration: '10–12 min',
          description: 'Quick punch under band; balanced split; one-second hold.',
          battlePlan: '4 rounds\n• 4–5 Split Jerks\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elastic resistance demands rapid dip-drive and firm stick.',
          moodTips: [
            {
              icon: 'link',
              title: 'Band Anchor',
              description: 'Band anchored low; wrist neutral; ribs stacked'
            },
            {
              icon: 'footsteps',
              title: 'Split Control',
              description: 'Dip vertical; punch; freeze one second; recover'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Banded Jump Squat Clusters',
          duration: '12–14 min',
          description: 'Three reps, brief rest, three more; match jump height.',
          battlePlan: '5 rounds\n• Cluster: 3 + 3 Banded Jump Squats\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=r-4.1.0&q=85',
          intensityReason: 'Cluster density sustains speed under continuous tension.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Consistency',
              description: 'Same dip depth; elbows down; eyes forward'
            },
            {
              icon: 'leaf',
              title: 'Rest Timing',
              description: 'Land quietly; micro-rest ten to twelve seconds'
            }
          ]
        },
        {
          name: 'Chain Deadlift Speed Waves',
          duration: '12–14 min',
          description: '5-4-3 fast pulls; submax loads; tight bar path each rep.',
          battlePlan: '3 waves\n• 5-4-3 Deadlifts (fast concentric)\nRest 150s between waves',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wave sets maintain bar speed with rising top-end load.',
          moodTips: [
            {
              icon: 'link',
              title: 'Chain Control',
              description: 'Chains clear floor at top; pack lats; wedge deep'
            },
            {
              icon: 'trending-up',
              title: 'Speed Pull',
              description: 'Drive legs then hips; stand tall; reset positions clean'
            }
          ]
        },
        {
          name: 'Banded Broad + Sprint Contrast',
          duration: '12–16 min',
          description: 'Three banded broads, then immediate twenty-meter sprint.',
          battlePlan: '4 rounds\n• 3 Banded Broad Jumps (stick 2s)\n• 20m Free Sprint\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elastic priming then free sprint expresses pure speed best.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Jump Control',
              description: 'Broads: stick two seconds; band taut; measured strides'
            },
            {
              icon: 'walk',
              title: 'Sprint Form',
              description: 'Sprint: tall; fast turnover; relaxed arms and jaw'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Trap Hex Bar',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Trap Bar Jump Shrug',
          duration: '8–10 min',
          description: 'Quick knee bend to pop and shrug; quiet mid-foot landing.',
          battlePlan: '3 rounds\n• 5 × 3 Jump Shrugs (light)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Neutral handles support safe vertical extension mechanics.',
          moodTips: [
            {
              icon: 'body',
              title: 'Body Position',
              description: 'Small hinge; chest tall; lats on; ribs stacked'
            },
            {
              icon: 'flash',
              title: 'Extension',
              description: 'Extend hard; heels kiss; reset stance cleanly'
            }
          ]
        },
        {
          name: 'Trap Bar Deadlift Pop',
          duration: '8–10 min',
          description: 'Fast stand; smooth controlled return; reset each repetition.',
          battlePlan: '3 rounds\n• 5 × 2 Speed Deadlifts (light–moderate)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Speed pulls teach crisp leg drive and clean hip finish.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull Form',
              description: 'Brace; push floor; no yank; keep lats tight'
            },
            {
              icon: 'trending-down',
              title: 'Return Control',
              description: 'Hips through; stand tall; control eccentric down'
            }
          ]
        },
        {
          name: 'Trap Bar March to Sprint',
          duration: '8–10 min',
          description: 'Ten-meter loaded march; rack; immediate ten-meter sprint.',
          battlePlan: '3 rounds\n• 10m Trap Bar March (light)\n• 10m Free Sprint\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Posture and stiffness under load prepare acceleration.',
          moodTips: [
            {
              icon: 'walk',
              title: 'March Form',
              description: 'March tall; short steps; stiff ankles; ribs stacked'
            },
            {
              icon: 'flash',
              title: 'Sprint Speed',
              description: 'Sprint: big knee drive; quick steps; relax arms and face'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Trap Bar Jump',
          duration: '10–12 min',
          description: 'Small jump with load; soft stick; deliberate stance reset.',
          battlePlan: '4 rounds\n• 5 × 3 Trap Bar Jumps\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Loaded jumps build speed-strength with aligned mechanics.',
          moodTips: [
            {
              icon: 'body',
              title: 'Load Control',
              description: 'Light load; ribs stacked; avoid deep dip on countermovement'
            },
            {
              icon: 'footsteps',
              title: 'Landing',
              description: 'Land mid-foot; absorb softly; match jump height across sets'
            }
          ]
        },
        {
          name: 'Trap Bar High Pull',
          duration: '10–12 min',
          description: 'Pop tall; elbows drive up; keep handle path tight and close.',
          battlePlan: '4 rounds\n• 4 × 2 High Pulls (moderate)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Aggressive extension elevates handles with rapid speed.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull Path',
              description: 'Hinge load; sweep close; full triple extension timing'
            },
            {
              icon: 'body',
              title: 'Elbow Drive',
              description: 'Elbows up/back; avoid early curl; reset between reps'
            }
          ]
        },
        {
          name: 'Deadlift + Box Jump Contrast',
          duration: '10–12 min',
          description: 'Fast deadlift; quick step to box jump; two-second stick.',
          battlePlan: '4 rounds\n• 3 Speed Deadlifts (moderate)\n• 3 Box Jumps (stick 2s)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Strength pull potentiates reactive vertical jump quality.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Deadlift Form',
              description: 'Deadlift: push floor; snap hips; lats packed and ribs down'
            },
            {
              icon: 'fitness',
              title: 'Box Jump',
              description: 'Box: arms swing; land quiet; hold two seconds; step down controlled'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Jump Shrug Waves',
          duration: '12–14 min',
          description: '3-2-1 across waves; crisp height; precise repeatable path.',
          battlePlan: '3 waves\n• 3-2-1 Jump Shrugs (build per wave)\nRest 150s between waves',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wave sets preserve speed at rising relative loading.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Breathing',
              description: 'Brace hard; heels kiss; elbows quiet; breathe between reps'
            },
            {
              icon: 'speedometer',
              title: 'Consistency',
              description: 'Same dip depth each set; match landing quality consistently'
            }
          ]
        },
        {
          name: 'Trap Bar Jump Cluster',
          duration: '12–14 min',
          description: 'Two reps, ten seconds rest, two reps; maintain speed.',
          battlePlan: '5 rounds\n• Cluster: 2 + 2 Trap Bar Jumps\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Cluster density challenges elastic output and timing clean.',
          moodTips: [
            {
              icon: 'body',
              title: 'Jump Control',
              description: 'Same depth; land quiet; ribs stacked; eyes forward'
            },
            {
              icon: 'leaf',
              title: 'Rest Timer',
              description: 'Use timer; reset feet between pairs for quality consistency'
            }
          ]
        },
        {
          name: 'Deadlift + Sprint Contrast',
          duration: '12–16 min',
          description: 'Single fast pull; immediate twenty-meter relaxed sprint.',
          battlePlan: '5 rounds\n• 1 Fast Deadlift (moderate–heavy)\n• 20m Free Sprint\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Potentiation from pull enhances next short sprint speed.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Deadlift Power',
              description: 'Pull: wedge; drive hard; clean lockout; controlled set-down'
            },
            {
              icon: 'walk',
              title: 'Sprint Form',
              description: 'Sprint: forward lean start; quick steps; finish tall posture'
            }
          ]
        }
      ]
    }
  }
];

export default function WeightBasedWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Parse URL parameters
  const rawMoodTitle = params.mood as string || 'Build Explosive';
  // Convert "I want to build explosiveness" to "Build Explosive" for display
  const moodTitle = rawMoodTitle.toLowerCase().includes('explosiveness') ? 'Build Explosive' : rawMoodTitle;
  const workoutType = params.workoutType as string || 'Weight Based';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse selected equipment from comma-separated string
  const selectedEquipmentNames = equipmentParam.split(',').filter(name => name.trim() !== '');
  
  console.log('Weight-Based Debug:', {
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
      { key: 'mood', icon: 'flash', text: moodTitle },
      { key: 'bodyPart', icon: 'barbell', text: workoutType },
      { key: 'difficulty', icon: 'speedometer', text: difficulty === 'intermediate' ? 'Intermed.' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `${selectedEquipmentNames.length} Equipment` },
    ];

    // Return single row
    return [steps];
  };

  // Workout Card Component matching bodyweight explosiveness format exactly
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
        {selectedWorkoutData.length === 0 && (
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

        {/* Workout Cards for each selected equipment */}
        {selectedWorkoutData.map((equipmentData, index) => {
          const workoutsForDifficulty = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
          
          if (workoutsForDifficulty.length === 0) return null;
          
          return (
            <WorkoutCard
              key={`${equipmentData.equipment}-${index}`}
              equipment={equipmentData.equipment}
              icon={equipmentData.icon}
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
    paddingHorizontal: 10,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  goBackButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});