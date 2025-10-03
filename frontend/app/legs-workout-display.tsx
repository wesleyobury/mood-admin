import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

interface Workout {
  name: string;
  duration: string;
  intensity: string;
  description: string;
  battlePlan: string[];
  intensityReason: string;
  moodTips: string[];
}

interface MuscleGroupWorkout {
  muscleGroupName: string;
  workouts: Workout[];
}

// Placeholder workout data - in a real implementation this would be comprehensive
const legsWorkoutDatabase: MuscleGroupWorkout[] = [
  {
    muscleGroupName: 'Glutes',
    workouts: [
      {
        name: 'Glute Bridge Power',
        duration: '25 min',
        intensity: 'Intermediate',
        description: 'Hip thrust variations focusing on glute activation',
        battlePlan: [
          '3 rounds of:',
          '• 15 glute bridges',
          '• 12 single-leg bridges',
          '• 20 clamshells each side',
          'Rest 90 sec between rounds'
        ],
        intensityReason: 'Moderate glute isolation builds strength and muscle activation.',
        moodTips: [
          'Focus on squeezing glutes at the top of each bridge movement',
          'Control the eccentric (lowering) phase for maximum muscle engagement'
        ]
      },
      {
        name: 'Hip Thrust Circuit',
        duration: '30 min',
        intensity: 'Advanced',
        description: 'Advanced glute strengthening with resistance variations',
        battlePlan: [
          '4 rounds of:',
          '• 20 weighted hip thrusts',
          '• 15 Bulgarian split squats each leg',
          '• 25 lateral band walks each direction',
          'Rest 2 min between rounds'
        ],
        intensityReason: 'Heavy loading maximizes glute muscle development and power.',
        moodTips: [
          'Drive through heels to maximize glute engagement in hip thrusts',
          'Maintain tension throughout the entire range of motion'
        ]
      }
    ]
  },
  {
    muscleGroupName: 'Hammies',
    workouts: [
      {
        name: 'Hamstring Strength',
        duration: '20 min',
        intensity: 'Beginner',
        description: 'Basic hamstring strengthening movements',
        battlePlan: [
          '3 rounds of:',
          '• 12 Romanian deadlifts',
          '• 15 lying leg curls',
          '• 10 good mornings',
          'Rest 75 sec between rounds'
        ],
        intensityReason: 'Controlled movements teach proper hamstring activation patterns.',
        moodTips: [
          'Feel the stretch in your hamstrings during the eccentric phase',
          'Keep your core engaged to protect your lower back'
        ]
      },
      {
        name: 'Hamstring Power',
        duration: '35 min',
        intensity: 'Advanced',
        description: 'Explosive hamstring training with plyometric elements',
        battlePlan: [
          '5 rounds of:',
          '• 8 single-leg Romanian deadlifts each leg',
          '• 12 Nordic hamstring curls',
          '• 10 jump squats with pause',
          'Rest 2.5 min between rounds'
        ],
        intensityReason: 'Plyometric training develops explosive hamstring power and speed.',
        moodTips: [
          'Control the negative phase of Nordic curls for maximum strength gains',
          'Land softly on jump squats to protect knees and engage hamstrings'
        ]
      }
    ]
  },
  {
    muscleGroupName: 'Quads',
    workouts: [
      {
        name: 'Quad Builder',
        duration: '28 min',
        intensity: 'Intermediate',
        description: 'Comprehensive quadriceps development workout',
        battlePlan: [
          '4 rounds of:',
          '• 15 goblet squats',
          '• 12 lunges each leg',
          '• 20 leg extensions',
          'Rest 90 sec between rounds'
        ],
        intensityReason: 'Multi-angle quad training ensures complete muscle development.',
        moodTips: [
          'Drive through your heels in squats to engage quads fully',
          'Focus on the squeeze at the top of leg extensions'
        ]
      },
      {
        name: 'Quad Domination',
        duration: '40 min',
        intensity: 'Advanced',
        description: 'High-intensity quadriceps training with heavy loads',
        battlePlan: [
          '5 rounds of:',
          '• 10 front squats',
          '• 8 pistol squats each leg',
          '• 15 jump lunges each leg',
          'Rest 3 min between rounds'
        ],
        intensityReason: 'Heavy compound movements maximize quad strength and mass.',
        moodTips: [
          'Keep chest up in front squats to maintain proper quad engagement',
          'Control the descent in pistol squats for maximum strength gains'
        ]
      }
    ]
  },
  {
    muscleGroupName: 'Calfs',
    workouts: [
      {
        name: 'Calf Raises',
        duration: '15 min',
        intensity: 'Beginner',
        description: 'Basic calf muscle strengthening',
        battlePlan: [
          '3 rounds of:',
          '• 20 standing calf raises',
          '• 15 seated calf raises',
          '• 12 single-leg calf raises each leg',
          'Rest 60 sec between rounds'
        ],
        intensityReason: 'High repetitions build calf muscle endurance and definition.',
        moodTips: [
          'Rise up on your toes as high as possible for full range',
          'Control the lowering phase to maximize muscle activation'
        ]
      },
      {
        name: 'Explosive Calves',
        duration: '25 min',
        intensity: 'Advanced',
        description: 'Plyometric calf training for power and explosiveness',
        battlePlan: [
          '4 rounds of:',
          '• 15 jump calf raises',
          '• 20 pogo hops',
          '• 10 single-leg bounds each leg',
          'Rest 2 min between rounds'
        ],
        intensityReason: 'Explosive movements develop calf power and athletic performance.',
        moodTips: [
          'Land softly and immediately explode up for maximum power',
          'Focus on quick ground contact time in pogo hops'
        ]
      }
    ]
  },
  {
    muscleGroupName: 'Compound',
    workouts: [
      {
        name: 'Full Leg Power',
        duration: '45 min',
        intensity: 'Intermediate',
        description: 'Complete leg workout targeting all major muscle groups',
        battlePlan: [
          '4 rounds of:',
          '• 12 squats',
          '• 10 deadlifts',
          '• 15 lunges each leg',
          '• 20 calf raises',
          'Rest 2 min between rounds'
        ],
        intensityReason: 'Compound movements work multiple leg muscles for complete development.',
        moodTips: [
          'Focus on proper form over heavy weight for compound movements',
          'Engage your core throughout all exercises for stability'
        ]
      },
      {
        name: 'Leg Day Elite',
        duration: '60 min',
        intensity: 'Advanced',
        description: 'Advanced compound leg training for maximum strength and size',
        battlePlan: [
          '5 rounds of:',
          '• 8 back squats',
          '• 6 Romanian deadlifts',
          '• 10 Bulgarian split squats each leg',
          '• 15 jump squats',
          'Rest 3 min between rounds'
        ],
        intensityReason: 'Heavy compound loading maximizes strength and muscle growth.',
        moodTips: [
          'Breathe and brace your core before each heavy lift',
          'Focus on explosiveness in the concentric phase of movements'
        ]
      }
    ]
  }
];

