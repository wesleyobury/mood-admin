import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

interface WorkoutStatsCardProps {
  workouts: {
    workoutTitle: string;
    workoutName: string;
    equipment: string;
    duration: string;
    difficulty: string;
  }[];
  totalDuration: number;
  completedAt: string;
  moodCategory?: string;
}

export default function WorkoutStatsCard({ 
  workouts, 
  totalDuration, 
  completedAt,
  moodCategory = "Workout"
}: WorkoutStatsCardProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const statScale1 = useRef(new Animated.Value(0.9)).current;
  const statScale2 = useRef(new Animated.Value(0.9)).current;
  const statScale3 = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Card fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Top bar glow pulse
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(glowAnim, {
        toValue: 0.4,
        duration: 800,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.cubic),
      }),
    ]).start();

    // Staggered stat animations
    Animated.stagger(120, [
      Animated.spring(statScale1, {
        toValue: 1,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(statScale2, {
        toValue: 1,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(statScale3, {
        toValue: 1,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Glow opacity for top bar
  const topGlowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  // Format mood category for display
  const formatMoodCategory = (category: string) => {
    if (!category) return "Workout";
    const moodTypes: { [key: string]: string } = {
      "i want to sweat": "Sweat Session",
      "i'm feeling lazy": "Easy Flow",
      "muscle gainer": "Muscle Builder",
      "outdoor": "Outdoor Session",
      "lift weights": "Lift Session",
      "calisthenics": "Calisthenics",
      "light weights": "Light Weights",
    };
    const lowerCategory = category.toLowerCase();
    for (const [key, value] of Object.entries(moodTypes)) {
      if (lowerCategory.includes(key)) return value;
    }
    return category.split(' ').slice(0, 2).join(' ');
  };

  const displayMoodCategory = formatMoodCategory(moodCategory);
  const estimatedCalories = Math.round(totalDuration * 8);

  return (
    <Animated.View style={[
      styles.container, 
      { width: CARD_WIDTH, height: CARD_HEIGHT, opacity: fadeAnim }
    ]}>
      {/* Top Gold Gradient Bar with Glow */}
      <View style={styles.topBarContainer}>
        <LinearGradient
          colors={['#FFD700', '#DAA520', '#B8860B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBar}
        />
        <Animated.View style={[styles.topBarGlow, { opacity: topGlowOpacity }]} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.moodCategory}>{displayMoodCategory}</Text>
          <Text style={styles.completeText}>Complete</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Animated.View style={[styles.statItem, { transform: [{ scale: statScale1 }] }]}>
            <Text style={styles.statValue}>{totalDuration}</Text>
            <Text style={styles.statLabel}>minutes</Text>
          </Animated.View>

          <View style={styles.statDivider} />

          <Animated.View style={[styles.statItem, { transform: [{ scale: statScale2 }] }]}>
            <Text style={[styles.statValue, styles.statValueHighlight]}>{estimatedCalories}</Text>
            <Text style={styles.statLabel}>calories</Text>
          </Animated.View>

          <View style={styles.statDivider} />

          <Animated.View style={[styles.statItem, { transform: [{ scale: statScale3 }] }]}>
            <Text style={styles.statValue}>{workouts.length}</Text>
            <Text style={styles.statLabel}>exercises</Text>
          </Animated.View>
        </View>

        {/* Exercises List */}
        <View style={styles.exercisesList}>
          {workouts.slice(0, 4).map((workout, index) => (
            <View key={index} style={styles.exerciseRow}>
              <View style={styles.exerciseDot} />
              <Text style={styles.exerciseName} numberOfLines={1}>
                {workout.workoutTitle || workout.workoutName}
              </Text>
              <Text style={styles.exerciseMeta}>{workout.equipment}</Text>
            </View>
          ))}
          {workouts.length > 4 && (
            <Text style={styles.moreText}>+{workouts.length - 4} more</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.dateText}>{completedAt}</Text>
          <Text style={styles.brandText}>MOOD</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  topBarContainer: {
    position: 'relative',
  },
  topBar: {
    height: 3,
    width: '100%',
  },
  topBarGlow: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'transparent',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  header: {
    marginBottom: 20,
  },
  moodCategory: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  completeText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
    letterSpacing: 1,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statValueHighlight: {
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'lowercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  exercisesList: {
    flex: 1,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exerciseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD700',
    marginRight: 12,
    opacity: 0.6,
  },
  exerciseName: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },
  exerciseMeta: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.35)',
    fontWeight: '300',
  },
  moreText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  dateText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.3,
  },
  brandText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    letterSpacing: 2,
    opacity: 0.6,
  },
});
