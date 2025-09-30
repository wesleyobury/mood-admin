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

// Biceps workout database with detailed workouts for Dumbbells and EZ Curl Bar
const bicepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'DB Curl',
          duration: '10–12 min',
          description: 'Standard dumbbell curl increases beginner strength',
          battlePlan: '3 rounds\n• 10–12 Dumbbell Curls\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds curl discipline with stable elbow position',
          moodTips: [
            {
              icon: 'flash',
              title: 'Keep elbows pinned at sides',
              description: 'Maintain elbow position to isolate biceps effectively.'
            },
            {
              icon: 'body',
              title: 'Lower weights slowly, avoid swinging',
              description: 'Controlled eccentric movement builds strength and prevents injury.'
            }
          ]
        },
        {
          name: 'Hammer Curl',
          duration: '10–12 min',
          description: 'Hammer curl variation develops early arm thickness',
          battlePlan: '3 rounds\n• 10–12 Hammer Curls\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Neutral grip activates forearms and brachialis',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Palms face each other all reps',
              description: 'Neutral grip targets brachialis and forearm muscles.'
            },
            {
              icon: 'timer',
              title: 'Pause lightly at top of curl',
              description: 'Brief pause increases muscle tension and growth stimulus.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Alternating Curl',
          duration: '12–14 min',
          description: 'Alternating curls sharpen balance and strict form',
          battlePlan: '4 rounds\n• 8–10 per arm Alternating DB Curls\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternating arms builds strength and discipline',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Turn palms up fully at top',
              description: 'Full supination maximizes biceps peak contraction.'
            },
            {
              icon: 'body',
              title: 'Don\'t rotate torso when curling',
              description: 'Maintain upright posture to isolate arm movement.'
            }
          ]
        },
        {
          name: 'Negative Curl',
          duration: '12–14 min',
          description: 'Negative dumbbell curls extend training stimulus',
          battlePlan: '3 rounds\n• 8 Dumbbell Curls (3s eccentric)\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Controlled eccentric adds greater hypertrophy load',
          moodTips: [
            {
              icon: 'flash',
              title: 'Raise quickly, lower over 3s',
              description: 'Fast concentric, slow eccentric maximizes muscle growth.'
            },
            {
              icon: 'fitness',
              title: 'Stay tall, don\'t lean',
              description: 'Stable core ensures biceps do all the work.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Curl + Hammer',
          duration: '14–16 min',
          description: 'Pairing curls with hammer expands overall growth',
          battlePlan: '4 rounds\n• 8 Standard DB Curls\nRest 90s\n• 8 Hammer Curls\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combining grips overloads arms with intensity',
          moodTips: [
            {
              icon: 'shield',
              title: 'Keep form strict, reduce weight if swinging',
              description: 'Maintain perfect form throughout both grip variations.'
            },
            {
              icon: 'flash',
              title: 'Maintain tension, no resting at bottom',
              description: 'Keep constant tension on muscles between reps.'
            }
          ]
        },
        {
          name: 'Curl Complex',
          duration: '16–18 min',
          description: 'Complex mix of curls and holds builds serious pump',
          battlePlan: '4 rounds\n• 8 Alternating DB Curls\n• Immediately 8 Hammer Curls\n• End with 10s DB Curl Hold\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Supersets and holds maximize tension duration',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold at 90° to keep muscle fully engaged',
              description: 'Midrange isometric hold maximizes muscle activation.'
            },
            {
              icon: 'flame',
              title: 'Push through the burn — don\'t disengage',
              description: 'Mental toughness through metabolic stress builds strength.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'EZ curl bar',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Bar Curl',
          duration: '10–12 min',
          description: 'Straightforward curls build solid foundation form',
          battlePlan: '3 rounds\n• 10–12 EZ Bar Curls\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'EZ bar reduces wrist stress for easier motion',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip the angled bar comfortably',
              description: 'EZ bar reduces wrist strain while maintaining effectiveness.'
            },
            {
              icon: 'body',
              title: 'Keep elbows locked at your sides',
              description: 'Stable upper arm position isolates biceps movement.'
            }
          ]
        },
        {
          name: 'Wide Grip Curl',
          duration: '10–12 min',
          description: 'Wide grip curls improve control and arm balance',
          battlePlan: '3 rounds\n• 10 Wide Grip EZ Curls\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wide grip shifts stress toward the outer heads',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Wide stance, no shoulder flare',
              description: 'Fixed elbow position targets biceps, not shoulders.'
            },
            {
              icon: 'flash',
              title: 'Squeeze at the top each rep',
              description: 'Peak contraction with controlled breathing pattern.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Narrow Curl',
          duration: '12–14 min',
          description: 'Close grip curls build stronger arm inner heads',
          battlePlan: '4 rounds\n• 8–10 Narrow Grip EZ Curls\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Narrow grip overloads the biceps inner portion',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Palms inward, elbows tight',
              description: 'Close grip targets inner biceps head effectively.'
            },
            {
              icon: 'trending-up',
              title: 'Pull bar to upper chest line',
              description: 'Smooth arc motion maximizes muscle fiber recruitment.'
            }
          ]
        },
        {
          name: 'Negative Curl',
          duration: '12–14 min',
          description: 'Controlled lowering builds growth development fast',
          battlePlan: '3 rounds\n• 8 EZ Bar Curls (3s eccentric)\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Three second eccentric exaggerates curl tension',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explode up, lower in 3s',
              description: 'Explosive concentric, slow eccentric for max growth.'
            },
            {
              icon: 'shield',
              title: 'Stay tall with posture locked',
              description: 'Stable torso ensures biceps handle all resistance.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Narrow',
          duration: '14–16 min',
          description: 'Wide and narrow grips develop balance and size',
          battlePlan: '4 rounds\n• 8 Wide Grip Curl\nRest 90s\n• 8 Narrow Grip Curl\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Grip variance maximizes recruitment across arms',
          moodTips: [
            {
              icon: 'construct',
              title: 'Don\'t overload; stay controlled',
              description: 'Perfect form with both grips trumps heavy weight.'
            },
            {
              icon: 'fitness',
              title: 'Keep elbows locked at sides',
              description: 'Consistent elbow position throughout grip changes.'
            }
          ]
        },
        {
          name: 'Curl + Hold',
          duration: '16–18 min',
          description: 'Fast curls then iso hold fully exhaust the biceps',
          battlePlan: '4 rounds\n• 8 Wide Grip EZ Curl\n• 8 Narrow Grip Curl\n• End with 10s Hold Mid Curl\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Static hold after volume increases muscle stress',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold mid curl for 10s each set',
              description: 'Isometric hold at peak contraction angle builds strength.'
            },
            {
              icon: 'body',
              title: 'Keep posture strict under load',
              description: 'Don\'t compromise form during metabolic stress phase.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'SA cable machine',
    icon: 'swap-vertical',
    workouts: {
      beginner: [
        {
          name: 'Straight Bar Curl',
          duration: '10–12 min',
          description: 'Straight bar curl develops controlled curling form',
          battlePlan: '3 rounds\n• 10–12 Straight Bar Cable Curls\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Cable tension enforces strict and smooth curling',
          moodTips: [
            {
              icon: 'flash',
              title: 'Keep elbows tucked, bar path vertical',
              description: 'Vertical bar path ensures pure bicep isolation.'
            },
            {
              icon: 'body',
              title: 'Don\'t lean back or swing',
              description: 'Stable position maximizes muscle tension.'
            }
          ]
        },
        {
          name: 'Rope Hammer Curl',
          duration: '10–12 min',
          description: 'Rope hammer curl adds overall forearm thickness',
          battlePlan: '3 rounds\n• 10–12 Rope Hammer Curls\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Neutral grip cable work hits brachialis harder',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Spread rope ends at the top',
              description: 'Opening the rope maximizes peak contraction.'
            },
            {
              icon: 'timer',
              title: 'Controlled lowering enhances result',
              description: 'Slow negative builds strength and size.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'EZ Bar Curl',
          duration: '12–14 min',
          description: 'Stronger sets develop hypertrophy with posture',
          battlePlan: '4 rounds\n• 8–10 EZ Bar Cable Curls\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Angled bar grip improves joint comfort heavy',
          moodTips: [
            {
              icon: 'body',
              title: 'Stand tall, no torso swing',
              description: 'Upright posture isolates biceps effectively.'
            },
            {
              icon: 'flash',
              title: 'Lower bar slowly, keep tension',
              description: 'Constant tension maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Cable Negatives',
          duration: '12–14 min',
          description: 'Negative bar curls grow size and total integrity',
          battlePlan: '3 rounds\n• 8 Cable Bar Curls (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Slow eccentrics amplify hypertrophy adaptation',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drive up powerfully, lower 3s',
              description: 'Explosive positive, controlled negative.'
            },
            {
              icon: 'fitness',
              title: 'Elbows fixed at torso sides',
              description: 'Stable elbow position ensures bicep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Rope + Bar Combo',
          duration: '14–16 min',
          description: 'Rope plus bar combo overloads total arm volume',
          battlePlan: '4 rounds\n• 8 Rope Hammer Curls\nRest 60–75s\n• 8 Straight Bar Curls\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Grip pairing works multiple arm muscle fibers',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Rope = neutral, bar = strict supination',
              description: 'Different grips target various muscle fibers.'
            },
            {
              icon: 'flash',
              title: 'Focus pump control with each grip',
              description: 'Maintain control through both variations.'
            }
          ]
        },
        {
          name: 'Cable Curl 21s',
          duration: '16–18 min',
          description: 'Seven seven seven set fully exhausts every curl',
          battlePlan: '3 rounds\n• 7 Bottom Half Cable Curls\n• 7 Top Half Cable Curls\n• 7 Full Range Cable Curls\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Partial and full ranges maximize biceps fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Keep tension, no stack resting',
              description: 'Constant tension through all three phases.'
            },
            {
              icon: 'trending-up',
              title: 'Smooth range in all three phases',
              description: 'Control movement through each range.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Preacher curl machine',
    icon: 'desktop',
    workouts: {
      beginner: [
        {
          name: 'Preacher Intro',
          duration: '10–12 min',
          description: 'Guided preacher curls isolate and strengthen arms',
          battlePlan: '3 rounds\n• 10–12 Preacher Curls\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Arm pad stabilizes curl motion and builds control',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Keep arms locked to the pad',
              description: 'Full pad contact ensures proper isolation.'
            },
            {
              icon: 'flash',
              title: 'Avoid bouncing at the bottom',
              description: 'Smooth motion protects joints and maintains tension.'
            }
          ]
        },
        {
          name: 'Slow Preacher',
          duration: '10–12 min',
          description: 'Tempo preacher curls enhance control and tension',
          battlePlan: '3 rounds\n• 10 Preacher Curls (2–3s descent)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Slowed cadence develops precision under load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower in 2–3s each rep',
              description: 'Controlled tempo maximizes muscle engagement.'
            },
            {
              icon: 'flash',
              title: 'Pause and squeeze at top',
              description: 'Peak contraction enhances muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Preacher',
          duration: '12–14 min',
          description: 'Heavier preacher curls grow arms with intensity',
          battlePlan: '4 rounds\n• 8–10 Heavy Preacher Curls\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Stable preacher pad allows progressive overload',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Drive bar smooth each rep',
              description: 'Consistent power output through full range.'
            },
            {
              icon: 'fitness',
              title: 'Maintain full pad contact',
              description: 'Complete arm support ensures safety and isolation.'
            }
          ]
        },
        {
          name: 'Negative Preacher',
          duration: '12–14 min',
          description: 'Slow negatives increase biceps time under tension',
          battlePlan: '3 rounds\n• 8 Negative Preacher Curls (3s lowering)\nRest 75–90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: '3 second eccentrics add enhanced hypertrophy load',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explode up, lower 3s down',
              description: 'Fast concentric, slow eccentric for maximum growth.'
            },
            {
              icon: 'shield',
              title: 'Control bar to avoid bounce',
              description: 'Smooth transition prevents joint stress.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Narrow',
          duration: '14–16 min',
          description: 'Wide and narrow grips target both biceps heads',
          battlePlan: '4 rounds\n• 8 Wide Grip Preachers\nRest 75s\n• 8 Narrow Grip Preachers\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Changing grips stresses variation in fiber lines',
          moodTips: [
            {
              icon: 'construct',
              title: 'Wide hits outer, narrow inner',
              description: 'Different grips target specific muscle heads.'
            },
            {
              icon: 'fitness',
              title: 'Keep torso against the pad',
              description: 'Stable body position throughout grip changes.'
            }
          ]
        },
        {
          name: 'Preacher Burnout',
          duration: '16–18 min',
          description: 'Burnout preacher curls finish arms under tension',
          battlePlan: '4 rounds\n• 8–10 Preacher Curls\n• End with 10s Midpoint Hold\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Iso holds combined with sets maximize fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Last rep hold 10s halfway',
              description: 'Midpoint hold creates maximum tension.'
            },
            {
              icon: 'flame',
              title: 'Keep tension strict to end',
              description: 'Maintain form through metabolic stress.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Bicep curl machine',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Machine Curl',
          duration: '10–12 min',
          description: 'Standard machine curls build early strength base',
          battlePlan: '3 rounds\n• 10–12 Machine Curls\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Fixed pathway ensures easier curling technique',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Sit tall and grip handles tight',
              description: 'Proper posture and grip maximize effectiveness.'
            },
            {
              icon: 'flash',
              title: 'Pull smooth without bounce',
              description: 'Controlled movement prevents momentum cheating.'
            }
          ]
        },
        {
          name: 'Curl with Pause',
          duration: '10–12 min',
          description: 'Isometric hold improves mind muscle link early',
          battlePlan: '3 rounds\n• 10 Machine Curls (2s pause top)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Peak pause builds muscle contraction strength',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold 2s at top of each rep',
              description: 'Isometric pause increases muscle activation.'
            },
            {
              icon: 'trending-down',
              title: 'Control return phase',
              description: 'Slow negative enhances muscle development.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Machine Curl',
          duration: '12–14 min',
          description: 'Stronger machine curls stimulate hypertrophy gains',
          battlePlan: '4 rounds\n• 8–10 Heavy Machine Curls\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Safe machine setup supports heavier overload',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Lock elbows down to pad',
              description: 'Stable elbow position ensures proper isolation.'
            },
            {
              icon: 'refresh',
              title: 'Perform with steady rhythm',
              description: 'Consistent tempo maximizes muscle engagement.'
            }
          ]
        },
        {
          name: 'Eccentric Curl',
          duration: '12–14 min',
          description: 'Negative machine curls deepen hypertrophy drive',
          battlePlan: '3 rounds\n• 8 Curls (3s eccentric lowering)\nRest 75–90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Slower eccentric motion builds harder tension',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drive up then lower for 3s',
              description: 'Explosive positive, controlled negative.'
            },
            {
              icon: 'fitness',
              title: 'Keep pads tight to arms',
              description: 'Proper pad contact ensures safety and isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Set Curls',
          duration: '14–16 min',
          description: 'Drop sets extend working time for biceps growth',
          battlePlan: '4 rounds\n• 8 Heavy Machine Curls\n• Drop 20% → 8 More Reps\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Removing weight sustains prolonged curl strain',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strip weight quickly after set',
              description: 'Fast transitions maintain muscle fatigue.'
            },
            {
              icon: 'trending-up',
              title: 'Keep reps smooth each drop',
              description: 'Maintain form through all weight reductions.'
            }
          ]
        },
        {
          name: 'Machine Curl Burn',
          duration: '16–18 min',
          description: 'Iso holds at midpoint greatly exhaust the biceps',
          battlePlan: '4 rounds\n• 8 Machine Curls\n• End with 10s Mid Curl Hold\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Static holds boost stimulus beyond normal sets',
          moodTips: [
            {
              icon: 'timer',
              title: 'After last rep, hold 10s mid',
              description: 'Midpoint isometric creates maximum tension.'
            },
            {
              icon: 'shield',
              title: 'No stack slamming at bottom',
              description: 'Control the weight throughout entire range.'
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
          name: 'Assisted Chins',
          duration: '10–12 min',
          description: 'Assisted chin ups help beginners build curl strength',
          battlePlan: '3 rounds\n• 5 Assisted Chin Ups\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Band or machine assistance teaches strict form',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Palms face you, elbows tucked',
              description: 'Chin-up grip maximizes bicep activation.'
            },
            {
              icon: 'construct',
              title: 'Use band/machine as needed',
              description: 'Assistance helps maintain proper form.'
            }
          ]
        },
        {
          name: 'Negative Chins',
          duration: '10–12 min',
          description: 'Negative chin ups improve strength for real reps',
          battlePlan: '3 rounds\n• 5 Negative Chin Ups\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Controlled descent builds stronger arm pulling',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower for 3–5s on each rep',
              description: 'Slow negatives build eccentric strength.'
            },
            {
              icon: 'body',
              title: 'Keep torso steady, no swing',
              description: 'Stable body position ensures muscle focus.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Strict Chins',
          duration: '12–14 min',
          description: 'Strict chin ups strengthen biceps and lats together',
          battlePlan: '4 rounds\n• 6 Chin Ups\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Bodyweight movement grows pulling arm power',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull chest high to bar line',
              description: 'Full range maximizes muscle activation.'
            },
            {
              icon: 'trending-down',
              title: 'Extend fully at bottom each rep',
              description: 'Complete extension ensures full range benefits.'
            }
          ]
        },
        {
          name: 'Chin + Hold',
          duration: '12–14 min',
          description: 'Isometric on bar builds tougher pulling strength',
          battlePlan: '3 rounds\n• 6 Chin Ups\n• End with 3s Hold at Top\nRest 75–90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Finishing hold improves control and endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold top for 3s after last rep',
              description: 'Isometric hold builds pulling endurance.'
            },
            {
              icon: 'body',
              title: 'Do not shrug shoulders up',
              description: 'Keep shoulders down for proper muscle activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Chins',
          duration: '14–16 min',
          description: 'Weighted chin ups grow mass with strict posture',
          battlePlan: '4 rounds\n• 6–8 Weighted Chin Ups\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Adding load forces stronger hypertrophy gains',
          moodTips: [
            {
              icon: 'construct',
              title: 'Add belt or dumbbell slowly',
              description: 'Progressive overload ensures continued growth.'
            },
            {
              icon: 'shield',
              title: 'Never kip or swing body',
              description: 'Strict form maximizes muscle development.'
            }
          ]
        },
        {
          name: 'Chest Bar + Negs',
          duration: '16–18 min',
          description: 'High pulls combined with negatives boost strength',
          battlePlan: '4 rounds\n• 6 Chest to Bar Pull Ups\n• 6 Negative Chin Ups\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Chest to bar reps plus negatives overload arms',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull chest to bar every rep',
              description: 'Maximum range of motion for best results.'
            },
            {
              icon: 'timer',
              title: 'Descend 3–5s consistently',
              description: 'Controlled negatives build eccentric strength.'
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
      {/* Workout Image with Rounded Edges - Match chest dimensions */}
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

      {/* Workout Content - Match chest positioning */}
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

      {/* Swipeable Workouts - Touch-based Implementation with fixed height */}
      <View 
        style={styles.workoutList}
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

export default function BicepsWorkoutDisplayScreen() {
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
    selectedEquipmentNames = ['Dumbbell'];
  }
  
  const difficulty = (params.difficulty as string || 'beginner').toLowerCase();
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = 'Biceps';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment and remove duplicates
  const userWorkouts = selectedEquipmentNames.map(equipmentName => {
    const equipmentData = bicepsWorkoutDatabase.find(
      eq => eq.equipment.toLowerCase() === equipmentName.toLowerCase()
    );
    
    if (equipmentData) {
      const workoutsForDifficulty = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
      return {
        equipment: equipmentData.equipment,
        icon: equipmentData.icon,
        workouts: workoutsForDifficulty
      };
    }
    
    return null;
  }).filter(item => item !== null);

  // Remove duplicate equipment entries
  const uniqueUserWorkouts = userWorkouts.filter((workout, index, self) => 
    index === self.findIndex(w => w!.equipment === workout!.equipment)
  );

  console.log('User workouts:', uniqueUserWorkouts);
  console.log('userWorkoutsLength:', uniqueUserWorkouts.length);

  const handleStartWorkout = (workout: Workout, equipment: string, selectedDifficulty: string) => {
    console.log('🚀 Starting workout:', workout.name);
    console.log('📝 Workout data:', { 
      name: workout.name, 
      equipment, 
      difficulty: selectedDifficulty,
      duration: workout.duration,
      moodTipsCount: workout.moodTips?.length || 0
    });

    try {
      // Navigate to workout guidance with properly encoded parameters
      router.push({
        pathname: '/workout-guidance',
        params: {
          workoutName: workout.name,
          equipment: equipment,
          description: workout.description,
          battlePlan: workout.battlePlan,
          duration: workout.duration,
          difficulty: selectedDifficulty,
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

  const handleGoBack = () => {
    router.back();
  };

  // Create rows of progress steps with max 4 per row (matching chest format)
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
      'Dumbbell': 'barbell',
      'EZ curl bar': 'remove',
      'SA cable machine': 'swap-vertical',
      'Preacher curl machine': 'desktop',
      'Bicep curl machine': 'fitness',
      'Pull up bar': 'remove-outline'
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
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar with Row Layout - Match chest format */}
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
            console.log(`Rendering card ${index + 1}: ${equipmentData!.equipment}`);
            const difficultyWorkouts = equipmentData!.workouts;
            
            return (
              <WorkoutCard
                key={`${equipmentData!.equipment}-${index}`}
                equipment={equipmentData!.equipment}
                icon={equipmentData!.icon}
                workouts={difficultyWorkouts}
                difficulty={difficulty}
                difficultyColor={difficultyColor}
                onStartWorkout={handleStartWorkout}
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
    color: '#FFD700',
  },
  workoutList: {
    height: 400,
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
    color: '#FFD700',
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
    paddingVertical: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noWorkoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 16,
    marginBottom: 8,
  },
  noWorkoutsSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});