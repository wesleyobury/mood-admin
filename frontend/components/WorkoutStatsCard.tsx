import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;
const CARD_HEIGHT = CARD_WIDTH * 1.25;

// Motivational phrases that rotate randomly
const MOTIVATIONAL_PHRASES = [
  'A M A Z I N G   W O R K',
  'M I S S I O N   C O M P L E T E',
  'E X C E L L E N T   J O B',
  'Y O U   C R U S H E D   I T',
  'B E A S T   M O D E',
  'U N S T O P P A B L E',
  'N E W   P E R S O N A L   B E S T',
  'P U R E   D E D I C A T I O N',
  'G O A L S   A C H I E V E D',
  'S T R O N G E R   T O D A Y',
  'K E E P   W I N N I N G',
  'L E G E N D A R Y',
  'P E A K   P E R F O R M A N C E',
  'C H A M P I O N   M O V E',
  'F L A W L E S S   E X E C U T I O N',
];

interface WorkoutStatsCardProps {
  workouts: {
    workoutTitle: string;
    workoutName: string;
    equipment: string;
    duration: string;
    difficulty: string;
    moodCategory?: string; // Track which mood card this exercise came from
  }[];
  totalDuration: number;
  completedAt: string;
  moodCategory?: string; // Fallback/legacy mood category
}

