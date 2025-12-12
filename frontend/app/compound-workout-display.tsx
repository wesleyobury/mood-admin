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
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/2ambyktp_gk2.webp',
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/hgi9y71r_cpt.jpg',
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/kbqqdimd_download%20%282%29.png',
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/coxrp5yp_gk.jpg',
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/hgi9y71r_cpt.jpg',
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/coxrp5yp_gk.jpg',
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
          description: 'Teaches thrust basics before loading with bar weight',
          battlePlan: '3 rounds\n• 12–15 Bodyweight Hip Thrusts\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/odvl0o6h_ht.webp',
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
          duration: '10–12 min',
          description: 'Adds external weight to strengthen glute hip drive',
          battlePlan: '3 rounds\n• 10–12 Light Bar Hip Thrusts\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/roi44n5q_download%20%2810%29.png',
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
          duration: '14–16 min',
          description: 'Builds glute lockout with band top range tension',
          battlePlan: '4 rounds\n• 10 Banded Hip Thrusts\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/odvl0o6h_ht.webp',
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
          duration: '14–16 min',
          description: 'Unilateral load prevents imbalance and aids stability',
          battlePlan: '3 rounds\n• 8–10 per leg Single‑Leg Hip Thrusts\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/sq01qvar_image.png',
          intensityReason: 'One‑leg thrust isolates glutes for stronger balance',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep pelvis level, don\'t rotate hips down',
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
          duration: '16–18 min',
          description: 'Barbell lift grows strength and posterior hip power',
          battlePlan: '4 rounds\n• 6–8 Heavy Hip Thrusts\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/odvl0o6h_ht.webp',
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
          duration: '16–18 min',
          description: 'Finisher combo challenges endurance and contraction',
          battlePlan: '3 rounds\n• 8–10 Hip Thrusts\nFinish with 10s Iso Hold at top\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/roi44n5q_download%20%2810%29.png',
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
          duration: '10–12 min',
          description: 'Pad press hip drive builds foundation safely first',
          battlePlan: '3 rounds\n• 10–12 per leg Kickbacks\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/u602jvhu_download%20%289%29.png',
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
          duration: '10–12 min',
          description: 'Seated pad drive provides beginner stability focus',
          battlePlan: '3 rounds\n• 12 per leg Seated Kickbacks\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/k5zii6kf_download%20%288%29.png',
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
          duration: '14–16 min',
          description: 'Progressive overload builds strength at extension',
          battlePlan: '4 rounds\n• 8–10 Heavy Kickbacks per leg\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/u602jvhu_download%20%289%29.png',
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
          duration: '14–16 min',
          description: 'Strict tempo isolates stronger contraction at end',
          battlePlan: '3 rounds\n• 8 per leg Pause Kickbacks\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/k5zii6kf_download%20%288%29.png',
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
          duration: '16–18 min',
          description: 'Sequential weight drops demand non‑stop contraction',
          battlePlan: '3 rounds\n• 8 Heavy Kickbacks per leg\n• Drop 15% weight → 6–8 reps\n• Drop 15% again → 6–8 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/u602jvhu_download%20%289%29.png',
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
          duration: '16–18 min',
          description: 'Static‑dynamic combo adds brutal finishing stimulus',
          battlePlan: '4 rounds\n• 8 Kickbacks each leg\nFinish with 10s Iso Hold on last rep\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/k5zii6kf_download%20%288%29.png',
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
          duration: '10–12 min',
          description: 'Intro machine work builds stability in outer hips',
          battlePlan: '3 rounds\n• 12–15 Abductions\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/o6mep0pr_ha.webp',
          intensityReason: 'Basic seated movement strengthens glute medius',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stay upright; push knees outward slow',
              description: 'Upright posture ensures proper glute medius activation.'
            },
            {
              icon: 'shield',
              title: 'Don\'t slam pads together when resting',
              description: 'Controlled return prevents momentum and maintains muscle tension.'
            }
          ]
        },
        {
          name: 'Lean Forward Abduction',
          duration: '10–12 min',
          description: 'Shifts emphasis effectively into upper glute tissues',
          battlePlan: '3 rounds\n• 12–15 Lean Abductions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/ca2oebzr_lfha.png',
          intensityReason: 'Lean angle biases deeper glute muscle activity',
          moodTips: [
            {
              icon: 'construct',
              title: 'Lean 20–30° forward with chest down',
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
          duration: '14–16 min',
          description: 'Combo band+machine emphasizes hypertrophy work',
          battlePlan: '4 rounds\n• 12 Banded Abductions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/o6mep0pr_ha.webp',
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
          duration: '14–16 min',
          description: 'Asymmetry training balances strength between hips',
          battlePlan: '4 rounds\n• 8–10 per side Abductions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/eqwbozow_Screenshot%202025-12-02%20at%204.48.10%E2%80%AFPM.png',
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
          duration: '16–18 min',
          description: 'Stacked reps crush glute medius with high overload',
          battlePlan: '3 rounds\n• 12 Heavy Abductions\n• Drop 20% → 10 reps\n• Drop 20% again → 10 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/o6mep0pr_ha.webp',
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
          duration: '16–18 min',
          description: 'Brutal pairing fully activates and fatigues hips',
          battlePlan: '3 rounds\n• 10s Iso Hold wide\n• 10–12 Full Reps immediately after\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/eqwbozow_Screenshot%202025-12-02%20at%204.48.10%E2%80%AFPM.png',
          intensityReason: 'Iso hold primes glutes then high‑rep sets extend',
          moodTips: [
            {
              icon: 'timer',
              title: 'Brace pad wide for 10s then repeat',
              description: 'Sustained contraction pre-fatigues muscles for enhanced training effect.'
            },
            {
              icon: 'construct',
              title: 'Don\'t lean, keep torso locked tall',
              description: 'Immediate transition maintains fatigue and training intensity.'
            }
          ]
        }
      ]
    }
  }
];

