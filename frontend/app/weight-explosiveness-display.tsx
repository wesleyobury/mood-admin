import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface WorkoutData {
  id: string;
  name: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
}

const weightExplosivenessWorkouts: WorkoutData[] = [
  {
    id: '1',
    name: 'Olympic Lifting Power',
    image: 'https://customer-assets.emergentagent.com/job_mood-workout-app/artifacts/kuk8f49i_download%20%282%29.webp',
    difficulty: 'Advanced',
    duration: '35 mins',
    description: 'Clean & jerk, snatches, and power movements to build explosive strength with barbells',
  },
  {
    id: '2', 
    name: 'Power Lifting Basics',
    image: 'https://customer-assets.emergentagent.com/job_mood-workout-app/artifacts/kuk8f49i_download%20%282%29.webp',
    difficulty: 'Intermediate',
    duration: '30 mins',
    description: 'Explosive deadlifts, box jumps with weights, and power-focused compound movements',
  },
  {
    id: '3',
    name: 'Beginner Power Training',
    image: 'https://customer-assets.emergentagent.com/job_mood-workout-app/artifacts/kuk8f49i_download%20%282%29.webp',
    difficulty: 'Beginner',
    duration: '25 mins',
    description: 'Introduction to weighted explosive movements with proper form and safety',
  },
  {
    id: '4',
    name: 'Athletic Performance',
    image: 'https://customer-assets.emergentagent.com/job_mood-workout-app/artifacts/kuk8f49i_download%20%282%29.webp',
    difficulty: 'Advanced',
    duration: '40 mins',
    description: 'Sport-specific explosive training with weights for peak athletic performance',
  },
];

const WorkoutCard = ({ workout }: { workout: WorkoutData }) => {
  const router = useRouter();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FFD700';
      case 'Advanced': return '#FF6B6B';
      default: return '#FFD700';
    }
  };

  const handleStartWorkout = () => {
    router.push({
      pathname: '/workout-guidance',
      params: {
        workoutName: workout.name,
        workoutDuration: workout.duration,
        workoutDifficulty: workout.difficulty,
        workoutType: 'Weight-Based Explosiveness'
      }
    });
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: workout.image }} style={styles.workoutImage} />
      <View style={styles.cardContent}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutDescription}>{workout.description}</Text>
        
        <View style={styles.workoutMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#FFD700" />
            <Text style={styles.metaText}>{workout.duration}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(workout.difficulty) }]}>
            <Text style={styles.difficultyText}>{workout.difficulty}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
          <Text style={styles.startButtonText}>Start Workout</Text>
          <Ionicons name="play" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function WeightExplosivenessDisplay() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const moodTitle = params.mood as string || 'I want to build explosiveness';
  const workoutType = params.workoutType as string || 'Weight Based';

  const handleGoBack = () => {
    router.back();
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const createProgressRows = () => {
    return [
      {
        icon: 'flash' as keyof typeof Ionicons.glyphMap,
        label: moodTitle,
      },
      {
        icon: 'barbell' as keyof typeof Ionicons.glyphMap,
        label: workoutType,
      },
      {
        icon: 'trending-up' as keyof typeof Ionicons.glyphMap,
        label: 'High Intensity',
      },
      {
        icon: 'fitness' as keyof typeof Ionicons.glyphMap,
        label: `${weightExplosivenessWorkouts.length} Workouts`,
      },
    ];
  };

  const progressRows = createProgressRows();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Explosiveness Training</Text>
          <Text style={styles.headerSubtitle}>{workoutType}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          {progressRows.map((item, index) => (
            <React.Fragment key={index}>
              <View style={styles.progressItem}>
                <Ionicons name={item.icon} size={16} color="#FFD700" />
                <Text style={styles.progressText}>{item.label}</Text>
              </View>
              {index < progressRows.length - 1 && (
                <Ionicons name="chevron-forward" size={12} color="rgba(255, 215, 0, 0.5)" />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Workout Cards */}
      <View style={styles.cardsContainer}>
        <FlatList
          ref={flatListRef}
          data={weightExplosivenessWorkouts}
          renderItem={({ item }) => <WorkoutCard workout={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig.current}
          contentContainerStyle={styles.flatListContent}
        />
      </View>

      {/* Dots Navigation */}
      <View style={styles.dotsContainer}>
        {weightExplosivenessWorkouts.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? '#FFD700' : 'rgba(255, 215, 0, 0.3)',
                width: index === currentIndex ? 20 : 8,
              },
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  cardsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  flatListContent: {
    paddingHorizontal: 12,
  },
  card: {
    width: width - 48,
    marginHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  workoutImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 24,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  workoutDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 20,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  startButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});