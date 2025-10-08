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

// Power Lifting Platform workout database with 4 workouts per intensity level
const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Power Lifting Platform',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Snap-Grip Jump Deadlift',
          duration: '8–10 min',
          description: 'Fast stand to brief float; quiet land; precise reset each rep.',
          battlePlan: '3 rounds\n• 5 × 3 Jump Deadlifts (light; floor or low blocks)\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Light bar grooves hip snap and stacked brace for safe pop.',
          moodTips: [
            {
              icon: 'body',
              title: 'Start Position',
              description: 'Start mid-shin; brace; push floor, don\'t yank from ground'
            },
            {
              icon: 'trending-down',
              title: 'Landing',
              description: 'Heels kiss on land; reset stance fully before next pull'
            }
          ]
        },
        {
          name: 'Clean Pull Pop',
          duration: '8–10 min',
          description: 'Sweep close to thighs; pop and shrug tall with arms long.',
          battlePlan: '3 rounds\n• 6 × 2 Clean Pulls (light–moderate)\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clean pull path hones triple extend and vertical bar speed.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Bar Position',
              description: 'Shoulders over bar; lats tight; keep knuckles down'
            },
            {
              icon: 'trending-up',
              title: 'Extension',
              description: 'Drive legs then hips; shrug vertical; avoid arm curl'
            }
          ]
        },
        {
          name: 'Back Rack Jump Squat',
          duration: '8–10 min',
          description: 'Shallow dip to quick pop; soft stick; deliberate posture reset.',
          battlePlan: '3 rounds\n• 5 × 3 Jump Squats (empty bar to very light)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Very light load builds speed-strength and landing control.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Bar Position',
              description: 'Bar high on traps; ribs down; small dip only'
            },
            {
              icon: 'footsteps',
              title: 'Landing',
              description: 'Land mid-foot; absorb quietly; match heights each set'
            }
          ]
        },
        {
          name: 'Tall Push Press',
          duration: '8–10 min',
          description: 'Quick dip then punch; crisp stack overhead; smooth return.',
          battlePlan: '3 rounds\n• 5–6 Push Press (light–moderate)\nRest 75s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short dip-drive teaches leg power into rapid lockout.',
          moodTips: [
            {
              icon: 'body',
              title: 'Dip Technique',
              description: 'Dip 2–3"; torso vertical; heels down through drive'
            },
            {
              icon: 'trending-up',
              title: 'Press Path',
              description: 'Punch straight; head through; lower under control each rep'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Hang Clean Pull to Tall Shrug',
          duration: '10–12 min',
          description: 'Hinge to hang, violent pop, high shrug; reset between reps.',
          battlePlan: '4 rounds\n• 4 × 2 Hang Clean Pulls (moderate)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Above-knee start refines bar path, RFD, and tall finish.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Bar Path',
              description: 'Lats packed; bar close; sweep into thighs'
            },
            {
              icon: 'trending-up',
              title: 'Extension',
              description: 'Triple extend; elbows high after shrug; no hitch'
            }
          ]
        },
        {
          name: 'Jump Shrug Cluster',
          duration: '10–12 min',
          description: 'Two reps, brief rest, two reps; maintain equal jump height.',
          battlePlan: '4 rounds\n• Cluster: 2 + 2 Jump Shrugs (10–12s between)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Clusters keep peak speed while limiting fatigue buildup.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Bar Contact',
              description: 'Same stance; bar skims thighs each rep'
            },
            {
              icon: 'leaf',
              title: 'Rest Timing',
              description: 'Land quiet; breathe quick; time micro-rests strictly'
            }
          ]
        },
        {
          name: 'Push Press Launch',
          duration: '10–12 min',
          description: 'Short dip, violent drive, crisp lockout, smooth rack return.',
          battlePlan: '4 rounds\n• 4–5 Push Press (light–moderate)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Efficient dip-drive transfers leg force to fast press lock.',
          moodTips: [
            {
              icon: 'footsteps',
              title: 'Dip Drive',
              description: 'Knees track; ribs down; heels stay planted on dip'
            },
            {
              icon: 'trending-up',
              title: 'Press Control',
              description: 'Punch up; finish stacked; control eccentric each time'
            }
          ]
        },
        {
          name: 'Clean High Pull from Blocks',
          duration: '10–12 min',
          description: 'Start at knee; snap tall; elbows high; bar path stays close.',
          battlePlan: '4 rounds\n• 4 × 2 High Pulls from blocks (moderate)\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Blocks reduce pull length to emphasize peak speed finish.',
          moodTips: [
            {
              icon: 'body',
              title: 'Setup',
              description: 'Brace; sweep in; extend to toes before pull'
            },
            {
              icon: 'trending-up',
              title: 'Pull Finish',
              description: 'Elbows up/back; avoid early arm bend or swing'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Clean Pull + Jump Squat Contrast',
          duration: '12–14 min',
          description: 'Drive force on pulls, then pop height with soft, crisp sticks.',
          battlePlan: '5 rounds\n• 3 Clean Pulls (moderate–heavy)\n• 3 × 2 Back Rack Jump Squats (light)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Heavy pulls potentiate CNS; light jumps express speed.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Pull Focus',
              description: 'Pull: bar close; violent hips; no hitching'
            },
            {
              icon: 'footsteps',
              title: 'Jump Focus',
              description: 'Jump: same dip; relaxed grip; match landing quietly'
            }
          ]
        },
        {
          name: 'Snatch High Pull from Blocks',
          duration: '12–14 min',
          description: 'From knee blocks; snap tall; elbows high outside; bar close.',
          battlePlan: '5 rounds\n• 3–4 Snatch High Pulls (from blocks)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wide grip emphasizes speed, bar height, and quick elbows.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Setup',
              description: 'Lats set; full extend; pull elbows up and back'
            },
            {
              icon: 'body',
              title: 'Bar Control',
              description: 'Keep bar near body; reset strong each repetition'
            }
          ]
        },
        {
          name: 'Push Jerk Wave Sets',
          duration: '12–16 min',
          description: 'Dip-drive, punch under, firm stick; build across wave sets.',
          battlePlan: '5 rounds\n• Wave: 2-2-1 Push Jerks (build slightly per wave)\nRest 120–150s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Wave loading sustains velocity under rising neural demand.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Dip Drive',
              description: 'Dip shallow; heels down; explode then drop'
            },
            {
              icon: 'footsteps',
              title: 'Recovery',
              description: 'Land soft; lock firm; recover feet in order'
            }
          ]
        },
        {
          name: 'Clean Pull Cluster',
          duration: '12–14 min',
          description: 'Two pulls, short rest, two pulls; crisp vertical extension.',
          battlePlan: '5 rounds\n• Cluster: 2 + 2 Clean Pulls (moderate–heavy)\nRest 120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Cluster reps maintain bar speed at higher training loads.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Pull Quality',
              description: 'Wedge hard; sweep close; finish tall every rep'
            },
            {
              icon: 'leaf',
              title: 'Rest Control',
              description: 'Use timer for 10–12s rests; no grinding reps'
            }
          ]
        }
      ]
    }
  }
];

