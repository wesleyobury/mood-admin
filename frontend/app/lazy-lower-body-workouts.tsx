import React, { useState, useRef, useCallback } from 'react';
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
import AddWorkoutIndicator from '../components/AddWorkoutIndicator';

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

// Lower body workout database with all press, pull, and full lower body workouts
const lowerBodyWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Press',
    icon: 'arrow-up',
    workouts: {
      beginner: [
        {
          name: 'Quad Starter',
          duration: '8–10 min',
          description: 'Leg press base, knee extensions next, calves finish smoothly.',
          battlePlan: 'Leg Press (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nLeg Extension (machine)\n• 3 × 10–12 (RPE 4), 45–60s rest\nSeated Calf Raise (machine)\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/p3j5vmje_download.png',
          intensityReason: 'Guided machines load quads safely with minimal setup.',
          moodTips: [
            {
              icon: 'body',
              title: 'Seat tight; feet mid-sled; full foot contact',
              description: 'Seat tight; feet mid-sled; full foot contact'
            },
            {
              icon: 'time',
              title: 'Smooth 2–1–3 tempo; stop shy of lock',
              description: 'Smooth 2–1–3 tempo; stop shy of lock'
            }
          ]
        },
        {
          name: 'Chair Line',
          duration: '8–10 min',
          description: 'Extensions first, press for volume, calves for finish.',
          battlePlan: 'Leg Extension (machine)\n• 3 × 10–12 (RPE 4), 45–60s rest\nLeg Press (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nCalf Press (on leg press)\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/ujjqi8g2_download%20%281%29.png',
          intensityReason: 'Simple seated chain builds quads with gentle guidance.',
          moodTips: [
            {
              icon: 'body',
              title: 'Knees align with machine axis',
              description: 'Knees align with machine axis'
            },
            {
              icon: 'contract',
              title: 'Full squeeze top; slow lower control',
              description: 'Full squeeze top; slow lower control'
            }
          ]
        },
        {
          name: 'Hack Ease',
          duration: '8–10 min',
          description: 'Light hack squats, knee extensions, gentle calf raises.',
          battlePlan: 'Hack Squat (machine)\n• 3 × 8–10 (RPE 4), 60s rest\nLeg Extension (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nStanding Calf Raise (machine)\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/sb8mhy0d_hs.avif',
          intensityReason: 'Supported hack squat targets quads with easy bracing.',
          moodTips: [
            {
              icon: 'body',
              title: 'Back flat; feet shoulder-width',
              description: 'Back flat; feet shoulder-width'
            },
            {
              icon: 'expand',
              title: 'Small depth you own; quiet knees',
              description: 'Small depth you own; quiet knees'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Sled Flow',
          duration: '10–12 min',
          description: 'Leg press sets, extensions next, calves polish the finish.',
          battlePlan: 'Leg Press (machine)\n• 4 × 10 (RPE 5), 60–75s rest\nLeg Extension (machine)\n• 3 × 10–12 (RPE 5), 60s rest\nSeated Calf Raise (machine)\n• 3 × 12–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/p3j5vmje_download.png',
          intensityReason: 'Moderate sled volume with clean knee extension focus.',
          moodTips: [
            {
              icon: 'body',
              title: 'Mid-stance; track knees over toes',
              description: 'Mid-stance; track knees over toes'
            },
            {
              icon: 'time',
              title: 'Own the bottom; 2–1–3 tempo',
              description: 'Own the bottom; 2–1–3 tempo'
            }
          ]
        },
        {
          name: 'Hack Line',
          duration: '10–12 min',
          description: 'Hack squats first, extensions second, calves to close.',
          battlePlan: 'Hack Squat (machine)\n• 4 × 8 (RPE 5–6), 75s rest\nLeg Extension (machine)\n• 3 × 10–12 (RPE 5), 60s rest\nCalf Press (on leg press)\n• 3 × 12–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/sb8mhy0d_hs.avif',
          intensityReason: 'Guided squat pattern builds quads without balance load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep heels planted; soft lockouts',
              description: 'Keep heels planted; soft lockouts'
            },
            {
              icon: 'time',
              title: 'Smooth descent; steady torso angle',
              description: 'Smooth descent; steady torso angle'
            }
          ]
        },
        {
          name: 'Smith Front',
          duration: '10–12 min',
          description: 'Smith front squats, extensions next, calves to finish.',
          battlePlan: 'Smith Front Squat\n• 4 × 8 (RPE 5–6), 75s rest\nLeg Extension (machine)\n• 3 × 10–12 (RPE 5), 60s rest\nStanding Calf Raise (machine)\n• 3 × 12–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/6q78aa0l_smfs.jpg',
          intensityReason: 'Smith guidance reduces setup and stabilizer demands.',
          moodTips: [
            {
              icon: 'body',
              title: 'Bar high chest; small stance',
              description: 'Bar high chest; small stance'
            },
            {
              icon: 'expand',
              title: 'Knees track; ribs stacked and tall',
              description: 'Knees track; ribs stacked and tall'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Press Drop',
          duration: '12–14 min',
          description: 'Heavy press drops, precise extensions, high-rep calves.',
          battlePlan: 'Leg Press (machine)\n• 1 × 8 heavy (RPE 7) → drop 15% → 1 × 8 (RPE 6) → drop 15% → 1 × 8 (RPE 6)\n• Rest 90s; repeat for 3 total series\nLeg Extension (machine)\n• 3 × 10–12 (RPE 6), 60–75s rest\nSeated Calf Raise (machine)\n• 3 × 15–20 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/p3j5vmje_download.png',
          intensityReason: 'Drop set increases volume without complex technique.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Quick pin drops ~15%',
              description: 'Quick pin drops ~15%'
            },
            {
              icon: 'remove-circle',
              title: 'No bouncing; control bottom',
              description: 'No bouncing; control bottom'
            }
          ]
        },
        {
          name: 'Hack Cluster',
          duration: '12–14 min',
          description: 'Hack squat clusters, extensions next, standing calves.',
          battlePlan: 'Hack Squat (machine)\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nLeg Extension (machine)\n• 3 × 10–12 (RPE 6), 60–75s rest\nStanding Calf Raise (machine)\n• 3 × 12–15 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/sb8mhy0d_hs.avif',
          intensityReason: 'Clusters sustain output while preserving clean rep quality.',
          moodTips: [
            {
              icon: 'leaf',
              title: '15s breaths in clusters',
              description: '15s breaths in clusters'
            },
            {
              icon: 'barbell',
              title: 'Same load within clusters',
              description: 'Same load within clusters'
            }
          ]
        },
        {
          name: 'Smith Split',
          duration: '12–14 min',
          description: 'Smith split squats, machine extensions, calves to close.',
          battlePlan: 'Smith Split Squat\n• 3 × 8–10/side (RPE 6), 60–75s rest\nLeg Extension (machine)\n• 3 × 10–12 (RPE 6), 60–75s rest\nCalf Press (on leg press)\n• 3 × 12–15 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/a1srgmco_download%20%282%29.png',
          intensityReason: 'Supported split squats bias quads with low balance load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Short stance; heel down',
              description: 'Short stance; heel down'
            },
            {
              icon: 'expand',
              title: 'Soft knee touch; tall torso',
              description: 'Soft knee touch; tall torso'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Pull',
    icon: 'arrow-down',
    workouts: {
      beginner: [
        {
          name: 'Hinge Starter',
          duration: '8–10 min',
          description: 'Seated curls, RDL machine or Smith, glute machine finish.',
          battlePlan: 'Seated Leg Curl (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nSmith RDL or Plate-Loaded RDL Machine\n• 3 × 8–10 (RPE 4), 60s rest\nGlute Drive / Hip Thrust Machine\n• 3 × 10–12 (RPE 4), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/k4j5yazw_download%20%285%29.png',
          intensityReason: 'Simple hip hinge machines train hams and glutes safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep hips square; soft ribs',
              description: 'Keep hips square; soft ribs'
            },
            {
              icon: 'time',
              title: 'Long hamstring stretch; calm pace',
              description: 'Long hamstring stretch; calm pace'
            }
          ]
        },
        {
          name: 'Curl Line',
          duration: '8–10 min',
          description: 'Seated curls, hip thrusts next, ham-biased calf finish.',
          battlePlan: 'Seated Leg Curl (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nHip Thrust Machine\n• 3 × 10–12 (RPE 4), 60s rest\nSeated Calf Raise (toes in slightly)\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/cj4dx97r_download%20%283%29.png',
          intensityReason: 'Knee flexion focus with easy glute and calf support.',
          moodTips: [
            {
              icon: 'body',
              title: 'Ankles dorsiflexed on curl',
              description: 'Ankles dorsiflexed on curl'
            },
            {
              icon: 'arrow-down',
              title: 'Drive through heels on thrusts',
              description: 'Drive through heels on thrusts'
            }
          ]
        },
        {
          name: 'Back Line',
          duration: '8–10 min',
          description: '45° back extension machine, curls, cable pull-throughs.',
          battlePlan: '45° Back Extension (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nCable Pull-Through\n• 3 × 10–12 (RPE 4), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/149z42kp_download%20%2819%29.png',
          intensityReason: 'Supported hinge and curls reduce setup complexity.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hinge from hips; neutral neck',
              description: 'Hinge from hips; neutral neck'
            },
            {
              icon: 'contract',
              title: 'Squeeze glutes at top briefly',
              description: 'Squeeze glutes at top briefly'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Curl Stack',
          duration: '10–12 min',
          description: 'Seated curls, lying curls, hip thrusts for glute support.',
          battlePlan: 'Seated Leg Curl (machine)\n• 4 × 8–10 (RPE 5), 60–75s rest\nLying Leg Curl (machine)\n• 3 × 10 (RPE 5), 60s rest\nHip Thrust Machine\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/149z42kp_download%20%2819%29.png',
          intensityReason: 'Seated and lying curls load hams through full range.',
          moodTips: [
            {
              icon: 'body',
              title: 'Pad aligned with knee axis',
              description: 'Pad aligned with knee axis'
            },
            {
              icon: 'time',
              title: 'Control 3s lower on curls',
              description: 'Control 3s lower on curls'
            }
          ]
        },
        {
          name: 'Smith Hinge',
          duration: '10–12 min',
          description: 'Smith RDLs, seated curls, back extension machine.',
          battlePlan: 'Smith RDL\n• 4 × 8 (RPE 5–6), 75s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 5), 60s rest\nBack Extension (machine)\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/k4j5yazw_download%20%285%29.png',
          intensityReason: 'Guided RDL reduces balance needs while loading safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Bar tracks thighs; soft knees',
              description: 'Bar tracks thighs; soft knees'
            },
            {
              icon: 'expand',
              title: 'Long hamstring line; neutral back',
              description: 'Long hamstring line; neutral back'
            }
          ]
        },
        {
          name: 'Cable Hip',
          duration: '10–12 min',
          description: 'Pull-throughs first, curls next, hip abduction finisher.',
          battlePlan: 'Cable Pull-Through\n• 4 × 10 (RPE 5), 60–75s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 5), 60s rest\nHip Abduction (machine)\n• 3 × 12–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/aggvazg1_download%20%284%29.png',
          intensityReason: 'Cables guide hinge arcs with modest setup demands.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hips back; shins quiet',
              description: 'Hips back; shins quiet'
            },
            {
              icon: 'expand',
              title: 'Abduction: small range, steady pace',
              description: 'Abduction: small range, steady pace'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Curl Drop',
          duration: '12–14 min',
          description: 'Heavy seated curl drops, RDLs after, thrust finish.',
          battlePlan: 'Seated Leg Curl (machine)\n• 1 × 8 heavy (RPE 7) → drop 15% → 1 × 8 (RPE 6) → drop 15% → 1 × 8 (RPE 6)\n• Rest 90s; repeat for 3 total series\nSmith RDL\n• 3 × 8–10 (RPE 6), 60–75s rest\nHip Thrust Machine\n• 3 × 10–12 (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/cj4dx97r_download%20%283%29.png',
          intensityReason: 'Drop sets extend ham tension without complex skills.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Quick pin drops ~15%',
              description: 'Quick pin drops ~15%'
            },
            {
              icon: 'body',
              title: 'No hip hike; stay squared',
              description: 'No hip hike; stay squared'
            }
          ]
        },
        {
          name: 'Cluster Hinge',
          duration: '12–14 min',
          description: 'RDL clusters, lying curls next, abduction finisher.',
          battlePlan: 'Smith RDL\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nLying Leg Curl (machine)\n• 3 × 10–12 (RPE 6), 60–75s rest\nHip Abduction (machine)\n• 3 × 12–15 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/k4j5yazw_download%20%285%29.png',
          intensityReason: 'Hinge clusters keep power while preserving spine control.',
          moodTips: [
            {
              icon: 'leaf',
              title: '15s breaths in clusters',
              description: '15s breaths in clusters'
            },
            {
              icon: 'body',
              title: 'Shins vertical; hinge pure',
              description: 'Shins vertical; hinge pure'
            }
          ]
        },
        {
          name: 'Midrange Hinge',
          duration: '12–14 min',
          description: 'Seated curl 1.5s, pull-throughs next, back extensions.',
          battlePlan: 'Seated Leg Curl (1.5 reps)\n• 3 × 8–10 (RPE 6), 60–75s rest\nCable Pull-Through\n• 3 × 10–12 (RPE 6), 60–75s rest\nBack Extension (machine)\n• 3 × 10–12 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/aggvazg1_download%20%284%29.png',
          intensityReason: '1.5 curls add time under tension in safe positions.',
          moodTips: [
            {
              icon: 'time',
              title: '1s squeeze; 3s return',
              description: '1s squeeze; 3s return'
            },
            {
              icon: 'body',
              title: 'Hips back; torso steady',
              description: 'Hips back; torso steady'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Full Lower Body',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Simple Lines',
          duration: '8–10 min',
          description: 'Leg press, seated curl, extensions, seated calves finish.',
          battlePlan: 'Leg Press (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nLeg Extension (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nSeated Calf Raise (machine)\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/l69s6mlz_download.png',
          intensityReason: 'Balanced machines target legs with minimal coaching.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Note seat settings for repeat',
              description: 'Note seat settings for repeat'
            },
            {
              icon: 'time',
              title: 'Smooth 2–1–3 tempo throughout',
              description: 'Smooth 2–1–3 tempo throughout'
            }
          ]
        },
        {
          name: 'Guided Flow',
          duration: '8–10 min',
          description: 'Hack squat, hip thrust, leg curl, standing calves lineup.',
          battlePlan: 'Hack Squat (machine)\n• 3 × 8–10 (RPE 4), 60s rest\nHip Thrust Machine\n• 3 × 10–12 (RPE 4), 60s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nStanding Calf Raise (machine)\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/rchrkjlm_hs.avif',
          intensityReason: 'Guided paths reduce setup and stabilize each lift.',
          moodTips: [
            {
              icon: 'expand',
              title: 'Own range you can control',
              description: 'Own range you can control'
            },
            {
              icon: 'leaf',
              title: 'Breathe steady; no tempo rush',
              description: 'Breathe steady; no tempo rush'
            }
          ]
        },
        {
          name: 'Cable Mix',
          duration: '8–10 min',
          description: 'Pull-throughs, cable squats, curls, abduction closer.',
          battlePlan: 'Cable Pull-Through\n• 3 × 10–12 (RPE 4), 60s rest\nCable Goblet Squat (low cable)\n• 3 × 10–12 (RPE 4), 60s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 4), 60s rest\nHip Abduction (machine)\n• 3 × 12–15 (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/9k0i6seo_download%20%284%29.png',
          intensityReason: 'Cable arcs guide hips and knees with modest effort.',
          moodTips: [
            {
              icon: 'body',
              title: 'Brace light; ribs stacked',
              description: 'Brace light; ribs stacked'
            },
            {
              icon: 'expand',
              title: 'Small ranges are okay',
              description: 'Small ranges are okay'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Balanced Load',
          duration: '10–12 min',
          description: 'Leg press, curls, extensions, calf press; steady flow.',
          battlePlan: 'Leg Press (machine)\n• 4 × 10 (RPE 5), 60–75s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 5), 60s rest\nLeg Extension (machine)\n• 3 × 10–12 (RPE 5), 60s rest\nCalf Press (on leg press)\n• 3 × 12–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/l69s6mlz_download.png',
          intensityReason: 'Moderate volume across quads, hams, glutes, calves.',
          moodTips: [
            {
              icon: 'body',
              title: 'Track knee alignment',
              description: 'Track knee alignment'
            },
            {
              icon: 'time',
              title: 'Control all eccentrics',
              description: 'Control all eccentrics'
            }
          ]
        },
        {
          name: 'Vertical Guide',
          duration: '10–12 min',
          description: 'Hack squats, hip thrusts, curls, standing calves finish.',
          battlePlan: 'Hack Squat (machine)\n• 4 × 8 (RPE 5–6), 75s rest\nHip Thrust Machine\n• 3 × 10–12 (RPE 5), 60s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 5), 60s rest\nStanding Calf Raise (machine)\n• 3 × 12–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/nsyfdaao_download%20%283%29.png',
          intensityReason: 'Guided squat and hinge pair simplifies workload.',
          moodTips: [
            {
              icon: 'body',
              title: 'Heels down; quiet knees',
              description: 'Heels down; quiet knees'
            },
            {
              icon: 'contract',
              title: 'Squeeze glutes at top',
              description: 'Squeeze glutes at top'
            }
          ]
        },
        {
          name: 'Smith Lines',
          duration: '10–12 min',
          description: 'Smith squats, RDLs, curls, hip abduction machine close.',
          battlePlan: 'Smith Back Squat\n• 4 × 8 (RPE 5–6), 75s rest\nSmith RDL\n• 3 × 8–10 (RPE 5), 60–75s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 5), 60s rest\nHip Abduction (machine)\n• 3 × 12–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/lzw2ud21_download.png',
          intensityReason: 'Smith guidance reduces balance demands and setup.',
          moodTips: [
            {
              icon: 'body',
              title: 'Bar track vertical; brace light',
              description: 'Bar track vertical; brace light'
            },
            {
              icon: 'expand',
              title: 'Hips back on RDL; shins still',
              description: 'Hips back on RDL; shins still'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Lines',
          duration: '12–14 min',
          description: 'Press drop, curl drop, extensions, calf volume finish.',
          battlePlan: 'Leg Press (machine)\n• 1 × 8 heavy (RPE 7) → drop 15% → 1 × 8 (RPE 6) → drop 15% → 1 × 8 (RPE 6)\n• Rest 90s; repeat for 3 total series\nSeated Leg Curl (machine)\n• 1 × 10 heavy (RPE 7) → drop 15% → 1 × 10 (RPE 6)\nLeg Extension (machine)\n• 3 × 10–12 (RPE 6), 60–75s rest\nSeated Calf Raise (machine)\n• 3 × 15–20 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/l69s6mlz_download.png',
          intensityReason: 'Drop sets add volume without technical complexity.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Efficient pin moves',
              description: 'Efficient pin moves'
            },
            {
              icon: 'time',
              title: 'Keep tempo consistent',
              description: 'Keep tempo consistent'
            }
          ]
        },
        {
          name: 'Cluster Lines',
          duration: '12–14 min',
          description: 'Hack clusters, RDL clusters, curls, abduction closer.',
          battlePlan: 'Hack Squat (machine)\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nSmith RDL\n• 3 clusters: 3 + 3 + 3 (15s between), 90s between clusters\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 6), 60–75s rest\nHip Abduction (machine)\n• 3 × 12–15 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/0tawdmfz_hs.avif',
          intensityReason: 'Clusters preserve form while keeping output high.',
          moodTips: [
            {
              icon: 'leaf',
              title: '15s rests inside clusters',
              description: '15s rests inside clusters'
            },
            {
              icon: 'barbell',
              title: 'Same load within cluster',
              description: 'Same load within cluster'
            }
          ]
        },
        {
          name: 'Cable Finish',
          duration: '12–14 min',
          description: 'Pull-throughs, cable goblets, curls, standing calves.',
          battlePlan: 'Cable Pull-Through\n• 4 × 10 (RPE 6), 60–75s rest\nCable Goblet Squat (low cable)\n• 4 × 8–10 (RPE 6), 60–75s rest\nSeated Leg Curl (machine)\n• 3 × 10–12 (RPE 6), 60s rest\nStanding Calf Raise (machine)\n• 3 × 12–15 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/3gaohp2y_cgs.jpg',
          intensityReason: 'Midrange cable work adds tension at modest loading.',
          moodTips: [
            {
              icon: 'body',
              title: 'Pull-through: hips back',
              description: 'Pull-through: hips back'
            },
            {
              icon: 'expand',
              title: 'Goblet: ribs down, tall',
              description: 'Goblet: ribs down, tall'
            }
          ]
        }
      ]
    }
  }
];

