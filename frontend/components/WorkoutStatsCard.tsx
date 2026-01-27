import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;
const CARD_HEIGHT = CARD_WIDTH * 1.25;

// Motivational phrases per mood category
const MOOD_PHRASES: { [key: string]: string[] } = {
  'sweat': ['Burn it down', 'Sweat it out', 'Torch calories', 'No comfort zone', 'Earn the sweat'],
  'burn': ['Burn it down', 'Sweat it out', 'Torch calories', 'No comfort zone', 'Earn the sweat'],
  'cardio': ['Burn it down', 'Sweat it out', 'Torch calories', 'No comfort zone', 'Earn the sweat'],
  'muscle': ['Build real muscle', 'Chase the pump', 'Lift with intent', 'Strength mode on', 'Gains over excuses'],
  'gainer': ['Build real muscle', 'Chase the pump', 'Lift with intent', 'Strength mode on', 'Gains over excuses'],
  'strength': ['Build real muscle', 'Chase the pump', 'Lift with intent', 'Strength mode on', 'Gains over excuses'],
  'explosion': ['Explode with power', 'Fast and forceful', 'Train explosive today', 'Power meets speed', 'Move violently fast'],
  'explosive': ['Explode with power', 'Fast and forceful', 'Train explosive today', 'Power meets speed', 'Move violently fast'],
  'power': ['Explode with power', 'Fast and forceful', 'Train explosive today', 'Power meets speed', 'Move violently fast'],
  'lazy': ['Just move today', 'Low effort wins', 'Ease into motion', 'Start where you are', 'Movement beats nothing'],
  'calisthenics': ['Control your body', 'Strength, no weights', 'Bodyweight mastery', 'Move with control', 'Own every rep'],
  'bodyweight': ['Control your body', 'Strength, no weights', 'Bodyweight mastery', 'Move with control', 'Own every rep'],
  'outdoor': ['Move in daylight', 'Fresh air reps', 'Outside hits different', 'Train beyond walls', 'Take it outside'],
  'outside': ['Move in daylight', 'Fresh air reps', 'Outside hits different', 'Train beyond walls', 'Take it outside'],
};

// Fallback motivational phrases
const FALLBACK_PHRASES = [
  'Keep moving forward',
  'One rep at a time',
  'Progress over perfection',
  'Show up for yourself',
  'Every rep counts',
];

interface WorkoutStatsCardProps {
  workouts: {
    workoutTitle: string;
    workoutName: string;
    equipment: string;
    duration: string;
    difficulty: string;
    moodCategory?: string;
  }[];
  totalDuration: number;
  completedAt: string;
  moodCategory?: string;
  transparent?: boolean;
  editedDuration?: number;
  editedCalories?: number;
}

