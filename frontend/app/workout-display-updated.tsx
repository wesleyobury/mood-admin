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

// Complete workout database with all 12 equipment types and MOOD tips
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Treadmill',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Walk & Jog Mixer',
          duration: '20 min',
          description: 'Walk-jog intervals alternating between\n3.5-5.2 mph for beginner endurance.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction with walk-jog intervals that build endurance gradually without overwhelming new exercisers.',
          moodTips: [
            {
              icon: 'body',
              title: 'Posture & Form',
              description: 'Stay tall, no rail-holding; land mid-foot to protect knees.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Pattern',
              description: 'Breathe rhythmically: 3 steps inhale, 2 steps exhale.'
            }
          ]
        },
        {
          name: 'Rolling Hills',
          duration: '20 min',
          description: 'Incline walking progression from 3% to 6%\ngrade for building leg strength safely.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHx3YWxraW5nJTIwdHJlYWRtaWxsfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle incline progression helps beginners build leg strength and cardiovascular endurance safely.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Incline Technique',
              description: 'Shorten stride, drive knees on inclines; avoid leaning.'
            },
            {
              icon: 'refresh',
              title: 'Core Engagement',
              description: 'Engage core for posture; use arms for momentum.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Speed Ladder',
          duration: '25 min',
          description: 'Speed intervals from 5.5-7.5 mph with\nincline recovery walks. 3 rounds total.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressively increases speed while maintaining good recovery periods for intermediate fitness levels.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Cadence Focus',
              description: 'Increase cadence, not stride length, for speed.'
            },
            {
              icon: 'trending-up',
              title: 'Progressive Buildup',
              description: 'Each interval should feel challenging but controlled.'
            }
          ]
        },
        {
          name: 'Hill Intervals',
          duration: '22 min',
          description: 'Incline runs at 1-5% grade with\nflat recovery between intervals.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHx3YWxraW5nJTIwdHJlYWRtaWxsfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds power and aerobic capacity through controlled incline running with adequate recovery.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Hill Running Form',
              description: 'Shorten stride, drive knees up, maintain upright posture.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Focus',
              description: 'Use flat recovery to prepare for next interval intensity.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Sprint Pyramid',
          duration: '28 min',
          description: 'Pyramid sprints from 30s to 1 min\nat 9+ mph with jog recoveries.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity pyramid training develops speed, power, and anaerobic capacity for advanced athletes.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Mechanics',
              description: 'Drive arms, high knees, land on balls of feet.'
            },
            {
              icon: 'timer',
              title: 'Pacing Strategy',
              description: 'Start conservatively, build intensity through pyramid.'
            }
          ]
        },
        {
          name: 'Tempo Hills',
          duration: '30 min',
          description: 'Sustained tempo running with hill\nsprints and incline walks for recovery.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHx3YWxraW5nJTIwdHJlYWRtaWxsfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combines tempo and hill training for advanced aerobic and anaerobic development.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Tempo Pace',
              description: 'Comfortably hard pace you can sustain for 20+ minutes.'
            },
            {
              icon: 'trending-up',
              title: 'Hill Power',
              description: 'Drive through hills with power, recover on incline walks.'
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
          name: 'Easy Intervals',
          duration: '20 min',
          description: 'Light resistance intervals alternating\nbetween easy and moderate effort.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle introduction to interval training with low impact on joints.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Bike Setup',
              description: 'Adjust seat height: slight bend in knee at bottom of pedal stroke.'
            },
            {
              icon: 'refresh',
              title: 'Pedaling Form',
              description: 'Smooth circles, not just pushing down; engage core.'
            }
          ]
        },
        {
          name: 'RPM Focus',
          duration: '18 min',
          description: 'Cadence training alternating between\nsteady and fast pedaling rates.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Develops pedaling efficiency and cardiovascular fitness through cadence variations.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'RPM Awareness',
              description: 'Focus on leg speed, not just resistance for intensity.'
            },
            {
              icon: 'refresh',
              title: 'Smooth Transitions',
              description: 'Gradually change cadence to avoid sudden strain.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Climb & Sprint',
          duration: '25 min',
          description: 'High resistance climbs alternating\nwith low resistance sprints.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds both power and speed through contrasting resistance and cadence work.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Climbing Technique',
              description: 'Maintain steady cadence even with high resistance.'
            },
            {
              icon: 'flash',
              title: 'Sprint Form',
              description: 'Quick leg turnover, stay controlled and seated.'
            }
          ]
        },
        {
          name: 'Reverse Riding',
          duration: '22 min',
          description: 'Forward and reverse pedaling intervals\nfor balanced leg development.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Targets different muscle groups and improves coordination through reverse pedaling.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Reverse Technique',
              description: 'Start slowly, focus on smooth circular motion backwards.'
            },
            {
              icon: 'body',
              title: 'Muscle Balance',
              description: 'Reverse riding activates hamstrings and glutes more.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tabata Bike',
          duration: '20 min',
          description: 'High-intensity Tabata intervals with\nmax effort and brief recoveries.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Maximum anaerobic power development through scientifically-proven Tabata protocol.',
          moodTips: [
            {
              icon: 'flash',
              title: 'All-Out Effort',
              description: 'True maximum effort for 20 seconds, not sustainable pace.'
            },
            {
              icon: 'timer',
              title: 'Recovery Focus',
              description: 'Use 10-second rest to prepare for next max effort.'
            }
          ]
        },
        {
          name: 'Endurance Mix',
          duration: '35 min',
          description: 'Long endurance ride with moderate\nresistance and reverse intervals.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds aerobic endurance and muscular endurance through sustained effort.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Steady State',
              description: 'Maintain consistent effort and cadence throughout.'
            },
            {
              icon: 'refresh',
              title: 'Mental Focus',
              description: 'Stay engaged with form and breathing during long efforts.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Elliptical',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Easy Flow',
          duration: '15 min',
          description: 'Gentle elliptical introduction with\nlow resistance and steady rhythm.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Low-impact introduction perfect for joint-friendly cardiovascular conditioning.',
          moodTips: [
            {
              icon: 'body',
              title: 'Posture Focus',
              description: 'Stand tall, don\'t lean heavily on handles for balance.'
            },
            {
              icon: 'refresh',
              title: 'Smooth Motion',
              description: 'Focus on fluid, complete elliptical motion.'
            }
          ]
        },
        {
          name: 'Resistance Ladder',
          duration: '18 min',
          description: 'Progressive resistance increases with\nsteady recovery intervals.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gradual intensity progression helps build strength and endurance safely.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Progressive Loading',
              description: 'Increase resistance gradually, maintain good form.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Importance',
              description: 'Use easier intervals to prepare for next challenge.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Sprint Intervals',
          duration: '20 min',
          description: 'High-intensity sprint intervals with\nactive recovery periods.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Develops anaerobic power and cardiovascular fitness through high-intensity intervals.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Sprint Technique',
              description: 'Increase stride rate, maintain control during sprints.'
            },
            {
              icon: 'refresh',
              title: 'Active Recovery',
              description: 'Keep moving during recovery, don\'t stop completely.'
            }
          ]
        },
        {
          name: 'Pyramid Power',
          duration: '25 min',
          description: 'Pyramid resistance training building\nto peak intensity and back down.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Systematic intensity progression challenges multiple energy systems.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Build Gradually',
              description: 'Save energy for peak pyramid intensity.'
            },
            {
              icon: 'speedometer',
              title: 'Maintain Cadence',
              description: 'Keep stroke rate consistent as resistance increases.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tabata Elliptical',
          duration: '24 min',
          description: 'Tabata protocol with maximum effort\nbursts and minimal recovery.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite-level anaerobic conditioning through proven Tabata methodology.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Maximum Intensity',
              description: 'True all-out effort, not just "hard" during work periods.'
            },
            {
              icon: 'timer',
              title: 'Mental Preparation',
              description: 'Use short rest to mentally prepare for next interval.'
            }
          ]
        },
        {
          name: 'EMOM Challenge',
          duration: '20 min',
          description: 'Every minute on the minute sprints\nwith variable recovery time.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Time-based challenges test power endurance and mental toughness.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Time Management',
              description: 'Finish sprints quickly to maximize recovery time.'
            },
            {
              icon: 'flash',
              title: 'Consistent Power',
              description: 'Maintain sprint quality throughout entire workout.'
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
          name: 'Stroke Focus',
          duration: '15 min',
          description: 'Basic rowing technique with focus\non proper form and rhythm.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Foundation building with emphasis on proper rowing mechanics.',
          moodTips: [
            {
              icon: 'body',
              title: 'Rowing Sequence',
              description: 'Legs, core, arms on drive; reverse on recovery.'
            },
            {
              icon: 'refresh',
              title: 'Stroke Rate',
              description: 'Focus on long, powerful strokes rather than fast rate.'
            }
          ]
        },
        {
          name: 'Steady Pace',
          duration: '18 min',
          description: 'Consistent stroke rate building\nendurance and technique confidence.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds aerobic base while reinforcing proper rowing technique.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Pace Management',
              description: 'Find sustainable pace you can maintain with good form.'
            },
            {
              icon: 'refresh',
              title: 'Breathing Rhythm',
              description: 'Coordinate breathing with stroke rhythm naturally.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Power Intervals',
          duration: '22 min',
          description: 'High stroke rate intervals with\nmoderate recovery rowing.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Develops power and anaerobic capacity through structured interval training.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Power Focus',
              description: 'Drive hard with legs, maintain strong core connection.'
            },
            {
              icon: 'refresh',
              title: 'Recovery Rowing',
              description: 'Stay moving during recovery, focus on technique.'
            }
          ]
        },
        {
          name: 'Pyramid Rows',
          duration: '25 min',
          description: 'Stroke rate pyramid building from\nsteady to sprint and back down.\n ',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Systematic progression challenges different energy systems and stroke rates.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Progressive Build',
              description: 'Gradually increase intensity, save best for peak.'
            },
            {
              icon: 'speedometer',
              title: 'Rate Control',
              description: 'Hit target stroke rates accurately at each level.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tabata Rows',
          duration: '20 min',
          description: 'Maximum effort Tabata intervals\nwith all-out rowing sprints.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite anaerobic power development through maximum intensity rowing.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Max Power Output',
              description: 'Pull as hard and fast as possible during work periods.'
            },
            {
              icon: 'timer',
              title: 'Quick Recovery',
              description: 'Use brief rest to prepare mentally for next sprint.'
            }
          ]
        },
        {
          name: 'Distance Challenge',
          duration: '30 min',
          description: 'Long steady-state rowing for\nendurance and mental toughness.\n ',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds aerobic endurance and mental resilience through sustained effort.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Pace Discipline',
              description: 'Start conservatively, build if feeling strong later.'
            },
            {
              icon: 'refresh',
              title: 'Mental Strategies',
              description: 'Break distance into smaller chunks, focus on technique.'
            }
          ]
        }
      ]
    }
  }
];