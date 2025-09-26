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
          description: 'Rows for pulling power and rear flies\nfor stability\n ',
          battlePlan: '3 rounds\n• 10 Single-Arm Dumbbell Row (each side, supported on bench)\nRest 60s after each side\n• 10 Prone Rear Delt Fly (lying face down)\nRest 60s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
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
          description: 'Rows with Y + T raises for posture\nand shoulder health\n ',
          battlePlan: '3 rounds\n• 10 Single-Arm Row (each side)\n• 10 Incline Prone Y-Raise\n• 10 Incline Prone T-Raise\nRest 75s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Supported rows and flies promote\nstrict contraction\n ',
          battlePlan: '4 rounds\n• 8 Chest-Supported Dumbbell Row\nRest 75–90s\n• 10 Incline Prone Reverse Fly\nRest 75–90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
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
          description: 'Rows, W-raises, and flys refine\nmid-back strength\n ',
          battlePlan: '3 rounds\n• 8 Single-Arm Row (each side)\n• 8 Incline Prone W-Raise\n• 8 Incline Prone Reverse Fly\nRest 90s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'W-raises + flys emphasize scapular control',
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
          description: 'Supported row, reverse fly, and\nsingle-arm grind\n ',
          battlePlan: '4 rounds\n• 8 Chest-Supported Row\nRest 90s\n• 8 Incline Prone Reverse Fly\nRest 90s\n• 8 Single-Arm Row (each side)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Rows plus Y/T raises for\nbalanced shoulder growth\n ',
          battlePlan: '4 rounds\n• 8 Chest-Supported Row\n• 8 Incline Prone Y-Raise\n• 8 Incline Prone T-Raise\nRest 90–120s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Rows and deadlifts develop base power\nand muscle control.\n ',
          battlePlan: '3 rounds:\n• 10 Barbell Bent-Over Row\nRest 60–75s after each set\n• 10 Barbell Deadlift\nRest 60–75s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Combines row grips and good mornings\nfor total back work.\n ',
          battlePlan: '3 rounds:\n• 10 Bent-Over Row\n• 10 Underhand Grip Row\n• 10 Barbell Good Morning\nRest 60–75s after completing the full sequence',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
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
          description: 'Pendlay rows and RDLs balance power\nwith hamstring load.\n ',
          battlePlan: '4 rounds:\n• 8 Pendlay Row\nRest 75–90s after each set\n• 10 Romanian Deadlift\nRest 75–90s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Multi-grip rows, shrugs, deads build\ntraps and mid-back.\n ',
          battlePlan: '3 rounds:\n• 8 Bent-Over Row\n• 8 Reverse-Grip Row\n• 8 Barbell Shrugs\n• 8 Deadlift\nRest 90s after finishing the full circuit',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
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
          description: 'Rows, deads, shrugs overload traps\nand spinal erectors.\n ',
          battlePlan: '4 rounds:\n• 8 Barbell Bent-Over Row\nRest 90–120s after each set\n• 8 Barbell Deadlift\nRest 90–120s after each set\n• 8 Barbell Shrug\nRest 90–120s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Row, high pull, and clean complex\nmaximizes back output.\n ',
          battlePlan: '4 rounds:\n• 8 Barbell Row\n• 8 Barbell High Pull\n• 8 Barbell Power Clean\nRest 90–120s after completing the full sequence',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Rows and deadlifts with kettlebells\nbuild back base\n ',
          battlePlan: '3 rounds\n• 10 Single-Arm KB Row (each side)\nRest 60–75s after each set\n• 10 KB Deadlift\nRest 60–75s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Simple pull + hinge strengthen grip and core',
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
          description: 'Grip and back strength with\nflow style movements\n ',
          battlePlan: '3 rounds\n• 10 KB Single-Arm Row (each side)\n• 10 KB Suitcase Deadlift (each side)\n• 10 KB Swing\nRest 60–75s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Double rows with suitcase pulls\ntrain grip/core\n ',
          battlePlan: '4 rounds\n• 8 Double KB Row\nRest 75–90s after each set\n• 10 KB Suitcase Deadlift\nRest 75–90s after each set',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Heavier bilateral pulls build lats and posture',
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
          description: 'Renegade, gorilla, high pulls\nfor dense volume\n ',
          battlePlan: '3 rounds\n• 8 Renegade Row (each side)\n• 8 Gorilla Row (each side)\n• 8 KB High Pull (each side)\nRest 90s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Balanced rotational pulls and\nhip hinge strength\n ',
          battlePlan: '4 rounds\n• 8 Single-Arm Row (each side)\nRest 90s after set\n• 8 KB Swing\nRest 90s after set\n• 8 KB Deadlift\nRest 90s after set',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Combo snatch, renegade, clean flow\nbuilds power\n ',
          battlePlan: '4 rounds\n• 8 Renegade Row (alternating sides)\n• 8 KB Snatch (each side)\n• 8 KB Clean and Pull\nRest 90–120s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Bodyweight extensions paired with\nshort static holds\n ',
          battlePlan: '3 rounds\n• 12 Back Extensions\nRest 45–60s\n• 2 Roman Chair Holds (20s each)\nRest 60s after set',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
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
          description: 'Extension, twist, and short hold combo\nfor endurance\n ',
          battlePlan: '3 rounds\n• 10 Back Extensions\n• 10 Side-to-Side Twists (at top of extension)\n• 1 Roman Chair Hold (30s)\nRest 60–75s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Weighted extensions and basic hyperextensions\nfor mass\n ',
          battlePlan: '4 rounds\n• 10 Weighted Back Extensions\nRest 75s after set\n• 10 Roman Chair Hyperextensions\nRest 75s after set',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
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
          description: 'Blends extension, superman, side bends\nfor variety\n ',
          battlePlan: '3 rounds\n• 8 Back Extensions\n• 8 Alternating Superman (1 arm + opposite leg)\n• 8 Side Bends (each side)\nRest 90s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Weighted extensions with twist patterns\nfor obliques\n ',
          battlePlan: '4 rounds\n• 10 Weighted Back Extensions\nRest 90s after set\n• 10 Roman Chair Hyperextensions\nRest 90s after set\n• 10 Roman Chair Twists\nRest 90s after set',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Superman lifts plus holds improve\nstability capacity\n ',
          battlePlan: '4 rounds\n• 8 Weighted Back Extensions\n• 8 Alternating Supermans\n• 1 Roman Chair Hold (20–30s)\nRest 90–120s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Simple neutral rowing pattern\nfor beginners\n ',
          battlePlan: '3 rounds\n• 12 Neutral Grip T-Bar Row\nRest 60–75s after set',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
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
          description: 'Wide row variation for\nupper-back foundation\n ',
          battlePlan: '3 rounds\n• 10 Wide Grip T-Bar Row\nRest 60–75s after set',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Simple close grip with\nmoderate-to-heavy focus\n ',
          battlePlan: '4 rounds\n• 10 Close Grip T-Bar Row\nRest 75s after set',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
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
          description: 'Time-under-tension row\nprogression\n ',
          battlePlan: '4 rounds\n• 8 Neutral Grip Row (3–4s eccentric)\nRest 90s after set',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Wide grip rows with\nstatic squeeze finish\n ',
          battlePlan: '4 rounds\n• 8 Wide Grip T-Bar Row\nEnd each set with 10s static hold at full contraction\nRest 90–120s after set',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Wide-to-underhand superset\nwith scap squeezes\n ',
          battlePlan: '4 rounds\n• 8 Wide Grip Row\n• Immediately 8 Underhand Grip Row\n• Finish with 10 Back Squeezes (bodyweight, no load)\nRest 120s after full superset',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Deadlifts and rows for\nbeginner back foundation\n ',
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
          description: 'Deads, rows, shrugs train\nerectors and upper traps\n ',
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
          description: 'Romanian deadlifts with Pendlay rows\nfor balance\n ',
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
          description: 'Deadlifts plus Olympic pulls\nfor hybrid training\n ',
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
          description: 'Heavy hinge, row, shrug focus\nfor dense back work\n ',
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
          description: 'Heavy compound pulls\nwith clean finish\n ',
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
          description: 'Single movement to master\nseated row mechanics\n ',
          battlePlan: '3 rounds\n• 12 Neutral Grip Cable Row\nRest 60–75s after set',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
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
          description: 'Focuses on wide row control\nfor beginners\n ',
          battlePlan: '3 rounds\n• 10 Wide Grip Cable Row\nRest 60–75s after set',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Control-focused row variation\nwith palms up\n ',
          battlePlan: '4 rounds\n• 10 Underhand Grip Cable Row\nRest 75s after set',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
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
          description: 'Single movement with emphasized\nnegative control\n ',
          battlePlan: '4 rounds\n• 8 Neutral Grip Cable Row (3–4s eccentric each rep)\nRest 90s after set',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
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
          description: 'Rows with a final long hold\nat contraction\n ',
          battlePlan: '4 rounds\n• 8 Wide Grip Row\nEnd each set with 10s hold at contraction\nRest 90–120s after set',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
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
          description: 'Wide-to-underhand superset with\npost-set squeezes\n ',
          battlePlan: '4 rounds\n• 8 Wide Grip Row (controlled)\n• Immediately 8 Underhand Grip Row\n• Finish with 10 Standing Back Squeezes (bodyweight scapular retractions, no load)\nRest 120s after full superset',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
  }
  // TODO: Add remaining equipment types (Grip variation pull up bar, Lat pull down machine, etc.)
  // This is a placeholder structure - full equipment database will be implemented later
];

