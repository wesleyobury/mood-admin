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

// Basic abs workout database - this will be expanded later
const absWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Ab Roller',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Basic Ab Rollout',
          duration: '8–10 min',
          description: 'Foundational core strengthening with controlled range\n ',
          battlePlan: '3 rounds\n• 8–10 Ab Rollouts (Knees)\nRest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Kneeling position reduces load for safe learning',
          moodTips: [
            {
              icon: 'construct',
              title: 'Start on knees, roll slowly forward',
              description: 'Proper positioning ensures safety and proper muscle activation.'
            },
            {
              icon: 'shield',
              title: 'Keep core tight, avoid lower back arch',
              description: 'Maintain proper form to protect your lower back.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Advanced Ab Rollout',
          duration: '12–14 min',
          description: 'Increased range and intensity for core development\n ',
          battlePlan: '3 rounds\n• 10–12 Full Ab Rollouts\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Full range challenges entire core stability',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Extend further forward, maintain control',
              description: 'Greater range of motion increases muscle activation.'
            },
            {
              icon: 'construct',
              title: 'Pull back with core, not momentum',
              description: 'Focus on core strength to return to starting position.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Standing Ab Rollout',
          duration: '14–16 min',
          description: 'Maximum challenge with standing position\n ',
          battlePlan: '4 rounds\n• 6–8 Standing Ab Rollouts\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Standing position creates maximum core challenge',
          moodTips: [
            {
              icon: 'flash',
              title: 'Start standing, roll out slowly',
              description: 'Standing position dramatically increases difficulty.'
            },
            {
              icon: 'shield',
              title: 'Perfect form essential for safety',
              description: 'Advanced movement requires excellent technique.'
            }
          ]
        }
      ]
    }
  }
];

export default function AbsWorkoutDisplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Abs';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse equipment from params
  const selectedEquipmentNames = equipmentParam 
    ? decodeURIComponent(equipmentParam).split(',')
    : [];

  // Filter workouts based on selected equipment
  const relevantWorkouts = absWorkoutDatabase.filter(equipmentWorkouts => 
    selectedEquipmentNames.includes(equipmentWorkouts.equipment)
  );

  const handleWorkoutSelect = (workout: Workout, equipment: string) => {
    console.log('Selected workout:', workout.name);
    
    router.push({
      pathname: '/workout-guidance',
      params: {
        workoutName: workout.name,
        equipment: equipment,
        description: workout.description,
        battlePlan: workout.battlePlan,
        duration: workout.duration,
        difficulty: difficulty,
        workoutType: workoutType,
        moodTips: encodeURIComponent(JSON.stringify(workout.moodTips))
      }
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  if (relevantWorkouts.length === 0) {
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
            <Text style={styles.headerTitle}>No Workouts Found</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.noWorkoutsContainer}>
          <Text style={styles.noWorkoutsText}>
            No workouts available for the selected equipment.
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
          <Text style={styles.headerTitle}>Abs Workouts</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressContent}
        >
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="flame" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="fitness" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{workoutType}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Text style={styles.progressStepNumber}>
                {selectedEquipmentNames.length}
              </Text>
            </View>
            <Text style={styles.progressStepText}>
              Equipment ({selectedEquipmentNames.length})
            </Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="checkmark" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {relevantWorkouts.map((equipmentWorkouts) => {
          const workoutsForDifficulty = equipmentWorkouts.workouts[difficulty as keyof typeof equipmentWorkouts.workouts] || [];
          
          return (
            <View key={equipmentWorkouts.equipment} style={styles.section}>
              <Text style={styles.equipmentTitle}>
                {equipmentWorkouts.equipment}
              </Text>
              
              <View style={styles.workoutGrid}>
                {workoutsForDifficulty.map((workout, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.workoutCard}
                    onPress={() => handleWorkoutSelect(workout, equipmentWorkouts.equipment)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: workout.imageUrl }}
                      style={styles.workoutImage}
                      resizeMode="cover"
                    />
                    <View style={styles.workoutCardContent}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={styles.workoutDuration}>{workout.duration}</Text>
                      <Text style={styles.workoutDescription} numberOfLines={2}>
                        {workout.description.replace(/\n/g, ' ').trim()}
                      </Text>
                    </View>
                    <View style={styles.workoutCardActions}>
                      <Ionicons name="play-circle" size={32} color="#FFD700" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
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
    minWidth: 80,
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
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  progressStepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressStepText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 80,
  },
  progressConnector: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 8,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  equipmentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  workoutGrid: {
    gap: 16,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutImage: {
    width: 80,
    height: 80,
    backgroundColor: '#333333',
  },
  workoutCardContent: {
    flex: 1,
    padding: 16,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  workoutDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  workoutCardActions: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noWorkoutsText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
});