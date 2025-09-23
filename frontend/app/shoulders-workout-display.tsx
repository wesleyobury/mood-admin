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

// Complete Shoulders workout database with 1-line titles and 3-line descriptions
const shouldersWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Shoulder Builder',
          duration: '12–15 min',
          description: 'Builds foundational shoulder strength with\nseated presses and lateral raises.\n ',
          battlePlan: '• 3 rounds:\n• 12 seated dumbbell press\n• 12 seated lateral raise\n• Rest 60s',
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
          duration: '10–12 min',
          description: 'Dynamic shoulder warm-up building mobility\nand activation through multiple planes.\n ',
          battlePlan: '• 3 rounds:\n• 10 arm circles forward\n• 10 arm circles backward\n• 10 shoulder shrugs\n• Rest 45s',
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
          duration: '15–18 min',
          description: 'Arnold press and lateral raise combo\nfor intermediate shoulder strength.\n ',
          battlePlan: '• 4 rounds:\n• 10 Arnold press\n• 12 lateral raises\n• 10 front raises\n• Rest 75s',
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
          duration: '12–15 min',
          description: 'High-rep shoulder circuit for endurance\nand metabolic conditioning.\n ',
          battlePlan: '• 3 rounds:\n• 15 shoulder press\n• 15 lateral raise\n• 15 rear delt fly\n• Rest 90s',
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
          duration: '18–22 min',
          description: 'Heavy shoulder press with drop sets\nfor advanced strength development.\n ',
          battlePlan: '• 4 rounds:\n• 8 heavy shoulder press\n• Drop to 12 moderate\n• Drop to 15 light\n• Rest 2 min',
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
          duration: '16–20 min',
          description: 'Advanced dumbbell complex targeting\nall three deltoid heads intensively.\n ',
          battlePlan: '• 3 rounds:\n• 6 push press\n• 8 lateral raise\n• 10 rear delt fly\n• 12 front raise\n• Rest 2 min',
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
          duration: '12–15 min',
          description: 'Basic barbell shoulder press foundation\nwith light weight and perfect form.\n ',
          battlePlan: '• 3 rounds:\n• 10 standing barbell press\n• 12 upright rows\n• Rest 75s',
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
          duration: '10–12 min',
          description: 'Introductory barbell flow combining\npresses and rows for balance.\n ',
          battlePlan: '• 3 rounds:\n• 8 behind neck press (light)\n• 10 upright rows\n• 8 bent over rows\n• Rest 60s',
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
          duration: '15–18 min',
          description: 'Power press and upright row combination\nfor intermediate strength and size.\n ',
          battlePlan: '• 4 rounds:\n• 8 push press\n• 12 upright rows\n• 10 bent over rows\n• Rest 90s',
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
          duration: '12–15 min',
          description: 'Barbell shoulder circuit with minimal\nrest for conditioning and strength.\n ',
          battlePlan: '• 3 rounds:\n• 10 barbell press\n• 15 upright rows\n• 12 high pulls\n• Rest 90s',
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
          duration: '18–22 min',
          description: 'Advanced barbell complex with heavy\nloads for maximum shoulder development.\n ',
          battlePlan: '• 4 rounds:\n• 6 heavy push press\n• 8 behind neck press\n• 10 upright rows\n• 12 high pulls\n• Rest 2–3 min',
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
          duration: '16–20 min',
          description: 'High-intensity barbell power complex\nfor explosive shoulder strength.\n ',
          battlePlan: '• 3 rounds:\n• 5 heavy barbell press\n• 6 push press\n• 8 high pulls\n• 10 upright rows\n• Rest 2–3 min',
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
          duration: '12–15 min',
          description: 'Kettlebell shoulder foundation with\npresses and basic movement patterns.\n ',
          battlePlan: '• 3 rounds:\n• 8 kettlebell press (each arm)\n• 10 kettlebell swings\n• 8 halos (each direction)\n• Rest 60s',
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
          duration: '10–12 min',
          description: 'Gentle kettlebell flow building shoulder\nmobility and basic strength patterns.\n ',
          battlePlan: '• 3 rounds:\n• 6 around the world (each direction)\n• 8 overhead carries (20 steps)\n• 10 arm swings\n• Rest 45s',
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
          duration: '15–18 min',
          description: 'Double kettlebell pressing for increased\nstrength and core stability demands.\n ',
          battlePlan: '• 4 rounds:\n• 8 double KB press\n• 10 single arm swings (each)\n• 8 bottoms up press (each)\n• Rest 90s',
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
          duration: '12–15 min',
          description: 'Flowing kettlebell sequence combining\nstrength and dynamic movements.\n ',
          battlePlan: '• 3 rounds:\n• 6 clean and press (each)\n• 8 windmills (each)\n• 10 high pulls (each)\n• Rest 90s',
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
          duration: '18–22 min',
          description: 'Heavy kettlebell complex for advanced\nshoulder strength and power development.\n ',
          battlePlan: '• 4 rounds:\n• 5 heavy double KB press\n• 6 single arm jerks (each)\n• 8 bottoms up press (each)\n• 10 windmills (each)\n• Rest 2 min',
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
          duration: '16–20 min',
          description: 'High-intensity kettlebell power complex\nfor explosive shoulder development.\n ',
          battlePlan: '• 3 rounds:\n• 4 double KB clean and press\n• 5 single arm snatches (each)\n• 6 double KB swings\n• 8 Turkish get-up (partial)\n• Rest 2–3 min',
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
    equipment: 'Adjustable bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Angle Press',
          duration: '12–15 min',
          description: 'Seated angle press building foundation\nstrength across multiple pressing angles.\n ',
          battlePlan: '• 3 rounds:\n• 10 seated press (45°)\n• 12 lateral raises\n• 10 rear delt fly\n• Rest 60s',
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
          duration: '10–12 min',
          description: 'Adjustable bench flow targeting all\nthree deltoid heads systematically.\n ',
          battlePlan: '• 3 rounds:\n• 8 incline press (60°)\n• 10 lateral raise\n• 8 incline rear delt fly\n• Rest 60s',
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
          duration: '15–18 min',
          description: 'Arnold press and fly combination\nwith adjustable bench support angles.\n ',
          battlePlan: '• 4 rounds:\n• 10 Arnold press (45°)\n• 12 incline lateral raise\n• 10 chest-supported rear fly\n• Rest 90s',
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
          duration: '12–15 min',
          description: 'Seated shoulder circuit maximizing\nbench angles for complete development.\n ',
          battlePlan: '• 3 rounds:\n• 12 seated press (30°)\n• 15 lateral raise\n• 12 rear delt fly (45°)\n• 10 front raise\n• Rest 90s',
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
          duration: '18–22 min',
          description: 'Complete bench shoulder builder using\nall angles for maximum development.\n ',
          battlePlan: '• 4 rounds:\n• 8 heavy press (45°)\n• 10 Arnold press (30°)\n• 12 lateral raise\n• 10 rear fly (60°)\n• Rest 2 min',
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
          duration: '16–20 min',
          description: 'Shoulder giant set utilizing every\nbench angle for ultimate burnout.\n ',
          battlePlan: '• 3 rounds:\n• 6 press (15°)\n• 8 press (45°)\n• 10 press (75°)\n• 12 lateral raise\n• 15 rear fly\n• Rest 3 min',
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
    equipment: 'Platform / Step',
    icon: 'layers',
    workouts: {
      beginner: [
        {
          name: 'Press + Pull',
          duration: '12–15 min',
          description: 'Platform-assisted shoulder exercises\nbuilding pressing and pulling strength.\n ',
          battlePlan: '• 3 rounds:\n• 10 elevated push-ups (hands on platform)\n• 8 pike push-ups\n• 12 arm circles\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to platform-assisted shoulder training.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Elevated push-ups: Focus on shoulders',
              description: 'Higher hand position shifts emphasis to shoulder muscles.'
            },
            {
              icon: 'construct',
              title: 'Pike push-ups: Walk feet closer',
              description: 'Closer feet to hands increases shoulder activation significantly.'
            }
          ]
        },
        {
          name: 'Intro Flow',
          duration: '10–12 min',
          description: 'Overhead platform flow building\nshoulder mobility and basic strength.\n ',
          battlePlan: '• 3 rounds:\n• 8 overhead step-ups\n• 10 lateral step-ups (each side)\n• 6 pike walks\n• Rest 45s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Functional movement patterns using platform for progression.',
          moodTips: [
            {
              icon: 'body',
              title: 'Overhead step-ups: Full extension',
              description: 'Drive arms fully overhead while stepping up for complete activation.'
            },
            {
              icon: 'flash',
              title: 'Pike walks: Control the movement',
              description: 'Slow, controlled steps build shoulder stability and strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Base',
          duration: '15–18 min',
          description: 'Platform power movements building\nexplosive shoulder strength and stability.\n ',
          battlePlan: '• 4 rounds:\n• 8 decline push-ups (feet elevated)\n• 10 pike push-ups\n• 6 handstand progression\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate platform training for explosive shoulder development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Decline push-ups: Feet higher than hands',
              description: 'Elevated feet increases shoulder load significantly.'
            },
            {
              icon: 'construct',
              title: 'Handstand progression: Start with wall',
              description: 'Build confidence and strength gradually toward full handstand.'
            }
          ]
        },
        {
          name: 'Olympic Flow',
          duration: '12–15 min',
          description: 'Olympic-style platform movements\nfor dynamic shoulder coordination.\n ',
          battlePlan: '• 3 rounds:\n• 6 burpees (step onto platform)\n• 8 mountain climbers (hands on platform)\n• 10 bear crawl around platform\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Dynamic platform training for functional shoulder conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Burpees: Explosive step-up',
              description: 'Power through platform step for maximum shoulder activation.'
            },
            {
              icon: 'body',
              title: 'Bear crawl: Keep shoulders over wrists',
              description: 'Proper position builds incredible shoulder stability and strength.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Platform Max',
          duration: '18–22 min',
          description: 'Advanced platform complex for maximum\nshoulder strength and power development.\n ',
          battlePlan: '• 4 rounds:\n• 5 handstand push-ups (wall assisted)\n• 8 decline push-ups\n• 10 pike push-ups\n• 12 mountain climbers\n• Rest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced platform training for maximum shoulder development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Handstand push-ups: Perfect progression',
              description: 'Master wall-assisted before attempting freestanding versions.'
            },
            {
              icon: 'flash',
              title: 'High-intensity complex: Push limits',
              description: 'Challenge yourself while maintaining perfect form throughout.'
            }
          ]
        },
        {
          name: 'Power Max',
          duration: '16–20 min',
          description: 'Ultimate platform power complex\ncombining strength, power, and endurance.\n ',
          battlePlan: '• 3 rounds:\n• 3 freestanding handstand attempts\n• 5 archer push-ups (each side)\n• 8 single-arm burpees\n• 10 explosive push-ups\n• Rest 3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate platform challenge for elite shoulder development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Freestanding handstand: Balance and strength',
              description: 'Combines maximum strength with incredible shoulder stability.'
            },
            {
              icon: 'flash',
              title: 'Archer push-ups: Unilateral strength',
              description: 'Single-arm emphasis builds incredible unilateral shoulder power.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Resistance bands',
    icon: 'resize',
    workouts: {
      beginner: [
        {
          name: 'Band Basics',
          duration: '12–15 min',
          description: 'Resistance band foundation building\nshoulder stability and basic strength.\n ',
          battlePlan: '• 3 rounds:\n• 12 band pull-aparts\n• 10 overhead press\n• 8 lateral raises\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to resistance band shoulder training.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Pull-aparts: Squeeze shoulder blades',
              description: 'Focus on posterior deltoid activation and posture improvement.'
            },
            {
              icon: 'construct',
              title: 'Band tension: Start light and progress',
              description: 'Begin with lighter resistance to master movement patterns.'
            }
          ]
        },
        {
          name: 'Mobility Flow',
          duration: '10–12 min',
          description: 'Band-assisted shoulder mobility\nand activation for injury prevention.\n ',
          battlePlan: '• 3 rounds:\n• 10 band dislocations\n• 12 external rotations\n• 8 Y-raises\n• Rest 45s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Mobility-focused band work for shoulder health and activation.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Band dislocations: Slow and controlled',
              description: 'Focus on mobility, not speed, for safe shoulder movement.'
            },
            {
              icon: 'body',
              title: 'External rotations: Keep elbows at sides',
              description: 'Isolates rotator cuff muscles for stability and strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Band Power',
          duration: '15–18 min',
          description: 'Power-focused band training building\nexplosive shoulder strength and speed.\n ',
          battlePlan: '• 4 rounds:\n• 10 explosive pull-aparts\n• 12 band overhead press\n• 8 face pulls\n• 10 band rows\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate power training with progressive band resistance.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive movements: Maximum intent',
              description: 'Speed and power against band resistance builds functional strength.'
            },
            {
              icon: 'body',
              title: 'Face pulls: Pull to nose level',
              description: 'Target rear delts and improve posture with proper pulling angle.'
            }
          ]
        },
        {
          name: 'Band Flow',
          duration: '12–15 min',
          description: 'Flowing band resistance circuit\nfor shoulder conditioning and strength.\n ',
          battlePlan: '• 3 rounds:\n• 15 band pull-aparts\n• 12 lateral raises\n• 10 overhead press\n• 8 reverse fly\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'High-volume band circuit for intermediate conditioning.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Flow pace: Steady transitions',
              description: 'Maintain constant tension by moving smoothly between exercises.'
            },
            {
              icon: 'refresh',
              title: 'Band control: Resist the snap back',
              description: 'Controlled negative resistance maximizes muscle activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Band Max',
          duration: '18–22 min',
          description: 'Advanced band complex with maximum\ntension and volume for elite development.\n ',
          battlePlan: '• 4 rounds:\n• 20 explosive pull-aparts\n• 15 overhead press\n• 12 face pulls\n• 10 single-arm rows (each)\n• Rest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced band training for maximum resistance adaptation.',
          moodTips: [
            {
              icon: 'flash',
              title: 'High tension: Pre-stretch bands',
              description: 'Start with tension for constant muscle engagement throughout.'
            },
            {
              icon: 'trending-up',
              title: 'Volume progression: Add resistance',
              description: 'Double up bands or use heavier resistance for progression.'
            }
          ]
        },
        {
          name: 'Band Power',
          duration: '16–20 min',
          description: 'Ultimate band power complex\nfor explosive shoulder conditioning.\n ',
          battlePlan: '• 3 rounds:\n• Max explosive pull-aparts (30s)\n• 15 overhead press\n• 12 face pulls\n• 10 band punches\n• Rest 3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate band challenge for explosive shoulder power.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Timed sets: Maintain quality',
              description: 'Focus on form even during maximum effort periods.'
            },
            {
              icon: 'flash',
              title: 'Band punches: Full extension',
              description: 'Drive through chest and maintain core stability.'
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
          duration: '12–14 min',
          description: 'Machine rear delt flys and reverse\nflys for posterior chain activation.\n ',
          battlePlan: '• 3 rounds:\n• 12 rear delt fly\n• 10 reverse fly (chest supported)\n• Rest 60s',
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
          duration: '10–12 min',
          description: 'Rear delt strengthening circuit\nfor posture improvement and balance.\n ',
          battlePlan: '• 3 rounds:\n• 10 rear delt fly\n• 8 reverse fly\n• 6 face pulls (if available)\n• Rest 60–75s',
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
          duration: '16–18 min',
          description: 'Heavy-to-light rear delt pyramid\nfor posterior deltoid development.\n ',
          battlePlan: '• 4 rounds:\n• 12 light rear delt fly\n• 10 moderate rear delt fly\n• 8 heavy rear delt fly\n• Rest 75s',
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
          duration: '14–15 min',
          description: 'Rear delt pre-exhaustion with\ncompound movements for balance.\n ',
          battlePlan: '• 3 rounds:\n• 15 rear delt fly\n• 10 reverse fly (immediately after)\n• 8 face pulls\n• Rest 90s',
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
          battlePlan: '• 3 rounds:\n• 12 heavy rear delt fly\n• Drop → 15 moderate\n• Drop → 20 light\n• Rest 90–120s',
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
          duration: '15–18 min',
          description: 'Advanced rear delt complex with\nvariations for elite development.\n ',
          battlePlan: '• 2 rounds:\n• 25 rear delt fly\n• 20 reverse fly\n• 15 face pulls\n• Max single-arm fly\n• Rest 2–3 min',
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
    equipment: 'Cable machine',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Cable Basics',
          duration: '12–14 min',
          description: 'Cable shoulder foundation with\nlateral raises and face pulls.\n ',
          battlePlan: '• 3 rounds:\n• 10 cable lateral raise\n• 8 cable face pulls\n• 6 cable front raise\n• Rest 60–75s',
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
          duration: '12–14 min',
          description: 'Standing cable shoulder flow\nfor stability and coordination.\n ',
          battlePlan: '• 3 rounds:\n• 8 cable shoulder press\n• 10 single-arm cable raise\n• 8 cable reverse fly\n• Rest 60–75s',
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
          duration: '14–16 min',
          description: 'Multi-angle cable training hitting\nall deltoid heads systematically.\n ',
          battlePlan: '• 3 rounds:\n• 8 high cable raise\n• 8 mid cable raise\n• 8 low cable raise\n• 10 cable upright row\n• Rest 90s',
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
          duration: '14–16 min',
          description: 'Cable press and raise sequence\nfor shoulder hypertrophy focus.\n ',
          battlePlan: '• 3 rounds:\n• 8 cable shoulder press\n• 10 single-arm cable raise\n• 8 cable rear delt fly\n• Rest 90s',
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
          duration: '15–18 min',
          description: 'Advanced cable complex with\ndrop sets for maximum development.\n ',
          battlePlan: '• 3 rounds:\n• 8 heavy cable press\n• Drop → 10 moderate\n• Drop → 12 light\n• 8 cable face pulls\n• Rest 90–120s',
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
          duration: '16–18 min',
          description: 'Ultimate cable shoulder finisher\nfor elite shoulder development.\n ',
          battlePlan: '• 2 rounds:\n• 15 cable lateral raise\n• 12 cable front raise\n• 10 cable rear delt fly\n• 8 cable upright row\n• Rest 2–3 min',
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
    equipment: 'Suspension trainer',
    icon: 'link',
    workouts: {
      beginner: [
        {
          name: 'Suspension Intro',
          duration: '12–14 min',
          description: 'Suspension trainer shoulder foundation\nwith supported movements.\n ',
          battlePlan: '• 3 rounds:\n• 8 TRX chest press\n• 6 TRX Y-pulls\n• 8 TRX pike push-up\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to suspension trainer shoulder work.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Adjust body angle for difficulty',
              description: 'More upright = easier, more horizontal = harder.'
            },
            {
              icon: 'body',
              title: 'Keep core engaged',
              description: 'Suspension training requires constant core stabilization.'
            }
          ]
        },
        {
          name: 'TRX Flow',
          duration: '10–12 min',
          description: 'Flowing suspension sequence\nfor shoulder stability and strength.\n ',
          battlePlan: '• 3 rounds:\n• 6 TRX shoulder press\n• 8 TRX reverse fly\n• 6 TRX face pulls\n• Rest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Functional suspension training for shoulder stability.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Smooth controlled movements',
              description: 'Suspension trainers amplify any jerky or uncontrolled motion.'
            },
            {
              icon: 'fitness',
              title: 'Full body engagement',
              description: 'Every exercise becomes a full-body stabilization challenge.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'TRX Power',
          duration: '15–18 min',
          description: 'Suspension trainer power sequence\nfor functional shoulder strength.\n ',
          battlePlan: '• 4 rounds:\n• 8 TRX atomic push-up\n• 10 TRX Y-pulls\n• 6 TRX pike push-up\n• 8 TRX face pulls\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate suspension training for power development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Atomic push-ups: Control the knee drive',
              description: 'Drive knees to chest while maintaining push-up form.'
            },
            {
              icon: 'construct',
              title: 'Adjust angle for progression',
              description: 'Make movements harder by changing body position.'
            }
          ]
        },
        {
          name: 'TRX Circuit',
          duration: '12–15 min',
          description: 'High-intensity suspension circuit\nfor shoulder conditioning.\n ',
          battlePlan: '• 3 rounds:\n• 10 TRX chest press\n• 8 TRX reverse fly\n• 6 TRX handstand progression\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Dynamic suspension training for functional conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'High intensity: Maintain quality',
              description: 'Focus on form even during high-intensity circuits.'
            },
            {
              icon: 'body',
              title: 'Handstand prep: Start feet in straps',
              description: 'Use suspension trainer for supported handstand practice.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'TRX Elite',
          duration: '18–22 min',
          description: 'Advanced suspension complex\nfor elite shoulder stability and power.\n ',
          battlePlan: '• 4 rounds:\n• 6 TRX single-arm press\n• 8 TRX pistol squat + press\n• 10 TRX Y-pulls\n• 12 TRX mountain climbers\n• Rest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced suspension training for maximum functional development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Single-arm work: Ultimate stability challenge',
              description: 'Unilateral suspension training requires incredible core control.'
            },
            {
              icon: 'flash',
              title: 'Combination movements: Think coordination',
              description: 'Multi-plane movements build real-world strength patterns.'
            }
          ]
        },
        {
          name: 'TRX Max',
          duration: '16–20 min',
          description: 'Ultimate suspension challenge\nfor elite athletic development.\n ',
          battlePlan: '• 3 rounds:\n• Max TRX chest press (45s)\n• 10 TRX atomic push-up\n• 8 TRX single-arm row\n• 6 TRX handstand push-up\n• Rest 3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ultimate suspension challenge for elite athletes.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Timed sets: Maintain quality',
              description: 'Focus on form even during maximum effort periods.'
            },
            {
              icon: 'trending-up',
              title: 'Handstand push-ups: Master the progression',
              description: 'Use suspension trainer for supported handstand push-up practice.'
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
      'Dumbbells': 'barbell',
      'Barbells': 'barbell',
      'Kettlebells': 'fitness',
      'Adjustable bench': 'square',
      'Platform / Step': 'layers',
      'Resistance bands': 'resize',
      'Rear Delt Fly Machine': 'contract',
      'Cable machine': 'reorder-three',
      'Suspension trainer': 'link'
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
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 80,
  },
  progressStepActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  progressStepText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 80,
  },
  progressConnector: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 8,
    marginTop: 16,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    flex: 1,
  },
  workoutImageContainer: {
    height: 160,
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
    padding: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  workoutDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
  },
  intensityReason: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
    lineHeight: 18,
  },
  workoutDescriptionContainer: {
    flex: 1,
    marginBottom: 16,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 'auto',
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFD700',
    width: 10,
    height: 10,
    borderRadius: 5,
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