import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Analytics } from '../utils/analytics';

// Define workout exercise type matching the cart/guidance structure
interface WorkoutExercise {
  name: string;
  equipment: string;
  description: string;
  battlePlan: string;
  duration: string;
  imageUrl: string;
  intensityReason: string;
  difficulty: string;
  workoutType: string;
  moodCard: string;
  moodTips: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string }[];
}

// Define the workout data for each featured workout - using REAL workout data from the database
const featuredWorkoutData: Record<string, {
  mood: string;
  title: string;
  duration: string;
  image: string;
  exercises: WorkoutExercise[];
}> = {
  '1': {
    mood: 'I Want to Sweat',
    title: 'Cardio Based',
    duration: '25–35 min',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    exercises: [
      { 
        name: 'Hill & Sprint',
        equipment: 'Stationary bike',
        description: 'Alternating seated climbs and standing sprints build explosive cardio power.',
        battlePlan: '5 min warm-up at moderate resistance\n• 2 min seated climb (high resistance)\n• 1 min standing sprint (moderate resistance)\n• 2 min recovery spin\n• Repeat climb-sprint-recovery 3x\n• 5 min cool down',
        duration: '20 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-images/artifacts/8k8d6fo4_download%20%2824%29.png',
        intensityReason: 'Hill climbs build leg strength while sprints maximize calorie burn',
        difficulty: 'intermediate',
        workoutType: 'I Want to Sweat - Cardio Based',
        moodCard: 'I Want to Sweat',
        moodTips: [
          { icon: 'speedometer', title: 'Maintain Cadence', description: 'Keep your pedaling cadence consistent during climbs for better muscle engagement.' },
          { icon: 'heart', title: 'Heart Rate Zone', description: 'Aim for 70-85% max heart rate during sprints, recover at 60% between intervals.' }
        ]
      },
      { 
        name: 'Hill Climb',
        equipment: 'Stair master',
        description: 'Progressive stair climbing builds cardiovascular endurance and leg strength.',
        battlePlan: '3 min warm-up at level 4\n• 2 min at level 7\n• 1 min at level 10 (power steps)\n• 2 min at level 5 (recovery)\n• Repeat high-power-recovery 4x\n• 3 min cool down at level 3',
        duration: '18 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-app-ui/artifacts/clikf991_download.png',
        intensityReason: 'Variable intensity stair climbing maximizes cardio adaptation',
        difficulty: 'intermediate',
        workoutType: 'I Want to Sweat - Cardio Based',
        moodCard: 'I Want to Sweat',
        moodTips: [
          { icon: 'body', title: 'Posture Check', description: 'Stand tall with slight forward lean. Avoid hunching over the machine.' },
          { icon: 'flame', title: 'Glute Activation', description: 'Press through your heels to maximize glute engagement on each step.' }
        ]
      },
    ],
  },
  '2': {
    mood: 'Muscle Gainer',
    title: 'Back & Bis Volume',
    duration: '35–45 min',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop',
    exercises: [
      // Back - Adjustable Bench - Chest Support Row (Intermediate)
      { 
        name: 'Chest-Support Row',
        equipment: 'Adjustable bench',
        description: 'Supported rows and flies promote strict contraction',
        battlePlan: '4 rounds\n• 8 Chest-Supported Dumbbell Row\nRest 75–90s\n• 10 Incline Prone Reverse Fly\nRest 75–90s',
        duration: '14–16 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
        intensityReason: 'Neutral spine from support isolates lats + traps',
        difficulty: 'intermediate',
        workoutType: 'Muscle Gainer - Back & Bis Volume',
        moodCard: 'Muscle Gainer',
        moodTips: [
          { icon: 'flash', title: "Don't yank dumbbells—steady elbows driving back.", description: 'Controlled elbow drive maximizes lat activation over momentum.' },
          { icon: 'timer', title: 'Go light on reverse fly, pause 1s at top.', description: 'Peak contraction pause enhances rear delt development.' }
        ]
      },
      // Back - T-Bar Row Machine - Slow Neg Row (Intermediate)
      { 
        name: 'Slow Neg Row',
        equipment: 'T bar row machine',
        description: 'Time-under-tension row progression provides a challenging switchup',
        battlePlan: '4 rounds\n• 8 Neutral Grip Row (3–4s eccentric)\nRest 90s after set',
        duration: '12–14 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
        intensityReason: '3–4s eccentric tempo increases hypertrophy effect',
        difficulty: 'intermediate',
        workoutType: 'Muscle Gainer - Back & Bis Volume',
        moodCard: 'Muscle Gainer',
        moodTips: [
          { icon: 'trending-up', title: 'Explode to chest, lower slow & steady.', description: 'Fast concentric, slow eccentric maximizes muscle stimulus.' },
          { icon: 'timer', title: 'Keep weight lighter to maintain control.', description: 'Reduced load allows proper tempo execution and form.' }
        ]
      },
      // Back - Straight Pull Up Bar - Pull Up + Hold (Intermediate)
      { 
        name: 'Pull-Up + Hold',
        equipment: 'Straight pull up bar',
        description: 'Combines pull-ups with a static hold for enhanced strength',
        battlePlan: '3 rounds\n• 6 Pull-Ups\nEnd each set with a 3s hold at the top\nRest 90s after set',
        duration: '12–14 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
        intensityReason: 'Adds isometric hold to increase time under tension for growth',
        difficulty: 'intermediate',
        workoutType: 'Muscle Gainer - Back & Bis Volume',
        moodCard: 'Muscle Gainer',
        moodTips: [
          { icon: 'trending-up', title: 'Aim for unassisted reps. If form breaks, use minimal assistance.', description: 'Progressive overload with isometric challenge builds strength.' },
          { icon: 'timer', title: 'Hold chin above bar for 3 seconds at the top of each final rep.', description: 'Isometric hold maximizes time under tension and strength gains.' }
        ]
      },
      // Biceps - Cable Machine - Cable Negatives (Intermediate)
      { 
        name: 'Cable Negatives',
        equipment: 'Cable Machine',
        description: 'Negative bar curls grow size and total integrity',
        battlePlan: '3 rounds\n• 8 Cable Bar Curls (3s eccentric)\nRest 75–90s',
        duration: '12–14 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/vqw55nvb_download%20%2818%29.png',
        intensityReason: 'Slow eccentrics amplify hypertrophy adaptation',
        difficulty: 'intermediate',
        workoutType: 'Muscle Gainer - Back & Bis Volume',
        moodCard: 'Muscle Gainer',
        moodTips: [
          { icon: 'flash', title: 'Drive up powerfully, lower 3s', description: 'Explosive concentric, controlled eccentric.' },
          { icon: 'fitness', title: 'Elbows fixed at torso sides', description: 'Locked elbows ensure bicep isolation.' }
        ]
      },
      // Biceps - EZ Curl Bar - Narrow Curl (Intermediate)
      { 
        name: 'Narrow Curl',
        equipment: 'EZ Curl Bar',
        description: 'Close grip curls build stronger arm inner heads',
        battlePlan: '4 rounds\n• 8–10 Narrow Grip EZ Curls\nRest 75–90s',
        duration: '12–14 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
        intensityReason: 'Narrow grip overloads the biceps inner portion',
        difficulty: 'intermediate',
        workoutType: 'Muscle Gainer - Back & Bis Volume',
        moodCard: 'Muscle Gainer',
        moodTips: [
          { icon: 'hand-left', title: 'Keep palms inward, elbows close', description: 'Narrow grip targets inner biceps.' },
          { icon: 'trending-up', title: 'Pull bar to upper chest line', description: 'Full range maximizes muscle fiber recruitment.' }
        ]
      },
    ],
  },
  '3': {
    mood: 'Build Explosion',
    title: 'Power Lifting',
    duration: '30–40 min',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
    exercises: [
      { 
        name: 'Hang Clean Pull to Tall Shrug',
        equipment: 'Power Lifting Platform',
        description: 'Explosive hip extension with powerful shrug develops total body power.',
        battlePlan: '5 sets\n• 5 Hang Clean Pulls with Tall Shrug\n• Focus on explosive hip drive\n• Arms stay straight until shrug\nRest 90–120s between sets',
        duration: '12 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_muscle-mapper-2/artifacts/xefmav9j_Screenshot%202025-12-03%20at%204.15.36%E2%80%AFPM.png',
        intensityReason: 'Olympic lift derivative builds explosive power through triple extension',
        difficulty: 'intermediate',
        workoutType: 'Build Explosion - Power Lifting',
        moodCard: 'Build Explosion',
        moodTips: [
          { icon: 'flash', title: 'Hip Drive First', description: 'The power comes from snapping your hips forward, not pulling with arms.' },
          { icon: 'body', title: 'Triple Extension', description: 'Extend ankles, knees, and hips simultaneously for maximum power.' }
        ]
      },
      { 
        name: 'Push Press Launch',
        equipment: 'Power Lifting Platform',
        description: 'Explosive overhead press using leg drive for maximum power output.',
        battlePlan: '5 sets\n• 5 Push Press\n• Quick dip, explosive drive\n• Lock out arms overhead\nRest 90–120s between sets',
        duration: '10 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_muscle-mapper-2/artifacts/xefmav9j_Screenshot%202025-12-03%20at%204.15.36%E2%80%AFPM.png',
        intensityReason: 'Leg-driven overhead press allows heavier loads than strict press',
        difficulty: 'intermediate',
        workoutType: 'Build Explosion - Power Lifting',
        moodCard: 'Build Explosion',
        moodTips: [
          { icon: 'trending-up', title: 'Vertical Path', description: 'Push your head through once the bar passes your face for proper lockout.' },
          { icon: 'flash', title: 'Speed Matters', description: 'The faster the dip-drive, the more weight you can move.' }
        ]
      },
      { 
        name: 'Trap Bar Jump',
        equipment: 'Trap Hex Bar',
        description: 'Loaded jumps develop explosive lower body power.',
        battlePlan: '4 sets\n• 6 Trap Bar Jumps\n• Use 50% deadlift max\n• Land softly, reset fully\nRest 90s between sets',
        duration: '10 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_muscle-mapper-2/artifacts/2q9xaqkj_download%20%281%29.png',
        intensityReason: 'Loaded jumps bridge strength and explosive power development',
        difficulty: 'intermediate',
        workoutType: 'Build Explosion - Power Lifting',
        moodCard: 'Build Explosion',
        moodTips: [
          { icon: 'body', title: 'Soft Landing', description: 'Land with bent knees to absorb impact. Reset fully before each jump.' },
          { icon: 'flash', title: 'Max Intent', description: 'Jump as high as possible on every rep. Submaximal effort = submaximal results.' }
        ]
      },
      { 
        name: 'Hacksquat Jump',
        equipment: 'Landmine Attachment',
        description: 'Landmine-loaded squat jumps build single-leg explosive power.',
        battlePlan: '4 sets\n• 8 Landmine Hacksquat Jumps (each side)\n• Bar on shoulder, squat and explode\n• Land softly, immediately descend\nRest 90s between sets',
        duration: '10 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_muscle-mapper-2/artifacts/xefmav9j_Screenshot%202025-12-03%20at%204.15.36%E2%80%AFPM.png',
        intensityReason: 'Unilateral loaded jumps improve balance and single-leg power',
        difficulty: 'intermediate',
        workoutType: 'Build Explosion - Power Lifting',
        moodCard: 'Build Explosion',
        moodTips: [
          { icon: 'body', title: 'Core Stability', description: 'Brace your core to prevent rotation. The landmine wants to twist you.' },
          { icon: 'flash', title: 'Reactive Power', description: 'Minimize time on the ground between reps for plyometric benefits.' }
        ]
      },
    ],
  },
  '4': {
    mood: 'Calisthenics',
    title: 'Pulls & Dips',
    duration: '25–35 min',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    exercises: [
      { 
        name: 'Eccentric Lines',
        equipment: 'Pull up bar',
        description: 'Slow negative pull-ups build strength through controlled lowering.',
        battlePlan: '5 sets\n• 3 Eccentric Pull-Ups\n• Jump to top position\n• Hold chin over bar 2 sec\n• Lower for 8 seconds\nRest 60–90s between sets',
        duration: '10 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
        intensityReason: 'Eccentric training builds pulling strength even without full pull-up ability',
        difficulty: 'intermediate',
        workoutType: 'Calisthenics - Pulls & Dips',
        moodCard: 'Calisthenics',
        moodTips: [
          { icon: 'timer', title: 'Consistency', description: 'Each rep should take the same time. Dont speed up as you fatigue.' },
          { icon: 'fitness', title: 'Shoulder Engagement', description: 'Keep shoulders engaged even at the bottom. Dont just hang on joints.' }
        ]
      },
      { 
        name: 'Strict Pull',
        equipment: 'Pull up bar',
        description: 'Perfect form pull-ups with no kipping or swinging.',
        battlePlan: '5 sets\n• Max Strict Pull-Ups\n• Dead hang start\n• No kipping or swinging\n• Lower with control (3 sec)\nRest 90s between sets',
        duration: '12 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
        intensityReason: 'Strict form maximizes muscle activation and strength development',
        difficulty: 'intermediate',
        workoutType: 'Calisthenics - Pulls & Dips',
        moodCard: 'Calisthenics',
        moodTips: [
          { icon: 'body', title: 'Dead Stop', description: 'Come to complete stop at bottom. No bouncing out of the hang.' },
          { icon: 'fitness', title: 'Elbow Path', description: 'Pull elbows down and back, not out to the sides.' }
        ]
      },
      { 
        name: 'Eccentric Power',
        equipment: 'Parallel bars dip station',
        description: 'Slow descent dips with explosive push build upper body power.',
        battlePlan: '4 sets\n• 6 Eccentric Power Dips\n• Lower for 5 seconds\n• Go below 90° elbow angle\n• Push back up explosively\nRest 60–90s between sets',
        duration: '10 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/qhw328ft_download%20%286%29.png',
        intensityReason: 'Slow eccentric with explosive concentric builds strength and power',
        difficulty: 'intermediate',
        workoutType: 'Calisthenics - Pulls & Dips',
        moodCard: 'Calisthenics',
        moodTips: [
          { icon: 'body', title: 'Depth', description: 'Lower until shoulders are below elbows for full range of motion.' },
          { icon: 'flash', title: 'Explosive Push', description: 'Drive hard out of the bottom. Speed on the way up builds power.' }
        ]
      },
    ],
  },
  '5': {
    mood: 'Get Outside',
    title: 'Hill Workout',
    duration: '30–40 min',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop',
    exercises: [
      { 
        name: 'Hill Power Mix',
        equipment: 'Hills',
        description: 'Hill sprint intervals build explosive leg power and cardio endurance.',
        battlePlan: '10 min easy jog warm-up\n• Find a steep hill (30-60 sec climb)\n• Sprint up at 85% effort\n• Walk down for recovery\n• Repeat 6 times\n• 10 min easy jog cool-down',
        duration: '25 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_exercise-library-12/artifacts/904pke23_download%20%289%29.png',
        intensityReason: 'Hill sprints combine strength and cardio for complete conditioning',
        difficulty: 'intermediate',
        workoutType: 'Get Outside - Hill Workout',
        moodCard: 'Get Outside',
        moodTips: [
          { icon: 'body', title: 'Knee Drive', description: 'Lift knees high to engage hip flexors and glutes on the climb.' },
          { icon: 'heart', title: 'Recovery', description: 'Walk all the way down. Jogging down adds fatigue without building power.' }
        ]
      },
      { 
        name: 'Sprint Only 30s',
        equipment: 'Hills',
        description: 'Short all-out sprints with full recovery maximize power output.',
        battlePlan: '8 min easy jog warm-up\n• Find moderate incline\n• 30 sec all-out sprint\n• 90 sec walk recovery\n• Repeat 8 times\n• 5 min walk cool-down',
        duration: '22 min',
        imageUrl: 'https://customer-assets.emergentagent.com/job_exercise-library-12/artifacts/904pke23_download%20%289%29.png',
        intensityReason: 'True max effort sprints with full recovery build explosive speed',
        difficulty: 'intermediate',
        workoutType: 'Get Outside - Hill Workout',
        moodCard: 'Get Outside',
        moodTips: [
          { icon: 'flash', title: 'Max Effort', description: '30 seconds is short. Give it everything you have, every rep.' },
          { icon: 'timer', title: 'Full Recovery', description: 'Take the full 90 seconds. Partial recovery = partial effort on the next sprint.' }
        ]
      },
    ],
  },
};

