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
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          name: 'Circuit Challenge',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          name: 'Barbell Builder',
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
          name: 'Power Complex',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          name: 'Strength Flow',
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
          name: 'Strength Builder',
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
          name: 'Power Complex',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          name: 'Bench Builder',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          name: 'Power Builder',
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
          name: 'Platform Builder',
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
          name: 'Power Complex',
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
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
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
          name: 'Circuit Flow',
          duration: '12–15 min',
          description: 'High-volume band circuit targeting\nall shoulder muscles with minimal rest.\n ',
          battlePlan: '• 3 rounds:\n• 15 pull-aparts\n• 12 lateral raises\n• 10 overhead press\n• 15 rear delt flies\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'High-volume circuit for intermediate shoulder conditioning.',
          moodTips: [
            {
              icon: 'timer',
              title: 'High reps: Focus on muscle pump',
              description: 'Continuous tension from bands creates incredible muscle pump.'
            },
            {
              icon: 'trending-up',
              title: 'Progressive fatigue: Maintain form',
              description: 'Keep perfect technique even as muscles fatigue.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Band Complex',
          duration: '18–22 min',
          description: 'Advanced band complex utilizing\nmultiple resistance levels and angles.\n ',
          battlePlan: '• 4 rounds:\n• 12 heavy pull-aparts\n• 10 single-arm press\n• 8 archer pulls\n• 12 band dislocations\n• Rest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced band training for maximum shoulder development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Heavy bands: Challenge strength',
              description: 'Use thicker bands to provide significant resistance for growth.'
            },
            {
              icon: 'fitness',
              title: 'Single-arm work: Unilateral strength',
              description: 'Challenges core stability while building shoulder strength.'
            }
          ]
        },
        {
          name: 'Power Circuit',
          duration: '16–20 min',
          description: 'Maximum intensity band circuit\nfor explosive shoulder power development.\n ',
          battlePlan: '• 3 rounds:\n• 8 explosive overhead press\n• 10 speed pull-aparts\n• 6 single-arm snatches\n• 12 face pulls\n• 8 Y-T-W raises\n• Rest 2–3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity band training for elite shoulder development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive press: Maximum speed',
              description: 'Drive through band resistance with explosive intent.'
            },
            {
              icon: 'trending-up',
              title: 'Y-T-W raises: Perfect shoulder health',
              description: 'Targets all shoulder stabilizers for injury prevention and strength.'
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
          duration: '12–15 min',
          description: 'Rear deltoid machine foundation\nwith perfect form and control.\n ',
          battlePlan: '• 3 rounds:\n• 12 rear delt fly\n• 10 reverse pec dec\n• 8 face pulls (if available)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to rear deltoid machine training.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Seat adjustment: Handles at shoulder level',
              description: 'Proper height ensures optimal rear deltoid activation angle.'
            },
            {
              icon: 'body',
              title: 'Chest pad: Stay pressed against support',
              description: 'Prevents momentum and isolates rear deltoid muscles perfectly.'
            }
          ]
        },
        {
          name: 'Posture Builder',
          duration: '10–12 min',
          description: 'Rear deltoid and posture improvement\nfocusing on shoulder blade control.\n ',
          battlePlan: '• 3 rounds:\n• 15 light rear delt fly\n• 10 shoulder blade squeezes\n• 8 external rotations\n• Rest 45s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Posture-focused rear deltoid training for shoulder health.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Light weight: Focus on muscle activation',
              description: 'Rear delts respond better to lighter weight and perfect form.'
            },
            {
              icon: 'body',
              title: 'Squeeze holds: 2-second contractions',
              description: 'Hold peak contraction to maximize rear deltoid development.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Rear Delt Power',
          duration: '15–18 min',
          description: 'Power-focused rear deltoid training\nwith progressive loading patterns.\n ',
          battlePlan: '• 4 rounds:\n• 12 rear delt fly\n• 8 single-arm rear fly\n• 10 reverse fly holds (3s)\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate rear deltoid training with unilateral challenges.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Single-arm: Challenge stability',
              description: 'Unilateral work builds core stability and balanced strength.'
            },
            {
              icon: 'timer',
              title: '3-second holds: Time under tension',
              description: 'Extended contractions maximize rear deltoid muscle development.'
            }
          ]
        },
        {
          name: 'Fly Circuit',
          duration: '12–15 min',
          description: 'High-volume rear deltoid circuit\nfor muscle endurance and definition.\n ',
          battlePlan: '• 3 rounds:\n• 15 rear delt fly\n• 12 reverse pec dec\n• 10 high pulls\n• 15 light rear fly\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'High-volume circuit for intermediate rear deltoid conditioning.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Volume training: Focus on pump',
              description: 'High repetitions create incredible rear deltoid muscle pump.'
            },
            {
              icon: 'body',
              title: 'Form consistency: Maintain throughout',
              description: 'Perfect form on every rep builds better muscle patterns.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Rear Delt Builder',
          duration: '18–22 min',
          description: 'Advanced rear deltoid complex\nwith heavy loading and intensity techniques.\n ',
          battlePlan: '• 4 rounds:\n• 10 heavy rear delt fly\n• Drop to 12 moderate\n• Drop to 15 light\n• 8 single-arm fly\n• Rest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced drop set training for maximum rear deltoid development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy set: Challenge strength limits',
              description: 'Push rear deltoid strength while maintaining perfect form.'
            },
            {
              icon: 'speedometer',
              title: 'Drop sets: No rest between weights',
              description: 'Continuous tension maximizes rear deltoid hypertrophy.'
            }
          ]
        },
        {
          name: 'Power Complex',
          duration: '16–20 min',
          description: 'Maximum intensity rear deltoid complex\nfor elite shoulder development.\n ',
          battlePlan: '• 3 rounds:\n• 8 explosive rear fly\n• 6 single-arm explosive fly\n• 10 3-second holds\n• 12 speed flys\n• Rest 2–3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity training for elite rear deltoid development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive fly: Maximum speed',
              description: 'Power through the concentric for explosive rear deltoid development.'
            },
            {
              icon: 'construct',
              title: 'Speed vs. holds: Contrast training',
              description: 'Alternating fast and slow builds complete muscle development.'
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
          duration: '12–15 min',
          description: 'Cable shoulder foundation building\nbasic pressing and pulling patterns.\n ',
          battlePlan: '• 3 rounds:\n• 10 cable lateral raise\n• 8 cable front raise\n• 12 cable face pulls\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to cable shoulder training patterns.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Cable height: Adjust for target muscle',
              description: 'Low for front/lateral raises, high for face pulls and rear work.'
            },
            {
              icon: 'body',
              title: 'Constant tension: Control the negative',
              description: 'Cables provide constant resistance throughout entire range.'
            }
          ]
        },
        {
          name: 'Cable Flow',
          duration: '10–12 min',
          description: 'Flowing cable sequence targeting\nall three deltoid heads systematically.\n ',
          battlePlan: '• 3 rounds:\n• 8 low cable lateral raise\n• 8 mid cable front raise\n• 8 high cable rear fly\n• Rest 45s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Systematic cable training targeting all deltoid heads.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Height progression: Low to high',
              description: 'Start low cables, progress to high for complete deltoid training.'
            },
            {
              icon: 'flash',
              title: 'Smooth transitions: Flow between exercises',
              description: 'Quick setup changes maintain workout intensity and focus.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Cable Power',
          duration: '15–18 min',
          description: 'Power-focused cable training building\nexplosive shoulder strength and control.\n ',
          battlePlan: '• 4 rounds:\n• 10 single-arm cable press\n• 12 cable upright rows\n• 8 cable reverse fly\n• 10 cable shrugs\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate cable training with unilateral challenges.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Single-arm press: Engage core',
              description: 'Unilateral work challenges stability and builds functional strength.'
            },
            {
              icon: 'body',
              title: 'Upright rows: Keep elbows below hands',
              description: 'Safer pulling angle prevents shoulder impingement.'
            }
          ]
        },
        {
          name: 'Cable Circuit',
          duration: '12–15 min',
          description: 'High-volume cable circuit maximizing\nshoulder pump and conditioning.\n ',
          battlePlan: '• 3 rounds:\n• 15 cable lateral raise\n• 12 cable front raise\n• 15 cable face pulls\n• 10 cable overhead press\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'High-volume circuit for intermediate shoulder conditioning.',
          moodTips: [
            {
              icon: 'timer',
              title: 'High volume: Focus on muscle connection',
              description: 'Feel each deltoid head working throughout the circuit.'
            },
            {
              icon: 'flash',
              title: 'Continuous tension: Maximize pump',
              description: 'Cables provide constant resistance for incredible muscle pump.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Cable Complex',
          duration: '18–22 min',
          description: 'Advanced cable complex utilizing\nmultiple angles and resistance patterns.\n ',
          battlePlan: '• 4 rounds:\n• 8 heavy cable lateral raise\n• 6 single-arm cable snatch\n• 10 cable Y-raises\n• 8 cable Arnold press\n• Rest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced cable training for maximum shoulder development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Cable snatch: One explosive motion',
              description: 'Full-body power transfer through shoulders for explosive development.'
            },
            {
              icon: 'construct',
              title: 'Y-raises: Target upper traps and rear delts',
              description: 'Unique angle challenges often-neglected shoulder stabilizers.'
            }
          ]
        },
        {
          name: 'Power Circuit',
          duration: '16–20 min',
          description: 'Maximum intensity cable circuit\nfor explosive shoulder power development.\n ',
          battlePlan: '• 3 rounds:\n• 6 explosive cable press\n• 8 speed lateral raises\n• 5 single-arm cable cleans\n• 10 cable face pulls\n• 12 cable shrugs\n• Rest 2–3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity cable training for elite shoulder development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive press: Maximum speed and power',
              description: 'Drive through cable resistance with explosive intent.'
            },
            {
              icon: 'trending-up',
              title: 'Cable cleans: Hip drive to shoulder',
              description: 'Power transfer from lower body builds functional shoulder strength.'
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
          name: 'Suspension Basics',
          duration: '12–15 min',
          description: 'Suspension trainer shoulder foundation\nwith bodyweight resistance patterns.\n ',
          battlePlan: '• 3 rounds:\n• 8 TRX Y-pulls\n• 10 TRX T-pulls\n• 6 TRX pike push-ups\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to suspension trainer shoulder patterns.',
          moodTips: [
            {
              icon: 'body',
              title: 'Body angle: Adjust difficulty',
              description: 'Closer to vertical = easier, more horizontal = harder resistance.'
            },
            {
              icon: 'construct',
              title: 'Grip: Keep wrists straight',
              description: 'Strong wrist position transfers power effectively through arms.'
            }
          ]
        },
        {
          name: 'Stability Flow',
          duration: '10–12 min',
          description: 'Suspension stability flow building\nshoulder control and core integration.\n ',
          battlePlan: '• 3 rounds:\n• 6 TRX mountain climbers\n• 8 TRX push-ups (incline)\n• 10 TRX face pulls\n• Rest 45s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Stability-focused suspension training for shoulder-core integration.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Mountain climbers: Engage shoulders',
              description: 'Focus on shoulder stability while moving legs dynamically.'
            },
            {
              icon: 'body',
              title: 'Incline push-ups: Start conservative',
              description: 'Higher body angle makes movement easier while building strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Pulls',
          duration: '15–18 min',
          description: 'Power-focused suspension training\nwith dynamic pulling patterns.\n ',
          battlePlan: '• 4 rounds:\n• 8 TRX power pulls\n• 10 TRX atomic push-ups\n• 6 TRX handstand progression\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate suspension training for explosive shoulder development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Power pulls: Explosive concentric',
              description: 'Drive body up quickly, control the descent slowly.'
            },
            {
              icon: 'construct',
              title: 'Atomic push-ups: Combine upper and lower',
              description: 'Push-up plus knee tuck challenges entire core-shoulder system.'
            }
          ]
        },
        {
          name: 'Circuit Flow',
          duration: '12–15 min',
          description: 'High-intensity suspension circuit\nfor functional shoulder conditioning.\n ',
          battlePlan: '• 3 rounds:\n• 10 TRX rows\n• 8 TRX push-ups\n• 12 TRX Y-pulls\n• 6 TRX burpees\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'High-intensity circuit for intermediate functional conditioning.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Circuit pace: Maintain intensity',
              description: 'Quick transitions keep heart rate up and muscles challenged.'
            },
            {
              icon: 'body',
              title: 'TRX burpees: Full-body integration',
              description: 'Ultimate challenge combining strength, power, and endurance.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Suspension Builder',
          duration: '18–22 min',
          description: 'Advanced suspension complex for\nmaximum shoulder strength and stability.\n ',
          battlePlan: '• 4 rounds:\n• 6 TRX pistol squats (arms overhead)\n• 8 single-arm TRX rows\n• 5 TRX muscle-ups\n• 10 TRX face pulls\n• Rest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced suspension training for maximum functional development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Pistol squat + overhead: Ultimate challenge',
              description: 'Combines leg strength, shoulder stability, and balance.'
            },
            {
              icon: 'fitness',
              title: 'Single-arm rows: Unilateral strength',
              description: 'Challenges core stability while building shoulder strength.'
            }
          ]
        },
        {
          name: 'Power Complex',
          duration: '16–20 min',
          description: 'Maximum intensity suspension complex\nfor elite shoulder and core development.\n ',
          battlePlan: '• 3 rounds:\n• 4 TRX archer push-ups (each side)\n• 6 explosive TRX rows\n• 3 TRX handstand push-ups\n• 8 TRX power pulls\n• Rest 3 min',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum intensity training for elite suspension athlete development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Archer push-ups: Unilateral power',
              description: 'Single-arm emphasis builds incredible unilateral shoulder strength.'
            },
            {
              icon: 'construct',
              title: 'Handstand push-ups: Ultimate challenge',
              description: 'Inverted pressing with unstable suspension system = elite level.'
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

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="flame" size={12} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
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
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
    height: 420,
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
    padding: 20,
  },
  workoutHeader: {
    marginBottom: 12,
  },
  workoutTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
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
  workoutDuration: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
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
  },
  intensityReason: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginLeft: 8,
  },
  workoutDescriptionContainer: {
    maxHeight: 80,
    marginBottom: 16,
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
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
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
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});