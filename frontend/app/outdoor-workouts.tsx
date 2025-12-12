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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';
import { useCart, WorkoutItem } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Analytics } from '../utils/analytics';
import WigglingAddButton from '../components/WigglingAddButton';

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

import { outdoorRunWorkoutDatabase } from '../data/outdoor-workouts-data';

// Outdoor workout database
const workoutDatabase: EquipmentWorkouts[] = outdoorRunWorkoutDatabase;

// Workout Card Component - moved outside for memoization
interface WorkoutCardProps {
  equipment: string;
  icon: keyof typeof Ionicons.glyphMap;
  workouts: Workout[];
  difficulty: string;
  workoutType: string;
  moodTitle: string;
  onStartWorkout: (workout: Workout, equipment: string, difficulty: string) => void;
  isInCart: (workoutId: string) => boolean;
  createWorkoutId: (workout: Workout, equipment: string, difficulty: string) => string;
  handleAddToCart: (workout: Workout, equipment: string) => void;
}

const WorkoutCard = React.memo(({ 
  equipment, 
  icon, 
  workouts, 
  difficulty,
  workoutType,
  moodTitle,
  onStartWorkout,
  isInCart,
  createWorkoutId,
  handleAddToCart,
}: WorkoutCardProps) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [localScaleAnim] = useState(new Animated.Value(1));
  const flatListRef = useRef<FlatList>(null);

  const handleAddToCartWithAnimation = (workout: Workout) => {
    // Animate locally without affecting parent
    Animated.sequence([
      Animated.timing(localScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(localScaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(localScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Call parent handler
    handleAddToCart(workout, equipment);
  };

  console.log(`🏃 WorkoutCard for ${equipment}: received ${workouts.length} workouts for ${difficulty} difficulty`);
  workouts.forEach((workout, index) => {
    console.log(`  ${index + 1}. ${workout.name} (${workout.duration})`);
  });

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
        {/* Workout Name */}
        <Text style={styles.workoutName}>{item.name}</Text>
        
        {/* Duration and Intensity on same line */}
        <View style={styles.durationIntensityRow}>
          <Text style={styles.workoutDuration}>{item.duration}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: '#FFD700' }]}>
            <Text style={styles.difficultyBadgeText}>{(difficulty === 'intermediate' ? 'INTERMED.' : difficulty).toUpperCase()}</Text>
          </View>
        </View>

        {/* Intensity Reason */}
        <View style={styles.intensityContainer}>
          <Ionicons name="information-circle" size={16} color="#FFD700" />
          <Text style={styles.intensityReason}>{item.intensityReason}</Text>
        </View>

        {/* Workout Description */}
        <View style={styles.workoutDescriptionContainer}>
          <Text style={styles.workoutDescription}>{item.description}</Text>
        </View>

        {/* Start Workout Button */}
        <TouchableOpacity 
          style={styles.startWorkoutButton}
          onPress={() => onStartWorkout(item, equipment, difficulty)}
          activeOpacity={0.8}
        >
          <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
          <Ionicons name="play" size={16} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (workouts.length === 0) {
    return null;
  }

  return (
    <View style={styles.workoutCard}>
      {/* Equipment Header */}
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentIconContainer}>
          <Ionicons name={icon} size={16} color="#FFD700" />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <WigglingAddButton
          isInCart={isInCart(createWorkoutId(workouts[currentWorkoutIndex], equipment, difficulty))}
          onPress={() => handleAddToCartWithAnimation(workouts[currentWorkoutIndex])}
          scaleAnim={localScaleAnim}
        />
      </View>

      {/* Workout List - Native Swipe Enabled */}
      <View style={styles.workoutList}>
        <FlatList
          ref={flatListRef}
          data={workouts}
          renderItem={renderWorkout}
          horizontal
          pagingEnabled
          snapToInterval={width - 48}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            if (boundedIndex !== currentWorkoutIndex) {
              setCurrentWorkoutIndex(boundedIndex);
            }
          }}
          onMomentumScrollEnd={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            setCurrentWorkoutIndex(boundedIndex);
          }}
          onScrollEndDrag={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            setCurrentWorkoutIndex(boundedIndex);
          }}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: width - 48,
            offset: (width - 48) * index,
            index,
          })}
        />
      </View>

      {/* Workout Indicator Dots */}
      <View style={styles.dotsContainer}>
        <Text style={styles.dotsLabel}>Swipe to explore</Text>
        <View style={styles.dotsRow}>
          {workouts.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dotTouchArea,
                index === currentWorkoutIndex && styles.activeDotTouchArea
              ]}
              onPress={() => {
                console.log(`Dot clicked: ${index}, Current: ${currentWorkoutIndex}`);
                setCurrentWorkoutIndex(index);
                // Use scrollToOffset for more reliable behavior
                const slideSize = width - 48;
                flatListRef.current?.scrollToOffset({
                  offset: index * slideSize,
                  animated: true
                });
              }}
              activeOpacity={0.7}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <View style={[
                styles.dot,
                index === currentWorkoutIndex && styles.activeDot,
              ]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
});

