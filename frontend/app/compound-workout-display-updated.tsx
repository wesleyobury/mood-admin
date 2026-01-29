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

// Complete Glutes workout database with updated content
const glutesWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Single Stack Cable Machine',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Cable Ankle Kickback',
          duration: '10-12 min',
          description: 'Ankle‑strapped motion builds activation through glutes\n ',
          battlePlan: '3 rounds\n• 10-12 per leg Kickbacks\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Cable adds constant tension for strict hip extension',
          moodTips: [
            {
              icon: 'body',
              title: 'Strap cuff to ankle, hinge slightly, torso tall',
              description: 'Proper positioning ensures target muscle isolation and safety.'
            },
            {
              icon: 'construct',
              title: 'Kick leg smoothly back, no hip or torso twist',
              description: 'Controlled movement prevents compensation and maximizes glute activation.'
            }
          ]
        },
        {
          name: 'Cable Pull‑Through',
          duration: '10-12 min',
          description: 'Great hip hinge builder for posterior chain activation\n ',
          battlePlan: '3 rounds\n• 10-12 Pull‑Throughs\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Rope hinge motion loads glutes with safe posture path',
          moodTips: [
            {
              icon: 'walk',
              title: 'Hold rope, step forward, hinge hips deep',
              description: 'Proper setup creates the foundation for effective hip hinge movement.'
            },
            {
              icon: 'flash',
              title: 'Drive hips through, squeeze glutes at end',
              description: 'Hip drive ensures complete glute activation and power development.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Cable Step‑Back Lunge',
          duration: '14-16 min',
          description: 'Cable anchor increases balance and constant tension\n ',
          battlePlan: '4 rounds\n• 8-10 per leg Step‑Back Lunges\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Rear lunges with cable build unilateral glute force',
          moodTips: [
            {
              icon: 'construct',
              title: 'Cable set low, hold handle at chest height',
              description: 'Proper cable position maintains balance and core engagement.'
            },
            {
              icon: 'trending-down',
              title: 'Step back steady, push from heel upright',
              description: 'Controlled descent with heel drive maximizes glute loading.'
            }
          ]
        },
        {
          name: 'Cable High Kickback',
          duration: '14-16 min',
          description: 'Top‑end contraction isolates and strengthens glutes\n ',
          battlePlan: '3 rounds\n• 8-10 per leg Kickbacks (2s pause top)\nRest 75-90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Kickbacks with higher angle add peak glute tension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Ankle cuff, pulley low, hinge slightly forward',
              description: 'Low pulley position creates optimal resistance curve for glutes.'
            },
            {
              icon: 'timer',
              title: 'Kick upward + back, pause two seconds top',
              description: 'Pause at peak contraction maximizes muscle activation and control.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Pull‑Through + Squat Combo',
          duration: '16-18 min',
          description: 'Constant tension pairing ensures strong hypertrophy\n ',
          battlePlan: '4 rounds\n• 8 Pull‑Throughs\n• 8 Cable Squats\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Pair hinge and squat hits glutes from dual angles',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform pull‑through hinge, then squat upright',
              description: 'Continuous movement maintains muscle tension and metabolic stress.'
            },
            {
              icon: 'construct',
              title: 'Stay tight near stack, no resting mid‑set',
              description: 'Proper positioning ensures consistent resistance throughout range.'
            }
          ]
        },
        {
          name: 'Cable Kickback Burnout',
          duration: '16-18 min',
          description: 'Ankle‑cuff movement torches glutes with total volume\n ',
          battlePlan: '3 rounds\n• 15-20 per leg Kickbacks\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High rep burnout floods glutes with strict tension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep hips square, no torso leaning back',
              description: 'Maintain proper alignment to isolate glutes and prevent compensation.'
            },
            {
              icon: 'shield',
              title: 'Small but controlled, avoid swinging reps',
              description: 'Quality over quantity - maintain form even during high-rep burnout.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Hip Thruster Equipment',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Bodyweight Hip Thrust',
          duration: '10-12 min',
          description: 'Teaches thrust basics before loading with bar weight\n ',
          battlePlan: '3 rounds\n• 12-15 Bodyweight Hip Thrusts\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Entry thrust builds safe mechanics for hip extension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Upper back on bench, chin down, core tight',
              description: 'Proper positioning creates stable base for hip thrust movement.'
            },
            {
              icon: 'trending-up',
              title: 'Drive hips up, squeeze glutes firmly top',
              description: 'Complete hip extension with glute squeeze maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Light Bar Hip Thrust',
          duration: '10-12 min',
          description: 'Adds external weight to strengthen glute hip drive\n ',
          battlePlan: '3 rounds\n• 10-12 Light Bar Hip Thrusts\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Light load introduces controlled thrust progression',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Rest padded bar across hips locked in',
              description: 'Proper bar positioning and core bracing ensure safe load transfer.'
            },
            {
              icon: 'fitness',
              title: 'Thrust upward hard, pause at top',
              description: 'Balanced heel drive prevents compensations and maximizes power.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Banded Hip Thrust',
          duration: '14-16 min',
          description: 'Builds glute lockout with band top range tension\n ',
          battlePlan: '4 rounds\n• 10 Banded Hip Thrusts\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Band drives abduction for long range contraction',
          moodTips: [
            {
              icon: 'resize',
              title: 'Keep band above knees, press outward',
              description: 'Band resistance challenges glutes in multiple planes of movement.'
            },
            {
              icon: 'flash',
              title: 'Brace abs, extend hips forcefully each rep',
              description: 'Complete hip extension against band resistance maximizes glute activation.'
            }
          ]
        },
        {
          name: 'Single‑Leg Hip Thrust',
          duration: '14-16 min',
          description: 'Unilateral load prevents imbalance and aids stability\n ',
          battlePlan: '3 rounds\n• 8-10 per leg Single‑Leg Hip Thrusts\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'One‑leg thrust isolates glutes for stronger balance',
          moodTips: [
            {
              icon: 'construct',
              title: "Keep pelvis level, don't rotate hips down',
              description: 'Pelvic stability ensures proper muscle activation and prevents injury.'
            },
            {
              icon: 'fitness',
              title: 'Drive heel firmly, feel isolated squeeze',
              description: 'Focused single-leg drive develops unilateral strength and power.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Bar Hip Thrust',
          duration: '16-18 min',
          description: 'Barbell lift grows strength and posterior hip power\n ',
          battlePlan: '4 rounds\n• 6-8 Heavy Hip Thrusts\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Heavy thrust progression maximizes glute overload',
          moodTips: [
            {
              icon: 'shield',
              title: 'Bar over hips, brace abs to stabilize',
              description: 'Core stability prevents compensations under heavy load.'
            },
            {
              icon: 'construct',
              title: 'Thrust up sharply, lock out glutes',
              description: 'Controlled movement pattern maintains safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Hip Thrust + Iso Hold',
          duration: '16-18 min',
          description: 'Finisher combo challenges endurance and contraction\n ',
          battlePlan: '3 rounds\n• 8-10 Hip Thrusts\nFinish with 10s Iso Hold at top\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Iso hold extending reps prolongs glute time under load',
          moodTips: [
            {
              icon: 'timer',
              title: '10s hold in full extension each set',
              description: 'Sustained contraction maximizes metabolic stress and muscle activation.'
            },
            {
              icon: 'construct',
              title: 'Push knees out to hold band tension',
              description: 'Maintain position throughout hold for maximum effectiveness.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Glute Kick Machine',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Machine Kickback',
          duration: '10-12 min',
          description: 'Pad press hip drive builds foundation safely first\n ',
          battlePlan: '3 rounds\n• 10-12 per leg Kickbacks\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Guided extension path isolates glutes effectively',
          moodTips: [
            {
              icon: 'construct',
              title: 'Push with heel, torso braced on pad',
              description: 'Controlled movement ensures proper muscle activation and safety.'
            },
            {
              icon: 'shield',
              title: 'Contract glute without arching spine',
              description: 'Torso stability prevents compensations and maximizes glute isolation.'
            }
          ]
        },
        {
          name: 'Seated Kickback',
          duration: '10-12 min',
          description: 'Seated pad drive provides beginner stability focus\n ',
          battlePlan: '3 rounds\n• 12 per leg Seated Kickbacks\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Torso support stabilizes movement for beginners',
          moodTips: [
            {
              icon: 'construct',
              title: 'Sit braced, core upright on machine seat',
              description: 'Seated position provides stability for focused glute activation.'
            },
            {
              icon: 'timer',
              title: 'Press pad back steadily with glute drive',
              description: 'Pause at peak contraction enhances muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Kickback',
          duration: '14-16 min',
          description: 'Progressive overload builds strength at extension\n ',
          battlePlan: '4 rounds\n• 8-10 Heavy Kickbacks per leg\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Increased load pushes hypertrophy for glutes',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep back steady, hips square to pad',
              description: 'Hip stability prevents compensations under heavier loads.'
            },
            {
              icon: 'shield',
              title: 'Push controlled, bar no sudden drops',
              description: 'Controlled movement maintains form and prevents injury.'
            }
          ]
        },
        {
          name: 'Pause Kickback',
          duration: '14-16 min',
          description: 'Strict tempo isolates stronger contraction at end\n ',
          battlePlan: '3 rounds\n• 8 per leg Pause Kickbacks\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Added pause loads glute contraction maximally',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s with knee extended back',
              description: 'Extended pause maximizes peak contraction and muscle activation.'
            },
            {
              icon: 'construct',
              title: 'Slow return; avoid pad snapping',
              description: 'Controlled eccentric enhances muscle development and joint safety.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop‑Set Kickback',
          duration: '16-18 min',
          description: 'Sequential weight drops demand non‑stop contraction\n ',
          battlePlan: '3 rounds\n• 8 Heavy Kickbacks per leg\nDrop 15% weight → 6-8 reps\nDrop 15% again → 6-8 reps\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Drop loading pattern extends tension for hypertrophy',
          moodTips: [
            {
              icon: 'flash',
              title: 'Reduce weight 15% instantly, keep going',
              description: 'Quick weight changes maintain fatigue and extend training stimulus.'
            },
            {
              icon: 'construct',
              title: 'One fluid motion across all drops',
              description: 'Maintain full range of motion even as fatigue increases.'
            }
          ]
        },
        {
          name: 'Kickback Hold Burner',
          duration: '16-18 min',
          description: 'Static‑dynamic combo adds brutal finishing stimulus\n ',
          battlePlan: '4 rounds\n• 8 Kickbacks each leg\nFinish with 10s Iso Hold on last rep\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Iso hold after reps enhances glute activation burn',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold final rep 10s contraction tight',
              description: 'Isometric hold at peak contraction maximizes metabolic stress.'
            },
            {
              icon: 'construct',
              title: 'Keep body square, hips strong inline',
              description: 'Proper position prevents compensations during extended hold.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Hip Abductor Machine',
    icon: 'resize',
    workouts: {
      beginner: [
        {
          name: 'Standard Abduction',
          duration: '10-12 min',
          description: 'Intro machine work builds stability in outer hips\n ',
          battlePlan: '3 rounds\n• 12-15 Abductions\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Basic seated movement strengthens glute medius',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stay upright; push knees outward slow',
              description: 'Upright posture ensures proper glute medius activation.'
            },
            {
              icon: 'shield',
              title: "Don't slam pads together when resting',
              description: 'Controlled return prevents momentum and maintains muscle tension.'
            }
          ]
        },
        {
          name: 'Lean Forward Abduction',
          duration: '10-12 min',
          description: 'Shifts emphasis effectively into upper glute tissues\n ',
          battlePlan: '3 rounds\n• 12-15 Lean Abductions\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Lean angle biases deeper glute muscle activity',
          moodTips: [
            {
              icon: 'construct',
              title: 'Lean 20-30° forward with chest down',
              description: 'Forward lean changes muscle fiber recruitment for enhanced activation.'
            },
            {
              icon: 'fitness',
              title: 'Control knees in and out steady',
              description: 'Controlled movement ensures quality muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Banded Abduction',
          duration: '14-16 min',
          description: 'Combo band+machine emphasizes hypertrophy work\n ',
          battlePlan: '4 rounds\n• 12 Banded Abductions\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Band tension increases abductor contraction top end',
          moodTips: [
            {
              icon: 'resize',
              title: 'Strap band above knees, press outward',
              description: 'Band creates additional resistance throughout the range of motion.'
            },
            {
              icon: 'construct',
              title: 'Keep knees wide, resist on way in',
              description: 'Controlled return prevents band snap-back and maintains tension.'
            }
          ]
        },
        {
          name: 'Unilateral Abduction',
          duration: '14-16 min',
          description: 'Asymmetry training balances strength between hips\n ',
          battlePlan: '4 rounds\n• 8-10 per side Abductions\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'One‑sided work isolates weaker glute completely',
          moodTips: [
            {
              icon: 'construct',
              title: 'Work one leg at a time deliberately',
              description: 'Unilateral work highlights and addresses strength imbalances.'
            },
            {
              icon: 'shield',
              title: 'Keep torso tall, avoid rocking body',
              description: 'Torso stability ensures isolated glute medius activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop‑Set Abduction',
          duration: '16-18 min',
          description: 'Stacked reps crush glute medius with high overload\n ',
          battlePlan: '3 rounds\n• 12 Heavy Abductions\nDrop 20% → 10 reps\nDrop 20% again → 10 reps\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Drop set prolongs effort rising metabolic fatigue',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strip plates fast, no mid‑set rest',
              description: 'Quick transitions maintain fatigue and extend training stimulus.'
            },
            {
              icon: 'construct',
              title: 'Keep every rep smooth and steady',
              description: 'Maintain full range of motion throughout all drop sets.'
            }
          ]
        },
        {
          name: 'Hold + Rep Abduction',
          duration: '16-18 min',
          description: 'Brutal pairing fully activates and fatigues hips\n ',
          battlePlan: '3 rounds\n• 10s Iso Hold wide\n• 10-12 Full Reps immediately after\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Iso hold primes glutes then high‑rep sets extend',
          moodTips: [
            {
              icon: 'timer',
              title: 'Brace pad wide for 10s then repeat',
              description: 'Sustained contraction pre-fatigues muscles for enhanced training effect.'
            },
            {
              icon: 'construct',
              title: "Don't lean, keep torso locked tall',
              description: 'Immediate transition maintains fatigue and training intensity.'
            }
          ]
        }
      ]
    }
  }
];

// Complete Compound Leg workout database with detailed battle plans and MOOD tips
const compoundWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Goblet Squat',
          duration: '10-12 min',
          description: 'Simple squat variation teaches control\nand balance with front load support.\n ',
          battlePlan: '3 rounds\n• 10-12 goblet squats\nRest 75s',
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
        }
        // ... continue with rest of compound workouts database
      ]
      // ... rest of compound database structure
    }
  }
  // ... rest of compound database
];

// ... rest of the file remains the same

export default function CompoundWorkoutDisplayScreen() {
  // ... component code remains the same
}

// ... styles remain the same
