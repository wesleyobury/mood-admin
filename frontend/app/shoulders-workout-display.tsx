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

// Shoulders workout database with all equipment types
const shouldersWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Basic Shoulder Press',
          duration: '15–18 min',
          description: `• Sit on bench with back support
          • Hold dumbbells at shoulder height
          • Press straight up, don't lock elbows completely
          • Lower slowly to shoulder level
          • Rest 90 seconds between sets
          
          • Lateral raises - arms at sides
          • Lift dumbbells to shoulder height
          • Control the descent
          
          • Rest 2 minutes between exercises`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Perfect starting intensity for building shoulder foundation',
          moodTips: [
            {
              icon: 'bulb-outline',
              title: 'Form Focus',
              description: 'Keep your core engaged and avoid arching your back during presses'
            },
            {
              icon: 'timer-outline',
              title: 'Rest Periods',
              description: 'Take longer rests between sets to maintain proper form'
            },
          ]
        },
      ],
      intermediate: [
        {
          name: 'Dynamic Shoulder Builder',
          duration: '25–28 min',
          description: `• Seated shoulder press - 4 sets
          • Press dumbbells overhead
          • Focus on slow, controlled movement
          • Rest 60 seconds between sets
          
          • Lateral raises - 3 sets
          • Slight bend in elbows
          • Lift to shoulder height
          
          • Rear delt flies - 3 sets
          • Bend forward at hips
          • Squeeze shoulder blades together
          
          • Rest 90 seconds between exercises`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Moderate intensity with varied movements for balanced development',
          moodTips: [
            {
              icon: 'flame-outline',
              title: 'Progressive Load',
              description: 'Increase weight gradually as you get stronger'
            },
            {
              icon: 'body-outline',
              title: 'Mind-Muscle',
              description: 'Focus on feeling the muscles work during each rep'
            },
          ]
        },
      ],
      advanced: [
        {
          name: 'Power Shoulder Complex',
          duration: '35–40 min',
          description: `• Military press - 5 sets
          • Stand with feet shoulder-width apart
          • Press overhead with strict form
          • Rest 45 seconds between sets
          
          • Arnold press - 4 sets
          • Start with palms facing you
          • Rotate as you press up
          
          • Lateral raise dropsets - 3 sets
          • Start heavy, drop weight twice
          • Push to muscle failure
          
          • Rest 2 minutes between exercises`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'High intensity for experienced lifters seeking maximum gains',
          moodTips: [
            {
              icon: 'flash-outline',
              title: 'Intensity Control',
              description: 'Use advanced techniques like dropsets and supersets'
            },
            {
              icon: 'checkmark-circle-outline',
              title: 'Form Check',
              description: 'Maintain perfect form even with heavier weights'
            },
          ]
        },
      ],
    },
  },
  // Placeholder for other equipment - we can add more later
  {
    equipment: 'Barbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Basic Barbell Press',
          duration: '20–25 min',
          description: `• Overhead press - 4 sets
          • Start with bar at shoulder level
          • Press straight up
          • Lower slowly to starting position
          • Rest 2 minutes between sets
          
          • Upright rows - 3 sets
          • Pull bar to chest level
          • Keep elbows high
          
          • Rest 90 seconds between exercises`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Foundation building with basic barbell movements',
          moodTips: [
            {
              icon: 'shield-outline',
              title: 'Safety First',
              description: 'Always use proper form with barbell exercises'
            },
            {
              icon: 'trending-up-outline',
              title: 'Progressive',
              description: 'Start light and add weight gradually'
            },
          ]
        },
      ],
      intermediate: [
        {
          name: 'Barbell Shoulder Power',
          duration: '30–35 min',
          description: `• Military press - 5 sets
          • Strict overhead press
          • Keep core tight
          • Rest 90 seconds between sets
          
          • Push press - 4 sets
          • Use slight leg drive
          • Focus on explosive movement
          
          • Barbell upright rows - 3 sets
          • Pull to upper chest
          • Control the negative
          
          • Rest 2 minutes between exercises`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Moderate to high intensity for strength building',
          moodTips: [
            {
              icon: 'flash-outline',
              title: 'Power Focus',
              description: 'Use explosive movements for strength gains'
            },
            {
              icon: 'fitness-outline',
              title: 'Compound Benefits',
              description: 'Barbell exercises work multiple muscle groups'
            },
          ]
        },
      ],
      advanced: [
        {
          name: 'Elite Barbell Sequence',
          duration: '40–45 min',
          description: `• Behind neck press - 5 sets
          • Use wide grip
          • Only if you have good mobility
          • Rest 2 minutes between sets
          
          • Clean and press - 4 sets
          • Full body movement
          • Focus on technique
          
          • High pulls - 4 sets
          • Explosive hip extension
          • Pull bar to chest level
          
          • Rest 3 minutes between exercises`,
          imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgABAwQFAgf/xAAsEAACAQMDAgUEAgMAAAAAAAABAgMABBEFEiEGMRNBUWFxFCKBkaGx8PEyUsH/xAAXAQEBAQEAAAAAAAAAAAAAAAAEBQMC/8QAHREAAgICAwEBAAAAAAAAAAAAAQIAEQMhEjFBBP/aAAwDAQACEQMRAD8A0NFsYdW0641HTZRJFHOysjDIZCCGU+4zzTZuBRj0P1vH0+buruoLa8trhh4to7bHkHhJehx8HAalJL/9f3J7K2gPgWm7Qvk3V6txb+IqQXERfBRBJgsG7CUjo7Tkez6+Y9Xw3nLZRdDdA3J6zKJtVtNNjt9zx/UzSMpGwHO1AeCftx5dxWQ8bpIrpIVdeCrDBH5oQ9FdYnqrRLjprUrH6fVbdnNvcTQhRIwGROCB9rgjPGCRjApNxbSKwMEeKBpNBOdqZ4qUJzStJvbKyEqMkHkfFOGBG4MMjuKGJc6HYKNS2pLK6n2aHMx/9yS0xU4+lB9p1Euk6Ve3AuYrfVXIiIZVWXaTtLLnKnBwCDWTQ4kMQlAOKKU0nPG/SQNXQG3//9k=',
          intensityReason: 'Elite level training for maximum strength and power',
          moodTips: [
            {
              icon: 'trophy-outline',
              title: 'Elite Training',
              description: 'Advanced movements require excellent technique'
            },
            {
              icon: 'warning-outline',
              title: 'Mobility Check',
              description: 'Ensure proper shoulder mobility before behind-neck presses'
            },
          ]
        },
      ],
    },
  },
];

export default function ShouldersWorkoutDisplayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Shoulders';
  const selectedEquipmentParam = params.equipment as string || '';
  const difficultyLevel = params.difficulty as string || 'beginner';

  // Decode and split equipment names
  const selectedEquipmentNames = decodeURIComponent(selectedEquipmentParam).split(',').filter(name => name.trim());

  // Filter workouts based on selected equipment
  const getWorkoutsForEquipment = () => {
    const filteredWorkouts: Workout[] = [];
    
    selectedEquipmentNames.forEach(equipmentName => {
      const equipmentData = shouldersWorkoutDatabase.find(eq => 
        eq.equipment.toLowerCase() === equipmentName.toLowerCase().trim()
      );
      
      if (equipmentData) {
        const workoutsForDifficulty = equipmentData.workouts[difficultyLevel as keyof typeof equipmentData.workouts];
        if (workoutsForDifficulty) {
          filteredWorkouts.push(...workoutsForDifficulty);
        }
      }
    });
    
    return filteredWorkouts;
  };

  const availableWorkouts = getWorkoutsForEquipment();

  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleStartWorkout = () => {
    if (selectedWorkout) {
      router.push({
        pathname: '/workout-guidance',
        params: {
          workoutName: selectedWorkout.name,
          workoutDescription: selectedWorkout.description,
          workoutDuration: selectedWorkout.duration,
          equipment: selectedEquipmentParam,
          difficulty: difficultyLevel,
          mood: moodTitle,
          workoutType: workoutType,
        }
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const getDifficultyColor = () => {
    switch (difficultyLevel) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#FFD700';
    }
  };

  const getDifficultyLabel = () => {
    return difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Shoulders Workouts</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Equipment and Difficulty Info */}
      <View style={styles.infoContainer}>
        <View style={styles.equipmentInfo}>
          <Text style={styles.infoLabel}>Equipment:</Text>
          <Text style={styles.infoText}>{selectedEquipmentNames.join(', ')}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={styles.difficultyText}>{getDifficultyLabel()}</Text>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {availableWorkouts.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Choose Your Workout</Text>
            <Text style={styles.sectionSubtitle}>
              Select a workout that matches your energy level and available time
            </Text>

            {availableWorkouts.map((workout, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.workoutCard,
                  selectedWorkout?.name === workout.name && styles.selectedWorkoutCard
                ]}
                onPress={() => handleWorkoutSelect(workout)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: workout.imageUrl }} style={styles.workoutImage} />
                <View style={styles.workoutContent}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <View style={styles.durationBadge}>
                      <Ionicons name="time-outline" size={16} color="#FFD700" />
                      <Text style={styles.durationText}>{workout.duration}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.workoutDescription}>{workout.description}</Text>
                  
                  <View style={styles.intensityContainer}>
                    <Text style={styles.intensityReason}>{workout.intensityReason}</Text>
                  </View>

                  {selectedWorkout?.name === workout.name && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
                      <Text style={styles.selectedText}>Selected</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="barbell-outline" size={48} color="#666" />
            <Text style={styles.noWorkoutsTitle}>No Workouts Available</Text>
            <Text style={styles.noWorkoutsText}>
              No workouts found for the selected equipment and difficulty level. Please go back and try different selections.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Start Workout Button */}
      {selectedWorkout && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
            <Ionicons name="play-circle" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      )}
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  equipmentInfo: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 24,
    lineHeight: 22,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  selectedWorkoutCard: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  workoutImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#222',
  },
  workoutContent: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  intensityContainer: {
    marginBottom: 12,
  },
  intensityReason: {
    fontSize: 13,
    color: '#FFD700',
    fontStyle: 'italic',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  selectedText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noWorkoutsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  startButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});