export default function WorkoutStatsCard({ 
  workouts, 
  totalDuration, 
  completedAt,
  moodCategory = "Workout"
}: WorkoutStatsCardProps) {
  // Select a random motivational phrase (memoized so it doesn't change on re-renders)
  const motivationalPhrase = useMemo(() => {
    return MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
  }, []);

  // Animation values
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const statScale1 = useRef(new Animated.Value(0.8)).current;
  const statScale2 = useRef(new Animated.Value(0.8)).current;
  const statScale3 = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Initial card fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Glow pulse animation - intensifies then settles
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(glowAnim, {
        toValue: 0.3,
        duration: 1200,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.cubic),
      }),
    ]).start();

    // Breathing pulse for the indicator dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // Staggered stat animations
    Animated.stagger(150, [
      Animated.spring(statScale1, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(statScale2, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(statScale3, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Interpolate glow opacity
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.15],
  });

  // Calculate dominant mood category from workouts
  const getDominantMoodCategory = (): string => {
    // Count occurrences of each mood category from workouts
    const categoryCounts: { [key: string]: number } = {};
    
    workouts.forEach(workout => {
      const category = workout.moodCategory || moodCategory || 'Workout';
      const normalizedCategory = category.toLowerCase();
      categoryCounts[normalizedCategory] = (categoryCounts[normalizedCategory] || 0) + 1;
    });
    
    // Find the category with the most exercises
    let dominantCategory = moodCategory || 'Workout';
    let maxCount = 0;
    
    for (const [category, count] of Object.entries(categoryCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantCategory = category;
      }
    }
    
    return dominantCategory;
  };

  // Extract the main mood card name from workoutType or moodCategory
  // workoutType might be "Calisthenics - Bodyweight exercises" or "Muscle Gainer - Shoulders"
  const extractMoodCardName = (category: string): string => {
    if (!category || category.toLowerCase() === 'workout' || category.toLowerCase() === 'unknown') {
      return "";
    }
    
    // If it contains " - ", extract the first part (mood card name)
    if (category.includes(' - ')) {
      const moodCardPart = category.split(' - ')[0].trim();
      return moodCardPart;
    }
    
    // Known mood card titles - check if category matches or contains these
    const moodCardTitles: { [key: string]: string } = {
      "i want to sweat": "I Want to Sweat",
      "i'm feeling lazy": "I'm Feeling Lazy",
      "muscle gainer": "Muscle Gainer",
      "outdoor": "Outdoor",
      "lift weights": "Lift Weights",
      "calisthenics": "Calisthenics",
      "bodyweight": "Calisthenics", // Map bodyweight to Calisthenics
    };
    
    const lowerCategory = category.toLowerCase();
    for (const [key, value] of Object.entries(moodCardTitles)) {
      if (lowerCategory.includes(key)) return value;
    }
    
    // If nothing matches, return the original (capitalized)
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const dominantCategory = getDominantMoodCategory();
  const displayMoodCategory = extractMoodCardName(dominantCategory);
  const estimatedCalories = Math.round(totalDuration * 8);

  return (
    <Animated.View style={[
      styles.container, 
      { width: CARD_WIDTH, height: CARD_HEIGHT, opacity: fadeAnim }
    ]}>
      {/* Outer Aura Glow */}
      <Animated.View style={[styles.outerGlow, { opacity: glowOpacity }]} />
      
      {/* Inner Container with Gradient */}
      <View style={styles.innerContainer}>
        {/* Radial gradient background effect */}
        <LinearGradient
          colors={['rgba(255, 215, 0, 0.08)', 'rgba(255, 215, 0, 0.02)', 'transparent']}
          style={styles.radialGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
        />

        {/* Header Section */}
        <View style={styles.header}>
          {/* Breathing Pulse Indicator */}
          <Animated.View style={[
            styles.pulseIndicator,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            <View style={styles.pulseCore} />
          </Animated.View>
          
          <View style={styles.headerText}>
            <Text style={styles.moodCategory} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              {displayMoodCategory ? displayMoodCategory.toUpperCase() : 'WORKOUT COMPLETE'}
            </Text>
            <Text style={styles.subtitle}>{motivationalPhrase}</Text>
          </View>
        </View>

        {/* Stats Section - Floating Orbs */}
        <View style={styles.statsSection}>
          <Animated.View style={[styles.statOrb, { transform: [{ scale: statScale1 }] }]}>
            <View style={styles.statOrbInner}>
              <Text style={styles.statValue}>{totalDuration}</Text>
              <Text style={styles.statLabel}>minutes</Text>
            </View>
            <View style={styles.statGlow} />
          </Animated.View>

          <Animated.View style={[styles.statOrb, styles.statOrbCenter, { transform: [{ scale: statScale2 }] }]}>
            <View style={styles.statOrbInner}>
              <Text style={[styles.statValue, styles.statValueLarge]}>{estimatedCalories}</Text>
              <Text style={styles.statLabel}>calories</Text>
            </View>
            <View style={[styles.statGlow, styles.statGlowCenter]} />
          </Animated.View>

          <Animated.View style={[styles.statOrb, { transform: [{ scale: statScale3 }] }]}>
            <View style={styles.statOrbInner}>
              <Text style={styles.statValue}>{workouts.length}</Text>
              <Text style={styles.statLabel}>exercises</Text>
            </View>
            <View style={styles.statGlow} />
          </Animated.View>
        </View>

        {/* Exercises List - Subtle */}
        <View style={styles.exercisesSection}>
          {workouts.slice(0, 5).map((workout, index) => (
            <View key={index} style={styles.exerciseRow}>
              <View style={styles.exerciseDot} />
              <Text style={styles.exerciseName} numberOfLines={1}>
                {workout.workoutTitle || workout.workoutName}
              </Text>
              <Text style={styles.exerciseMeta}>
                {workout.equipment}
              </Text>
            </View>
          ))}
          {workouts.length > 5 && (
            <Text style={styles.moreExercises}>
              +{workouts.length - 5} more
            </Text>
          )}
        </View>

        {/* Footer - Minimal */}
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
    borderRadius: 24,
    overflow: 'visible',
    position: 'relative',
  },
  outerGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  radialGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  pulseIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pulseCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  headerText: {
    flex: 1,
  },
  moodCategory: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 3,
    marginTop: 4,
    fontWeight: '300',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  statOrb: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  statOrbCenter: {
    flex: 1.2,
  },
  statOrbInner: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statGlow: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    borderRadius: 1,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  statGlowCenter: {
    backgroundColor: 'rgba(255, 215, 0, 0.5)',
    shadowColor: '#FFD700',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  statValueLarge: {
    fontSize: 30,
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'lowercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  exercisesSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  exerciseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.5)',
    marginRight: 12,
  },
  exerciseName: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  exerciseMeta: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.25)',
    fontWeight: '300',
  },
  moreExercises: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 0.5,
  },
  brandText: {
    fontSize: 11,
    color: 'rgba(255, 215, 0, 0.4)',
    fontWeight: '600',
    letterSpacing: 2,
  },
});
