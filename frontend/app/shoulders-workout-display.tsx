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
          name: 'Seated Shoulder Builder',
          duration: '12–14 min',
          description: '• 3x12 Seated Shoulder Press\n• 3x12 Lateral Raises\nRest 60s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction with controlled seated position for shoulder stability and proper form development.',
          moodTips: [
            {
              icon: 'bulb',
              title: 'Hard exhale on each rep',
              description: 'More core stability and shoulder efficiency.'
            },
            {
              icon: 'hand-left',
              title: 'Stop at shoulder height',
              description: 'On lateral raises and pause — over-raising shifts load away from delts.'
            },
          ]
        },
        {
          name: 'Dynamic Shoulder Flow',
          duration: '12–15 min',
          description: '• 30s alternating single-arm overhead press (march in place)\n• 30s lateral raise with 2-sec hold at top\n• 30s bent-over reverse flys\n• 30s rest\nRepeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Dynamic flow training with timed holds to enhance muscle activation and movement coordination.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Isometric pauses',
              description: 'Make light weights feel heavy — perfect for growth.'
            },
            {
              icon: 'walk',
              title: 'Marching during press',
              description: 'Ramps core activation and shoulder stability.'
            },
          ]
        },
      ],
      intermediate: [
        {
          name: 'Arnold Power Set',
          duration: '14–16 min',
          description: '• 4x10 Standing Arnold Press\n• 4x10 Upright Row\nRest 75s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intermediate strength building with Arnold press rotation for enhanced deltoid fiber recruitment.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rotate fully on Arnold presses',
              description: 'It recruits more deltoid fibers.'
            },
            {
              icon: 'trending-up',
              title: 'Pull elbows higher than wrists',
              description: 'On upright rows for maximum trap-to-delt tension.'
            },
          ]
        },
        {
          name: 'Shoulder Circuit Challenge',
          duration: '14–16 min',
          description: '• 10 Arnold presses\n• 10 "bus driver" raises (hold plate or dumbbell, rotate at top)\n• 10 push presses\n• 10 plank dumbbell drags (push-up position, drag side to side)\nRepeat 3x. Rest 75s between rounds.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Circuit training combining shoulder pressing with core integration for enhanced conditioning.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive push presses',
              description: 'Overload shoulders better than light strict raises.'
            },
            {
              icon: 'fitness',
              title: 'Plank drags double',
              description: 'As a shoulder/core integration move without extra time.'
            },
          ]
        },
      ],
      advanced: [
        {
          name: 'Explosive Press Builder',
          duration: '18–20 min',
          description: '• 4x8 Push Press\n• 4x10 Lateral Raises\n• 4x10 Bent-Over Reverse Flys\nRest 90s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High intensity training for advanced lifters combining explosive movements with isolation work.',
          moodTips: [
            {
              icon: 'body',
              title: 'Push from legs on push press',
              description: 'More load capacity = more growth.'
            },
            {
              icon: 'timer',
              title: 'Keep rear delts under tension',
              description: 'On reverse flys by stopping just shy of lockout.'
            },
          ]
        },
        {
          name: 'Dumbbell Power Flow',
          duration: '16–18 min',
          description: '• 8 clean to press\n• 8 lateral raise to front raise combo\n• 8 alternating single-arm snatch (light, explosive)\nRepeat 4x. Rest 90s between rounds.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite complex movements with explosive patterns for maximum shoulder development and power.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Pairing lateral + front raise',
              description: 'Double delt pump from one motion.'
            },
            {
              icon: 'rocket',
              title: 'Single-arm snatches',
              description: 'Teach max intent and fire up fast-twitch fibers in shoulders.'
            },
          ]
        },
      ],
    },
  },
  {
    equipment: 'Barbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Barbell Press Builder',
          duration: '12–14 min',
          description: '• 3x10 Standing Overhead Press\n• 3x10 Upright Row\nRest 60–75s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHc5fHxyaW5nfGVufDB8fHx8MVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Foundation building with basic barbell movements for shoulder strength development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Drive bar in straight path',
              description: 'Not arced — shoulders stay loaded, not joints.'
            },
            {
              icon: 'resize',
              title: 'Upright rows hit better',
              description: 'With a shoulder-width grip.'
            },
          ]
        },
        {
          name: 'Intro Shoulder Flow',
          duration: '12–14 min',
          description: '• 8 strict presses\n• 8 behind-the-neck presses (light)\n• 8 barbell "rainbows" (arc overhead side to side)\nRepeat 3x. Rest 1 min between rounds.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Introduces varied movement patterns and range of motion safely for shoulder mobility.',
          moodTips: [
            {
              icon: 'warning',
              title: 'Behind-the-neck safety',
              description: 'Only go as low as shoulder mobility allows to prevent strain.'
            },
            {
              icon: 'refresh',
              title: 'Rainbows add lateral movement',
              description: 'Recruiting stabilizers neglected in pressing.'
            },
          ]
        },
      ],
      intermediate: [
        {
          name: 'Power Press Combo',
          duration: '16–18 min',
          description: '• 4x8 Push Press\n• 4x8 Barbell High Pull\nRest 75s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Power-focused training combining leg drive pressing with high pulls for strength building.',
          moodTips: [
            {
              icon: 'body',
              title: 'Drive power from legs',
              description: 'Into push press for heavy overload.'
            },
            {
              icon: 'expand',
              title: 'Elbows drive wide and high',
              description: 'On high pulls to maximize delt stretch.'
            },
          ]
        },
        {
          name: 'Barbell Shoulder Circuit',
          duration: '14–16 min',
          description: '• 8 push presses\n• 8 barbell Z-presses (seated on floor)\n• 8 overhead lunges (alternate legs)\nRepeat 3x. Rest 90s between rounds.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Circuit format with strict movements for enhanced shoulder strength and stability.',
          moodTips: [
            {
              icon: 'shield',
              title: 'Z-press: no lower body',
              description: 'Equals strict shoulder strength.'
            },
            {
              icon: 'walk',
              title: 'Overhead lunges build stability',
              description: 'Under fatigue, great for functional hypertrophy.'
            },
          ]
        },
      ],
      advanced: [
        {
          name: 'Advanced Barbell Builder',
          duration: '18–20 min',
          description: '• 4x8 Strict Press\n• 4x8 Upright Row\n• 4x8 Front Raise (Barbell)\nRest 90s between sets.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite level training for maximum strength with strict form emphasis and constant tension.',
          moodTips: [
            {
              icon: 'checkmark-circle',
              title: 'Strict pressing keeps body honest',
              description: 'No cheating momentum.'
            },
            {
              icon: 'barbell',
              title: 'Front raise with barbell',
              description: 'Constant tension different from dumbbells.'
            },
          ]
        },
        {
          name: 'Barbell Power Complex',
          duration: '18–20 min',
          description: '• 6 push jerks\n• 6 snatch grip high pulls\n• 6 Sots presses (overhead squat position, strict press)\nRepeat 4x. Rest 90–120s after each round.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Elite complex training with maximum tension and mobility demands for advanced athletes.',
          moodTips: [
            {
              icon: 'trophy',
              title: 'Push jerk = heavy overload',
              description: 'Vital for breaking growth plateaus.'
            },
            {
              icon: 'body',
              title: 'Sots press pushes shoulders',
              description: 'Under maximum tension + mobility demand.'
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