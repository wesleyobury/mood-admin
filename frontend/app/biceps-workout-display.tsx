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
import WigglingAddButton from '../components/WigglingAddButton';

const { width } = Dimensions.get('window');

interface MoodTip {
  icon: string;
  title: string;
  description: string;
}

interface Workout {
  name: string;
  duration: string;
  description: string;
  battlePlan: string;
  imageUrl: string;
  intensityReason: string;
  moodTips: MoodTip[];
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Builds curl discipline with stable elbow position',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Keep elbows pinned at sides',
              description: 'Maintain strict form throughout movement.'
            },
            {
              icon: 'trending-down',
              title: 'Lower weights slowly, avoid swinging',
              description: 'Control the negative for better gains.'
            }
          ]
        },
        {
          name: 'Hammer Curl',
          duration: '10–12 min',
          description: 'Hammer curl variation develops early arm thickness',
          battlePlan: '3 rounds\n• 10–12 Hammer Curls\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Neutral grip activates forearms and brachialis',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Palms face each other all reps',
              description: 'Neutral grip maximizes forearm engagement.'
            },
            {
              icon: 'timer',
              title: 'Pause lightly at top of curl',
              description: 'Brief pause increases muscle activation.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Alternating arms builds strength and discipline',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Turn palms up fully at top',
              description: 'Full supination maximizes bicep contraction.'
            },
            {
              icon: 'body',
              title: 'Don\'t rotate torso when curling',
              description: 'Keep core stable for isolated arm work.'
            }
          ]
        },
        {
          name: 'Negative Curl',
          duration: '12–14 min',
          description: 'Negative dumbbell curls extend training stimulus',
          battlePlan: '3 rounds\n• 8 Dumbbell Curls (3s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Controlled eccentric adds greater hypertrophy load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Raise quickly, lower over 3s',
              description: 'Extended negative phase builds strength.'
            },
            {
              icon: 'body',
              title: 'Stay tall, don\'t lean',
              description: 'Proper posture prevents momentum.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Combining grips overloads arms with intensity',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Keep form strict, reduce weight if swinging',
              description: 'Quality over quantity for best results.'
            },
            {
              icon: 'flash',
              title: 'Maintain tension, no resting at bottom',
              description: 'Constant tension maximizes hypertrophy.'
            }
          ]
        },
        {
          name: 'Curl Complex',
          duration: '16–18 min',
          description: 'Complex mix of curls and holds builds serious pump',
          battlePlan: '4 rounds\n• 8 Alternating DB Curls\n• Immediately 8 Hammer Curls\n• End with 10s DB Curl Hold\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Supersets and holds maximize tension duration',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold at 90° to keep muscle fully engaged',
              description: 'Isometric hold increases time under tension.'
            },
            {
              icon: 'flame',
              title: 'Push through the burn — don\'t disengage',
              description: 'Mental toughness builds physical results.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'EZ Curl Bar',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Bar Curl',
          duration: '10–12 min',
          description: 'Straightforward curls build solid foundation form',
          battlePlan: '3 rounds\n• 10–12 EZ Bar Curls\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'EZ bar reduces wrist stress for easier motion and more power',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip the angled bar comfortably',
              description: 'EZ bar angle protects wrists.'
            },
            {
              icon: 'fitness',
              title: 'Keep elbows locked at your sides',
              description: 'Fixed elbow position isolates biceps.'
            }
          ]
        },
        {
          name: 'Wide Grip Curl',
          duration: '10–12 min',
          description: 'Wide grip curls improve control and arm balance',
          battlePlan: '3 rounds\n• 10 Wide Grip EZ Curls\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Wide grip shifts stress toward the outer heads',
          moodTips: [
            {
              icon: 'body',
              title: 'Wide stance, no shoulder flare',
              description: 'Stable base prevents momentum.'
            },
            {
              icon: 'flash',
              title: 'Squeeze at the top each rep',
              description: 'Peak contraction builds definition.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'Narrow grip overloads the biceps inner portion',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Keep palms inward, elbows close',
              description: 'Narrow grip targets inner biceps.'
            },
            {
              icon: 'trending-up',
              title: 'Pull bar to upper chest line',
              description: 'Full range maximizes muscle fiber recruitment.'
            }
          ]
        },
        {
          name: 'Negative Curl',
          duration: '12–14 min',
          description: 'Controlled lowering builds growth development fast',
          battlePlan: '3 rounds\n• 8 EZ Bar Curls (3s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Three second eccentric exaggerates curl tension',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explode up, lower in 3s',
              description: 'Fast concentric, slow eccentric.'
            },
            {
              icon: 'body',
              title: 'Stay tall with posture locked',
              description: 'Prevent body English for isolation.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'Grip variance maximizes recruitment across arms',
          moodTips: [
            {
              icon: 'shield',
              title: 'Don\'t overload; stay controlled',
              description: 'Form matters more than weight.'
            },
            {
              icon: 'fitness',
              title: 'Keep elbows locked at sides',
              description: 'Consistent elbow position ensures isolation.'
            }
          ]
        },
        {
          name: 'Curl + Hold',
          duration: '16–18 min',
          description: 'Fast curls then iso hold fully exhaust the biceps',
          battlePlan: '4 rounds\n• 8 Wide Grip EZ Curl\n• 8 Narrow Grip Curl\n• End with 10s Hold Mid Curl\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Static hold after volume increases muscle stress',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold mid curl for 10s each set',
              description: 'Isometric position builds endurance.'
            },
            {
              icon: 'body',
              title: 'Keep posture strict under load',
              description: 'Don\'t sacrifice form when fatigued.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Cable Machine',
    icon: 'swap-vertical',
    workouts: {
      beginner: [
        {
          name: 'Straight Bar Curl',
          duration: '10–12 min',
          description: 'Straight bar curl develops controlled curling form',
          battlePlan: '3 rounds\n• 10–12 Straight Bar Cable Curls\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/3z2y67t7_cc.jpg',
          intensityReason: 'Cable tension enforces strict and smooth curling',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Keep elbows tucked, bar path vertical',
              description: 'Straight bar path maximizes bicep engagement.'
            },
            {
              icon: 'body',
              title: 'Don\'t lean back or swing',
              description: 'Cable provides constant tension.'
            }
          ]
        },
        {
          name: 'Rope Hammer Curl',
          duration: '10–12 min',
          description: 'Rope hammer curl adds overall forearm thickness',
          battlePlan: '3 rounds\n• 10–12 Rope Hammer Curls\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/jzrqwni6_download.png',
          intensityReason: 'Neutral grip cable work hits brachialis harder for fuller arms',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Spread rope ends at the top',
              description: 'Spreading rope increases peak contraction.'
            },
            {
              icon: 'trending-down',
              title: 'Controlled lowering enhances result',
              description: 'Slow negative builds strength.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/qi05o2xg_download%20%2819%29.png',
          intensityReason: 'Angled bar grip improves joint comfort heavy',
          moodTips: [
            {
              icon: 'body',
              title: 'Stand tall, no torso swing',
              description: 'Stable core isolates arm work.'
            },
            {
              icon: 'timer',
              title: 'Lower bar slowly, keep tension',
              description: 'Cable provides constant resistance.'
            }
          ]
        },
        {
          name: 'Cable Negatives',
          duration: '12–14 min',
          description: 'Negative bar curls grow size and total integrity with greater muscle fiber recruitment',
          battlePlan: '3 rounds\n• 8 Cable Bar Curls (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/vqw55nvb_download%20%2818%29.png',
          intensityReason: 'Slow eccentrics amplify hypertrophy adaptation',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drive up powerfully, lower 3s',
              description: 'Explosive concentric, controlled eccentric.'
            },
            {
              icon: 'fitness',
              title: 'Elbows fixed at torso sides',
              description: 'Locked elbows ensure bicep isolation.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/waan6rau_download%20%2820%29.png',
          intensityReason: 'Grip pairing works multiple arm muscle fibers',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rope = neutral, bar = strict supination',
              description: 'Different grips target different fibers.'
            },
            {
              icon: 'flash',
              title: 'Focus pump control with each grip',
              description: 'Mind-muscle connection is key.'
            }
          ]
        },
        {
          name: 'Cable Curl 21s',
          duration: '16–18 min',
          description: 'Seven seven seven set fully exhausts every curl',
          battlePlan: '3 rounds\n• 7 Bottom Half Cable Curls\n• 7 Top Half Cable Curls\n• 7 Full Range Cable Curls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/jzrqwni6_download.png',
          intensityReason: 'Partial and full ranges maximize biceps fatigue',
          moodTips: [
            {
              icon: 'shield',
              title: 'Keep tension, no stack resting',
              description: 'Constant tension throughout all 21 reps.'
            },
            {
              icon: 'trending-up',
              title: 'Smooth range in all three phases',
              description: 'Control through partial and full ranges.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Preacher Curl Machine',
    icon: 'desktop',
    workouts: {
      beginner: [
        {
          name: 'Preacher Intro',
          duration: '10–12 min',
          description: 'Guided preacher curls isolate and strengthen arms',
          battlePlan: '3 rounds\n• 10–12 Preacher Curls\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Arm pad stabilizes curl motion and builds control',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Keep arms locked to the pad',
              description: 'Pad support ensures strict isolation.'
            },
            {
              icon: 'shield',
              title: 'Avoid bouncing at the bottom',
              description: 'Controlled movement prevents injury.'
            }
          ]
        },
        {
          name: 'Slow Preacher',
          duration: '10–12 min',
          description: 'Tempo preacher curls enhance control and tension',
          battlePlan: '3 rounds\n• 10 Preacher Curls (2–3s descent)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: 'Slowed cadence develops precision under load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower in 2–3s each rep',
              description: 'Slow tempo increases time under tension.'
            },
            {
              icon: 'flash',
              title: 'Pause and squeeze at top',
              description: 'Peak contraction builds strength.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Stable preacher pad allows progressive overload',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Drive bar smooth each rep',
              description: 'Consistent tempo under heavy load.'
            },
            {
              icon: 'fitness',
              title: 'Maintain full pad contact',
              description: 'Pad contact ensures proper isolation.'
            }
          ]
        },
        {
          name: 'Negative Preacher',
          duration: '12–14 min',
          description: 'Slow negatives increase biceps time under tension',
          battlePlan: '3 rounds\n• 8 Negative Preacher Curls (3s lowering)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: '3 second eccentrics add enhanced hypertrophy load',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explode up, lower 3s down',
              description: 'Fast up, slow down for growth.'
            },
            {
              icon: 'shield',
              title: 'Control bar to avoid bounce',
              description: 'Smooth transition at bottom protects elbows.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Changing grips stresses variation in fiber lines',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Wide hits outer, narrow inner',
              description: 'Different grips target different heads.'
            },
            {
              icon: 'body',
              title: 'Keep torso against the pad',
              description: 'Body position maintains strict form.'
            }
          ]
        },
        {
          name: 'Preacher Burnout',
          duration: '16–18 min',
          description: 'Burnout preacher curls finish arms under tension',
          battlePlan: '4 rounds\n• 8–10 Preacher Curls\n• End with 10s Midpoint Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: 'Iso holds combined with sets maximize fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Last rep hold 10s halfway',
              description: 'Isometric hold fully exhausts muscle.'
            },
            {
              icon: 'flame',
              title: 'Keep tension strict to end',
              description: 'Mental toughness completes the set.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Biceps Curl Machine',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Machine Curl',
          duration: '10–12 min',
          description: 'Standard machine curls build early strength base',
          battlePlan: '3 rounds\n• 10–12 Machine Curls\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/um46qpzr_download%20%283%29.png',
          intensityReason: 'Fixed pathway ensures easier curling technique',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Sit tall and grip handles tight',
              description: 'Proper posture ensures effective movement.'
            },
            {
              icon: 'shield',
              title: 'Pull smooth without bounce',
              description: 'Controlled reps prevent injury.'
            }
          ]
        },
        {
          name: 'Curl with Pause',
          duration: '10–12 min',
          description: 'Isometric hold improves mind muscle link early, with curl machine hyper extension',
          battlePlan: '3 rounds\n• 10 Machine Curls (2s pause top)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/h9obln9e_download%20%282%29.png',
          intensityReason: 'Peak pause builds muscle contraction strength',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold 2s at top of each rep',
              description: 'Pause increases peak contraction.'
            },
            {
              icon: 'trending-down',
              title: 'Control return phase',
              description: 'Slow negative builds strength.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/um46qpzr_download%20%283%29.png',
          intensityReason: 'Safe machine setup supports heavier overload',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Lock elbows down to pad',
              description: 'Fixed position maximizes isolation.'
            },
            {
              icon: 'refresh',
              title: 'Perform with steady rhythm',
              description: 'Consistent tempo builds strength.'
            }
          ]
        },
        {
          name: 'Eccentric Curl',
          duration: '12–14 min',
          description: 'Negative machine curls deepen hypertrophy drive',
          battlePlan: '3 rounds\n• 8 Curls (3s eccentric lowering)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/h9obln9e_download%20%282%29.png',
          intensityReason: 'Slower eccentric motion builds harder tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Drive up then lower for 3s',
              description: 'Extended negative phase builds size.'
            },
            {
              icon: 'fitness',
              title: 'Keep pads tight to arms',
              description: 'Proper pad contact ensures isolation.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/um46qpzr_download%20%283%29.png',
          intensityReason: 'Removing weight sustains prolonged curl strain',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strip weight quickly after set',
              description: 'Fast transition maximizes intensity.'
            },
            {
              icon: 'trending-up',
              title: 'Keep reps smooth each drop',
              description: 'Maintain form through fatigue.'
            }
          ]
        },
        {
          name: 'Machine Curl Burn',
          duration: '16–18 min',
          description: 'Iso holds at midpoint greatly exhaust the biceps',
          battlePlan: '4 rounds\n• 8 Machine Curls\n• End with 10s Mid Curl Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/h9obln9e_download%20%282%29.png',
          intensityReason: 'Static holds boost stimulus beyond normal sets',
          moodTips: [
            {
              icon: 'timer',
              title: 'After last rep, hold 10s mid',
              description: 'Isometric position creates metabolic stress.'
            },
            {
              icon: 'shield',
              title: 'No stack slamming at bottom',
              description: 'Control throughout maintains tension.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Pull Up Bar',
    icon: 'remove-outline',
    workouts: {
      beginner: [
        {
          name: 'Assisted Chins',
          duration: '10–12 min',
          description: 'Assisted chin ups help beginners build curl strength',
          battlePlan: '3 rounds\n• 5 Assisted Chin Ups\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h4qn95p_download.png',
          intensityReason: 'Band or machine assistance teaches strict form',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Palms face you, elbows tucked',
              description: 'Underhand grip targets biceps.'
            },
            {
              icon: 'fitness',
              title: 'Use band/machine as needed',
              description: 'Assistance helps build strength gradually.'
            }
          ]
        },
        {
          name: 'Negative Chins',
          duration: '10–12 min',
          description: 'Negative chin ups improve strength for real reps',
          battlePlan: '3 rounds\n• 5 Negative Chin Ups\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iac5dn06_cups.jpeg',
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
              description: 'Strict form prevents momentum.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h4qn95p_download.png',
          intensityReason: 'Bodyweight movement grows pulling arm power',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull chest high to bar line',
              description: 'Full range maximizes muscle recruitment.'
            },
            {
              icon: 'fitness',
              title: 'Extend fully at bottom each rep',
              description: 'Complete extension ensures full range.'
            }
          ]
        },
        {
          name: 'Chin + Hold',
          duration: '12–14 min',
          description: 'Isometric on bar builds tougher pulling strength',
          battlePlan: '3 rounds\n• 6 Chin Ups\n• End with 3s Hold at Top\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iac5dn06_cups.jpeg',
          intensityReason: 'Finishing hold improves control and endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold top for 3s after last rep',
              description: 'Isometric hold builds endurance.'
            },
            {
              icon: 'body',
              title: 'Do not shrug shoulders up',
              description: 'Keep shoulders down and engaged.'
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
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h4qn95p_download.png',
          intensityReason: 'Adding load forces stronger hypertrophy gains',
          moodTips: [
            {
              icon: 'construct',
              title: 'Add belt or dumbbell slowly',
              description: 'Progressive overload builds strength.'
            },
            {
              icon: 'shield',
              title: 'Never kip or swing body',
              description: 'Strict form prevents injury.'
            }
          ]
        },
        {
          name: 'Chest Bar + Negs',
          duration: '16–18 min',
          description: 'High pulls combined with negatives boost strength',
          battlePlan: '4 rounds\n• 6 Chest to Bar Pull Ups\n• 6 Negative Chin Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iac5dn06_cups.jpeg',
          intensityReason: 'Chest to bar reps plus negatives overload arms',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull chest to bar every rep',
              description: 'Full range maximizes development.'
            },
            {
              icon: 'timer',
              title: 'Descend 3–5s consistently',
              description: 'Controlled negatives build strength.'
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

export default function BicepsWorkoutDisplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const equipmentParam = params.equipment as string || '';
  let selectedEquipmentNames: string[] = [];
  
  try {
    if (equipmentParam) {
      const decodedEquipment = decodeURIComponent(equipmentParam);
      selectedEquipmentNames = decodedEquipment.split(',').map(name => name.trim());
    }
  } catch (error) {
    console.error('Error parsing equipment parameter:', error);
    selectedEquipmentNames = ['Dumbbell'];
  }
  
  const difficulty = (params.difficulty as string || 'beginner').toLowerCase();
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = 'Biceps';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Cart and animation hooks
  const { addToCart, isInCart } = useCart();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const getDifficultyColor = (level: string) => {
    return '#FFD700';
  };

  const difficultyColor = getDifficultyColor(difficulty);

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

  const uniqueUserWorkouts = userWorkouts.filter((workout, index, self) => 
    index === self.findIndex(w => w!.equipment === workout!.equipment)
  );

  console.log('User workouts:', uniqueUserWorkouts);
  console.log('userWorkoutsLength:', uniqueUserWorkouts.length);

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
      workoutType: workoutType,
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

  const createProgressRows = () => {
    const steps = [
      { key: 'mood', icon: 'flame', text: moodTitle },
      { key: 'bodyPart', icon: 'fitness', text: workoutType },
      { key: 'difficulty', icon: 'speedometer', text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `${selectedEquipmentNames.length} Equipment` },
    ];

    return [steps];
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

      {/* Progress Bar */}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
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
    fontWeight: '600',
    color: '#ffffff',
  },
  workoutList: {
    height: 370,
    overflow: 'visible',
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
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
    color: '#ffffff',
    marginLeft: 4,
    fontWeight: '600',
  },
  workoutContent: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
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
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  intensityReason: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  workoutDescriptionContainer: {
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
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
    justifyContent: 'center',
    gap: 12,
  },
  dotTouchArea: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 28,
    minHeight: 28,
    borderRadius: 14,
  },
  activeDotTouchArea: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
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
