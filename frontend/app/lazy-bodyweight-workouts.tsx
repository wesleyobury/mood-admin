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

// Lazy bodyweight workout database with all equipment workouts
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Treadmill',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Easy Walk Intervals',
          duration: '8–10 min',
          description: 'Easy base with brief brisk pops; smooth steps and breaths.',
          battlePlan: '3 rounds\n• 2 min Easy Walk (RPE 3)\n• 1 min Brisk Walk (RPE 4)\nNo extra rest; repeat sequence continuously',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/0jyalb2d_download%20%2826%29.png',
          intensityReason: 'Gentle surges raise HR without impact or joint strain.',
          moodTips: [
            {
              icon: 'body',
              title: 'Light form',
              description: 'Shoulders down; light arms; short strides, quick feet'
            },
            {
              icon: 'leaf',
              title: 'Calm breathing',
              description: 'RPE 3 easy; RPE 4 brisk; breathe nose–mouth calmly'
            }
          ]
        },
        {
          name: 'Incline Cruise',
          duration: '8–10 min',
          description: 'Steady incline walk; relaxed shoulders; even cadence.',
          battlePlan: '1 set\n• 8–10 min Walk @ 3–5% incline (RPE 3–4)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/lcrp3pfp_download%20%2827%29.png',
          intensityReason: 'Mild grade adds work quietly with stable mechanics.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Proper incline',
              description: 'Set 3–5% incline; stay tall; no rail leaning'
            },
            {
              icon: 'footsteps',
              title: 'Quiet steps',
              description: 'Shorten stride slightly; keep steps quiet and even'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Brisk Walk Pops',
          duration: '10–12 min',
          description: 'Easy base with 30s surges; smooth recoveries between.',
          battlePlan: '4 rounds\n• 2 min Easy (RPE 3)\n• 30s Brisk (RPE 5)\n• 30s Easy (RPE 3) to reset, then repeat',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/0jyalb2d_download%20%2826%29.png',
          intensityReason: 'Short brisk segments raise cadence and HR safely.',
          moodTips: [
            {
              icon: 'eye',
              title: 'Form focus',
              description: 'Eyes forward; hands relaxed; quick foot turnover'
            },
            {
              icon: 'volume-low',
              title: 'Quiet contacts',
              description: 'Surges RPE 5; recover RPE 3; keep belt contacts quiet'
            }
          ]
        },
        {
          name: 'Incline Switch-Ups',
          duration: '10–12 min',
          description: 'Change incline each minute; maintain easy comfortable pace.',
          battlePlan: '10–12 min continuous\n• Alternate each minute: 2% → 5% → 3% → 6% … (RPE 4–5)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/lcrp3pfp_download%20%2827%29.png',
          intensityReason: 'Alternating grades keep interest without impact load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stay tall',
              description: 'Keep torso tall; reduce stride length uphill'
            },
            {
              icon: 'hand-right',
              title: 'No rails',
              description: 'Keep breathing calm; avoid holding rails'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Walk–Jog Sprinkle',
          duration: '12–14 min',
          description: 'Easy walk base with tiny jog sprinkles and soft landings.',
          battlePlan: '4 rounds\n• 2 min Easy Walk (RPE 3)\n• 30–45s Easy Jog (RPE 5–6)\nRepeat back-to-back; no extra rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/0jyalb2d_download%20%2826%29.png',
          intensityReason: 'Short jogs elevate HR while total fatigue stays low.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Soft landings',
              description: 'Land softly; quiet steps; jog at conversational pace'
            },
            {
              icon: 'refresh',
              title: 'Stay flexible',
              description: 'If needed: longer walk, shorter jog; stay relaxed'
            }
          ]
        },
        {
          name: 'Hill Breeze',
          duration: '12–14 min',
          description: 'One-minute hill efforts with flat recoveries; breathe calm.',
          battlePlan: '6 cycles continuous\n• 1 min @ 5–6% (RPE 5)\n• 1 min flat (RPE 3–4)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/lcrp3pfp_download%20%2827%29.png',
          intensityReason: 'Short hill rises engage legs gently without heavy load.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Uphill technique',
              description: 'Uphill: shorten stride; keep cadence steady'
            },
            {
              icon: 'leaf',
              title: 'Relax and breathe',
              description: 'Exhale on hill; relax jaw; shake arms loose on flats'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Stationary bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Cruise Spin',
          duration: '8–10 min',
          description: 'Light resistance 80–90 rpm; shoulders relaxed and tall.',
          battlePlan: '1 set\n• 8–10 min Easy Spin (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/8k8d6fo4_download%20%2824%29.png',
          intensityReason: 'Easy spin boosts circulation with very low muscular load.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Soft hands',
              description: 'Soft hands; even pedal circles; sit tall'
            },
            {
              icon: 'leaf',
              title: 'Easy breathing',
              description: 'Keep RPE ~3; breathe steadily and smoothly'
            }
          ]
        },
        {
          name: 'Cadence Teasers',
          duration: '8–10 min',
          description: 'Easy spin punctuated by quick fast-leg bursts; reset easy.',
          battlePlan: '3 rounds\n• 2 min Easy (RPE 3)\n• 20s Fast Legs / 40s Easy (repeat 1× = 1 block)\nComplete both intervals back-to-back to finish each round',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/jx5sn8pf_download%20%2825%29.png',
          intensityReason: 'Short fast legs nudge HR without accumulating fatigue.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Light resistance',
              description: 'Keep resistance light; avoid bouncing'
            },
            {
              icon: 'refresh',
              title: 'Fast legs',
              description: 'Fast legs ~95–105 rpm; relax shoulders'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Gear Nudge',
          duration: '10–12 min',
          description: 'Alternate light and moderate minutes at steady cadence.',
          battlePlan: '10–12 min continuous\n• 1 min Light (RPE 3)\n• 1 min Moderate (RPE 5)\nRepeat sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/8k8d6fo4_download%20%2824%29.png',
          intensityReason: 'Slight resistance bumps engage muscles yet stay comfy.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Keep RPM up',
              description: 'Keep ≥80 rpm on moderate minute'
            },
            {
              icon: 'leaf',
              title: 'Rhythmic breath',
              description: 'Relax hands; keep breath rhythmic'
            }
          ]
        },
        {
          name: 'Mini Surges',
          duration: '10–12 min',
          description: 'Thirty-second surge, ninety seconds easy; smooth cycles.',
          battlePlan: '6 cycles continuous\n• 30s Surge (RPE 6)\n• 90s Easy (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/jx5sn8pf_download%20%2825%29.png',
          intensityReason: 'Short controlled pushes lift HR then settle cleanly.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Stay seated',
              description: 'Stay seated; no grinding; adjust gear to feel'
            },
            {
              icon: 'leaf',
              title: 'Belly breathing',
              description: 'Inhale belly; long exhale during surges'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Pyramid Spin',
          duration: '12–14 min',
          description: '1–2–3–2–1 @ RPE 5 with 1-min easy recoveries between.',
          battlePlan: '1 set\n• 2 min Easy\n• 1 min @ RPE 5 → 1 min Easy\n• 2 min @ RPE 5 → 1 min Easy\n• 3 min @ RPE 5 → 1 min Easy\n• 2 min @ RPE 5 → 1 min Easy\n• 1 min @ RPE 5 → 2 min Easy finish',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/8k8d6fo4_download%20%2824%29.png',
          intensityReason: 'Build and drop ladder sustains focus without strain.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Moderate pace',
              description: 'Moderate means RPE 5 steady, not all-out'
            },
            {
              icon: 'refresh',
              title: 'Reset between',
              description: 'Use 1-min easy resets between each moderate set'
            }
          ]
        },
        {
          name: 'Stand Sprinkles',
          duration: '12–14 min',
          description: 'Seated easy with short stands; return to seat smoothly.',
          battlePlan: '5 rounds\n• 2 min Easy (RPE 3)\n• 15–20s Standing (RPE 6)\nRepeat; no extra rest between rounds',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/jx5sn8pf_download%20%2825%29.png',
          intensityReason: 'Brief standing bouts add variety with mild leg load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Core engaged',
              description: 'Core tight; light hands; steady rpm standing'
            },
            {
              icon: 'settings',
              title: 'Smooth transitions',
              description: 'Sit softly; avoid over-gearing during stands'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Elliptical',
    icon: 'infinite',
    workouts: {
      beginner: [
        {
          name: 'Glide Easy',
          duration: '8–10 min',
          description: 'Light resistance; smooth strides; relaxed upright posture.',
          battlePlan: '1 set\n• 8–10 min Easy Glide (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/1b8gmmf3_download%20%2811%29.png',
          intensityReason: 'Low-impact glide increases flow with minimal stress.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Light touch',
              description: 'Heels light; gentle arm drive'
            },
            {
              icon: 'leaf',
              title: 'Steady breathing',
              description: 'RPE ~3; breathe slow and even'
            }
          ]
        },
        {
          name: 'Stride Pops',
          duration: '8–10 min',
          description: '20s quicker strides with 40s easy glides; repeat calm.',
          battlePlan: '3 rounds\n• 2 min Easy\n• 3 × (20s Quick, 40s Easy) done back-to-back\nRecovery is the 40s Easy within each trio',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/c5a1o86a_download%20%2812%29.png',
          intensityReason: 'Short tempo lifts add spark while effort stays easy.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Light resistance',
              description: 'Keep resistance light; avoid stomping'
            },
            {
              icon: 'eye',
              title: 'Stay relaxed',
              description: 'Eyes forward; shoulders relaxed'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Ramp Waves',
          duration: '10–12 min',
          description: 'Alternate low and high ramp minutes; steady cadence.',
          battlePlan: '10–12 min continuous\n• 1 min Low Ramp (RPE 3–4)\n• 1 min High Ramp (RPE 5)\nRepeat sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/1b8gmmf3_download%20%2811%29.png',
          intensityReason: 'Mild ramp changes add novelty without taxing joints.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Adapt stride',
              description: 'Shorten stride as ramp rises'
            },
            {
              icon: 'leaf',
              title: 'Calm breathing',
              description: 'Keep breathing calm and rhythmic'
            }
          ]
        },
        {
          name: 'Push–Pull Focus',
          duration: '10–12 min',
          description: '30s arm focus paired with 60s easy stride; smooth flow.',
          battlePlan: '6 cycles continuous\n• 30s Arm Focus (RPE 5)\n• 60s Easy (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/c5a1o86a_download%20%2812%29.png',
          intensityReason: 'Upper-body emphasis spreads load while staying light.',
          moodTips: [
            {
              icon: 'body',
              title: 'Core engaged',
              description: 'Core braced; elbows soft; no overgrip'
            },
            {
              icon: 'refresh',
              title: 'Keep flowing',
              description: 'Keep legs flowing during arm-focus burst'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tempo Sprinkle',
          duration: '12–14 min',
          description: 'Two minutes easy then one-minute tempo; repeat smooth.',
          battlePlan: '5 cycles continuous\n• 2 min Easy (RPE 3)\n• 1 min Tempo (RPE 6)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/1b8gmmf3_download%20%2811%29.png',
          intensityReason: 'Short tempo bouts lift HR gently without impact.',
          moodTips: [
            {
              icon: 'body',
              title: 'Good form',
              description: "Posture tall; feet quiet; don't overstride"
            },
            {
              icon: 'refresh',
              title: 'Easy return',
              description: 'Tempo RPE 6; return to easy at RPE 3'
            }
          ]
        },
        {
          name: 'Ramp Pyramid',
          duration: '12–14 min',
          description: 'Climb every two minutes; descend smoothly to finish.',
          battlePlan: '1 set\n• 2 min Easy\n• 2 min Ramp 3 → 2 min Ramp 6 → 2 min Ramp 9\n• 2 min Ramp 6 → 2 min Ramp 3\n• 2 min Easy',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/c5a1o86a_download%20%2812%29.png',
          intensityReason: 'Gradual ramp build challenges, then eases smoothly.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Adapt stride',
              description: 'Shorten stride as elevation increases'
            },
            {
              icon: 'speedometer',
              title: 'Steady cadence',
              description: 'Keep cadence constant; adjust resistance modestly'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Stair stepper',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Easy Steps',
          duration: '8–10 min',
          description: 'Low level, smooth steps, light hands, steady breathing.',
          battlePlan: '1 set\n• 8–10 min Level 1–3 (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/891czvrs_download%20%2822%29.png',
          intensityReason: 'Gentle stepping raises HR with clean, safe mechanics.',
          moodTips: [
            {
              icon: 'body',
              title: 'Good posture',
              description: 'Stand tall; avoid leaning on rails'
            },
            {
              icon: 'footsteps',
              title: 'Quiet steps',
              description: 'Short steps; quiet landings; RPE ~3'
            }
          ]
        },
        {
          name: 'Step and Pause',
          duration: '8–10 min',
          description: 'Two minutes steady work with 30s very easy reset bouts.',
          battlePlan: '3 rounds\n• 2 min Steady (RPE 4)\n• 30s Very Easy (RPE 2–3)\nRepeat continuous; no extra rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/4vr4kipb_download%20%2823%29.png',
          intensityReason: 'Cadence dips ensure control while preventing fatigue.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Even cadence',
              description: 'Keep cadence even; soft knees; breathe calmly'
            },
            {
              icon: 'refresh',
              title: 'Reset breaks',
              description: 'Use 30s slow steps to relax breath and posture'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Alternating Cadence',
          duration: '10–12 min',
          description: 'One minute brisk stepping, one minute easy; repeat flow.',
          battlePlan: '10–12 min continuous\n• 1 min Brisk (RPE 5)\n• 1 min Easy (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/891czvrs_download%20%2822%29.png',
          intensityReason: 'Cadence shifts add variety without heavy muscular load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Tall posture',
              description: "Keep posture tall; don't bottom out steps"
            },
            {
              icon: 'leaf',
              title: 'Even breathing',
              description: 'Brisk RPE 5; easy RPE 3; breathe evenly'
            }
          ]
        },
        {
          name: 'Two-Step Rhythm',
          duration: '10–12 min',
          description: 'Insert five double-steps at 30s mark each minute set.',
          battlePlan: '6 cycles\n• 1 min Normal Steps (RPE 4)\n• At 30s within each minute: perform 5 double-steps',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/4vr4kipb_download%20%2823%29.png',
          intensityReason: 'Occasional double-steps wake hips and balance safely.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Double-step',
              description: 'Double-step: skip a step; plant foot two steps higher'
            },
            {
              icon: 'hand-right',
              title: 'Use rails lightly',
              description: 'Smooth, controlled; use rails lightly if needed'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Side-Step Sprinkle',
          duration: '12–14 min',
          description: 'Mostly forward steps with 30s lateral work each minute.',
          battlePlan: '6 cycles\n• 90s Forward (RPE 4)\n• 30s Side-Steps L/R (RPE 5)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/891czvrs_download%20%2822%29.png',
          intensityReason: 'Light lateral steps add variety with modest intensity.',
          moodTips: [
            {
              icon: 'resize',
              title: 'Small side steps',
              description: 'Small side steps; hips level; rails for balance'
            },
            {
              icon: 'refresh',
              title: 'Smooth movement',
              description: 'Lateral RPE 5; forward RPE 4; move smoothly'
            }
          ]
        },
        {
          name: 'Mini Climb Waves',
          duration: '12–14 min',
          description: 'Two minutes level 3–4, one minute level 5–6; repeat flow.',
          battlePlan: '4 rounds\n• 2 min Level 3–4 (RPE 4)\n• 1 min Level 5–6 (RPE 6)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/4vr4kipb_download%20%2823%29.png',
          intensityReason: 'Slight level waves lift HR then settle it smoothly again.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stay tall',
              description: 'Stay tall; even steps; soft landings'
            },
            {
              icon: 'leaf',
              title: 'Exhale effort',
              description: 'Exhale on effort minute; relax shoulders'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Rowing machine',
    icon: 'boat',
    workouts: {
      beginner: [
        {
          name: 'Easy Row Flow',
          duration: '8–10 min',
          description: 'Smooth 18–20 spm, gentle pressure, relaxed breathing.',
          battlePlan: '1 set\n• 8–10 min @ 18–20 spm, RPE 3',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/6b87wtzw_download%20%2820%29.png',
          intensityReason: 'Light strokes increase flow with minimal joint loading.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Proper sequence',
              description: 'Sequence: legs → body → arms; reverse on return'
            },
            {
              icon: 'hand-right',
              title: 'Light grip',
              description: 'Light grip; shoulders down; long exhales'
            }
          ]
        },
        {
          name: 'Pick Drill Lite',
          duration: '8–10 min',
          description: 'Arms-only, arms+body, then full strokes; crisp sequence.',
          battlePlan: '1 set\n• 2 min Arms-only (RPE 2–3)\n• 3 min Arms+Body (RPE 3)\n• 3–5 min Full Stroke (RPE 3–4)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/zxa3naw1_download%20%2821%29.png',
          intensityReason: 'Technique segments build rhythm at very easy effort.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Arms-only',
              description: 'Arms-only: pull in/out with arms only'
            },
            {
              icon: 'body',
              title: 'Add body',
              description: 'Arms+Body: add torso swing; legs quiet'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Rate Pops',
          duration: '10–12 min',
          description: 'One minute 18 spm, 30s 24 spm; smooth easy pressure.',
          battlePlan: '6 cycles continuous\n• 1 min @ 18 spm (RPE 3–4)\n• 30s @ 24 spm (RPE 5)\n• 30s @ 18 spm reset',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/6b87wtzw_download%20%2820%29.png',
          intensityReason: 'Short rate lifts nudge HR while technique stays clean.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Focus rhythm',
              description: 'Keep split modest; focus rhythm and length'
            },
            {
              icon: 'hand-right',
              title: 'Smooth recovery',
              description: 'Relax grip; smooth slide recovery'
            }
          ]
        },
        {
          name: 'Technique Tempo',
          duration: '10–12 min',
          description: 'Two minutes easy, one-minute tempo; controlled repeats.',
          battlePlan: '4 rounds\n• 2 min Easy (RPE 3)\n• 1 min Tempo (RPE 5)\nNo extra rest; continuous flow',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/zxa3naw1_download%20%2821%29.png',
          intensityReason: 'Slight tempo raises HR while mechanics remain crisp.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Clean sequence',
              description: 'Legs push, body swing, arms finish'
            },
            {
              icon: 'speedometer',
              title: 'Light pressure',
              description: 'Light pressure; consistent sequence'
            }
          ]
        }
      ],
      advanced: [
        {
          name: '500m Sprinkle',
          duration: '12–14 min',
          description: 'Easy row blocks surrounding one controlled 500m piece.',
          battlePlan: '1 set\n• 4 min Easy (RPE 3)\n• 500m Steady (RPE 6)\n• 4–6 min Easy (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/6b87wtzw_download%20%2820%29.png',
          intensityReason: 'Short 500m adds spice while total load remains easy.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Keep form crisp',
              description: "Keep form crisp under sprinkle; don't chase PR"
            },
            {
              icon: 'leaf',
              title: 'Recover easy',
              description: 'Recover easy after; breathe long and slow'
            }
          ]
        },
        {
          name: 'Ladder Rate',
          duration: '12–14 min',
          description: '2 min each at 18, 20, 22 spm, then descend back down.',
          battlePlan: '1 set\n• 2 min @ 18 spm → 2 @ 20 → 2 @ 22\n• 2 @ 20 → 2 @ 18\nAll at RPE 4–5 max',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/zxa3naw1_download%20%2821%29.png',
          intensityReason: 'Rate ladder entertains without adding heavy intensity.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Rate only',
              description: 'Pressure stays easy; change rate only'
            },
            {
              icon: 'body',
              title: 'Good posture',
              description: 'Sit tall; long finish; smooth slide'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'SkiErg',
    icon: 'snow',
    workouts: {
      beginner: [
        {
          name: 'Easy Glide Pulls',
          duration: '8–10 min',
          description: 'Smooth hinge and arm drive; stable cadence; calm breath.',
          battlePlan: '1 set\n• 8–10 min Easy (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/1zo355rz_skiierg.jpg',
          intensityReason: 'Gentle pulls engage lats/core with low joint loading.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hinge pattern',
              description: 'Hips then arms; stand tall on return'
            },
            {
              icon: 'hand-right',
              title: 'Light grip',
              description: 'Light grip; exhale on each pull'
            }
          ]
        },
        {
          name: 'Pull Pops',
          duration: '8–10 min',
          description: '15s quicker pulls with 45s easy glides; repeat smooth.',
          battlePlan: '3 rounds\n• 2 min Easy\n• 3 × (15s Quick, 45s Easy) back-to-back\nThe 45s Easy is the rest; no extra pause',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/7ynxfrel_ski1.jpg',
          intensityReason: 'Short pick-ups wake rhythm while keeping effort light.',
          moodTips: [
            {
              icon: 'body',
              title: 'No yanking',
              description: 'Keep shoulders down; hinge small; no yank'
            },
            {
              icon: 'refresh',
              title: 'Smooth recovery',
              description: 'Smooth acceleration; relaxed recovery'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Rate Waves',
          duration: '10–12 min',
          description: 'Alternate 1 min @ 20 spm and 1 min @ 24 spm; easy power.',
          battlePlan: '10–12 min continuous\n• 1 min @ 20 spm (RPE 3–4)\n• 1 min @ 24 spm (RPE 5)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/1zo355rz_skiierg.jpg',
          intensityReason: 'Small rate changes add interest without added strain.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Power modest',
              description: 'Keep power modest; focus timing and rhythm'
            },
            {
              icon: 'leaf',
              title: 'Long exhales',
              description: 'Long exhales on each effort minute'
            }
          ]
        },
        {
          name: 'Hinge Focus',
          duration: '10–12 min',
          description: '30s hinge-led pulls with 60s easy glide; repeat calm.',
          battlePlan: '6 cycles continuous\n• 30s Focus (RPE 5)\n• 60s Easy (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/7ynxfrel_ski1.jpg',
          intensityReason: 'Technique emphasis spreads work while staying easy.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hinge leads',
              description: 'Core braced; hips drive first; arms finish'
            },
            {
              icon: 'hand-right',
              title: 'Stay tall',
              description: 'Return tall; elbows in; maintain soft grip'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Short Effort Ladder',
          duration: '12–14 min',
          description: '20–30–40s pulls with equal easy; keep stroke smooth.',
          battlePlan: '3 cycles continuous\n• 20s Pull / 20s Easy\n• 30s Pull / 30s Easy\n• 40s Pull / 40s Easy',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/1zo355rz_skiierg.jpg',
          intensityReason: 'Small builds keep fun up without heavy fatigue buildup.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Clean stroke',
              description: 'Keep stroke clean; no rushing recovery'
            },
            {
              icon: 'leaf',
              title: 'Rhythmic breath',
              description: 'Breathe rhythmically throughout each effort'
            }
          ]
        },
        {
          name: 'Technique Tempo',
          duration: '12–14 min',
          description: '2 min easy then 1 min tempo pulls; repeat smoothly.',
          battlePlan: '5 cycles continuous\n• 2 min Easy (RPE 3)\n• 1 min Tempo (RPE 6)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/7ynxfrel_ski1.jpg',
          intensityReason: 'Slight tempo keeps interest while mechanics stay crisp.',
          moodTips: [
            {
              icon: 'body',
              title: 'Tall posture',
              description: 'Tall posture; hinge small; ribs stacked'
            },
            {
              icon: 'hand-right',
              title: 'Smooth return',
              description: 'Relax grip; elbows in; smooth return'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Jump rope',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Easy Singles',
          duration: '6–8 min',
          description: 'Simple singles; short contacts; relaxed quiet shoulders.',
          battlePlan: '3 rounds\n• 40s Jump / 20s Rest (RPE 3–4)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/hx5xzvml_download%20%2814%29.png',
          intensityReason: 'Light rhythm warms calves and lungs with minimal stress.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Wrist turns',
              description: 'Turn from wrists; elbows in; tiny jumps'
            },
            {
              icon: 'footsteps',
              title: 'Quiet feet',
              description: 'Quiet feet; steady breathing cadence'
            }
          ]
        },
        {
          name: 'Box Step Rope',
          duration: '6–8 min',
          description: 'Alternating steps under rope; easy beat; relaxed flow.',
          battlePlan: '3 rounds\n• 45s Step Rope / 15s Rest (RPE 3–4)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/vjbmjg1y_jr%20singles.webp',
          intensityReason: 'Step pattern lowers impact and keeps rhythm friendly.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stay tall',
              description: 'Stay tall; soft landings; eyes forward'
            },
            {
              icon: 'refresh',
              title: 'Even rope',
              description: 'Rope path low and even; breathe calm'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Tempo Singles',
          duration: '8–10 min',
          description: '50s steady singles and 10s rest; repeat calm rhythm.',
          battlePlan: '8–10 min\n• 50s Jump / 10s Rest (RPE 5)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/hx5xzvml_download%20%2814%29.png',
          intensityReason: 'Slight tempo raises HR while remaining comfortable.',
          moodTips: [
            {
              icon: 'eye',
              title: 'Eyes forward',
              description: 'Eyes forward; wrists relaxed; tiny jumps'
            },
            {
              icon: 'leaf',
              title: 'Conserve energy',
              description: 'Conserve energy; steady exhale rhythm'
            }
          ]
        },
        {
          name: 'Side-to-Side Steps',
          duration: '8–10 min',
          description: 'Small side shuffles under rope; smooth even rhythm.',
          battlePlan: '5 rounds\n• 40s Lateral Steps / 20s Rest (RPE 4–5)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/vjbmjg1y_jr%20singles.webp',
          intensityReason: 'Mild lateral steps add variety and light coordination.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Keep feet low',
              description: 'Keep feet low; quick taps; relax jaw'
            },
            {
              icon: 'leaf',
              title: 'Breathing cadence',
              description: 'Maintain breathing cadence; stay light'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Mixed Rhythm',
          duration: '10–12 min',
          description: '40s singles plus 20s fast singles; high cadence for appropriate challenge',
          battlePlan: '6 cycles\n• 40s Singles (RPE 4)\n• 20s Fast Singles (RPE 6)\n• 30s Easy Rest between cycles',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/7xdwafzn_download%20%2815%29.png',
          intensityReason: 'Short rhythm changes stimulate without heavy strain.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Stay relaxed',
              description: 'Stay relaxed; tiny jumps; quick wrists'
            },
            {
              icon: 'leaf',
              title: 'Quiet shoulders',
              description: 'Shoulders quiet; steady breath between bursts'
            }
          ]
        },
        {
          name: 'Sprinkle Doubles',
          duration: '10–12 min',
          description: 'Singles base with 5–10 double-unders sprinkled in calmly.',
          battlePlan: '5 rounds\n• 60s Singles; add 5–10 DU anywhere (RPE 5–6)\n• 30–45s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/nj4p5yh5_download%20%2816%29.png',
          intensityReason: 'Occasional doubles add challenge while volume stays low.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep doubles sparse',
              description: 'Keep doubles sparse; stay relaxed and tall'
            },
            {
              icon: 'refresh',
              title: 'Reset timing',
              description: 'Land soft; reset timing after doubles'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Plyo box',
    icon: 'cube',
    workouts: {
      beginner: [
        {
          name: 'Step-Ups Easy',
          duration: '8–10 min',
          description: 'Steady step-ups; alternate leads; smooth controlled pace.',
          battlePlan: '1 set\n• 8–10 min Continuous Step-Ups (RPE 3–4)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/43a622qp_download%20%2817%29.png',
          intensityReason: 'Low step work moves legs with minimal joint impact.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Whole foot',
              description: 'Whole foot on box; stand tall; control down'
            },
            {
              icon: 'refresh',
              title: 'Alternate legs',
              description: 'Alternate lead leg every 5–10 reps'
            }
          ]
        },
        {
          name: 'Low Box Squat-to-Stand',
          duration: '8–10 min',
          description: 'Light tap to box; stand tall; relaxed smooth rhythm.',
          battlePlan: '3 rounds\n• 60s Squat-to-Stand\n• 30s Easy Step-Ups\nNo extra rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/dgbd4a69_download%20%2818%29.png',
          intensityReason: 'Box target keeps depth safe with comfortable cadence.',
          moodTips: [
            {
              icon: 'body',
              title: 'Good position',
              description: 'Shins fairly upright; chest tall; no plop'
            },
            {
              icon: 'leaf',
              title: 'Breath control',
              description: 'Breathe out on stand; in on sit'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Step-Up + Knee',
          duration: '10–12 min',
          description: 'Step-up with gentle knee lift; alternate legs; control.',
          battlePlan: '4 rounds\n• 60s Step-Up + Knee (RPE 5)\n• 60s Easy Step-Ups (RPE 3–4)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/43a622qp_download%20%2817%29.png',
          intensityReason: 'Small knee drive lifts HR without jumping impact.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'No pulling',
              description: "Don't pull on rails; soft lockout"
            },
            {
              icon: 'settings',
              title: 'Choose height',
              description: 'Choose height you can own smoothly'
            }
          ]
        },
        {
          name: 'Box Squat Pulses',
          duration: '10–12 min',
          description: 'Tap box, two pulses, stand tall; repeat with control.',
          battlePlan: '4 rounds\n• 45s Squat 2-Pulse + Stand\n• 45s Step-Ups Easy\nRepeat flow',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/ikffehr2_download%20%2819%29.png',
          intensityReason: 'Light pulses increase time under tension comfortably.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Consistent depth',
              description: 'Keep depth consistent; pulse small'
            },
            {
              icon: 'leaf',
              title: 'Steady breath',
              description: 'Steady breath; avoid knee cave'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Low Box Jumps',
          duration: '12–14 min',
          description: 'Small jumps; quiet sticks; step down; reset each rep.',
          battlePlan: '5 rounds\n• 30s Box Jumps (low)\n• 60s Step-Ups Easy\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/ikffehr2_download%20%2819%29.png',
          intensityReason: 'Low jumps keep playful intent with soft controlled landings.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Good jump form',
              description: 'Big arm swing; land mid-foot; hold stick 1–2s'
            },
            {
              icon: 'refresh',
              title: 'Substitute if needed',
              description: 'If joints complain, sub Step-Up + Knee'
            }
          ]
        },
        {
          name: 'Box Jump Clusters',
          duration: '12–14 min',
          description: 'Two jumps, 10s rest, two jumps; step down always.',
          battlePlan: '5 rounds\n• Cluster: 2 Jumps → 10s rest → 2 Jumps\n• Then 60s Easy Step-Ups\nRepeat; total RPE 5–6',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/qj1k6asd_bj.webp',
          intensityReason: 'Clusters sustain jump quality with brief micro-rests.',
          moodTips: [
            {
              icon: 'eye',
              title: 'Consistent form',
              description: 'Same dip; eyes forward; quiet feet'
            },
            {
              icon: 'speedometer',
              title: 'Use timer',
              description: 'Use timer; keep jump height consistent'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Body weight only',
    icon: 'body',
    workouts: {
      beginner: [
        {
          name: 'Easy Body Circuit A',
          duration: '10–12 min',
          description: 'Squats, wall pushups, glute bridges, dead bugs; steady.',
          battlePlan: '3 rounds\n• 30s Squats\n• 30s Wall Pushups\n• 30s Glute Bridges\n• 30s Dead Bug\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/gwmz0zxk_download%20%283%29.png',
          intensityReason: 'Simple moves elevate flow with low joint and back stress.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Smooth movement',
              description: 'Move smooth; keep reps submax'
            },
            {
              icon: 'leaf',
              title: 'Stop if needed',
              description: 'Breathe steady; stop if anything pinches'
            }
          ]
        },
        {
          name: 'Easy Body Circuit B',
          duration: '10–12 min',
          description: 'Reverse lunges, plank, hip hinges, calf raises; calm.',
          battlePlan: '3 rounds\n• 30s Reverse Lunges (alt)\n• 30s Forearm Plank\n• 30s Hip Hinge Good Mornings\n• 30s Calf Raises\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/lz6xvlc5_download%20%284%29.png',
          intensityReason: 'Gentle full-body mix builds heat without large fatigue.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Use support',
              description: 'Use chair/wall for balance'
            },
            {
              icon: 'leaf',
              title: 'Light core',
              description: 'Keep core light; shallow breathing'
            }
          ]
        },
        {
          name: 'Core + Hips Flow',
          duration: '10–13 min',
          description: 'Bird dogs, side planks, clamshells, hollow holds; smooth.',
          battlePlan: '2 rounds\n• 30s Bird Dogs (alt)\n• 30s Side Plank L\n• 30s Side Plank R\n• 30s Clamshells L\n• 30s Clamshells R\n• 30s Hollow Hold\n• 60s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/04x6jgb3_download%20%285%29.png',
          intensityReason: 'Light core and hip work supports posture and ease.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Precise reps',
              description: 'Slow, precise reps; long exhales'
            },
            {
              icon: 'body',
              title: 'Ribs down',
              description: 'Keep ribs down; neck relaxed'
            }
          ]
        },
        {
          name: 'Low-Bounce Burner',
          duration: '10–12 min',
          description: 'Step-back lunges, knee pushups, squat holds, core.',
          battlePlan: '3 rounds\n• 30s Step-Back Lunges (alt)\n• 30s Incline or Knee Pushups\n• 30s Squat Hold (comfortable depth)\n• 30s Dead Bug\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/e0xo73cq_download%20%286%29.png',
          intensityReason: 'Low-impact pace warms body without jumping stress.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Control depth',
              description: 'Control depth; smooth cadence'
            },
            {
              icon: 'refresh',
              title: 'Shake out',
              description: 'Shake out arms/legs between moves'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Lazy Sweat A',
          duration: '12–15 min',
          description: 'Squats, pushups, alternating lunges, plank; steady flow.',
          battlePlan: '3 rounds\n• 40s Squats\n• 30s Pushups (incline if needed)\n• 40s Alternating Lunges\n• 30s Forearm Plank\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/gwmz0zxk_download%20%283%29.png',
          intensityReason: 'Short sets raise HR while pace stays conversational.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Quality over speed',
              description: 'Quality over speed; smooth reps'
            },
            {
              icon: 'body',
              title: 'Plank form',
              description: 'Keep plank ribs down; glutes lightly on'
            }
          ]
        },
        {
          name: 'Lazy Sweat B',
          duration: '12–15 min',
          description: 'Good mornings, reverse lunges, dead bugs, side planks.',
          battlePlan: '3 rounds\n• 40s Hip Hinge Good Mornings\n• 40s Reverse Lunges (alt)\n• 30s Dead Bug\n• 30s Side Plank (switch at 15s)\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/lz6xvlc5_download%20%284%29.png',
          intensityReason: 'Hinge, core, balance blend with easy controlled pacing.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hinge from hips',
              description: 'Hinge from hips; spine long'
            },
            {
              icon: 'leaf',
              title: 'Stay relaxed',
              description: 'Breathe out on effort; stay relaxed'
            }
          ]
        },
        {
          name: 'Low Hop Mix',
          duration: '12–15 min',
          description: 'Small squat hops, step-back lunges, pushups, hollow.',
          battlePlan: '3 rounds\n• 30s Small Squat Hops (or Squats)\n• 40s Step-Back Lunges (alt)\n• 30s Pushups\n• 30s Hollow Hold\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/04x6jgb3_download%20%285%29.png',
          intensityReason: 'Tiny hops add pop while impact stays manageable.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Substitute if needed',
              description: 'If joints disagree, do body squats'
            },
            {
              icon: 'footsteps',
              title: 'Quiet hops',
              description: 'Quiet feet; tiny hops; tall posture'
            }
          ]
        },
        {
          name: 'Core + Shoulders',
          duration: '12–15 min',
          description: 'Plank taps, pike holds, dead bugs, scapular pushups.',
          battlePlan: '3 rounds\n• 30s High Plank Shoulder Taps\n• 20–30s Pike Hold (hips high)\n• 30s Dead Bug\n• 30s Scapular Pushups\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/e0xo73cq_download%20%286%29.png',
          intensityReason: 'Gentle core and shoulder work adds tone without strain.',
          moodTips: [
            {
              icon: 'body',
              title: 'Ribs down',
              description: 'Keep ribs down in planks'
            },
            {
              icon: 'hand-right',
              title: 'Small movements',
              description: 'Small scap motion; elbows locked on taps'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Jump Flow A',
          duration: '15–18 min',
          description: 'Jump squats, alternating lunges, pushups, plank; flow.',
          battlePlan: '4 rounds\n• 20s Jump Squats → 40s Squats\n• 40s Alternating Lunges\n• 30s Pushups\n• 30s Plank\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/jurt20jc_download%20%287%29.png',
          intensityReason: 'Short jump sets lift HR; total impact stays moderate.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Soft landings',
              description: 'Land soft; mid-foot; quiet feet'
            },
            {
              icon: 'refresh',
              title: 'Substitute if needed',
              description: 'Swap to body squats if knees complain'
            }
          ]
        },
        {
          name: 'Burpee Sprinkle',
          duration: '15–18 min',
          description: 'Few burpees per minute; squats and core fill remaining.',
          battlePlan: 'EMOM 12 min\nOdd: 4–6 Burpees, then Squats till minute\nEven: 20s Hollow Hold, then Lunges till minute',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/560zzeug_download%20%288%29.png',
          intensityReason: 'Sparse burpees add spice while rest moves stay easy.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Smooth burpees',
              description: 'Keep burpees smooth; step back if needed'
            },
            {
              icon: 'leaf',
              title: 'Control breathing',
              description: 'Stay relaxed; control breathing'
            }
          ]
        },
        {
          name: 'Push–Core Ladder',
          duration: '15–18 min',
          description: 'Pushups and V-ups ladder; lunges fill rest time segments.',
          battlePlan: '1 set flow\n• 6 Pushups → 10 V-ups\n• 8 Pushups → 12 V-ups\n• 10 Pushups → 14 V-ups\n• Between rungs: 20s Alternating Lunges',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/r5b5c9ea_download%20%289%29.png',
          intensityReason: 'Short ladders challenge without heavy fatigue buildup.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Quality reps',
              description: 'Quality reps; break early if form dips'
            },
            {
              icon: 'refresh',
              title: 'Crisp V-ups',
              description: 'Keep V-ups crisp; or sub controlled tuck-ups'
            }
          ]
        },
        {
          name: 'Jump Flow B',
          duration: '15–18 min',
          description: 'Split jumps, squat jumps, pike shoulder taps, planks.',
          battlePlan: '4 rounds\n• 20s Split Jumps → 40s Reverse Lunges\n• 20s Squat Jumps → 40s Squats\n• 30s Pike Shoulder Taps\n• 30s Side Plank (switch at 15s)\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/fx9b15hc_download%20%2810%29.png',
          intensityReason: 'Mixed jumps challenge safely with soft controlled landings.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Low amplitude',
              description: 'Low amplitude jumps; quiet sticks'
            },
            {
              icon: 'body',
              title: 'Ribs down taps',
              description: 'Keep ribs down on taps; steady breath'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Assault Bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Breeze Pedal',
          duration: '8–10 min',
          description: 'Light pace, gentle arm swing, calm nasal–mouth breathing.',
          battlePlan: '1 set\n• 8–10 min Easy (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/j0sczg6l_download%20%282%29.png',
          intensityReason: 'Easy spin moves blood with very low systemic stress.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Soft grip',
              description: 'Soft grip; shoulders down; even strokes'
            },
            {
              icon: 'chatbubble',
              title: 'Stay conversational',
              description: 'Keep RPE ~3; stay conversational'
            }
          ]
        },
        {
          name: 'Short Spins',
          duration: '8–10 min',
          description: '20s quick spin with 40s easy reset; repeat smoothly.',
          battlePlan: '3 rounds\n• 2 min Easy\n• 3 × (20s Quick, 40s Easy) back-to-back\nThe 40s Easy is the rest; no extra pause',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/m4tsgs02_download%20%281%29.png',
          intensityReason: 'Brief pickups add spark without accumulating fatigue.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stay seated',
              description: 'Stay seated; quick turnover; relaxed arms and hands'
            },
            {
              icon: 'speedometer',
              title: 'Fluid cadence',
              description: 'Keep cadence fluid; avoid heavy mashing'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Cadence Waves',
          duration: '10–12 min',
          description: 'One minute brisk, one minute easy; repeat balanced.',
          battlePlan: '10–12 min continuous\n• 1 min Brisk (RPE 5)\n• 1 min Easy (RPE 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/j0sczg6l_download%20%282%29.png',
          intensityReason: 'Oscillations lift HR while the ride stays comfortable.',
          moodTips: [
            {
              icon: 'body',
              title: 'Match arms/legs',
              description: 'Match arms/legs; sit tall; light grip'
            },
            {
              icon: 'leaf',
              title: 'Control breath',
              description: 'Brisk RPE 5; easy RPE 3; control breath'
            }
          ]
        },
        {
          name: 'Gear Nudge',
          duration: '10–12 min',
          description: '90s easy then 30s firmer push; repeat controlled cycles.',
          battlePlan: '6 cycles continuous\n• 90s Easy (RPE 3)\n• 30s Push (RPE 6)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/m4tsgs02_download%20%281%29.png',
          intensityReason: 'Resistance shifts add variety under steady cadence.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Steady RPM',
              description: 'Keep RPM steady; increase pressure on pushes'
            },
            {
              icon: 'leaf',
              title: 'Relax shoulders',
              description: 'Relax shoulders; exhale long during pushes'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Mini-Tabata Lite',
          duration: '12–14 min',
          description: '6 rounds 10s hard/20s easy with long easy bookends.',
          battlePlan: '1 set\n• 4 min Easy\n• 6 rounds: 10s Hard (RPE 7) / 20s Easy\n• 4–6 min Easy finish',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/j0sczg6l_download%20%282%29.png',
          intensityReason: 'Very short efforts spice an otherwise easy ride safely.',
          moodTips: [
            {
              icon: 'pulse',
              title: 'Comfortably hard',
              description: '"Comfortably hard" = RPE 7; stay smooth'
            },
            {
              icon: 'leaf',
              title: 'Deep nasal exhales',
              description: 'Deep nasal exhales on recovery segments'
            }
          ]
        },
        {
          name: 'Pyramid Sprinkle',
          duration: '12–14 min',
          description: '20–30–40s push with equal easy; relaxed steady cadence.',
          battlePlan: '3 cycles continuous\n• 20s Push / 20s Easy\n• 30s Push / 30s Easy\n• 40s Push / 40s Easy',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/m4tsgs02_download%20%281%29.png',
          intensityReason: 'Short building pushes lift HR without overreaching.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Fluid cadence',
              description: 'Keep cadence fluid; avoid wild spikes in power'
            },
            {
              icon: 'body',
              title: 'Sit tall',
              description: 'Sit tall; soft hands; long exhales'
            }
          ]
        }
      ]
    }
  }
];


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
  handleStartWorkout: (workout: Workout, equipment: string, difficulty: string) => void;
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
        <View style={styles.workoutDescriptionContainer}>
          <Text style={styles.workoutDescription} numberOfLines={2}>{item.description}</Text>
        </View>

        {/* Start Workout Button */}
        <TouchableOpacity 
          style={styles.startWorkoutButton}
          onPress={() => handleStartWorkout(item, equipment, difficulty)}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={20} color="#000000" />
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
                <Ionicons name="add" size={14} color="#FFD700" />
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

