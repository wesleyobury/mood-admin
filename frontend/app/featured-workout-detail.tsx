import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define the workout data for each featured workout
const featuredWorkoutData: Record<string, {
  mood: string;
  title: string;
  duration: string;
  image: string;
  exercises: {
    equipment: string;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[];
}> = {
  '1': {
    mood: 'I Want to Sweat',
    title: 'Cardio Based',
    duration: '25–35 min',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    exercises: [
      { equipment: 'Stationary Bike', name: 'Hill & Sprint', icon: 'bicycle' },
      { equipment: 'Stair Master', name: 'Hill Climb', icon: 'trending-up' },
    ],
  },
  '2': {
    mood: 'Muscle Gainer',
    title: 'Back & Bis Volume',
    duration: '35–45 min',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop',
    exercises: [
      { equipment: 'Adjustable Bench', name: 'Chest Support Row', icon: 'fitness' },
      { equipment: 'T-Bar Row Machine', name: 'Slow Neg Row', icon: 'barbell' },
      { equipment: 'Straight Pull Up Bar', name: 'Pull Up + Hold', icon: 'body' },
      { equipment: 'Cable Machine', name: 'Cable Negatives', icon: 'git-pull-request' },
      { equipment: 'EZ Curl Bar', name: 'Narrow Curl', icon: 'barbell' },
    ],
  },
  '3': {
    mood: 'Build Explosion',
    title: 'Power Lifting',
    duration: '30–40 min',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
    exercises: [
      { equipment: 'Power Lifting Platform', name: 'Hang Clean Pull to Tall Shrug', icon: 'flash' },
      { equipment: 'Power Lifting Platform', name: 'Push Press Launch', icon: 'arrow-up' },
      { equipment: 'Trap Hex Bar', name: 'Trap Bar Jump', icon: 'trending-up' },
      { equipment: 'Landmine Attachment', name: 'Hacksquat Jump', icon: 'flame' },
    ],
  },
  '4': {
    mood: 'Calisthenics',
    title: 'Pulls & Dips',
    duration: '25–35 min',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    exercises: [
      { equipment: 'Pull Up Bar', name: 'Eccentric Lines', icon: 'body' },
      { equipment: 'Pull Up Bar', name: 'Strict Pull', icon: 'arrow-up' },
      { equipment: 'Parallel Bars Dip Station', name: 'Eccentric Power', icon: 'fitness' },
    ],
  },
  '5': {
    mood: 'Get Outside',
    title: 'Hill Workout',
    duration: '30–40 min',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop',
    exercises: [
      { equipment: 'Hills', name: 'Power Mix', icon: 'trail-sign' },
      { equipment: 'Hills', name: 'Sprint Only 30s', icon: 'speedometer' },
    ],
  },
};

export default function FeaturedWorkoutDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedExercises, setSelectedExercises] = useState<Set<number>>(new Set());
  
  const workoutId = params.id as string;
  const workout = featuredWorkoutData[workoutId];
  
  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Workout not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleExercise = (index: number) => {
    const newSelected = new Set(selectedExercises);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedExercises(newSelected);
  };

  const selectAll = () => {
    const allIndices = new Set(workout.exercises.map((_, i) => i));
    setSelectedExercises(allIndices);
  };

  const clearAll = () => {
    setSelectedExercises(new Set());
  };

  return (
    <View style={styles.container}>
      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: workout.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        
        {/* Back Button */}
        <TouchableOpacity 
          style={[styles.headerBackButton, { top: insets.top + 10 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        {/* Hero Content */}
        <View style={styles.heroContent}>
          <Text style={styles.moodLabel}>{workout.mood}</Text>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={14} color="#FFD700" />
            <Text style={styles.durationText}>{workout.duration}</Text>
          </View>
        </View>
      </View>

      {/* Exercise List */}
      <View style={styles.contentContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercises ({workout.exercises.length})</Text>
          <View style={styles.selectionButtons}>
            <TouchableOpacity onPress={selectAll} style={styles.selectionBtn}>
              <Text style={styles.selectionBtnText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearAll} style={styles.selectionBtn}>
              <Text style={styles.selectionBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.exerciseList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {workout.exercises.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.exerciseCard,
                selectedExercises.has(index) && styles.exerciseCardSelected,
              ]}
              onPress={() => toggleExercise(index)}
              activeOpacity={0.7}
            >
              <View style={styles.exerciseIconContainer}>
                <Ionicons 
                  name={exercise.icon} 
                  size={24} 
                  color={selectedExercises.has(index) ? '#000' : '#FFD700'} 
                />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={[
                  styles.exerciseEquipment,
                  selectedExercises.has(index) && styles.exerciseTextSelected,
                ]}>
                  {exercise.equipment}
                </Text>
                <Text style={[
                  styles.exerciseName,
                  selectedExercises.has(index) && styles.exerciseTextSelected,
                ]}>
                  {exercise.name}
                </Text>
              </View>
              <View style={[
                styles.checkbox,
                selectedExercises.has(index) && styles.checkboxSelected,
              ]}>
                {selectedExercises.has(index) && (
                  <Ionicons name="checkmark" size={18} color="#000" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            {selectedExercises.size} of {workout.exercises.length} selected
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.startButton,
            selectedExercises.size === 0 && styles.startButtonDisabled,
          ]}
          disabled={selectedExercises.size === 0}
          onPress={() => {
            // Navigate to workout session with selected exercises
            const selectedExerciseData = Array.from(selectedExercises).map(i => workout.exercises[i]);
            router.push({
              pathname: '/workout-session',
              params: {
                mood: workout.mood,
                title: workout.title,
                exercises: JSON.stringify(selectedExerciseData),
              },
            });
          }}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  heroContainer: {
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerBackButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  moodLabel: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  workoutTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  durationText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  selectionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  selectionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectionBtnText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseCardSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  exerciseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseEquipment: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exerciseName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  exerciseTextSelected: {
    color: '#000',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCount: {
    flex: 1,
  },
  selectedCountText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  startButtonDisabled: {
    opacity: 0.4,
  },
  startButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
