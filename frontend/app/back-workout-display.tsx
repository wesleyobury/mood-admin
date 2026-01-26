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

// Back workout database - placeholder structure for now, will be populated with actual workouts later
const backWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Adjustable bench',
    icon: 'trending-up-outline',
    workouts: {
      beginner: [
        {
          name: 'DB Row + Rear Fly',
          duration: '12–14 min',
          description: 'Rows for pulling power and rear flies for stability',
          battlePlan: '3 rounds\n• 10 Single-Arm Dumbbell Row (each side, supported on bench)\nRest 60s after each side\n• 10 Prone Rear Delt Fly (lying face down)\nRest 60s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
          intensityReason: 'Targets lats + rear delts with simple supported lifts',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep bench as chest support, avoid over-arching.',
              description: 'Proper bench support isolates target muscles and protects spine.'
            },
            {
              icon: 'timer',
              title: 'Move light on rear flies; control beats swinging.',
              description: 'Controlled tempo maximizes rear delt activation over momentum.'
            }
          ]
        },
        {
          name: 'Y-T Row Flow',
          duration: '12–14 min',
          description: 'Rows with Y + T raises for posture and shoulder health',
          battlePlan: '3 rounds\n• 10 Single-Arm Row (each side)\n• 10 Incline Prone Y-Raise\n• 10 Incline Prone T-Raise\nRest 75s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/928yql53_download%20%2822%29.png',
          intensityReason: 'Basic scapular + rear delt balance with angles',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Slow and deliberate Y/T raises, not weight-focused.',
              description: 'Movement quality over load for postural muscle activation.'
            },
            {
              icon: 'construct',
              title: 'Keep forehead against pad for no neck strain.',
              description: 'Pad contact maintains neutral neck alignment throughout movement.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Chest-Support Row',
          duration: '14–16 min',
          description: 'Supported rows and flies promote strict contraction',
          battlePlan: '4 rounds\n• 8 Chest-Supported Dumbbell Row\nRest 75–90s\n• 10 Incline Prone Reverse Fly\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
          intensityReason: 'Neutral spine from support isolates lats + traps',
          moodTips: [
            {
              icon: 'flash',
              title: 'Don\'t yank dumbbells—steady elbows driving back.',
              description: 'Controlled elbow drive maximizes lat activation over momentum.'
            },
            {
              icon: 'timer',
              title: 'Go light on reverse fly, pause 1s at top.',
              description: 'Peak contraction pause enhances rear delt development.'
            }
          ]
        },
        {
          name: 'W-Rear Flow',
          duration: '14–16 min',
          description: 'Rows, W-raises, and flys refine mid-back strength',
          battlePlan: '3 rounds\n• 8 Single-Arm Row (each side)\n• 8 Incline Prone W-Raise\n• 8 Incline Prone Reverse Fly\nRest 90s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/k5agvaci_download%20%2823%29.png',
          intensityReason: 'W-raises + flys emphasize scapular control within a circuit',
          moodTips: [
            {
              icon: 'flash',
              title: 'In W-raise, squeeze shoulder blades hard.',
              description: 'Maximum scapular retraction activates mid-traps effectively.'
            },
            {
              icon: 'construct',
              title: 'Keep reps slow, avoid shrugging shoulders.',
              description: 'Controlled tempo with depressed shoulders isolates target muscles.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: '3-Way Pull Row',
          duration: '16–18 min',
          description: 'Supported row, reverse fly, and single-arm grind',
          battlePlan: '4 rounds\n• 8 Chest-Supported Row\nRest 90s\n• 8 Incline Prone Reverse Fly\nRest 90s\n• 8 Single-Arm Row (each side)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
          intensityReason: 'Multiple row/rear delt moves for depth of fatigue',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stay strict: upper body still, arms pulling only.',
              description: 'Isolated arm movement maximizes target muscle activation.'
            },
            {
              icon: 'flash',
              title: 'Neutral spine always, no jerking.',
              description: 'Consistent spinal alignment prevents compensation patterns.'
            }
          ]
        },
        {
          name: 'Y-T Row Blast',
          duration: '18–20 min',
          description: 'Rows plus Y/T raises for balanced shoulder growth',
          battlePlan: '4 rounds\n• 8 Chest-Supported Row\n• 8 Incline Prone Y-Raise\n• 8 Incline Prone T-Raise\nRest 90–120s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/e00z2xt6_download%20%281%29.png',
          intensityReason: 'Multi-angle raises + row overload scapular support',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Limit load on Y/T—goal is posture, not strain.',
              description: 'Light loads with perfect form for postural muscle development.'
            },
            {
              icon: 'timer',
              title: 'Breathe steady during high fatigue at end.',
              description: 'Controlled breathing maintains performance through fatigue.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbell',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Row & Deadlift',
          duration: '14–16 min',
          description: 'Rows and deadlifts develop base power and muscle control.',
          battlePlan: '3 rounds:\n• 10 Barbell Bent-Over Row\nRest 60–75s after each set\n• 10 Barbell Deadlift\nRest 60–75s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/x2wxwvpl_download%20%282%29.png',
          intensityReason: 'Builds foundational back strength with compound lifts.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace core, hinge hips, maintain flat back',
              description: 'Proper spine alignment protects back on all lifts.'
            },
            {
              icon: 'flash',
              title: 'Tight lats protect spine',
              description: 'Lat engagement improves pulling strength and safety.'
            }
          ]
        },
        {
          name: 'Row Flow Combo',
          duration: '12–14 min',
          description: 'Combines row grips and good mornings for total back work.',
          battlePlan: '3 rounds:\n• 10 Bent-Over Row\n• 10 Underhand Grip Row\n• 10 Barbell Good Morning\nRest 60–75s after completing the full sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/8q41tii0_download%20%281%29.png',
          intensityReason: 'Varied grip rowing boosts muscular activation volume.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Transition smoothly between grips',
              description: 'Don\'t rush form between grip changes for better activation.'
            },
            {
              icon: 'body',
              title: 'Drive hips back, spine neutral',
              description: 'Proper hip hinge pattern during good mornings.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Pendlay + RDL',
          duration: '16–18 min',
          description: 'Pendlay rows and RDLs balance power with hamstring load.',
          battlePlan: '4 rounds:\n• 8 Pendlay Row\nRest 75–90s after each set\n• 10 Romanian Deadlift\nRest 75–90s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/5s4czjs3_download%20%283%29.png',
          intensityReason: 'Explosive pulls and slow RDLs strengthen full posterior.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Reset back tightness between Pendlay reps',
              description: 'Dead stop allows full lat engagement each rep.'
            },
            {
              icon: 'timer',
              title: 'Lower bar under control',
              description: 'Control eccentric to fully stretch hamstrings.'
            }
          ]
        },
        {
          name: 'Row Shrug Flow',
          duration: '16–18 min',
          description: 'Multi-grip rows, shrugs, deads build traps and mid-back.',
          battlePlan: '3 rounds:\n• 8 Bent-Over Row\n• 8 Reverse-Grip Row\n• 8 Barbell Shrugs\n• 8 Deadlift\nRest 90s after finishing the full circuit',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/a5y4znby_download%20%282%29.png',
          intensityReason: 'Combo of rows, shrugs, and deads creates dense fatigue.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Squeeze shrugs hard for one second',
              description: 'Peak contraction at top maximizes trap activation.'
            },
            {
              icon: 'construct',
              title: 'Stabilize posture before transitioning',
              description: 'Reset form between exercises for safety and effectiveness.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Barbell',
          duration: '20–22 min',
          description: 'Rows, deads, shrugs overload traps and spinal erectors.',
          battlePlan: '4 rounds:\n• 8 Barbell Bent-Over Row\nRest 90–120s after each set\n• 8 Barbell Deadlift\nRest 90–120s after each set\n• 8 Barbell Shrug\nRest 90–120s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/x2wxwvpl_download%20%282%29.png',
          intensityReason: 'Higher volume heavy lifts establish raw size and mass.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Control eccentric for time under tension',
              description: 'Slow lowering phase builds strength and muscle mass.'
            },
            {
              icon: 'trending-up',
              title: 'Drive hips and traps through lockouts',
              description: 'Complete range of motion for maximum development.'
            }
          ]
        },
        {
          name: 'Power Complex',
          duration: '20–22 min',
          description: 'Row, high pull, and clean complex maximizes back output.',
          battlePlan: '4 rounds:\n• 8 Barbell Row\n• 8 Barbell High Pull\n• 8 Barbell Power Clean\nRest 90–120s after completing the full sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/hnesh89k_download.png',
          intensityReason: 'Explosive high pulls and cleans target power capacity.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Keep elbows leading bar path',
              description: 'Proper elbow position in high pulls for maximum power.'
            },
            {
              icon: 'flash',
              title: 'Explode hips to drive bar fast',
              description: 'Hip drive generates power for explosive cleans.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettle bells',
    icon: 'cafe-outline',
    workouts: {
      beginner: [
        {
          name: 'Row & Deadlift KB',
          duration: '12–14 min',
          description: 'Rows and deadlifts with kettlebells build back base',
          battlePlan: '3 rounds\n• 10 Single-Arm KB Row (each side)\nRest 60–75s after each set\n• 10 KB Deadlift\nRest 60–75s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/s9jbh6k2_download%20%286%29.png',
          intensityReason: 'Simple pull + hinge strengthen grip and core and with modest intensity',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep bell close to shins during deadlifts.',
              description: 'Proper bell placement protects back and maximizes posterior activation.'
            },
            {
              icon: 'flash',
              title: 'Drive elbows back, not out, when rowing.',
              description: 'Proper elbow path targets lats more effectively than rear delts.'
            }
          ]
        },
        {
          name: 'Row Swing Flow',
          duration: '14–15 min',
          description: 'Grip and back strength with flow style movements',
          battlePlan: '3 rounds\n• 10 KB Single-Arm Row (each side)\n• 10 KB Suitcase Deadlift (each side)\n• 10 KB Swing\nRest 60–75s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/s1nbakqw_download%20%287%29.png',
          intensityReason: 'Combines rows, deadlifts, swings for endurance',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Snap hips for swings, don\'t squat them.',
              description: 'Hip hinge pattern generates power and protects lower back.'
            },
            {
              icon: 'body',
              title: 'Keep chest high in suitcase deadlift.',
              description: 'Maintain proud chest to avoid rounding and target glutes properly.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Double Row + Suitcase',
          duration: '16–18 min',
          description: 'Double rows with suitcase pulls train grip/core',
          battlePlan: '4 rounds\n• 8 Double KB Row\nRest 75–90s after each set\n• 10 KB Suitcase Deadlift\nRest 75–90s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/e9kn8lqs_download%20%285%29.png',
          intensityReason: 'Heavier bilateral pulls build lats and posture within a circuit format',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Chest parallel to floor for full activation.',
              description: 'Proper rowing angle maximizes lat stretch and contraction range.'
            },
            {
              icon: 'flash',
              title: 'Suitcase pulls = anti-tilt stability focus.',
              description: 'Resist lateral flexion to build core strength and stability.'
            }
          ]
        },
        {
          name: 'Gorilla Row Flow',
          duration: '16–18 min',
          description: 'Renegade, gorilla, high pulls for dense volume',
          battlePlan: '3 rounds\n• 8 Renegade Row (each side)\n• 8 Gorilla Row (each side)\n• 8 KB High Pull (each side)\nRest 90s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/e9kn8lqs_download%20%285%29.png',
          intensityReason: 'Combo flow hits lats, core, and traps together',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace core during renegade rows to stop hip twist.',
              description: 'Maintain plank position to maximize core engagement and stability.'
            },
            {
              icon: 'trending-up',
              title: 'Pull elbows high and wide in KB high pulls.',
              description: 'High elbow position targets upper traps and rear delts effectively.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Row Swing Dead',
          duration: '18–20 min',
          description: 'Balanced rotational pulls and hip hinge strength',
          battlePlan: '4 rounds\n• 8 Single-Arm Row (each side)\nRest 90s after set\n• 8 KB Swing\nRest 90s after set\n• 8 KB Deadlift\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/s9jbh6k2_download%20%286%29.png',
          intensityReason: 'Loaded volume builds strength and conditioning',
          moodTips: [
            {
              icon: 'flash',
              title: 'Stay explosive in swings.',
              description: 'Maintain power output throughout sets for maximum posterior development.'
            },
            {
              icon: 'construct',
              title: 'Row with control, don\'t twist torso.',
              description: 'Keep spine stable to isolate lats and prevent compensatory movement.'
            }
          ]
        },
        {
          name: 'Snatch Clean Flow',
          duration: '20–22 min',
          description: 'Combo snatch, renegade, clean flow builds power',
          battlePlan: '4 rounds\n• 8 Renegade Row (alternating sides)\n• 8 KB Snatch (each side)\n• 8 KB Clean and Pull\nRest 90–120s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/qcfdfm3u_download%20%284%29.png',
          intensityReason: 'Explosive circuit of pulls, cleans, and snatches',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Punch bell overhead on snatch to reduce impact.',
              description: 'Active lockout reduces joint stress and improves control.'
            },
            {
              icon: 'flash',
              title: 'Keep spine solid in cleans, power from hips.',
              description: 'Hip drive generates force while spine stability protects back.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Roman chair',
    icon: 'analytics-outline',
    workouts: {
      beginner: [
        {
          name: 'Extensions + Hold',
          duration: '10–12 min',
          description: 'Bodyweight extensions paired with short static holds',
          battlePlan: '3 rounds\n• 12 Back Extensions\nRest 45–60s\n• 2 Roman Chair Holds (20s each)\nRest 60s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/8tyq8yxs_download%20%2810%29.png',
          intensityReason: 'Introduces endurance and stability to lower back',
          moodTips: [
            {
              icon: 'body',
              title: 'Engage glutes/hamstrings to spare low back strain.',
              description: 'Posterior chain activation protects lumbar spine during extensions.'
            },
            {
              icon: 'construct',
              title: 'Keep chin tucked to maintain neutral posture.',
              description: 'Neutral neck alignment prevents cervical hyperextension.'
            }
          ]
        },
        {
          name: 'Twist & Hold Flow',
          duration: '12–14 min',
          description: 'Extension, twist, and short hold combo for endurance',
          battlePlan: '3 rounds\n• 10 Back Extensions\n• 10 Side-to-Side Twists (at top of extension)\n• 1 Roman Chair Hold (30s)\nRest 60–75s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/uud5nxsk_download%20%2811%29.png',
          intensityReason: 'Adds light rotation and isometrics for core demands',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Turn from ribs, not shoulders, during twists.',
              description: 'Ribcage initiation creates safer rotational movement pattern.'
            },
            {
              icon: 'timer',
              title: 'Breathe steady during holds, don\'t "crank."',
              description: 'Controlled breathing maintains position without excessive strain.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Weighted Ext',
          duration: '14–16 min',
          description: 'Weighted extensions and basic hyperextensions for mass',
          battlePlan: '4 rounds\n• 10 Weighted Back Extensions\nRest 75s after set\n• 10 Roman Chair Hyperextensions\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/8tyq8yxs_download%20%2810%29.png',
          intensityReason: 'External load strengthens spinal erectors safely',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hug plate close to stomach/chest.',
              description: 'Keeping weight close maintains balance and control during movement.'
            },
            {
              icon: 'timer',
              title: 'Lower slowly, 2–3s, for stronger gains.',
              description: 'Controlled eccentric phase maximizes strength development.'
            }
          ]
        },
        {
          name: 'Extension Circuit',
          duration: '14–16 min',
          description: 'Blends extension, superman, side bends for variety',
          battlePlan: '3 rounds\n• 8 Back Extensions\n• 8 Alternating Superman (1 arm + opposite leg)\n• 8 Side Bends (each side)\nRest 90s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/uud5nxsk_download%20%2811%29.png',
          intensityReason: 'Mix of dynamic posterior moves challenges control',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Lift opposite arm/leg smoothly in superman.',
              description: 'Coordinated contralateral movement improves stability and strength.'
            },
            {
              icon: 'flash',
              title: 'Don\'t rush side bends; full ROM and squeeze.',
              description: 'Complete range of motion with peak contraction maximizes benefits.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Twist',
          duration: '16–18 min',
          description: 'Weighted extensions with twist patterns for obliques',
          battlePlan: '4 rounds\n• 10 Weighted Back Extensions\nRest 90s after set\n• 10 Roman Chair Hyperextensions\nRest 90s after set\n• 10 Roman Chair Twists\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/8tyq8yxs_download%20%2810%29.png',
          intensityReason: 'Adds load and rotation for advanced spinal strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep ribcage engaged, don\'t torque spine.',
              description: 'Core stability prevents excessive spinal rotation under load.'
            },
            {
              icon: 'flash',
              title: 'Brace core before rotating under load.',
              description: 'Pre-bracing creates safe foundation for rotational movements.'
            }
          ]
        },
        {
          name: 'Superman + Iso Hold',
          duration: '18–20 min',
          description: 'Superman lifts plus holds improve stability capacity',
          battlePlan: '4 rounds\n• 8 Weighted Back Extensions\n• 8 Alternating Supermans\n• 1 Roman Chair Hold (20–30s)\nRest 90–120s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/uud5nxsk_download%20%2811%29.png',
          intensityReason: 'Extended isometrics + dynamic raises build max control',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Keep limbs only slightly above parallel, not over-extended.',
              description: 'Moderate range prevents hyperextension while maintaining effectiveness.'
            },
            {
              icon: 'timer',
              title: 'Squeeze glutes during 20s hold to protect spine.',
              description: 'Glute activation provides spinal stability during isometric holds.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'T bar row machine',
    icon: 'add-outline',
    workouts: {
      beginner: [
        {
          name: 'Neutral Grip Row',
          duration: '10–12 min',
          description: 'Simple neutral rowing pattern for beginners to build back thickness.',
          battlePlan: '3 rounds\n• 12 Neutral Grip T-Bar Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/figwdo7y_download%20%2817%29.png',
          intensityReason: 'Neutral grip builds confidence & lat line strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep chest against pad, no hip driving.',
              description: 'Chest support isolates lats and prevents momentum cheating.'
            },
            {
              icon: 'flash',
              title: 'Pull elbows straight back, not out.',
              description: 'Proper elbow path targets lats more effectively than rear delts.'
            }
          ]
        },
        {
          name: 'Wide Grip Row',
          duration: '10–12 min',
          description: 'Wide row variation for upper-back foundation',
          battlePlan: '3 rounds\n• 10 Wide Grip T-Bar Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
          intensityReason: 'Wide grip shifts load to traps/rhomboids for posture',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull chest high into pad during contraction.',
              description: 'Active chest engagement maximizes upper back activation.'
            },
            {
              icon: 'body',
              title: 'Avoid shrugging shoulders during pull.',
              description: 'Keep shoulders down and back to isolate target muscles.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Close Grip Row',
          duration: '12–14 min',
          description: 'Simple close grip with moderate-to-heavy focus',
          battlePlan: '4 rounds\n• 10 Close Grip T-Bar Row\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/figwdo7y_download%20%2817%29.png',
          intensityReason: 'Close grip overloads lats with higher load capacity',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace core, avoid torso swing.',
              description: 'Core stability prevents momentum and isolates target muscles.'
            },
            {
              icon: 'flash',
              title: 'Drive elbows low, past hip line.',
              description: 'Deep elbow drive maximizes lat contraction and range.'
            }
          ]
        },
        {
          name: 'Slow Neg Row',
          duration: '12–14 min',
          description: 'Time-under-tension row progression provides a challenging switchup',
          battlePlan: '4 rounds\n• 8 Neutral Grip Row (3–4s eccentric)\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
          intensityReason: '3–4s eccentric tempo increases hypertrophy effect',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Explode to chest, lower slow & steady.',
              description: 'Fast concentric, slow eccentric maximizes muscle stimulus.'
            },
            {
              icon: 'timer',
              title: 'Keep weight lighter to maintain control.',
              description: 'Reduced load allows proper tempo execution and form.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Iso Wide Rows',
          duration: '14–16 min',
          description: 'Wide grip rows with static squeeze finish to bring muscles to full fatigue',
          battlePlan: '4 rounds\n• 8 Wide Grip T-Bar Row\nEnd each set with 10s static hold at full contraction\nRest 90–120s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/figwdo7y_download%20%2817%29.png',
          intensityReason: 'Isometric holds create intense contraction stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold elbows back & chest tall in iso.',
              description: 'Maintain peak contraction position throughout hold duration.'
            },
            {
              icon: 'flash',
              title: 'Aim for smooth squeeze across mid-back.',
              description: 'Focus on scapular retraction and mid-trap engagement.'
            }
          ]
        },
        {
          name: 'Combo Superset',
          duration: '16–18 min',
          description: 'Wide-to-underhand superset with scap squeezes',
          battlePlan: '4 rounds\n• 8 Wide Grip Row\n• Immediately 8 Underhand Grip Row\n• Finish with 10 Back Squeezes (bodyweight, no load)\nRest 120s after full superset',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
          intensityReason: 'Pairing grips + post-set contractions maximizes fatigue',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Moderate weight, strict form for both grips.',
              description: 'Controlled loads allow proper execution of superset protocol.'
            },
            {
              icon: 'refresh',
              title: 'Squeezes: think small, controlled scap retractions.',
              description: 'Bodyweight squeezes enhance muscle activation and recovery.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Powerlifting Platform',
    icon: 'barbell-outline',
    workouts: {
      beginner: [
        {
          name: 'Dead + Row',
          duration: '14–16 min',
          description: 'Deadlifts and rows for beginner back foundation',
          battlePlan: '3 rounds\n• 10 Barbell Deadlift\nRest 60–75s\n• 10 Barbell Bent-Over Row\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intro hinge + pull to teach proper barbell basics',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hinge, don\'t squat, on deadlifts.',
              description: 'Hip hinge pattern targets posterior chain effectively.'
            },
            {
              icon: 'flash',
              title: 'Lats tight on rows to build pulling base.',
              description: 'Lat engagement improves pulling strength and spinal stability.'
            }
          ]
        },
        {
          name: 'Dead Row Shrug',
          duration: '14–16 min',
          description: 'Deads, rows, shrugs train erectors and upper traps',
          battlePlan: '3 rounds\n• 10 Barbell Deadlift\n• 10 Barbell Bent-Over Row\n• 10 Barbell Power Shrug\nRest 75s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Adds shrug finish for trap-dominant overload',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Explode hips in dead, pause with bar tight to legs.',
              description: 'Hip drive generates power while maintaining bar path control.'
            },
            {
              icon: 'timer',
              title: 'Shrugs: no bounce, pause 1 count at top.',
              description: 'Controlled shrugs with pause maximize trap activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'RDL + Pendlay',
          duration: '16–18 min',
          description: 'Romanian deadlifts with Pendlay rows for balance',
          battlePlan: '4 rounds\n• 8 Romanian Deadlift\nRest 75–90s\n• 10 Pendlay Row\nRest 75–90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Posterior strength + explosive pull development',
          moodTips: [
            {
              icon: 'timer',
              title: 'Go slow with RDL to maximize hamstring loading.',
              description: 'Controlled tempo increases hamstring and glute activation.'
            },
            {
              icon: 'refresh',
              title: 'Reset bar dead-stop every time in Pendlay.',
              description: 'Dead stop allows full lat engagement each rep.'
            }
          ]
        },
        {
          name: 'Pull Combo',
          duration: '16–18 min',
          description: 'Deadlifts plus Olympic pulls for hybrid training',
          battlePlan: '3 rounds\n• 8 Barbell Deadlift\n• 8 Barbell High Pull\n• 8 Barbell Clean Pull\nRest 90s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Add high pulls + clean pulls to boost explosiveness',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Hips and legs drive bar, elbows guide.',
              description: 'Lower body power generation with upper body guidance.'
            },
            {
              icon: 'construct',
              title: 'Keep tight core, don\'t overextend at top.',
              description: 'Core stability prevents hyperextension during pulls.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Dead Row Shrug',
          duration: '18–20 min',
          description: 'Heavy hinge, row, shrug focus for dense back work',
          battlePlan: '4 rounds\n• 8 Barbell Deadlift\nRest 90s\n• 8 Barbell Bent-Over Row\nRest 90s\n• 8 Power Shrug\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Adds volume with heavy compound barbell pulls',
          moodTips: [
            {
              icon: 'construct',
              title: 'Belt useful here for safe bracing.',
              description: 'Lifting belt provides additional core support for heavy loads.'
            },
            {
              icon: 'flash',
              title: 'Pull bar into thighs at shrug peak.',
              description: 'Bar contact maximizes trap activation and stability.'
            }
          ]
        },
        {
          name: 'Dead Clean Flow',
          duration: '20–22 min',
          description: 'Heavy compound pulls with clean finish',
          battlePlan: '4 rounds\n• 8 Barbell Deadlift\n• 8 Barbell High Pull\n• 8 Barbell Power Clean\nRest 90–120s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Olympic-style lifts tie power explosiveness to back',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Explode hips, bar close on clean.',
              description: 'Hip explosion with tight bar path for clean efficiency.'
            },
            {
              icon: 'refresh',
              title: 'Keep arms relaxed until pull finish.',
              description: 'Delayed arm pull maximizes lower body power contribution.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Seated cable machine',
    icon: 'accessibility-outline',
    workouts: {
      beginner: [
        {
          name: 'Neutral Row Start',
          duration: '10–12 min',
          description: 'Single movement to master seated row mechanics',
          battlePlan: '3 rounds\n• 12 Neutral Grip Cable Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/7hcpy4r7_download%20%2812%29.png',
          intensityReason: 'Neutral grip anchor builds confidence + control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Sit tall, chest steady, no torso rocking.',
              description: 'Stable posture isolates target muscles and prevents momentum.'
            },
            {
              icon: 'timer',
              title: 'Pull elbows near ribs, pause each rep.',
              description: 'Controlled movement with pause maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Wide Row Intro',
          duration: '10–12 min',
          description: 'Focuses on wide row control & back width for beginners',
          battlePlan: '3 rounds\n• 10 Wide Grip Cable Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/gdb1l44p_wgr.png',
          intensityReason: 'Wide grip recruits upper back posture muscles',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Elbows flare naturally but keep chest upright.',
              description: 'Natural elbow path with stable torso for optimal activation.'
            },
            {
              icon: 'body',
              title: 'Pull to sternum level, no lower.',
              description: 'Proper pull height maximizes upper back engagement.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Underhand Row',
          duration: '12–14 min',
          description: 'Control-focused row variation with palms up to target lower lats and scaps.',
          battlePlan: '4 rounds\n• 10 Underhand Grip Cable Row\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/4jf014no_rgr.jpg',
          intensityReason: 'Underhand row shifts focus to lower lats & biceps',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep wrists straight, elbows tight to body.',
              description: 'Proper wrist alignment and elbow path optimize muscle targeting.'
            },
            {
              icon: 'timer',
              title: 'Hold 1s at contraction for stronger squeeze.',
              description: 'Pause at peak contraction enhances muscle activation.'
            }
          ]
        },
        {
          name: 'Slow Negatives',
          duration: '12–14 min',
          description: 'Single movement with emphasized negative control',
          battlePlan: '4 rounds\n• 8 Neutral Grip Cable Row (3–4s eccentric each rep)\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/83ut7zg6_download%20%2813%29.png',
          intensityReason: 'Extended 3–4s eccentrics boost hypertrophy',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull powerfully, but lower slow and steady.',
              description: 'Fast concentric with controlled eccentric maximizes stimulus.'
            },
            {
              icon: 'construct',
              title: 'Brace abs so spine stays neutral.',
              description: 'Core engagement maintains proper spinal alignment.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Iso Hold Rows',
          duration: '14–16 min',
          description: 'Rows with a final long hold at contraction to fully fatigue muscles.',
          battlePlan: '4 rounds\n• 8 Wide Grip Row\nEnd each set with 10s hold at contraction\nRest 90–120s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/7hcpy4r7_download%20%2812%29.png',
          intensityReason: 'Isometric finish after working sets increases time under tension',
          moodTips: [
            {
              icon: 'flash',
              title: 'Crush shoulder blades tight in hold.',
              description: 'Maximum scapular retraction during isometric phase.'
            },
            {
              icon: 'trending-up',
              title: 'Think "chest proud" during static phase.',
              description: 'Proud chest position maintains optimal muscle activation.'
            }
          ]
        },
        {
          name: 'Superset Grind',
          duration: '16–18 min',
          description: 'Wide-to-underhand superset with post-set squeezes',
          battlePlan: '4 rounds\n• 8 Wide Grip Row (controlled)\n• Immediately 8 Underhand Grip Row\n• Finish with 10 Standing Back Squeezes (bodyweight scapular retractions, no load)\nRest 120s after full superset',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/gdb1l44p_wgr.png',
          intensityReason: 'Combo of two grips + contractions maximizes fatigue',
          moodTips: [
            {
              icon: 'construct',
              title: 'Go moderate weight, perfect form on both grips.',
              description: 'Controlled loads ensure proper execution throughout superset.'
            },
            {
              icon: 'refresh',
              title: 'Post-set back squeezes: keep tiny ROM, lats locked.',
              description: 'Small range squeezes enhance activation and recovery.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Lat pull down machine',
    icon: 'arrow-down-circle-outline',
    workouts: {
      beginner: [
        {
          name: 'Wide Pulldown',
          duration: '10–12 min',
          description: 'Wide grip basis for learning lat engagement to build pull-up strength',
          battlePlan: '3 rounds\n• 10–12 Wide Grip Pulldown\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/diugpoq6_download%20%288%29.png',
          intensityReason: 'Wide grip teaches lat activation and form control',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Keep chest tall and lean slightly back for contraction.',
              description: 'Proper posture maximizes lat engagement and range of motion.'
            },
            {
              icon: 'timer',
              title: 'Pull bar to upper chest, pause, control the return.',
              description: 'Full range with pause enhances muscle activation and control.'
            }
          ]
        },
        {
          name: 'Underhand Pulldown',
          duration: '10–12 min',
          description: 'Easier grip variation supports early progression',
          battlePlan: '3 rounds\n• 10–12 Underhand Pulldown\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fkpr9mxh_lprg.jpg',
          intensityReason: 'Underhand grip recruits arms to aid pulling work',
          moodTips: [
            {
              icon: 'construct',
              title: 'Elbows tucked, bar to chest line for full range.',
              description: 'Proper elbow position maximizes lat stretch and contraction.'
            },
            {
              icon: 'flash',
              title: 'Squeeze lats and biceps hard each rep.',
              description: 'Dual muscle activation enhances strength and development.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Neutral Pulldown',
          duration: '12–14 min',
          description: 'Stronger setup for progressive overload recruiting a wider variety of muscles',
          battlePlan: '4 rounds\n• 8–10 Neutral Grip Pulldown (moderate to heavy)\nRest 75–90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/vydcatjw_nglp.webp',
          intensityReason: 'Neutral grip enables heavier lat loading safely',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drive elbows to ribs, no shoulder shrug.',
              description: 'Proper elbow drive isolates lats and prevents compensation.'
            },
            {
              icon: 'timer',
              title: 'Lower weight slowly to maximize tension.',
              description: 'Controlled eccentric phase enhances muscle stimulus.'
            }
          ]
        },
        {
          name: 'Pulldown + Hold',
          duration: '12–14 min',
          description: 'Controlled reps followed by static contraction',
          battlePlan: '3 rounds\n• 8–10 Pulldown (neutral or wide, consistent grip choice)\nEnd each set with 5s hold at bottom\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/j967e9c7_download%20%289%29.png',
          intensityReason: 'Isometric hold boosts tension and endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold bar at chest for 5s after last rep.',
              description: 'Isometric contraction increases time under tension.'
            },
            {
              icon: 'construct',
              title: 'Keep shoulders down, blades squeezed tight.',
              description: 'Proper scapular position maintains optimal muscle activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Close',
          duration: '14–16 min',
          description: 'Mix of wide and close grips for full lat work and development',
          battlePlan: '4 rounds\n• 8 Wide Grip Pulldown\nRest 90s\n• 8 Close Grip Pulldown\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/diugpoq6_download%20%288%29.png',
          intensityReason: 'Grip pairing develops width and back thickness',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Breathe out as you pull down, in as you rise.',
              description: 'Proper breathing pattern maintains core stability and power.'
            },
            {
              icon: 'construct',
              title: 'Don\'t swing stack — keep it controlled.',
              description: 'Smooth movement prevents momentum and maintains tension.'
            }
          ]
        },
        {
          name: 'Pulldown Superset',
          duration: '16–18 min',
          description: 'Wide-to-underhand with controlled lowering for mastery of movement.',
          battlePlan: '4 rounds\n• 8 Wide Grip Pulldown\n• Immediately 8 Underhand Pulldown (3s eccentric each)\nRest 120s after superset',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/j967e9c7_download%20%289%29.png',
          intensityReason: 'Superset + eccentrics maximize hypertrophy stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Use moderate weight to hold perfect form.',
              description: 'Controlled loads ensure proper execution throughout superset.'
            },
            {
              icon: 'timer',
              title: 'Each rep: take 3s to lower bar slowly.',
              description: 'Extended eccentric phase maximizes muscle development.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Straight pull up bar',
    icon: 'remove-circle-outline',
    workouts: {
      beginner: [
        {
          name: 'Assisted Pull-Ups',
          duration: '10–12 min',
          description: 'Focuses on mastering the basic pull-up movement pattern',
          battlePlan: '3 rounds\n• 5 Pull-Ups (use band or assisted machine if needed)\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/zpcds83n_download%20%2815%29.png',
          intensityReason: 'Builds foundational pulling strength with necessary support',
          moodTips: [
            {
              icon: 'construct',
              title: 'Use a band or assisted machine to complete all reps with good form, focusing on lat engagement.',
              description: 'Assistance ensures proper form while building strength foundation.'
            },
            {
              icon: 'trending-up',
              title: 'Drive chin above bar every rep; control the lowering phase.',
              description: 'Full range of motion with controlled eccentric builds strength.'
            }
          ]
        },
        {
          name: 'Pull-Up Negatives',
          duration: '10–12 min',
          description: 'Focuses on controlled lowering to build pulling power',
          battlePlan: '3 rounds\n• 5 Negative Pull-Ups (jump to top, 3-5s lower)\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
          intensityReason: 'Eccentric training builds strength for full pull-ups',
          moodTips: [
            {
              icon: 'timer',
              title: 'Jump to the top position and take 3-5 seconds to lower yourself. This builds strength even if you can\'t pull up yet.',
              description: 'Eccentric strength training effectively builds pulling power.'
            },
            {
              icon: 'construct',
              title: 'Keep core tight throughout the lowering phase.',
              description: 'Core stability enhances control and safety during negatives.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Chin-Up Strength',
          duration: '12–14 min',
          description: 'Builds pulling power with a slightly easier grip variation',
          battlePlan: '4 rounds\n• 6 Chin-Ups\nRest 75–90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fox3rjq4_chu.jpg',
          intensityReason: 'Chin-ups engage biceps more, aiding overall pull strength',
          moodTips: [
            {
              icon: 'flash',
              title: 'If needed, use light assistance (thin band) to maintain strict form. Focus on squeezing your biceps and lats.',
              description: 'Minimal assistance maintains form while building strength.'
            },
            {
              icon: 'construct',
              title: 'Keep elbows tucked, pull chest to bar.',
              description: 'Proper elbow path maximizes muscle activation and range.'
            }
          ]
        },
        {
          name: 'Pull-Up + Hold',
          duration: '12–14 min',
          description: 'Combines pull-ups with a static hold for enhanced strength',
          battlePlan: '3 rounds\n• 6 Pull-Ups\nEnd each set with a 3s hold at the top\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
          intensityReason: 'Adds isometric hold to increase time under tension for growth',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Aim for unassisted reps. If form breaks, use minimal assistance. The hold should be challenging but maintainable.',
              description: 'Progressive overload with isometric challenge builds strength.'
            },
            {
              icon: 'timer',
              title: 'Hold chin above bar for 3 seconds at the top of each final rep.',
              description: 'Isometric hold maximizes time under tension and strength gains.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Neutral Pull',
          duration: '14–16 min',
          description: 'Two key pull-up variations for comprehensive back development',
          battlePlan: '4 rounds\n• 8 Wide Grip Pull-Ups\nRest 90s\n• 8 Neutral Grip Pull-Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/zpcds83n_download%20%2815%29.png',
          intensityReason: 'Targets outer lats and overall back width with varied grips',
          moodTips: [
            {
              icon: 'construct',
              title: 'These are unassisted. Focus on maximizing muscle activation with each grip.',
              description: 'Different grips target various muscle fibers for complete development.'
            },
            {
              icon: 'trending-up',
              title: 'Wide grip emphasizes lat stretch; neutral grip allows for more power.',
              description: 'Grip variation optimizes both width and strength development.'
            }
          ]
        },
        {
          name: 'Chest-to-Bar Flow',
          duration: '16–18 min',
          description: 'Advanced pull-ups with deep range and controlled lowering',
          battlePlan: '4 rounds\n• 6 Chest-to-Bar Pull-Ups\n• 6 Negative Pull-Ups (3–5s lower)\nRest 90–120s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/r3n8muv4_cbpu.webp',
          intensityReason: 'Higher pull range and negatives build extreme strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'This is for high-level strength. Ensure full control throughout.',
              description: 'Advanced technique requires complete movement mastery.'
            },
            {
              icon: 'timer',
              title: 'Drive chest to bar, then control the 3-5 second negative.',
              description: 'Extended range with controlled eccentric maximizes strength gains.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Grip variation pull up bar',
    icon: 'git-branch-outline',
    workouts: {
      beginner: [
        {
          name: 'Assisted Neutral',
          duration: '10–12 min',
          description: 'Focuses on the neutral grip pull-up with support',
          battlePlan: '3 rounds\n• 5 Neutral Grip Pull-Ups (use band or assisted machine if needed)\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/ve6lcl2d_Screenshot%202025-12-05%20at%2011.11.07%E2%80%AFPM.png',
          intensityReason: 'Neutral grip is often easiest, building initial pulling strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Use a band or assisted machine to ensure you can complete all reps with good form. This helps build the mind-muscle connection.',
              description: 'Assistance allows focus on movement quality and muscle activation.'
            },
            {
              icon: 'flash',
              title: 'Keep elbows tucked, pull with your lats.',
              description: 'Proper elbow position targets lats effectively while learning.'
            }
          ]
        },
        {
          name: 'Assisted Chin-Ups',
          duration: '10–12 min',
          description: 'Builds pulling strength using an underhand grip with assistance',
          battlePlan: '3 rounds\n• 5 Chin-Ups (use band or assisted machine if needed)\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/9ie9z8cd_chu.jpg',
          intensityReason: 'Chin-ups recruit biceps, making them slightly easier to learn',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Use assistance to focus on the movement pattern. As you get stronger, reduce the assistance.',
              description: 'Progressive assistance reduction builds strength systematically.'
            },
            {
              icon: 'flash',
              title: 'Palms face you, squeeze biceps at the top.',
              description: 'Underhand grip engages biceps more for easier progression.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Mixed Grip Pulls',
          duration: '12–14 min',
          description: 'Alternating grip for balanced strength development',
          battlePlan: '4 rounds\n• 6 Mixed Grip Pull-Ups (swap grip each set)\nRest 75–90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/knkswnzw_download%20%284%29.png',
          intensityReason: 'Mixed grip helps overcome sticking points, building unilateral strength',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Aim for unassisted reps. If needed, use a very light band. Swap your mixed grip hand position each set.',
              description: 'Alternating grip position ensures balanced development.'
            },
            {
              icon: 'trending-up',
              title: 'Focus on pulling with the supinated hand, then switch.',
              description: 'Supinated hand leads pull for optimal activation pattern.'
            }
          ]
        },
        {
          name: 'Commando Pulls',
          duration: '12–14 min',
          description: 'Dynamic pull-up variation for core and back engagement',
          battlePlan: '3 rounds\n• 6 Commando Pull-Ups (chest to each side)\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/v94peb1z_Screenshot%202025-12-05%20at%2011.08.43%E2%80%AFPM.png',
          intensityReason: 'Commando pulls challenge stability and unilateral strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'This is a step up. If needed, use a light band. Focus on moving your chest to each side of your hands.',
              description: 'Dynamic movement challenges core stability and coordination.'
            },
            {
              icon: 'flash',
              title: 'Keep body tight, move chest side-to-side over hands.',
              description: 'Core tension maintains control during lateral movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Neutral',
          duration: '14–16 min',
          description: 'Targets both back width and overall pulling power',
          battlePlan: '4 rounds\n• 8 Wide Grip Pull-Ups\nRest 90s\n• 8 Neutral Grip Pull-Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/knkswnzw_download%20%284%29.png',
          intensityReason: 'Combines two primary grips for comprehensive back development',
          moodTips: [
            {
              icon: 'construct',
              title: 'These are unassisted. Focus on perfect form and full range of motion.',
              description: 'Unassisted reps with perfect form maximize strength development.'
            },
            {
              icon: 'trending-up',
              title: 'Wide grip for lat spread, neutral for power and depth.',
              description: 'Different grips target width versus thickness development.'
            }
          ]
        },
        {
          name: 'Archer Pulls',
          duration: '16–18 min',
          description: 'Highly challenging pull-up variation for extreme strength',
          battlePlan: '4 rounds\n• 6 Archer Pull-Ups (each side)\nRest 90–120s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/yk99v1xl_archpu.jpg',
          intensityReason: 'Unilateral strength builder, progressing towards one-arm pull-ups',
          moodTips: [
            {
              icon: 'construct',
              title: 'This is very advanced. Keep the non-pulling arm extended.',
              description: 'Advanced unilateral training requires exceptional control.'
            },
            {
              icon: 'trending-up',
              title: 'Focus on pulling with one arm while the other provides minimal assistance.',
              description: 'Single-arm emphasis builds towards ultimate pulling strength.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Seated Chest Supported Row Machine',
    icon: 'desktop-outline',
    workouts: {
      beginner: [
        {
          name: 'Neutral Row',
          duration: '10–12 min',
          description: 'Builds pulling strength with a natural elbow path',
          battlePlan: '3 rounds\n• 10–12 Neutral Grip Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/lmxixaaf_scsngr.webp',
          intensityReason: 'Neutral grip row teaches form with stable setup',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep chest pressed firmly to pad, no torso lift.',
              description: 'Stable chest position isolates back muscles effectively.'
            },
            {
              icon: 'timer',
              title: 'Pull elbows straight back, pause at squeeze.',
              description: 'Straight elbow path with pause maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Wide Row',
          duration: '10–12 min',
          description: 'Engages rhomboids and traps with safer alignment',
          battlePlan: '3 rounds\n• 10–12 Wide Grip Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/aod60178_scswgr.jpg',
          intensityReason: 'Wide row variation builds posture and width with added support.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Lead with elbows, not forearms.',
              description: 'Elbow-led movement optimizes lat and rhomboid activation.'
            },
            {
              icon: 'flash',
              title: 'Pull bar toward upper chest line for best squeeze.',
              description: 'Upper chest pull height maximizes upper back engagement.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Underhand Row',
          duration: '12–14 min',
          description: 'Stronger pull variation for controlled overload',
          battlePlan: '4 rounds\n• 8–10 Underhand Grip Row (moderate to heavy)\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/pm9titrm_scsrgr.webp',
          intensityReason: 'Underhand angle shifts load to lats and biceps',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep wrists straight, elbows close to torso.',
              description: 'Proper wrist alignment and elbow path optimize pulling mechanics.'
            },
            {
              icon: 'timer',
              title: 'Hold 1s at contraction to deepen squeeze.',
              description: 'Peak contraction pause enhances muscle activation.'
            }
          ]
        },
        {
          name: 'Slow Negatives',
          duration: '12–14 min',
          description: 'Focuses on lat control with longer lowering phase',
          battlePlan: '3 rounds\n• 8 Neutral Grip Row (3s eccentric each rep)\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/1uyss7y4_csrr.webp',
          intensityReason: '3s eccentric reps add high time under tension',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull explosively, lower over full 3 count.',
              description: 'Fast concentric with slow eccentric maximizes muscle stimulus.'
            },
            {
              icon: 'construct',
              title: 'Don\'t let weight touch stack between reps.',
              description: 'Constant tension maintains muscle activation throughout set.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Neutral + Wide',
          duration: '14–16 min',
          description: 'Neutral rows + wide rows maximize pulling volume',
          battlePlan: '4 rounds\n• 8 Neutral Grip Row\nRest 90s\n• 8 Wide Grip Row\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/ty987c3z_download%20%2814%29.png',
          intensityReason: 'Two grips stimulate width and thickness growth',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep chest glued down on all reps.',
              description: 'Stable torso position ensures isolated back muscle targeting.'
            },
            {
              icon: 'flash',
              title: 'Squeeze each rep at peak for best activation.',
              description: 'Peak contraction squeeze maximizes muscle fiber recruitment.'
            }
          ]
        },
        {
          name: 'Row Superset + Iso',
          duration: '16–18 min',
          description: 'Neutral-to-underhand rows plus isometric finisher',
          battlePlan: '4 rounds\n• 8 Neutral Grip Row\n• Immediately 8 Underhand Grip Row\n• Finish with 10s Hold at peak contraction\nRest 120s after full sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/1uyss7y4_csrr.webp',
          intensityReason: 'Superset adds load, holds extend time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Focus on slow return, don\'t drop stack.',
              description: 'Controlled eccentric maintains tension and prevents momentum.'
            },
            {
              icon: 'flash',
              title: 'Lock in hard squeeze during iso hold.',
              description: 'Maximum contraction during hold maximizes strength gains.'
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
  handleAddToCart: (workout: Workout, equipment: string) => void;
  scaleAnim: Animated.Value;
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
  scaleAnim
}: WorkoutCardProps) => {
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
          <Ionicons name={icon} size={16} color="#FFD700" />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <WigglingAddButton
          isInCart={isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty)) || 
                   addedItems.has(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty))}
          onPress={() => handleAddToCart(workouts[currentWorkoutIndex], equipment)}
          scaleAnim={scaleAnim}
        />
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

export default function BackWorkoutDisplay() {
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
  const workoutType = params.workoutType as string || 'Back';
  
  // Multi-muscle group queue support
  const muscleQueue = params.muscleQueue ? JSON.parse(params.muscleQueue as string) : [];
  const currentMuscleIndex = parseInt(params.currentMuscleIndex as string || '0');
  const totalMuscles = parseInt(params.totalMuscles as string || '1');
  const hasMoreMuscles = muscleQueue.length > 0;
  
  // Cart and animation hooks
  const { addToCart, isInCart } = useCart();
  const { token } = useAuth();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  const createWorkoutId = (workout: Workout, equipment: string, difficulty: string) => {
    return `${workout.name}-${equipment}-${difficulty}`;
  };

  const handleAddToCart = (workout: Workout, equipment: string) => {
    const workoutId = createWorkoutId(workout, equipment, difficulty);
    
    if (isInCart(workoutId) || addedItems.has(workoutId)) {
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
      workoutType: `Muscle gainer - ${workoutType}`,
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
    if (token) {
      Analytics.workoutAddedToCart(token, {
        workout_name: workout.name,
        mood_category: moodTitle,
        equipment: equipment,
      });
    }
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

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment
  const userWorkouts = backWorkoutDatabase.filter(item => 
    selectedEquipmentNames.includes(item.equipment)
  );

  console.log('Debug info:', {
    selectedEquipmentNames,
    backWorkoutDatabaseEquipment: backWorkoutDatabase.map(w => w.equipment),
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

  // Navigate to next muscle group or view cart
  const handleNextMuscleGroup = () => {
    if (hasMoreMuscles) {
      const nextMuscle = muscleQueue[0];
      const remainingQueue = muscleQueue.slice(1);
      
      let pathname = '';
      switch (nextMuscle.name) {
        case 'Chest':
          pathname = '/chest-equipment';
          break;
        case 'Shoulders':
          pathname = '/shoulders-equipment';
          break;
        case 'Back':
          pathname = '/back-equipment';
          break;
        case 'Biceps':
          pathname = '/biceps-equipment';
          break;
        case 'Triceps':
          pathname = '/triceps-equipment';
          break;
        case 'Legs':
          pathname = '/legs-muscle-groups';
          break;
        case 'Abs':
          pathname = '/abs-equipment';
          break;
        default:
          pathname = '/cart';
      }

      router.push({
        pathname: pathname as any,
        params: {
          mood: moodTitle,
          bodyPart: nextMuscle.name,
          muscleQueue: JSON.stringify(remainingQueue),
          currentMuscleIndex: (currentMuscleIndex + 1).toString(),
          totalMuscles: totalMuscles.toString(),
        }
      });
    } else {
      router.push('/cart');
    }
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
      'Back press machine': 'hardware-chip',
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
                isInCart={isInCart}
                createWorkoutId={createWorkoutId}
                addedItems={addedItems}
                handleAddToCart={handleAddToCart}
                scaleAnim={scaleAnim}
              />
            );
          })
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="fitness" size={48} color="#FFD700" />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noWorkoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  noWorkoutsSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
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