export default function FeaturedWorkoutDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  
  const workoutId = params.id as string;
  const workout = featuredWorkoutData[workoutId];
  
  // Initialize exercises state with all exercises
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    workout ? [...workout.exercises] : []
  );
  
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

  const removeExercise = (index: number) => {
    if (exercises.length <= 1) {
      Alert.alert(
        'Cannot Remove',
        'You need at least one exercise to start a workout.',
        [{ text: 'OK' }]
      );
      return;
    }
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleStartWorkout = () => {
    if (exercises.length === 0) return;
    
    // Track workout started
    if (token) {
      Analytics.workoutStarted(token, {
        mood_category: `${workout.mood} - ${workout.title}`,
        difficulty: exercises[0].difficulty,
        equipment: exercises[0].equipment,
      });
    }
    
    // Format exercises for the workout guidance session - matching cart format exactly
    const sessionWorkouts = exercises.map(exercise => ({
      name: exercise.name,
      equipment: exercise.equipment,
      description: exercise.description,
      battlePlan: exercise.battlePlan,
      duration: exercise.duration,
      difficulty: exercise.difficulty,
      workoutType: exercise.workoutType,
      moodCard: exercise.moodCard,
      moodTips: exercise.moodTips
    }));
    
    // Navigate to workout guidance with the first exercise - same as cart.tsx
    const firstExercise = sessionWorkouts[0];
    router.push({
      pathname: '/workout-guidance',
      params: {
        workoutName: firstExercise.name,
        equipment: firstExercise.equipment,
        description: firstExercise.description,
        battlePlan: firstExercise.battlePlan,
        duration: firstExercise.duration,
        difficulty: firstExercise.difficulty,
        workoutType: firstExercise.workoutType,
        moodCard: firstExercise.moodCard,
        sessionWorkouts: JSON.stringify(sessionWorkouts),
        currentSessionIndex: '0',
        isSession: 'true',
        moodTips: encodeURIComponent(JSON.stringify(firstExercise.moodTips))
      }
    });
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
          <Text style={styles.sectionTitle}>Exercises ({exercises.length})</Text>
        </View>

        <ScrollView 
          style={styles.exerciseList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <Image 
                source={{ uri: exercise.imageUrl }}
                style={styles.exerciseImage}
                resizeMode="cover"
              />
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseEquipment}>{exercise.equipment}</Text>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeExercise(index)}
                activeOpacity={0.7}
              >
                <Ionicons name="remove-circle" size={28} color="#FF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.exerciseCount}>
          <Text style={styles.exerciseCountText}>
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} ready
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.startButton,
            exercises.length === 0 && styles.startButtonDisabled,
          ]}
          disabled={exercises.length === 0}
          onPress={handleStartWorkout}
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
    height: 240,
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
    bottom: 20,
    left: 20,
    right: 20,
  },
  moodLabel: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  workoutTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#333',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseEquipment: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exerciseName: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 2,
  },
  exerciseDuration: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
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
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseCount: {
    flex: 1,
  },
  exerciseCountText: {
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
