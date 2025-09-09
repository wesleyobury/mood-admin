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

interface MuscleWorkout {
  name: string;
  duration: string;
  description: string;
  bodyPart: string;
  equipment: string;
  difficulty: string;
  reps: string;
  sets: string;
  restTime: string;
  imageUrl: string;
  intensityReason: string;
  moodTips: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
  }[];
}

// Sample muscle building workout database - this would be expanded significantly
const muscleWorkoutDatabase: MuscleWorkout[] = [
  // Chest Workouts
  {
    name: 'Barbell Bench Press',
    duration: '45-60 min',
    bodyPart: 'Chest',
    equipment: 'Barbells',
    difficulty: 'Intermediate',
    reps: '8-10',
    sets: '4',
    restTime: '2-3 min',
    description: 'Warm-up: 5 minutes light cardio + shoulder circles\nSet 1: 12 reps at 60% 1RM\nSet 2: 10 reps at 70% 1RM\nSet 3-4: 8 reps at 80% 1RM\nSuperset with incline dumbbell flyes\n3 sets x 12 reps\nFinish with push-ups to failure',
    imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxiZW5jaCUyMHByZXNzfGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
    intensityReason: 'Compound chest movement targeting pectorals, anterior deltoids, and triceps for maximum muscle activation and strength development.',
    moodTips: [
      {
        icon: 'body',
        title: 'Proper Setup',
        description: 'Plant feet firmly, squeeze shoulder blades together, and maintain natural arch in lower back throughout the movement.'
      },
      {
        icon: 'flash',
        title: 'Bar Path Control',
        description: 'Lower bar to chest with control, pause briefly, then press up in slight arc toward eyes rather than straight up.'
      }
    ]
  },
  {
    name: 'Dumbbell Chest Press',
    duration: '35-45 min',
    bodyPart: 'Chest',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    reps: '10-12',
    sets: '3',
    restTime: '90 sec',
    description: 'Warm-up: 5 minutes light movement\nSet 1: 12 reps moderate weight\nSet 2-3: 10 reps heavier weight\nIncline dumbbell press: 3 x 10\nChest flyes: 3 x 12\nCool down with chest stretches',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxkdW1iYmVsbCUyMGNoZXN0fGVufDB8fHx8MTc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
    intensityReason: 'Unilateral chest development allowing for greater range of motion and muscle stretch compared to barbell movements.',
    moodTips: [
      {
        icon: 'body',
        title: 'Range of Motion',
        description: 'Lower dumbbells until you feel a stretch in chest, press up with slight inward arc at top.'
      },
      {
        icon: 'refresh',
        title: 'Breathing Pattern',
        description: 'Inhale on the way down, exhale forcefully during the pressing phase for maximum power output.'
      }
    ]
  },
  // Back Workouts
  {
    name: 'Barbell Deadlift',
    duration: '50-65 min',
    bodyPart: 'Back',
    equipment: 'Barbells',
    difficulty: 'Advanced',
    reps: '5-6',
    sets: '5',
    restTime: '3-4 min',
    description: 'Warm-up: 10 minutes dynamic stretching + hip hinges\nSet 1: 8 reps at 60% 1RM\nSet 2: 6 reps at 70% 1RM\nSets 3-5: 5 reps at 85% 1RM\nAccessory: Bent-over rows 4 x 8\nLat pulldowns 3 x 10\nCore work: Planks 3 x 60 sec',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxkZWFkbGlmdHxlbnwwfHx8fDE3NTY4ODMyMzd8MA&ixlib=rb-4.0.1&q=85',
    intensityReason: 'King of compound movements targeting entire posterior chain including lats, traps, rhomboids, glutes, and hamstrings.',
    moodTips: [
      {
        icon: 'body',
        title: 'Hip Hinge Mastery',
        description: 'Initiate movement by pushing hips back, keep bar close to legs, and drive through heels to stand up.'
      },
      {
        icon: 'flash',
        title: 'Core Bracing',
        description: 'Take deep breath at top, brace core like someone will punch your stomach, maintain rigidity throughout lift.'
      }
    ]
  },
  // Arms Workouts
  {
    name: 'Barbell Bicep Curls',
    duration: '25-35 min',
    bodyPart: 'Arms',
    equipment: 'Barbells',
    difficulty: 'Beginner',
    reps: '10-12',
    sets: '4',
    restTime: '60-90 sec',
    description: 'Warm-up: Arm circles and light stretching\nBarbell curls: 4 x 10-12\nHammer curls: 3 x 12\nOverhead tricep extension: 4 x 10\nClose-grip push-ups: 3 x max reps\nArm stretches: 5 minutes',
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxiaWNlcCUyMGN1cmxzfGVufDB8fHx8MVc1Njg4MzIzN3ww&ixlib=rb-4.0.1&q=85',
    intensityReason: 'Isolated bicep development focusing on progressive overload and muscle hypertrophy through controlled movements.',
    moodTips: [
      {
        icon: 'body',
        title: 'Elbow Stability',
        description: 'Keep elbows close to sides, avoid swinging or using momentum, focus on slow controlled movement.'
      },
      {
        icon: 'refresh',
        title: 'Mind-Muscle Connection',
        description: 'Squeeze biceps at top of movement, control the negative phase slowly for maximum muscle activation.'
      }
    ]
  },
  // Legs Workouts
  {
    name: 'Barbell Back Squat',
    duration: '55-70 min',
    bodyPart: 'Legs',
    equipment: 'Barbells',
    difficulty: 'Intermediate',
    reps: '8-10',
    sets: '4',
    restTime: '2-3 min',
    description: 'Warm-up: 10 minutes dynamic leg swings + bodyweight squats\nBack squats: 4 x 8-10\nBulgarian split squats: 3 x 10 each leg\nRomanian deadlifts: 3 x 12\nWalking lunges: 3 x 20\nCalf raises: 4 x 15\nLeg stretches: 10 minutes',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw1fHxzcXVhdHN8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.0.1&q=85',
    intensityReason: 'Compound leg movement targeting quadriceps, glutes, hamstrings, and core for maximum lower body development.',
    moodTips: [
      {
        icon: 'body',
        title: 'Depth and Form',
        description: 'Descend until hip crease is below knee cap, keep chest up and knees tracking over toes.'
      },
      {
        icon: 'flash',
        title: 'Drive Through Heels',
        description: 'Initiate upward movement by driving through heels and pushing floor away, engage glutes at top.'
      }
    ]
  }
];

export default function MuscleWorkoutDisplayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const { mood, bodyParts, equipment, difficulty } = params;
  const bodyPartsList = typeof bodyParts === 'string' ? bodyParts.split(',') : [];
  const equipmentList = typeof equipment === 'string' ? equipment.split(',') : [];

  // Filter workouts based on selected criteria
  const filteredWorkouts = muscleWorkoutDatabase.filter(workout => {
    const matchesBodyPart = bodyPartsList.some(part => 
      workout.bodyPart.toLowerCase() === part.toLowerCase()
    );
    const matchesEquipment = equipmentList.some(equip => 
      workout.equipment.toLowerCase().includes(equip.toLowerCase())
    );
    const matchesDifficulty = workout.difficulty.toLowerCase() === difficulty?.toString().toLowerCase();
    
    return matchesBodyPart && matchesEquipment && matchesDifficulty;
  });

  const handleStartWorkout = (workout: MuscleWorkout) => {
    const moodTipsParam = encodeURIComponent(JSON.stringify(workout.moodTips));
    
    router.push({
      pathname: '/workout-guidance',
      params: {
        workoutName: workout.name,
        equipment: workout.equipment,
        description: workout.description,
        duration: workout.duration,
        workoutType: 'Muscle Building',
        moodTips: moodTipsParam,
        reps: workout.reps,
        sets: workout.sets,
        restTime: workout.restTime,
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (filteredWorkouts.length === 0) {
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
            We couldn't find workouts for your selected criteria. Try different body parts or equipment options.
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
        <Text style={styles.headerTitle}>Your Workouts</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.progressBar}>
            <View style={styles.progressStep}>
              <Text style={styles.progressText}>{mood}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
            <View style={styles.progressStep}>
              <Text style={styles.progressText}>{bodyPartsList.join(', ')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
            <View style={styles.progressStep}>
              <Text style={styles.progressText}>Equipment ({equipmentList.length})</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
            <View style={[styles.progressStep, styles.activeStep]}>
              <Text style={[styles.progressText, styles.activeProgressText]}>{difficulty}</Text>
            </View>
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
          {filteredWorkouts.length} personalized muscle building workout{filteredWorkouts.length > 1 ? 's' : ''} ready for you
        </Text>

        {filteredWorkouts.length > 1 && (
          <View style={styles.workoutIndicator}>
            <Text style={styles.indicatorText}>
              {currentWorkoutIndex + 1}/{filteredWorkouts.length}
            </Text>
          </View>
        )}

        {filteredWorkouts.map((workout, index) => (
          <View key={index} style={styles.workoutCard}>
            <Image source={{ uri: workout.imageUrl }} style={styles.workoutImage} />
            
            <View style={styles.workoutInfo}>
              <View style={styles.workoutHeader}>
                <View style={styles.workoutTitleContainer}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <View style={styles.bodyPartBadge}>
                    <Text style={styles.bodyPartText}>{workout.bodyPart}</Text>
                  </View>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{workout.difficulty}</Text>
                </View>
              </View>

              <View style={styles.workoutMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={16} color="#FFD700" />
                  <Text style={styles.metaText}>{workout.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="fitness" size={16} color="#FFD700" />
                  <Text style={styles.metaText}>{workout.sets} sets</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="repeat" size={16} color="#FFD700" />
                  <Text style={styles.metaText}>{workout.reps} reps</Text>
                </View>
              </View>

              <Text style={styles.intensityReason}>{workout.intensityReason}</Text>

              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => handleStartWorkout(workout)}
              >
                <Text style={styles.startButtonText}>Start Workout</Text>
                <Ionicons name="play" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStep: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  activeStep: {
    backgroundColor: '#FFD700',
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  activeProgressText: {
    color: '#000',
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