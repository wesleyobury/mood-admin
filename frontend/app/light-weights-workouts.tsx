import React, { useState, useRef, memo } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import HomeButton from '../components/HomeButton';
import { useCart, WorkoutItem } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Analytics } from '../utils/analytics';
import { lightWeightsDatabase } from '../data/light-weights-data';

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

// Use imported light weights workout database for cardio path
const workoutDatabase: EquipmentWorkouts[] = lightWeightsDatabase;


// Workout Card Component - defined outside to prevent recreation on parent re-renders
const WorkoutCard = React.memo(({ 
  equipment, 
  icon, 
  workouts, 
  difficulty,
  isInCart,
  createWorkoutId,
  handleAddToCart,
  onStartWorkout,
}: { 
  equipment: string; 
  icon: keyof typeof Ionicons.glyphMap; 
  workouts: Workout[]; 
  difficulty: string;
  isInCart: (workoutId: string) => boolean;
  createWorkoutId: (workout: Workout, equipment: string, difficulty: string) => string;
  handleAddToCart: (workout: Workout, equipment: string) => void;
  onStartWorkout: (workout: Workout, equipment: string, difficulty: string) => void;
}) => {
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

  console.log(`💪 WorkoutCard for ${equipment}: received ${workouts.length} workouts for ${difficulty} difficulty`);
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
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageGradient}
        />
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

        {/* Workout Description */}
        <View style={styles.workoutDescriptionContainer}>
          <Text style={styles.workoutDescription}>{item.description}</Text>
        </View>

        {/* Add Workout Button */}
        <Animated.View style={{ transform: [{ scale: localScaleAnim }] }}>
          <TouchableOpacity 
            style={styles.addWorkoutButton}
            onPress={() => handleAddToCartWithAnimation(item)}
            activeOpacity={0.8}
            disabled={isInCart(createWorkoutId(item, equipment, difficulty))}
          >
            <Ionicons 
              name={isInCart(createWorkoutId(item, equipment, difficulty)) ? "checkmark" : "add"} 
              size={18} 
              color="#FFD700"
            />
            <Text style={styles.addWorkoutButtonText}>
              {isInCart(createWorkoutId(item, equipment, difficulty)) ? "Added" : "Add workout"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
          <Ionicons name={icon} size={24} color="#FFD700" />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => onStartWorkout(workouts[currentWorkoutIndex], equipment, difficulty)}
          activeOpacity={0.8}
        >
          <Ionicons name="eye" size={14} color="#FFD700" />
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
      </View>

      {/* Workout List */}
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
          keyExtractor={(item, index) => `${equipment}-${difficulty}-${index}`}
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
});

const LightWeightsWorkoutsScreen = memo(function LightWeightsWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Parse URL parameters
  const moodTitle = params.mood as string || 'Sweat / burn fat';
  const workoutType = params.workoutType as string || 'Light weights';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse selected equipment from comma-separated string
  const selectedEquipmentNames = equipmentParam.split(',').filter(name => name.trim() !== '');
  
  console.log('Light Weights Debug:', {
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

  // Cart hooks (removed addedItems to prevent re-render issues)
  const { addToCart, isInCart } = useCart();
  const { token } = useAuth();

  const handleGoBack = () => {
    router.back();
  };

  // Regular function - not memoized to avoid circular dependency
  const createWorkoutId = (workout: Workout, equipment: string, difficulty: string) => {
    return `${workout.name}-${equipment}-${difficulty}`;
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

    // Track workout added to cart
    if (token) {
      Analytics.workoutAddedToCart(token, {
        workout_name: workout.name,
        mood_category: moodTitle,
        equipment: equipment,
      });
    }

    // Add to cart
    addToCart(workoutItem);
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

  // Create progress bar - single row with requested order
  const createProgressRows = () => {
    const steps = [
      { key: 'mood', icon: 'flame', text: moodTitle },
      { key: 'bodyPart', icon: 'barbell', text: workoutType },
      { key: 'difficulty', icon: 'speedometer', text: difficulty === 'intermediate' ? 'Intermed.' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `${selectedEquipmentNames.length} Equipment` },
    ];

    // Return single row
    return [steps];
  };

  // WorkoutCard component is defined outside the main component to prevent recreation

  if (selectedWorkoutData.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Light Weights</Text>
            <Text style={styles.headerSubtitle}>{moodTitle}</Text>
          </View>
          <HomeButton />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="barbell" size={64} color="rgba(255, 215, 0, 0.3)" />
          <Text style={styles.emptyStateText}>No workouts found for selected equipment</Text>
          <Text style={styles.emptyStateSubtext}>Try selecting different equipment options</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* Status bar background - covers the notch/status bar area */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: insets.top, 
        backgroundColor: '#000000', 
        zIndex: 100 
      }} />
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
          <Text style={styles.headerTitle}>Light Weights</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <HomeButton />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          <View style={styles.progressRow}>
            {createProgressRows()[0].map((step, stepIndex) => (
              <React.Fragment key={step.key}>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <Ionicons name={step.icon} size={10} color="#000000" />
                  </View>
                  <Text style={styles.progressStepText}>{step.text}</Text>
                </View>
                {stepIndex < createProgressRows()[0].length - 1 && (
                  <View style={styles.progressConnector} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>

      {/* Equipment Workout Cards */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {selectedWorkoutData.map((equipmentData, index) => {
          const workouts = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
          
          if (workouts.length === 0) {
            return null;
          }
          
          return (
            <WorkoutCard
              key={equipmentData.equipment}
              equipment={equipmentData.equipment}
              icon={equipmentData.icon}
              workouts={workouts}
              difficulty={difficulty}
              isInCart={isInCart}
              createWorkoutId={createWorkoutId}
              handleAddToCart={handleAddToCart}
              onStartWorkout={handleStartWorkout}
            />
          );
        })}
      </ScrollView>
      </SafeAreaView>
    </View>
  );
});

export default LightWeightsWorkoutsScreen;

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
    backgroundColor: '#000000',
    zIndex: 10,
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
    width: 28,
    height: 28,
    borderRadius: 14,
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
    marginHorizontal: 8,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
  scrollContentContainer: {
    paddingTop: 24,
    paddingBottom: 10,
    overflow: 'visible',
  },
  workoutCard: {
    marginBottom: 25,
    marginHorizontal: 24,
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
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  equipmentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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
    color: '#ffffff',
  },
  workoutList: {
    height: 330,
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
    overflow: 'hidden',
    position: 'relative',
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
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
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  swipeText: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '500',
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
    fontWeight: 'bold',
    color: '#ffffff',
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
    marginBottom: 12,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  addWorkoutButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 4,
  },
  addWorkoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  previewButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  previewButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: -6,
    backgroundColor: 'transparent',
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
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
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