const getMuscleGroupIcon = (muscleGroupName: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    'Glutes': 'fitness',
    'Hammies': 'barbell',
    'Quads': 'triangle',
    'Calfs': 'diamond',
    'Compound': 'layers',
  };
  return iconMap[muscleGroupName] || 'fitness';
};

export default function LegsWorkoutDisplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const translateX = useRef(new Animated.Value(0)).current;

  // Parse parameters
  const mood = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Legs';
  const muscleGroupsParam = params.muscleGroups as string || '';
  
  // Decode and parse muscle groups
  const muscleGroupNames = muscleGroupsParam ? decodeURIComponent(muscleGroupsParam).split(',') : [];
  
  // Filter workouts based on selected muscle groups
  const userWorkouts = legsWorkoutDatabase.filter(mgw => 
    muscleGroupNames.includes(mgw.muscleGroupName)
  );

  const currentMuscleGroup = userWorkouts[currentWorkoutIndex];
  const currentWorkout = currentMuscleGroup?.workouts?.[0]; // Show first workout for each muscle group

  const handleStartWorkout = (workout: Workout) => {
    console.log('🚀 Starting workout:', workout.name);
    
    // Navigate to workout guidance with simplified parameters
    const params = {
      workoutName: workout.name,
      muscleGroup: currentMuscleGroup?.muscleGroupName || '',
      description: workout.description,
      duration: workout.duration,
      intensity: workout.intensity,
      battlePlan: workout.battlePlan.join('\n'),
      moodTipsCount: workout.moodTips.length.toString()
    };
    
    console.log('📝 Workout data:', params);
    console.log('🔄 Navigation params:', params);
    
    try {
      router.push({
        pathname: '/workout-guidance',
        params
      });
      console.log('✅ Navigation completed - using simplified parameters');
    } catch (error) {
      console.error('❌ Navigation failed:', error);
    }
  };

  const handlePanGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    
    console.log('🎯 Gesture detected, translationX:', translationX);
    
    if (translationX > 100 && currentWorkoutIndex > 0) {
      // Swiped right, go to previous workout
      console.log('👈 Swiped right, changing to workout index:', currentWorkoutIndex - 1);
      setCurrentWorkoutIndex(currentWorkoutIndex - 1);
    } else if (translationX < -100 && currentWorkoutIndex < userWorkouts.length - 1) {
      // Swiped left, go to next workout
      console.log('👉 Swiped left, changing to workout index:', currentWorkoutIndex + 1);
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
    }
  };

  const handlePanHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      console.log('👆 Touch started at:', event.nativeEvent.x);
    } else if (event.nativeEvent.state === State.END) {
      console.log('🔥 Touch ended');
      
      // Reset animation
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (userWorkouts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
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
            No workouts available for the selected muscle groups.
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
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Legs Workouts</Text>
          <Text style={styles.headerSubtitle}>{mood}</Text>
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
            <Text style={styles.progressStepText}>{mood}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="walk" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{workoutType}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {muscleGroupNames.map((muscleGroupName, index) => (
            <React.Fragment key={muscleGroupName}>
              <View style={styles.progressStep}>
                <View style={styles.progressStepActive}>
                  <Ionicons name={getMuscleGroupIcon(muscleGroupName)} size={14} color="#000000" />
                </View>
                <Text style={styles.progressStepText}>{muscleGroupName}</Text>
              </View>
              {index < muscleGroupNames.length - 1 && <View style={styles.progressConnector} />}
            </React.Fragment>
          ))}
        </ScrollView>
      </View>

      <PanGestureHandler
        onGestureEvent={handlePanGestureEvent}
        onHandlerStateChange={handlePanHandlerStateChange}
      >
        <Animated.View style={[styles.workoutList, { transform: [{ translateX }] }]}>
          {/* Workout Indicators */}
          <View style={styles.dotsContainer}>
            <Text style={styles.indicatorText}>
              {currentWorkoutIndex + 1}/{userWorkouts.length}
            </Text>
            <Text style={styles.dotsLabel}>Swipe to explore</Text>
            <View style={styles.dotsRow}>
              {userWorkouts.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dot,
                    currentWorkoutIndex === index && styles.activeDot,
                  ]}
                  onPress={() => {
                    setCurrentWorkoutIndex(index);
                  }}
                  activeOpacity={0.7}
                />
              ))}
            </View>
          </View>

          {/* Current Workout Slide */}
          <View style={styles.workoutSlide}>
            <View style={styles.workoutHeader}>
              <View style={styles.muscleGroupInfo}>
                <View style={styles.muscleGroupIconContainer}>
                  <Ionicons 
                    name={getMuscleGroupIcon(currentMuscleGroup?.muscleGroupName || '')} 
                    size={24} 
                    color="#FFD700" 
                  />
                </View>
                <Text style={styles.muscleGroupName}>{currentMuscleGroup?.muscleGroupName}</Text>
              </View>
            </View>

            {currentWorkout && (
              <View style={styles.workoutCard}>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{currentWorkout.name}</Text>
                  <Text style={styles.workoutDescription}>{currentWorkout.description}</Text>
                  
                  <View style={styles.workoutDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time" size={16} color="#FFD700" />
                      <Text style={styles.detailText}>{currentWorkout.duration}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="speedometer" size={16} color="#FFD700" />
                      <Text style={styles.detailText}>{currentWorkout.intensity}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.startWorkoutButton}
                  onPress={() => handleStartWorkout(currentWorkout)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
                  <Ionicons name="play" size={20} color="#000000" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>
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
  workoutList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  indicatorText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  workoutSlide: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 8,
  },
  workoutHeader: {
    marginBottom: 20,
  },
  muscleGroupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  muscleGroupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  muscleGroupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  workoutCard: {
    flex: 1,
    justifyContent: 'space-between',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  workoutDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 32,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
    gap: 8,
  },
  startWorkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
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