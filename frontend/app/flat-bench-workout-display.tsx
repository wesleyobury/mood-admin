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
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';

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

// Flat Bench workout database with MOOD tips
const flatBenchDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Flat bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Bench Push-Up Circuit',
          duration: '10-12 min',
          description: '3 rounds:\n• 10 push-ups (hands on bench)\n• 10 bench dips\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction combining bench-assisted push-ups with dips to build foundational chest and tricep strength.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push-ups: Lower slow, drive up hard',
              description: 'Squeeze pecs together at the top. Think 'push the floor apart.''
            },
            {
              icon: 'body',
              title: 'Dips: Keep chest slightly forward',
              description: 'Shift load onto pecs vs. triceps for better chest activation.'
            }
          ]
        },
        {
          name: 'Bench Chest Press',
          duration: '12-15 min',
          description: '3 rounds:\n• 12 light dumbbell or Smith bench press\n• 10 dumbbell bench fly\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Combines pressing and isolation movements to teach proper bench technique while building chest strength.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Bench press: Drag elbows slightly in',
              description: 'Move toward midline as you press for max pec activation.'
            },
            {
              icon: 'body',
              title: 'Fly: Focus on stretching fibers',
              description: 'Stretch at bottom, then forcefully contract chest to bring dumbbells together.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Bench Plyo Push-Ups',
          duration: '14-16 min',
          description: '4 rounds:\n• 8 explosive push-ups (hands on bench)\n• 10 single-arm bench press\n• Rest 60-75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive plyometric training combined with unilateral strength work for intermediate power development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plyo push-ups: Push off with max intent',
              description: 'Builds fast-twitch fiber recruitment for growth every rep.'
            },
            {
              icon: 'fitness',
              title: 'Single-arm press: Lock shoulders down',
              description: 'Bring dumbbell in slight inward arc to increase inner-chest tension.'
            }
          ]
        },
        {
          name: 'Bench Chest Flow',
          duration: '12-15 min',
          description: '3 rounds:\n• 10 bench press\n• 10 fly\n• 10 close-grip bench press\n• Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Continuous flow training that overloads pecs through combined pressing and isolation movements.',
          moodTips: [
            {
              icon: 'refresh',
              title: "Fly → press transition, don't rest',
              description: 'Overloads pecs by hitting both stretch and contraction.'
            },
            {
              icon: 'hand-left',
              title: 'Close-grip: Press palms inward',
              description: 'Into bar/dumbbells to increase pec activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Bench Complex',
          duration: '15-18 min',
          description: '3 rounds:\n• 8 bench press\n• 8 bench fly\n• 8 plyo push-ups (hands on bench)\n• 8 dips\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex training combining pressing, isolation, plyometric, and bodyweight movements for maximum chest development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Bench press: Use slight pause at bottom',
              description: 'Kill momentum and force pec drive for better activation.'
            },
            {
              icon: 'trending-down',
              title: 'Dips: Lean forward, chest toward floor',
              description: 'Shifts tension from triceps into pec stretch/contraction.'
            }
          ]
        },
        {
          name: 'Bench Drop Set',
          duration: '16-20 min',
          description: '2 rounds:\n• 10 heavy bench press\n• Drop → 10 moderate\n• Drop → 10 light\n• Rest 90-120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity drop sets push muscle failure across multiple weight ranges for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'shield',
              title: 'Keep reps 0-1 shy of failure',
              description: 'Maximize recruitment without burnout for optimal results.'
            },
            {
              icon: 'speedometer',
              title: 'Lighter sets: slow eccentric',
              description: '3s descent to maximize muscle tension and growth.'
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
  const [showIndicator, setShowIndicator] = useState(true);

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
          <Ionicons name="play" size={20} color='#000000' />
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
          <Ionicons name={icon} size={24} color='#FFD700' />
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

export default function FlatBenchWorkoutDisplayScreen() {
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
    selectedEquipmentNames = ['Flat bench'];
  }
  
  const difficulty = (params.difficulty as string || 'beginner').toLowerCase();
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Chest';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle, workoutType });

  // Get difficulty color - all the same neon gold
  const getDifficultyColor = (level: string) => {
    return '#FFD700'; // Same neon gold for all difficulty levels
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment (in this case, just Flat bench)
  const userWorkouts = flatBenchDatabase.filter(item => 
    selectedEquipmentNames.includes(item.equipment)
  );

  console.log('Debug info:', {
    selectedEquipmentNames,
    flatBenchDatabaseEquipment: flatBenchDatabase.map(w => w.equipment),
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
          battlePlan: workout.battlePlan || '',
          duration: workout.duration || '15 min',
          difficulty: difficulty,
          workoutType: workoutType,
          imageUrl: workout.imageUrl || '',
          intensityReason: workout.intensityReason || '',
          moodCard: 'Muscle Gainer',
          // Pass MOOD tips as properly encoded JSON string
          moodTips: encodeURIComponent(JSON.stringify(workout.moodTips || []))
        }
      });
      
      console.log('✅ Navigation completed - using full parameters');
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
          <Ionicons name="chevron-back" size={24} color='#FFD700' />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Your Workouts</Text>
          <Text style={styles.headerSubtitle}>{moodTitle} • {difficulty}</Text>
        </View>
        <HomeButton />
      </View>

      {/* Progress Bar - Single Non-Scrolling Section */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          {/* Step 1: Mood Selection */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.progressStepGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name="flame" size={12} color='#0c0c0c' />
              </LinearGradient>
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {/* Step 2: Workout Type */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.progressStepGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name="fitness" size={12} color='#0c0c0c' />
              </LinearGradient>
            </View>
            <Text style={styles.progressStepText}>{workoutType}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {/* Step 3: Intensity Level */}
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.progressStepGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name="speedometer" size={12} color='#0c0c0c' />
              </LinearGradient>
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
                'Flat bench': 'square'
              };
              return equipmentIconMap[equipmentName] || 'fitness';
            };

            return (
              <React.Fragment key={equipment}>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.progressStepGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <Ionicons name={getEquipmentIcon(equipment)} size={12} color='#0c0c0c' />
                    </LinearGradient>
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
            <View key={`container-${equipmentData.equipment}`} style={styles.workoutCardContainer}>
              <WorkoutCard
                key={`workout-card-${equipmentData.equipment}-${index}`}
                equipment={equipmentData.equipment}
                icon={equipmentData.icon}
                workouts={equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts]}
                difficulty={difficulty}
                difficultyColor={difficultyColor}
                onStartWorkout={handleStartWorkout}
              />
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
  progressStep: {
    alignItems: 'center',
    minWidth: 60,
    maxWidth: 80,
  },
  progressStepActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressStepGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#ffffff',
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
    color: '#ffffff',
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutButtonText: {
    fontSize: 14,
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
});