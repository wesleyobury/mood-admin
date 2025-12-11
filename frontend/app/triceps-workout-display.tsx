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

// Comprehensive triceps workout database with all 8 equipment types
const tricepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Flat DB Ext',
          duration: '10–12 min',
          description: 'Lying dumbbell extensions build safe, strict strength',
          battlePlan: '3 rounds\n• 10–12 Flat Bench DB Extensions\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/d78e5qae_fdbsc.webp',
          intensityReason: 'Stable flat bench isolates movement to triceps only',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flat bench support reduces back strain and keeps core relaxed',
              description: 'Lower DBs behind head for stretch, extend arms fully each rep.'
            },
            {
              icon: 'body',
              title: 'Keep elbows fixed upward, no drifting outward during press',
              description: 'Fixed elbow position maximizes tricep isolation.'
            }
          ]
        },
        {
          name: 'Incline DB Ext',
          duration: '10–12 min',
          description: 'Extended angle overhead hits fibers more intensely',
          battlePlan: '3 rounds\n• 10–12 Incline Overhead DB Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/nworhx1b_idbsc.webp',
          intensityReason: 'Incline bench increases stretch on long triceps head',
          moodTips: [
            {
              icon: 'body',
              title: 'Incline bench places arms behind torso for deeper stretch',
              description: 'Keep elbows fixed upward, no drifting outward during press.'
            },
            {
              icon: 'timer',
              title: 'Control descent 3s, then snap lockout for crisp contraction',
              description: 'Controlled eccentric movement builds strength and prevents injury.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Eccentric Incline Ext',
          duration: '12–14 min',
          description: 'Incline bench enhances stretch with eccentric focus',
          battlePlan: '4 rounds\n• 8–10 Incline Overhead DB Extensions (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yyzj0dlo_download%20%281%29.png',
          intensityReason: 'Three second negatives reinforce hypertrophy load',
          moodTips: [
            {
              icon: 'flash',
              title: 'Use incline bench to safely deepen long head under load',
              description: 'Control descent 3s, then snap lockout for crisp contraction.'
            },
            {
              icon: 'shield',
              title: 'Pause 1–2s at bottom before powering extension upward',
              description: 'Stable torso ensures triceps handle all resistance.'
            }
          ]
        },
        {
          name: 'Pause Skull Crusher',
          duration: '12–14 min',
          description: 'Incline position plus pause extends hypertrophy work',
          battlePlan: '3 rounds\n• 8–10 Incline Skull Crushers w/2s Pause\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/5cjqt0fg_download.png',
          intensityReason: 'Skull crushers with pause build stronger end range',
          moodTips: [
            {
              icon: 'timer',
              title: 'Incline bench increases elbow flex angle for greater loading',
              description: 'Pause 1–2s at bottom before powering extension upward.'
            },
            {
              icon: 'fitness',
              title: 'Switch quickly to keep constant pressure on muscles',
              description: 'Fixed elbows ensure triceps do all the work.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Ext Superset',
          duration: '14–16 min',
          description: 'Two extension positions maximize complete training',
          battlePlan: '4 rounds\n• 8 Flat DB Extensions\nRest 60s\n• 8 Incline Skull Crushers\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yyzj0dlo_download%20%281%29.png',
          intensityReason: 'Flat and incline superset hits triceps from angles',
          moodTips: [
            {
              icon: 'shield',
              title: 'Flat bench = stability; incline = deeper stretch and fiber hit',
              description: 'Switch quickly to keep constant pressure on muscles.'
            },
            {
              icon: 'flash',
              title: 'Keep elbows locked narrow both variations',
              description: 'Feel the muscle working through full range.'
            }
          ]
        },
        {
          name: 'Iso Burn Ext',
          duration: '16–18 min',
          description: 'Incline curl then isometric hold finishes triceps hard',
          battlePlan: '4 rounds\n• 8 Incline Overhead Extensions (3s eccentric)\n• 8 Incline Skull Crushers\n• End with 10s Hold Mid Rep\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/5cjqt0fg_download.png',
          intensityReason: 'Superset with eccentric and iso hold maximizes load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Combine deep incline stretch with slow eccentric lowering',
              description: 'Finish every round with a 10s mid extension iso hold.'
            },
            {
              icon: 'flame',
              title: 'Control bar path entire round',
              description: 'Mental toughness through metabolic stress builds strength.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettle bell',
    icon: 'diamond',
    workouts: {
      beginner: [
        {
          name: 'Flat KB Ext',
          duration: '10–12 min',
          description: 'Beginner kettlebell extensions build pressing base',
          battlePlan: '3 rounds\n• 10–12 Flat Bench KB Extensions\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/oei647bg_download%20%285%29.png',
          intensityReason: 'Flat bench keeps posture stable, isolating triceps',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Flat bench stability prevents arching and strict isolates arms',
              description: 'Lower bell behind head, drive up until full elbow lockout.'
            },
            {
              icon: 'body',
              title: 'Keep elbows aligned upward, resist flaring outward',
              description: 'Fixed elbow position despite challenging grip.'
            }
          ]
        },
        {
          name: 'Incline KB Ext',
          duration: '10–12 min',
          description: 'Incline position loads arms with deeper extension',
          battlePlan: '3 rounds\n• 10–12 Incline Overhead KB Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/uwwxoov7_download%20%284%29.png',
          intensityReason: 'Incline angle extends stretch on long triceps head',
          moodTips: [
            {
              icon: 'timer',
              title: 'Incline back support creates longer lever for muscle growth',
              description: 'Keep elbows aligned upward, resist flaring outward.'
            },
            {
              icon: 'fitness',
              title: 'Keep shoulders still, only forearms hinge during rep',
              description: 'Full body tension supports arm position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Eccentric Ext',
          duration: '12–14 min',
          description: 'Controlled eccentrics optimize fiber recruitment',
          battlePlan: '4 rounds\n• 8–10 Incline KB Extensions (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/oei647bg_download%20%285%29.png',
          intensityReason: 'Slow negatives increase hypertrophy efficiency',
          moodTips: [
            {
              icon: 'flash',
              title: 'Use incline for safer elbow line, stretch 3s on descent',
              description: 'Keep shoulders still, only forearms hinge during rep.'
            },
            {
              icon: 'shield',
              title: 'Keep grip neutral, wrists aligned with elbows fully',
              description: 'Control the bell behind head - kettlebell weight shifts require extra control.'
            }
          ]
        },
        {
          name: 'Pause Crusher',
          duration: '12–14 min',
          description: 'Incline crusher with pause stresses long head more',
          battlePlan: '3 rounds\n• 8–10 Incline KB Skull Crushers (2s pause)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/uwwxoov7_download%20%284%29.png',
          intensityReason: 'Pausing at stretch prolongs muscular demand',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 1–2s at bottom increases tension and control',
              description: 'Keep grip neutral, wrists aligned with elbows fully.'
            },
            {
              icon: 'fitness',
              title: 'Move quickly bench to bench for constant pressure',
              description: 'Fixed elbow position ensures tricep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'KB Ext Superset',
          duration: '14–16 min',
          description: 'Flat plus incline overloads fibers across ranges',
          battlePlan: '4 rounds\n• 8 Flat KB Extensions\n• 8 Incline KB Skull Crushers\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/oei647bg_download%20%285%29.png',
          intensityReason: 'Superset angles maximize triceps hypertrophy',
          moodTips: [
            {
              icon: 'construct',
              title: 'Move quickly bench to bench for constant pressure',
              description: 'Flat = stability, incline = deep stretch.'
            },
            {
              icon: 'fitness',
              title: 'Maintain technique under fatigue',
              description: 'Form degradation reduces effectiveness.'
            }
          ]
        },
        {
          name: 'Eccentric + Iso',
          duration: '16–18 min',
          description: 'Combo layering builds fibers with greater intensity and control.',
          battlePlan: '4 rounds\n• 8 Incline KB Extensions (3s eccentric)\n• 8 Incline KB Skull Crushers\n• End with 10s Iso Hold Mid Rep\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/uwwxoov7_download%20%284%29.png',
          intensityReason: 'Negatives plus holds prolong hypertrophy stress',
          moodTips: [
            {
              icon: 'timer',
              title: 'Descend slowly, finish with 10s mid rep hold',
              description: 'Incline support ensures safe stretch depth at long head.'
            },
            {
              icon: 'flame',
              title: 'No rest between exercises',
              description: 'Advanced training requires mental fortitude.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'EZ bar',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Flat EZ Ext',
          duration: '10–12 min',
          description: 'Lying EZ extensions target long head efficiently',
          battlePlan: '3 rounds\n• 10–12 Flat Bench EZ Extensions\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Flat bench setup teaches safer pushing mechanics',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Flat support reduces arching, focusing stress on arms',
              description: 'Lower EZ bar slowly, extend overhead in a straight track.'
            },
            {
              icon: 'body',
              title: 'Wrists stay neutral, elbows drive straight upward',
              description: 'EZ bar curve matches natural wrist position.'
            }
          ]
        },
        {
          name: 'Incline EZ Ext',
          duration: '10–12 min',
          description: 'EZ bar incline extension builds deeper triceps load',
          battlePlan: '3 rounds\n• 10–12 Incline EZ Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: 'Incline increases long head activation via angle',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Incline position intensifies stretch tension safely',
              description: 'Wrists stay neutral, elbows drive straight upward.'
            },
            {
              icon: 'flash',
              title: 'Keep elbows tight, no shoulder involvement',
              description: 'Steady press pattern builds consistent strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'EZ Crushers',
          duration: '12–14 min',
          description: 'Benchmark triceps builder with strict execution',
          battlePlan: '4 rounds\n• 8–10 EZ Skull Crushers\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Skull crushers stretch and contract muscle fully',
          moodTips: [
            {
              icon: 'body',
              title: 'With flat bench, lower bar near forehead for line',
              description: 'Keep elbows tight, no shoulder involvement.'
            },
            {
              icon: 'trending-up',
              title: 'Lower bar over 3s, press up without bouncing',
              description: 'Control the stretch for safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Eccentric Crushers',
          duration: '12–14 min',
          description: 'Negatives extend overall time under triceps tension',
          battlePlan: '3 rounds\n• 8 EZ Skull Crushers (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: '3s lower phase increases hypertrophy precision',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower bar over 3s, press up without bouncing',
              description: 'Incline bench option deepens long head involvement.'
            },
            {
              icon: 'shield',
              title: 'Keep elbows locked narrow both variations',
              description: 'Never let the weight drop or bounce.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Ext Superset',
          duration: '14–16 min',
          description: 'Combo adds angles for complete triceps overload',
          battlePlan: '4 rounds\n• 8 Flat EZ Extensions\n• 8 Incline EZ Extensions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Pair flat extension with incline for volume boost',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform flat reps strict, hit incline immediately',
              description: 'Keep elbows locked narrow both variations.'
            },
            {
              icon: 'fitness',
              title: 'Control bar path entire round',
              description: 'Each angle hits triceps differently.'
            }
          ]
        },
        {
          name: 'Crusher Burnout',
          duration: '16–18 min',
          description: 'Burnout ends with static hold for max triceps fatigue',
          battlePlan: '4 rounds\n• 8 Incline EZ Skull Crushers\n• 8 Flat EZ Extensions\n• End with 10s Iso Hold Mid Rep\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: 'Multi set pairing with iso hold taxes endurance',
          moodTips: [
            {
              icon: 'flame',
              title: 'Final rep: hold halfway down for 10s',
              description: 'Control bar path entire round.'
            },
            {
              icon: 'body',
              title: 'Listen to your body',
              description: 'Stop if form breaks down significantly.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Single extension cable',
    icon: 'swap-vertical',
    workouts: {
      beginner: [
        {
          name: 'Rope Pushdowns',
          duration: '10–12 min',
          description: 'Rope attachment separates arms, isolates better',
          battlePlan: '3 rounds\n• 10–12 Rope Pushdowns\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lruescv6_download%20%281%29.png',
          intensityReason: 'Pushdowns teach elbow lockout form safely',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Keep elbows tight; only forearms hinge down',
              description: 'Spread rope ends apart fully at lockout.'
            },
            {
              icon: 'body',
              title: 'Upright stance, elbows glued to ribcage',
              description: 'Full lockout down, slow reset up.'
            }
          ]
        },
        {
          name: 'Straight Bar Push',
          duration: '10–12 min',
          description: 'Bar option builds controlled starting triceps form',
          battlePlan: '3 rounds\n• 10–12 Straight Bar Pushdowns\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lv1qz5u4_download.png',
          intensityReason: 'Straight bar teaches strict downward extension',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Upright stance, elbows glued to ribcage',
              description: 'Full lockout down, slow reset up.'
            },
            {
              icon: 'flash',
              title: 'Press straight up with control',
              description: 'Steady press pattern builds consistent strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Overhead Rope Ext',
          duration: '12–14 min',
          description: 'Rope overhead creates long head hypertrophy focus',
          battlePlan: '4 rounds\n• 8–10 Overhead Rope Extensions\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/k3gdq2dy_download%20%281%29.png',
          intensityReason: 'Overhead path lengthens triceps time under load',
          moodTips: [
            {
              icon: 'body',
              title: 'Step away, lean slightly forward for tension',
              description: 'Elbows remain by ears, press rope forward/up.'
            },
            {
              icon: 'trending-up',
              title: 'Keep constant rope tension, no slack',
              description: 'Control the stretch for safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Negative Pushdown',
          duration: '12–14 min',
          description: 'Slow eccentrics keep stack tension constant longer',
          battlePlan: '3 rounds\n• 8 Cable Pushdowns (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lv1qz5u4_download.png',
          intensityReason: '3s lowering phase enhances cable tension output',
          moodTips: [
            {
              icon: 'timer',
              title: 'Press down firmly, return bar in 3 slow seconds',
              description: 'Keep stack plates off rest between reps.'
            },
            {
              icon: 'fitness',
              title: 'Elbows fixed at torso sides',
              description: 'Stable elbow position ensures tricep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Rope + Bar Combo',
          duration: '14–16 min',
          description: 'Superset challenges both control and arm strength',
          battlePlan: '4 rounds\n• 8 Rope Pushdowns\n• 8 Straight Bar Pushdowns\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lruescv6_download%20%281%29.png',
          intensityReason: 'Pair grips for full fiber recruitment and volume',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Rope flare trains outer head, bar keeps line strict',
              description: 'Transition smooth, elbows never leave side.'
            },
            {
              icon: 'fitness',
              title: 'Focus on form as fatigue builds',
              description: 'Quality reps more important than quantity.'
            }
          ]
        },
        {
          name: 'Overhead Iso Burn',
          duration: '16–18 min',
          description: 'Rope overhead extension plus hold maximizes stress',
          battlePlan: '4 rounds\n• 8 Overhead Rope Extensions\n• End each with 10s Hold Mid Rep\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lv1qz5u4_download.png',
          intensityReason: 'Overhead with timeout hold creates total fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold halfway extended for 10s each superset',
              description: 'Keep slight lean to maintain line of pull.'
            },
            {
              icon: 'flame',
              title: 'No rest between movements',
              description: 'Continuous work for maximum growth stimulus.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Cable crossover machine',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Rope Pushdown',
          duration: '10–12 min',
          description: 'Rope attachment builds triceps with simple tension',
          battlePlan: '3 rounds\n• 10–12 Rope Pushdowns\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/kn9gulrn_download%20%282%29.png',
          intensityReason: 'Pushdowns teach elbow lockout form safely with traditional movements.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Spread rope ends apart at bottom lockout',
              description: 'Keep elbows locked by torso, no flaring.'
            },
            {
              icon: 'body',
              title: 'Step forward, lean slightly for rope clearance',
              description: 'Keep elbows fixed toward ceiling, extend fully.'
            }
          ]
        },
        {
          name: 'Overhead Rope Ext',
          duration: '10–12 min',
          description: 'Cable overhead isolates stretch for stronger arms',
          battlePlan: '3 rounds\n• 10–12 Overhead Rope Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/k3gdq2dy_download%20%281%29.png',
          intensityReason: 'Overhead cable path increases long head tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Step forward, lean slightly for rope clearance',
              description: 'Keep elbows fixed toward ceiling, extend fully.'
            },
            {
              icon: 'fitness',
              title: 'Brace forward lean to prevent back strain',
              description: 'Full body tension supports arm position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Overhead Bar Ext',
          duration: '12–14 min',
          description: 'Straight bar hits triceps with longer stretch angle',
          battlePlan: '4 rounds\n• 8–10 Overhead Bar Extensions\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fo2f287e_download%20%2821%29.png',
          intensityReason: 'Bar overhead creates continuous long head stress',
          moodTips: [
            {
              icon: 'body',
              title: 'Position hands shoulder width on bar',
              description: 'Brace forward lean to prevent back strain.'
            },
            {
              icon: 'trending-up',
              title: 'Extend quickly, return rope over 3s',
              description: 'Keep constant rope tension, no slack.'
            }
          ]
        },
        {
          name: 'Negative Rope Ext',
          duration: '12–14 min',
          description: 'Slow eccentric rope reps increase hypertrophy load',
          battlePlan: '3 rounds\n• 8 Rope Overhead Extensions (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/d111pjm2_download%20%282%29.png',
          intensityReason: 'Three second lowers extend constant cable time',
          moodTips: [
            {
              icon: 'timer',
              title: 'Extend quickly, return rope over 3s',
              description: 'Keep constant rope tension, no slack.'
            },
            {
              icon: 'fitness',
              title: 'Keep constant rope tension, no slack',
              description: 'Stable elbow position ensures tricep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Rope + Bar Combo',
          duration: '14–16 min',
          description: 'Superset strategy hits triceps with extra volume',
          battlePlan: '4 rounds\n• 8 Rope Overhead Extensions\n• 8 Bar Overhead Extensions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/kn9gulrn_download%20%282%29.png',
          intensityReason: 'Two grips build variety across pushdown fibers',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rope fully flared, bar strict and straight',
              description: 'Minimal rest between switches.'
            },
            {
              icon: 'fitness',
              title: 'Focus on form as fatigue builds',
              description: 'Each angle hits triceps differently.'
            }
          ]
        },
        {
          name: 'Overhead 21s',
          duration: '16–18 min',
          description: 'Overhead 21 style burns fibers through completion',
          battlePlan: '3 rounds\n• 7 Bottom Half Reps\n• 7 Top Half Reps\n• 7 Full Range Reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fo2f287e_download%20%2821%29.png',
          intensityReason: 'Seven seven seven partials overload triceps range',
          moodTips: [
            {
              icon: 'timer',
              title: 'Control half reps, don\'t rush transitions',
              description: 'Keep elbows high, upper arms locked in.'
            },
            {
              icon: 'trending-up',
              title: 'Keep elbows high, upper arms locked in',
              description: 'Control movement through each range.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Tricep pushdown machine',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Machine Pushdown',
          duration: '10–12 min',
          description: 'Basic guided pushdowns strengthen pressing muscles',
          battlePlan: '3 rounds\n• 10–12 Machine Pushdowns\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ccill0t9_download%20%283%29.png',
          intensityReason: 'Fixed path helps learn stable elbow positioning',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Sit upright, grip handles firm and neutral',
              description: 'Extend fully down, don\'t lift shoulders.'
            },
            {
              icon: 'hand-left',
              title: 'Keep elbows pressed tight inward',
              description: 'Proper posture and grip maximize effectiveness.'
            }
          ]
        },
        {
          name: 'Pause Pushdown',
          duration: '10–12 min',
          description: 'Hold at bottom teaches contraction and stability',
          battlePlan: '3 rounds\n• 10 Machine Pushdowns (1–2s pause)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yfoavc6k_download%20%282%29.png',
          intensityReason: 'Paused lockout adds control and clear tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold contraction 1–2s at lockout',
              description: 'Keep elbows pressed tight inward.'
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
          name: 'Heavy Pushdown',
          duration: '12–14 min',
          description: 'Solid heavy machine sets grow triceps size fast',
          battlePlan: '4 rounds\n• 8–10 Heavy Pushdowns\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ccill0t9_download%20%283%29.png',
          intensityReason: 'Heavier loading promotes hypertrophy safely',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Increase load slowly, keep range strict',
              description: 'Don\'t jerk stack, smooth rep flow.'
            },
            {
              icon: 'refresh',
              title: 'Perform with steady rhythm',
              description: 'Consistent tempo maximizes muscle engagement.'
            }
          ]
        },
        {
          name: 'Negative Pushdown',
          duration: '12–14 min',
          description: 'Controlled negatives drive growth stimulation',
          battlePlan: '3 rounds\n• 8 Negative Machine Pushdowns\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yfoavc6k_download%20%282%29.png',
          intensityReason: 'Slow 3s return emphasizes eccentric overload',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower weight under strict 3s control',
              description: 'Keep stack engaged, no rest mid set.'
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
          name: 'Drop Set Pushdowns',
          duration: '14–16 min',
          description: 'Reduce weight in quick steps to extend tension',
          battlePlan: '4 rounds\n• 8 Heavy Pushdowns\n• Drop 20% → 8 More Reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ccill0t9_download%20%283%29.png',
          intensityReason: 'Drops increase fatigue and hypertrophy workload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strip weight quickly after set',
              description: 'Maintain range, never shorten strokes.'
            },
            {
              icon: 'trending-up',
              title: 'Keep reps smooth each drop',
              description: 'Maintain form through all weight reductions.'
            }
          ]
        },
        {
          name: 'Pushdown Iso Burn',
          duration: '16–18 min',
          description: 'Burnout with iso hold maximizes arm endurance',
          battlePlan: '4 rounds\n• 8 Pushdowns\n• End each with 10s Iso Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yfoavc6k_download%20%282%29.png',
          intensityReason: 'Static finish creates greater fiber recruitment',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold at lockout for 10s after last rep',
              description: 'Keep shoulders relaxed, arms straight.'
            },
            {
              icon: 'shield',
              title: 'Control the weight throughout entire range',
              description: 'Maintain form through metabolic stress.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Dip station / machine',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Assisted Dips',
          duration: '10–12 min',
          description: 'Builds pressing power with reduced bodyweight load',
          battlePlan: '3 rounds\n• 6–8 Assisted Dips\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/o9irqfer_download%20%284%29.png',
          intensityReason: 'Assistance teaches proper form and depth safely',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep torso vertical for max triceps',
              description: 'Lower under control, don\'t bounce.'
            },
            {
              icon: 'hand-left',
              title: 'Hands behind hips, elbows drive straight back',
              description: 'Don\'t let shoulders shrug, torso stays tall.'
            }
          ]
        },
        {
          name: 'Bench Dips',
          duration: '10–12 min',
          description: 'Simple bench dip strengthens arms with low setup',
          battlePlan: '3 rounds\n• 8–10 Bench Dips\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/pkwqrz0u_bdips.webp',
          intensityReason: 'Bench setup improves stability via shorter lever',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hands behind hips, elbows drive straight back',
              description: 'Don\'t let shoulders shrug, torso stays tall.'
            },
            {
              icon: 'fitness',
              title: 'Stay upright for triceps, no leaning forward',
              description: 'Bend to 90° elbow, press back up strong.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Parallel Dips',
          duration: '12–14 min',
          description: 'Strict parallel bar dips overload pressing muscles',
          battlePlan: '4 rounds\n• 6–8 Parallel Bar Dips\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/o9irqfer_download%20%284%29.png',
          intensityReason: 'Bodyweight dips build compound triceps strength',
          moodTips: [
            {
              icon: 'body',
              title: 'Stay upright for triceps, no leaning forward',
              description: 'Bend to 90° elbow, press back up strong.'
            },
            {
              icon: 'trending-up',
              title: 'Lower slowly for 3s each rep',
              description: 'Press up fast, don\'t swing legs.'
            }
          ]
        },
        {
          name: 'Dip Negatives',
          duration: '12–14 min',
          description: 'Dip negatives accelerate strength and growth gains',
          battlePlan: '3 rounds\n• 6 Negative Dips (3s descent)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/74stkm4f_download%20%283%29.png',
          intensityReason: '3s controlled descent creates heavy eccentric load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower slowly for 3s each rep',
              description: 'Press up fast, don\'t swing legs.'
            },
            {
              icon: 'shield',
              title: 'Control descent, never overload reps',
              description: 'Smooth transition prevents joint stress.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Dips',
          duration: '14–16 min',
          description: 'Weighted dipping expands pressing endurance power',
          battlePlan: '4 rounds\n• 6–8 Weighted Dips\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/o9irqfer_download%20%284%29.png',
          intensityReason: 'Added external load enhances triceps hypertrophy',
          moodTips: [
            {
              icon: 'construct',
              title: 'Add plates via belt, keep body upright',
              description: 'Control descent, never overload reps.'
            },
            {
              icon: 'fitness',
              title: 'Control descent, never overload reps',
              description: 'Quality reps more important than quantity.'
            }
          ]
        },
        {
          name: 'Dip + Hold',
          duration: '16–18 min',
          description: 'Weighted or strict dips end with static position hold',
          battlePlan: '4 rounds\n• 6–8 Dips (bodyweight or weighted)\n• End with 10s Iso Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/74stkm4f_download%20%283%29.png',
          intensityReason: 'Iso hold at midpoint deepens muscular fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold halfway down for 10s at last rep',
              description: 'Elbows aligned straight back, chest tall.'
            },
            {
              icon: 'flame',
              title: 'Elbows aligned straight back, chest tall',
              description: 'Advanced training requires mental fortitude.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'TRX bands',
    icon: 'link',
    workouts: {
      beginner: [
        {
          name: 'TRX Pushdown',
          duration: '10–12 min',
          description: 'Easy scale body angle to increase or reduce load',
          battlePlan: '3 rounds\n• 10–12 TRX Pushdowns\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Body angled band push teaches triceps extension',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Step forward deeper for more resistance',
              description: 'Keep elbows pinned, hinge only forearms.'
            },
            {
              icon: 'body',
              title: 'Control rope tension across full rep',
              description: 'Fixed elbow position maximizes tricep isolation.'
            }
          ]
        },
        {
          name: 'TRX Overhead Ext',
          duration: '10–12 min',
          description: 'Overhead TRX extension increases stretch safely',
          battlePlan: '3 rounds\n• 10–12 TRX Overhead Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: 'Lean forward position stretches tricep long head',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lean slightly forward, keep arms overhead',
              description: 'Control rope tension across full rep.'
            },
            {
              icon: 'fitness',
              title: 'Don\'t let straps slack mid rep',
              description: 'Full body tension supports arm position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Incline TRX Ext',
          duration: '12–14 min',
          description: 'Body angle incline forces longer extension workload',
          battlePlan: '4 rounds\n• 8–10 Incline TRX Extensions\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Sharper incline builds greater triceps range use',
          moodTips: [
            {
              icon: 'body',
              title: 'Walk feet closer to anchor for load',
              description: 'Bend elbows fully before locking out.'
            },
            {
              icon: 'trending-up',
              title: 'Lower slowly for 3s with solid core',
              description: 'Don\'t let straps slack mid rep.'
            }
          ]
        },
        {
          name: 'TRX Negatives',
          duration: '12–14 min',
          description: 'Controlled negatives raise extension efficiency',
          battlePlan: '3 rounds\n• 8 TRX Extensions (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: '3s eccentric phases enhance hypertrophy tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower slowly for 3s with solid core',
              description: 'Don\'t let straps slack mid rep.'
            },
            {
              icon: 'fitness',
              title: 'Brace entire body to stop strap sway',
              description: 'Stable elbow position ensures tricep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'TRX Ext Combo',
          duration: '14–16 min',
          description: 'Superset TRX pushes and overheads overload fibers',
          battlePlan: '4 rounds\n• 8 TRX Overhead Extensions\n• 8 TRX Pushdowns\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Overhead plus pushdown adds training variety',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform overhead stretch then pushdown strict',
              description: 'Minimal time between moves keeps arms loaded.'
            },
            {
              icon: 'fitness',
              title: 'Hold halfway extended for 10s, elbows locked in',
              description: 'Each angle hits triceps differently.'
            }
          ]
        },
        {
          name: 'TRX Iso Burn',
          duration: '16–18 min',
          description: 'Pause holds in mid rep create intense arm fatigue',
          battlePlan: '3 rounds\n• 8 TRX Extensions\n• End with 10s Hold Mid Extension\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: 'Static positions drive endurance under band load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold halfway extended for 10s, elbows locked in',
              description: 'Brace entire body to stop strap sway.'
            },
            {
              icon: 'flame',
              title: 'Brace entire body to stop strap sway',
              description: 'Advanced training requires mental fortitude.'
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
  const [showIndicator, setShowIndicator] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  console.log(`💪 WorkoutCard for ${equipment}: received ${workouts.length} workouts for ${difficulty} difficulty`);

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
        <View style={styles.addButtonWrapper}>
          <TouchableOpacity
                    style={[
                      styles.addToCartButton,
                      (isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty)) || 
                       addedItems.has(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty))) && 
                      styles.addToCartButtonAdded
                    ]}
                    onPress={() => handleAddToCart(workouts[currentWorkoutIndex], equipment)}
                    activeOpacity={0.8}
                  >
                    <Animated.View style={[styles.addToCartButtonContent, { transform: [{ scale: scaleAnim }] }]}>
                      {isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty)) || 
                       addedItems.has(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty)) ? (
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

export default function TricepsWorkoutDisplayScreen() {
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
  const workoutType = 'Triceps';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Cart and animation hooks
  const { addToCart, isInCart } = useCart();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment and remove duplicates
  const userWorkouts = selectedEquipmentNames.map(equipmentName => {
    const equipmentData = tricepsWorkoutDatabase.find(
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
      'Dumbbell': 'barbell',
      'Kettle bell': 'diamond', 
      'EZ bar': 'remove',
      'Single extension cable': 'swap-vertical',
      'Cable crossover machine': 'reorder-three',
      'Tricep pushdown machine': 'fitness',
      'Dip station / machine': 'remove',
      'TRX bands': 'link'
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'visible',
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
    marginBottom: 16,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    justifyContent: 'center',
    gap: 12,
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
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    paddingHorizontal: 40,
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