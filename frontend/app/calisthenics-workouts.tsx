import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Workout {
  id: string;
  title: string;
  duration: string;
  intensity: string;
  summary: string;
  equipment: string;
  difficultyLevel: string;
  moodTip: string;
  battlePlan: string[];
}

// Placeholder workout data for each equipment type
const calisthenicsWorkouts: { [key: string]: { [key: string]: Workout[] } } = {
  'Pure bodyweight': {
    beginner: [
      {
        id: 'pb-beginner-1',
        title: 'Foundation Flow',
        duration: '15 min',
        intensity: 'Light',
        summary: 'Basic bodyweight movements to build fundamental strength',
        equipment: 'Pure bodyweight',
        difficultyLevel: 'beginner',
        moodTip: 'Focus on form and breathing. Every great calisthenics journey starts with these basics.',
        battlePlan: ['5 Push-ups', '10 Bodyweight squats', '30-second plank', '5 Lunges each leg', 'Rest 1 minute, repeat 3 rounds']
      },
    ],
    intermediate: [
      {
        id: 'pb-intermediate-1',
        title: 'Strength Builder',
        duration: '25 min',
        intensity: 'Moderate',
        summary: 'Progressive bodyweight exercises to develop strength and control',
        equipment: 'Pure bodyweight',
        difficultyLevel: 'intermediate',
        moodTip: 'Challenge yourself with perfect form. Quality over quantity builds real strength.',
        battlePlan: ['15 Push-ups', '20 Squats', '1-minute plank', '10 Burpees', 'Pike push-ups x8', 'Rest 90 seconds, repeat 4 rounds']
      },
    ],
    advanced: [
      {
        id: 'pb-advanced-1',
        title: 'Elite Mastery',
        duration: '35 min',
        intensity: 'High',
        summary: 'Advanced bodyweight skills and high-intensity movements',
        equipment: 'Pure bodyweight',
        difficultyLevel: 'advanced',
        moodTip: 'Push your limits. Advanced calisthenics is about mind-muscle mastery.',
        battlePlan: ['Archer push-ups x5 each', 'Pistol squats x5 each', '2-minute plank', 'Handstand holds 30s', 'Single-leg burpees', 'Rest 2 minutes, repeat 5 rounds']
      },
    ],
  },
  'Pull up bar': {
    beginner: [
      {
        id: 'pul-beginner-1',
        title: 'Upper Power Start',
        duration: '20 min',
        intensity: 'Light',
        summary: 'Build pulling strength with assisted and basic pull-up movements',
        equipment: 'Pull up bar',
        difficultyLevel: 'beginner',
        moodTip: 'Every pull-up master started with their first hang. Progress takes patience.',
        battlePlan: ['Dead hangs 15s x3', 'Negative pull-ups x5', 'Inverted rows x8', 'Assisted pull-ups x3', 'Rest 2 minutes between sets']
      },
    ],
    intermediate: [
      {
        id: 'pul-intermediate-1',
        title: 'Pull Progression',
        duration: '30 min',
        intensity: 'Moderate',
        summary: 'Structured pull-up training with variations',
        equipment: 'Pull up bar',
        difficultyLevel: 'intermediate',
        moodTip: 'Feel the power in your lats. Each pull-up builds both strength and confidence.',
        battlePlan: ['Pull-ups x8', 'Wide-grip pull-ups x5', 'Chin-ups x6', 'L-sits 20s x3', 'Hanging leg raises x10', 'Rest 90s between exercises']
      },
    ],
    advanced: [
      {
        id: 'pul-advanced-1',
        title: 'Pull Mastery',
        duration: '40 min',
        intensity: 'High',
        summary: 'Advanced pull-up variations and high-volume training',
        equipment: 'Pull up bar',
        difficultyLevel: 'advanced',
        moodTip: 'Dominate the bar. Advanced pulling is about explosive power and control.',
        battlePlan: ['Weighted pull-ups x5', 'Muscle-ups x3', 'Commando pull-ups x6', 'Typewriter pull-ups x4 each', 'Advanced L-sits 45s', 'Rest 3 minutes, repeat 4 rounds']
      },
    ],
  },
  // Add placeholder data for other equipment types
  'Parallel bars / dip station': {
    beginner: [
      {
        id: 'pb-beginner-1',
        title: 'Dip Foundation',
        duration: '18 min',
        intensity: 'Light',
        summary: 'Learn proper dip form and build tricep strength',
        equipment: 'Parallel bars / dip station',
        difficultyLevel: 'beginner',
        moodTip: 'Master the basics. Strong dips build incredible pushing power.',
        battlePlan: ['Supported dips x5', 'Dip negatives x8', 'L-sit holds 10s', 'Tricep dips x10', 'Rest 90s between sets']
      },
    ],
    intermediate: [
      {
        id: 'pb-intermediate-1',
        title: 'Parallel Power',
        duration: '28 min',
        intensity: 'Moderate',
        summary: 'Progressive dip training with advanced holds',
        equipment: 'Parallel bars / dip station',
        difficultyLevel: 'intermediate',
        moodTip: 'Feel the burn in your triceps. Each dip builds functional upper body strength.',
        battlePlan: ['Full dips x12', 'L-sits 30s x3', 'Knee raises x15', 'Dip holds 15s x3', 'Rest 2 minutes between sets']
      },
    ],
    advanced: [
      {
        id: 'pb-advanced-1',
        title: 'Elite Dips',
        duration: '38 min',
        intensity: 'High',
        summary: 'Advanced dip variations and high-intensity training',
        equipment: 'Parallel bars / dip station',
        difficultyLevel: 'advanced',
        moodTip: 'Push beyond limits. Advanced dips require both strength and mental focus.',
        battlePlan: ['Weighted dips x8', 'Handstand to dips x3', 'Advanced L-sits 60s', 'Russian dips x10', 'Rest 3 minutes, repeat 5 rounds']
      },
    ],
  },
};