// Complete Hamstrings workout database with detailed battle plans and MOOD tips
const hamstringsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Dumbbell RDL',
          duration: '10–12 min',
          description: 'Teaches safe mechanics and stretch for hypertrophy',
          battlePlan: '3 rounds\n• 10–12 Dumbbell RDLs\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/d1gxk1c1_download%20%2818%29.png',
          intensityReason: 'Starter hinge builds hamstring stretch and control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep dumbbells close to legs during hinge',
              description: 'Proper path ensures maximum hamstring activation and safety.'
            },
            {
              icon: 'body',
              title: 'Slight knee bend, spine neutral throughout',
              description: 'Maintain neutral spine to protect back while targeting hamstrings.'
            }
          ]
        },
        {
          name: 'Dumbbell Good Morning (Chest Hold)',
          duration: '10–12 min',
          description: 'Difficult lift, always start light and progress slowly',
          battlePlan: '3 rounds\n• 8–10 DB Good Mornings\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/vgioydhr_dbgm.jpg',
          intensityReason: 'Upright hinge challenges hamstrings + posture',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Hold DB tight to chest, elbows in',
              description: 'Secure grip maintains stability during hinge movement.'
            },
            {
              icon: 'trending-down',
              title: 'Push hips back, don\'t let chest drop',
              description: 'Hip hinge pattern protects spine while loading hamstrings.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Staggered‑Stance DB RDL',
          duration: '14–16 min',
          description: 'Single‑leg hinge balances strength across sides',
          battlePlan: '4 rounds\n• 8 per side Staggered RDLs\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/skovrpoc_image.png',
          intensityReason: 'Split stance emphasizes deeper hamstring load',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stagger feet, 80% load on front leg',
              description: 'Uneven weight distribution targets working side hamstrings.'
            },
            {
              icon: 'trending-down',
              title: 'Control descent for full hamstring stretch',
              description: 'Slow eccentric maximizes muscle lengthening and development.'
            }
          ]
        },
        {
          name: 'DB Deficit RDL',
          duration: '14–16 min',
          description: 'Elevation increases hypertrophy by extended ROM',
          battlePlan: '3 rounds\n• 8–10 Deficit DB RDLs\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/4qp237ff_download%20%283%29.png',
          intensityReason: 'Deficit stance adds longer hamstring stretch load',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stand on plate, keep DBs close to thighs',
              description: 'Elevated position increases range of motion for deeper stretch.'
            },
            {
              icon: 'flash',
              title: 'Lower under strict control, drive up steady',
              description: 'Controlled movement prevents injury while maximizing benefit.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Paused DB RDL',
          duration: '16–18 min',
          description: 'Burns hamstrings with static stress and strict tempo',
          battlePlan: '4 rounds\n• 6–8 Paused DB RDLs\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/5v2oyit3_dbrdl.webp',
          intensityReason: 'Pausing mid‑shin removes momentum, builds control',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at mid‑shin, don\'t lose brace',
              description: 'Isometric hold increases time under tension and control.'
            },
            {
              icon: 'flash',
              title: 'Explode up smooth, no jerking bar path',
              description: 'Controlled concentric prevents injury and maximizes power.'
            }
          ]
        },
        {
          name: '1½ Rep DB RDL Combo',
          duration: '16–18 min',
          description: 'Complex set multiplies time under hamstring tension',
          battlePlan: '3 rounds\n• 8 Combo Reps (full + half = 1 rep)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/vj5eokcy_download%20%2817%29.png',
          intensityReason: 'Adds half reps between full reps for constant stress',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform one full + one half as one rep',
              description: 'Complex rep pattern extends time under tension significantly.'
            },
            {
              icon: 'construct',
              title: 'Keep tempo smooth, no bouncing at knees',
              description: 'Smooth rhythm prevents momentum and maintains muscle tension.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Barbell RDL',
          duration: '10–12 min',
          description: 'Fundamental builder, strengthen hinge with light loads',
          battlePlan: '3 rounds\n• 10 Barbell RDLs\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/46ki5rsl_download%20%2815%29.png',
          intensityReason: 'Basic hinge develops hamstrings under straight bar',
          moodTips: [
            {
              icon: 'construct',
              title: 'Bar slides on thighs down shin',
              description: 'Close bar path maximizes hamstring engagement throughout range.'
            },
            {
              icon: 'body',
              title: 'Keep knees soft, brace abs fully',
              description: 'Slight knee bend with core stability protects spine.'
            }
          ]
        },
        {
          name: 'Barbell Good Morning (Light!)',
          duration: '10–12 min',
          description: 'Hard lift, best done light for controlled practice',
          battlePlan: '3 rounds\n• 8 Good Mornings\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/vysbxwqg_download%20%2816%29.png',
          intensityReason: 'Bar on back hinge is effective but very demanding',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Barbell resting high traps, chest open',
              description: 'Proper bar position distributes load safely across shoulders.'
            },
            {
              icon: 'trending-down',
              title: 'Shift hips back, spine locked neutral',
              description: 'Hip hinge movement protects spine while loading hamstrings.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Barbell Pause RDL',
          duration: '14–16 min',
          description: 'Strict hold eliminates momentum, builds hamstring size',
          battlePlan: '4 rounds\n• 8 RDLs (2s pause at shin)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/46ki5rsl_download%20%2815%29.png',
          intensityReason: 'Mid‑hinge pause increases hamstring strength time',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s across shin level',
              description: 'Isometric hold at stretched position builds strength.'
            },
            {
              icon: 'construct',
              title: 'Keep bar tight against body always',
              description: 'Close bar path maintains hamstring tension throughout.'
            }
          ]
        },
        {
          name: 'Barbell Deficit RDL',
          duration: '14–16 min',
          description: 'Creates extra tension through hamstring length ROM',
          battlePlan: '3 rounds\n• 6–8 Deficit Barbell RDLs\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/chdxu3vk_deficit%20rdl.jpg',
          intensityReason: 'Standing elevated extends hinge stretch fully',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stand on 2‑inch plates, core tight',
              description: 'Elevated position increases range for deeper hamstring stretch.'
            },
            {
              icon: 'flash',
              title: 'Drive hips through, don\'t round spine',
              description: 'Hip drive with spine neutral maximizes safety and power.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Barbell Tempo RDL',
          duration: '16–18 min',
          description: 'Strict controlled pace maximizes hypertrophy stimulus',
          battlePlan: '4 rounds\n• 6 Tempo RDLs (3s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/46ki5rsl_download%20%2815%29.png',
          intensityReason: '3s eccentric raises time under tension dramatically',
          moodTips: [
            {
              icon: 'timer',
              title: '3s lowering, 1s up, stay locked core',
              description: 'Extended eccentric with fast concentric maximizes hypertrophy.'
            },
            {
              icon: 'construct',
              title: 'Don\'t rush, hold bar close body',
              description: 'Tempo control with proper bar path ensures safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Barbell RDL + Rack Pull Combo',
          duration: '16–18 min',
          description: 'Hamstring fatigue plus power finish explosively',
          battlePlan: '3 rounds\n• 6 RDLs\n• 4 Rack Pulls heavy\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/joz0sngb_download%20%2814%29.png',
          intensityReason: 'Heavy rack pulls pair with RDL for full overload',
          moodTips: [
            {
              icon: 'construct',
              title: 'Start with RDLs strict tempo',
              description: 'Begin with controlled movement to pre-fatigue hamstrings.'
            },
            {
              icon: 'flash',
              title: 'Finish with heavy rack pulls top half',
              description: 'Heavy partial range builds strength at strongest position.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Roman Chair',
    icon: 'square-outline',
    workouts: {
      beginner: [
        {
          name: 'Roman Chair Back Extension',
          duration: '10–12 min',
          description: 'Establish hinge mechanics for beginner lifters',
          battlePlan: '3 rounds\n• 12–15 Back Extensions\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/srezw23f_rc.webp',
          intensityReason: 'Bodyweight hinge builds hamstring control safely',
          moodTips: [
            {
              icon: 'body',
              title: 'Cross arms chest, move spine locked',
              description: 'Arm position and spine stability ensure proper movement pattern.'
            },
            {
              icon: 'trending-down',
              title: 'Stop when hamstring stretch felt',
              description: 'Range of motion should be dictated by hamstring flexibility.'
            }
          ]
        },
        {
          name: 'Roman Chair Good Morning',
          duration: '10–12 min',
          description: 'Strengthens core as hamstrings extend repeatedly',
          battlePlan: '3 rounds\n• 12 Good Morning Reps (bodyweight)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/p2gogdp0_download%20%2820%29.png',
          intensityReason: 'Torso hinge without load builds basic stability',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep hips anchored, hinge down slow',
              description: 'Hip stability with controlled descent builds foundational strength.'
            },
            {
              icon: 'shield',
              title: 'Avoid jerking torso quickly upward',
              description: 'Smooth movement prevents injury and maintains muscle tension.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Weighted Back Extension',
          duration: '14–16 min',
          description: 'Resistance progression builds hypertrophy effectively',
          battlePlan: '4 rounds\n• 10 Weighted Back Extensions\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/srezw23f_rc.webp',
          intensityReason: 'Hug plate to overload hamstring hinge movement',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Hug plate chest tight secure',
              description: 'Secure grip and body position maintain safety under load.'
            },
            {
              icon: 'shield',
              title: 'Don\'t hyperextend spine upwards',
              description: 'Controlled range prevents back hyperextension injury.'
            }
          ]
        },
        {
          name: 'Single‑Leg Extension',
          duration: '14–16 min',
          description: 'Forces balance and greater range for each limb',
          battlePlan: '3 rounds\n• 8–10 per side\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/v9w417gg_slrcext.jpg',
          intensityReason: 'Single leg increases unilateral hamstring stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'One leg braced, hinge slow',
              description: 'Single leg work challenges balance and unilateral strength.'
            },
            {
              icon: 'body',
              title: 'Keep hips square to bench pad',
              description: 'Hip stability prevents compensation and ensures proper targeting.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Pause Back Extension',
          duration: '16–18 min',
          description: 'Eliminates swing, prolongs posterior chain tension',
          battlePlan: '3 rounds\n• 8 Paused Extensions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/srezw23f_rc.webp',
          intensityReason: 'Static hold at hinge builds hamstring isometric work',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at mid‑hinge low',
              description: 'Isometric hold at stretched position builds control and strength.'
            },
            {
              icon: 'flash',
              title: 'Drive back up locked glutes strong',
              description: 'Explosive concentric with glute finish maximizes power development.'
            }
          ]
        },
        {
          name: 'Alternating Half + Full Extensions',
          duration: '16–18 min',
          description: 'Alternating range burns hamstrings under long tension',
          battlePlan: '3 rounds\n• 8 Alternating Half + Full Extensions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/p2gogdp0_download%20%2820%29.png',
          intensityReason: 'Half + full reps cycle extend muscle set time fully',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform half rep then follow with full',
              description: 'Alternating range pattern extends time under tension significantly.'
            },
            {
              icon: 'construct',
              title: 'Smooth alternating rhythm each rep',
              description: 'Consistent rhythm maintains muscle tension throughout set.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Leg Curl Machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Seated Leg Curl',
          duration: '10–12 min',
          description: 'Best beginner machine for full hamstring engagement',
          battlePlan: '3 rounds\n• 12–15 Seated Leg Curls\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/3vkyuj1o_download%20%2819%29.png',
          intensityReason: 'Isolated seat curl strengthens flexion carefully',
          moodTips: [
            {
              icon: 'body',
              title: 'Sit back flat, grip seat firmly',
              description: 'Stable position allows focused hamstring isolation.'
            },
            {
              icon: 'construct',
              title: 'Curl steady, avoid pad slam return',
              description: 'Controlled movement prevents machine stress and maintains tension.'
            }
          ]
        },
        {
          name: 'Lying Leg Curl',
          duration: '10–12 min',
          description: 'Fixed setup ensures strict hypertrophy contraction',
          battlePlan: '3 rounds\n• 12–15 Lying Curls\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/o9f5gltv_Screenshot%202025-12-02%20at%2010.29.39%E2%80%AFPM.png',
          intensityReason: 'Lying pad curl isolates hamstring contraction',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep hips glued to pad tight',
              description: 'Hip stability ensures proper hamstring isolation throughout range.'
            },
            {
              icon: 'flash',
              title: 'Raise slow, hold, lower controlled',
              description: 'Tempo control maximizes muscle activation and development.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Leg Curl',
          duration: '14–16 min',
          description: 'Increased weight overload boosts hypertrophy',
          battlePlan: '4 rounds\n• 8–10 Heavy Curls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/3vkyuj1o_download%20%2819%29.png',
          intensityReason: 'Progressive loading builds hamstrings thickness',
          moodTips: [
            {
              icon: 'shield',
              title: 'Brace core firm, pad curl explosive',
              description: 'Core stability allows maximum force transfer to hamstrings.'
            },
            {
              icon: 'flash',
              title: 'Finish with hard squeeze up top',
              description: 'Peak contraction at top maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Pause Leg Curl',
          duration: '14–16 min',
          description: 'Pausing at top peaks hamstring contraction force',
          battlePlan: '3 rounds\n• 8–10 Pause Reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/o9f5gltv_Screenshot%202025-12-02%20at%2010.29.39%E2%80%AFPM.png',
          intensityReason: 'Isometric hold raises muscular control demand',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at top under max flexion',
              description: 'Isometric hold at peak contraction builds strength and control.'
            },
            {
              icon: 'construct',
              title: 'Resist pad lowering too fast',
              description: 'Controlled eccentric maintains tension and prevents momentum.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop‑Set Curl',
          duration: '16–18 min',
          description: 'Hamstrings stay under work far beyond normal set',
          battlePlan: '3 rounds\n• 8 Heavy Curls\n• Drop 15–20% → 8 reps\n• Drop 15–20% → 8 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/3vkyuj1o_download%20%2819%29.png',
          intensityReason: 'Drop weights prolong contraction by overload reps',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% weight quickly',
              description: 'Fast transitions maintain fatigue and extend training stimulus.'
            },
            {
              icon: 'construct',
              title: 'Keep tempo matched across drops',
              description: 'Consistent movement quality throughout all drop sets.'
            }
          ]
        },
        {
          name: 'Curl + Iso Hold',
          duration: '16–18 min',
          description: 'Endurance builder combining iso with normal reps',
          battlePlan: '3 rounds\n• 8–10 Leg Curls\nFinish 10s Iso Hold @ top\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/o9f5gltv_Screenshot%202025-12-02%20at%2010.29.39%E2%80%AFPM.png',
          intensityReason: 'Finish set with hold for longer contraction stress',
          moodTips: [
            {
              icon: 'timer',
              title: 'Final rep hold 10s curl peak',
              description: 'Extended isometric hold maximizes metabolic stress on hamstrings.'
            },
            {
              icon: 'construct',
              title: 'Stay tight as pad pulls downward',
              description: 'Maintain contraction against resistance throughout hold period.'
            }
          ]
        }
      ]
    }
  }
];

