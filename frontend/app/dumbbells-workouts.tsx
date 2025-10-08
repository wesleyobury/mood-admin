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

// Dumbbells workout database with 3 workouts per intensity level
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'DB Jump Squat Stick',
          duration: '8–10 min',
          description: 'Small vertical pop; soft stick; reset tall posture each rep.',
          battlePlan: '3 rounds\n• 5 × 3 Jump Squats (light)\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Light DBs add load while protecting landing and posture.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'DB Position',
              description: 'DBs at sides; shoulders low; eyes forward'
            },
            {
              icon: 'footsteps',
              title: 'Landing',
              description: 'Land quiet mid-foot; reset stance before next rep'
            }
          ]
        },
        {
          name: 'DB Push Press',
          duration: '8–10 min',
          description: 'Quick dip, violent punch, smooth stacked lockout overhead.',
          battlePlan: '3 rounds\n• 5–6 Push Press\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dip-drive coordination turns leg force into press speed.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Dip Form',
              description: 'Dip vertical; heels down; elbows slightly forward'
            },
            {
              icon: 'trending-up',
              title: 'Press Control',
              description: 'Drive hard; finish stacked; control descent to rack'
            }
          ]
        },
        {
          name: 'DB Split Jump Switch',
          duration: '8–10 min',
          description: 'Low-amplitude switches; aligned, quiet landings every time.',
          battlePlan: '3 rounds\n• 6 per side Split Jumps\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Small load refines switching mechanics and stiffness safely.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'DB Control',
              description: 'DBs by sides; torso tall; ribs down; arms quiet'
            },
            {
              icon: 'flash',
              title: 'Switch Form',
              description: 'Switch mid-air; knees track; stick softly, then reset'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'DB Snatch Alternating',
          duration: '10–12 min',
          description: 'Zip bell close; punch through; alternate sides smoothly.',
          battlePlan: '4 rounds\n• 6 per side Alternating Snatch\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Hip snap to overhead hones turnover speed and control.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Snatch Path',
              description: 'Hinge load; elbow high then punch; tame arc'
            },
            {
              icon: 'swap-horizontal',
              title: 'Switch Sides',
              description: 'Control down path; switch on floor or at rack'
            }
          ]
        },
        {
          name: 'DB Clean to Push Press',
          duration: '10–12 min',
          description: 'Fast clean to shoulders; short dip; explosive overhead finish.',
          battlePlan: '4 rounds\n• 5 Clean → Push Press\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clean primes rack; push press expresses vertical power.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Clean Form',
              description: 'Clean close; avoid curl; elbows slightly forward'
            },
            {
              icon: 'trending-up',
              title: 'Press Drive',
              description: 'Dip small; drive hard; stand tall with ribs stacked'
            }
          ]
        },
        {
          name: 'DB Broad Jump Carry',
          duration: '10–12 min',
          description: 'Two broad jumps; grab DBs; fast upright ten-meter carry.',
          battlePlan: '4 rounds\n• 2 Broad Jumps (stick) → 10m Farmer Carry\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Jumps then loaded carry train projection and bracing.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Jump Form',
              description: 'Jumps: big arms; stick one to two seconds; measure'
            },
            {
              icon: 'walk',
              title: 'Carry Form',
              description: 'Carry: posture tall; short, fast steps; firm grip'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'DB Jump Squat Clusters',
          duration: '12–14 min',
          description: 'Three reps, quick rest, three more; match jump heights.',
          battlePlan: '5 rounds\n• Cluster: 3 + 3 Jump Squats (10–12s between)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Cluster density preserves peak speed under fatigue load.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Consistency',
              description: 'Same dip depth; elbows quiet; eyes forward'
            },
            {
              icon: 'leaf',
              title: 'Rest Timing',
              description: 'Land soft; breathe quickly; time micro-rests precisely'
            }
          ]
        },
        {
          name: 'DB Snatch + Bound Contrast',
          duration: '12–16 min',
          description: 'Snatch sets then skater bounds with firm two-second stick.',
          battlePlan: '4 rounds\n• 6 per side DB Snatch\n• 3 per side Skater Bounds (stick 2s)\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Overhead power potentiates lateral projection capacity.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Snatch Form',
              description: 'Snatch: punch tall; smooth down; avoid elbow flare'
            },
            {
              icon: 'walk',
              title: 'Bound Landing',
              description: 'Bound: push sideways; land mid-foot; hold two seconds'
            }
          ]
        },
        {
          name: 'Clean + Push Press Ladder',
          duration: '12–16 min',
          description: 'Perform 3-2-1 per side; crisp clean then vertical push press.',
          battlePlan: '4 rounds\n• Ladder per side: 3-2-1 Clean + Push Press\nRest 150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Ladder volume sustains speed-strength with rising density.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Clean Control',
              description: 'Clean close; no curl; rack quiet and tight'
            },
            {
              icon: 'trending-up',
              title: 'Press Power',
              description: 'Press vertical; ribs stacked; squeeze glutes to finish'
            }
          ]
        }
      ]
    }
  }
];