// Workout Card Component outside the main component for proper memoization
const WorkoutCard = React.memo(({ 
  equipment, 
  icon, 
  workouts, 
  difficulty,
  isInCart,
  createWorkoutId,
  handleAddToCart,
  handleStartWorkout,
}: { 
  equipment: string; 
  icon: keyof typeof Ionicons.glyphMap; 
  workouts: Workout[]; 
  difficulty: string;
  isInCart: (workoutId: string) => boolean;
  createWorkoutId: (workout: Workout, equipment: string, difficulty: string) => string;
  handleAddToCart: (workout: Workout, equipment: string) => void;
  handleStartWorkout: (workout: Workout, equipment: string) => void;
}) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [showIndicator, setShowIndicator] = useState(true);
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
        <Text style={styles.workoutDescription}>{item.description}</Text>

        {/* Start Workout Button */}
        <TouchableOpacity 
          style={styles.startWorkoutButton}
          onPress={() => handleStartWorkout(item, equipment)}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={20} color="#000000" style={{ marginRight: 8 }} />
          <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.workoutCard}>
      {/* Equipment Header */}
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentIconContainer}>
          <Ionicons name={icon} size={24} color="#FFD700" />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <View style={styles.addButtonWrapper}>
          <TouchableOpacity
          style={[
            styles.addToCartButton,
            isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty)) && 
            styles.addToCartButtonAdded
          ]}
          onPress={() => handleAddToCartWithAnimation(workouts[currentWorkoutIndex])}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.addToCartButtonContent, { transform: [{ scale: localScaleAnim }] }]}>
            {isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty)) ? (
              <Ionicons name="checkmark" size={16} color="#FFD700" />
            ) : (
              <>
                <Ionicons name="add" size={14} color="#FFFFFF" />
                <Text style={styles.addToCartButtonText}>Add workout</Text>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
          <AddWorkoutIndicator visible={showIndicator} />
        </View>
      </View>

      {/* Workout List - Native Swipe Enabled */}
      <View style={[styles.workoutList, { height: 355 }]}>
        <FlatList
          ref={flatListRef}
          data={workouts}
          renderItem={renderWorkout}
          horizontal
          pagingEnabled
          snapToInterval={width - 48}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            if (boundedIndex !== currentWorkoutIndex) {
              setCurrentWorkoutIndex(boundedIndex);
            }
          }}
          onMomentumScrollEnd={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            setCurrentWorkoutIndex(boundedIndex);
          }}
          onScrollEndDrag={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            setCurrentWorkoutIndex(boundedIndex);
          }}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: width - 48,
            offset: (width - 48) * index,
            index,
          })}
          keyExtractor={(item, index) => `${equipment}-${difficulty}-${index}`}
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
                index === currentWorkoutIndex && styles.activeDotTouchArea
              ]}
              onPress={() => {
                console.log(`Dot clicked: ${index}, Current: ${currentWorkoutIndex}`);
                setCurrentWorkoutIndex(index);
                // Use scrollToOffset for more reliable behavior
                const slideSize = width - 48;
                flatListRef.current?.scrollToOffset({
                  offset: index * slideSize,
                  animated: true
                });
              }}
              activeOpacity={0.7}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <View style={[
                styles.dot,
                index === currentWorkoutIndex && styles.activeDot,
              ]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
});