export default function WorkoutStatsCard({ 
  workouts, 
  totalDuration, 
  completedAt,
  moodCategory = "Workout",
  transparent = false,
  editedDuration,
  editedCalories,
}: WorkoutStatsCardProps) {
  // Animation values
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const statScale1 = useRef(new Animated.Value(0.8)).current;
  const statScale2 = useRef(new Animated.Value(0.8)).current;
  const statScale3 = useRef(new Animated.Value(0.8)).current;

  // Use edited values if provided, otherwise calculate
  const displayDuration = editedDuration !== undefined ? editedDuration : totalDuration;
  const estimatedCalories = editedCalories !== undefined ? editedCalories : Math.round(totalDuration * 8);

  // Calculate dominant mood category from workouts
  const getDominantMoodCategory = (): string => {
    const categoryCounts: { [key: string]: number } = {};
    
    workouts.forEach(workout => {
      const category = workout.moodCategory || moodCategory || 'Workout';
      const normalizedCategory = category.toLowerCase();
      categoryCounts[normalizedCategory] = (categoryCounts[normalizedCategory] || 0) + 1;
    });
    
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

  // Get random motivational phrase based on workout category
  const getMoodPhrase = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    
    for (const [keyword, phrases] of Object.entries(MOOD_PHRASES)) {
      if (lowerCategory.includes(keyword)) {
        return phrases[Math.floor(Math.random() * phrases.length)];
      }
    }
    
    return FALLBACK_PHRASES[Math.floor(Math.random() * FALLBACK_PHRASES.length)];
  };

  // Extract the main mood card name from workoutType or moodCategory
  const extractMoodCardName = (category: string): string => {
    if (!category || category.toLowerCase() === 'workout' || category.toLowerCase() === 'unknown') {
      return "";
    }
    
    if (category.includes(' - ')) {
      const moodCardPart = category.split(' - ')[0].trim();
      return moodCardPart;
    }
    
    const moodCardTitles: { [key: string]: string } = {
      "i want to sweat": "Sweat / Burn Fat",
      "sweat / burn fat": "Sweat / Burn Fat",
      "i'm feeling lazy": "I'm Feeling Lazy",
      "muscle gainer": "Muscle Gainer",
      "outdoor": "Get Outside",
      "outside": "Get Outside",
      "lift weights": "Lift Weights",
      "calisthenics": "Calisthenics",
      "bodyweight": "Calisthenics",
      "build explosion": "Build Explosion",
      "explosive": "Build Explosion",
    };
    
    const lowerCategory = category.toLowerCase();
    for (const [key, value] of Object.entries(moodCardTitles)) {
      if (lowerCategory.includes(key)) return value;
    }
    
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const dominantCategory = getDominantMoodCategory();
  const displayMoodCategory = extractMoodCardName(dominantCategory);
  const moodPhrase = useMemo(() => getMoodPhrase(dominantCategory), [dominantCategory]);
  
  // Convert to spaced letter format: "BURN IT DOWN" -> "B U R N  I T  D O W N"
  const spacedMoodPhrase = useMemo(() => {
    return moodPhrase.toUpperCase().split(' ').map(word => word.split('').join(' ')).join('   ');
  }, [moodPhrase]);

  useEffect(() => {
    // Initial card fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Glow pulse animation
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

  // Transparent version for Instagram Stories export
  if (transparent) {
    return (
      <View style={[styles.transparentContainer, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
        {/* Header Section */}
        <View style={styles.transparentHeader}>
          {/* Breathing Pulse Indicator */}
          <View style={styles.transparentPulseIndicator}>
            <View style={styles.transparentPulseCore} />
          </View>
          
          <View style={styles.transparentHeaderText}>
            <Text style={styles.transparentMoodCategory} numberOfLines={1}>
              {displayMoodCategory ? displayMoodCategory.toUpperCase() : 'WORKOUT COMPLETE'}
            </Text>
            <Text style={styles.transparentSubtitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>{spacedMoodPhrase}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.transparentStatsSection}>
          <View style={styles.transparentStatOrb}>
            <Text style={styles.transparentStatValue}>{displayDuration}</Text>
            <Text style={styles.transparentStatLabel}>minutes</Text>
          </View>

          <View style={[styles.transparentStatOrb, styles.transparentStatOrbCenter]}>
            <Text style={[styles.transparentStatValue, styles.transparentStatValueLarge]}>{estimatedCalories}</Text>
            <Text style={styles.transparentStatLabel}>calories</Text>
          </View>

          <View style={styles.transparentStatOrb}>
            <Text style={styles.transparentStatValue}>{workouts.length}</Text>
            <Text style={styles.transparentStatLabel}>exercises</Text>
          </View>
        </View>

        {/* Exercises List */}
        <View style={styles.transparentExercisesSection}>
          {workouts.slice(0, 5).map((workout, index) => (
            <View key={index} style={styles.transparentExerciseRow}>
              <View style={styles.transparentExerciseDot} />
              <Text style={styles.transparentExerciseText} numberOfLines={1}>
                {workout.workoutTitle || workout.workoutName} | {workout.equipment}
              </Text>
            </View>
          ))}
          {workouts.length > 5 && (
            <Text style={styles.transparentMoreExercises}>
              +{workouts.length - 5} more
            </Text>
          )}
        </View>

        {/* Footer - MOOD on left */}
        <View style={styles.transparentFooter}>
          <Text style={styles.transparentBrandText}>MOOD</Text>
        </View>
      </View>
    );
  }

  // Standard card version with background
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
            <Text style={styles.subtitle}>{spacedMoodPhrase}</Text>
          </View>
        </View>

        {/* Stats Section - Floating Orbs */}
        <View style={styles.statsSection}>
          <Animated.View style={[styles.statOrb, { transform: [{ scale: statScale1 }] }]}>
            <View style={styles.statOrbInner}>
              <Text style={styles.statValue}>{displayDuration}</Text>
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

        {/* Exercises List */}
        <View style={styles.exercisesSection}>
          {workouts.slice(0, 5).map((workout, index) => (
            <View key={index} style={styles.exerciseRow}>
              <View style={styles.exerciseDot} />
              <Text style={styles.exerciseText} numberOfLines={1}>
                <Text style={styles.exerciseName}>{workout.workoutTitle || workout.workoutName}</Text>
                <Text style={styles.exerciseDivider}> | </Text>
                <Text style={styles.exerciseMeta}>{workout.equipment}</Text>
              </Text>
            </View>
          ))}
          {workouts.length > 5 && (
            <Text style={styles.moreExercises}>
              +{workouts.length - 5} more
            </Text>
          )}
        </View>

        {/* Footer - MOOD on left */}
        <View style={styles.footer}>
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
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
    marginTop: 4,
    fontWeight: '400',
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
  exerciseText: {
    flex: 1,
    fontSize: 13,
  },
  exerciseName: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  exerciseDivider: {
    color: 'rgba(255, 255, 255, 0.25)',
  },
  exerciseMeta: {
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  brandText: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '600',
    letterSpacing: 2,
  },

  // ===============================================
  // TRANSPARENT VERSION STYLES (for Instagram export)
  // ===============================================
  transparentContainer: {
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  transparentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  transparentPulseIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transparentPulseCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
  transparentHeaderText: {
    flex: 1,
  },
  transparentMoodCategory: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  transparentSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
    marginTop: 4,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  transparentStatsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
  },
  transparentStatOrb: {
    flex: 1,
    alignItems: 'center',
  },
  transparentStatOrbCenter: {
    flex: 1.2,
  },
  transparentStatValue: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  transparentStatValueLarge: {
    fontSize: 34,
    color: '#FFD700',
    fontWeight: '400',
  },
  transparentStatLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'lowercase',
    letterSpacing: 1,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  transparentExercisesSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  transparentExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transparentExerciseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginRight: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  transparentExerciseText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  transparentMoreExercises: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  transparentFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  transparentBrandText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
