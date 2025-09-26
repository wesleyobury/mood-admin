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

// Back workout database - placeholder structure for now, will be populated with actual workouts later
const backWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Adjustable bench',
    icon: 'trending-up-outline',
    workouts: {
      beginner: [
        {
          name: 'Row Foundation',
          duration: '12–15 min',
          description: 'Supported rows and reverse fly for\nback strength and posture.\n ',
          battlePlan: '• 3 rounds:\n• 12 supported single-arm row\n• 10 reverse fly\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to back rowing and posterior chain.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Row: Pull elbow behind torso',
              description: 'Focus on squeezing shoulder blade toward spine for lat activation.'
            },
            {
              icon: 'body',
              title: 'Reverse fly: Keep slight bend in arms',
              description: 'Target rear delts and improve posture with controlled motion.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Back Power',
          duration: '15–18 min',
          description: 'Incline rows and chest-supported movements\nfor intermediate back development.\n ',
          battlePlan: '• 4 rounds:\n• 10 incline dumbbell row\n• 8 chest-supported reverse fly\n• 12 prone Y-raises\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive back training with multiple angles and planes.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Incline row: Pull to lower ribs',
              description: 'Target different lat fibers with varied pull angles.'
            },
            {
              icon: 'flash',
              title: 'Y-raises: Thumbs up toward ceiling',
              description: 'Activates lower traps and improves shoulder stability.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Back Complex',
          duration: '18–22 min',
          description: 'Advanced rowing complex with\nvariations for complete development.\n ',
          battlePlan: '• 3 rounds:\n• 8 heavy single-arm row\n• 10 incline row\n• 8 reverse fly\n• 12 prone T-raises\n• Rest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced back complex for maximum posterior development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Heavy rows: Control the negative',
              description: 'Slow eccentric phase builds strength and muscle mass.'
            },
            {
              icon: 'construct',
              title: 'T-raises: Focus on mid-trap activation',
              description: 'Target often-neglected middle trapezius for complete development.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbell',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Row & Deadlift',
          duration: '14–16 min',
          description: 'Rows and deadlifts develop base power\nand muscle control.\n ',
          battlePlan: '3 rounds:\n• 10 Barbell Bent-Over Row\nRest 60–75s after each set\n• 10 Barbell Deadlift\nRest 60–75s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds foundational back strength with compound lifts.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace core, hinge hips, maintain flat back',
              description: 'Proper spine alignment protects back on all lifts.'
            },
            {
              icon: 'flash',
              title: 'Tight lats protect spine',
              description: 'Lat engagement improves pulling strength and safety.'
            }
          ]
        },
        {
          name: 'Row Flow Combo',
          duration: '12–14 min',
          description: 'Combines row grips and good mornings\nfor total back work.\n ',
          battlePlan: '3 rounds:\n• 10 Bent-Over Row\n• 10 Underhand Grip Row\n• 10 Barbell Good Morning\nRest 60–75s after completing the full sequence',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Varied grip rowing boosts muscular activation volume.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Transition smoothly between grips',
              description: 'Don\'t rush form between grip changes for better activation.'
            },
            {
              icon: 'body',
              title: 'Drive hips back, spine neutral',
              description: 'Proper hip hinge pattern during good mornings.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Pendlay + RDL',
          duration: '16–18 min',
          description: 'Pendlay rows and RDLs balance power\nwith hamstring load.\n ',
          battlePlan: '4 rounds:\n• 8 Pendlay Row\nRest 75–90s after each set\n• 10 Romanian Deadlift\nRest 75–90s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive pulls and slow RDLs strengthen full posterior.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Reset back tightness between Pendlay reps',
              description: 'Dead stop allows full lat engagement each rep.'
            },
            {
              icon: 'timer',
              title: 'Lower bar under control',
              description: 'Control eccentric to fully stretch hamstrings.'
            }
          ]
        },
        {
          name: 'Row Shrug Flow',
          duration: '16–18 min',
          description: 'Multi-grip rows, shrugs, deads build\ntraps and mid-back.\n ',
          battlePlan: '3 rounds:\n• 8 Bent-Over Row\n• 8 Reverse-Grip Row\n• 8 Barbell Shrugs\n• 8 Deadlift\nRest 90s after finishing the full circuit',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Combo of rows, shrugs, and deads creates dense fatigue.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Squeeze shrugs hard for one second',
              description: 'Peak contraction at top maximizes trap activation.'
            },
            {
              icon: 'construct',
              title: 'Stabilize posture before transitioning',
              description: 'Reset form between exercises for safety and effectiveness.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Barbell',
          duration: '20–22 min',
          description: 'Rows, deads, shrugs overload traps\nand spinal erectors.\n ',
          battlePlan: '4 rounds:\n• 8 Barbell Bent-Over Row\nRest 90–120s after each set\n• 8 Barbell Deadlift\nRest 90–120s after each set\n• 8 Barbell Shrug\nRest 90–120s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Higher volume heavy lifts establish raw size and mass.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Control eccentric for time under tension',
              description: 'Slow lowering phase builds strength and muscle mass.'
            },
            {
              icon: 'trending-up',
              title: 'Drive hips and traps through lockouts',
              description: 'Complete range of motion for maximum development.'
            }
          ]
        },
        {
          name: 'Power Complex',
          duration: '20–22 min',
          description: 'Row, high pull, and clean complex\nmaximizes back output.\n ',
          battlePlan: '4 rounds:\n• 8 Barbell Row\n• 8 Barbell High Pull\n• 8 Barbell Power Clean\nRest 90–120s after completing the full sequence',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive high pulls and cleans target power capacity.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Keep elbows leading bar path',
              description: 'Proper elbow position in high pulls for maximum power.'
            },
            {
              icon: 'flash',
              title: 'Explode hips to drive bar fast',
              description: 'Hip drive generates power for explosive cleans.'
            }
          ]
        }
      ]
    }
  }
  // TODO: Add remaining equipment types (Grip variation pull up bar, Kettle bells, etc.)
  // This is a placeholder structure - full equipment database will be implemented later
];