export default function BackWorkoutDisplay() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Back';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse selected equipment from URL parameter
  const selectedEquipment = equipmentParam ? 
    decodeURIComponent(equipmentParam).split(',').map(eq => eq.trim()) : 
    [];

  // Filter workout database based on selected equipment
  const userWorkouts = backWorkoutDatabase.filter(equipmentGroup => 
    selectedEquipment.includes(equipmentGroup.equipment)
  );

  const selectedEquipmentNames = userWorkouts.map(eq => eq.equipment);

  // Get difficulty color
  const difficultyColor = difficulty === 'beginner' ? '#FFD700' : 
                         difficulty === 'intermediate' ? '#FFA500' : '#B8860B';

  const handleGoBack = () => {
    router.back();
  };

  const onStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    console.log('🚀 Starting back workout:', workout.name);
    
    try {
      router.push({
        pathname: '/workout-guidance',
        params: {
          workoutName: workout.name,
          equipment: equipment,
          description: workout.battlePlan || '',
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

  // Equipment Workout Component matching chest path exactly
  const EquipmentWorkout = ({ equipment, icon, workouts }: { 
    equipment: string; 
    icon: keyof typeof Ionicons.glyphMap; 
    workouts: Workout[] 
  }) => {
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
            <View style={[styles.difficultyBadge, { backgroundColor: '#FFD700' }]}>
              <Text style={styles.difficultyBadgeText}>{difficulty.toUpperCase()}</Text>
            </View>
          </View>

          {/* Intensity Reason - Same Width as Photo */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: 'rgba(255, 215, 0, 0.12)',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(255, 215, 0, 0.25)',
            marginHorizontal: 0,
          }}>
            <Ionicons name="information-circle" size={16} color="#FFD700" style={{ color: '#FFD700' }} />
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

  // Create rows of progress steps with max 4 per row (matching cardio format)
  const createProgressRows = () => {
    const allSteps = [
      { icon: 'flame', text: moodTitle, key: 'mood' },
      { icon: 'fitness', text: workoutType, key: 'type' },
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

  const getEquipmentIcon = (equipmentName: string): keyof typeof Ionicons.glyphMap => {
    const equipmentIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'Adjustable bench': 'trending-up-outline',
      'Barbell': 'remove',
      'Grip variation pull up bar': 'git-branch-outline',
      'Kettle bells': 'cafe-outline',
      'Lat pull down machine': 'arrow-down-circle-outline',
      'Roman chair': 'analytics-outline',
      'Seated cable machine': 'accessibility-outline',
      'Seated Chest Supported Row Machine': 'desktop-outline',
      'Straight pull up bar': 'remove-circle-outline',
      'T bar row machine': 'add-outline'
    };
    return equipmentIconMap[equipmentName] || 'fitness';
  };

  if (userWorkouts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>No Workouts Found</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={64} color="#FFD700" />
          <Text style={styles.emptyStateText}>
            No workouts available for the selected back equipment.
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Please try selecting different equipment or check back later.
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
          onPress={handleGoBack}
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

      {/* Workouts List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {userWorkouts.map((equipmentGroup, index) => {
          const workoutsForDifficulty = equipmentGroup.workouts[difficulty as keyof typeof equipmentGroup.workouts] || [];
          
          return (
            <EquipmentWorkout
              key={`${equipmentGroup.equipment}-${index}`}
              equipment={equipmentGroup.equipment}
              icon={equipmentGroup.icon}
              workouts={workoutsForDifficulty}
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
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
    paddingBottom: 40,
  },
  workoutCard: {
    backgroundColor: '#111111',
    marginHorizontal: 24,
    marginVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  equipmentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: '600',
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
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  swipeText: {
    fontSize: 10,
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
    color: '#FFD700',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  difficultyBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.5,
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
    marginBottom: 16,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
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
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    transform: [{ scale: 1.2 }],
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});