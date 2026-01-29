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

// Complete Shoulders workout database with 1-line titles and 3-line descriptions
const shouldersWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Shoulder Builder',
          duration: '12-15 min',
          description: 'Builds foundational shoulder strength with\nseated presses and lateral raises.\n ',
          battlePlan: '3 rounds:\n• 12 seated dumbbell press\n• 12 seated lateral raise\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to shoulder pressing and isolation.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Press: Drive thumbs toward ceiling',
              description: 'Keeps shoulders in safe position and maximizes deltoid recruitment.'
            },
            {
              icon: 'trending-up',
              title: 'Lateral raise: Lead with pinkies',
              description: 'Creates better deltoid isolation and prevents shoulder impingement.'
            }
          ]
        },
        {
          name: 'Shoulder Flow',
          duration: '10-12 min',
          description: 'Dynamic shoulder warm-up building mobility\nand activation through multiple planes.\n ',
          battlePlan: '3 rounds:\n• 10 arm circles forward\n• 10 arm circles backward\n• 10 shoulder shrugs\nRest 45s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle mobility-focused warm-up for shoulder preparation.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Circles: Keep arms straight and controlled',
              description: 'Focus on smooth, full range motion to activate all shoulder muscles.'
            },
            {
              icon: 'body',
              title: 'Shrugs: Squeeze shoulder blades together',
              description: 'Activates rear delts and improves posture before pressing.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Arnold Power',
          duration: '15-18 min',
          description: 'Arnold press and lateral raise combo\nfor intermediate shoulder strength.\n ',
          battlePlan: '4 rounds:\n• 10 Arnold press\n• 12 lateral raises\n• 10 front raises\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dynamic Arnold press challenges all shoulder planes.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Arnold press: Rotate palms during movement',
              description: 'Start palms facing you, finish facing forward for complete deltoid activation.'
            },
            {
              icon: 'flash',
              title: 'Raises: Control the negative',
              description: 'Slow descent builds time under tension and prevents momentum.'
            }
          ]
        },
        {
          name: 'Circuit',
          duration: '12-15 min',
          description: 'High-rep shoulder circuit for endurance\nand metabolic conditioning.\n ',
          battlePlan: '3 rounds:\n• 15 shoulder press\n• 15 lateral raise\n• 15 rear delt fly\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'High-volume circuit for intermediate shoulder conditioning.',
          moodTips: [
            {
              icon: 'timer',
              title: 'High reps: Focus on form over speed',
              description: 'Maintain perfect technique even as fatigue sets in.'
            },
            {
              icon: 'trending-up',
              title: 'Rear delt fly: Squeeze shoulder blades',
              description: 'Emphasizes posterior deltoid and improves posture.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Press Builder',
          duration: '18-22 min',
          description: 'Heavy shoulder press with drop sets\nfor advanced strength development.\n ',
          battlePlan: '4 rounds:\n• 8 heavy shoulder press\n• Drop to 12 moderate\n• Drop to 15 light\nRest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set protocol for maximum shoulder hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy set: Push to near failure',
              description: 'Challenge your strength limits while maintaining perfect form.'
            },
            {
              icon: 'speedometer',
              title: 'Drop sets: No rest between weights',
              description: 'Quick transitions maximize metabolic stress and growth stimulus.'
            }
          ]
        },
        {
          name: 'Power Flow',
          duration: '16-20 min',
          description: 'Advanced dumbbell complex targeting\nall three deltoid heads intensively.\n ',
          battlePlan: '3 rounds:\n• 6 push press\n• 8 lateral raise\n• 10 rear delt fly\n• 12 front raise\nRest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Complete shoulder complex for advanced muscle development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push press: Use leg drive',
              description: 'Explosive leg drive allows heavier weights for shoulder overload.'
            },
            {
              icon: 'body',
              title: 'Complex: Minimal rest between exercises',
              description: 'Continuous tension maximizes shoulder pump and growth.'
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
          name: 'Press Builder',
          duration: '12-15 min',
          description: 'Basic barbell shoulder press foundation\nwith light weight and perfect form.\n ',
          battlePlan: '3 rounds:\n• 10 standing barbell press\n• 12 upright rows\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Safe introduction to barbell overhead pressing.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Grip: Hands just outside shoulders',
              description: 'Proper grip width prevents wrist strain and maximizes power transfer.'
            },
            {
              icon: 'body',
              title: 'Core: Brace tight throughout movement',
              description: 'Strong core prevents back arch and maintains safe pressing position.'
            }
          ]
        },
        {
          name: 'Shoulder Flow',
          duration: '10-12 min',
          description: 'Introductory barbell flow combining\npresses and rows for balance.\n ',
          battlePlan: '3 rounds:\n• 8 behind neck press (light)\n• 10 upright rows\n• 8 bent over rows\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Beginner barbell complex for shoulder and upper back balance.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Behind neck: Very light weight only',
              description: 'Requires excellent mobility; skip if shoulders feel tight.'
            },
            {
              icon: 'trending-up',
              title: 'Upright rows: Keep elbows below wrists',
              description: 'Prevents shoulder impingement while targeting side delts.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Combo',
          duration: '15-18 min',
          description: 'Power press and upright row combination\nfor intermediate strength and size.\n ',
          battlePlan: '4 rounds:\n• 8 push press\n• 12 upright rows\n• 10 bent over rows\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive pressing with targeted isolation work.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push press: Drive with legs first',
              description: 'Explosive leg drive transfers more power to shoulder muscles.'
            },
            {
              icon: 'body',
              title: 'Rows: Pull elbows back and up',
              description: 'Emphasizes rear delts for balanced shoulder development.'
            }
          ]
        },
        {
          name: 'Circuit',
          duration: '12-15 min',
          description: 'Barbell shoulder circuit with minimal\nrest for conditioning and strength.\n ',
          battlePlan: '3 rounds:\n• 10 barbell press\n• 15 upright rows\n• 12 high pulls\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'High-volume barbell circuit for intermediate conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'High pulls: Explosive hip drive',
              description: 'Focus on power from hips, not just arms, for maximum effect.'
            },
            {
              icon: 'timer',
              title: 'Circuit: Maintain steady rhythm',
              description: 'Consistent tempo builds endurance while maintaining strength gains.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Barbell Max',
          duration: '18-22 min',
          description: 'Advanced barbell complex with heavy\nloads for maximum shoulder development.\n ',
          battlePlan: '4 rounds:\n• 6 heavy push press\n• 8 behind neck press\n• 10 upright rows\n• 12 high pulls\nRest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced barbell complex for complete shoulder development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Heavy push press: Focus on lockout',
              description: 'Strong overhead lockout builds stability and pressing strength.'
            },
            {
              icon: 'shield',
              title: 'Behind neck: Perfect mobility required',
              description: 'Skip if any shoulder discomfort; front press is equally effective.'
            }
          ]
        },
        {
          name: 'Power Max',
          duration: '16-20 min',
          description: 'High-intensity barbell power complex\nfor explosive shoulder strength.\n ',
          battlePlan: '3 rounds:\n• 5 heavy barbell press\n• 6 push press\n• 8 high pulls\n• 10 upright rows\nRest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity barbell training for advanced athletes.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy press: Grind through sticking points',
              description: 'Mental toughness and technique refinement at heavy loads.'
            },
            {
              icon: 'trending-up',
              title: 'Power movements: Think speed and force',
              description: 'Explosive intent builds both strength and power simultaneously.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettlebells',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Shoulder Builder',
          duration: '12-15 min',
          description: 'Kettlebell shoulder foundation with\npresses and basic movement patterns.\n ',
          battlePlan: '3 rounds:\n• 8 kettlebell press (each arm)\n• 10 kettlebell swings\n• 8 halos (each direction)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to kettlebell shoulder training.',
          moodTips: [
            {
              icon: 'construct',
              title: 'KB press: Keep wrist straight and strong',
              description: 'Kettlebell weight distribution requires extra wrist stability.'
            },
            {
              icon: 'refresh',
              title: 'Halos: Move slowly with control',
              description: 'Builds shoulder mobility and stability in all planes of motion.'
            }
          ]
        },
        {
          name: 'Flow Starter',
          duration: '10-12 min',
          description: 'Gentle kettlebell flow building shoulder\nmobility and basic strength patterns.\n ',
          battlePlan: '3 rounds:\n• 6 around the world (each direction)\n• 8 overhead carries (20 steps)\n• 10 arm swings\nRest 45s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Mobility-focused kettlebell introduction for shoulder health.',
          moodTips: [
            {
              icon: 'body',
              title: 'Around world: Keep core engaged',
              description: 'Stable core allows shoulders to move freely and safely.'
            },
            {
              icon: 'trending-up',
              title: 'Overhead carry: Perfect posture',
              description: 'Head up, shoulders down, core braced for optimal shoulder position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Double Press',
          duration: '15-18 min',
          description: 'Double kettlebell pressing for increased\nstrength and core stability demands.\n ',
          battlePlan: '4 rounds:\n• 8 double KB press\n• 10 single arm swings (each)\n• 8 bottoms up press (each)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Double kettlebell training for intermediate strength development.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Double press: Synchronize both arms',
              description: 'Even pressing builds balanced strength and coordination.'
            },
            {
              icon: 'construct',
              title: 'Bottoms up: Squeeze handle tight',
              description: 'Inverted kettlebell position challenges grip and shoulder stability.'
            }
          ]
        },
        {
          name: 'KB Flow',
          duration: '12-15 min',
          description: 'Flowing kettlebell sequence combining\nstrength and dynamic movements.\n ',
          battlePlan: '3 rounds:\n• 6 clean and press (each)\n• 8 windmills (each)\n• 10 high pulls (each)\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Dynamic kettlebell flow for intermediate functional strength.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Clean and press: Smooth hip drive',
              description: 'Power comes from hips, not just arms, for efficient movement.'
            },
            {
              icon: 'body',
              title: 'Windmills: Keep eyes on kettlebell',
              description: 'Visual tracking helps maintain balance and shoulder stability.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'KB Max',
          duration: '18-22 min',
          description: 'Heavy kettlebell complex for advanced\nshoulder strength and power development.\n ',
          battlePlan: '4 rounds:\n• 5 heavy double KB press\n• 6 single arm jerks (each)\n• 8 bottoms up press (each)\n• 10 windmills (each)\nRest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced kettlebell complex for maximum shoulder development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy doubles: Perfect timing',
              description: 'Synchronized pressing with heavy bells requires focus and power.'
            },
            {
              icon: 'trending-up',
              title: 'Jerks: Explosive leg drive',
              description: 'Quick dip and drive generates power for overhead lockout.'
            }
          ]
        },
        {
          name: 'KB Power',
          duration: '16-20 min',
          description: 'High-intensity kettlebell power complex\nfor explosive shoulder development.\n ',
          battlePlan: '3 rounds:\n• 4 double KB clean and press\n• 5 single arm snatches (each)\n• 6 double KB swings\n• 8 Turkish get-up (partial)\nRest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity kettlebell training for advanced athletes.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Snatches: One fluid motion',
              description: 'Hip drive, high pull, and punch through in seamless sequence.'
            },
            {
              icon: 'construct',
              title: 'Get-ups: Slow and controlled',
              description: 'Each position builds shoulder stability and total body strength.'
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
          name: 'Angle Press',
          duration: '12-15 min',
          description: 'Seated angle press building foundation\nstrength across multiple pressing angles.\n ',
          battlePlan: '3 rounds:\n• 10 seated press (45°)\n• 12 lateral raises\n• 10 rear delt fly\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect seated pressing introduction with back support.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Bench angle: 45° for optimal pressing',
              description: 'Reduces lower back stress while maintaining shoulder activation.'
            },
            {
              icon: 'body',
              title: 'Back support: Keep contact throughout',
              description: 'Use bench support to focus purely on shoulder movement.'
            }
          ]
        },
        {
          name: 'Bench Flow',
          duration: '10-12 min',
          description: 'Adjustable bench flow targeting all\nthree deltoid heads systematically.\n ',
          battlePlan: '3 rounds:\n• 8 incline press (60°)\n• 10 lateral raise\n• 8 incline rear delt fly\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Systematic targeting of all deltoid heads with bench support.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Incline angle: Adjust for comfort',
              description: 'Find angle that allows full range without shoulder pinching.'
            },
            {
              icon: 'body',
              title: 'Rear delt fly: Chest supported',
              description: 'Bench support isolates rear delts and prevents cheating.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Arnold + Fly',
          duration: '15-18 min',
          description: 'Arnold press and fly combination\nwith adjustable bench support angles.\n ',
          battlePlan: '4 rounds:\n• 10 Arnold press (45°)\n• 12 incline lateral raise\n• 10 chest-supported rear fly\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate pressing with isolation work using bench angles.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Arnold press: Full rotation',
              description: 'Complete palm rotation activates all deltoid fibers effectively.'
            },
            {
              icon: 'body',
              title: 'Incline raises: Use bench for back support',
              description: 'Prevents momentum and isolates lateral deltoid perfectly.'
            }
          ]
        },
        {
          name: 'Circuit',
          duration: '12-15 min',
          description: 'Seated shoulder circuit maximizing\nbench angles for complete development.\n ',
          battlePlan: '3 rounds:\n• 12 seated press (30°)\n• 15 lateral raise\n• 12 rear delt fly (45°)\n• 10 front raise\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'High-volume circuit utilizing multiple bench angles.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Circuit pace: Steady and controlled',
              description: 'Focus on form over speed during high-rep sequences.'
            },
            {
              icon: 'construct',
              title: 'Angle changes: Quick transitions',
              description: 'Efficient bench adjustments maintain workout intensity.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Bench Max',
          duration: '18-22 min',
          description: 'Complete bench shoulder builder using\nall angles for maximum development.\n ',
          battlePlan: '4 rounds:\n• 8 heavy press (45°)\n• 10 Arnold press (30°)\n• 12 lateral raise\n• 10 rear fly (60°)\nRest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced bench utilization for complete shoulder development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Multiple angles: Target all fibers',
              description: 'Each angle emphasizes different deltoid fiber groups.'
            },
            {
              icon: 'flash',
              title: 'Heavy press: Challenge strength',
              description: 'Bench support allows heavier loads safely.'
            }
          ]
        },
        {
          name: 'Giant Set',
          duration: '16-20 min',
          description: 'Shoulder giant set utilizing every\nbench angle for ultimate burnout.\n ',
          battlePlan: '3 rounds:\n• 6 press (15°)\n• 8 press (45°)\n• 10 press (75°)\n• 12 lateral raise\n• 15 rear fly\nRest 3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate shoulder giant set using all bench positions.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Angle progression: Low to high',
              description: 'Start more vertical, progress to more challenging angles.'
            },
            {
              icon: 'timer',
              title: 'Giant set: Mental toughness required',
              description: 'Push through fatigue for maximum shoulder development.'
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
          name: 'Rear Delt Focus',
          duration: '12-14 min',
          description: 'Machine rear delt flys and reverse\nflys for posterior chain activation.\n ',
          battlePlan: '3 rounds:\n• 12 rear delt fly\n• 10 reverse fly (chest supported)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to machine rear delt training.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Adjust seat height properly',
              description: 'Arms should be parallel to floor at shoulder height.'
            },
            {
              icon: 'body',
              title: 'Squeeze shoulder blades',
              description: 'Focus on bringing shoulder blades together, not just moving arms.'
            }
          ]
        },
        {
          name: 'Posture Fix',
          duration: '10-12 min',
          description: 'Rear delt strengthening circuit\nfor posture improvement and balance.\n ',
          battlePlan: '3 rounds:\n• 10 rear delt fly\n• 8 reverse fly\n• 6 face pulls (if available)\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Focused posterior deltoid training for posture correction.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Focus on the squeeze',
              description: 'Contract rear delts hard as arms come together behind you.'
            },
            {
              icon: 'timer',
              title: 'Control the movement',
              description: 'Slow, controlled reps build better mind-muscle connection.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Rear Delt Max',
          duration: '16-18 min',
          description: 'Heavy-to-light rear delt pyramid\nfor posterior deltoid development.\n ',
          battlePlan: '4 rounds:\n• 12 light rear delt fly\n• 10 moderate rear delt fly\n• 8 heavy rear delt fly\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive loading across different rep ranges.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Increase weight progressively',
              description: 'Each set should challenge you at the target rep range.'
            },
            {
              icon: 'body',
              title: 'Feel the rear delts working',
              description: 'Mind-muscle connection is crucial for isolation work.'
            }
          ]
        },
        {
          name: 'Burnout',
          duration: '14-15 min',
          description: 'Rear delt pre-exhaustion with\ncompound movements for balance.\n ',
          battlePlan: '3 rounds:\n• 15 rear delt fly\n• 10 reverse fly (immediately after)\n• 8 face pulls\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Pre-exhaustion protocol for posterior deltoid development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'No rest between exercises',
              description: 'Move immediately from one exercise to the next.'
            },
            {
              icon: 'flash',
              title: 'Push through fatigue',
              description: 'Rear delts will be pre-fatigued, focus on quality reps.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Rear Delt AMRAP',
          duration: '10 min',
          description: 'Max rear delt fly reps in 10 minutes\nfor ultimate posterior burnout.\n ',
          battlePlan: '3 rounds:\n• 12 heavy rear delt fly\n• Drop → 15 moderate\n• Drop → 20 light\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set protocol for maximum rear delt development.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Quick weight adjustments',
              description: 'Minimize rest time between drop set weights.'
            },
            {
              icon: 'timer',
              title: 'Time under tension focus',
              description: 'Slow eccentrics even under fatigue for maximum growth.'
            }
          ]
        },
        {
          name: 'Elite',
          duration: '15-18 min',
          description: 'Advanced rear delt complex with\nvariations for elite development.\n ',
          battlePlan: '2 rounds:\n• 25 rear delt fly\n• 20 reverse fly\n• 15 face pulls\n• Max single-arm fly\nRest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-volume rear delt finisher for maximum posterior development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Maintain perfect form',
              description: 'Even under fatigue, prioritize form over speed.'
            },
            {
              icon: 'flash',
              title: 'Push through the burn',
              description: 'Mental toughness required for high-volume training.'
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
          name: 'Cable Basics',
          duration: '12-14 min',
          description: 'Cable shoulder foundation with\nlateral raises and face pulls.\n ',
          battlePlan: '3 rounds:\n• 10 cable lateral raise\n• 8 cable face pulls\n• 6 cable front raise\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to cable shoulder training.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Adjust cable height properly',
              description: 'Mid-chest height for lateral raises, high for face pulls.'
            },
            {
              icon: 'body',
              title: 'Maintain slight forward lean',
              description: 'Stable stance with one foot forward for balance.'
            }
          ]
        },
        {
          name: 'Cable Flow',
          duration: '12-14 min',
          description: 'Standing cable shoulder flow\nfor stability and coordination.\n ',
          battlePlan: '3 rounds:\n• 8 cable shoulder press\n• 10 single-arm cable raise\n• 8 cable reverse fly\nRest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Functional cable training for shoulder stability.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Engage core throughout',
              description: 'Standing position requires core stability for balance.'
            },
            {
              icon: 'flash',
              title: 'Control the cables',
              description: 'Smooth movement prevents momentum and maximizes tension.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Cable Power',
          duration: '14-16 min',
          description: 'Multi-angle cable training hitting\nall deltoid heads systematically.\n ',
          battlePlan: '3 rounds:\n• 8 high cable raise\n• 8 mid cable raise\n• 8 low cable raise\n• 10 cable upright row\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Comprehensive cable training targeting all shoulder angles.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Different angles target different fibers',
              description: 'High = upper, mid = middle, low = lower deltoid emphasis.'
            },
            {
              icon: 'refresh',
              title: 'Smooth transitions between angles',
              description: 'Keep muscles under constant tension for growth stimulus.'
            }
          ]
        },
        {
          name: 'Cable Complex',
          duration: '14-16 min',
          description: 'Cable press and raise sequence\nfor shoulder hypertrophy focus.\n ',
          battlePlan: '3 rounds:\n• 8 cable shoulder press\n• 10 single-arm cable raise\n• 8 cable rear delt fly\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Strength-focused cable training with unilateral work.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Press with control',
              description: 'Controlled eccentric maximizes time under tension.'
            },
            {
              icon: 'fitness',
              title: 'Single-arm challenges stability',
              description: 'Maintain stable torso during unilateral movements.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Cable Max',
          duration: '15-18 min',
          description: 'Advanced cable complex with\ndrop sets for maximum development.\n ',
          battlePlan: '3 rounds:\n• 8 heavy cable press\n• Drop → 10 moderate\n• Drop → 12 light\n• 8 cable face pulls\nRest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW44MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set training with constant cable tension.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Time under tension focus',
              description: 'Slow eccentrics on drop sets for maximum muscle growth.'
            },
            {
              icon: 'flash',
              title: 'Peak contraction emphasis',
              description: 'Hold squeeze for 1s at peak contraction on every rep.'
            }
          ]
        },
        {
          name: 'Cable Elite',
          duration: '16-18 min',
          description: 'Ultimate cable shoulder finisher\nfor elite shoulder development.\n ',
          battlePlan: '2 rounds:\n• 15 cable lateral raise\n• 12 cable front raise\n• 10 cable rear delt fly\n• 8 cable upright row\nRest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-volume cable finisher for maximum shoulder pump.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Maintain perfect form',
              description: 'Even under fatigue, prioritize form over speed.'
            },
            {
              icon: 'body',
              title: 'Feel all deltoids working',
              description: 'Mind-muscle connection crucial for high-volume training.'
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
          name: 'Landmine Press',
          duration: '12-15 min',
          description: 'Landmine shoulder press building\nfoundation strength with barbell setup.\n ',
          battlePlan: '3 rounds:\n• 10 landmine press (each arm)\n• 8 landmine upright rows\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to landmine shoulder training.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Landmine setup: Secure one end of barbell',
              description: 'Ensure barbell is properly secured in landmine attachment.'
            },
            {
              icon: 'body',
              title: 'Core engagement: Maintain stability',
              description: 'Keep core braced throughout all landmine movements.'
            }
          ]
        },
        {
          name: 'Landmine Flow',
          duration: '10-12 min',
          description: 'Basic landmine movement flow\nfor shoulder mobility and strength.\n ',
          battlePlan: '3 rounds:\n• 8 landmine press\n• 6 landmine lateral raise\n• 8 landmine rainbow\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Functional landmine movements for shoulder development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rainbow motion: Full arc movement',
              description: 'Move barbell in smooth arc from side to side overhead.'
            },
            {
              icon: 'flash',
              title: 'Control the weight: Smooth movements',
              description: 'Focus on controlled motion rather than speed.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Press',
          duration: '15-18 min',
          description: 'Landmine power pressing with\nincreased load and complexity.\n ',
          battlePlan: '4 rounds:\n• 8 single-arm landmine press\n• 10 landmine upright rows\n• 6 landmine thrusters\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate landmine training for power development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Thrusters: Combine squat and press',
              description: 'Explosive movement from squat position to overhead press.'
            },
            {
              icon: 'trending-up',
              title: 'Single-arm work: Unilateral strength',
              description: 'Builds core stability and addresses muscle imbalances.'
            }
          ]
        },
        {
          name: 'Complex',
          duration: '12-15 min',
          description: 'Landmine shoulder complex combining\nmultiple movement patterns.\n ',
          battlePlan: '3 rounds:\n• 6 landmine clean and press\n• 8 landmine halos\n• 10 landmine rotations\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Dynamic landmine complex for functional strength.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Halos: Complete circles around head',
              description: 'Move barbell in controlled circles around your head.'
            },
            {
              icon: 'body',
              title: 'Rotations: Core and shoulder integration',
              description: 'Rotational movements build functional strength patterns.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Landmine Max',
          duration: '18-22 min',
          description: 'Advanced landmine training for\nmaximum shoulder power development.\n ',
          battlePlan: '4 rounds:\n• 6 heavy landmine press\n• 8 landmine clean and jerk\n• 10 landmine windmills\n• 12 landmine switches\nRest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced landmine complex for elite shoulder development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Clean and jerk: Explosive power movement',
              description: 'Full-body power transfer to overhead position.'
            },
            {
              icon: 'trending-up',
              title: 'Windmills: Core stability challenge',
              description: 'Advanced movement requiring excellent mobility and control.'
            }
          ]
        },
        {
          name: 'Elite Flow',
          duration: '16-20 min',
          description: 'Ultimate landmine flow for\nelite shoulder conditioning.\n ',
          battlePlan: '3 rounds:\n• 5 landmine snatches\n• 8 single-arm thrusters\n• 10 landmine rotational press\n• 12 landmine spirals\nRest 3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate landmine challenge for elite athletes.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Snatches: One fluid motion to overhead',
              description: 'Explosive full-body movement requiring perfect technique.'
            },
            {
              icon: 'body',
              title: 'Spirals: Three-dimensional movement',
              description: 'Advanced pattern combining rotation and vertical movement.'
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
          name: 'Platform Press',
          duration: '12-15 min',
          description: 'Platform overhead pressing with\nsolid foundation and form focus.\n ',
          battlePlan: '3 rounds:\n• 8 overhead press\n• 10 push press\n• 6 strict press\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to platform overhead pressing.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Platform setup: Use proper rack height',
              description: 'Set bar at appropriate height for safe unracking.'
            },
            {
              icon: 'body',
              title: 'Foot position: Stable base for pressing',
              description: 'Maintain stable foot position throughout all presses.'
            }
          ]
        },
        {
          name: 'Power Base',
          duration: '10-12 min',
          description: 'Foundation power movements on\nplatform for shoulder development.\n ',
          battlePlan: '3 rounds:\n• 6 military press\n• 8 behind neck press (light)\n• 10 front raises\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Fundamental platform movements for shoulder strength.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Military press: Strict form required',
              description: 'No leg drive, pure shoulder and core strength.'
            },
            {
              icon: 'shield',
              title: 'Behind neck: Only if flexible',
              description: 'Skip if any shoulder discomfort or limited mobility.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Platform Power',
          duration: '15-18 min',
          description: 'Intermediate platform training with\npower movements and heavier loads.\n ',
          battlePlan: '4 rounds:\n• 6 push press\n• 8 strict press\n• 10 upright rows\n• 8 high pulls\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate platform training for power development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push press: Use leg drive efficiently',
              description: 'Explosive leg extension transfers power to shoulders.'
            },
            {
              icon: 'trending-up',
              title: 'High pulls: Power from hips',
              description: 'Generate force from hip drive, not just arms.'
            }
          ]
        },
        {
          name: 'Strength Base',
          duration: '12-15 min',
          description: 'Platform strength building with\ncompound movement combinations.\n ',
          battlePlan: '3 rounds:\n• 5 heavy press\n• 8 push press\n• 10 upright rows\n• 12 shrugs\nRest 2 min',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Strength-focused platform training for muscle development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Heavy press: Focus on technique',
              description: 'Maintain perfect form even at heavier weights.'
            },
            {
              icon: 'body',
              title: 'Shrugs: Trap activation',
              description: 'Complete shoulder development with trap emphasis.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Platform Max',
          duration: '18-22 min',
          description: 'Advanced platform training for\nmaximum shoulder strength and power.\n ',
          battlePlan: '4 rounds:\n• 3 max effort press\n• 5 push press\n• 6 jerk\n• 8 high pulls\nRest 3 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced platform training for maximum strength development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Max effort: Challenge your limits',
              description: 'Push maximum weights while maintaining perfect form.'
            },
            {
              icon: 'trending-up',
              title: 'Jerk: Technical precision required',
              description: 'Advanced Olympic lift technique for explosive power.'
            }
          ]
        },
        {
          name: 'Elite Power',
          duration: '16-20 min',
          description: 'Ultimate platform workout for\nelite shoulder power and strength.\n ',
          battlePlan: '3 rounds:\n• 2 max press singles\n• 4 split jerks\n• 6 snatch grip press\n• 8 muscle snatches\nRest 3-4 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate platform challenge for elite athletes.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Max singles: Peak strength testing',
              description: 'Test maximum strength capabilities with single reps.'
            },
            {
              icon: 'construct',
              title: 'Olympic variations: Technical mastery',
              description: 'Advanced Olympic lift variations requiring years of practice.'
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
          name: 'Machine Press',
          duration: '12-15 min',
          description: 'Machine shoulder press foundation\nwith guided movement patterns.\n ',
          battlePlan: '3 rounds:\n• 12 seated machine press\n• 10 single-arm machine press\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to machine shoulder pressing.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Seat adjustment: Proper height alignment',
              description: 'Adjust seat so handles are at shoulder level.'
            },
            {
              icon: 'body',
              title: 'Back support: Maintain contact',
              description: 'Keep back pressed against pad throughout movement.'
            }
          ]
        },
        {
          name: 'Press Basics',
          duration: '10-12 min',
          description: 'Basic machine pressing with\nform focus and progression.\n ',
          battlePlan: '3 rounds:\n• 10 machine press\n• 8 partial reps (top half)\n• 6 slow negatives\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Form-focused machine training for proper technique.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Slow negatives: Control the descent',
              description: 'Take 3-4 seconds to lower weight for muscle building.'
            },
            {
              icon: 'trending-up',
              title: 'Partial reps: Focus on sticking points',
              description: 'Work on the most challenging portion of the movement.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Machine Power',
          duration: '15-18 min',
          description: 'Intermediate machine training with\nvaried rep ranges and intensities.\n ',
          battlePlan: '4 rounds:\n• 8 machine press\n• 10 single-arm alternating\n• 12 high rep burns\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate machine training for strength and endurance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Alternating arms: Unilateral focus',
              description: 'Single-arm work challenges stability and balance.'
            },
            {
              icon: 'timer',
              title: 'High rep burns: Push through fatigue',
              description: 'Mental toughness and muscular endurance challenge.'
            }
          ]
        },
        {
          name: 'Complex',
          duration: '12-15 min',
          description: 'Machine press complex with\ndrop sets and intensity techniques.\n ',
          battlePlan: '3 rounds:\n• 8 heavy machine press\n• Drop to 12 moderate\n• Drop to 16 light\nRest 2 min',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Drop set protocol for maximum machine press development.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Quick weight changes: Minimal rest',
              description: 'Efficient machine adjustments maximize training effect.'
            },
            {
              icon: 'flash',
              title: 'Push through burn: Mental toughness',
              description: 'Drop sets create intense muscle fatigue and growth.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Machine Max',
          duration: '18-22 min',
          description: 'Advanced machine training for\nmaximum shoulder development.\n ',
          battlePlan: '4 rounds:\n• 6 max weight press\n• 8 tempo press (3-1-3)\n• 10 explosive press\n• 12 burnout reps\nRest 3 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced machine protocol for elite shoulder development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Tempo work: Time under tension',
              description: '3 seconds down, 1 second pause, 3 seconds up.'
            },
            {
              icon: 'flash',
              title: 'Explosive press: Maximum force production',
              description: 'Push with maximum speed while maintaining control.'
            }
          ]
        },
        {
          name: 'Elite Machine',
          duration: '16-20 min',
          description: 'Ultimate machine shoulder workout\nfor elite strength and endurance.\n ',
          battlePlan: '3 rounds:\n• 4 max effort singles\n• 6 cluster sets (pause reps)\n• 8 1.5 rep method\n• Max reps to failure\nRest 4 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate machine challenge for elite athletes.',
          moodTips: [
            {
              icon: 'construct',
              title: '1.5 reps: Bottom half plus full rep',
              description: 'Advanced technique combining partial and full range motion.'
            },
            {
              icon: 'trending-up',
              title: 'Cluster sets: Short rest between reps',
              description: 'Brief pause between reps allows heavier weight usage.'
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
          name: 'Smith Press',
          duration: '12-15 min',
          description: 'Smith machine shoulder press\nwith guided bar path for safety.\n ',
          battlePlan: '3 rounds:\n• 10 smith machine press\n• 8 behind neck press (light)\n• 12 upright rows\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to Smith machine shoulder training.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Bar position: Centered on shoulders',
              description: 'Ensure bar is properly centered before pressing.'
            },
            {
              icon: 'shield',
              title: 'Safety hooks: Set appropriate height',
              description: 'Position safety hooks just below lowest point.'
            }
          ]
        },
        {
          name: 'Smith Basics',
          duration: '10-12 min',
          description: 'Basic Smith machine movements\nfor shoulder strength foundation.\n ',
          battlePlan: '3 rounds:\n• 8 seated smith press\n• 10 smith upright rows\n• 6 smith shrugs\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Foundational Smith machine training for safe progression.',
          moodTips: [
            {
              icon: 'body',
              title: 'Seated position: Back support',
              description: 'Use bench back support for seated pressing variations.'
            },
            {
              icon: 'flash',
              title: 'Controlled movement: Use the guide rails',
              description: 'Take advantage of guided bar path for perfect form.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Smith Power',
          duration: '15-18 min',
          description: 'Intermediate Smith machine training\nwith power and strength focus.\n ',
          battlePlan: '4 rounds:\n• 8 smith push press\n• 10 standing smith press\n• 8 smith high pulls\n• 12 smith rows\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate Smith machine training for power development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push press: Use leg drive',
              description: 'Generate power from legs to assist shoulder press.'
            },
            {
              icon: 'trending-up',
              title: 'Standing press: Core engagement',
              description: 'Standing position challenges core stability more.'
            }
          ]
        },
        {
          name: 'Smith Complex',
          duration: '12-15 min',
          description: 'Smith machine shoulder complex\nfor comprehensive development.\n ',
          battlePlan: '3 rounds:\n• 6 smith press\n• 8 smith behind neck\n• 10 smith upright rows\n• 12 smith front raise\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Comprehensive Smith machine complex for all deltoid heads.',
          moodTips: [
            {
              icon: 'body',
              title: 'Behind neck: Only if mobile',
              description: 'Skip behind neck pressing if any shoulder discomfort.'
            },
            {
              icon: 'construct',
              title: 'Front raises: Light weight',
              description: 'Use lighter weight for isolation movements.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Smith Max',
          duration: '18-22 min',
          description: 'Advanced Smith machine training\nfor maximum shoulder development.\n ',
          battlePlan: '4 rounds:\n• 5 max smith press\n• 6 smith push press\n• 8 smith muscle cleans\n• 10 smith high pulls\nRest 2-3 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced Smith machine training for maximum strength.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Muscle cleans: Power development',
              description: 'Explosive pulling movement to shoulder level.'
            },
            {
              icon: 'construct',
              title: 'Max press: Challenge limits safely',
              description: 'Smith machine allows for heavier pressing safely.'
            }
          ]
        },
        {
          name: 'Elite Smith',
          duration: '16-20 min',
          description: 'Ultimate Smith machine workout\nfor elite shoulder power and size.\n ',
          battlePlan: '3 rounds:\n• 3 max effort singles\n• 5 cluster press\n• 8 tempo press (4-1-2)\n• Max reps burnout\nRest 3-4 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate Smith machine challenge for elite athletes.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Tempo press: Maximize time under tension',
              description: '4 seconds down, 1 second pause, 2 seconds up.'
            },
            {
              icon: 'trending-up',
              title: 'Cluster press: Rest-pause technique',
              description: 'Brief rest between reps allows heavier loads.'
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
          <Ionicons name={icon} size={24} color='#FFD700' />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <View style={styles.workoutIndicator}>
          <Text style={styles.workoutCount}>{currentWorkoutIndex + 1}/{workouts.length}</Text>
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

  // Remove duplicates based on equipment name (in case there are any)
  const uniqueUserWorkouts = userWorkouts.filter((item, index, self) => 
    index === self.findIndex(t => t.equipment === item.equipment)
  );

  console.log('Final unique workouts to display:', uniqueUserWorkouts.length);

  const handleGoBack = () => {
    try {
      console.log('🔄 Going back from shoulders workout display...');
      router.back();
    } catch (error) {
      console.error('❌ Error going back:', error);
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
      'Dumbbells': 'barbell',
      'Barbells': 'barbell',
      'Kettlebells': 'fitness',
      'Adjustable Bench': 'square',
      'Rear Delt Fly Machine': 'contract',
      'Cable Crossover Machine': 'reorder-three',
      'Landmine Attachment': 'rocket',
      'Powerlifting Platform': 'grid',
      'Shoulder Press Machine': 'triangle',
      'Smith Machine': 'hardware-chip'
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
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
              />
            );
          })
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="fitness" size={48} color='#FFD700' />
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
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
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
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    marginBottom: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
    color: '#FFFFFF',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  dotsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFD700',
    width: 10,
    height: 10,
    borderRadius: 5,
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  noWorkoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  noWorkoutsSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});