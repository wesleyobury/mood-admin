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

// Complete Glutes workout database with detailed battle plans and MOOD tips
const glutesWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Single Stack Cable Machine',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Cable Ankle Kickback',
          duration: '10–12 min',
          description: 'Ankle‑strapped motion builds activation through glutes',
          battlePlan: '3 rounds\n• 10–12 per leg Kickbacks\nRest 60s',
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
          duration: '10–12 min',
          description: 'Great hip hinge builder for posterior chain activation',
          battlePlan: '3 rounds\n• 10–12 Pull‑Throughs\nRest 75s',
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
          duration: '14–16 min',
          description: 'Cable anchor increases balance and constant tension',
          battlePlan: '4 rounds\n• 8–10 per leg Step‑Back Lunges\nRest 90s',
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
          duration: '14–16 min',
          description: 'Top‑end contraction isolates and strengthens glutes',
          battlePlan: '3 rounds\n• 8–10 per leg Kickbacks (2s pause top)\nRest 75–90s',
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
          duration: '16–18 min',
          description: 'Constant tension pairing ensures strong hypertrophy',
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
          duration: '16–18 min',
          description: 'Ankle‑cuff movement torches glutes with total volume',
          battlePlan: '3 rounds\n• 15–20 per leg Kickbacks\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          duration: '10–12 min',
          description: 'Intro thrust teaches hip extension mechanics',
          battlePlan: '3 rounds\n• 12–15 Bodyweight Thrusts\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds form before loading with weights safely',
          moodTips: [
            {
              icon: 'construct',
              title: 'Upper back on pad, chin tucked',
              description: 'Proper positioning creates stable base for hip thrust movement.'
            },
            {
              icon: 'trending-up',
              title: 'Drive hips fully upward, squeeze glutes',
              description: 'Complete hip extension with glute squeeze maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Light Bar Hip Thrust',
          duration: '10–12 min',
          description: 'Adds simple progressive overload for growth',
          battlePlan: '3 rounds\n• 10–12 Bar Hip Thrusts\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Barbell load increases strength above bodyweight',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Barbell across hips, brace core',
              description: 'Proper bar positioning and core bracing ensure safe load transfer.'
            },
            {
              icon: 'fitness',
              title: 'Push evenly with both heels',
              description: 'Balanced heel drive prevents compensations and maximizes power.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Banded Hip Thrust',
          duration: '14–16 min',
          description: 'Top range of thrust maximally challenges glutes',
          battlePlan: '4 rounds\n• 10 Banded Hip Thrusts\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Band adds peak contraction constant tension',
          moodTips: [
            {
              icon: 'resize',
              title: 'Band above knees, push outward hard',
              description: 'Band resistance challenges glutes in multiple planes of movement.'
            },
            {
              icon: 'flash',
              title: 'Drive hips to full lockout each rep',
              description: 'Complete hip extension against band resistance maximizes glute activation.'
            }
          ]
        },
        {
          name: 'Single‑Leg Hip Thrust',
          duration: '14–16 min',
          description: 'Unilateral thrust forces even glute development',
          battlePlan: '3 rounds\n• 8–10 per leg Single‑Leg Hip Thrusts\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Isolates one side for balance and hypertrophy',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep pelvis steady, no dropping hips',
              description: 'Pelvic stability ensures proper muscle activation and prevents injury.'
            },
            {
              icon: 'fitness',
              title: 'Drive single leg into ground steady',
              description: 'Focused single-leg drive develops unilateral strength and power.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Bar Hip Thrust',
          duration: '16–18 min',
          description: 'Core posterior builder for explosive hip drive',
          battlePlan: '4 rounds\n• 6–8 Heavy Hip Thrusts\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Heavy load maximizes strength + glute mass',
          moodTips: [
            {
              icon: 'shield',
              title: 'Brace torso, don\'t let back arch',
              description: 'Core stability prevents compensations under heavy load.'
            },
            {
              icon: 'construct',
              title: 'Lock hips in controlled extension',
              description: 'Controlled movement pattern maintains safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Hip Thrust + Iso Hold',
          duration: '16–18 min',
          description: 'Combo reps with iso challenge complete burnout',
          battlePlan: '3 rounds\n• 8–10 Hip Thrusts\nFinish with 10s Iso Hold at Top\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Holding at top extends tension for hypertrophy',
          moodTips: [
            {
              icon: 'timer',
              title: 'Squeeze glutes through hold, knees wide',
              description: 'Sustained contraction maximizes metabolic stress and muscle activation.'
            },
            {
              icon: 'construct',
              title: 'Don\'t let hips sag during 10s hold',
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
          duration: '10–12 min',
          description: 'Beginner machine exercise builds focused posture',
          battlePlan: '3 rounds\n• 10–12 Kickbacks per leg\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Guided path isolates glutes in safe extension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Push pad back steady with heel',
              description: 'Controlled movement ensures proper muscle activation and safety.'
            },
            {
              icon: 'shield',
              title: 'Control down, brace torso against pad',
              description: 'Torso stability prevents compensations and maximizes glute isolation.'
            }
          ]
        },
        {
          name: 'Seated Kickback',
          duration: '10–12 min',
          description: 'Stability lets beginners focus on contraction',
          battlePlan: '3 rounds\n• 12 per leg Seated Kickbacks\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Torso supported, glutes isolated with pad stride',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold seat steady, core locked',
              description: 'Seated position provides stability for focused glute activation.'
            },
            {
              icon: 'timer',
              title: 'Drive through heel, pause at end',
              description: 'Pause at peak contraction enhances muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Kickback',
          duration: '14–16 min',
          description: 'Strong extension builds both power and size',
          battlePlan: '4 rounds\n• 8–10 Heavy Kickbacks per side\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Heavier load develops strength progression',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep hips locked, don\'t arch spine',
              description: 'Hip stability prevents compensations under heavier loads.'
            },
            {
              icon: 'shield',
              title: 'Move pad steady, avoid jerking',
              description: 'Controlled movement maintains form and prevents injury.'
            }
          ]
        },
        {
          name: 'Pause Kickback',
          duration: '14–16 min',
          description: 'Builds high‑quality reps at full extension',
          battlePlan: '3 rounds\n• 8 per leg Pause Kickbacks\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Pause rep style maxes peak glute contraction',
          moodTips: [
            {
              icon: 'timer',
              title: '2s pause at lockout, glutes hard squeeze',
              description: 'Extended pause maximizes peak contraction and muscle activation.'
            },
            {
              icon: 'construct',
              title: 'Lower slow, don\'t slam pads',
              description: 'Controlled eccentric enhances muscle development and joint safety.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop‑Set Kickback',
          duration: '16–18 min',
          description: 'Drop pattern pushes muscles into deep fatigue',
          battlePlan: '3 rounds\n• 8 Heavy Kickbacks each leg\nDrop 15–20% → 6–8 reps\nDrop 15–20% again → 6–8 reps\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Strip sets extend time under tension for glutes',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% fast, no resting mid‑set',
              description: 'Quick weight changes maintain fatigue and extend training stimulus.'
            },
            {
              icon: 'construct',
              title: 'Smooth ROM across all drops',
              description: 'Maintain full range of motion even as fatigue increases.'
            }
          ]
        },
        {
          name: 'Kickback Hold Burner',
          duration: '16–18 min',
          description: 'Hybrid hold and pump challenge drains glutes',
          battlePlan: '4 rounds\n• 8 Kickbacks per leg\nEnd with 10s Iso Hold\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Static hold plus reps creates burnout tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'On last rep, 10s full lockout hold',
              description: 'Isometric hold at peak contraction maximizes metabolic stress.'
            },
            {
              icon: 'construct',
              title: 'Maintain hip alignment during hold',
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
          duration: '10–12 min',
          description: 'Beginner movement improves hip stability basics',
          battlePlan: '3 rounds\n• 12–15 Hip Abductions\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Simple seated hip open strengthens glute medius',
          moodTips: [
            {
              icon: 'construct',
              title: 'Sit tall, press knees wide steady',
              description: 'Upright posture ensures proper glute medius activation.'
            },
            {
              icon: 'shield',
              title: 'Return slow, avoid bounce inward',
              description: 'Controlled return prevents momentum and maintains muscle tension.'
            }
          ]
        },
        {
          name: 'Lean Forward Abduction',
          duration: '10–12 min',
          description: 'Builds engagement by altering trunk placement',
          battlePlan: '3 rounds\n• 12–15 Lean Abductions\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Lean angle shifts load deeper onto glute fibers',
          moodTips: [
            {
              icon: 'construct',
              title: 'Lean forward 20–30°, chest down',
              description: 'Forward lean changes muscle fiber recruitment for enhanced activation.'
            },
            {
              icon: 'fitness',
              title: 'Push knees wide with control',
              description: 'Controlled movement ensures quality muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Banded Abduction',
          duration: '14–16 min',
          description: 'Boosts hypertrophy by adding lateral force',
          battlePlan: '4 rounds\n• 12 Banded Hip Abductions\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Band tension amplifies contraction intensity',
          moodTips: [
            {
              icon: 'resize',
              title: 'Band above knees, press outward hard',
              description: 'Band creates additional resistance throughout the range of motion.'
            },
            {
              icon: 'construct',
              title: 'Control return, don\'t let knees crash',
              description: 'Controlled return prevents band snap-back and maintains tension.'
            }
          ]
        },
        {
          name: 'Unilateral Abduction',
          duration: '14–16 min',
          description: 'Prevents imbalances with strict single‑side work',
          battlePlan: '4 rounds\n• 8–10 per side Unilateral Abductions\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'One side at a time enhances activation and control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Press one knee, anchor the other hard',
              description: 'Unilateral work highlights and addresses strength imbalances.'
            },
            {
              icon: 'shield',
              title: 'Sit tall, torso stable against pad',
              description: 'Torso stability ensures isolated glute medius activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop‑Set Abduction',
          duration: '16–18 min',
          description: 'Sequential drops extend glute medius training',
          battlePlan: '3 rounds\n• 12 Heavy Abductions\nDrop 20% → 10 reps\nDrop 20% → 10 reps\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Strip set overload maximizes muscle fatigue',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop weights fast and keep going',
              description: 'Quick transitions maintain fatigue and extend training stimulus.'
            },
            {
              icon: 'construct',
              title: 'ROM steady even when lightened',
              description: 'Maintain full range of motion throughout all drop sets.'
            }
          ]
        },
        {
          name: 'Hold + Rep Abduction',
          duration: '16–18 min',
          description: 'Tension overload floods glute medius thoroughly',
          battlePlan: '3 rounds\n• 10s Iso Hold (knees wide)\n• 10–12 Full Reps\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combination iso + reps forces total burnout',
          moodTips: [
            {
              icon: 'timer',
              title: 'Squeeze wide in 10s iso hold',
              description: 'Sustained contraction pre-fatigues muscles for enhanced training effect.'
            },
            {
              icon: 'construct',
              title: 'Go straight into smooth full reps',
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
          duration: '10–12 min',
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
        },
        {
          name: 'DB RDL',
          duration: '10–12 min',
          description: 'Dumbbell hinge builds strength safely\nfor beginners with proper form.\n ',
          battlePlan: '3 rounds\n• 8-10 dumbbell RDLs\nRest 75s',
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
          battlePlan: '4 rounds\n• 8-10 bulgarian split squats per leg\nRest 75-90s',
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
          battlePlan: '3 rounds\n• 8 per side Lateral Lunges\nRest 90s',
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
          battlePlan: '4 rounds\n• 8 DB Squats\n• 8 DB RDLs\nRest 90s',
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
          battlePlan: '3 rounds\n• 10 Squats + 10s Hold + 6 Pulses\nRest 90s',
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
          battlePlan: '3 rounds\n• 8-10 back squats\nRest 90s',
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
          battlePlan: '3 rounds\n• 8 per leg Reverse Lunges\nRest 75-90s',
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
          battlePlan: '3 rounds\n• 8-10 rack rdls\nRest 75-90s',
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
          battlePlan: '4 rounds\n• 6-8 front squats\nRest 90s',
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
          battlePlan: '4 rounds\n• 8-10 bulgarians per side\nRest 90s',
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
          battlePlan: '3 rounds\n• 8-10 deficit rdls\nRest 90s',
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
          battlePlan: '4 rounds\n• 6 Pause Back Squats\nRest 90s',
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
          battlePlan: '3 rounds\n• 20 steps total Walking Lunges\nRest 90s',
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
          battlePlan: '4 rounds\n• 6 Back Squats\n• 6 Rack RDLs\nRest 90s',
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
          battlePlan: '3 rounds\n• 10-12 neutral leg press\nRest 75s',
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
          battlePlan: '3 rounds\n• 10-12 narrow stance press\nRest 75s',
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
          battlePlan: '4 rounds\n• 8-10 wide stance press\nRest 90s',
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
          battlePlan: '4 rounds\n• 8 per leg Single Leg Press\nRest 90s',
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
          battlePlan: '3 rounds\n• 8 Heavy Press → Drop x2 (6–8 reps each)\nRest 90s',
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
          battlePlan: '4 rounds\n• 8 Leg Press Reps (2s pause at bottom)\nRest 90s',
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
          battlePlan: '3 rounds\n• 10-12 hack squats\nRest 75s',
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
          battlePlan: '3 rounds\n• 8-10 narrow hack squats\nRest 75s',
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
          battlePlan: '4 rounds\n• 8-10 wide hack squats\nRest 90s',
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
          battlePlan: '4 rounds\n• 8 Hack Squats\n• Immediately 12 Hack Calf Raises\nRest 90s',
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
          battlePlan: '3 rounds\n• 6-8 hack squats (1 full + ½ rep = 1 rep)\nRest 90s',
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
          battlePlan: '4 rounds\n• 8-10 reverse hack squats\nRest 90s',
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
          battlePlan: '3 rounds\n• 10-12 cable squats\nRest 75s',
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
          battlePlan: '3 rounds\n• 8 per side Step Throughs\nRest 75s',
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
          battlePlan: '4 rounds\n• 8-10 cable rdls\nRest 90s',
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
          battlePlan: '4 rounds\n• 8-10 cable split squats per leg\nRest 90s',
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
          battlePlan: '4 rounds\n• 6-8 heavy cable front squats\nRest 90s',
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
          battlePlan: '4 rounds\n• 8 Cable Squats\n• 8 Cable RDLs\nRest 90s',
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
  },
  {
    equipment: 'Trap Bar',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Trap Bar Deadlift Squat',
          duration: '10–12 min',
          description: 'Full‑body squat/deadlift hybrid builds foundation',
          battlePlan: '**3 rounds**\n• 8–10 Deadlift‑Style Trap Bar Squats\n**Rest 75–90s**',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Safest trap bar squat teaches form and posture',
          moodTips: [
            {
              icon: 'body',
              title: 'Stand tall inside bar, chest up',
              description: 'Maintain upright posture throughout the movement for proper form.'
            },
            {
              icon: 'arrow-down',
              title: 'Push floor evenly, lock out fully',
              description: 'Drive through both feet equally and complete full extension at top.'
            }
          ]
        },
        {
          name: 'Neutral Grip Trap Bar Squat',
          duration: '10–12 min',
          description: 'Neutral foot placement encourages steady control',
          battlePlan: '**3 rounds**\n• 8–10 Neutral Squats\n**Rest 75–90s**',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Balanced stance builds quads and glutes evenly',
          moodTips: [
            {
              icon: 'resize-outline',
              title: 'Feet shoulder width, toes slightly out',
              description: 'Proper foot positioning ensures balanced muscle activation.'
            },
            {
              icon: 'trending-down',
              title: 'Keep spine tall, descend under control',
              description: 'Controlled descent maximizes muscle engagement and safety.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Wide Stance Trap Bar Squat',
          duration: '14–16 min',
          description: 'Builds hip strength and glute drive through stance',
          battlePlan: '**4 rounds**\n• 6–8 Wide Stance Squats\n**Rest 90s**',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wider base targets hips and glutes harder',
          moodTips: [
            {
              icon: 'resize',
              title: 'Feet wider, push knees out strongly',
              description: 'Wide stance activates glutes more effectively than narrow stance.'
            },
            {
              icon: 'arrow-forward',
              title: 'Drive hips forward to finish rep',
              description: 'Hip drive ensures complete glute activation at top of movement.'
            }
          ]
        },
        {
          name: 'Tempo Trap Bar Squat',
          duration: '14–16 min',
          description: 'Slow descent builds control and hypertrophy',
          battlePlan: '**4 rounds**\n• 6–8 Squats (3–4s eccentric)\n**Rest 90s**',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Extended eccentrics increase muscle time',
          moodTips: [
            {
              icon: 'time',
              title: 'Lower in 3–4s, keep chest upright',
              description: 'Slow tempo increases time under tension for muscle growth.'
            },
            {
              icon: 'construct',
              title: 'Controlled pace — no collapse at depth',
              description: 'Maintain tension throughout range of motion for safety.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Pause Trap Bar Squat',
          duration: '16–18 min',
          description: 'Builds stability and power out of squat bottom',
          battlePlan: '**4 rounds**\n• 6 Paused Squats (2s)\n**Rest 90s**',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: '2s pause eliminates momentum, loads glutes/quads',
          moodTips: [
            {
              icon: 'pause',
              title: 'Hold depth 2s, keep core braced',
              description: 'Pause eliminates stretch reflex, requiring pure strength to ascend.'
            },
            {
              icon: 'rocket',
              title: 'Explode upward from pause each rep',
              description: 'Rapid acceleration from pause develops explosive power.'
            }
          ]
        },
        {
          name: '1½ Rep Trap Bar Squat',
          duration: '16–18 min',
          description: 'Doubles workload while keeping constant tension',
          battlePlan: '**3 rounds**\n• 6–8 1½ Rep Trap Bar Squats\n**Rest 90s**',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Half + full rep combo extends quad fatigue',
          moodTips: [
            {
              icon: 'repeat',
              title: 'Lower full, rise half, drop, then stand',
              description: 'Complete sequence: full down, half up, full down, full up.'
            },
            {
              icon: 'trending-up',
              title: 'Stay smooth — no bouncing between halves',
              description: 'Controlled movement pattern prevents momentum and maintains tension.'
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
      'Single Stack Cable': 'reorder-three',
      'Trap Bar': 'remove'
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

  // Get muscle groups from params to determine which databases to use
  const muscleGroupsParam = params.muscleGroups as string || '';
  let selectedMuscleGroups: string[] = [];
  
  try {
    if (muscleGroupsParam) {
      const decodedMuscleGroups = decodeURIComponent(muscleGroupsParam);
      selectedMuscleGroups = decodedMuscleGroups.split(',').map(group => group.trim());
    }
  } catch (error) {
    console.error('Error parsing muscle groups parameter:', error);
  }

  // Filter workouts based on selected equipment and muscle groups
  let userWorkouts: any[] = [];
  
  // Add compound workouts if Compound is selected
  if (selectedMuscleGroups.includes('Compound')) {
    const compoundWorkouts = compoundWorkoutDatabase.filter(equipment => 
      selectedEquipmentNames.includes(equipment.equipment)
    ).map(equipment => ({
      ...equipment,
      workouts: equipment.workouts[difficulty as keyof typeof equipment.workouts] || [],
      muscleGroup: 'Compound'
    }));
    userWorkouts.push(...compoundWorkouts);
  }
  
  // Add glutes workouts if Glutes is selected
  if (selectedMuscleGroups.includes('Glutes')) {
    const glutesWorkouts = glutesWorkoutDatabase.filter(equipment => 
      selectedEquipmentNames.includes(equipment.equipment)
    ).map(equipment => ({
      ...equipment,
      workouts: equipment.workouts[difficulty as keyof typeof equipment.workouts] || [],
      muscleGroup: 'Glutes'
    }));
    userWorkouts.push(...glutesWorkouts);
  }

  console.log('User workouts:', userWorkouts.length, 'for difficulty:', difficulty);

  const handleStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    console.log('🚀 Starting workout:', workout.name);
    
    // Navigate to workout guidance with full parameters including MOOD tips
    const params = {
      workoutName: workout.name,
      equipment: equipment,
      description: workout.description,
      duration: workout.duration,
      intensity: difficulty,
      battlePlan: workout.battlePlan, // Keep bullets intact
      moodTips: encodeURIComponent(JSON.stringify(workout.moodTips)) // Pass actual MOOD tips
    };
    
    console.log('📝 Workout data:', params);
    console.log('🔄 Navigation params:', params);
    
    try {
      router.push({
        pathname: '/workout-guidance',
        params
      });
      console.log('✅ Navigation completed - with full MOOD tips and proper battle plan');
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
          {/* Workout Cards - Grouped by Muscle Group */}
          {selectedMuscleGroups.includes('Compound') && (
            <>
              <Text style={styles.muscleGroupHeader}>Compound Workouts</Text>
              {userWorkouts.filter(w => w.muscleGroup === 'Compound').map((equipmentWorkout, index) => (
                <WorkoutCard
                  key={`compound-${equipmentWorkout.equipment}`}
                  equipment={equipmentWorkout.equipment}
                  icon={equipmentWorkout.icon}
                  workouts={equipmentWorkout.workouts}
                  difficulty={difficulty}
                  difficultyColor={difficultyColor}
                  onStartWorkout={handleStartWorkout}
                />
              ))}
            </>
          )}
          
          {selectedMuscleGroups.includes('Glutes') && (
            <>
              <Text style={styles.muscleGroupHeader}>Glutes Workouts</Text>
              {userWorkouts.filter(w => w.muscleGroup === 'Glutes').map((equipmentWorkout, index) => (
                <WorkoutCard
                  key={`glutes-${equipmentWorkout.equipment}`}
                  equipment={equipmentWorkout.equipment}
                  icon={equipmentWorkout.icon}
                  workouts={equipmentWorkout.workouts}
                  difficulty={difficulty}
                  difficultyColor={difficultyColor}
                  onStartWorkout={handleStartWorkout}
                />
              ))}
            </>
          )}
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
  muscleGroupHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'left',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});