export default function OutdoorWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { addToCart, cartItems } = useCart();
  const { token } = useAuth();

  // Parse URL parameters
  const moodTitle = params.mood as string || 'I want to get outside';
  const workoutType = params.workoutType as string || 'Outdoor activities';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse selected equipment from comma-separated string
  const selectedEquipmentNames = equipmentParam.split(',').filter(name => name.trim() !== '');
  
  console.log('Outdoor Debug:', {
    equipmentParam,
    selectedEquipmentNames,
    difficulty,
    workoutType,
    moodTitle
  });

  // Get workout data for selected equipment
  const selectedWorkoutData = workoutDatabase.filter(eq => 
    selectedEquipmentNames.some(name => 
      eq.equipment.toLowerCase().trim() === name.toLowerCase().trim()
    )
  );

  console.log('Selected workout data count:', selectedWorkoutData.length);

  const handleGoBack = () => {
    router.back();
  };

  const handleStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    try {
      console.log('🚀 Starting workout:', workout.name, 'on', equipment);
      
      if (!workout.name || !equipment || !difficulty) {
        console.error('❌ Missing required parameters for workout navigation');
        return;
      }
      
      router.push({
        pathname: '/workout-guidance',
        params: {
          workoutName: workout.name,
          equipment: equipment,
          description: workout.description || '',
          battlePlan: workout.battlePlan || '',
          duration: workout.duration || '20 min',
          difficulty: difficulty,
          workoutType: workoutType,
          moodTips: encodeURIComponent(JSON.stringify(workout.moodTips || []))
        }
      });
      
      console.log('✅ Navigation completed - using simplified parameters');
    } catch (error) {
      console.error('❌ Error starting workout:', error);
    }
  };

  // Cart helper functions
  const createWorkoutId = (workout: Workout, equipment: string, difficulty: string) => {
    return `${workout.name}-${equipment}-${difficulty}`.toLowerCase().replace(/\s+/g, '-');
  };

  const isInCart = (workoutId: string) => {
    return cartItems.some(item => item.id === workoutId);
  };

  const handleAddToCart = (workout: Workout, equipment: string) => {
    const workoutId = createWorkoutId(workout, equipment, difficulty);
    
    if (isInCart(workoutId)) {
      return; // Already in cart
    }

    // Create WorkoutItem from current workout
    const workoutItem: WorkoutItem = {
      id: workoutId,
      name: workout.name,
      duration: workout.duration,
      description: workout.description,
      battlePlan: workout.battlePlan,
      imageUrl: workout.imageUrl,
      intensityReason: workout.intensityReason,
      equipment: equipment,
      difficulty: difficulty,
      workoutType: workoutType,
      moodCard: moodTitle,
      moodTips: workout.moodTips || [],
    };

    // Add to cart
    if (token) {
      Analytics.workoutAddedToCart(token, {
        workout_name: workout.name,
        mood_category: moodTitle,
        equipment: equipment,
      });
    }
    addToCart(workoutItem);
  };

  // Create progress bar - single row with requested order
  const createProgressRows = () => {
    const steps = [
      { key: 'mood', icon: 'flame', text: 'Outside' },
      { key: 'difficulty', icon: 'speedometer', text: difficulty === 'intermediate' ? 'Intermed.' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `Activity (${selectedEquipmentNames.length})` },
    ];

    // Return single row
    return [steps];
  };

  // Progress bar rows
  const progressRows = createProgressRows();

  if (selectedWorkoutData.length === 0) {
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
            <Text style={styles.headerTitle}>Outdoor Activities</Text>
            <Text style={styles.headerSubtitle}>{moodTitle}</Text>
          </View>
          <HomeButton />
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="bicycle" size={80} color="rgba(255, 215, 0, 0.6)" />
          <Text style={styles.emptyStateText}>No Activities Found</Text>
          <Text style={styles.emptyStateSubtext}>
            The selected outdoor activities couldn't be loaded. Please go back and try selecting different activities.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Outdoor Activities</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <HomeButton />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          {progressRows[0].map((step, stepIndex) => (
            <React.Fragment key={step.key}>
              <View style={styles.progressStep}>
                <View style={[styles.progressStepActive]}>
                  {step.key === 'equipment' ? (
                    <Text style={styles.progressStepBadgeText}>{stepIndex + 1}</Text>
                  ) : (
                    <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={14} color="#000000" />
                  )}
                </View>
                <Text style={styles.progressStepText}>{step.text}</Text>
              </View>
              
              {stepIndex < progressRows[0].length - 1 && (
                <View style={styles.progressConnector} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Scrollable Workout Cards */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedWorkoutData.map((equipmentData, index) => {
          const workouts = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
          return (
            <WorkoutCard
              key={`${equipmentData.equipment}-${index}`}
              equipment={equipmentData.equipment}
              icon={equipmentData.icon}
              workouts={workouts}
              difficulty={difficulty}
              workoutType={workoutType}
              moodTitle={moodTitle}
              onStartWorkout={handleStartWorkout}
              isInCart={isInCart}
              createWorkoutId={createWorkoutId}
              handleAddToCart={handleAddToCart}
            />
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
  progressContainer: {
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  progressStep: {
    alignItems: 'center',
    width: 70,
    flex: 0,
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
  },
  progressStepBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 70,
    lineHeight: 12,
  },
  progressConnector: {
    width: 12,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 1,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 16,
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
    marginBottom: 25,
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
    overflow: 'visible',
  },
  equipmentIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  workoutList: {
    height: 380,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  workoutImageContainer: {
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'visible',
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
    zIndex: 10,
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
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  difficultyBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
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
  },
  workoutDescriptionContainer: {
    marginBottom: 15,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#ffffff',
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
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 0,
    marginBottom: 1,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: -6,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  dotsLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  addButtonWrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  addToCartButton: {
    backgroundColor: 'rgba(70, 70, 70, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  addToCartButtonAdded: {
    backgroundColor: 'rgba(70, 70, 70, 0.9)',
    borderColor: '#FFD700',
  },
  addToCartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addToCartButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFD700',
  },
});