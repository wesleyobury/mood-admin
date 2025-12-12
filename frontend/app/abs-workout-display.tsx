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

// Complete Abs workout database with chest-format card descriptions and detailed battle plans
const absWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Body Weight',
    icon: 'body',
    workouts: {
      beginner: [
        {
          name: 'Standard Crunch',
          duration: '8–10 min',
          description: 'Simple crunch develops mind-muscle connection safely for beginner abs.\n ',
          battlePlan: '3 rounds\n• 12–15 Crunches\nRest 45s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/9ppti423_download%20%2811%29.png',
          intensityReason: 'Intro movement builds baseline flexion ab strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl upper back, don\'t yank neck',
              description: 'Proper form protects your neck and maximizes ab engagement.'
            },
            {
              icon: 'flash',
              title: 'Exhale as you reach contraction',
              description: 'Coordinated breathing enhances muscle activation.'
            }
          ]
        },
        {
          name: 'Forearm Plank Hold',
          duration: '8–10 min',
          description: 'Teaches proper core bracing and builds strong foundational abdominal stability..\n ',
          battlePlan: '3 rounds\n• 3 × 20–30s Plank Holds\nRest 45s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/rptdlvng_download%20%2812%29.png',
          intensityReason: 'Static hold trains core for anti extension endurance',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep hips level, don\'t sag',
              description: 'Maintain proper plank alignment for maximum effectiveness.'
            },
            {
              icon: 'shield',
              title: 'Brace abs like resisting a hit',
              description: 'Think about bracing for impact to engage deep core muscles.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'V Up',
          duration: '10–12 min',
          description: 'Challenging bodyweight drill effectively targets the entire abdominal wall..\n ',
          battlePlan: '4 rounds\n• 10–12 V Ups\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/cesyx69b_download%20%2815%29.png',
          intensityReason: 'Combines flexion of torso + legs for full ab load',
          moodTips: [
            {
              icon: 'flash',
              title: 'Legs + arms rise together',
              description: 'Coordinate movement for maximum ab contraction.'
            },
            {
              icon: 'timer',
              title: 'Balance at top momentarily',
              description: 'Brief pause at peak increases muscle activation.'
            }
          ]
        },
        {
          name: 'Bicycle Crunch',
          duration: '10–12 min',
          description: 'Builds rotational endurance and activates entire core musculature effectively..\n ',
          battlePlan: '3 rounds\n• 12 per side Bicycle Crunches\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/pvvftlsu_download%20%2816%29.png',
          intensityReason: 'Alternating twist works obliques + midline control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Elbow toward opposite knee',
              description: 'Focus on rotation to engage obliques effectively.'
            },
            {
              icon: 'flash',
              title: 'Keep knees hovering off floor',
              description: 'Constant tension maintains ab engagement throughout.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Hanging Leg Raise (Bar)',
          duration: '12–14 min',
          description: 'Very challenging hanging movement requiring strength and controlled execution..\n ',
          battlePlan: '3 rounds\n• 8–10 Hanging Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/n5wg8sb5_download%20%2817%29.png',
          intensityReason: 'Hanging position overloads abs through hip flexion',
          moodTips: [
            {
              icon: 'construct',
              title: 'Don\'t swing torso, control legs',
              description: 'Strict form prevents momentum and maximizes ab work.'
            },
            {
              icon: 'flash',
              title: 'Bring toes high toward bar',
              description: 'Full range of motion maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Hollow Body + Pike Jump',
          duration: '12–14 min',
          description: 'Brutal hybrid workout testing both dynamic and static abdominal strength capacity..\n ',
          battlePlan: '3 rounds\n• 20s Hollow Hold\n• Immediately 8 Stiff Leg Pike Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/x9dvjaa1_download%20%282%29.png',
          intensityReason: 'Iso hold builds endurance, jumps build explosiveness',
          moodTips: [
            {
              icon: 'shield',
              title: 'Lower back pressed into floor',
              description: 'Maintain hollow position to protect lower back.'
            },
            {
              icon: 'flash',
              title: 'Jump quick, land on soft toes',
              description: 'Explosive movement with controlled landing.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Ab Roller',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Wall Assisted Rollout',
          duration: '8–10 min',
          description: 'Lets true beginners practice safe core extension with wall support assistance..\n ',
          battlePlan: '3 rounds\n• 12–15 Wall Rollouts\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gw2t6eg7_download%20%281%29.png',
          intensityReason: 'Wall stop reduces risk while building bracing control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Roll until wheel meets wall soft',
              description: 'Controlled movement prevents overextension.'
            },
            {
              icon: 'flash',
              title: 'Brace abs, squeeze pulling back',
              description: 'Focus on core strength to return to start position.'
            }
          ]
        },
        {
          name: 'Short Range Rollout',
          duration: '8–10 min',
          description: 'Builds starter strength to prepare for full extensions.\n ',
          battlePlan: '3 rounds\n• 12–15 Short Rollouts\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/7i1n31ck_download.png',
          intensityReason: 'Controlled partial rep trains tension in safer range',
          moodTips: [
            {
              icon: 'construct',
              title: 'Extend halfway, ribs tucked',
              description: 'Maintain rib position to protect lower back.'
            },
            {
              icon: 'timer',
              title: 'Pause, squeeze contraction top',
              description: 'Brief pause builds strength and control.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Full Ab Rollout',
          duration: '10–12 min',
          description: 'Long stretch motion challenges anterior abs strongly.\n ',
          battlePlan: '4 rounds\n• 8 Full Rollouts\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gw2t6eg7_download%20%281%29.png',
          intensityReason: 'Full range engages deep abdominals with control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hips stay tucked, no sagging',
              description: 'Maintain proper hip position throughout movement.'
            },
            {
              icon: 'flash',
              title: 'Pull back squeezing abs tight',
              description: 'Active ab contraction powers the return movement.'
            }
          ]
        },
        {
          name: 'Rollout + Plank Hold',
          duration: '12–14 min',
          description: 'Pair movement rollout and plank for total ab burn.\n ',
          battlePlan: '3 rounds\n• 8 Rollouts\n• 20s Plank Hold\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/7i1n31ck_download.png',
          intensityReason: 'Flexion with static hold strengthens ab endurance',
          moodTips: [
            {
              icon: 'construct',
              title: 'Core braced during rollout',
              description: 'Maintain constant core tension throughout.'
            },
            {
              icon: 'shield',
              title: 'Stay rigid in plank position',
              description: 'Perfect plank form after rollouts challenges endurance.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Standing Rollout',
          duration: '12–14 min',
          description: 'Requires elite bracing strength and anterior stability.\n ',
          battlePlan: '3 rounds\n• 5–6 Standing Rollouts\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gw2t6eg7_download%20%281%29.png',
          intensityReason: 'Max difficulty rollout challenges core extension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Start near wall, progress away',
              description: 'Gradually increase difficulty as strength improves.'
            },
            {
              icon: 'shield',
              title: 'Keep ribs pulled down strict',
              description: 'Rib position is crucial for safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Rollout with 3s Eccentric',
          duration: '12–14 min',
          description: '3s descend rollout punishes abs with strict tempo.\n ',
          battlePlan: '3 rounds\n• 6–8 Slow Eccentric Rollouts (3s down)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/7i1n31ck_download.png',
          intensityReason: 'Slow lowering multiplies tension for maximal core',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower forward on 3 count',
              description: 'Controlled eccentric builds incredible strength.'
            },
            {
              icon: 'flash',
              title: 'Squeeze abs returning smooth',
              description: 'Focus on smooth, controlled return movement.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Ab Crunch Machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Machine Crunch (Light)',
          duration: '8–10 min',
          description: 'Builds abdominal control using small guided resisted spinal flexion movement..\n ',
          battlePlan: '3 rounds\n• 12–15 Light Crunches\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/i706j2jh_abss.webp',
          intensityReason: 'Entry movement teaches crunch with resistance path',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl spine, don\'t pull arms',
              description: 'Focus on spinal flexion, not arm movement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze abs at top hard',
              description: 'Peak contraction maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Machine Crunch Pause',
          duration: '8–10 min',
          description: 'Isometric crunch teaches control and endurance reps.\n ',
          battlePlan: '3 rounds\n• 10 Crunches (2s hold)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9jii3lwp_abs.jpg',
          intensityReason: 'Static top hold boosts power of ab contraction',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak 2s contraction',
              description: 'Isometric holds build strength and control.'
            },
            {
              icon: 'flash',
              title: 'Exhale and squeeze abs top',
              description: 'Breathing coordination enhances contraction.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Crunch',
          duration: '10–12 min',
          description: 'Machine allows safe progressive overload to abs.\n ',
          battlePlan: '4 rounds\n• 8–10 Heavy Crunches\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/i706j2jh_abss.webp',
          intensityReason: 'Increased resistance thickens ab structure well',
          moodTips: [
            {
              icon: 'construct',
              title: 'Pull slow, avoid jerking pad',
              description: 'Smooth movement ensures proper muscle engagement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze crunch peak contraction',
              description: 'Focus on quality contraction over speed.'
            }
          ]
        },
        {
          name: 'Crunch + Leg Raise',
          duration: '12–14 min',
          description: 'Isolation combo burns abdominal wall comprehensively.\n ',
          battlePlan: '3 rounds\n• 8 Crunches\n• 10 Hanging Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9jii3lwp_abs.jpg',
          intensityReason: 'Superset works upper + lower abs in one session',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl torso tight at crunch top',
              description: 'Maximize spinal flexion for upper ab engagement.'
            },
            {
              icon: 'flash',
              title: 'Lift legs smooth, no swing',
              description: 'Controlled leg raises target lower abs effectively.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Set Crunch',
          duration: '12–14 min',
          description: 'Extended time under tension breaks ab plateaus.\n ',
          battlePlan: '3 rounds\n• 10 Heavy Crunches\n• Drop → 8 reps\n• Drop → 8 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/i706j2jh_abss.webp',
          intensityReason: 'Drop weight pushes contraction beyond fatigue point',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strip 15–20% fast, keep form',
              description: 'Quick weight changes maintain intensity.'
            },
            {
              icon: 'construct',
              title: 'Crunch, pause, squeeze at top',
              description: 'Maintain quality throughout all drop sets.'
            }
          ]
        },
        {
          name: 'Iso Crunch + Flutter Kicks',
          duration: '12–14 min',
          description: 'Extended tension exercise strengthens abs endurance.\n ',
          battlePlan: '3 rounds\n• 8 Crunches + 10s Hold\n• Immediately 15 Flutter Kicks\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9jii3lwp_abs.jpg',
          intensityReason: 'Holds plus kicks exhaust abs dynamically and isometric',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold contraction top 10s',
              description: 'Sustained contraction builds incredible endurance.'
            },
            {
              icon: 'flash',
              title: 'Keep abs braced with flutter',
              description: 'Maintain core tension throughout flutter kicks.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Captain\'s Chair',
    icon: 'desktop',
    workouts: {
      beginner: [
        {
          name: 'Knee Raise',
          duration: '8–10 min',
          description: 'Controlled movement isolates lower ab recruitment.\n ',
          battlePlan: '3 rounds\n• 10–12 Knee Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/bvoxdf8z_download%20%2814%29.png',
          intensityReason: 'Basic raise builds lower abdominal lift strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Pull knees slow to chest',
              description: 'Controlled movement maximizes muscle engagement.'
            },
            {
              icon: 'shield',
              title: 'Back pressed against pad',
              description: 'Maintain back contact for stability and safety.'
            }
          ]
        },
        {
          name: 'Straight Leg Hold',
          duration: '8–10 min',
          description: 'Lockout position burns abs for lower focus stability.\n ',
          battlePlan: '3 rounds\n• 15s Holds\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/e782pm7q_download%20%2813%29.png',
          intensityReason: 'Isometric hold increases abs\' endurance demands',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold legs extended forward',
              description: 'Maintain straight leg position throughout hold.'
            },
            {
              icon: 'shield',
              title: 'Don\'t let hips shift around',
              description: 'Stable hip position maintains proper muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Straight Leg Raise',
          duration: '10–12 min',
          description: 'Builds strength in lower abs with stable path control.\n ',
          battlePlan: '4 rounds\n• 8–10 Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/0ga9gll0_download%20%285%29.png',
          intensityReason: 'Full ROM raise loads abs through longer range',
          moodTips: [
            {
              icon: 'construct',
              title: 'Lower legs slow and steady',
              description: 'Controlled eccentric maximizes muscle development.'
            },
            {
              icon: 'flash',
              title: 'Avoid swinging up quick',
              description: 'Smooth movement prevents momentum compensation.'
            }
          ]
        },
        {
          name: 'Knee Raise + Twist',
          duration: '12–14 min',
          description: 'Hits lower abs and sides in one combined superset.\n ',
          battlePlan: '3 rounds\n• 8 per side Knee Raise Twist\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gtb4564s_download%20%284%29.png',
          intensityReason: 'Twist adds oblique rotation into lower ab raises',
          moodTips: [
            {
              icon: 'construct',
              title: 'Twist knees left, right alternate',
              description: 'Alternating rotation engages obliques effectively.'
            },
            {
              icon: 'shield',
              title: 'Keep torso steady upright',
              description: 'Stable torso isolates the twisting movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Leg Raise',
          duration: '12–14 min',
          description: 'Dumbbell held securely between feet amplifies difficulty and muscle activation..\n ',
          battlePlan: '3 rounds\n• 8–10 Weighted Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/9xx4tww6_Screenshot%202025-12-05%20at%206.17.40%E2%80%AFPM.png',
          intensityReason: 'Extra load maximizes ab contraction from raises',
          moodTips: [
            {
              icon: 'construct',
              title: 'Secure weight firm at feet',
              description: 'Proper weight placement ensures safety and control.'
            },
            {
              icon: 'flash',
              title: 'Control lowering slowly',
              description: 'Resist gravity to maximize muscle engagement.'
            }
          ]
        },
        {
          name: 'Leg Raise + Slow Eccentric',
          duration: '12–14 min',
          description: 'Builds more strength with controlled negative reps.\n ',
          battlePlan: '3 rounds\n• 8–10 Leg Raises (3s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/pow4f7e4_download%20%2813%29.png',
          intensityReason: 'Slow eccentric multiplies ab contraction stress',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lift quick, lower 3s slow',
              description: 'Emphasis on eccentric builds exceptional strength.'
            },
            {
              icon: 'flash',
              title: 'Keep tension through descent',
              description: 'Maintain muscle engagement throughout lowering.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Roman Hyperextension',
    icon: 'return-down-forward',
    workouts: {
      beginner: [
        {
          name: 'Bodyweight Side Bend',
          duration: '8–10 min',
          description: 'Learns lateral bending to build oblique connection.\n ',
          battlePlan: '3 rounds\n• 10 per side Side Bends\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9xys14l8_download%20%289%29.png',
          intensityReason: 'Basic side crunch trains obliques with safe control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Move slow, don\'t swing torso',
              description: 'Controlled movement prevents injury and maximizes engagement.'
            },
            {
              icon: 'flash',
              title: 'Focus on oblique squeeze top',
              description: 'Peak contraction builds mind-muscle connection.'
            }
          ]
        },
        {
          name: 'Supported Crunch',
          duration: '8–10 min',
          description: 'Controlled entry drill targets upper ab connection.\n ',
          battlePlan: '3 rounds\n• 10–12 Supported Crunches\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/geuifix4_download%20%288%29.png',
          intensityReason: 'Small crunch on bench works abs beginner safe',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl spine slightly forward',
              description: 'Focus on spinal flexion for proper ab engagement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze abs hard top rep',
              description: 'Peak contraction maximizes muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Weighted Side Bend',
          duration: '10–12 min',
          description: 'Builds oblique thickness with controlled weighted reps.\n ',
          battlePlan: '4 rounds\n• 8–10 per side Weighted Bends\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9xys14l8_download%20%289%29.png',
          intensityReason: 'Progression adds resistance for lateral growth',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hug plate firm to chest',
              description: 'Secure weight placement ensures proper form.'
            },
            {
              icon: 'flash',
              title: 'Move only side to side',
              description: 'Pure lateral movement isolates obliques effectively.'
            }
          ]
        },
        {
          name: 'Oblique Twist Sit Up',
          duration: '12–14 min',
          description: 'Twisting sit up enhances rotational ab engagement.\n ',
          battlePlan: '3 rounds\n• 8 per side Twisting Sit Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/geuifix4_download%20%288%29.png',
          intensityReason: 'Rotating adds dynamic work for obliques strongly',
          moodTips: [
            {
              icon: 'construct',
              title: 'Rotate torso controlled',
              description: 'Smooth rotation prevents injury and maximizes engagement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze on each twist top',
              description: 'Peak contraction at each twist builds strength.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Sit Up',
          duration: '12–14 min',
          description: 'Progressive overload thickens abs via weighted and controlled sit ups.\n ',
          battlePlan: '3 rounds\n• 8–10 Weighted Sit Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9xys14l8_download%20%289%29.png',
          intensityReason: 'Added weight enhances muscular demand on abs',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hug plate tight chest',
              description: 'Secure weight placement maintains proper form.'
            },
            {
              icon: 'timer',
              title: 'Squeeze abs at top pause',
              description: 'Brief pause maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Sit Up with 3s Hold Top',
          duration: '12–14 min',
          description: 'Hold then release makes sit up much more demanding.\n ',
          battlePlan: '3 rounds\n• 8 Sit Ups (3s hold top)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/geuifix4_download%20%288%29.png',
          intensityReason: 'Iso contraction hold increases abs endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Rise slow, pause 3s top',
              description: 'Extended hold builds incredible endurance.'
            },
            {
              icon: 'flash',
              title: 'Abs squeeze hard at hold',
              description: 'Maximum contraction during isometric phase.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Medicine Ball',
    icon: 'basketball',
    workouts: {
      beginner: [
        {
          name: 'MB Crunch',
          duration: '8–10 min',
          description: 'Beginner crunch builds control with small resistance.\n ',
          battlePlan: '3 rounds\n• 12 MB Crunches\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Light ball adds gentle overload to crunch pattern',
          moodTips: [
            {
              icon: 'construct',
              title: 'Ball above chest steady',
              description: 'Stable ball position maintains proper form.'
            },
            {
              icon: 'flash',
              title: 'Squeeze contraction top hard',
              description: 'Peak contraction maximizes muscle engagement.'
            }
          ]
        },
        {
          name: 'Seated MB Twist',
          duration: '8–10 min',
          description: 'Dynamic twisting strengthens side core stability.\n ',
          battlePlan: '3 rounds\n• 10 per side Twists\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vv8j4fll_download.png',
          intensityReason: 'Rotation works obliques with ball resistance control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Torso upright, feet up off mat',
              description: 'Proper position isolates core muscles effectively.'
            },
            {
              icon: 'flash',
              title: 'Rotate shoulders, squeeze side',
              description: 'Focus on oblique contraction with each twist.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'MB Overhead Sit Up',
          duration: '10–12 min',
          description: 'Long lever increases core demand and stretch tension.\n ',
          battlePlan: '4 rounds\n• 8–10 MB Sit Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Lever arm extended overhead intensifies abs load',
          moodTips: [
            {
              icon: 'construct',
              title: 'Arms straight, no bending',
              description: 'Maintain extended lever throughout movement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze top contraction tight',
              description: 'Peak contraction overcomes longer lever arm.'
            }
          ]
        },
        {
          name: 'MB Slam + Plank Hold',
          duration: '12–14 min',
          description: 'Dynamic then static pairing builds full capacity.\n ',
          battlePlan: '3 rounds\n• 8 MB Slams\n• 25s Plank Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vv8j4fll_download.png',
          intensityReason: 'Explosive slam pairs with core static endurance',
          moodTips: [
            {
              icon: 'flash',
              title: 'Slam ball with abs not arms',
              description: 'Core-driven slam maximizes ab engagement.'
            },
            {
              icon: 'shield',
              title: 'Keep hips level plank',
              description: 'Perfect plank form after dynamic movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'MB V Sit Twist',
          duration: '12–14 min',
          description: 'Heavy core load combining balance and twist with med ball.\n ',
          battlePlan: '3 rounds\n• 10 per side V Twists\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Rotational V sit fires obliques under high stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Chest tall, core braced firm',
              description: 'Maintain posture throughout challenging movement.'
            },
            {
              icon: 'flash',
              title: 'Rotate slow, abs squeezed',
              description: 'Controlled rotation with constant core tension.'
            }
          ]
        },
        {
          name: 'MB Slam + Toe Touch Finisher',
          duration: '12–14 min',
          description: 'Brutal pairing challenges power and contraction.\n ',
          battlePlan: '3 rounds\n• 8 MB Slams\n• 10 MB Toe Touches\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vv8j4fll_download.png',
          intensityReason: 'Targets entire abs with slam then toe reach combo',
          moodTips: [
            {
              icon: 'flash',
              title: 'Slam strong with abs engaged',
              description: 'Core-driven power movement builds explosive strength.'
            },
            {
              icon: 'construct',
              title: 'Strive to touch toes top',
              description: 'Full range toe touch maximizes ab contraction.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Decline Bench',
    icon: 'trending-down',
    workouts: {
      beginner: [
        {
          name: 'Decline Sit Up (Bodyweight)',
          duration: '8–10 min',
          description: 'Bodyweight baseline drill builds control and strength.\n ',
          battlePlan: '3 rounds\n• 10–12 Decline Sit Ups\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/lwwxsgl0_download%20%287%29.png',
          intensityReason: 'Decline angle increases core range and challenge',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl torso slowly up',
              description: 'Controlled movement maximizes muscle engagement.'
            },
            {
              icon: 'flash',
              title: 'Hard squeeze at top rep',
              description: 'Peak contraction maximizes ab activation.'
            }
          ]
        },
        {
          name: 'Decline Crunch',
          duration: '8–10 min',
          description: 'Works midline without excessive torso movement.\n ',
          battlePlan: '3 rounds\n• 12–15 Decline Crunches\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/azdoubte_download%20%286%29.png',
          intensityReason: 'Short ROM targets abs intensely with safety and lower tension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Small crunch only, spine curl',
              description: 'Focus on spinal flexion for targeted ab work.'
            },
            {
              icon: 'flash',
              title: 'Exhale squeeze contraction',
              description: 'Coordinate breathing for maximum muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Weighted Sit Up',
          duration: '10–12 min',
          description: 'Strengthens core wall with consistent loaded work.\n ',
          battlePlan: '4 rounds\n• 8 Sit Ups w/ Plate\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/lwwxsgl0_download%20%287%29.png',
          intensityReason: 'Holding plate increases progressive overload stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hug plate close chest',
              description: 'Secure weight placement maintains proper form.'
            },
            {
              icon: 'timer',
              title: 'Pause squeeze contraction',
              description: 'Brief hold at peak maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Twisting Sit Up',
          duration: '12–14 min',
          description: 'Full abs trained with twist motion superset strategy.\n ',
          battlePlan: '3 rounds\n• 8 per side Twisting Sit Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/azdoubte_download%20%286%29.png',
          intensityReason: 'Rotational sit up engages obliques + rectus combo',
          moodTips: [
            {
              icon: 'construct',
              title: 'Rotate elbow toward knee',
              description: 'Twisting motion engages obliques effectively.'
            },
            {
              icon: 'flash',
              title: 'Core tight, control twist',
              description: 'Maintain core tension throughout rotation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: '1½ Rep Sit Up',
          duration: '12–14 min',
          description: 'Time under tension drill builds durability fully while adding strength.\n ',
          battlePlan: '3 rounds\n• 8 Combo Reps (half+full =1)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/lwwxsgl0_download%20%287%29.png',
          intensityReason: 'Combo half+full doubles ab contraction under load',
          moodTips: [
            {
              icon: 'construct',
              title: 'Perform half then full smoothly',
              description: 'Continuous movement maintains muscle tension.'
            },
            {
              icon: 'flash',
              title: 'Squeeze hard both times',
              description: 'Dual contractions maximize muscle engagement.'
            }
          ]
        },
        {
          name: 'Decline Sit Up + Flutter Kicks',
          duration: '12–14 min',
          description: 'Powerful finisher blends flexion and endurance set.\n ',
          battlePlan: '3 rounds\n• 8 Decline Sit Ups\n• Immediately 15 Flutter Kicks\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/azdoubte_download%20%286%29.png',
          intensityReason: 'Sit ups paired with flutter kicks torch abs fully',
          moodTips: [
            {
              icon: 'flash',
              title: 'Abs tight during sit ups',
              description: 'Maintain core engagement throughout movement.'
            },
            {
              icon: 'construct',
              title: 'Kick legs steady below bench',
              description: 'Controlled flutter kicks maintain constant tension.'
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
  handleAddToCart: (workout: Workout, equipment: string) => void;
}

const WorkoutCard = React.memo(({ 
  equipment, 
  icon, 
  workouts, 
  difficulty, 
  difficultyColor, 
  onStartWorkout,
  isInCart,
  createWorkoutId,
  handleAddToCart,
}: WorkoutCardProps) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [localScaleAnim] = useState(new Animated.Value(1));
  const flatListRef = useRef<FlatList>(null);

  const handleAddToCartWithAnimation = (workout: Workout) => {
    // Animate locally without affecting parent
    Animated.sequence([
      Animated.timing(localScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(localScaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(localScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Call parent handler
    handleAddToCart(workout, equipment);
  };

  console.log(`💪 WorkoutCard for ${equipment}: received ${workouts.length} workouts for ${difficulty} difficulty`);  const renderWorkout = ({ item, index }: { item: Workout; index: number }) => (
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
          <Ionicons name={icon} size={24} color="#FFD700" />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <WigglingAddButton
          isInCart={isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty))}
          onPress={() => handleAddToCartWithAnimation(workouts[currentWorkoutIndex])}
          scaleAnim={localScaleAnim}
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
});

export default function AbsWorkoutDisplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Abs';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Cart hooks (removed addedItems to prevent button flashing)
  const { addToCart, isInCart } = useCart();
  const { token } = useAuth();
  
  // Parse equipment from params
  const selectedEquipmentNames = equipmentParam 
    ? decodeURIComponent(equipmentParam).split(',')
    : [];

  const createWorkoutId = (workout: Workout, equipment: string, difficulty: string) => {
    return `${workout.name}-${equipment}-${difficulty}`;
  };

  const handleAddToCart = (workout: Workout, equipment: string) => {
    const workoutId = createWorkoutId(workout, equipment, difficulty);
    
    if (isInCart(workoutId)) {
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

    // Add to cart
    if (token) {
      Analytics.workoutAddedToCart(token, {
        workout_name: workout.name,
        mood_category: moodTitle,
        equipment: equipment,
      });
    }
    addToCart(workoutItem);
  };

  // Filter workouts based on selected equipment
  const relevantWorkouts = absWorkoutDatabase.filter(equipmentWorkouts => 
    selectedEquipmentNames.includes(equipmentWorkouts.equipment)
  );

  // Remove duplicates and get unique equipment workouts
  const uniqueUserWorkouts = relevantWorkouts.filter((workout, index, self) => 
    index === self.findIndex((w) => w.equipment === workout.equipment)
  );

  // Get difficulty color - all the same neon gold to match chest path
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  const difficultyColor = getDifficultyColor(difficulty);

  const handleStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    console.log('Starting workout:', workout.name, 'with', equipment, 'at', difficulty, 'level');
    
    router.push({
      pathname: '/workout-guidance',
      params: {
        workoutName: workout.name,
        equipment: equipment,
        description: workout.description,
        battlePlan: workout.battlePlan,
        duration: workout.duration,
        difficulty: difficulty,
        workoutType: workoutType,
        moodTips: encodeURIComponent(JSON.stringify(workout.moodTips))
      }
    });
  };

  const handleGoBack = () => {
    router.back();
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
                handleAddToCart={handleAddToCart}
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
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
  },
  intensityReason: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginLeft: 8,
  },
  workoutDescriptionContainer: {
    marginBottom: 0,
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
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginTop: -11,
    marginBottom: 1,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 8,
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: -6,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  dotsLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
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
    textAlign: 'center',
  },
  noWorkoutsSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 22,
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