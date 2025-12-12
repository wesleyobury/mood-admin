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
          description: 'Short all-out bursts build crisp explosive intent and fast resets',
          battlePlan: '3 rounds\n• 3 × 8s Max Slams (15s between efforts)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/6c5jmoo9_download%20%2832%29.png',
          intensityReason: 'Braced core and hip hinge connection builds safe full-body power',
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
          description: 'Fast alternating arms with high knees build efficient elastic rhythm',
          battlePlan: '4 rounds\n• 15s Alternating Waves\n• 10s In-place High Knees\nRest 45–60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/5mc5mvzc_download%20%2833%29.png',
          intensityReason: 'High-knee wave combo builds explosive arm speed and postural control',
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
          description: 'Hip shifts drive crisp lateral hits without excessive trunk twist',
          battlePlan: '3 rounds\n• 12s Side-to-Side Waves\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/4pzxeicw_download%20%2834%29.png',
          intensityReason: 'Lateral strikes train frontal-plane power control and stability',
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
          description: 'Quick catches teach fast elastic rebound control with rapid transitions',
          battlePlan: '4 rounds\n• 10 Hard Slams\n• 4 Reactive Drop Squats (stick 1s, then pop)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/6c5jmoo9_download%20%2832%29.png',
          intensityReason: 'Slam-to-drop pairing builds reactive control and deceleration skills',
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
          description: 'Light bounce steps maintain high cadence while keeping waves crisp',
          battlePlan: '4 rounds\n• 20s Alternating Waves + Bounce Steps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/5mc5mvzc_download%20%2833%29.png',
          intensityReason: 'Pogo foot rhythm enhances stiffness training and arm velocity',
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
          description: 'Low stance with quick re-grips maintaining constant sled tension',
          battlePlan: '3 rounds\n• 1 × 20–25m Weighted Rope Pull (hand-over-hand)\n• 10s Easy Waves reset\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/4pzxeicw_download%20%2834%29.png',
          intensityReason: 'Heavy horizontal pulls develop rapid start-phase force production',
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
          description: 'Repeat maximum slams while preserving consistent height and tempo',
          battlePlan: '5 rounds\n• 12s Max Slams\nRest 18s\nRepeat 2 efforts per round (total 10 max efforts)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/6c5jmoo9_download%20%2832%29.png',
          intensityReason: 'Short bursts with tight rest intervals sustain peak power output',
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
          description: 'Crisp lateral hits maintained across short cluster intervals',
          battlePlan: '4 rounds\n• Cluster: 10s Side-to-Side Waves, 10s rest, 10s Waves\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/5mc5mvzc_download%20%2833%29.png',
          intensityReason: 'Cluster format sharpens lateral velocity maintenance under fatigue',
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
          description: 'Load the movement pattern, then sprint tall with explosive knee drive',
          battlePlan: '5 rounds\n• 1 × 20m HEAVY Rope Pull (hand-over-hand to sled)\n• 20m Acceleration Sprint\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/4pzxeicw_download%20%2834%29.png',
          intensityReason: 'Heavy pulls potentiate and enhance sprint acceleration mechanics',
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
          description: 'Fast step drive, brief float phase, and soft balanced landing',
          battlePlan: '3 rounds\n• 6 per leg Step-Up Pops (low box)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/nro93355_slbj.png',
          intensityReason: 'Low-impact vertical force development with precise movement control',
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
          description: 'Jump up confidently, hold two seconds, train calm deceleration',
          battlePlan: '3 rounds\n• 5 Box Jumps (stick 2s)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/wok1mz8a_rbj.png',
          intensityReason: 'Emphasizes safe landing quality and proper joint alignment skills',
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
          description: 'Step off 6-8 inches, pop to box with minimal ground contact',
          battlePlan: '3 rounds\n• 3 Depth Step → Rebound to Box (low)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/ofqstfu6_download%20%281%29.png',
          intensityReason: 'Drop then quick rebound primes stretch-shortening cycle timing',
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
          description: 'Crisp consecutive jumps with short resets to preserve power output',
          battlePlan: '4 rounds\n• 6–8 Box Jumps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/wok1mz8a_rbj.png',
          intensityReason: 'Repeated jump efforts build sustainable explosive power capacity',
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
          description: 'Hold dumbbells at sides; drive up quick; land soft on box top',
          battlePlan: '4 rounds\n• 5 per leg Weighted Step-Up Pops\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/9x4an2wx_wstepups.png',
          intensityReason: 'Light external load raises concentric force demand safely',
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
          description: 'Drop down, stick one second hold, then rebound to box immediately',
          battlePlan: '4 rounds\n• 3 Depth Drop (stick 1s) → Rebound to Box\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/ofqstfu6_download%20%281%29.png',
          intensityReason: 'Eccentric stick then rapid takeoff improves force development rate',
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
          description: 'Light dumbbells or vest; jump explosively to moderate-high box',
          battlePlan: '5 rounds\n• 6–8 Weighted Box Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/okorghxb_wbj.png',
          intensityReason: 'Small load increases power demands under controlled landing stress',
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
          description: 'Drop down, rebound on floor, then jump to box with quick rhythm',
          battlePlan: '5 rounds\n• Triplet: 1 Depth Drop → 1 Floor Rebound → 1 Box Jump\n• Repeat 2 triplets/round (6 jumps)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/ofqstfu6_download%20%281%29.png',
          intensityReason: 'Multi-contact jump series develops reactive elastic stiffness',
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
          description: 'Continuous box bounds followed immediately by crisp weighted steps',
          battlePlan: '4 rounds\n• 8–10 Continuous Box Bounds (no full reset)\n• Immediately 6 Weighted Step-Up Pops (3/leg)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/9x4an2wx_wstepups.png',
          intensityReason: 'Rhythm bounds then loaded pops challenge explosive power endurance',
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
          description: 'Step forward, snap wrists through, receive softly, repeat quickly',
          battlePlan: '4 rounds\n• 8–10 Chest Passes (medium ball)\nRest 45–60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/xacltrm0_download.png',
          intensityReason: 'Linear throw patterns teach explosive timing and core stiffness',
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
          description: 'Tall reach overhead, neutral spine, direct powerful slam motion',
          battlePlan: '3 rounds\n• 8–10 Overhead Slams\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/dkiyafwm_download%20%281%29.png',
          intensityReason: 'Full-body slam movement grooves explosive hinge-to-slam linkage',
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
          description: 'Quick hip lead rotation into wall with controlled ball rebound',
          battlePlan: '3 rounds\n• 6–8 per side Short Tosses\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/od2vv8jo_mb.jpg',
          intensityReason: 'Compact rotational movement links hips, core, and release timing',
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
          description: 'Hinge load deep, tall finish, toss high, catch safely overhead',
          battlePlan: '4 rounds\n• 6–8 Vertical Scoop Tosses\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/lywbjyl3_download%20%282%29.png',
          intensityReason: 'Hip triple extension movement with clean explosive release timing',
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
          description: 'Load back hip deeply, rotate through core, snap into wall target',
          battlePlan: '4 rounds\n• 6–8 per side Rotational Throws\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/od2vv8jo_mb.jpg',
          intensityReason: 'Larger range of motion increases explosive lateral power transfer',
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
          description: 'Hard slam down, instant scoop up, repeat at consistent steady height',
          battlePlan: '4 rounds\n• 8–10 Overhead Slams\n• 8–10 Fast Scoop Resets\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/dkiyafwm_download%20%281%29.png',
          intensityReason: 'Rapid reset pattern trains repeatable explosive power output',
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
          description: 'Stretch away from target, unwind explosively, heave far with stick landing',
          battlePlan: '4 rounds\n• 5–6 per side Heaves (mark distance)\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/od2vv8jo_mb.jpg',
          intensityReason: 'Counter-rotation preload enables maximal explosive lateral power release',
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
          description: 'Short explosive bursts separated by micro-rests to maintain crisp quality',
          battlePlan: '4 rounds\n• Cluster: 4 Slams, 12s rest, 4 Slams\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/dkiyafwm_download%20%281%29.png',
          intensityReason: 'Cluster training design sustains high-quality explosive outputs',
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
          description: 'Big rotational heave for distance; freeze posture on finish position',
          battlePlan: '5 rounds\n• 4–5 per side Heave + Stick (mark best)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/od2vv8jo_mb.jpg',
          intensityReason: 'Maximum lateral power output combined with controlled deceleration',
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
          description: 'Short 8-10 meter drives with stacked, rigid core positioning',
          battlePlan: '4 rounds\n• 8–10m Sled Push (light)\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/tpb5vjf0_download%20%288%29.png',
          intensityReason: 'Training teaches forward lean mechanics, stride, and first-step power',
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
          description: 'Quick small backward steps maintaining tall upright posture',
          battlePlan: '3 rounds\n• 12–15m Backward Drag (light)\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/hl5sfr6f_Screenshot%202025-12-03%20at%201.34.15%E2%80%AFPM.png',
          intensityReason: 'Quad-focused drag movement builds deceleration and drive strength',
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
          description: 'Smooth 180-degree turn, re-set lean angle, continue powerful steps',
          battlePlan: '3 rounds\n• 10m Push → 10m Pull (harness or rope)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/5naojfbu_download%20%287%29.png',
          intensityReason: 'Direction changes sharpen re-acceleration and movement transition',
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
          description: 'High-quality explosive drives with measured recovery between efforts',
          battlePlan: '5 rounds\n• 12–15m Sprint Push (light-moderate)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/5naojfbu_download%20%287%29.png',
          intensityReason: 'Repeated 12-15 meter efforts build explosive acceleration rate capacity',
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
          description: 'Long ground pushes, steady forward lean, rope tension constant',
          battlePlan: '4 rounds\n• 20–25m Harness Pull\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/l5cdm1b1_download%20%286%29.png',
          intensityReason: 'Horizontal pull resistance increases posterior chain force output',
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
          description: 'Forward explosive push then backward drag with smooth direction turn',
          battlePlan: '4 rounds\n• 15m Sprint Push\n• 15m Backward Drag\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/tpb5vjf0_download%20%288%29.png',
          intensityReason: 'Contrast pairing effectively balances front and back chain strength',
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
          description: 'Micro-efforts with micro-rest intervals to maintain explosive quality',
          battlePlan: '4 rounds\n• Cluster: 4 × 5m Sled Push, 15s between efforts\nRest 120s between clusters',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/5naojfbu_download%20%287%29.png',
          intensityReason: 'Repeated 5-meter bursts sharpen explosive first-step power output',
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
          description: 'Direction shuttle changes with quick re-acceleration timing control',
          battlePlan: '5 rounds\n• 10m Push → 10m Pull → 10m Push\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/orxi24d4_Screenshot%202025-12-03%20at%201.34.50%E2%80%AFPM.png',
          intensityReason: 'Fast directional transitions challenge loaded agility and control',
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
          description: 'Smooth sled push followed immediately by tall, fast free sprint',
          battlePlan: '5 rounds\n• 15m Sled Push (light)\n• 20–25m Free Sprint\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/tpb5vjf0_download%20%288%29.png',
          intensityReason: 'Light sled resistance primes then free sprint expresses max speed',
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
          description: 'Hips drive explosively; bell floats; arms stay relaxed as hooks',
          battlePlan: '4 rounds\n• 12–15 Swings\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/hdv3g2g2_download.png',
          intensityReason: 'Hip hinge timing builds explosive hip extension velocity patterns',
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
          description: 'Deep hike pass, tall explosive stand, crisp stop at chest line',
          battlePlan: '3 rounds\n• 6 × 2 Dead-Start Swings\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/hdv3g2g2_download.png',
          intensityReason: 'Dead start resets reinforce clean, powerful explosive reps',
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
          description: 'Close zip path, explosive hip pop, quiet catch in front rack',
          battlePlan: '3 rounds\n• 6 per side Cleans\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/ua443jp0_download%20%281%29.png',
          intensityReason: 'Clean movement path teaches explosive rack timing and turnover',
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
          description: 'Short consistent bursts every minute maintain explosive quality outputs',
          battlePlan: 'EMOM 10 min\n• 12 Swings each minute',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/hdv3g2g2_download.png',
          intensityReason: 'On-the-minute training sets sharpen sustainable explosive power',
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
          description: 'Explosive pop to rack, fast drop squat, explosive stand tall finish',
          battlePlan: '4 rounds\n• 5 per side Clean → Squat (alt)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/87sblt74_download%20%282%29.png',
          intensityReason: 'Clean-to-squat movement strengthens complete explosive power chain',
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
          description: 'High explosive pull, punch through fast, crisp overhead lockout',
          battlePlan: '4 rounds\n• 6 per side Snatches\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/ic2iad2y_download%20%283%29.png',
          intensityReason: 'Overhead hip power movement with smooth explosive turnover path',
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
          description: 'Big explosive hip snap; stable ribs; float bell to chest height',
          battlePlan: '5 rounds\n• 12 Heavy Swings\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/fetvhtg2_download%20%284%29.png',
          intensityReason: 'Heavier kettlebells raise power output and demand movement control',
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
          description: 'Tight rack position, strict press up, alternate sides cleanly',
          battlePlan: '4 rounds\n• Ladder per side: 3-2-1 Clean + Press\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/ic2iad2y_download%20%283%29.png',
          intensityReason: 'Clean-to-press movement converts explosive force to vertical work',
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
          description: 'Explosive snatch reps then stick broad jumps for max distance',
          battlePlan: '4 rounds\n• 8 per side Snatches\n• 3 Broad Jumps (stick 2s)\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/ic2iad2y_download%20%283%29.png',
          intensityReason: 'Overhead explosive power primes horizontal jumping explosion',
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
          description: 'Scoop bag close to body, drive hips tall for controlled shoulder positioning',
          battlePlan: '3 rounds\n• 5 per side Shouldering (alt)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/0i6z6vvq_download%20%282%29.png',
          intensityReason: 'Ground-to-shoulder movement pattern builds explosive triple extension power',
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
          description: 'Drive hips explosively to front rack position with quick high elbow turnover',
          battlePlan: '3 rounds\n• 6–8 Cleans\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/93nr796t_sbclean.jpg',
          intensityReason: 'Clean turnover develops fast elbow timing and explosive catch positioning',
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
          description: 'Load with deep hinge, launch bag 2-4 meters, chase and reset stance safely',
          battlePlan: '4 rounds\n• 4 Heaves (mark distance)\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/m2c4155r_download%20%283%29.png',
          intensityReason: 'Short heave distances build safe release timing and throwing form control',
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
          description: 'Switch shoulders each rep maintaining snug, stable holds throughout movement',
          battlePlan: '4 rounds\n• 6 per side Shouldering (alt)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/0i6z6vvq_download%20%282%29.png',
          intensityReason: 'Alternating shoulder reps develop balanced symmetrical explosive power work',
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
          description: 'Clean bag, safely drop to ground, then perform quick soft bodyweight jumps',
          battlePlan: '4 rounds\n• 5 Cleans\n• 4 Jump Squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/93nr796t_sbclean.jpg',
          intensityReason: 'Clean primes neuromuscular system for vertical jump with better power output',
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
          description: 'Pivot feet explosively, drive hips forcefully, release bag across the body',
          battlePlan: '4 rounds\n• 5 per side Tosses (mark distance)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/p8n74eov_download%20%284%29.png',
          intensityReason: 'Hip-led rotational movement develops powerful frontal-plane explosive power',
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
          description: 'Front rack drop position, explosive leg drive, crisp overhead lockout finish',
          battlePlan: '5 rounds\n• 4 Clean → Thrusters\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/93nr796t_sbclean.jpg',
          intensityReason: 'Clean-to-press movement ties lower and upper explosive power chain together',
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
          description: 'Hug bag tight against torso; perform quick low-amplitude reactive jumps safely',
          battlePlan: '5 rounds\n• 6–8 Loaded Jumps\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/mmapy9w7_download%20%285%29.png',
          intensityReason: 'Light unstable load pattern trains reactive vertical core stiffness control',
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
          description: 'Deep hinge preload, tall explosive snap, launch bag near optimal 45 degrees',
          battlePlan: '5 rounds\n• 3–4 Heaves (measure best)\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/m2c4155r_download%20%283%29.png',
          intensityReason: 'Maximum-distance throws challenge explosive timing and power output intent',
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
          description: 'Small amplitude leg switches with quiet, aligned soft landings',
          battlePlan: '3 rounds\n• 6–8 per side Split Jumps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/l6tkpcq3_ssj.webp',
          intensityReason: 'Switch jumps teach reactive stiffness with controlled low shock',
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
          description: 'Pop jump up, two-second hold position, repeat crisp landings',
          battlePlan: '3 rounds\n• 6–8 Squat Pops (stick 2s)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/wc6us2rn_download%20%2835%29.png',
          intensityReason: 'Deceleration focus improves landing control and joint stability',
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
          description: 'Lateral side hops with controlled stick landing and knee tracking',
          battlePlan: '3 rounds\n• 6–8 per side Skater Bounds (stick 1–2s)\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/rzd2lfq8_download%20%2836%29.png',
          intensityReason: 'Lateral bound movements build explosive frontal-plane strength',
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
          description: 'Clean plank position, snap feet in, tall jump with soft landing',
          battlePlan: '4 rounds\n• 10–12 Burpees\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/9hhkr62t_download%20%2837%29.png',
          intensityReason: 'Ground-to-air cycles train rapid full-body explosive power',
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
          description: 'Big explosive arm swing, hinge load deep, stick stable landings',
          battlePlan: '4 rounds\n• 5–6 Broad Jumps (stick 2s)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/9vb7hgg8_bj.jpg',
          intensityReason: 'Horizontal jump patterns build explosive hip drive and projection',
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
          description: 'Minimal ground contact rebounds with quiet mid-foot spring action',
          battlePlan: '4 rounds\n• 20s Pogos\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/yfhezq7k_download%20%2838%29.png',
          intensityReason: 'Ankle pogo hop pattern trains reactive stiffness and rhythm',
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
          description: 'Quick reactive floor contact into long, stuck broad jump distance',
          battlePlan: '5 rounds\n• Cluster: 1 Depth Jump → 1 Broad Jump, 20s rest, repeat once (2 pairings)\nRest 120s between clusters',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/n37wkroc_dj.jpg',
          intensityReason: 'Shock absorption drop then explosive horizontal power expression',
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
          description: 'High tempo jumps with consistent height and quiet landing control',
          battlePlan: '5 rounds\n• 10–12 per side Split Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/wpx96hu6_Screenshot%202025-12-03%20at%2011.25.54%E2%80%AFAM.png',
          intensityReason: 'Repeated leg switches stress explosive elastic reactivity patterns',
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
          description: 'Complete burpee into long broad jump with decisive explosive burst',
          battlePlan: '5 rounds\n• 5 Burpee → Broad Jump\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_544192a6-040f-432b-8e63-a96565e3e281/artifacts/snvyacrk_download%20%2840%29.png',
          intensityReason: 'Combined movement cycles train complete full-body explosive flow',
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
          <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
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
          <Text style={styles.workoutDescription} numberOfLines={2}>{item.description}</Text>
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

      {/* Workout List - Native Swipe Enabled */}
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
                console.log(`Dot clicked: ${index}, Current: ${currentWorkoutIndex}`);
                const offset = (width - 48) * index;
                console.log(`Scrolling to offset: ${offset}`);
                
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

