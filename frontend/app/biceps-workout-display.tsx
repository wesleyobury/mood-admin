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

// Biceps workout database with detailed workouts for Dumbbells and EZ Curl Bar
const bicepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'DB Curl',
          duration: '10–12 min',
          description: 'Simple dumbbell curl builds foundation strength',
          battlePlan: '3 rounds\n• 10–12 Dumbbell Curls\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Teaches form and starting arm control',
          moodTips: [
            {
              icon: 'flash',
              title: 'Keep elbows pinned at sides',
              description: 'Maintain elbow position to isolate biceps effectively.'
            },
            {
              icon: 'body',
              title: 'Lower weights slowly, avoid swinging',
              description: 'Controlled eccentric movement builds strength and prevents injury.'
            }
          ]
        },
        {
          name: 'Hammer Curl',
          duration: '10–12 min',
          description: 'Hammer curls thicken early arm development',
          battlePlan: '3 rounds\n• 10–12 Hammer Curls\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Neutral grip adds forearms and brachialis stress',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Palms face each other all reps',
              description: 'Neutral grip targets brachialis and forearm muscles.'
            },
            {
              icon: 'timer',
              title: 'Pause lightly at top of curl',
              description: 'Brief pause increases muscle tension and growth stimulus.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Alternating Curl',
          duration: '12–14 min',
          description: 'Alternating curls build strength and balance',
          battlePlan: '4 rounds\n• 8–10 per arm Alternating DB Curls\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'One arm rests as the other works for focus',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Turn palms up fully at top',
              description: 'Full supination maximizes biceps peak contraction.'
            },
            {
              icon: 'body',
              title: 'Stay tall, don\'t rotate torso',
              description: 'Maintain upright posture to isolate arm movement.'
            }
          ]
        },
        {
          name: 'Negative Curl',
          duration: '12–14 min',
          description: 'Slow descents emphasize strict control',
          battlePlan: '3 rounds\n• 8 Dumbbell Curls (3s eccentric each rep)\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: '3s eccentric increases hypertrophy tension',
          moodTips: [
            {
              icon: 'flash',
              title: 'Lift quick, lower 3s steady',
              description: 'Fast concentric, slow eccentric maximizes muscle growth.'
            },
            {
              icon: 'fitness',
              title: 'Brace core, no swaying',
              description: 'Stable core ensures biceps do all the work.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Curl + Hammer',
          duration: '14–16 min',
          description: 'Combined curls and hammer work maximize growth',
          battlePlan: '4 rounds\n• 8 Standard DB Curls\nRest 90s\n• 8 Hammer Curls\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Two grips boost fatigue and arm fullness',
          moodTips: [
            {
              icon: 'shield',
              title: 'Stay strict — drop load if form breaks',
              description: 'Maintain perfect form throughout both grip variations.'
            },
            {
              icon: 'flash',
              title: 'Maintain tension, no resting at bottom',
              description: 'Keep constant tension on muscles between reps.'
            }
          ]
        },
        {
          name: 'Curl Complex',
          duration: '16–18 min',
          description: 'Combo curls with hold pumps maximum fatigue',
          battlePlan: '4 rounds\n• 8 Alternating DB Curls\n• Immediately 8 Hammer Curls\n• End with 10s DB Curl Hold\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Superset plus static hold builds endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold weight at 90° for max tension',
              description: 'Midrange isometric hold maximizes muscle activation.'
            },
            {
              icon: 'flame',
              title: 'Push through the burn — no dropping early',
              description: 'Mental toughness through metabolic stress builds strength.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'EZ curl bar',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Bar Curl',
          duration: '10–12 min',
          description: 'Wrist-friendly curls for arm foundation',
          battlePlan: '3 rounds\n• 10–12 EZ Bar Curls\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'EZ bar allows easy introduction to curling',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip angled position naturally',
              description: 'EZ bar reduces wrist strain while maintaining effectiveness.'
            },
            {
              icon: 'body',
              title: 'Elbows stay locked, chest tall',
              description: 'Stable upper arm position isolates biceps movement.'
            }
          ]
        },
        {
          name: 'Wide Grip Curl',
          duration: '10–12 min',
          description: 'Grip shift builds early variation and control',
          battlePlan: '3 rounds\n• 10 Wide Grip EZ Curls\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wider hand spacing recruits outer biceps',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Keep elbows tucked in place',
              description: 'Fixed elbow position targets biceps, not shoulders.'
            },
            {
              icon: 'flash',
              title: 'Breathe steady, squeeze at top',
              description: 'Peak contraction with controlled breathing pattern.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Narrow Curl',
          duration: '12–14 min',
          description: 'Tighter grip increases arm strength line',
          battlePlan: '4 rounds\n• 8–10 Narrow Grip EZ Curls\nRest 75–90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Narrow grip emphasizes inner biceps overload',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Palms inward, elbows tight',
              description: 'Close grip targets inner biceps head effectively.'
            },
            {
              icon: 'trending-up',
              title: 'Pull bar smoothly to chest',
              description: 'Smooth arc motion maximizes muscle fiber recruitment.'
            }
          ]
        },
        {
          name: 'Negative Curl',
          duration: '12–14 min',
          description: 'Controlled lowering engages full range',
          battlePlan: '3 rounds\n• 8 EZ Bar Curls (3s eccentric each rep)\nRest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: '3s eccentrics overload tension for growth',
          moodTips: [
            {
              icon: 'flash',
              title: 'Quick up, 3s controlled down',
              description: 'Explosive concentric, slow eccentric for max growth.'
            },
            {
              icon: 'shield',
              title: 'Stay braced, zero rocking',
              description: 'Stable torso ensures biceps handle all resistance.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Narrow',
          duration: '14–16 min',
          description: 'Two grips stimulate inner & outer heads',
          battlePlan: '4 rounds\n• 8 Wide Grip Curl\nRest 90s\n• 8 Narrow Grip Curl\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Grip pairing overloads different fibers',
          moodTips: [
            {
              icon: 'construct',
              title: 'Prioritize control, not load',
              description: 'Perfect form with both grips trumps heavy weight.'
            },
            {
              icon: 'fitness',
              title: 'Elbows locked in position',
              description: 'Consistent elbow position throughout grip changes.'
            }
          ]
        },
        {
          name: 'Curl + Hold',
          duration: '16–18 min',
          description: 'Wide + narrow curls end with long hold',
          battlePlan: '4 rounds\n• 8 Wide Grip Curl\n• Immediately 8 Narrow Grip Curl\n• End with 10s Hold at 90° flexion\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Static finish increases tension past fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Squeeze mid-curl for 10s each set',
              description: 'Isometric hold at peak contraction angle builds strength.'
            },
            {
              icon: 'body',
              title: 'Maintain posture through burn',
              description: 'Don\'t compromise form during metabolic stress phase.'
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

export default function BicepsWorkoutDisplayScreen() {
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
  const workoutType = params.workoutType as string || 'Biceps';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment
  const userWorkouts = selectedEquipmentNames.map(equipmentName => {
    const equipmentData = bicepsWorkoutDatabase.find(
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
          <Text style={styles.headerTitle}>Biceps Workouts</Text>
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