// Complete Quadriceps workout database with detailed battle plans and MOOD tips
const quadricepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Barbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Barbell Sissy Squat',
          duration: '10–12 min',
          description: 'Front held bar guides posture as quads take full load',
          battlePlan: '3 rounds\n• 10–12 Light Barbell Sissy Squats\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/sjqdvile_bbss.jpg',
          intensityReason: 'Teaches quad isolation through knee forward motion',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold bar against hips, elbows tucked in',
              description: 'Proper bar position maintains stability during quad isolation.'
            },
            {
              icon: 'trending-down',
              title: 'Lean back, knees push forward smoothly',
              description: 'Knee-forward motion maximizes quad activation while maintaining control.'
            }
          ]
        },
        {
          name: 'Assisted Sissy Squat Hold',
          duration: '10–12 min',
          description: 'Static hold reinforces posture and leg strength',
          battlePlan: '3 rounds\n• 6–8 Sissy Squats\n• Add 10s Hold each set\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/sjqdvile_bbss.jpg',
          intensityReason: 'Iso hold at squat bottom builds quad endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'At bottom hold position for 10s',
              description: 'Extended hold at bottom position builds isometric quad strength.'
            },
            {
              icon: 'flash',
              title: 'Drive knees forward, chest upright',
              description: 'Proper positioning ensures maximum quad engagement during hold.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Weighted Sissy Squat',
          duration: '14–16 min',
          description: 'Adds weight to sissy squat for deeper hypertrophy',
          battlePlan: '4 rounds\n• 8–10 Weighted Sissy Squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/3hob85xt_download%20%2822%29.png',
          intensityReason: 'Front bar load progression maximizes quad stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold bar firm at hip hinge crease',
              description: 'Secure bar position allows for controlled weighted movement.'
            },
            {
              icon: 'trending-down',
              title: 'Control descent, heels flat anchored',
              description: 'Controlled movement with stable base maximizes quad activation.'
            }
          ]
        },
        {
          name: 'Sissy Squat 1½ Reps',
          duration: '14–16 min',
          description: 'High tension squatting style grows endurance fast',
          battlePlan: '3 rounds\n• 8 Combo Reps (half + full = 1)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/sjqdvile_bbss.jpg',
          intensityReason: 'Half+full rep sequence lengthens quad activation',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform half rep, then full as one',
              description: 'Complex rep pattern extends time under tension for quads.'
            },
            {
              icon: 'construct',
              title: 'Keep bar tight, don\'t roll forward',
              description: 'Maintain bar position and posture throughout complex movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Barbell Hack Squat',
          duration: '16–18 min',
          description: 'Upright torso hack squat builds quads with tension',
          battlePlan: '4 rounds\n• 8–10 Hack Squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/3hob85xt_download%20%2822%29.png',
          intensityReason: 'Behind back hold redirects load heavily to quads',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Bar low behind legs, shoulders tall',
              description: 'Proper bar positioning ensures maximum quad emphasis.'
            },
            {
              icon: 'flash',
              title: 'Drive knees forward over toes steady',
              description: 'Forward knee drive maintains quad focus throughout movement.'
            }
          ]
        },
        {
          name: 'Sissy + Hack Squat Combo',
          duration: '16–18 min',
          description: 'Dual movement combo overloads quads with fatigue',
          battlePlan: '3 rounds\n• 6 Front Hold Sissy Squats\n• 6 Barbell Hack Squats\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/sjqdvile_bbss.jpg',
          intensityReason: 'Pairing front and back styles crushes quad fibers',
          moodTips: [
            {
              icon: 'construct',
              title: 'Do sissy squats first to pre fatigue',
              description: 'Pre-fatigue strategy maximizes quad overload in combination.'
            },
            {
              icon: 'flash',
              title: 'Transition fast to hack squats next',
              description: 'Quick transition maintains fatigue for maximum quad stress.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Leg Extension Machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Standard Leg Extension',
          duration: '10–12 min',
          description: 'Perfect intro for building controlled quad strength',
          battlePlan: '3 rounds\n• 12–15 Leg Extensions\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/er89oli2_download%20%2823%29.png',
          intensityReason: 'Isolates quads through safe guided flexion path',
          moodTips: [
            {
              icon: 'body',
              title: 'Sit upright with back pressed tight',
              description: 'Proper seating position ensures isolated quad activation.'
            },
            {
              icon: 'construct',
              title: 'Kick straight, avoid locking knees',
              description: 'Controlled extension prevents joint stress while targeting quads.'
            }
          ]
        },
        {
          name: 'Iso Extension Hold',
          duration: '10–12 min',
          description: 'Builds mind muscle connection through iso tension',
          battlePlan: '3 rounds\n• 8–10 Iso Hold Extensions (3s hold)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/6hwlna7o_quad%20ext.png',
          intensityReason: 'Holding peak strengthens quads safely under load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Extend, hold 3s peak contraction',
              description: 'Isometric hold at peak builds strength and muscle control.'
            },
            {
              icon: 'construct',
              title: 'Lower pad smooth each rep',
              description: 'Controlled eccentric maximizes quad development.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Extensions',
          duration: '14–16 min',
          description: 'Machine allows safe overload using strict form',
          battlePlan: '4 rounds\n• 8–10 Heavy Extensions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/er89oli2_download%20%2823%29.png',
          intensityReason: 'Progressive heavy loading maximizes quad growth',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Grip handles tight to stabilize',
              description: 'Secure grip maintains stability for heavy quad extensions.'
            },
            {
              icon: 'flash',
              title: 'Drive pad up forceful, control back',
              description: 'Explosive concentric with controlled eccentric builds strength.'
            }
          ]
        },
        {
          name: '1½ Rep Leg Extensions',
          duration: '14–16 min',
          description: 'Longer muscle strain increases hypertrophy response',
          battlePlan: '3 rounds\n• 8–10 Total Combo Reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/6hwlna7o_quad%20ext.png',
          intensityReason: 'Half+full rep cycle expands quad time under load',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform one half + one full rep',
              description: 'Complex rep pattern extends time under tension significantly.'
            },
            {
              icon: 'construct',
              title: 'Keep tempo smooth, don\'t drop pad',
              description: 'Controlled movement maintains tension throughout range.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Set Leg Extensions',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 10 Heavy Extensions\n• Drop 15–20% → 8 reps\n• Drop 15–20% → 8 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/er89oli2_download%20%2823%29.png',
          intensityReason: 'Dropsets extend effort for intense quad overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strip 15–20% weight fast',
              description: 'Quick weight reduction maintains fatigue for maximum benefit.'
            },
            {
              icon: 'construct',
              title: 'Don\'t rush, keep controlled tempo',
              description: 'Maintain movement quality throughout all drop sets.'
            }
          ]
        },
        {
          name: 'Leg Extension Iso Burnout',
          duration: '16–18 min',
          description: 'Pairing holds with reps completely crushes quads',
          battlePlan: '3 rounds\n• 10s Iso Hold at Extension\n• Immediately 10–12 Full Reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/6hwlna7o_quad%20ext.png',
          intensityReason: 'Static hold plus reps maximizes quad endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold pad high for 10s, then rep out',
              description: 'Isometric hold followed by reps creates maximum quad fatigue.'
            },
            {
              icon: 'shield',
              title: 'No bouncing pad into stack',
              description: 'Controlled movement prevents equipment damage and injury.'
            }
          ]
        }
      ]
    }
  }
];

