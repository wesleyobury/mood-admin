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

// Chest workout database with all equipment types and MOOD tips
const chestWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Adjustable bench',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Adjustable Press Circuit',
          duration: '15-18 min',
          description: 'Perform 3 rounds:\n• 10 flat bench press\n• 10 incline bench press\n• 10 decline bench press (all light)\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxhZGp1c3RhYmxlJTIwYmVuY2h8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Perfect introduction to chest training with multiple angles and light resistance for learning proper form.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Adjust Angles Securely',
              description: 'Adjust angles securely before starting each set.'
            },
            {
              icon: 'body',
              title: 'Keep Feet Flat',
              description: 'Keep feet flat on ground for stable base throughout movement.'
            }
          ]
        },
        {
          name: 'Fly Flow',
          duration: '12-15 min',
          description: 'Perform 3 rounds:\n• 10 flat fly\n• 10 incline fly\n• 10 decline fly (all light)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxkdW1iYmVsbCUyMGZseXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Chest isolation work across different angles to develop muscle awareness and control.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Maintain Slight Elbow Bend',
              description: 'Maintain slight elbow bend throughout the movement arc.'
            },
            {
              icon: 'remove',
              title: 'Stop Arms Below Shoulder Line',
              description: 'Stop arms just below shoulder line to protect joints.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Angle Ladder',
          duration: '14-16 min',
          description: 'Perform 3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxiZW5jaCUyMHByZXNzfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Progressive chest development through varied angles with moderate intensity and controlled rest periods.',
          moodTips: [
            {
              icon: 'time',
              title: 'Minimize Downtime',
              description: 'Minimize downtime changing angles between exercises.'
            },
            {
              icon: 'resize',
              title: 'Use Full ROM',
              description: 'Use full range of motion with each position for maximum benefit.'
            }
          ]
        },
        {
          name: 'Bench Plyo Push-Ups',
          duration: '14-16 min',
          description: 'Perform 4 rounds:\n• 8 plyo push-ups (hands on bench, change angle each set)\n• 10 single-arm press (dumbbell or Smith)\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwbHlvJTIwcHVzaHVwfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Explosive power development combined with unilateral strength training for advanced chest conditioning.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rotate Bench Angles',
              description: 'Rotate bench angles: flat → incline → decline → flat for variety.'
            },
            {
              icon: 'fitness',
              title: 'Core Stability',
              description: 'Single-arm strengthens core stability and prevents imbalances.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Adjustable Complex',
          duration: '15-20 min',
          description: 'Perform 3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\n• 8 fly (choose angle)\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxjaGVzdCUyMHdvcmtvdXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Comprehensive chest complex targeting all angles with high volume and intensity for advanced trainees.',
          moodTips: [
            {
              icon: 'checkmark',
              title: 'Preset Bench',
              description: 'Preset bench beforehand for efficiency between exercises.'
            },
            {
              icon: 'body',
              title: 'Brace Spine',
              description: 'Brace spine on decline press to maintain proper positioning.'
            }
          ]
        },
        {
          name: 'Drop Set',
          duration: '16-20 min',
          description: 'Perform 2 rounds:\n• 10 heavy press (any angle)\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxkcm9wJTIwc2V0fGVufDB8fHx8TVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Advanced drop set protocol for maximum muscle fatigue and hypertrophy stimulus.',
          moodTips: [
            {
              icon: 'time',
              title: 'Controlled Tempo',
              description: 'Controlled, strict tempo throughout all weight changes.'
            },
            {
              icon: 'trending-up',
              title: 'Incline Safety',
              description: 'Incline often safest angle for heavy drop sets.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Cable Crossover',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Cable Fly Circuit',
          duration: '12-14 min',
          description: 'Perform 3 rounds:\n• 12 standing cable fly (light)\n• 10 low-to-high cable fly\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxjYWJsZSUyMGZseXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Introduction to cable training with smooth resistance curves and controlled movement patterns.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Arms Arc Movement',
              description: 'Arms arc movement, keep elbows soft throughout range.'
            },
            {
              icon: 'heart',
              title: 'Exhale While Squeezing',
              description: 'Exhale while squeezing chest muscles together at peak contraction.'
            }
          ]
        },
        {
          name: 'Cable Press Circuit',
          duration: '12-14 min',
          description: 'Perform 3 rounds:\n• 10 standing cable press\n• 10 single-arm cable press\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxjYWJsZSUyMHByZXNzfGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Basic cable pressing movements focusing on balance, stability, and unilateral strength development.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Stagger Stance',
              description: 'Stagger stance for better balance and stability during press.'
            },
            {
              icon: 'body',
              title: 'Keep Torso Still',
              description: 'Keep torso still on single-arm work to prevent rotation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Cable Fly Ladder',
          duration: '14-16 min',
          description: 'Perform 3 rounds:\n• 8 high-to-low fly\n• 8 low-to-high fly\n• 8 mid-cable fly\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYWJsZSUyMGxhZGRlcnxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Progressive cable fly variations targeting different areas of the chest through varied cable angles.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Adjust Pulleys Smoothly',
              description: 'Adjust pulleys smoothly between changes for workout flow.'
            },
            {
              icon: 'resize',
              title: 'Maintain ROM',
              description: 'Arms trace arcs; don\'t shorten range of motion under fatigue.'
            }
          ]
        },
        {
          name: 'Cable Press & Fly',
          duration: '14-16 min',
          description: 'Perform 3 rounds:\n• 10 cable press\n• 10 cable fly\n• 10 single-arm cable fly\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYWJsZSUyMGNvbXBsZXh8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Combined pressing and fly movements for comprehensive chest development with cable resistance.',
          moodTips: [
            {
              icon: 'heart',
              title: 'Hugging Motion',
              description: 'Hugging motion for press position, bring handles together at chest.'
            },
            {
              icon: 'fitness',
              title: 'Core Braced',
              description: 'Core braced, maintain steady breathing cadence throughout.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Cable Complex',
          duration: '15-18 min',
          description: 'Perform 3 rounds:\n• 8 high-to-low fly\n• 8 low-to-high fly\n• 8 cable press\n• 8 single-arm fly\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxjYWJsZSUyMGFkdmFuY2VkfGVufDB8fHx8TVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Advanced cable complex incorporating multiple fly angles and unilateral work for complete chest development.',
          moodTips: [
            {
              icon: 'checkmark',
              title: 'Preset Cable Heights',
              description: 'Preset cable heights for efficiency between exercise transitions.'
            },
            {
              icon: 'body',
              title: 'Prevent Swaying',
              description: 'Prevent swaying, brace core throughout all movements.'
            }
          ]
        },
        {
          name: 'Cable Drop Set',
          duration: '16-18 min',
          description: 'Perform 2 rounds:\n• 10 heavy fly\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxjYWJsZSUyMGRyb3AlMjBzZXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'High-intensity cable drop sets for maximum muscle fatigue and growth stimulus.',
          moodTips: [
            {
              icon: 'checkmark',
              title: 'Strict Form',
              description: 'Keep strict form under fatigue, don\'t compromise technique.'
            },
            {
              icon: 'heart',
              title: 'Peak Contraction',
              description: 'Squeeze chest peak contraction each rep, even when fatigued.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Chest Press Machine',
    icon: 'cog',
    workouts: {
      beginner: [
        {
          name: 'Press Circuit',
          duration: '12-14 min',
          description: 'Perform 3 rounds:\n• 12 light chest press\n• 10 close-grip press (narrow handles)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxjaGVzdCUyMHByZXNzJTIwbWFjaGluZXxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Machine-based chest training for beginners focusing on controlled movement and proper muscle activation.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Adjust Seat Height',
              description: 'Adjust seat so handles align with mid-chest for optimal pressing angle.'
            },
            {
              icon: 'hand-left',
              title: 'Don\'t Lock Elbows',
              description: 'Don\'t lock out elbows at top, maintain constant muscle tension.'
            }
          ]
        },
        {
          name: 'Press & Fly',
          duration: '12-14 min',
          description: 'Perform 3 rounds:\n• 10 chest press\n• 10 machine fly (if available)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxtYWNoaW5lJTIwZmx5fGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Basic machine workout combining pressing and fly movements for comprehensive chest development.',
          moodTips: [
            {
              icon: 'warning',
              title: 'Controlled Movement',
              description: 'Controlled movement, don\'t let plates crash during exercise.'
            },
            {
              icon: 'heart',
              title: 'Squeeze Chest',
              description: 'Squeeze chest together at top of fly for maximum contraction.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Drop Set',
          duration: '16-18 min',
          description: 'Perform 2 rounds:\n• 10 heavy chest press\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxtYWNoaW5lJTIwZHJvcCUyMHNldHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Machine drop sets allowing for quick weight changes and continued muscle stimulation under fatigue.',
          moodTips: [
            {
              icon: 'time',
              title: 'Minimal Rest',
              description: 'Minimal rest between weight changes for maximum effectiveness.'
            },
            {
              icon: 'refresh',
              title: 'Steady Tempo',
              description: 'Maintain steady tempo throughout all weight reductions.'
            }
          ]
        },
        {
          name: 'Ladder',
          duration: '14-16 min',
          description: 'Perform 3 rounds:\n• 8 wide grip\n• 8 neutral grip\n• 8 close grip\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxncmlwJTIwdmFyaWF0aW9ufGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Grip variation ladder targeting different areas of the chest through hand position changes.',
          moodTips: [
            {
              icon: 'resize',
              title: 'Grip Targeting',
              description: 'Wide = outer pecs, close = inner pecs for targeted development.'
            },
            {
              icon: 'body',
              title: 'Shoulders Down',
              description: 'Keep shoulders down and back throughout all grip variations.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Chest Press AMRAP',
          duration: '10 min',
          description: 'Max reps in 10 min chest press. Rest as needed.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHhhbXJhcCUyMGNoZXN0fGVufDB8fHx8TVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Maximum effort AMRAP protocol for advanced trainees seeking peak muscle endurance and growth.',
          moodTips: [
            {
              icon: 'time',
              title: 'Pace Yourself',
              description: 'Break into 10-15 rep chunks to pace and avoid early burnout.'
            },
            {
              icon: 'refresh',
              title: 'Steady Breathing',
              description: 'Steady breathing; maintain rhythm throughout the challenge.'
            }
          ]
        },
        {
          name: 'Chest Press Complex',
          duration: '15-18 min',
          description: 'Perform 3 rounds:\n• 8 wide grip press\n• 8 close grip press\n• 8 single-arm press (if machine allows)\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxjb21wbGV4JTIwY2hlc3R8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Advanced machine complex incorporating grip variations and unilateral work for comprehensive development.',
          moodTips: [
            {
              icon: 'body',
              title: 'Torso Position',
              description: 'Keep torso glued to seat pad for stability and safety.'
            },
            {
              icon: 'refresh',
              title: 'No Twisting',
              description: 'Don\'t twist torso on single-arm pressing, maintain alignment.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Decline bench',
    icon: 'trending-down',
    workouts: {
      beginner: [
        {
          name: 'Decline Push-Up Circuit',
          duration: '10-12 min',
          description: 'Perform 3 rounds:\n• 8 decline push-ups (feet on bench)\n• 10 decline bench press (light)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxkZWNsaW5lJTIwcHVzaHVwfGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Introduction to decline angle training targeting lower chest with bodyweight and light resistance.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Core Engaged',
              description: 'Core engaged, no hip sag during decline movements.'
            },
            {
              icon: 'remove',
              title: 'Bar Path',
              description: 'Bar path targets lower chest line for optimal muscle activation.'
            }
          ]
        },
        {
          name: 'Decline Chest Press',
          duration: '12-15 min',
          description: 'Perform 3 rounds:\n• 12 decline press (light)\n• 10 decline dumbbell fly (light)\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxkZWNsaW5lJTIwcHJlc3N8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Basic decline pressing and fly combination for lower chest development with controlled tempo.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Bench Angle',
              description: 'Bench angle 20-30° for optimal decline positioning and safety.'
            },
            {
              icon: 'hand-left',
              title: 'Control Descent',
              description: 'Fly: control descent, don\'t let weights drop too low.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Decline Plyo Push-Ups',
          duration: '14-15 min',
          description: 'Perform 4 rounds:\n• 6 explosive decline push-ups\n• 10 single-arm decline press (dumbbells/Smith)\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxkZWNsaW5lJTIwcGx5b3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Explosive decline push-ups combined with unilateral pressing for power and stability development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive Press',
              description: 'Explosive press up from decline; land soft and controlled.'
            },
            {
              icon: 'fitness',
              title: 'Core Tight',
              description: 'Core tight on one-arm sets to prevent rotation and maintain form.'
            }
          ]
        },
        {
          name: 'Decline Chest Flow',
          duration: '12-15 min',
          description: 'Perform 3 rounds:\n• 10 decline bench press\n• 10 decline fly\n• 10 close-grip decline press\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxkZWNsaW5lJTIwZmxvd3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Flowing decline chest sequence targeting multiple muscle areas with continuous tension.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Maintain Flow',
              description: 'Maintain steady flow between exercises for maximum effectiveness.'
            },
            {
              icon: 'hand-left',
              title: 'Tuck Elbows',
              description: 'Tuck elbows in close-grip to emphasize triceps involvement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Decline Complex',
          duration: '15-18 min',
          description: 'Perform 3 rounds:\n• 8 decline press\n• 8 decline fly\n• 8 decline plyo push-ups (feet elevated)\n• 8 dips\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxkZWNsaW5lJTIwY29tcGxleHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Advanced decline complex combining pressing, fly, explosive, and dip movements for complete development.',
          moodTips: [
            {
              icon: 'heart',
              title: 'Chest Squeeze',
              description: 'Strong chest squeeze each rep, focus on muscle contraction.'
            },
            {
              icon: 'warning',
              title: 'Protect Shoulders',
              description: 'Protect shoulders, don\'t dip below 90° to avoid impingement.'
            }
          ]
        },
        {
          name: 'Decline Drop Set',
          duration: '16-20 min',
          description: 'Perform 2 rounds:\n• 10 heavy decline bench press\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxkZWNsaW5lJTIwZHJvcCUyMHNldHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'High-intensity decline drop sets for maximum lower chest stimulation and growth.',
          moodTips: [
            {
              icon: 'people',
              title: 'Spotter Recommended',
              description: 'Spotter recommended for safety during heavy decline work.'
            },
            {
              icon: 'remove',
              title: 'Control Bar Path',
              description: 'Control bar path on decline angle, maintain proper trajectory.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Dip Station',
    icon: 'triangle',
    workouts: {
      beginner: [
        {
          name: 'Assisted Dip Circuit',
          duration: '12-14 min',
          description: 'Perform 3 rounds:\n• 8 assisted dips (band or partner aid)\n• 10 bench dips\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxhc3Npc3RlZCUyMGRpcHN8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Beginner-friendly dip progression using assistance to build strength and proper movement patterns.',
          moodTips: [
            {
              icon: 'body',
              title: 'Shoulders Depressed',
              description: 'Shoulders depressed; avoid shrugging up during movement.'
            },
            {
              icon: 'trending-down',
              title: 'Lower Slowly',
              description: 'Lower slowly, especially under band tension for control.'
            }
          ]
        },
        {
          name: 'Dip & Push-Up Flow',
          duration: '10-12 min',
          description: 'Perform 3 rounds:\n• 8 dips\n• 10 push-ups\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxkaXAlMjBwdXNodXB8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Combination of dips and push-ups for comprehensive upper body and chest development.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Elbows Tucked',
              description: 'Elbows tucked at 45° angle for joint safety and muscle targeting.'
            },
            {
              icon: 'resize',
              title: 'Strict Depth',
              description: 'Maintain strict depth, no partial reps for maximum benefit.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Dip Ladder',
          duration: '14-15 min',
          description: 'Perform 3 rounds:\n• 10 bodyweight dips\n• 8 dips (feet elevated)\n• 6 dips with slow negatives\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxkaXAlMjBsYWRkZXJ8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Progressive dip variations increasing difficulty and time under tension for strength development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'No Swinging',
              description: 'Move through range without swinging, maintain control throughout.'
            },
            {
              icon: 'time',
              title: 'Time Under Tension',
              description: 'Time under tension builds tendon strength and resilience.'
            }
          ]
        },

        {
          name: 'Dip & Plyo Push-Ups',
          duration: '15 min',
          description: 'Perform 3 rounds:\n• 8 dips\n• 8 plyo push-ups\n• 8 dips\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxkaXAlMjBwbHlvfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Power-focused workout combining controlled dips with explosive push-up variations.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explode Up',
              description: 'Explode up, land soft in push-ups for joint protection.'
            },
            {
              icon: 'warning',
              title: 'Shoulder Safety',
              description: 'Don\'t dip lower than shoulders at 90° to protect joints.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Dip AMRAP',
          duration: '10 min',
          description: 'Complete as many dips as possible in 10 min (add weight if able).',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHx3ZWlnaHRlZCUyMGRpcHN8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Maximum effort challenge for advanced trainees with optional weight loading for increased difficulty.',
          moodTips: [
            {
              icon: 'time',
              title: 'Pace Sets',
              description: 'Pace sets, take small breaks every 5-10 reps to maintain quality.'
            },
            {
              icon: 'body',
              title: 'Lock Shoulders',
              description: 'Keep shoulders locked in down/back position throughout.'
            }
          ]
        },
        {
          name: 'Dip Complex',
          duration: '15-18 min',
          description: 'Perform 3 rounds:\n• 8 dips\n• 8 push-ups\n• 8 plyo push-ups\n• 8 slow negative dips\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc2fHxkaXAlMjBjb21wbGV4fGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Comprehensive advanced dip complex targeting strength, power, and muscle control.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Core Braced',
              description: 'Core braced, no hip sag throughout all movements.'
            },
            {
              icon: 'trending-down',
              title: 'Negatives Build Resilience',
              description: 'Negatives build resilience and eccentric strength.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Flat bench',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Bench Push-Up Circuit',
          duration: '10-12 min',
          description: 'Perform 3 rounds:\n• 10 push-ups (hands on bench)\n• 10 bench dips\n• Rest 60s after each round',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxmbGF0JTIwYmVuY2glMjBwdXNodXB8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Perfect introduction to bench training using bodyweight movements and basic bench exercises.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Push-ups Form',
              description: 'Push-ups: lower chest to bench edge; keep elbows at 45° angle.'
            },
            {
              icon: 'body',
              title: 'Dip Technique',
              description: 'Dips: keep shoulders down and back; avoid shrugging shoulders up.'
            }
          ]
        },
        {
          name: 'Bench Chest Press',
          duration: '12-15 min',
          description: 'Perform 3 rounds:\n• 12 dumbbell or Smith machine bench press (light)\n• 10 dumbbell bench fly (light)\n• Rest 60-75s after each round',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxmbGF0JTIwYmVuY2glMjBwcmVzc3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Basic flat bench pressing and fly combination for fundamental chest strength and muscle development.',
          moodTips: [
            {
              icon: 'body',
              title: 'Bench Press Setup',
              description: 'Bench press: feet flat on ground, shoulder blades pinched together.'
            },
            {
              icon: 'hand-left',
              title: 'Fly Technique',
              description: 'Fly: maintain soft elbow bend; avoid overstretch at bottom.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Bench Plyo Push-Ups',
          duration: '14-16 min',
          description: 'Perform 4 rounds:\n• 8 explosive push-ups (hands on bench)\n• 10 single-arm bench press (dumbbell or Smith)\n• Rest 60-75s after each round',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxmbGF0JTIwYmVuY2glMjBwbHlvfGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Explosive push-up variations combined with unilateral pressing for power and stability development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plyo Landing',
              description: 'Plyo push-ups: land soft with controlled form, keep elbows tucked.'
            },
            {
              icon: 'fitness',
              title: 'Core Brace',
              description: 'Single-arm press: brace core strongly to prevent torso rotation.'
            }
          ]
        },
        {
          name: 'Bench Chest Flow',
          duration: '12-15 min',
          description: 'Perform 3 rounds:\n• 10 bench press\n• 10 bench fly\n• 10 close-grip press\n• Rest 90s after each round',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxmbGF0JTIwYmVuY2glMjBmbG93fGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Flowing chest sequence combining pressing, fly, and close-grip variations for comprehensive development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Seamless Movement',
              description: 'Move seamlessly between exercises; minimize rest within the flow.'
            },
            {
              icon: 'hand-left',
              title: 'Close-Grip Focus',
              description: 'Close-grip: elbows tucked close to emphasize triceps activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Bench Complex',
          duration: '15-18 min',
          description: 'Perform 3 rounds:\n• 8 bench press\n• 8 bench fly\n• 8 plyo push-ups (hands on bench)\n• 8 dips\n• Rest 90s after each round',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxmbGF0JTIwYmVuY2glMjBjb21wbGV4fGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Advanced flat bench complex combining pressing, fly, explosive, and dip movements for complete chest development.',
          moodTips: [
            {
              icon: 'body',
              title: 'Scapula Position',
              description: 'Keep scapula pinned to bench throughout all exercises.'
            },
            {
              icon: 'flash',
              title: 'Controlled Explosion',
              description: 'Explode in plyo push-ups; focus on controlled landings.'
            }
          ]
        },
        {
          name: 'Bench Drop Set',
          duration: '16-20 min',
          description: 'Perform 2 rounds:\n• 10 heavy bench press\n• Drop → 10 moderate weight\n• Drop → 10 light weight\n• Rest 90-120s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxmbGF0JTIwYmVuY2glMjBkcm9wJTIwc2V0fGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'High-intensity flat bench drop sets for maximum muscle fatigue and hypertrophy stimulus.',
          moodTips: [
            {
              icon: 'time',
              title: 'Quick Transitions',
              description: 'No more than 5-10s rest between drops for maximum effectiveness.'
            },
            {
              icon: 'body',
              title: 'Control Tempo',
              description: 'Control tempo throughout; avoid rib flare during heavy sets.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Incline bench',
    icon: 'trending-up',
    workouts: {
      beginner: [
        {
          name: 'Incline Push-Up Circuit',
          duration: '10-12 min',
          description: 'Perform 3 rounds:\n• 10 incline push-ups (hands on bench)\n• 10 incline bench press (light dumbbells or Smith)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxpbmNsaW5lJTIwcHVzaHVwfGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Introduction to incline training targeting upper chest with bodyweight and light resistance movements.',
          moodTips: [
            {
              icon: 'body',
              title: 'Body Alignment',
              description: 'Body in straight line; avoid hip sag during incline movements.'
            },
            {
              icon: 'trending-up',
              title: 'Upper Chest Target',
              description: 'Press bar/bells to upper chest line for optimal muscle activation.'
            }
          ]
        },
        {
          name: 'Incline Chest Press',
          duration: '12-15 min',
          description: 'Perform 3 rounds:\n• 12 incline bench press (light)\n• 10 incline dumbbell fly (light)\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxpbmNsaW5lJTIwcHJlc3N8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Basic incline pressing and fly combination for upper chest development with proper angle targeting.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Bench Angle',
              description: 'Keep bench around 30° incline for optimal pec focus and comfort.'
            },
            {
              icon: 'refresh',
              title: 'Peak Contraction',
              description: 'Exhale and squeeze chest muscles at top of each rep.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Incline Plyo Push-Ups',
          duration: '14-16 min',
          description: 'Perform 4 rounds:\n• 8 incline plyo push-ups\n• 10 single-arm incline press (dumbbell or Smith)\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxpbmNsaW5lJTIwcGx5b3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Explosive incline movements combined with unilateral pressing for upper chest power and stability.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Soft Landing',
              description: 'Land soft on plyo push-ups to protect wrists and shoulders.'
            },
            {
              icon: 'fitness',
              title: 'Oblique Engagement',
              description: 'Brace obliques on single-arm presses to prevent rotation.'
            }
          ]
        },
        {
          name: 'Incline Chest Flow',
          duration: '12-15 min',
          description: 'Perform 3 rounds:\n• 10 incline bench press\n• 10 incline fly\n• 10 close-grip incline press\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxpbmNsaW5lJTIwZmxvd3xlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Continuous incline chest flow targeting upper pecs through varied grip and movement patterns.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Maintain Rhythm',
              description: 'Flow nonstop between exercises, maintain steady rhythm throughout.'
            },
            {
              icon: 'hand-left',
              title: 'Close-Grip Position',
              description: 'Keep elbows tucked in close during close-grip variation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Incline Complex',
          duration: '15-18 min',
          description: 'Perform 3 rounds:\n• 8 incline bench press\n• 8 incline fly\n• 8 incline plyo push-ups (hands on bench)\n• 8 dips\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxpbmNsaW5lJTIwY29tcGxleHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Advanced incline complex incorporating pressing, fly, explosive, and dip movements for complete upper chest development.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Control Eccentric',
              description: 'Control eccentric tempo on all movements for maximum benefit.'
            },
            {
              icon: 'body',
              title: 'Hip Absorption',
              description: 'Use hips to absorb plyo landing and protect lower back.'
            }
          ]
        },
        {
          name: 'Incline Drop Set',
          duration: '16-20 min',
          description: 'Perform 2 rounds:\n• 10 heavy incline press\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxpbmNsaW5lJTIwZHJvcCUyMHNldHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'High-intensity incline drop sets for maximum upper chest stimulation and muscle growth.',
          moodTips: [
            {
              icon: 'people',
              title: 'Spotter Recommended',
              description: 'Spotter strongly recommended for safety during heavy incline work.'
            },
            {
              icon: 'trending-down',
              title: 'Focus on Negatives',
              description: 'Focus on slow negative phase under lighter loads for control.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Pec Deck',
    icon: 'albums',
    workouts: {
      beginner: [
        {
          name: 'Pec Deck Circuit',
          duration: '12-14 min',
          description: 'Perform 3 rounds:\n• 12 pec deck fly (light)\n• 10 rear delt fly (light)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxwZWMlMjBkZWNrfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Introduction to pec deck training focusing on chest isolation and rear delt balance.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Seat Height',
              description: 'Seat height so arms are level with chest for optimal angle.'
            },
            {
              icon: 'time',
              title: 'Hold Contraction',
              description: 'Hold 1 second at the peak contraction for maximum benefit.'
            }
          ]
        },
        {
          name: 'Pec Deck Hold',
          duration: '10-12 min',
          description: 'Perform 3 rounds:\n• 10 pec fly with 2s hold at peak contraction\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxwZWMlMjBkZWNrJTIwaG9sZHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Isometric holds for increased muscle tension and chest muscle awareness development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Control Both Directions',
              description: 'Control both concentric and eccentric phases of movement.'
            },
            {
              icon: 'body',
              title: 'Chest Lifted',
              description: 'Keep chest lifted and avoid rounding shoulders forward.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Drop Set',
          duration: '16-18 min',
          description: 'Perform 2 rounds:\n• 10 heavy pec fly\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxwZWMlMjBkZWNrJTIwZHJvcHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Progressive drop sets allowing for extended muscle fatigue and increased training volume.',
          moodTips: [
            {
              icon: 'warning',
              title: 'Avoid Overload',
              description: 'Avoid overload if losing chest control; maintain proper form.'
            },
            {
              icon: 'body',
              title: 'Shoulders Down',
              description: 'Keep shoulders down; avoid trap muscle takeover during fatigue.'
            }
          ]
        },
        {
          name: 'Ladder',
          duration: '14-15 min',
          description: 'Perform 3 rounds:\n• 8 wide grip fly\n• 8 neutral grip\n• 8 close grip fly\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwZWMlMjBkZWNrJTIwbGFkZGVyfGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Grip variation ladder targeting different chest areas through varied hand positions and ranges.',
          moodTips: [
            {
              icon: 'resize',
              title: 'Range Variation',
              description: 'Wide = deep stretch, close = hard contraction for complete development.'
            },
            {
              icon: 'refresh',
              title: 'Consistent Control',
              description: 'Maintain consistent control on both concentric and eccentric phases.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Pec Deck AMRAP',
          duration: '10 min',
          description: 'As many reps as possible pec fly in 10 min.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxwZWMlMjBkZWNrJTIwYW1yYXB8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Maximum rep challenge for advanced trainees seeking peak muscle endurance and volume.',
          moodTips: [
            {
              icon: 'time',
              title: 'Break Sets',
              description: 'Break sets into 10-15 reps to maintain quality throughout challenge.'
            },
            {
              icon: 'body',
              title: 'Scap Control',
              description: 'Maintain scapular control throughout all repetitions.'
            }
          ]
        },
        {
          name: 'Pec Deck Complex',
          duration: '15-18 min',
          description: 'Perform 3 rounds:\n• 8 pec fly\n• 8 rear delt fly\n• 8 single-arm fly (if machine allows)\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxwZWMlMjBkZWNrJTIwY29tcGxleHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Advanced pec deck complex combining chest fly, rear delt work, and unilateral training.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Core Braced',
              description: 'Core braced to prevent torso twist during movements.'
            },
            {
              icon: 'refresh',
              title: 'Smooth Alternation',
              description: 'Alternate sides smoothly in single-arm work for stability.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Smith Machine',
    icon: 'grid',
    workouts: {
      beginner: [
        {
          name: 'Smith Chest Press',
          duration: '12-14 min',
          description: 'Perform 3 rounds:\n• 10 flat Smith machine press (light)\n• 10 incline Smith machine press (light)\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzbWl0aCUyMG1hY2hpbmV8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Safe introduction to barbell pressing using Smith machine for guided movement and confidence building.',
          moodTips: [
            {
              icon: 'settings',
              title: 'Bar Position',
              description: 'Set bench so bar tracks mid-chest for optimal pressing angle.'
            },
            {
              icon: 'shield',
              title: 'Use Stoppers',
              description: 'Use safety stoppers for extra protection during training.'
            }
          ]
        },
        {
          name: 'Push-Up Circuit',
          duration: '10-12 min',
          description: 'Perform 3 rounds:\n• 8 push-ups (hands on bar; adjust height for difficulty)\n• 10 close-grip Smith press\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxzbWl0aCUyMHB1c2h1cHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Progressive push-up variations using Smith machine bar height adjustments for scalable difficulty.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Progress Difficulty',
              description: 'Lower bar placement each round to progress intensity level.'
            },
            {
              icon: 'hand-left',
              title: 'Wrist Alignment',
              description: 'Close-grip press: keep wrists stacked over elbows for safety.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Smith Angle Ladder',
          duration: '14-15 min',
          description: 'Perform 3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxzbWl0aCUyMGFuZ2xlfGVufDB8fHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Multi-angle Smith machine training for comprehensive chest development across all pressing planes.',
          moodTips: [
            {
              icon: 'resize',
              title: 'Full ROM',
              description: 'Use full range of motion at every angle for maximum benefit.'
            },
            {
              icon: 'checkmark',
              title: 'Preset Positions',
              description: 'Preset bench positions for quicker changes between angles.'
            }
          ]
        },
        {
          name: 'Smith Plyo Push-Ups',
          duration: '14-16 min',
          description: 'Perform 4 rounds:\n• 8 explosive push-ups (hands on bar, adjust height each set)\n• 10 single-arm press\n• Rest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzbWl0aCUyMHBseW98ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Explosive push-up progression with unilateral Smith machine pressing for power and stability.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Height Adjustment',
              description: 'Higher bar easier, lower bar harder for progressive difficulty.'
            },
            {
              icon: 'fitness',
              title: 'Core Stability',
              description: 'Single-arm presses demand strong core stability and control.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Smith Complex',
          duration: '15-18 min',
          description: 'Perform 3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\n• 8 close-grip press\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxzbWl0aCUyMGNvbXBsZXh8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Comprehensive Smith machine complex targeting all chest areas through varied angles and grips.',
          moodTips: [
            {
              icon: 'checkmark',
              title: 'Controlled Track',
              description: 'Controlled bar track ensures safe heavy flow and consistent form.'
            },
            {
              icon: 'body',
              title: 'Avoid Arch',
              description: 'Brace abs strongly; don\'t arch back excessively during pressing.'
            }
          ]
        },
        {
          name: 'Smith Drop Set',
          duration: '16-20 min',
          description: 'Perform 2 rounds:\n• 10 heavy press (any angle)\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw2fHxzbWl0aCUyMGRyb3AlMjBzZXR8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
          intensityReason: 'Advanced Smith machine drop sets for maximum muscle fatigue with built-in safety features.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Smooth Transitions',
              description: 'Execute smooth transitions between weight changes for flow.'
            },
            {
              icon: 'checkmark',
              title: 'Strict Form',
              description: 'Maintain strict form; avoid bouncing reps during fatigue.'
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

export default function ChestWorkoutDisplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const moodTitle = params.mood as string || 'Muscle gainer';
  const bodyPart = params.bodyPart as string || 'Chest';
  const selectedEquipmentParam = params.selectedEquipment as string || '';
  const selectedDifficultyParam = params.selectedDifficulty as string || '';

  const selectedEquipmentList = selectedEquipmentParam.split(',').filter(Boolean);
  const selectedDifficulty = selectedDifficultyParam.toLowerCase();

  // Get difficulty color (matching the cardio path)
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return '#FFD700';
      case 'intermediate': return '#FFD700';  
      case 'advanced': return '#FFD700';
      default: return '#FFD700';
    }
  };

  const difficultyColor = getDifficultyColor(selectedDifficulty);

  // Filter and organize workouts exactly like the cardio path
  const filteredEquipment = chestWorkoutDatabase.filter(equipmentGroup => {
    return selectedEquipmentList.some(selected => 
      equipmentGroup.equipment.toLowerCase().includes(selected.toLowerCase()) ||
      selected.toLowerCase().includes(equipmentGroup.equipment.toLowerCase())
    );
  }).map(equipmentGroup => ({
    ...equipmentGroup,
    workouts: {
      ...equipmentGroup.workouts,
      [selectedDifficulty]: equipmentGroup.workouts[selectedDifficulty as keyof typeof equipmentGroup.workouts] || []
    }
  }));

  const handleStartWorkout = (workout: Workout) => {
    const moodTipsParam = encodeURIComponent(JSON.stringify(workout.moodTips));
    
    router.push({
      pathname: '/workout-guidance',
      params: {
        workoutName: workout.name,
        equipment: 'Chest Training',
        description: workout.description,
        duration: workout.duration,
        workoutType: 'Chest Building',
        moodTips: moodTipsParam,
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (filteredEquipment.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>No Workouts Found</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.noWorkoutsContainer}>
          <Ionicons name="fitness" size={64} color="#333" />
          <Text style={styles.noWorkoutsTitle}>No Matching Workouts</Text>
          <Text style={styles.noWorkoutsText}>
            We couldn't find chest workouts for your selected criteria. Try different equipment or difficulty options.
          </Text>
          <TouchableOpacity style={styles.goBackButton} onPress={handleBack}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Chest Workouts</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressContent}
        >
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="barbell" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="shield" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{bodyPart}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {workoutsByEquipment.map(({ equipment, icon }, index) => (
            <React.Fragment key={equipment}>
              <View style={styles.progressStep}>
                <View style={styles.progressStepActive}>
                  <Ionicons name={icon} size={12} color="#000000" />
                </View>
                <Text style={styles.progressStepText}>{equipment}</Text>
              </View>
              {index < workoutsByEquipment.length - 1 && <View style={styles.progressConnector} />}
            </React.Fragment>
          ))}
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="checkmark" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{selectedDifficultyParam}</Text>
          </View>
        </ScrollView>
      </View>

      {/* Workout Cards */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>
          {workoutsByEquipment.length} equipment type{workoutsByEquipment.length > 1 ? 's' : ''} with personalized chest workouts
        </Text>

        {workoutsByEquipment.map((equipmentData, equipmentIndex) => {
          const currentWorkout = equipmentData.workouts[workoutIndices[equipmentData.equipment] || 0];
          const totalWorkouts = equipmentData.workouts.length;
          
          const handleNextWorkout = () => {
            setWorkoutIndices(prev => ({
              ...prev,
              [equipmentData.equipment]: ((prev[equipmentData.equipment] || 0) + 1) % totalWorkouts
            }));
          };

          const handlePrevWorkout = () => {
            setWorkoutIndices(prev => ({
              ...prev,
              [equipmentData.equipment]: ((prev[equipmentData.equipment] || 0) - 1 + totalWorkouts) % totalWorkouts
            }));
          };

          return (
            <View key={equipmentData.equipment} style={styles.equipmentSection}>
              <View style={styles.equipmentHeader}>
                <View style={styles.equipmentTitleContainer}>
                  <Ionicons name={equipmentData.icon} size={24} color="#FFD700" />
                  <Text style={styles.equipmentTitle}>{equipmentData.equipment}</Text>
                </View>
                {totalWorkouts > 1 && (
                  <View style={styles.workoutNav}>
                    <TouchableOpacity onPress={handlePrevWorkout} style={styles.navButton}>
                      <Ionicons name="chevron-back" size={20} color="#FFD700" />
                    </TouchableOpacity>
                    <Text style={styles.workoutCounter}>
                      {(workoutIndices[equipmentData.equipment] || 0) + 1}/{totalWorkouts}
                    </Text>
                    <TouchableOpacity onPress={handleNextWorkout} style={styles.navButton}>
                      <Ionicons name="chevron-forward" size={20} color="#FFD700" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              
              <View style={styles.workoutCard}>
                <Image source={{ uri: currentWorkout.imageUrl }} style={styles.workoutImage} />
                
                <View style={styles.workoutInfo}>
                  <View style={styles.workoutHeader}>
                    <View style={styles.workoutTitleContainer}>
                      <Text style={styles.workoutName}>{currentWorkout.name}</Text>
                      <View style={styles.equipmentBadgeContainer}>
                        <View style={styles.bodyPartBadge}>
                          <Text style={styles.bodyPartText}>{bodyPart}</Text>
                        </View>
                        <View style={styles.difficultyBadge}>
                          <Text style={styles.difficultyText}>{selectedDifficultyParam}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.workoutMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={16} color="#FFD700" />
                      <Text style={styles.metaText}>{currentWorkout.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="shield" size={16} color="#FFD700" />
                      <Text style={styles.metaText}>Chest Focus</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name={equipmentData.icon} size={16} color="#FFD700" />
                      <Text style={styles.metaText}>{equipmentData.equipment}</Text>
                    </View>
                  </View>

                  <Text style={styles.intensityReason}>{currentWorkout.intensityReason}</Text>

                  <TouchableOpacity 
                    style={styles.startButton}
                    onPress={() => handleStartWorkout(currentWorkout)}
                  >
                    <Text style={styles.startButtonText}>Start Workout</Text>
                    <Ionicons name="play" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
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
    paddingHorizontal: 10,
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
  progressStepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressStepNumberActive: {
    color: '#000000',
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  workoutIndicator: {
    alignItems: 'center',
    marginBottom: 16,
  },
  indicatorText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
  },
  workoutCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  workoutImage: {
    width: '100%',
    height: 200,
  },
  workoutInfo: {
    padding: 20,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  equipmentSection: {
    marginBottom: 32,
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  equipmentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  equipmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  workoutNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  workoutCounter: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  equipmentBadgeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  bodyPartBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bodyPartText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  difficultyBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 6,
  },
  intensityReason: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  noWorkoutsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  noWorkoutsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  noWorkoutsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  goBackButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  goBackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});