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

// Triceps workout database - starting with Dumbbell and more equipment to be added
const tricepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'DB Overhead Press',
          duration: '10–12 min',
          description: 'Simple overhead tricep extension builds foundation',
          battlePlan: '3 rounds\n• 10–12 Overhead Tricep Extensions\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Teaches basic tricep control and form',
          moodTips: [
            {
              icon: 'flash',
              title: 'Keep elbows close to head',
              description: 'Fixed elbow position isolates triceps effectively.'
            },
            {
              icon: 'body',
              title: 'Lower slowly, control the weight',
              description: 'Slow eccentric builds strength and prevents injury.'
            }
          ]
        },
        {
          name: 'DB Kickbacks',
          duration: '10–12 min',
          description: 'Kickbacks develop tricep isolation skills',
          battlePlan: '3 rounds\n• 10–12 Tricep Kickbacks per arm\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Bent-over position challenges stability and isolation',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Keep upper arm parallel to floor',
              description: 'Stable upper arm maximizes tricep activation.'
            },
            {
              icon: 'timer',
              title: 'Squeeze at full extension',
              description: 'Peak contraction builds muscle definition.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Close-Grip Press',
          duration: '12–14 min',
          description: 'Close-grip press builds pressing power',
          battlePlan: '4 rounds\n• 8–10 Close-Grip DB Press\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Close grip emphasizes tricep engagement over chest',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Keep dumbbells touching',
              description: 'Narrow grip targets triceps more effectively.'
            },
            {
              icon: 'body',
              title: 'Lower to chest, press straight up',
              description: 'Full range of motion maximizes development.'
            }
          ]
        },
        {
          name: 'Skull Crushers',
          duration: '12–14 min',
          description: 'Lying extensions focus on tricep stretch',
          battlePlan: '3 rounds\n• 8 DB Skull Crushers (3s eccentric)\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Long muscle stretch increases hypertrophy stimulus',
          moodTips: [
            {
              icon: 'flash',
              title: 'Lower to forehead level, not past',
              description: 'Controlled range protects elbows and maximizes tension.'
            },
            {
              icon: 'fitness',
              title: 'Keep elbows stationary',
              description: 'Fixed elbows ensure triceps do all the work.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tricep Complex',
          duration: '14–16 min',
          description: 'Multi-angle tricep combination for complete development',
          battlePlan: '4 rounds\n• 8 Overhead Extensions\nRest 60s\n• 8 Skull Crushers\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Two angles target all tricep heads completely',
          moodTips: [
            {
              icon: 'shield',
              title: 'Maintain form through fatigue',
              description: 'Quality reps trump quantity for muscle growth.'
            },
            {
              icon: 'flash',
              title: 'Focus on tricep stretch and squeeze',
              description: 'Feel the muscle working through full range.'
            }
          ]
        },
        {
          name: 'Tricep Burnout',
          duration: '16–18 min',
          description: 'High-volume tricep destruction for advanced trainees',
          battlePlan: '4 rounds\n• 8 Close-Grip Press\n• Immediately 8 Overhead Extensions\n• End with 8 Kickbacks\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Triple-set creates maximum metabolic stress',
          moodTips: [
            {
              icon: 'timer',
              title: 'No rest between exercises in set',
              description: 'Continuous tension maximizes muscle fatigue.'
            },
            {
              icon: 'flame',
              title: 'Push through the burn sensation',
              description: 'Mental toughness through lactic acid builds strength.'
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
          name: 'KB Floor Press',
          duration: '10–12 min',
          description: 'Floor press limits range for safe learning',
          battlePlan: '3 rounds\n• 10–12 Kettlebell Floor Press\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Floor limits range for beginner safety',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip handle, let bell rest on forearm',
              description: 'Natural kettlebell position for stable pressing.'
            },
            {
              icon: 'body',
              title: 'Press straight up from floor position',
              description: 'Floor contact prevents overextension and injury.'
            }
          ]
        },
        {
          name: 'KB Overhead Hold',
          duration: '10–12 min',
          description: 'Static holds build tricep endurance',
          battlePlan: '3 rounds\n• 20-30s Overhead Hold per arm\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Isometric loading builds stability and endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Keep arm locked overhead',
              description: 'Triceps work constantly to maintain position.'
            },
            {
              icon: 'fitness',
              title: 'Engage core for stability',
              description: 'Full body tension supports arm position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'KB Bottom-Up Press',
          duration: '12–14 min',
          description: 'Bottom-up grip challenges stability and control',
          battlePlan: '4 rounds\n• 6-8 Bottom-Up Press per arm\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Inverted grip demands maximum stability',
          moodTips: [
            {
              icon: 'flash',
              title: 'Grip tight, keep bell balanced',
              description: 'Intense grip strength required for control.'
            },
            {
              icon: 'body',
              title: 'Press slowly, maintain balance',
              description: 'Speed kills balance - control is everything.'
            }
          ]
        },
        {
          name: 'KB Tricep Extensions',
          duration: '12–14 min',
          description: 'Overhead extensions with kettlebell challenge',
          battlePlan: '3 rounds\n• 8-10 KB Overhead Extensions\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Awkward weight distribution increases difficulty',
          moodTips: [
            {
              icon: 'shield',
              title: 'Control the bell behind head',
              description: 'Kettlebell weight shifts require extra control.'
            },
            {
              icon: 'flash',
              title: 'Keep elbows pointing forward',
              description: 'Fixed elbow position despite challenging grip.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'KB Press Complex',
          duration: '14–16 min',
          description: 'Multiple kettlebell pressing angles for complete development',
          battlePlan: '4 rounds\n• 6 Bottom-Up Press\nRest 60s\n• 8 Overhead Extensions\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combines stability and isolation challenges',
          moodTips: [
            {
              icon: 'construct',
              title: 'Master each movement separately first',
              description: 'Complex requires individual exercise proficiency.'
            },
            {
              icon: 'fitness',
              title: 'Maintain technique under fatigue',
              description: 'Form degradation reduces effectiveness.'
            }
          ]
        },
        {
          name: 'KB Tricep Gauntlet',
          duration: '16–18 min',
          description: 'Ultimate kettlebell tricep endurance challenge',
          battlePlan: '4 rounds\n• 6 Bottom-Up Press\n• Immediately 8 Extensions\n• End with 20s Overhead Hold\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Triple challenge tests strength, stability, endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'No rest between exercises',
              description: 'Continuous work maximizes adaptation stimulus.'
            },
            {
              icon: 'flame',
              title: 'Embrace the challenge',
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
          name: 'EZ Skull Crushers',
          duration: '10–12 min',
          description: 'Wrist-friendly tricep extensions for beginners',
          battlePlan: '3 rounds\n• 10–12 EZ Bar Skull Crushers\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Angled grip reduces wrist strain for beginners',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Use angled grip naturally',
              description: 'EZ bar curve matches natural wrist position.'
            },
            {
              icon: 'body',
              title: 'Lower to forehead, not past',
              description: 'Safe range protects joints while targeting triceps.'
            }
          ]
        },
        {
          name: 'EZ Close-Grip Press',
          duration: '10–12 min',
          description: 'Close-grip pressing with comfortable wrist angle',
          battlePlan: '3 rounds\n• 10 EZ Close-Grip Press\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Beginner-friendly compound tricep movement',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Hands closer than shoulder-width',
              description: 'Close grip emphasizes triceps over chest.'
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
          name: 'EZ Overhead Extensions',
          duration: '12–14 min',
          description: 'Standing overhead extensions for full tricep stretch',
          battlePlan: '4 rounds\n• 8–10 EZ Overhead Extensions\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Standing position challenges core stability',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep elbows close to head',
              description: 'Fixed elbows maximize tricep isolation.'
            },
            {
              icon: 'trending-up',
              title: 'Lower bar behind head carefully',
              description: 'Control the stretch for safety and effectiveness.'
            }
          ]
        },
        {
          name: 'EZ Negative Focus',
          duration: '12–14 min',
          description: 'Slow eccentric emphasis for strength building',
          battlePlan: '3 rounds\n• 8 EZ Skull Crushers (4s eccentric)\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Extended eccentric maximizes muscle damage',
          moodTips: [
            {
              icon: 'timer',
              title: 'Count 4 seconds on the way down',
              description: 'Slow negatives build exceptional strength.'
            },
            {
              icon: 'shield',
              title: 'Stay in control throughout',
              description: 'Never let the weight drop or bounce.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'EZ Tri-Set',
          duration: '14–16 min',
          description: 'Three EZ bar exercises back-to-back for overload',
          battlePlan: '4 rounds\n• 8 Skull Crushers\nRest 60s\n• 8 Overhead Extensions\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Multiple angles exhaust triceps completely',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Switch angles but maintain intensity',
              description: 'Each angle hits triceps differently.'
            },
            {
              icon: 'fitness',
              title: 'Focus on form as fatigue builds',
              description: 'Quality reps more important than quantity.'
            }
          ]
        },
        {
          name: 'EZ Tricep Finisher',
          duration: '16–18 min',
          description: 'Ultimate EZ bar tricep exhaustion protocol',
          battlePlan: '4 rounds\n• 8 Close-Grip Press\n• Immediately 8 Skull Crushers\n• End with 6 Overhead Extensions\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Triple-stack maximally fatigues all tricep heads',
          moodTips: [
            {
              icon: 'flame',
              title: 'No rest between movements',
              description: 'Continuous work for maximum growth stimulus.'
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
  const workoutType = params.workoutType as string || 'Triceps';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment
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

  console.log('User workouts:', userWorkouts);
  console.log('userWorkoutsLength:', userWorkouts.length);

  const handleStartWorkout = (workout: Workout, equipment: string, selectedDifficulty: string) => {
    console.log('🚀 Starting workout:', workout.name);
    console.log('📝 Workout data:', { 
      name: workout.name, 
      equipment, 
      difficulty: selectedDifficulty,
      duration: workout.duration,
      moodTipsCount: workout.moodTips?.length || 0
    });

    // Navigate to workout guidance with simplified parameters to avoid URI encoding issues
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
        // Pass MOOD tips as JSON string with count for fallback
        moodTips: JSON.stringify(workout.moodTips || []),
        moodTipsCount: workout.moodTips?.length || 0
      }
    });

    console.log('✅ Navigation completed - using simplified parameters');
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderProgressStep = (stepName: string, icon: keyof typeof Ionicons.glyphMap, isActive: boolean = true) => (
    <View style={styles.progressStep} key={stepName}>
      <View style={isActive ? styles.progressStepActive : styles.progressStepInactive}>
        <Ionicons name={icon} size={14} color={isActive ? "#000000" : "#FFD700"} />
      </View>
      <Text style={styles.progressStepText}>{stepName}</Text>
    </View>
  );

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
          <Text style={styles.headerTitle}>Triceps Workouts</Text>
          <Text style={styles.headerSubtitle}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar - Extended Format */}
      <View style={styles.progressContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressContent}
        >
          {renderProgressStep(moodTitle, 'flame')}
          <View style={styles.progressConnector} />
          {renderProgressStep(workoutType, 'fitness')}
          
          {selectedEquipmentNames.map((equipmentName, index) => (
            <React.Fragment key={equipmentName}>
              <View style={styles.progressConnector} />
              {renderProgressStep(equipmentName, 'barbell')}
            </React.Fragment>
          ))}
          
          <View style={styles.progressConnector} />
          {renderProgressStep(`Equipment (${selectedEquipmentNames.length})`, 'cube')}
          
          <View style={styles.progressConnector} />
          {renderProgressStep(difficulty.charAt(0).toUpperCase() + difficulty.slice(1), 'checkmark')}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {userWorkouts.length > 0 ? (
          userWorkouts.map((workoutData, index) => {
            console.log(`Rendering card ${index + 1}: ${workoutData!.equipment}`);
            return (
              <WorkoutCard
                key={`${workoutData!.equipment}-${index}`}
                equipment={workoutData!.equipment}
                icon={workoutData!.icon}
                workouts={workoutData!.workouts}
                difficulty={difficulty}
                difficultyColor={difficultyColor}
                onStartWorkout={handleStartWorkout}
              />
            );
          })
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="fitness" size={48} color="#666666" />
            <Text style={styles.noWorkoutsTitle}>No Workouts Found</Text>
            <Text style={styles.noWorkoutsText}>
              No workouts available for the selected equipment and difficulty level.
            </Text>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  progressContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 70,
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
  },
  progressStepInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressConnector: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 6,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
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
    shadowRadius: 12,
    elevation: 8,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  equipmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  workoutList: {
    paddingHorizontal: 20,
  },
  workoutSlide: {
    paddingVertical: 16,
  },
  workoutImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  workoutImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
  },
  swipeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  swipeText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '600',
  },
  workoutContent: {
    gap: 12,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
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
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    gap: 8,
  },
  intensityReason: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    lineHeight: 18,
  },
  workoutDescriptionContainer: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 0,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
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
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
    width: 24,
  },
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noWorkoutsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 12,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
});