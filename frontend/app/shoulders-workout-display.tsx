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

// Complete Shoulders workout database with all equipment types
const shouldersWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Seated Shoulder Builder',
          duration: '12–14 min',
          description: '• 3x12 Seated Shoulder Press\n• 3x12 Lateral Raises\nRest 60s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction targeting delts from multiple angles with seated stability for proper form development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hard exhale on each rep',
              description: 'More core stability and shoulder efficiency.'
            },
            {
              icon: 'trending-up',
              title: 'Stop at shoulder height and pause',
              description: 'Over-raising shifts load away from delts.'
            }
          ]
        },
        {
          name: 'Dynamic Shoulder Flow',
          duration: '12–15 min',
          description: '• 30s alternating single-arm overhead press (march in place)\n• 30s lateral raise with 2-sec hold at top\n• 30s bent-over reverse flys\n• 30s rest\nRepeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dynamic flow progression that teaches proper shoulder isolation across multiple movement patterns for comprehensive beginners development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Isometric pauses make light weights feel heavy',
              description: 'Perfect for growth stimulus.'
            },
            {
              icon: 'flash',
              title: 'Marching during press ramps core activation',
              description: 'And shoulder stability for better muscle development.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Arnold Power Set',
          duration: '14–16 min',
          description: '• 4x10 Standing Arnold Press\n• 4x10 Upright Row\nRest 75s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive recruitment training that starts more delt-dominant and progresses to fatigue upper range for intermediate development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Rotate fully on Arnold presses',
              description: 'It recruits more deltoid fibers.'
            },
            {
              icon: 'construct',
              title: 'Pull elbows higher than wrists',
              description: 'For maximum trap-to-delt tension on upright rows.'
            }
          ]
        },
        {
          name: 'Shoulder Circuit Challenge',
          duration: '14–16 min',
          description: '• 10 Arnold presses\n• 10 "bus driver" raises (hold plate or dumbbell, rotate at top)\n• 10 push presses\n• 10 plank dumbbell drags (push-up position, drag side to side)\nRepeat 3x. Rest 75s between rounds.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Continuous flow training that overloads shoulders through combined pressing, isolation, and core-integration movements.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Explosive push presses overload shoulders',
              description: 'Better than light strict raises for growth.'
            },
            {
              icon: 'hand-left',
              title: 'Plank drags double as shoulder/core integration',
              description: 'Without extra time for maximum efficiency.'
            }
          ]
        },
      ],
      advanced: [
        {
          name: 'Explosive Press Builder',
          duration: '18–20 min',
          description: '• 4x8 Push Press\n• 4x10 Lateral Raises\n• 4x10 Bent-Over Reverse Flys\nRest 90s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity explosive training push shoulders across multiple weight ranges for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push from legs on push press',
              description: 'More load capacity = more growth stimulus.'
            },
            {
              icon: 'shield',
              title: 'Keep rear delts under tension',
              description: 'By stopping just shy of lockout on reverse flys.'
            }
          ]
        },
        {
          name: 'Dumbbell Power Flow',
          duration: '16–18 min',
          description: '• 8 clean to press\n• 8 lateral raise to front raise combo\n• 8 alternating single-arm snatch (light, explosive)\nRepeat 4x. Rest 90s between rounds.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite complex movements that overload shoulders through explosive patterns and maximum tension demands.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Pairing lateral + front raise',
              description: 'Double delt pump from one motion for efficiency.'
            },
            {
              icon: 'shield',
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
          description: '• 3x10 Standing Overhead Press\n• 3x10 Upright Row\nRest 60–75s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction targeting shoulders from basic pressing angles with barbell stability for proper form development.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Drive bar in straight path, not arced',
              description: 'Shoulders stay loaded, not joints.'
            },
            {
              icon: 'trending-up',
              title: 'Upright rows hit better',
              description: 'With a shoulder-width grip for maximum activation.'
            }
          ]
        },
        {
          name: 'Intro Shoulder Flow',
          duration: '12–14 min',
          description: '• 8 strict presses\n• 8 behind-the-neck presses (light)\n• 8 barbell "rainbows" (arc overhead side to side)\nRepeat 3x. Rest 1 min between rounds.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle barbell progression that teaches proper shoulder isolation across multiple movement patterns for comprehensive beginners development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Behind-the-neck: only go as low',
              description: 'As shoulder mobility allows to prevent strain.'
            },
            {
              icon: 'flash',
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
          description: '• 4x8 Push Press\n• 4x8 Barbell High Pull\nRest 75s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive recruitment training that starts more shoulder-dominant and progresses to fatigue upper range for intermediate development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Drive power from legs',
              description: 'Into push press for heavy overload capacity.'
            },
            {
              icon: 'construct',
              title: 'High pulls: elbows drive wide and high',
              description: 'To maximize delt stretch and activation.'
            }
          ]
        },
        {
          name: 'Barbell Shoulder Circuit',
          duration: '14–16 min',
          description: '• 8 push presses\n• 8 barbell Z-presses (seated on floor)\n• 8 overhead lunges (alternate legs)\nRepeat 3x. Rest 90s between rounds.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Continuous flow training that overloads shoulders through combined pressing, strict movements, and stability patterns.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Z-press: no lower body',
              description: 'Equals strict shoulder strength development.'
            },
            {
              icon: 'hand-left',
              title: 'Overhead lunges build stability under fatigue',
              description: 'Great for functional hypertrophy.'
            }
          ]
        },
      ],
      advanced: [
        {
          name: 'Advanced Barbell Builder',
          duration: '18–20 min',
          description: '• 4x8 Strict Press\n• 4x8 Upright Row\n• 4x8 Front Raise (Barbell)\nRest 90s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity strict training push shoulders across multiple weight ranges for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strict pressing keeps body honest',
              description: 'No cheating momentum for maximum growth.'
            },
            {
              icon: 'shield',
              title: 'Front raise with barbell',
              description: 'Constant tension different from dumbbells.'
            }
          ]
        },
        {
          name: 'Barbell Power Complex',
          duration: '18–20 min',
          description: '• 6 push jerks\n• 6 snatch grip high pulls\n• 6 Sots presses (overhead squat position, strict press)\nRepeat 4x. Rest 90–120s after each round.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite complex movements that overload shoulders through explosive patterns and maximum tension + mobility demands.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push jerk = heavy overload',
              description: 'Vital for breaking growth plateaus.'
            },
            {
              icon: 'shield',
              title: 'Sots press pushes shoulders',
              description: 'Under maximum tension + mobility demand.'
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
          workoutDescription: workout.description,
          workoutDuration: workout.duration,
          difficulty: difficulty,
          mood: moodTitle,
          workoutType: workoutType,
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

      {/* Progress Bar - matches chest format exactly */}
      <View style={styles.progressContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressContent}
        >  
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
              <Ionicons name="diamond-outline" size={12} color="#000000" />
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
          
          {selectedEquipmentNames.map((equipment, index) => {
            // Get appropriate icon for each equipment type
            const getEquipmentIcon = (equipmentName: string) => {
              const equipmentIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
                'Adjustable Bench': 'square-outline',
                'Barbells': 'barbell',
                'Cable Crossover Machine': 'reorder-three-outline',
                'Dumbbells': 'barbell',
                'Kettlebells': 'diamond-outline',
                'Landmine Attachment': 'rocket-outline',
                'Pec Deck / Rear Delt Fly Machine': 'contract-outline',
                'Powerlifting Platform': 'grid-outline',
                'Shoulder Press Machine': 'triangle-outline',
                'Smith Machine': 'hardware-chip-outline'
              };
              return equipmentIconMap[equipmentName] || 'fitness-outline';
            };

            return (
              <React.Fragment key={equipment}>
                <View style={styles.progressConnector} />
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <Ionicons name={getEquipmentIcon(equipment)} size={12} color="#000000" />
                  </View>
                  <Text style={styles.progressStepText}>{equipment}</Text>
                </View>
              </React.Fragment>
            );
          })}
        </ScrollView>
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
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  equipmentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  equipmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
  },
  workoutCountIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  workoutCountText: {
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
    paddingVertical: 16,
    alignItems: 'center',
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