const WorkoutCard = ({ 
  workout, 
  onPress 
}: { 
  workout: Workout;
  onPress: (workout: Workout) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => onPress(workout)}
      activeOpacity={0.8}
    >
      {/* Gold gradient at top */}
      <View style={styles.cardGradientTop} />
      
      <View style={styles.cardContent}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color="#FFD700" />
              <Text style={styles.metaText}>{workout.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="flash" size={14} color="#FFD700" />
              <Text style={styles.metaText}>{workout.intensity}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.workoutSummary}>{workout.summary}</Text>

        {/* Intensity reasoning with gold background */}
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityTitle}>MOOD TIP</Text>
          <Text style={styles.intensityText}>{workout.moodTip}</Text>
        </View>

        <View style={styles.battlePlanContainer}>
          <Text style={styles.battlePlanTitle}>BATTLE PLAN</Text>
          {workout.battlePlan.map((step, index) => (
            <View key={index} style={styles.battlePlanItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.battlePlanText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Swipe to explore section with gold gradient */}
      <View style={styles.swipeContainer}>
        <Text style={styles.swipeText}>Swipe to explore</Text>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
      
      {/* Gold gradient at bottom */}
      <View style={styles.cardGradientBottom} />
    </TouchableOpacity>
  );
};

export default function CalisthenicsWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  
  const mood = params.mood as string || 'I want to do calisthenics';
  const workoutType = params.workoutType as string || 'Bodyweight exercises';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';

  useEffect(() => {
    // Decode equipment parameter and get workouts for each equipment type
    const equipmentList = decodeURIComponent(equipmentParam).split(',');
    console.log('Equipment list:', equipmentList);
    console.log('Difficulty:', difficulty);
    
    const workouts: Workout[] = [];
    
    equipmentList.forEach(equipment => {
      const equipmentWorkouts = calisthenicsWorkouts[equipment.trim()];
      if (equipmentWorkouts && equipmentWorkouts[difficulty]) {
        workouts.push(...equipmentWorkouts[difficulty]);
      }
    });
    
    setSelectedWorkouts(workouts);
  }, [equipmentParam, difficulty]);

  const handleWorkoutSelect = (workout: Workout) => {
    console.log('Selected workout:', workout.title);
    // Navigate to workout detail screen (to be implemented)
  };

  const handleGoBack = () => {
    router.back();
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
          <Text style={styles.headerSubtitle}>{mood}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="body" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Calisthenics</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="checkmark" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Equipment</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Text style={styles.progressStepBadge}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Text>
            </View>
            <Text style={styles.progressStepText}>Difficulty</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={[styles.scrollView, { marginTop: 16 }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedWorkouts.length > 0 ? (
          selectedWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onPress={handleWorkoutSelect}
            />
          ))
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="fitness" size={48} color="rgba(255, 215, 0, 0.5)" />
            <Text style={styles.noWorkoutsText}>No workouts found for selected equipment and difficulty</Text>
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
    overflow: 'hidden',
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
  progressStepBadge: {
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
    paddingBottom: 40,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardGradientTop: {
    height: 4,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGradientBottom: {
    height: 4,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 20,
  },
  workoutHeader: {
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  workoutSummary: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 16,
  },
  intensityContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  intensityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  intensityText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  battlePlanContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  battlePlanTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  battlePlanItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginRight: 12,
    marginTop: 6,
  },
  battlePlanText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  swipeContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  swipeText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
  },
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});