export default function DumbbellsWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Parse URL parameters
  const rawMoodTitle = params.mood as string || 'Build Explosive';
  // Convert "I want to build explosiveness" to "Build Explosive" for display
  const moodTitle = rawMoodTitle.toLowerCase().includes('explosiveness') ? 'Build Explosive' : rawMoodTitle;
  const workoutType = params.workoutType as string || 'Weight Based';
  const equipment = params.equipment as string || 'Dumbbells';
  const difficulty = params.difficulty as string || 'beginner';

  console.log('Dumbbells Debug:', {
    equipment,
    difficulty,
    workoutType,
    moodTitle
  });

  // Get dumbbells workouts
  const dumbbellsWorkouts = workoutDatabase[0]; // Only one equipment type
  const workoutsForDifficulty = dumbbellsWorkouts.workouts[difficulty as keyof typeof dumbbellsWorkouts.workouts] || [];

  console.log('Workouts for difficulty:', difficulty, 'Count:', workoutsForDifficulty.length);

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

  // Create progress bar - single row with requested order
  const createProgressRows = () => {
    const steps = [
      { key: 'mood', icon: 'flash', text: moodTitle },
      { key: 'bodyPart', icon: 'barbell', text: workoutType },
      { key: 'difficulty', icon: 'speedometer', text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: '1 Equipment' },
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
              <Text style={styles.difficultyBadgeText}>{difficulty.toUpperCase()}</Text>
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
            onPress={() => handleStartWorkout(item, equipment, difficulty)}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={20} color="#000000" />
            <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    // Simple touch-based swipe detection for reliable web compatibility
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: any) => {
      setTouchEnd(null);
      setTouchStart(e.nativeEvent.touches[0].clientX);
    };

    const onTouchMove = (e: any) => {
      setTouchEnd(e.nativeEvent.touches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

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
          style={[styles.workoutList, { height: 420 }]}
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
            keyExtractor={(item, index) => `${equipment}-${item.name}-${index}`}
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
                  currentWorkoutIndex === index && styles.activeDot,
                ]}
                onPress={() => {
                  setCurrentWorkoutIndex(index);
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                }}
              />
            ))}
          </View>
        </View>
      </View>
    );
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
          <Text style={styles.headerSubtitle}>{moodTitle} • {difficulty}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar with Row Layout */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          {createProgressRows().map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.progressRow}>
              {row.map((step, stepIndex) => (
                <React.Fragment key={step.key}>
                  <View style={styles.progressStep}>
                    <View style={styles.progressStepActive}>
                      <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={10} color="#000000" />
                    </View>
                    <Text style={styles.progressStepText}>{step.text}</Text>
                  </View>
                  {stepIndex < row.length - 1 && <View style={styles.progressConnector} />}
                </React.Fragment>
              ))}
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* No Workouts Message */}
        {workoutsForDifficulty.length === 0 && (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="fitness-outline" size={64} color="rgba(255, 215, 0, 0.3)" />
            <Text style={styles.noWorkoutsTitle}>No Workouts Available</Text>
            <Text style={styles.noWorkoutsText}>
              We couldn't find workouts for the selected equipment. Please go back and select different equipment.
            </Text>
            <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
              <Text style={styles.goBackButtonText}>Select Equipment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Workout Card */}
        {workoutsForDifficulty.length > 0 && (
          <WorkoutCard
            equipment={equipment}
            icon="barbell"
            workouts={workoutsForDifficulty}
            difficulty={difficulty}
          />
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
  },
  progressContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 60,
  },
  progressStepActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 60,
  },
  progressConnector: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
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
    marginBottom: 24,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  equipmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  equipmentName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  workoutList: {
    height: 420,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  workoutImageContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
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
    paddingHorizontal: 0,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    paddingHorizontal: 6,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  workoutDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
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
    flex: 1,
    maxHeight: 80,
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
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
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  dotsLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
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
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  noWorkoutsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  goBackButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  goBackButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});