export default function BackWorkoutDisplay() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Back';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse selected equipment from URL parameter
  const selectedEquipment = equipmentParam ? 
    decodeURIComponent(equipmentParam).split(',').map(eq => eq.trim()) : 
    [];

  // Filter workout database based on selected equipment
  const userWorkouts = backWorkoutDatabase.filter(equipmentGroup => 
    selectedEquipment.includes(equipmentGroup.equipment)
  );

  const currentWorkout = userWorkouts[currentWorkoutIndex];
  const workoutsForDifficulty = currentWorkout?.workouts[difficulty as keyof typeof currentWorkout.workouts] || [];

  const handleGoBack = () => {
    router.back();
  };

  const handleStartWorkout = (workout: Workout) => {
    console.log('🚀 Starting back workout:', workout.name);
    
    try {
      // Navigate to workout guidance with back workout data
      const moodTipsCount = workout.moodTips?.length || 0;
      
      router.push({
        pathname: '/workout-guidance',
        params: {
          workoutName: workout.name,
          equipment: currentWorkout.equipment,
          description: workout.battlePlan,
          duration: workout.duration,
          moodTipsCount: moodTipsCount.toString(),
          mood: moodTitle,
          workoutType: workoutType,
          difficulty: difficulty,
          intensityReason: workout.intensityReason
        }
      });
      
      console.log('✅ Back workout navigation completed');
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
  };

  const handleSwipeLeft = () => {
    if (currentWorkoutIndex < userWorkouts.length - 1) {
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
      console.log('👉 Swiped left, changing to workout index:', currentWorkoutIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(currentWorkoutIndex - 1);
      console.log('👈 Swiped right, changing to workout index:', currentWorkoutIndex - 1);
    }
  };

  if (userWorkouts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>No Workouts Found</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={64} color="#FFD700" />
          <Text style={styles.emptyStateText}>
            No workouts available for the selected back equipment.
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Please try selecting different equipment or check back later.
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
          <Text style={styles.headerTitle}>Back Workouts</Text>
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
          
          {userWorkouts.map((workout, index) => (
            <React.Fragment key={`progress-${workout.equipment}`}>
              <View style={styles.progressStep}>
                <View style={styles.progressStepActive}>
                  <Ionicons name={workout.icon} size={14} color="#000000" />
                </View>
                <Text style={styles.progressStepText}>{workout.equipment}</Text>
              </View>
              {index < userWorkouts.length - 1 && <View style={styles.progressConnector} />}
            </React.Fragment>
          ))}
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="checkmark" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Text>
          </View>
        </ScrollView>
      </View>

      {/* Workout Cards */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.workoutSection}>
          <Text style={styles.sectionTitle}>Your Back Workouts</Text>
          <Text style={styles.sectionSubtitle}>
            {userWorkouts.length} equipment • {workoutsForDifficulty.length} workouts
          </Text>
          
          {/* Workout Indicator */}
          {userWorkouts.length > 1 && (
            <Text style={styles.workoutIndicator}>
              {currentWorkoutIndex + 1}/{userWorkouts.length}
            </Text>
          )}

          {currentWorkout && (
            <View style={styles.workoutCardContainer}>
              <Text style={styles.equipmentTitle}>{currentWorkout.equipment}</Text>
              
              {/* Render workout cards for current equipment */}
              {workoutsForDifficulty.map((workout, workoutIndex) => (
                <View key={`${currentWorkout.equipment}-${workoutIndex}`} style={styles.workoutCard}>
                  <Image source={{ uri: workout.imageUrl }} style={styles.workoutImage} />
                  
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.workoutDuration}>{workout.duration}</Text>
                    
                    <View style={styles.workoutDescription}>
                      <Text style={styles.workoutDescriptionText}>{workout.description}</Text>
                    </View>
                    
                    <View style={styles.intensityContainer}>
                      <Ionicons name="speedometer-outline" size={16} color="#FFD700" />
                      <Text style={styles.intensityReason}>{workout.intensityReason}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.startWorkoutButton}
                    onPress={() => handleStartWorkout(workout)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
                    <Ionicons name="play" size={16} color="#000000" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {/* Swipe Navigation */}
          {userWorkouts.length > 1 && (
            <View style={styles.swipeNavigation}>
              <TouchableOpacity 
                style={[styles.swipeButton, currentWorkoutIndex === 0 && styles.swipeButtonDisabled]}
                onPress={handleSwipeRight}
                disabled={currentWorkoutIndex === 0}
              >
                <Ionicons name="chevron-back" size={24} color={currentWorkoutIndex === 0 ? "#666" : "#FFD700"} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.swipeButton, currentWorkoutIndex === userWorkouts.length - 1 && styles.swipeButtonDisabled]}
                onPress={handleSwipeLeft}
                disabled={currentWorkoutIndex === userWorkouts.length - 1}
              >
                <Ionicons name="chevron-forward" size={24} color={currentWorkoutIndex === userWorkouts.length - 1 ? "#666" : "#FFD700"} />
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  content: {
    flex: 1,
  },
  workoutSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
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
  workoutIndicator: {
    fontSize: 14,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  workoutCardContainer: {
    marginBottom: 24,
  },
  equipmentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
    textAlign: 'center',
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    padding: 20,
    marginBottom: 25,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  workoutImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#222222',
  },
  workoutInfo: {
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 12,
    fontWeight: '600',
  },
  workoutDescription: {
    marginBottom: 12,
  },
  workoutDescriptionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  intensityReason: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  swipeNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 16,
  },
  swipeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  swipeButtonDisabled: {
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
    borderColor: 'rgba(102, 102, 102, 0.3)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});