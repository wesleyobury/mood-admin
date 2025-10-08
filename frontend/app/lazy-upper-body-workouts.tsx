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

// Upper body workout database with assault bike workouts
const upperBodyWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Assault Bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Breeze Pedal',
          duration: '8–10 min',
          description: 'Light pace, gentle arm swing, calm nasal–mouth breathing.',
          battlePlan: '1 set\n• 8–10 min Easy (RPE 3)',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Easy spin moves blood with very low systemic stress.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Soft grip',
              description: 'Soft grip; shoulders down; even strokes'
            },
            {
              icon: 'chatbubble',
              title: 'Stay conversational',
              description: 'Keep RPE ~3; stay conversational'
            }
          ]
        }
      ],
      intermediate: [],
      advanced: []
    }
  }
];

export default function LazyUpperBodyWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const moodTitle = "I'm feeling lazy";
  const workoutType = 'Lift weights';
  const bodyPart = 'Upper body';
  const difficulty = 'beginner';
  
  // Get workout data
  const selectedEquipmentNames = ['Assault Bike'];
  const workoutDatabase = upperBodyWorkoutDatabase;

  const handleStartWorkout = (workout: Workout, equipment: string) => {
    try {
      console.log('✅ Starting workout navigation with params:', {
        workoutName: workout.name,
        equipment: equipment,
        description: workout.description,
        battlePlan: workout.battlePlan,
        duration: workout.duration,
        difficulty: difficulty,
        workoutType: workoutType,
      });
      
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
      { key: 'mood', icon: 'bed', text: moodTitle },
      { key: 'bodyPart', icon: 'barbell', text: workoutType },
      { key: 'difficulty', icon: 'body', text: bodyPart },
      { key: 'equipment', icon: 'construct', text: `${selectedEquipmentNames.length} Equipment` },
    ];

    // Return single row
    return [steps];
  };

  // Workout Card Component matching bodyweight explosiveness format exactly
  const WorkoutCard = ({ equipment, icon, workouts, difficulty }: { 
    equipment: string; 
    icon: keyof typeof Ionicons.glyphMap; 
    workouts: Workout[]; 
    difficulty: string;
  }) => {
    const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

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
            <Text style={styles.intensityReason}>{item.intensityReason}</Text>
          </View>

          {/* Workout Description */}
          <Text style={styles.workoutDescription}>{item.description}</Text>

          {/* Start Workout Button */}
          <TouchableOpacity 
            style={styles.startWorkoutButton}
            onPress={() => handleStartWorkout(item, equipment)}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={20} color="#000000" />
            <Text style={styles.startWorkoutText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    // Touch handling for swiping
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const onTouchStart = (e: any) => {
      setTouchEnd(null);
      setTouchStart(e.nativeEvent.pageX);
    };

    const onTouchMove = (e: any) => {
      setTouchEnd(e.nativeEvent.pageX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;
      
      if (isLeftSwipe && currentWorkoutIndex < workouts.length - 1) {
        setCurrentWorkoutIndex(currentWorkoutIndex + 1);
      }
      if (isRightSwipe && currentWorkoutIndex > 0) {
        setCurrentWorkoutIndex(currentWorkoutIndex - 1);
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

        {/* Workout List with Touch Swiping */}
        <View 
          style={[styles.workoutList, { height: 380 }]}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <FlatList
            ref={flatListRef}
            data={workouts}
            renderItem={renderWorkout}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideSize = width - 48;
              const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
              setCurrentWorkoutIndex(index);
            }}
            initialScrollIndex={currentWorkoutIndex}
            getItemLayout={(data, index) => ({
              length: width - 48,
              offset: (width - 48) * index,
              index,
            })}
            keyExtractor={(item, index) => `${equipment}-${difficulty}-${index}`}
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
                  styles.dot,
                  index === currentWorkoutIndex && styles.activeDot
                ]}
                onPress={() => {
                  setCurrentWorkoutIndex(index);
                  if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({ index, animated: true });
                  }
                }}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  const progressRows = createProgressRows();

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
        {progressRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.progressRow}>
            {row.map((step, stepIndex) => (
              <React.Fragment key={step.key}>
                <View style={styles.progressStep}>
                  <View style={styles.progressStepActive}>
                    <Ionicons name={step.icon} size={12} color="#000000" />
                  </View>
                  <Text style={styles.progressStepText}>{step.text}</Text>
                </View>
                {stepIndex < row.length - 1 && <View style={styles.progressConnector} />}
              </React.Fragment>
            ))}
          </View>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Generate workout cards for selected equipment */}
        {workoutDatabase.map((equipmentData) => {
          const workoutsForDifficulty = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
          
          if (workoutsForDifficulty.length === 0) {
            return null;
          }

          return (
            <WorkoutCard
              key={equipmentData.equipment}
              equipment={equipmentData.equipment}
              icon={equipmentData.icon}
              workouts={workoutsForDifficulty}
              difficulty={difficulty}
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
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 6,
  },
  progressStepText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 60,
    lineHeight: 11,
  },
  progressConnector: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  selectionInfo: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  selectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  selectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  equipmentSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  equipmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  equipmentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  workoutsContainer: {
    marginBottom: 20,
  },
  workoutsList: {
    paddingLeft: 0,
    paddingRight: 24,
  },
  workoutSlide: {
    width: width - 48,
    marginRight: 16,
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
    shadowRadius: 15,
    elevation: 8,
  },
  workoutContent: {
    padding: 24,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  workoutDuration: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  workoutDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 20,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intensityBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  intensityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  intensityReason: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  swipeIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  swipeIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  swipeIndicatorDotActive: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  moodTipsSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  moodTipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  moodTipsSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    lineHeight: 22,
  },
  moodTipsGrid: {
    gap: 16,
  },
  moodTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  moodTipIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  moodTipContent: {
    flex: 1,
  },
  moodTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  moodTipDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
});