// Complete Calves workout database with detailed battle plans and MOOD tips
const calvesWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Standing DB Calf Raise',
          duration: '10–12 min',
          description: 'Simple standing lift for foundational calf development',
          battlePlan: '3 rounds\n• 15–20 Standing Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/ag6d909x_download%20%2828%29.png',
          intensityReason: 'Basic raise builds calf strength with controlled range',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold dumbbells, stand tall, rise high',
              description: 'Proper posture and maximum range ensure effective calf activation.'
            },
            {
              icon: 'trending-down',
              title: 'Control descent, feel full stretch low',
              description: 'Controlled eccentric maximizes muscle development and safety.'
            }
          ]
        },
        {
          name: 'Seated DB Calf Raise',
          duration: '10–12 min',
          description: 'Targets deeper calf muscle with stable seated form',
          battlePlan: '3 rounds\n• 12–15 Seated Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/1iqoqmt3_download%20%2829%29.png',
          intensityReason: 'Seated position isolates soleus muscle for growth',
          moodTips: [
            {
              icon: 'construct',
              title: 'Place DB on knee, press through ball of foot',
              description: 'Proper weight placement ensures targeted soleus activation.'
            },
            {
              icon: 'shield',
              title: 'Control stretch, avoid bouncing weight',
              description: 'Smooth movement prevents injury and maintains muscle tension.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Single‑Leg DB Calf Raise',
          duration: '14–16 min',
          description: 'Isolates each calf for balanced strength and size',
          battlePlan: '4 rounds\n• 10–12 per leg Single‑Leg Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/comj9q78_download%20%284%29.png',
          intensityReason: 'Unilateral raise increases load and balance demand',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold DB opposite working leg, use wall for balance',
              description: 'Strategic weight placement and support optimize single-leg training.'
            },
            {
              icon: 'shield',
              title: 'Rise high, control stretch, no bouncing',
              description: 'Full range with control maximizes unilateral calf development.'
            }
          ]
        },
        {
          name: 'DB Calf Raise (Tempo + Bodyweight)',
          duration: '14–16 min',
          description: 'Controlled tempo builds endurance and hypertrophy',
          battlePlan: '3 rounds\n• 10–12 Tempo Calf Raises\n• • Immediately 15 Bodyweight Calf Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/1iqoqmt3_download%20%2829%29.png',
          intensityReason: 'Slow eccentric phase maximizes calf time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: '3s lowering, 1s hold top, 1s up',
              description: 'Strict tempo control maximizes muscle activation and growth.'
            },
            {
              icon: 'flash',
              title: 'Finish with quick bodyweight reps',
              description: 'High-rep finisher extends training stimulus beyond failure.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'DB Calf Raise (Drop Set)',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 12 Heavy Calf Raises\n• Drop 15–20% → 10 reps\n• Drop 15–20% → 10 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/ag6d909x_download%20%2828%29.png',
          intensityReason: 'Drop sets extend effort for intense calf overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% weight fast, keep going',
              description: 'Quick weight reduction maintains fatigue for maximum benefit.'
            },
            {
              icon: 'construct',
              title: 'Maintain full range across all drops',
              description: 'Consistent form throughout drops ensures continued effectiveness.'
            }
          ]
        },
        {
          name: 'DB Calf Raise (Iso + Jumps)',
          duration: '16–18 min',
          description: 'Combo reps with iso hold completely crushes calves',
          battlePlan: '3 rounds\n• 12–15 Calf Raises\n• Finish with 10s Iso Hold at top\n• Immediately 10 Stiff Leg Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/1iqoqmt3_download%20%2829%29.png',
          intensityReason: 'Static hold at peak contraction maximizes tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak contraction 10s on last rep',
              description: 'Isometric hold maximizes muscle tension and metabolic stress.'
            },
            {
              icon: 'flash',
              title: 'Explode into jumps, land soft on balls',
              description: 'Plyometric finish develops power and completes muscle fatigue.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Standing Barbell Calf Raise',
          duration: '10–12 min',
          description: 'Classic standing raise for overall calf development',
          battlePlan: '3 rounds\n• 15–20 Standing Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/vfevelz1_download%20%2824%29.png',
          intensityReason: 'Barbell load builds foundational calf strength',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Bar on traps, stand tall, rise high',
              description: 'Proper bar position and posture maximize calf activation safely.'
            },
            {
              icon: 'trending-down',
              title: 'Control descent, feel full stretch low',
              description: 'Full range of motion maximizes muscle development.'
            }
          ]
        },
        {
          name: 'Barbell Calf Raise (Elevated)',
          duration: '10–12 min',
          description: 'Plate under toes enhances calf muscle activation',
          battlePlan: '3 rounds\n• 12–15 Elevated Calf Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/xf7sknhj_download%20%2825%29.png',
          intensityReason: 'Elevated toes increase stretch for deeper range',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stand on 1–2" plate, heels off edge',
              description: 'Elevated position increases range for deeper calf stretch.'
            },
            {
              icon: 'flash',
              title: 'Control stretch, rise high on toes',
              description: 'Extended range maximizes muscle activation and development.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Barbell Calf Raise',
          duration: '14–16 min',
          description: 'Builds strength and control through isometric hold',
          battlePlan: '4 rounds\n• 10–12 Pause Calf Raises\n• Immediately 15 Bodyweight Calf Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/vfevelz1_download%20%2824%29.png',
          intensityReason: 'Pause at top maximizes peak contraction tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at peak contraction',
              description: 'Isometric hold builds strength and muscle control.'
            },
            {
              icon: 'flash',
              title: 'Finish with quick bodyweight reps',
              description: 'High-rep finisher extends stimulus beyond normal capacity.'
            }
          ]
        },
        {
          name: 'Barbell Calf Raise (Tempo)',
          duration: '14–16 min',
          description: 'Controlled tempo builds endurance and hypertrophy',
          battlePlan: '3 rounds\n• 10–12 Tempo Calf Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/xf7sknhj_download%20%2825%29.png',
          intensityReason: 'Slow eccentric phase maximizes calf time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: '3s lowering, 1s hold top, 1s up',
              description: 'Tempo control maximizes time under tension for growth.'
            },
            {
              icon: 'construct',
              title: 'Keep full range, don\'t cut reps short',
              description: 'Complete range of motion ensures maximum muscle activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Barbell Calf Raise (Drop Set)',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 12 Heavy Calf Raises\n• Drop 15–20% → 10 reps\n• Drop 15–20% → 10 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/vfevelz1_download%20%2824%29.png',
          intensityReason: 'Drop sets extend effort for intense calf overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% weight fast, keep going',
              description: 'Quick transitions maintain fatigue for maximum overload.'
            },
            {
              icon: 'construct',
              title: 'Maintain full range across all drops',
              description: 'Consistent form throughout ensures continued effectiveness.'
            }
          ]
        },
        {
          name: 'Barbell Calf Raise (Iso + Jumps)',
          duration: '16–18 min',
          description: 'Combo reps with iso hold completely crushes calves',
          battlePlan: '3 rounds\n• 12–15 Calf Raises\n• Finish with 10s Iso Hold at top\n• Immediately 10 Stiff Leg Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/xf7sknhj_download%20%2825%29.png',
          intensityReason: 'Static hold at peak contraction maximizes tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak contraction 10s on last rep',
              description: 'Extended isometric maximizes metabolic stress on calves.'
            },
            {
              icon: 'flash',
              title: 'Explode into jumps, land soft on balls',
              description: 'Plyometric finish develops power and completes fatigue.'
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
          name: 'Leg Press Calf Raise (Neutral)',
          duration: '10–12 min',
          description: 'Basic press for foundational calf development',
          battlePlan: '3 rounds\n• 15–20 Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/jwime8o9_download%20%2830%29.png',
          intensityReason: 'Machine guidance builds calf strength safely',
          moodTips: [
            {
              icon: 'construct',
              title: 'Feet shoulder width, toes on bottom edge',
              description: 'Proper foot placement ensures optimal calf activation angle.'
            },
            {
              icon: 'flash',
              title: 'Press through balls of feet, full stretch',
              description: 'Complete range maximizes calf muscle development.'
            }
          ]
        },
        {
          name: 'Leg Press Calf Raise (Toes Out)',
          duration: '10–12 min',
          description: 'Foot angle variation for balanced calf growth and stimulation',
          battlePlan: '3 rounds\n• 12–15 Toes Out Calf Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/02ysdj6y_download%20%2831%29.png',
          intensityReason: 'Toes out stance targets inner calf muscle fibers',
          moodTips: [
            {
              icon: 'construct',
              title: 'Toes pointed out 45°, heels off edge',
              description: 'Angled foot position targets different calf muscle fibers.'
            },
            {
              icon: 'flash',
              title: 'Control stretch, rise high on toes',
              description: 'Full range with angle variation maximizes muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Single‑Leg Press Calf Raise',
          duration: '14–16 min',
          description: 'Isolates each calf for balanced strength and size',
          battlePlan: '4 rounds\n• 10–12 per leg Single‑Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/kwq6qti7_Screenshot%202025-12-06%20at%209.20.46%E2%80%AFPM.png',
          intensityReason: 'Unilateral raise increases load and balance demand',
          moodTips: [
            {
              icon: 'construct',
              title: 'One foot on platform, other off',
              description: 'Single-leg setup doubles load and improves balance.'
            },
            {
              icon: 'flash',
              title: 'Press through ball of foot, full stretch',
              description: 'Complete range ensures maximum unilateral development.'
            }
          ]
        },
        {
          name: 'Leg Press Calf Raise',
          duration: '14–16 min',
          description: 'Builds strength and control through isometric hold',
          battlePlan: '3 rounds\n• 10–12 Pause Calf Raises\n• Immediately 15 Bodyweight Calf Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/02ysdj6y_download%20%2831%29.png',
          intensityReason: 'Pause at top maximizes peak contraction tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at peak contraction',
              description: 'Isometric hold builds strength and muscle control.'
            },
            {
              icon: 'flash',
              title: 'Finish with quick bodyweight reps',
              description: 'High-rep finisher extends training beyond machine capacity.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Leg Press Calf Raise (Drop Set)',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 12 Heavy Calf Raises\n• Drop 15–20% → 10 reps\n• Drop 15–20% → 10 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/jwime8o9_download%20%2830%29.png',
          intensityReason: 'Drop sets extend effort for intense calf overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% weight fast, keep going',
              description: 'Quick weight reduction maintains fatigue for benefit.'
            },
            {
              icon: 'construct',
              title: 'Maintain full range across all drops',
              description: 'Consistent form throughout drops ensures effectiveness.'
            }
          ]
        },
        {
          name: 'Leg Press Calf Raise (Iso + Jumps)',
          duration: '16–18 min',
          description: 'Combo reps with iso hold completely crushes calves',
          battlePlan: '3 rounds\n• 12–15 Calf Raises\n• Finish with 10s Iso Hold at top\n• Immediately 10 Stiff Leg Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/02ysdj6y_download%20%2831%29.png',
          intensityReason: 'Static hold at peak contraction maximizes tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak contraction 10s on last rep',
              description: 'Extended hold maximizes metabolic stress on calves.'
            },
            {
              icon: 'flash',
              title: 'Explode into jumps, land soft on balls',
              description: 'Plyometric finish develops power and completes muscle fatigue.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Calf Raise Machine',
    icon: 'arrow-up',
    workouts: {
      beginner: [
        {
          name: 'Standing Calf Raise Machine',
          duration: '10–12 min',
          description: 'Basic standing raise for foundational calf development',
          battlePlan: '3 rounds\n• 15–20 Standing Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/kh18cxcw_Screenshot%202025-12-06%20at%209.24.28%E2%80%AFPM.png',
          intensityReason: 'Machine guidance builds calf strength safely',
          moodTips: [
            {
              icon: 'body',
              title: 'Stand tall, rise high on toes',
              description: 'Proper posture ensures maximum calf activation with machine guidance.'
            },
            {
              icon: 'trending-down',
              title: 'Control descent, feel full stretch low',
              description: 'Full range of motion maximizes muscle development safely.'
            }
          ]
        },
        {
          name: 'Seated Calf Raise Machine',
          duration: '10–12 min',
          description: 'Targets deeper calf muscle with stable seated form',
          battlePlan: '3 rounds\n• 12–15 Seated Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/tp1piceg_download%20%2826%29.png',
          intensityReason: 'Seated position isolates soleus muscle for growth',
          moodTips: [
            {
              icon: 'construct',
              title: 'Pad on knees, press through ball of foot',
              description: 'Proper pad placement ensures targeted soleus activation.'
            },
            {
              icon: 'shield',
              title: 'Control stretch, avoid bouncing weight',
              description: 'Smooth movement maintains tension and prevents injury.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Single‑Leg Calf Raise Machine',
          duration: '14–16 min',
          description: 'Isolates each calf for balanced strength and size',
          battlePlan: '4 rounds\n• 10–12 per leg Single‑Leg Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/97bkhdmm_Screenshot%202025-12-06%20at%209.25.30%E2%80%AFPM.png',
          intensityReason: 'Unilateral raise increases load and balance demand',
          moodTips: [
            {
              icon: 'construct',
              title: 'One foot on platform, other off',
              description: 'Single-leg setup doubles training load for each calf.'
            },
            {
              icon: 'flash',
              title: 'Press through ball of foot, full stretch',
              description: 'Complete range ensures maximum unilateral development.'
            }
          ]
        },
        {
          name: 'Calf Raise Machine',
          duration: '14–16 min',
          description: 'Builds strength and control through isometric hold',
          battlePlan: '3 rounds\n• 10–12 Pause Calf Raises\n• Immediately 15 Bodyweight Calf Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/tp1piceg_download%20%2826%29.png',
          intensityReason: 'Pause at top maximizes peak contraction tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at peak contraction',
              description: 'Isometric hold builds strength and muscle control.'
            },
            {
              icon: 'flash',
              title: 'Finish with quick bodyweight reps',
              description: 'High-rep finisher extends training beyond machine limit.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Calf Raise Machine (Drop Set)',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 12 Heavy Calf Raises\n• Drop 15–20% → 10 reps\n• Drop 15–20% → 10 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/1jerzr2s_download%20%2827%29.png',
          intensityReason: 'Drop sets extend effort for intense calf overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% weight fast, keep going',
              description: 'Quick transitions maintain fatigue for maximum overload.'
            },
            {
              icon: 'construct',
              title: 'Maintain full range across all drops',
              description: 'Consistent form throughout ensures continued effectiveness.'
            }
          ]
        },
        {
          name: 'Calf Raise Machine (Iso + Jumps)',
          duration: '16–18 min',
          description: 'Combo reps with iso hold completely crushes calves',
          battlePlan: '3 rounds\n• 12–15 Calf Raises\n• Finish with 10s Iso Hold at top\n• Immediately 10 Stiff Leg Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/tp1piceg_download%20%2826%29.png',
          intensityReason: 'Static hold at peak contraction maximizes tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak contraction 10s on last rep',
              description: 'Extended isometric maximizes metabolic stress on calves.'
            },
            {
              icon: 'flash',
              title: 'Explode into jumps, land soft on balls',
              description: 'Plyometric finish develops power and completes muscle fatigue.'
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
          description: 'Simple squat variation teaches control and balance with front load support.',
          battlePlan: '3 rounds\n• 10-12 goblet squats\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/iq16b1nm_download.png',
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
          description: 'Dumbbell hinge builds strength safely for beginners with proper form.',
          battlePlan: '3 rounds\n• 8-10 dumbbell RDLs\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/5v2oyit3_dbrdl.webp',
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
          description: 'Advanced split squat builds quads and glute drive with elevated rear foot.',
          battlePlan: '4 rounds\n• 8-10 bulgarian split squats per leg\nRest 75-90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/mxfs858v_dbbss.jpg',
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
          description: 'Trains quads, glutes, and groin through lateral range of motion.',
          battlePlan: '3 rounds\n• 8 per side Lateral Lunges\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/hiyqkn20_db%20lat%20lunge.jpg',
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
          description: 'Superset floods quads + hamstrings with volume for complete development.',
          battlePlan: '4 rounds\n• 8 DB Squats\n• 8 DB RDLs\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/elc9qz74_download%20%2813%29.png',
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
          description: 'Brutal high tension squat burns and builds depth strength.',
          battlePlan: '3 rounds\n• 10 Squats + 10s Hold + 6 Pulses\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/zkmq6vqh_download%20%281%29.png',
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
          description: 'Classic barbell squat lays foundation for leg strength and control.',
          battlePlan: '3 rounds\n• 8-10 back squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/gxoxkpbs_download%20%285%29.png',
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
          description: 'Reverse lunge reduces strain while building single leg strength.',
          battlePlan: '3 rounds\n• 8 per leg Reverse Lunges\nRest 75-90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/a96gl1sh_download%20%287%29.png',
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
          description: 'Beginner hinge teaches depth and hamstring control with barbell.',
          battlePlan: '3 rounds\n• 8-10 rack rdls\nRest 75-90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/cj6gx8ak_download%20%286%29.png',
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
          description: 'Front squat builds quads while demanding upright posture.',
          battlePlan: '4 rounds\n• 6-8 front squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/wag3ztrn_bbfs.jpg',
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
          description: 'Advanced unilateral builder with deeper range and balance challenge.',
          battlePlan: '4 rounds\n• 8-10 bulgarians per side\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/8m6t0a7f_Screenshot%202025-12-06%20at%207.08.54%E2%80%AFPM.png',
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
          description: 'Longer range hinge boosts hamstring hypertrophy with elevated position.',
          battlePlan: '3 rounds\n• 8-10 deficit rdls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/pmaididt_deficit%20rdl.jpg',
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
          description: 'Keeps muscles under control in deepest range with bottom pause.',
          battlePlan: '4 rounds\n• 6 Pause Back Squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/gxoxkpbs_download%20%285%29.png',
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
          description: 'Combination of strength, balance, and conditioning challenge.',
          battlePlan: '3 rounds\n• 20 steps total Walking Lunges\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/a96gl1sh_download%20%287%29.png',
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
          description: 'Hybrid superset crushes quads, glutes, and hamstrings together.',
          battlePlan: '4 rounds\n• 6 Back Squats\n• 6 Rack RDLs\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/cj6gx8ak_download%20%286%29.png',
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
          description: 'Basic press builds safety, posture, and control with machine support.',
          battlePlan: '3 rounds\n• 10-12 neutral leg press\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/l1ouzm6t_download%20%281%29.png',
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
          description: 'Targets quads more directly in safe range of motion.',
          battlePlan: '3 rounds\n• 10-12 narrow stance press\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/nbzhkmy8_download%20%282%29.png',
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
          description: 'Outside placement recruits posterior chain harder than narrow stance.',
          battlePlan: '4 rounds\n• 8-10 wide stance press\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/l1ouzm6t_download%20%281%29.png',
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
          description: 'One leg at a time reduces imbalances in strength development.',
          battlePlan: '4 rounds\n• 8 per leg Single Leg Press\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/pfq28xzl_Screenshot%202025-12-06%20at%207.18.57%E2%80%AFPM.png',
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
          description: 'Extends time under tension with progressive load reduction.',
          battlePlan: '3 rounds\n• 8 Heavy Press → Drop x2 (6–8 reps each)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/l1ouzm6t_download%20%281%29.png',
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
          description: 'Pausing forces muscles to do all the hard work without momentum.',
          battlePlan: '4 rounds\n• 8 Leg Press Reps (2s pause at bottom)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/nbzhkmy8_download%20%282%29.png',
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
          description: 'Basic hack squat introduces form and confidence with machine guidance.',
          battlePlan: '3 rounds\n• 10-12 hack squats\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/k4t4lzbt_download.png',
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
          description: 'Builds quad dominant strength with stable machine support.',
          battlePlan: '3 rounds\n• 8-10 narrow hack squats\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/ffi2msmn_hs.avif',
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
          description: 'Trains posterior chain through deeper ROM with wide stance.',
          battlePlan: '4 rounds\n• 8-10 wide hack squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/k4t4lzbt_download.png',
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
          description: 'Doubles lower leg work without switching machines for efficiency.',
          battlePlan: '4 rounds\n• 8 Hack Squats\n• Immediately 12 Hack Calf Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/igmrt7qu_hscr.jpg',
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
          description: 'Blends controlled pulses with full ROM squatting for hypertrophy.',
          battlePlan: '3 rounds\n• 6-8 hack squats (1 full + ½ rep = 1 rep)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/k4t4lzbt_download.png',
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
          description: 'Reverse stance hack builds posterior chain strength and development.',
          battlePlan: '4 rounds\n• 8-10 reverse hack squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/a9f6gtvn_rhs.jpg',
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
    equipment: 'Single Stack Cable Machine',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Cable Squat',
          duration: '10–12 min',
          description: 'Cable tension mimics goblet squat with safety and control.',
          battlePlan: '3 rounds\n• 10-12 cable squats\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/s4c1d5ao_download%20%283%29.png',
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
          description: 'Crossover cable step engages quads + glutes together with unilateral work.',
          battlePlan: '3 rounds\n• 8 per side Step Throughs\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/yt6adjli_image.png',
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
          description: 'Cable variation keeps constant load on posterior chain throughout ROM.',
          battlePlan: '4 rounds\n• 8-10 cable rdls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/btaq9it2_cable%20rdl.jpg',
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
          description: 'Great hypertrophy builder with guided constant tension throughout movement.',
          battlePlan: '4 rounds\n• 8-10 cable split squats per leg\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/rnzpjsna_Screenshot%202025-12-06%20at%207.23.45%E2%80%AFPM.png',
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
          description: 'Replicates barbell front squat with cable constant tension loading.',
          battlePlan: '4 rounds\n• 6-8 heavy cable front squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/s4c1d5ao_download%20%283%29.png',
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
          description: 'Superset blend targets both push + hinge chains with constant tension.',
          battlePlan: '4 rounds\n• 8 Cable Squats\n• 8 Cable RDLs\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/il3x97qs_download%20%283%29.png',
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
          battlePlan: '3 rounds\n• 8–10 Deadlift‑Style Trap Bar Squats\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/3cnpyyx1_tbss.webp',
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
          battlePlan: '3 rounds\n• 8–10 Neutral Squats\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/sbumk4mn_tbs.jpeg',
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
          battlePlan: '4 rounds\n• 6–8 Wide Stance Squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/3cnpyyx1_tbss.webp',
          intensityReason: 'wider base targets hips and glutes with a stronger emphasis',
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
          description: 'Slow descent builds control and hypertrophy for greater muscle growth',
          battlePlan: '4 rounds\n• 6–8 Squats (3–4s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/sbumk4mn_tbs.jpeg',
          intensityReason: 'Extended eccentrics increase muscle time under tension',
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
          battlePlan: '4 rounds\n• 6 Paused Squats (2s)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/3cnpyyx1_tbss.webp',
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
          battlePlan: '3 rounds\n• 6–8 1½ Rep Trap Bar Squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/sbumk4mn_tbs.jpeg',
          intensityReason: 'Half + full rep combo extends quad fatigue for greater challenge',
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
  isInCart: (workoutId: string) => boolean;
  createWorkoutId: (workout: Workout, equipment: string, difficulty: string) => string;
  addedItems: Set<string>;
  handleAddToCart: (workout: Workout, equipment: string, muscleGroup: string) => void;
  scaleAnim: Animated.Value;
  muscleGroup: string;
}

const WorkoutCard = ({ 
  equipment, 
  icon, 
  workouts, 
  difficulty, 
  difficultyColor, 
  onStartWorkout,
  isInCart,
  createWorkoutId,
  addedItems,
  handleAddToCart,
  scaleAnim,
  muscleGroup
}: WorkoutCardProps) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index || 0;
      console.log('👁️ Compound workout viewable items changed, new index:', newIndex);
      setCurrentWorkoutIndex(newIndex);
    }
  }).current;

  const onScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const slideSize = width - 48;
    
    // Calculate current index based on scroll position
    const currentIndex = Math.round(contentOffset.x / slideSize);
    console.log('📜 Compound workout scroll, index:', currentIndex, 'offset:', contentOffset.x);
    setCurrentWorkoutIndex(currentIndex);
  };

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
          <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
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
        <WigglingAddButton
          isInCart={isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty)) || 
                   addedItems.has(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty))}
          onPress={() => handleAddToCart(workouts[currentWorkoutIndex], equipment, muscleGroup)}
          scaleAnim={scaleAnim}
        />
      </View>

      {/* Workout List with Touch Swiping */}
      <View 
        style={styles.workoutList}
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
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50
          }}
          onScroll={onScroll}
          scrollEventThrottle={16}
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
                styles.dotTouchArea,
                currentWorkoutIndex === index && styles.activeDotTouchArea,
              ]}
              onPress={() => {
                setCurrentWorkoutIndex(index);
                flatListRef.current?.scrollToIndex({ 
                  index, 
                  animated: true 
                });
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

export default function CompoundWorkoutDisplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Parse parameters with error handling and proper URL decoding
  const equipmentParam = params.equipment as string || '';
  const equipmentPerGroupParam = params.equipmentPerGroup as string || '';
  let selectedEquipmentNames: string[] = [];
  let equipmentPerGroup: {[key: string]: string[]} = {};
  
  try {
    if (equipmentParam) {
      // Decode URL-encoded parameter and split by comma
      const decodedEquipment = decodeURIComponent(equipmentParam);
      selectedEquipmentNames = decodedEquipment.split(',').map(name => name.trim());
    }
    
    if (equipmentPerGroupParam) {
      // Parse equipment per muscle group mapping
      const decodedMapping = decodeURIComponent(equipmentPerGroupParam);
      equipmentPerGroup = JSON.parse(decodedMapping);
    }
  } catch (error) {
    console.error('Error parsing equipment parameters:', error);
    // Fallback to default equipment for testing
    selectedEquipmentNames = ['Dumbbells'];
    equipmentPerGroup = {};
  }
  
  const difficulty = (params.difficulty as string || 'beginner').toLowerCase();
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Compound';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, equipmentPerGroup, difficulty, moodTitle, workoutType });

  // Cart and animation hooks
  const { addToCart, isInCart } = useCart();
  const { token } = useAuth();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

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
    console.log('🔍 createProgressRows called!');
    const allSteps = [
      { icon: 'flame', text: moodTitle, key: 'mood' },
      { icon: 'speedometer', text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1), key: 'difficulty' }
    ];
    
    // Add muscle group icons only for groups that have selected equipment
    const hasCompoundEquipment = equipmentPerGroup['Compound'] && equipmentPerGroup['Compound'].length > 0;
    const hasGlutesEquipment = equipmentPerGroup['Glutes'] && equipmentPerGroup['Glutes'].length > 0;
    const hasHamstringsEquipment = equipmentPerGroup['Hammies'] && equipmentPerGroup['Hammies'].length > 0;
    const hasQuadsEquipment = equipmentPerGroup['Quads'] && equipmentPerGroup['Quads'].length > 0;
    const hasCalfsEquipment = equipmentPerGroup['Calfs'] && equipmentPerGroup['Calfs'].length > 0;
    
    console.log('Progress bar debug:', { 
      equipmentPerGroup, 
      hasCompoundEquipment, 
      hasGlutesEquipment, 
      hasHamstringsEquipment, 
      hasQuadsEquipment, 
      hasCalfsEquipment 
    });
    
    if (selectedMuscleGroups.includes('Compound') && hasCompoundEquipment) {
      allSteps.push({ icon: 'layers', text: 'Compound', key: 'compound' });
    }
    if (selectedMuscleGroups.includes('Glutes') && hasGlutesEquipment) {
      allSteps.push({ icon: 'walk', text: 'Glutes', key: 'glutes' });
    }
    if (selectedMuscleGroups.includes('Hammies') && hasHamstringsEquipment) {
      allSteps.push({ icon: 'fitness', text: 'Hamstrings', key: 'hamstrings' });
    }
    if (selectedMuscleGroups.includes('Quads') && hasQuadsEquipment) {
      allSteps.push({ icon: 'flash', text: 'Quadriceps', key: 'quadriceps' });
    }
    if (selectedMuscleGroups.includes('Calfs') && hasCalfsEquipment) {
      allSteps.push({ icon: 'arrow-up', text: 'Calves', key: 'calves' });
    }
    
    // For legs path, don't show equipment - muscle groups are sufficient
    // Progress bar will only show: mood, difficulty, and selected muscle groups

    // Limit to 2 rows maximum (8 items)
    const limitedSteps = allSteps.slice(0, 8);
    
    const rows = [];
    for (let i = 0; i < limitedSteps.length; i += 4) {
      rows.push(limitedSteps.slice(i, i + 4));
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
    const compoundEquipment = equipmentPerGroup['Compound'] || [];
    const compoundWorkouts = compoundWorkoutDatabase.filter(equipment => 
      compoundEquipment.includes(equipment.equipment)
    ).map(equipment => ({
      ...equipment,
      workouts: equipment.workouts[difficulty as keyof typeof equipment.workouts] || [],
      muscleGroup: 'Compound'
    }));
    userWorkouts.push(...compoundWorkouts);
  }
  
  // Add glutes workouts if Glutes is selected
  if (selectedMuscleGroups.includes('Glutes')) {
    const glutesEquipment = equipmentPerGroup['Glutes'] || [];
    const glutesWorkouts = glutesWorkoutDatabase.filter(equipment => 
      glutesEquipment.includes(equipment.equipment)
    ).map(equipment => ({
      ...equipment,
      workouts: equipment.workouts[difficulty as keyof typeof equipment.workouts] || [],
      muscleGroup: 'Glutes'
    }));
    userWorkouts.push(...glutesWorkouts);
  }
  
  // Add hamstrings workouts if Hammies is selected (note: Hammies comes from legs-equipment.tsx)
  if (selectedMuscleGroups.includes('Hammies')) {
    const hamstringsEquipment = equipmentPerGroup['Hammies'] || [];
    const hamstringsWorkouts = hamstringsWorkoutDatabase.filter(equipment => 
      hamstringsEquipment.includes(equipment.equipment)
    ).map(equipment => ({
      ...equipment,
      workouts: equipment.workouts[difficulty as keyof typeof equipment.workouts] || [],
      muscleGroup: 'Hammies'
    }));
    userWorkouts.push(...hamstringsWorkouts);
  }
  
  // Add quadriceps workouts if Quads is selected
  if (selectedMuscleGroups.includes('Quads')) {
    const quadsEquipment = equipmentPerGroup['Quads'] || [];
    const quadricepsWorkouts = quadricepsWorkoutDatabase.filter(equipment => 
      quadsEquipment.includes(equipment.equipment)
    ).map(equipment => ({
      ...equipment,
      workouts: equipment.workouts[difficulty as keyof typeof equipment.workouts] || [],
      muscleGroup: 'Quadriceps'
    }));
    userWorkouts.push(...quadricepsWorkouts);
  }
  
  // Add calves workouts if Calfs is selected (note: Calfs comes from legs-equipment.tsx)
  if (selectedMuscleGroups.includes('Calfs')) {
    const calfsEquipment = equipmentPerGroup['Calfs'] || [];
    const calvesWorkouts = calvesWorkoutDatabase.filter(equipment => 
      calfsEquipment.includes(equipment.equipment)
    ).map(equipment => ({
      ...equipment,
      workouts: equipment.workouts[difficulty as keyof typeof equipment.workouts] || [],
      muscleGroup: 'Calves'
    }));
    userWorkouts.push(...calvesWorkouts);
  }

  console.log('User workouts:', userWorkouts.length, 'for difficulty:', difficulty);

  const createWorkoutId = (workout: Workout, equipment: string, difficulty: string) => {
    return `${workout.name}-${equipment}-${difficulty}`;
  };

  const handleAddToCart = (workout: Workout, equipment: string, muscleGroup: string) => {
    const workoutId = createWorkoutId(workout, equipment, difficulty);
    
    if (isInCart(workoutId) || addedItems.has(workoutId)) {
      return; // Already in cart
    }

    // Create proper workout type with muscle group (e.g., "Legs - Compound", "Legs - Hammies")
    const displayWorkoutType = `${workoutType} - ${muscleGroup}`;

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
      workoutType: displayWorkoutType,
      moodCard: moodTitle,
      moodTips: workout.moodTips || [],
    };

    // Animate button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Add to cart and update local state
    addToCart(workoutItem);
    setAddedItems(prev => new Set(prev).add(workoutId));

    // Remove from local added state after 3 seconds to allow re-adding if removed from cart
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(workoutId);
        return newSet;
      });
    }, 3000);
  };

  const handleStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    console.log('🚀 Starting workout:', workout.name);
    
    // Navigate to workout guidance with full parameters including MOOD tips
    const params = {
      workoutName: workout.name,
      equipment: equipment,
      description: workout.description,
      duration: workout.duration,
      difficulty: difficulty,
      workoutType: 'Strength Based', // Set proper workout type for leg workouts
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
          <HomeButton />
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
        <HomeButton />
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
                  isInCart={isInCart}
                  createWorkoutId={createWorkoutId}
                  addedItems={addedItems}
                  handleAddToCart={handleAddToCart}
                  scaleAnim={scaleAnim}
                  muscleGroup="Compound"
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
                  isInCart={isInCart}
                  createWorkoutId={createWorkoutId}
                  addedItems={addedItems}
                  handleAddToCart={handleAddToCart}
                  scaleAnim={scaleAnim}
                  muscleGroup="Glutes"
                />
              ))}
            </>
          )}
          
          {selectedMuscleGroups.includes('Hammies') && (
            <>
              <Text style={styles.muscleGroupHeader}>Hamstrings Workouts</Text>
              {userWorkouts.filter(w => w.muscleGroup === 'Hammies').map((equipmentWorkout, index) => (
                <WorkoutCard
                  key={`hamstrings-${equipmentWorkout.equipment}`}
                  equipment={equipmentWorkout.equipment}
                  icon={equipmentWorkout.icon}
                  workouts={equipmentWorkout.workouts}
                  difficulty={difficulty}
                  difficultyColor={difficultyColor}
                  onStartWorkout={handleStartWorkout}
                  isInCart={isInCart}
                  createWorkoutId={createWorkoutId}
                  addedItems={addedItems}
                  handleAddToCart={handleAddToCart}
                  scaleAnim={scaleAnim}
                  muscleGroup="Hammies"
                />
              ))}
            </>
          )}
          
          {selectedMuscleGroups.includes('Quads') && (
            <>
              <Text style={styles.muscleGroupHeader}>Quadriceps Workouts</Text>
              {userWorkouts.filter(w => w.muscleGroup === 'Quadriceps').map((equipmentWorkout, index) => (
                <WorkoutCard
                  key={`quadriceps-${equipmentWorkout.equipment}`}
                  equipment={equipmentWorkout.equipment}
                  icon={equipmentWorkout.icon}
                  workouts={equipmentWorkout.workouts}
                  difficulty={difficulty}
                  difficultyColor={difficultyColor}
                  onStartWorkout={handleStartWorkout}
                  isInCart={isInCart}
                  createWorkoutId={createWorkoutId}
                  addedItems={addedItems}
                  handleAddToCart={handleAddToCart}
                  scaleAnim={scaleAnim}
                  muscleGroup="Quads"
                />
              ))}
            </>
          )}
          
          {selectedMuscleGroups.includes('Calfs') && (
            <>
              <Text style={styles.muscleGroupHeader}>Calves Workouts</Text>
              {userWorkouts.filter(w => w.muscleGroup === 'Calves').map((equipmentWorkout, index) => (
                <WorkoutCard
                  key={`calves-${equipmentWorkout.equipment}`}
                  equipment={equipmentWorkout.equipment}
                  icon={equipmentWorkout.icon}
                  workouts={equipmentWorkout.workouts}
                  difficulty={difficulty}
                  difficultyColor={difficultyColor}
                  onStartWorkout={handleStartWorkout}
                  isInCart={isInCart}
                  createWorkoutId={createWorkoutId}
                  addedItems={addedItems}
                  handleAddToCart={handleAddToCart}
                  scaleAnim={scaleAnim}
                  muscleGroup="Calves"
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
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginTop: 4,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 70,
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
    maxWidth: 70,
  },
  progressConnector: {
    width: 16,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 2,
    marginTop: -12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
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
    color: '#ffffff',
  },
  workoutList: {
    height: 380,
    overflow: 'visible',
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  workoutImageContainer: {
    height: 120,
    position: 'relative',
    overflow: 'visible',
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
    color: '#ffffff',
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
    color: '#ffffff',
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
    marginBottom: 10,
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
    marginTop: 0,
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
    color: '#ffffff',
    marginBottom: 16,
    marginTop: 0,
    textAlign: 'left',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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