export default function LazyBodyweightWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Parse URL parameters
  const rawMoodTitle = params.mood as string || "I'm feeling lazy";
  const moodTitle = rawMoodTitle;
  const workoutType = params.workoutType as string || 'Just move your body';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Cart hooks (removed addedItems to prevent button flashing)
  const { addToCart, isInCart } = useCart();
  
  // Parse selected equipment from comma-separated string
  const selectedEquipmentNames = equipmentParam.split(',').filter(name => name.trim() !== '');
  
  console.log('Lazy Bodyweight Debug:', {
    equipmentParam,
    selectedEquipmentNames,
    difficulty,
    workoutType,
    moodTitle
  });

  // Get workout data for selected equipment
  const selectedWorkoutData = workoutDatabase.filter(eq => 
    selectedEquipmentNames.some(name => 
      eq.equipment.toLowerCase().trim() === name.toLowerCase().trim()
    )
  );

  console.log('Selected workout data count:', selectedWorkoutData.length);

  // Cart helper functions
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
      workoutType: `I'm feeling lazy - ${workoutType}`,
      moodCard: moodTitle,
      moodTips: workout.moodTips || [],
    };

    // Add to cart
    addToCart(workoutItem);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    try {
      console.log('🚀 Starting workout:', workout.name, 'on', equipment);
      
      if (!workout.name || !equipment || !difficulty) {
        console.error('❌ Missing required parameters for workout navigation');
        return;
      }
      
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
      { key: 'bodyPart', icon: 'walk', text: workoutType },
      { key: 'difficulty', icon: 'speedometer', text: difficulty === 'intermediate' ? 'Intermed.' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `${selectedEquipmentNames.length} Equipment` },
    ];

    // Return single row
    return [steps];
  };

  // Workout Card Component matching bodyweight explosiveness format exactly

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
          {createProgressRows()[0].map((step, index) => (
            <View key={step.key} style={styles.progressRow}>
              <View style={styles.progressStep}>
                <View style={[
                  styles.progressStepCircle,
                  styles.progressStepActive
                ]}>
                  <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={14} color="#000000" />
                </View>
                <Text style={styles.progressStepText}>{step.text}</Text>
              </View>
              {index < createProgressRows()[0].length - 1 && (
                <View style={styles.progressConnector} />
              )}
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedWorkoutData.length > 0 ? (
          selectedWorkoutData.map((equipmentData) => {
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
          })
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="information-circle" size={48} color="#FFD700" />
            <Text style={styles.noWorkoutsTitle}>No workouts available</Text>
            <Text style={styles.noWorkoutsText}>
              Please select equipment and difficulty level to see your personalized workouts.
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
    paddingHorizontal: 20,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxWidth: '100%',
    overflow: 'visible',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    alignItems: 'center',
    width: 60,
    maxWidth: 60,
  },
  progressStepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressStepActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 12,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  progressConnector: {
    width: 16,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 6,
    marginTop: -24,
    alignSelf: 'center',
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
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
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
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  workoutCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    color: '#ffffff',
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
    marginBottom: 10,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  noWorkoutsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noWorkoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
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