export default function PowerliftingWorkoutsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Parse URL parameters
  const rawMoodTitle = params.mood as string || 'Build Explosive';
  const moodTitle = rawMoodTitle.toLowerCase().includes('explosiveness') ? 'Build Explosive' : rawMoodTitle;
  const workoutType = params.workoutType as string || 'Weight Based';
  const equipment = params.equipment as string || 'Power Lifting Platform';
  const difficulty = params.difficulty as string || 'beginner';

  console.log('Powerlifting Debug:', {
    equipment,
    difficulty,
    workoutType,
    moodTitle
  });

  // Get powerlifting workouts
  const powerliftingWorkouts = workoutDatabase[0]; // Only one equipment type
  const workoutsForDifficulty = powerliftingWorkouts.workouts[difficulty as keyof typeof powerliftingWorkouts.workouts] || [];

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
      { key: 'difficulty', icon: 'checkmark', text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'barbell', text: '1' }
    ];

    return (
      <View style={styles.progressContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressContent}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <View style={styles.progressStep}>
                <View style={styles.progressStepActive}>
                  <Ionicons name={step.icon} size={14} color="#000000" />
                </View>
                <Text style={styles.progressStepText}>{step.text}</Text>
              </View>
              {index < steps.length - 1 && <View style={styles.progressConnector} />}
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Workout card component with 4 cards per row
  const WorkoutCard = ({ workout, equipmentName, difficulty: cardDifficulty, index, totalCards }: {
    workout: Workout;
    equipmentName: string;
    difficulty: string;
    index: number;
    totalCards: number;
  }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    // Create array of workout data (for swipe functionality, we'll use the same workout)
    const workoutData = [workout];

    const handleDotPress = (index: number) => {
      setCurrentImageIndex(index);
      flatListRef.current?.scrollToIndex({ index, animated: true });
    };

    const renderWorkoutContent = ({ item }: { item: Workout }) => (
      <View style={styles.cardContent}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        
        <View style={styles.cardTextContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.workoutTitle}>{item.name}</Text>
            <Text style={styles.workoutDuration}>{item.duration}</Text>
          </View>

          <View style={styles.intensityContainer}>
            <View style={styles.intensityBadge}>
              <Text style={styles.intensityText}>
                {cardDifficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.intensityReason}>{item.intensityReason}</Text>
          <Text style={styles.workoutDescription}>{item.description}</Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => handleStartWorkout(item, equipmentName, cardDifficulty)}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={20} color="#000000" />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <View style={styles.workoutCard}>
        <View style={styles.cardTopSection}>
          <TouchableOpacity style={styles.backToListButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={16} color="#FFD700" />
          </TouchableOpacity>
          
          <View style={styles.cardCountContainer}>
            <Text style={styles.cardCountText}>{index + 1}/{totalCards}</Text>
          </View>
        </View>

        <View style={styles.equipmentHeader}>
          <View style={styles.equipmentIconContainer}>
            <Ionicons name="barbell" size={24} color="#FFD700" />
          </View>
          <Text style={styles.equipmentTitle}>{equipmentName}</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={workoutData}
          renderItem={renderWorkoutContent}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
          keyExtractor={(_, index) => index.toString()}
        />

        <View style={styles.swipeIndicatorContainer}>
          <Text style={styles.swipeText}>Swipe to explore</Text>
          <View style={styles.dotContainer}>
            {workoutData.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  currentImageIndex === index && styles.activeDot
                ]}
                onPress={() => handleDotPress(index)}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  if (workoutsForDifficulty.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>No Workouts Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Your Workouts</Text>
          <Text style={styles.headerSubtitle}>{moodTitle} - {difficulty}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      {createProgressRows()}

      {/* Workout Cards */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.workoutContainer}>
          {workoutsForDifficulty.map((workout, index) => (
            <WorkoutCard
              key={`${equipment}-${workout.name}-${index}`}
              workout={workout}
              equipmentName={equipment}
              difficulty={difficulty}
              index={index}
              totalCards={workoutsForDifficulty.length}
            />
          ))}
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
  scrollContainer: {
    flex: 1,
  },
  workoutContainer: {
    padding: 16,
    gap: 24,
  },
  workoutCard: {
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
  cardTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backToListButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardCountContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  equipmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  equipmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardContent: {
    width: width,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#222222',
  },
  cardTextContainer: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  workoutDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  intensityContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  intensityBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  intensityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  intensityReason: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 8,
    fontWeight: '500',
    lineHeight: 20,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  swipeIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  swipeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
  },
});