export default function LazyLowerBodyWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Parse URL parameters
  const rawMoodTitle = params.mood as string || "I'm feeling lazy";
  const moodTitle = rawMoodTitle;
  const workoutType = params.workoutType as string || 'Lift weights';
  const bodyPart = params.bodyPart as string || 'Lower body';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Get workout data
  const selectedEquipmentNames = ['Press', 'Pull', 'Full Lower Body'];
  const workoutDatabase = lowerBodyWorkoutDatabase;

  // Cart hooks
  const { addToCart, isInCart } = useCart();

  // Cart helper functions
  const createWorkoutId = useCallback((workout: Workout, equipment: string, difficulty: string) => {
    return `${workout.name}-${equipment}-${difficulty}`;
  }, []);

  const handleAddToCart = useCallback((workout: Workout, equipment: string) => {
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
      workoutType: `I'm feeling lazy - ${workoutType} - ${bodyPart}`,
      moodCard: moodTitle,
      moodTips: workout.moodTips || [],
    };

    // Add to cart
    addToCart(workoutItem);
  }, [addToCart, isInCart, createWorkoutId, difficulty, workoutType, bodyPart, moodTitle]);

  const handleStartWorkout = (workout: Workout, equipment: string) => {
    try {
      console.log('✅ Starting workout navigation with params:', {
        workoutName: workout.name,
        equipment: equipment,
        description: workout.description,
        battlePlan: workout.battlePlan,
        duration: workout.duration,
        difficulty: difficulty,
        workoutType: workoutType,
      });
      
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
      { key: 'mood', icon: 'bed', text: moodTitle },
      { key: 'bodyPart', icon: 'barbell', text: workoutType },
      { key: 'difficulty', icon: 'walk', text: bodyPart },
      { key: 'equipment', icon: 'construct', text: difficulty === 'intermediate' ? 'Intermed.' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
    ];

    // Return single row
    return [steps];
  };

  const handleGoBack = () => {
    router.back();
  };

  const progressRows = createProgressRows();

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
        {progressRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.progressRow}>
            {row.map((step, stepIndex) => (
              <React.Fragment key={step.key}>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <Ionicons name={step.icon} size={12} color="#000000" />
                  </View>
                  <Text style={styles.progressStepText}>{step.text}</Text>
                </View>
                {stepIndex < row.length - 1 && <View style={styles.progressConnector} />}
              </React.Fragment>
            ))}
          </View>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Generate workout cards for selected equipment */}
        {workoutDatabase.map((equipmentData) => {
          const workoutsForDifficulty = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
          
          if (workoutsForDifficulty.length === 0) {
            return null;
          }

          return (
            <WorkoutCard
              key={equipmentData.equipment}
              equipment={equipmentData.equipment}
              icon={equipmentData.icon}
              workouts={workoutsForDifficulty}
              difficulty={difficulty}
              isInCart={isInCart}
              createWorkoutId={createWorkoutId}
              handleAddToCart={handleAddToCart}
              handleStartWorkout={handleStartWorkout}
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
    paddingVertical: 8,
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
    paddingHorizontal: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 60,
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
    marginBottom: 6,
  },
  progressStepText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 60,
    lineHeight: 11,
  },
  progressConnector: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
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
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  workoutList: {
    height: 380,
    marginBottom: 16,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  workoutImageContainer: {
    marginTop: 1,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#222222',
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
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  swipeText: {
    fontSize: 11,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '500',
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
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  workoutDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  difficultyBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
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
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
    flex: 1,
  },
  workoutDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: 10,
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
    gap: 8,
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
    paddingVertical: 13,
    marginTop: -6,
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
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
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
