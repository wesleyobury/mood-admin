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

// Define workout exercise type
interface WorkoutExercise {
  equipment: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description?: string;
  battlePlan?: string;
  duration?: string;
  moodTips?: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string }[];
}

// Define the workout data for each featured workout
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
        equipment: 'Stationary Bike', 
        name: 'Hill & Sprint', 
        icon: 'bicycle',
        description: '5 min warm-up at moderate resistance\n• 2 min seated climb (high resistance)\n• 1 min standing sprint (moderate resistance)\n• 2 min recovery spin\n• Repeat climb-sprint-recovery 3x\n• 5 min cool down',
        battlePlan: 'Alternate between seated climbs and standing sprints. Keep cadence above 80 RPM during sprints. Focus on powerful leg drive during climbs.',
        duration: '15 min',
        moodTips: [
          { icon: 'speedometer', title: 'Maintain Cadence', description: 'Keep your pedaling cadence consistent during climbs for better muscle engagement.' },
          { icon: 'heart', title: 'Heart Rate Zone', description: 'Aim for 70-85% max heart rate during sprints, recover at 60% between intervals.' }
        ]
      },
      { 
        equipment: 'Stair Master', 
        name: 'Hill Climb', 
        icon: 'trending-up',
        description: '3 min warm-up at level 4\n• 2 min at level 7\n• 1 min at level 10 (power steps)\n• 2 min at level 5 (recovery)\n• Repeat high-power-recovery 4x\n• 3 min cool down at level 3',
        battlePlan: 'Use the full range of motion on each step. Avoid holding the rails except for balance. Engage your glutes on each push.',
        duration: '18 min',
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
      { 
        equipment: 'Adjustable Bench', 
        name: 'Chest Support Row', 
        icon: 'fitness',
        description: 'Set bench at 45° incline\n• Lie face down, arms hanging\n• 12 reps with 3-second negative\n• Rest 60 sec\n• 10 reps with pause at top\n• Rest 60 sec\n• 8 reps heavy, controlled',
        battlePlan: 'Keep chest pressed into bench throughout. Squeeze shoulder blades together at the top of each rep. Control the descent.',
        duration: '8 min',
        moodTips: [
          { icon: 'fitness', title: 'Scapular Retraction', description: 'Initiate each rep by pulling shoulder blades together before bending elbows.' },
          { icon: 'timer', title: 'Time Under Tension', description: 'Slow negatives build more muscle. Count 3 seconds on the way down.' }
        ]
      },
      { 
        equipment: 'T-Bar Row Machine', 
        name: 'Slow Neg Row', 
        icon: 'barbell',
        description: 'Load moderate weight\n• 10 reps with 4-second negative\n• Rest 90 sec\n• 8 reps with 5-second negative\n• Rest 90 sec\n• 6 reps max weight, controlled negative',
        battlePlan: 'Brace core, hinge at hips. Pull to lower chest. Emphasize the slow lowering phase for maximum muscle breakdown.',
        duration: '10 min',
        moodTips: [
          { icon: 'body', title: 'Hip Hinge', description: 'Maintain neutral spine by hinging from hips, not rounding lower back.' },
          { icon: 'flash', title: 'Eccentric Focus', description: 'The slow negative is where muscle growth happens. Resist the weight down.' }
        ]
      },
      { 
        equipment: 'Straight Pull Up Bar', 
        name: 'Pull Up + Hold', 
        icon: 'body',
        description: 'Dead hang start\n• Pull up to chin over bar\n• Hold at top for 3 seconds\n• Lower with 4-second negative\n• Rest 10 sec between reps\n• Perform 5 sets of 5 reps',
        battlePlan: 'Full extension at bottom, chin over bar at top. The isometric hold builds strength at the hardest position.',
        duration: '12 min',
        moodTips: [
          { icon: 'body', title: 'Full Range', description: 'Start from complete dead hang and finish with chin clearly over the bar.' },
          { icon: 'fitness', title: 'Engage Lats', description: 'Think about pulling elbows down to your hips rather than pulling yourself up.' }
        ]
      },
      { 
        equipment: 'Cable Machine', 
        name: 'Cable Negatives', 
        icon: 'git-pull-request',
        description: 'Set cable at high position\n• Curl up fast (1 sec)\n• Lower slowly (5 sec negative)\n• 12 reps each arm\n• Rest 45 sec\n• Repeat for 3 sets',
        battlePlan: 'Use momentum-free curls on the way up. Fight the weight all the way down. Maintain constant tension.',
        duration: '8 min',
        moodTips: [
          { icon: 'fitness', title: 'Elbow Position', description: 'Keep elbows pinned to your sides throughout the movement.' },
          { icon: 'timer', title: 'Control', description: 'If you cant control the 5-second negative, reduce the weight.' }
        ]
      },
      { 
        equipment: 'EZ Curl Bar', 
        name: 'Narrow Curl', 
        icon: 'barbell',
        description: 'Grip inner curves of EZ bar\n• 10 reps controlled\n• Rest 60 sec\n• 8 reps with pause at bottom\n• Rest 60 sec\n• 6 reps heavy, full squeeze at top',
        battlePlan: 'Narrow grip targets the outer bicep head. Keep wrists neutral. Squeeze hard at the top of each rep.',
        duration: '7 min',
        moodTips: [
          { icon: 'hand-left', title: 'Wrist Position', description: 'Keep wrists straight and strong. The EZ bar reduces wrist strain.' },
          { icon: 'flame', title: 'Peak Contraction', description: 'Squeeze biceps hard at the top and hold for 1 second.' }
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
        equipment: 'Power Lifting Platform', 
        name: 'Hang Clean Pull to Tall Shrug', 
        icon: 'flash',
        description: 'Start at mid-thigh hang position\n• Explosive hip extension\n• Shrug shoulders to ears\n• Arms stay straight\n• Reset and repeat\n• 5 sets of 5 reps',
        battlePlan: 'Power comes from the hips, not the arms. Shrug violently at the top. Keep bar close to body throughout.',
        duration: '10 min',
        moodTips: [
          { icon: 'flash', title: 'Hip Drive', description: 'The power comes from snapping your hips forward, not pulling with arms.' },
          { icon: 'body', title: 'Triple Extension', description: 'Extend ankles, knees, and hips simultaneously for maximum power.' }
        ]
      },
      { 
        equipment: 'Power Lifting Platform', 
        name: 'Push Press Launch', 
        icon: 'arrow-up',
        description: 'Bar in front rack position\n• Dip knees 4 inches\n• Explode upward, pressing bar overhead\n• Lock out arms at top\n• Lower with control\n• 5 sets of 5 reps',
        battlePlan: 'Quick dip, explosive drive. Use leg power to launch the bar, then press to lockout. Keep core tight throughout.',
        duration: '10 min',
        moodTips: [
          { icon: 'trending-up', title: 'Vertical Path', description: 'Push your head through once the bar passes your face for proper lockout.' },
          { icon: 'flash', title: 'Speed Matters', description: 'The faster the dip-drive, the more weight you can move.' }
        ]
      },
      { 
        equipment: 'Trap Hex Bar', 
        name: 'Trap Bar Jump', 
        icon: 'trending-up',
        description: 'Stand in center of trap bar\n• Deadlift to standing\n• Dip and explode into jump\n• Land softly, reset\n• 4 sets of 6 reps\n• Rest 90 sec between sets',
        battlePlan: 'Use 50% of your deadlift max. Focus on explosive vertical power. Land softly with bent knees.',
        duration: '10 min',
        moodTips: [
          { icon: 'body', title: 'Soft Landing', description: 'Land with bent knees to absorb impact. Reset fully before each jump.' },
          { icon: 'flash', title: 'Max Intent', description: 'Jump as high as possible on every rep. Submaximal effort = submaximal results.' }
        ]
      },
      { 
        equipment: 'Landmine Attachment', 
        name: 'Hacksquat Jump', 
        icon: 'flame',
        description: 'Bar on one shoulder\n• Squat down, thighs parallel\n• Explode up into small hop\n• Land, immediately descend\n• 4 sets of 8 reps each side',
        battlePlan: 'Keep torso upright. The landmine angle provides stability while building single-leg power.',
        duration: '10 min',
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
        equipment: 'Pull Up Bar', 
        name: 'Eccentric Lines', 
        icon: 'body',
        description: 'Jump to top position\n• Hold chin over bar 2 sec\n• Lower for 8 seconds (count)\n• Full dead hang at bottom\n• Rest 15 sec\n• Repeat for 5 sets of 3 reps',
        battlePlan: 'Control every inch of the descent. If 8 seconds is easy, slow down to 10. Build strength through the sticking point.',
        duration: '10 min',
        moodTips: [
          { icon: 'timer', title: 'Consistency', description: 'Each rep should take the same time. Dont speed up as you fatigue.' },
          { icon: 'fitness', title: 'Shoulder Engagement', description: 'Keep shoulders engaged even at the bottom. Dont just hang on joints.' }
        ]
      },
      { 
        equipment: 'Pull Up Bar', 
        name: 'Strict Pull', 
        icon: 'arrow-up',
        description: 'Dead hang, shoulders engaged\n• Pull until chin clears bar\n• No kipping or swinging\n• Lower with control (3 sec)\n• 5 sets of max reps\n• Rest 90 sec between sets',
        battlePlan: 'Quality over quantity. Stop the set when form breaks down. Aim to increase reps each week.',
        duration: '12 min',
        moodTips: [
          { icon: 'body', title: 'Dead Stop', description: 'Come to complete stop at bottom. No bouncing out of the hang.' },
          { icon: 'fitness', title: 'Elbow Path', description: 'Pull elbows down and back, not out to the sides.' }
        ]
      },
      { 
        equipment: 'Parallel Bars Dip Station', 
        name: 'Eccentric Power', 
        icon: 'fitness',
        description: 'Start at top, arms locked\n• Lower for 5 seconds\n• Go below 90° elbow angle\n• Push back up explosively\n• 4 sets of 6 reps\n• Rest 60 sec between sets',
        battlePlan: 'Slow descent, fast ascent. Keep elbows tracking back, not flaring out. Chest stays proud.',
        duration: '10 min',
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
        equipment: 'Hills', 
        name: 'Power Mix', 
        icon: 'trail-sign',
        description: '10 min easy jog warm-up\n• Find a steep hill (30-60 sec climb)\n• Sprint up at 85% effort\n• Walk down for recovery\n• Repeat 6 times\n• 10 min easy jog cool-down',
        battlePlan: 'Drive knees high on the uphill. Pump arms powerfully. Stay on your toes. Walk recovery - dont jog.',
        duration: '25 min',
        moodTips: [
          { icon: 'body', title: 'Knee Drive', description: 'Lift knees high to engage hip flexors and glutes on the climb.' },
          { icon: 'heart', title: 'Recovery', description: 'Walk all the way down. Jogging down adds fatigue without building power.' }
        ]
      },
      { 
        equipment: 'Hills', 
        name: 'Sprint Only 30s', 
        icon: 'speedometer',
        description: '8 min easy jog warm-up\n• Find moderate incline\n• 30 sec all-out sprint\n• 90 sec walk recovery\n• Repeat 8 times\n• 5 min walk cool-down',
        battlePlan: 'True 30-second max efforts. If you can talk after, you didnt go hard enough. Full recovery between reps.',
        duration: '22 min',
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
        difficulty: 'intermediate',
        equipment: exercises[0].equipment,
      });
    }
    
    // Format exercises for the workout guidance session
    const sessionWorkouts = exercises.map(exercise => ({
      name: exercise.name,
      equipment: exercise.equipment,
      description: exercise.description || '',
      battlePlan: exercise.battlePlan || '',
      duration: exercise.duration || '10 min',
      difficulty: 'intermediate',
      workoutType: `${workout.mood} - ${workout.title}`,
      moodCard: workout.mood,
      moodTips: exercise.moodTips || []
    }));
    
    // Navigate to workout guidance with the first exercise
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
              <View style={styles.exerciseIconContainer}>
                <Ionicons name={exercise.icon} size={24} color="#FFD700" />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseEquipment}>{exercise.equipment}</Text>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
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
    height: 260,
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
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
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  exerciseIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
