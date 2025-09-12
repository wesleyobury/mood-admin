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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Workout {
  name: string;
  duration: string;
  description: string;
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

// Shoulders workout database - using flat bench workouts from chest path for barbells
const shouldersWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Seated Shoulder Builder',
          duration: '12–14 min',
          description: '• 3 rounds:\n• 12 seated dumbbell press\n• 12 seated lateral raise\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to dumbbell shoulder training with controlled seated movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Hard exhale on each rep',
              description: 'More core stability and shoulder efficiency.'
            },
            {
              icon: 'hand-left',
              title: 'Stop at shoulder height and pause',
              description: 'Over-raising shifts load away from delts.'
            }
          ]
        },
        {
          name: 'Dynamic Shoulder Flow',
          duration: '12–15 min',
          description: 'A time-based circuit blending presses,\nisometric raises, and rear delt work for\ncomprehensive activation.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dynamic flow training with timed holds and movement patterns for enhanced muscle activation.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Isometric pauses make light weights feel heavy',
              description: 'Perfect for growth.'
            },
            {
              icon: 'walk',
              title: 'Marching during press ramps core activation',
              description: 'And shoulder stability.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Arnold Power Set',
          duration: '14–16 min',
          description: 'Develops delt and trap strength through\nArnold presses and upright rows.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate dumbbell training combining rotation movements with traditional pulling patterns.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rotate fully on Arnold presses',
              description: 'It recruits more deltoid fibers.'
            },
            {
              icon: 'trending-up',
              title: 'Pull elbows higher than wrists',
              description: 'For maximum trap-to-delt tension.'
            }
          ]
        },
        {
          name: 'Shoulder Circuit Challenge',
          duration: '14–16 min',
          description: 'A multi-exercise circuit enhancing shoulder\nstrength, stability, and core integration.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Circuit format combining pressing, isolation, and core integration for comprehensive shoulder development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive push presses overload shoulders',
              description: 'Better than light strict raises.'
            },
            {
              icon: 'fitness',
              title: 'Plank drags double as shoulder/core integration',
              description: 'Move without extra time.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Explosive Press Builder',
          duration: '18–20 min',
          description: 'Overloads delts with heavy push presses\nand targeted isolation movements.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced explosive dumbbell training combining power movements with isolation work.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push from legs on push press',
              description: 'More load capacity = more growth.'
            },
            {
              icon: 'timer',
              title: 'Keep rear delts under tension',
              description: 'By stopping just shy of lockout.'
            }
          ]
        },
        {
          name: 'Dumbbell Power Flow',
          duration: '16–18 min',
          description: 'Trains explosive power and hypertrophy\nthrough cleans, combo raises, and snatches.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite dumbbell complex movements emphasizing explosive patterns and fast-twitch fiber activation.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Pairing lateral + front raise',
              description: 'Double delt pump from one motion.'
            },
            {
              icon: 'rocket',
              title: 'Single-arm snatches teach max intent',
              description: 'And fire up fast-twitch fibers in shoulders.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Barbell Press Builder',
          duration: '12–14 min',
          description: 'Strengthens shoulders with pressing and\nupright row fundamentals.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to barbell shoulder training with fundamental overhead pressing movements.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Drive bar in straight path, not arced',
              description: 'Shoulders stay loaded, not joints.'
            },
            {
              icon: 'resize',
              title: 'Upright rows hit better',
              description: 'With a shoulder-width grip.'
            }
          ]
        },
        {
          name: 'Intro Shoulder Flow',
          duration: '12–14 min',
          description: 'Light circuit combining strict press,\nbehind-the-neck press, and overhead arcs\nfor stability.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle progression introducing varied barbell shoulder movement patterns for mobility and control.',
          moodTips: [
            {
              icon: 'warning',
              title: 'Behind-the-neck: only go as low',
              description: 'As shoulder mobility allows to prevent strain.'
            },
            {
              icon: 'refresh',
              title: 'Rainbows add lateral movement',
              description: 'Recruiting stabilizers neglected in pressing.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Press Combo',
          duration: '16–18 min',
          description: 'Heavier push presses and high pulls to\ndevelop explosive delt power.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Power-focused training combining leg drive pressing with explosive pulling for intermediate strength development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drive power from legs',
              description: 'Into push press for heavy overload.'
            },
            {
              icon: 'trending-up',
              title: 'High pulls: elbows drive wide and high',
              description: 'To maximize delt stretch.'
            }
          ]
        },
        {
          name: 'Barbell Shoulder Circuit',
          duration: '14–16 min',
          description: 'Presses, Z-presses, and overhead lunges\nto build strict strength and stability.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Circuit format combining power, strict strength, and stability patterns for comprehensive shoulder development.',
          moodTips: [
            {
              icon: 'shield',
              title: 'Z-press: no lower body',
              description: 'Equals strict shoulder strength.'
            },
            {
              icon: 'walk',
              title: 'Overhead lunges build stability',
              description: 'Under fatigue, great for functional hypertrophy.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Advanced Barbell Builder',
          duration: '18–20 min',
          description: 'Strict pressing, rows, and raises for\ncomplete shoulder overload.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced strict barbell training emphasizing controlled movement patterns for maximum shoulder development.',
          moodTips: [
            {
              icon: 'checkmark-circle',
              title: 'Strict pressing keeps body honest',
              description: 'No cheating momentum.'
            },
            {
              icon: 'barbell',
              title: 'Front raise with barbell',
              description: 'Constant tension different from dumbbells.'
            }
          ]
        },
        {
          name: 'Barbell Power Complex',
          duration: '18–20 min',
          description: 'Push jerks, high pulls, and Sots presses\nfor heavy, functional shoulder growth.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite complex training combining explosive jerks, pulls, and overhead squat pressing for maximum power and mobility.',
          moodTips: [
            {
              icon: 'trophy',
              title: 'Push jerk = heavy overload',
              description: 'Vital for breaking growth plateaus.'
            },
            {
              icon: 'body',
              title: 'Sots press pushes shoulders',
              description: 'Under maximum tension + mobility demand.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettlebells',
    icon: 'diamond',
    workouts: {
      beginner: [
        {
          name: 'Kettlebell Shoulder Builder',
          duration: '12–14 min',
          description: 'Builds delt stability and strength with\npresses and single‑arm raises.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to kettlebell shoulder training with single-arm stability work.',
          moodTips: [
            {
              icon: 'shield',
              title: 'Stabilize wrist under kettlebell',
              description: 'The instability builds deep shoulder recruitment.'
            },
            {
              icon: 'hand-left',
              title: 'Light single-arm raises give better isolation',
              description: 'Than double-arm versions.'
            }
          ]
        },
        {
          name: 'Kettlebell Flow Starter',
          duration: '12–14 min',
          description: 'A mobility and stability circuit using\npresses, halos, and carries.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dynamic mobility flow training with halos and carries for shoulder stability and control.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Halos enhance shoulder mobility while under load',
              description: 'Better pressing later.'
            },
            {
              icon: 'walk',
              title: 'Carries under control torch stabilizers',
              description: 'Needed for growth + longevity.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Double Press Builder',
          duration: '15–17 min',
          description: 'Heavy bilateral pressing paired with\nupright rows for delts and traps.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate double kettlebell training combining bilateral pressing with upright rowing patterns.',
          moodTips: [
            {
              icon: 'contract',
              title: 'Double KB press: keep bells tight to midline',
              description: 'For optimal shoulder tension.'
            },
            {
              icon: 'trending-up',
              title: 'Upright row with KBs allows freer wrist path',
              description: 'Safer and smoother.'
            }
          ]
        },
        {
          name: 'Kettlebell Strength Flow',
          duration: '16–18 min',
          description: 'Clean & presses, snatches, windmills, and\nlunges for delt strength with mobility.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Advanced flow combining explosive movements with mobility patterns for comprehensive shoulder development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Windmills stretch and strengthen shoulders',
              description: 'Dynamically.'
            },
            {
              icon: 'walk',
              title: 'The overhead lunge teaches bracing',
              description: 'While shoulders are under load = hypertrophy + core.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Kettlebell Strength Builder',
          duration: '18–20 min',
          description: 'Overloads shoulders with push presses,\nhigh pulls, and front raises.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced kettlebell training emphasizing explosive power movements and targeted isolation work.',
          moodTips: [
            {
              icon: 'flash',
              title: 'KB push press allows heavier loading',
              description: 'Than strict pressing — growth stimulus.'
            },
            {
              icon: 'timer',
              title: 'Front raises with KBs keep delts',
              description: 'Under longer time under tension due to offset weight.'
            }
          ]
        },
        {
          name: 'Kettlebell Power Complex',
          duration: '18–20 min',
          description: 'A power circuit of presses, snatches, and\nTurkish sit-ups to train explosive endurance.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite power complex combining explosive snatches with Turkish get-up variations for maximum endurance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Alternating snatches are metabolic + hypertrophy gold',
              description: 'When done explosively.'
            },
            {
              icon: 'body',
              title: 'Turkish sit-ups put load on shoulders',
              description: 'Through the eccentric = perfect accessory growth.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Adjustable Bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Seated Angle Press Builder',
          duration: '12–14 min',
          description: 'Seated presses and raises at angles\nfor delt isolation.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to adjustable bench training with angle-specific delt targeting.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Start with the press at steeper angles',
              description: 'Then lower angle for more anterior delt growth.'
            },
            {
              icon: 'checkmark-circle',
              title: 'Seated raises reduce torso cheat',
              description: 'Better shoulder isolation.'
            }
          ]
        },
        {
          name: 'Adjustable Bench Flow',
          duration: '12–14 min',
          description: 'Press progression across angles to hit\ndifferent shoulder fibers.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive angle training systematically targeting different deltoid muscle fiber orientations.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Moving angles back-to-back overloads shoulders',
              description: 'At all fiber angles.'
            },
            {
              icon: 'checkmark-circle',
              title: 'Focus on control not weight',
              description: 'Faster isn\'t more efficient.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Arnold + Fly Builder',
          duration: '14–16 min',
          description: 'Arnold presses and reverse flys for\nfront-to-rear delt balance.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate bench training combining rotational pressing with rear deltoid isolation work.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Arnold presses combine rotation with pressing',
              description: 'Full deltoid recruitment.'
            },
            {
              icon: 'contract',
              title: 'Reverse flies hit rear delts',
              description: 'Balancing front-dominant work.'
            }
          ]
        },
        {
          name: 'Seated Shoulder Circuit',
          duration: '16–18 min',
          description: 'Circuit of Arnold presses, raises, and\nisometric holds for hypertrophy and stability.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Circuit format combining rotational pressing, isolation, and isometric holds for comprehensive development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Add the hold at the end',
              description: 'For isometric time under tension (hypertrophy boost).'
            },
            {
              icon: 'flash',
              title: 'Flowing exercise-to-exercise builds efficient fatigue',
              description: 'Without wasted time.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complete Bench Builder',
          duration: '18–20 min',
          description: 'Press, lateral raise, and reverse fly\ntriad for full delt work.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complete shoulder development combining pressing, lateral, and posterior deltoid work.',
          moodTips: [
            {
              icon: 'contract',
              title: 'Reverse flies last',
              description: 'Pre-exhausts delts fully.'
            },
            {
              icon: 'timer',
              title: 'Controlled 2-sec eccentric',
              description: 'Amplifies growth.'
            }
          ]
        },
        {
          name: 'Shoulder Giant Set',
          duration: '18–20 min',
          description: 'Back-to-back presses, raises, and isometrics\ncreate maximum density.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite giant set protocol maximizing training density with continuous deltoid activation patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Giant sets maximize density',
              description: 'More growth in less time.'
            },
            {
              icon: 'timer',
              title: 'The lateral raise hold keeps delts burning',
              description: 'When fibers would normally rest.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Powerlifting Platform',
    icon: 'grid',
    workouts: {
      beginner: [
        {
          name: 'Press + Pull Starter',
          duration: '12–14 min',
          description: 'Overhead presses and high pulls for\ndelt strength basics.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to platform training with fundamental overhead pressing and pulling.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Drive bar in straight path',
              description: 'Not arced - shoulders stay loaded, not joints.'
            },
            {
              icon: 'flash',
              title: 'High pulls: explosive pull to chest level',
              description: 'Focus on speed, not weight.'
            }
          ]
        },
        {
          name: 'Overhead Intro Flow',
          duration: '12–14 min',
          description: 'Strict press, pulls, holds, and arcs to\nbuild overhead stability.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive overhead stability training combining pressing, pulling, and mobility patterns.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Overhead holds build isometric strength',
              description: 'Essential for heavy pressing later.'
            },
            {
              icon: 'refresh',
              title: 'Barbell rainbows add lateral movement',
              description: 'Recruiting stabilizers neglected in pressing.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Platform Power Builder',
          duration: '15–17 min',
          description: 'Push presses and holds for heavy\ndelt overload.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate power development combining explosive pressing with isometric holds for strength.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push press allows heavier loads',
              description: 'Than strict press - use leg drive wisely.'
            },
            {
              icon: 'timer',
              title: 'Overhead holds under fatigue',
              description: 'Build stabilizer strength and confidence.'
            }
          ]
        },
        {
          name: 'Olympic Flow',
          duration: '16–18 min',
          description: 'A strength and mobility blend of press,\nsnatch, and squat.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Olympic movement integration combining pressing, explosive pulling, and overhead mobility patterns.',
          moodTips: [
            {
              icon: 'rocket',
              title: 'Power snatch: focus on speed under bar',
              description: 'Not height of pull.'
            },
            {
              icon: 'body',
              title: 'Overhead squats build stability',
              description: 'And mobility simultaneously.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Advanced Platform Builder',
          duration: '18–20 min',
          description: 'Heavy jerks, pulls, and squats for\nadvanced delt growth.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced platform training emphasizing heavy Olympic lifts for maximum shoulder power development.',
          moodTips: [
            {
              icon: 'trophy',
              title: 'Push jerk = heavy overload',
              description: 'Vital for breaking growth plateaus.'
            },
            {
              icon: 'body',
              title: 'Overhead squats test total shoulder stability',
              description: 'Under heavy load.'
            }
          ]
        },
        {
          name: 'Olympic Shoulder Complex',
          duration: '18–20 min',
          description: 'Jerks, snatches, and Sots presses for\nload and mobility.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite Olympic complex combining maximum explosive power with deep overhead mobility demands.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Snatches demand full-body coordination',
              description: 'Perfect for athletic shoulder development.'
            },
            {
              icon: 'body',
              title: 'Sots presses push shoulders under maximum',
              description: 'Tension + mobility demand.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Smith Machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Smith Intro Press',
          duration: '12–14 min',
          description: 'Strict pressing and rows with\nSmith stability.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to Smith machine training with guided bar path stability.',
          moodTips: [
            {
              icon: 'checkmark-circle',
              title: 'Smith machine removes balance demands',
              description: 'Focus purely on pressing strength.'
            },
            {
              icon: 'trending-up',
              title: 'Upright rows: keep elbows higher than wrists',
              description: 'For maximum delt activation.'
            }
          ]
        },
        {
          name: 'Smith Flow Starter',
          duration: '12–14 min',
          description: 'Press, row, and light behind-neck work\nin a safe track.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Safe progression through multiple shoulder movement patterns using Smith machine guidance.',
          moodTips: [
            {
              icon: 'warning',
              title: 'Behind-the-neck presses: only go as low',
              description: 'As shoulder mobility allows safely.'
            },
            {
              icon: 'shield',
              title: 'Smith track provides safety',
              description: 'For exploring new movement patterns.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Smith Press Builder',
          duration: '14–16 min',
          description: 'Shoulder presses with bar-only raises\nfor anterior delt focus.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate Smith training combining guided pressing with isolated anterior deltoid work.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Smith pressing allows focus on form',
              description: 'Without balance concerns.'
            },
            {
              icon: 'trending-up',
              title: 'Front raises with bar create different tension',
              description: 'Than dumbbells - constant load.'
            }
          ]
        },
        {
          name: 'Smith Shoulder Circuit',
          duration: '16–18 min',
          description: 'Multi-move Smith circuit targeting pressing\nstrength and stability.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Circuit format combining multiple Smith machine angles for comprehensive shoulder development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push presses in Smith allow heavier loads',
              description: 'Safely without balance demands.'
            },
            {
              icon: 'timer',
              title: 'Overhead holds build confidence',
              description: 'Under heavy loads with safety.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Smith Builder',
          duration: '18–20 min',
          description: 'Heavy press and row combo without\nbalance demands.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced heavy Smith training maximizing load capacity without balance limitations.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Smith allows true maximal loading',
              description: 'Without stabilizer limitations.'
            },
            {
              icon: 'warning',
              title: 'Behind-the-neck work requires perfect mobility',
              description: 'Use Smith safety for confidence.'
            }
          ]
        },
        {
          name: 'Descending Rep Shoulder Complex',
          duration: '18–20 min',
          description: 'Dropset-style circuit across press,\nrow, and raise.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite descending rep protocol maximizing fatigue accumulation across multiple movement patterns.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Descending reps maintain intensity',
              description: 'As fatigue accumulates.'
            },
            {
              icon: 'flash',
              title: 'No rest between exercises',
              description: 'Maximizes metabolic demand and growth.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Shoulder Press Machine',
    icon: 'triangle',
    workouts: {
      beginner: [
        {
          name: 'Machine Shoulder Builder',
          duration: '12–14 min',
          description: 'Light presses with neutral grip for\njoint-friendly strength.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to machine pressing with joint-friendly grip variations.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Neutral grip reduces wrist stress',
              description: 'While maintaining delt activation.'
            },
            {
              icon: 'checkmark-circle',
              title: 'Machine path ensures consistent form',
              description: 'Throughout the movement.'
            }
          ]
        },
        {
          name: 'Machine Static Flow',
          duration: '12–14 min',
          description: 'Alternates reps and isometric holds to\nextend tension.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive isometric integration extending time under tension for enhanced muscle activation.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Isometric holds at top and midpoint',
              description: 'Maximize tension at different angles.'
            },
            {
              icon: 'flash',
              title: 'Machine stability allows focus',
              description: 'On muscle contraction quality.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Press Machine Builder',
          duration: '14–16 min',
          description: 'Moderate pressing with unilateral work\nfor balance.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate machine training combining bilateral and unilateral pressing for balanced development.',
          moodTips: [
            {
              icon: 'body',
              title: 'Single-arm presses reveal imbalances',
              description: 'Machine safety allows exploration.'
            },
            {
              icon: 'checkmark-circle',
              title: 'Bilateral work builds pure strength',
              description: 'Without stabilizer limitations.'
            }
          ]
        },
        {
          name: 'Machine Grip Circuit',
          duration: '16–18 min',
          description: 'Grips and holds to recruit all\nshoulder fibers.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Circuit format utilizing multiple grip positions to target different deltoid fiber orientations.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Wide grip targets posterior delts more',
              description: 'Neutral hits anterior and medial.'
            },
            {
              icon: 'timer',
              title: 'Overhead holds with different grips',
              description: 'Build grip-specific stability.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Machine Builder',
          duration: '18–20 min',
          description: 'Heavy multi-grip pressing for\ndelt hypertrophy.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced heavy machine training maximizing load across multiple grip positions for hypertrophy.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Machine allows true maximal loads',
              description: 'Without balance or stabilizer concerns.'
            },
            {
              icon: 'hand-left',
              title: 'Grip variation prevents adaptation',
              description: 'Keeps muscles challenged.'
            }
          ]
        },
        {
          name: 'Machine Shoulder Gauntlet',
          duration: '18–20 min',
          description: 'High-density pressing gauntlet for hypertrophy\nand tendon strength.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite high-density protocol combining maximum training volume with tendon strengthening adaptations.',
          moodTips: [
            {
              icon: 'flash',
              title: 'High-density training maximizes hypertrophy',
              description: 'Through volume accumulation.'
            },
            {
              icon: 'timer',
              title: 'Overhead holds strengthen tendons',
              description: 'Under maximal tension.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Rear Delt Fly Machine',
    icon: 'contract',
    workouts: {
      beginner: [
        {
          name: 'Intro Shoulder Isolation',
          duration: '12–14 min',
          description: 'Light rear delt and pec deck pairing\nfor balance.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to isolation training balancing front and rear deltoid development.',
          moodTips: [
            {
              icon: 'contract',
              title: 'Rear delt flies require light weight',
              description: 'Focus on squeeze, not load.'
            },
            {
              icon: 'refresh',
              title: 'Pec deck flies balance front-focused',
              description: 'Pressing movements.'
            }
          ]
        },
        {
          name: 'Isolation Hold Circuit',
          duration: '12–14 min',
          description: 'Paused rear delt and pec deck flys for\ncontraction and control.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Isometric integration protocol enhancing muscle activation through paused contractions.',
          moodTips: [
            {
              icon: 'timer',
              title: '2-second pause at peak contraction',
              description: 'Maximizes muscle activation.'
            },
            {
              icon: 'checkmark-circle',
              title: 'Machine path ensures perfect isolation',
              description: 'No momentum or cheating.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Fly Isolation Builder',
          duration: '14–16 min',
          description: 'Moderate delt/chest fly pairing for\nhypertrophy.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate isolation training balancing posterior and anterior deltoid hypertrophy development.',
          moodTips: [
            {
              icon: 'contract',
              title: 'Rear flys first when fresh',
              description: 'They\'re usually the weakest link.'
            },
            {
              icon: 'trending-up',
              title: 'Progressive overload on isolation',
              description: 'Comes from perfect form, not just weight.'
            }
          ]
        },
        {
          name: 'Grips & Angles Circuit',
          duration: '16–18 min',
          description: 'Multiple fly grips and single-arm flies\nfor isolation angles.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Circuit format utilizing multiple grip positions and unilateral work for comprehensive isolation.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip variations target different fiber angles',
              description: 'Wide, neutral, close all matter.'
            },
            {
              icon: 'body',
              title: 'Single-arm flies reveal imbalances',
              description: 'Between left and right sides.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Shoulder Isolation',
          duration: '18–20 min',
          description: 'Heavy rear delt, pec deck, and single-arm\nflys for overload.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced isolation training emphasizing maximum load capacity for targeted deltoid hypertrophy.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Heavy isolation requires perfect form',
              description: 'Machine stability allows focus on load.'
            },
            {
              icon: 'body',
              title: 'Single-arm flies allow independent loading',
              description: 'Address imbalances with precision.'
            }
          ]
        },
        {
          name: 'Fly Machine Burnout',
          duration: '18–20 min',
          description: 'Burnout sequence with holds and single-arm\nrear delt focus.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Mijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite burnout protocol maximizing metabolic stress and time under tension for hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Burnout sequences push past normal failure',
              description: 'Maximum hypertrophy stimulus.'
            },
            {
              icon: 'timer',
              title: 'Holds at top extend time under tension',
              description: 'When muscles want to quit.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Cable Crossover Machine',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Cable Raise Starter',
          duration: '12–14 min',
          description: 'Lateral and front raises under constant\ncable tension.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to cable training with constant tension throughout range of motion.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Cables provide constant tension',
              description: 'Unlike free weights that vary with gravity.'
            },
            {
              icon: 'trending-up',
              title: 'Start light and focus on control',
              description: 'Cable resistance feels different.'
            }
          ]
        },
        {
          name: 'Cable Flow Burn',
          duration: '14–15 min',
          description: 'Cable raises, face pulls, and static hold\nfor shoulder pump.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive flow combining isolation raises with posterior chain work for balanced development.',
          moodTips: [
            {
              icon: 'contract',
              title: 'Face pulls hit often-neglected rear delts',
              description: 'Essential for shoulder health.'
            },
            {
              icon: 'timer',
              title: 'Static holds create metabolic stress',
              description: 'Perfect for muscle growth.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Cable Combo Press Builder',
          duration: '14–16 min',
          description: 'Cable pressing paired with rows for\ndelts and traps.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate cable training combining pressing patterns with rowing for comprehensive development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Cable presses allow unique angles',
              description: 'Not possible with free weights.'
            },
            {
              icon: 'trending-up',
              title: 'Upright rows with cables',
              description: 'Provide smoother resistance curve.'
            }
          ]
        },
        {
          name: 'Cable Angle Circuit',
          duration: '16–18 min',
          description: 'Multi-angle raises plus face pulls and\npresses for delts.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Circuit format utilizing multiple cable angles to target deltoids from all vectors.',
          moodTips: [
            {
              icon: 'settings',
              title: 'High-to-low and low-to-high angles',
              description: 'Hit different deltoid fiber orientations.'
            },
            {
              icon: 'contract',
              title: 'Face pulls between raises',
              description: 'Maintain rear delt activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Cable Builder',
          duration: '18–20 min',
          description: 'Heavy raises, face pulls, and rows to\nhit fast-twitch delts.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced heavy cable training targeting fast-twitch muscle fibers for maximum power development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy cable work requires explosive intent',
              description: 'Even on isolation movements.'
            },
            {
              icon: 'trending-up',
              title: 'Cables allow heavy isolation safely',
              description: 'With constant tension benefits.'
            }
          ]
        },
        {
          name: 'Cable Complex Burnout',
          duration: '18–20 min',
          description: 'Giant set across raises, pulls, and presses\nfor nonstop activation.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Mijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite giant set protocol maximizing continuous deltoid activation across multiple movement patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Giant sets with cables create',
              description: 'Maximum metabolic stress and growth.'
            },
            {
              icon: 'timer',
              title: 'No rest between exercises',
              description: 'Maintains constant tension throughout.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Landmine Attachment',
    icon: 'rocket',
    workouts: {
      beginner: [
        {
          name: 'Landmine Starter Press',
          duration: '12–14 min',
          description: 'Intro to single- and two-arm\nlandmine pressing.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to landmine training with natural arc pressing movement.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Landmine arc feels more natural',
              description: 'Than straight overhead pressing.'
            },
            {
              icon: 'body',
              title: 'Single-arm work reveals imbalances',
              description: 'Between left and right sides.'
            }
          ]
        },
        {
          name: 'Landmine Basics Flow',
          duration: '12–15 min',
          description: 'Press, raise, and iso-hold circuit for\nstability and growth.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive flow combining pressing, isolation, and stability work through landmine arc movement.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Landmine raises hit unique angle',
              description: 'Not possible with other equipment.'
            },
            {
              icon: 'timer',
              title: 'Overhead holds in landmine position',
              description: 'Build stability through the arc.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Landmine Press Builder',
          duration: '15–16 min',
          description: 'Press and front raise focus using\nlandmine arc.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate landmine training combining pressing strength with front deltoid isolation work.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Landmine arc allows heavier loads',
              description: 'Than traditional overhead pressing.'
            },
            {
              icon: 'flash',
              title: 'Front raises in landmine arc',
              description: 'Create unique resistance curve.'
            }
          ]
        },
        {
          name: 'Landmine Functional Flow',
          duration: '16–18 min',
          description: 'Presses, rotations, and holds combining\ndelts and core.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Functional integration combining deltoid work with core stability through rotational patterns.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rotational presses combine shoulders and core',
              description: 'Perfect functional integration.'
            },
            {
              icon: 'body',
              title: 'Landmine forces anti-rotation stability',
              description: 'Building real-world strength.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Landmine Builder',
          duration: '18–20 min',
          description: 'Heavy push presses and raises for\ndelt overload.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced heavy landmine training maximizing load capacity through explosive pressing patterns.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push presses in landmine allow',
              description: 'Maximum loading with natural arc.'
            },
            {
              icon: 'trending-up',
              title: 'Heavy raises challenge delts',
              description: 'Through unique resistance angle.'
            }
          ]
        },
        {
          name: 'Advanced Landmine Complex',
          duration: '18–20 min',
          description: 'Complex of push presses, rotations, and\nwindmills for delt power.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Mijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite complex training integrating power, rotation, and mobility for maximum functional development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Windmills in landmine position',
              description: 'Challenge stability and mobility simultaneously.'
            },
            {
              icon: 'flash',
              title: 'Complex training builds power endurance',
              description: 'And functional shoulder strength.'
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
        <View style={styles.workoutHeader}>
          <View style={styles.workoutTitleContainer}>
            <Text style={styles.workoutName}>{item.name}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Text style={styles.difficultyBadgeText}>{difficulty.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.workoutDuration}>{item.duration}</Text>
        </View>

        {/* Intensity Reason */}
        <View style={styles.intensityContainer}>
          <Ionicons name="information-circle" size={16} color="#FFD700" />
          <Text style={styles.intensityReason}>{item.intensityReason}</Text>
        </View>

        {/* Workout Description */}
        <ScrollView style={styles.workoutDescriptionContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.workoutDescription}>{item.description}</Text>
        </ScrollView>

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

  // Simple touch-based swipe detection for reliable web compatibility
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: any) => {
    const touch = e.nativeEvent.touches ? e.nativeEvent.touches[0] : e.nativeEvent;
    setTouchEnd(null);
    setTouchStart(touch.pageX || touch.clientX);
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

    if (isLeftSwipe && workouts.length > 1) {
      // Swipe left - next workout
      setCurrentWorkoutIndex(prev => 
        prev < workouts.length - 1 ? prev + 1 : 0
      );
    }
    
    if (isRightSwipe && workouts.length > 1) {
      // Swipe right - previous workout
      setCurrentWorkoutIndex(prev => 
        prev > 0 ? prev - 1 : workouts.length - 1
      );
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
        <View style={styles.workoutIndicator}>
          <Text style={styles.workoutCount}>{currentWorkoutIndex + 1}/{workouts.length}</Text>
        </View>
      </View>

      {/* Swipeable Workouts - Touch-based Implementation */}
      <View 
        style={[styles.workoutList, { width: width - 48, height: 420 }]}
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

export default function ShouldersWorkoutDisplayScreen() {
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
    selectedEquipmentNames = ['Dumbbells'];
  }
  
  const difficulty = (params.difficulty as string || 'beginner').toLowerCase();
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Shoulders';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment
  const userWorkouts = shouldersWorkoutDatabase.filter(item => 
    selectedEquipmentNames.includes(item.equipment)
  );

  console.log('Debug info:', {
    selectedEquipmentNames,
    shouldersWorkoutDatabaseEquipment: shouldersWorkoutDatabase.map(w => w.equipment),
    userWorkouts: userWorkouts.map(w => w.equipment),
    userWorkoutsLength: userWorkouts.length
  });

  // Remove any potential duplicates
  const uniqueUserWorkouts = userWorkouts.filter((workout, index, self) => 
    index === self.findIndex(w => w.equipment === workout.equipment)
  );

  const handleGoBack = () => {
    router.back();
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
          duration: workout.duration || '15 min',
          difficulty: difficulty,
          workoutType: workoutType,
          // Pass MOOD tips as properly encoded JSON string
          moodTips: encodeURIComponent(JSON.stringify(workout.moodTips || []))
        }
      });
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
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
          <Text style={styles.headerSubtitle}>{moodTitle} - {difficulty}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar - Single Non-Scrolling Section */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          {/* Step 1: Mood Selection */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="flame" size={12} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {/* Step 2: Workout Type */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="fitness" size={12} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{workoutType}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {/* Step 3: Intensity Level */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="speedometer" size={12} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {/* Steps 4+: Individual Equipment Items */}
          {selectedEquipmentNames.map((equipment, index) => {
            // Get appropriate icon for each equipment type
            const getEquipmentIcon = (equipmentName: string) => {
              const equipmentIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
                'Adjustable Bench': 'square',
                'Barbells': 'barbell',
                'Cable Crossover Machine': 'reorder-three',
                'Dumbbells': 'barbell',
                'Kettlebells': 'diamond',
                'Landmine Attachment': 'rocket',
                'Pec Deck / Rear Delt Fly Machine': 'contract',
                'Powerlifting Platform': 'grid',
                'Rear Delt Fly Machine': 'contract',
                'Shoulder Press Machine': 'triangle',
                'Smith Machine': 'hardware-chip'
              };
              return equipmentIconMap[equipmentName] || 'fitness';
            };

            return (
              <React.Fragment key={equipment}>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <Ionicons name={getEquipmentIcon(equipment)} size={12} color="#000000" />
                  </View>
                  <Text style={styles.progressStepText}>{equipment}</Text>
                </View>
                {index < selectedEquipmentNames.length - 1 && <View style={styles.progressConnector} />}
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Workouts List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {uniqueUserWorkouts.map((equipmentData, index) => {
          console.log(`Rendering card ${index + 1}:`, equipmentData.equipment);
          return (
            <WorkoutCard
              key={`workout-card-${equipmentData.equipment}-${index}`}
              equipment={equipmentData.equipment}
              icon={equipmentData.icon}
              workouts={equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts]}
              difficulty={difficulty}
              difficultyColor={difficultyColor}
              onStartWorkout={handleStartWorkout}
            />
          );
        })}

        {/* Debug info for development */}
        {uniqueUserWorkouts.length === 0 && (
          <View style={styles.noWorkoutsContainer}>
            <Text style={styles.noWorkoutsText}>
              No workouts available for selected equipment.
            </Text>
            <Text style={styles.debugText}>
              Selected: {selectedEquipmentNames.join(', ')}
            </Text>
            <Text style={styles.debugText}>
              Available: {shouldersWorkoutDatabase.map(w => w.equipment).join(', ')}
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
  progressStep: {
    alignItems: 'center',
    minWidth: 60,
    maxWidth: 80,
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
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  progressStepNumberActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
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
    marginHorizontal: 4,
    marginTop: 14,
  },
  progressContainer: {
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  workoutCardContainer: {
    marginBottom: 30,
    width: '100%',
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
    marginBottom: 30,
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
    height: 420,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  workoutImageContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
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
  },
  swipeText: {
    fontSize: 11,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '600',
  },
  workoutContent: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
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
    color: '#ffffff',
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
    fontStyle: 'italic',
  },
  workoutDescriptionContainer: {
    flex: 1,
    maxHeight: 80,
  },
  workoutDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 16,
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
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 12,
  },
  debugText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 4,
  },
});