export default function BodyweightExplosivenessWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Parse URL parameters
  const rawMoodTitle = params.mood as string || 'Build explosion';
  // Convert "I want to build explosiveness" to "Build explosion" for display
  const moodTitle = rawMoodTitle.toLowerCase().includes('explosiveness') ? 'Build explosion' : rawMoodTitle;
  const workoutType = params.workoutType as string || 'Body Weight';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';

  // Decode equipment names
  const selectedEquipmentNames = equipmentParam ? 
    decodeURIComponent(equipmentParam).split(',').map(name => name.trim()) : [];

  // Cart hooks (removed addedItems to prevent button flashing)
  const { addToCart, isInCart } = useCart();
  const { token } = useAuth();

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

  const createWorkoutId = React.useCallback((workout: Workout, equipment: string, difficulty: string) => {
    return `${workout.name}-${equipment}-${difficulty}`;
  }, []);

  const handleAddToCart = React.useCallback((workout: Workout, equipment: string) => {
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
      workoutType: `${moodTitle} - Body weight`,
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
  }, [createWorkoutId, difficulty, moodTitle, addToCart, isInCart]);

  const handleGoBack = () => {
    router.back();
  };

  const handleStartWorkout = React.useCallback((workout: Workout, equipment: string, difficulty: string) => {
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
  }, [router, workoutType]);

  // Create progress bar - single row with requested order
  const createProgressRows = () => {
    const steps = [
      { key: 'mood', icon: 'flash', text: moodTitle },
      { key: 'bodyPart', icon: 'body', text: workoutType },
      { key: 'difficulty', icon: 'speedometer', text: difficulty === 'intermediate' ? 'Intermed.' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `${selectedEquipmentNames.length} Equipment` },
    ];

    // Return single row
    return [steps];
  };

  // Workout Card Component matching I want to sweat format

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
              difficultyColor='#FFD700'
              onStartWorkout={handleStartWorkout}
              isInCart={isInCart}
              createWorkoutId={createWorkoutId}
              handleAddToCart={handleAddToCart}
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
    color: '#FFFFFF',
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
    paddingBottom: 24,
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
    height: 370,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  workoutImageContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'visible',
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
    color: '#FFD700',
    fontSize: 11,
    color: '#FFFFFF',
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
    marginBottom: 8,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 8,
    marginTop: -8,
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