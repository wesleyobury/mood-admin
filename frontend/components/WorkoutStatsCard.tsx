import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;
const CARD_HEIGHT = CARD_WIDTH * 1.25;

// Ring configuration
const RING_SIZE = 140;
const RING_CENTER = RING_SIZE / 2;

// Ring radii (from outer to inner)
const CALORIES_RING_RADIUS = 62;
const MINUTES_RING_RADIUS = 48;
const INTENSITY_RING_RADIUS = 34;
const RING_STROKE_WIDTH = 10;

// Default targets
const DEFAULT_CALORIE_TARGET = 500;
const DEFAULT_MINUTE_TARGET = 60;

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

const FALLBACK_PHRASES = [
  'Keep moving forward',
  'One rep at a time',
  'Progress over perfection',
  'Show up for yourself',
  'Every rep counts',
];

// Intensity calculation based on workout type
const INTENSITY_PRESETS: { [key: string]: number } = {
  'lazy': 0.38,
  'recovery': 0.35,
  'stretch': 0.32,
  'mixed': 0.55,
  'moderate': 0.60,
  'muscle': 0.70,
  'gainer': 0.72,
  'strength': 0.75,
  'sweat': 0.78,
  'burn': 0.80,
  'cardio': 0.82,
  'hiit': 0.85,
  'explosion': 0.88,
  'explosive': 0.88,
  'power': 0.85,
  'intense': 0.90,
};

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
  calorieTarget?: number;
  minuteTarget?: number;
}

// Calculate intensity percentage based on workout characteristics
function calculateIntensity(workouts: any[], moodCategory: string, totalDuration: number): number {
  // Base intensity from mood category
  let baseIntensity = 0.55; // default mixed
  const lowerCategory = moodCategory.toLowerCase();
  
  for (const [keyword, value] of Object.entries(INTENSITY_PRESETS)) {
    if (lowerCategory.includes(keyword)) {
      baseIntensity = value;
      break;
    }
  }
  
  // Adjust based on workout count (more exercises = higher density)
  const exerciseBonus = Math.min(workouts.length * 0.02, 0.10);
  
  // Adjust based on duration (longer workouts at same intensity = slightly higher)
  const durationBonus = totalDuration > 45 ? 0.05 : totalDuration > 30 ? 0.03 : 0;
  
  // Check for compound exercises (higher intensity)
  const compoundKeywords = ['squat', 'deadlift', 'press', 'row', 'lunge', 'clean', 'snatch'];
  const hasCompounds = workouts.some(w => 
    compoundKeywords.some(k => 
      (w.workoutName || w.workoutTitle || '').toLowerCase().includes(k)
    )
  );
  const compoundBonus = hasCompounds ? 0.05 : 0;
  
  const finalIntensity = Math.min(baseIntensity + exerciseBonus + durationBonus + compoundBonus, 0.95);
  return finalIntensity;
}

// Calculate ring progress (counterclockwise)
function getStrokeDasharray(progress: number, radius: number): { dashArray: string; dashOffset: number } {
  const circumference = 2 * Math.PI * radius;
  const progressLength = circumference * Math.min(progress, 1);
  // Counterclockwise: start from top, go left
  return {
    dashArray: `${progressLength} ${circumference}`,
    dashOffset: circumference * 0.25, // Start from top
  };
}

// Animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function WorkoutStatsCard({ 
  workouts, 
  totalDuration, 
  completedAt,
  moodCategory = "Workout",
  transparent = false,
  editedDuration,
  editedCalories,
  calorieTarget = DEFAULT_CALORIE_TARGET,
  minuteTarget = DEFAULT_MINUTE_TARGET,
}: WorkoutStatsCardProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Calculate values
  const displayDuration = editedDuration !== undefined ? editedDuration : totalDuration;
  const estimatedCalories = editedCalories !== undefined ? editedCalories : Math.round(totalDuration * 8);
  
  // Progress percentages (capped at 100%)
  const calorieProgress = Math.min(estimatedCalories / calorieTarget, 1);
  const minuteProgress = Math.min(displayDuration / minuteTarget, 1);
  
  // Calculate intensity
  const intensityValue = calculateIntensity(workouts, moodCategory, displayDuration);

  // Get dominant mood category
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

  const getMoodPhrase = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    for (const [keyword, phrases] of Object.entries(MOOD_PHRASES)) {
      if (lowerCategory.includes(keyword)) {
        return phrases[Math.floor(Math.random() * phrases.length)];
      }
    }
    return FALLBACK_PHRASES[Math.floor(Math.random() * FALLBACK_PHRASES.length)];
  };

  const extractMoodCardName = (category: string): string => {
    if (!category || category.toLowerCase() === 'workout' || category.toLowerCase() === 'unknown') {
      return "";
    }
    
    if (category.includes(' - ')) {
      return category.split(' - ')[0].trim();
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
    
    return category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const dominantCategory = getDominantMoodCategory();
  const displayMoodCategory = extractMoodCardName(dominantCategory);
  const moodPhrase = useMemo(() => getMoodPhrase(dominantCategory), [dominantCategory]);
  const spacedMoodPhrase = useMemo(() => {
    return moodPhrase.toUpperCase().split(' ').map(word => word.split('').join(' ')).join('   ');
  }, [moodPhrase]);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Ring fill animation
    Animated.timing(ringAnim, {
      toValue: 1,
      duration: 1200,
      delay: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Pulse animation for center
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }, []);

  // Ring rendering
  const renderRings = (isTransparent: boolean = false) => {
    const calorieRing = getStrokeDasharray(calorieProgress, CALORIES_RING_RADIUS);
    const minuteRing = getStrokeDasharray(minuteProgress, MINUTES_RING_RADIUS);
    const intensityRing = getStrokeDasharray(intensityValue, INTENSITY_RING_RADIUS);

    return (
      <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
        {/* Background rings (track) */}
        <G rotation="-90" origin={`${RING_CENTER}, ${RING_CENTER}`}>
          {/* Calories track */}
          <Circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={CALORIES_RING_RADIUS}
            stroke={isTransparent ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
          />
          {/* Minutes track */}
          <Circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={MINUTES_RING_RADIUS}
            stroke={isTransparent ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
          />
          {/* Intensity track */}
          <Circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={INTENSITY_RING_RADIUS}
            stroke={isTransparent ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
          />
          
          {/* Progress rings (counterclockwise from top) */}
          {/* Calories ring - outermost - gold/yellow */}
          <Circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={CALORIES_RING_RADIUS}
            stroke="#FFD700"
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
            strokeDasharray={calorieRing.dashArray}
            strokeDashoffset={calorieRing.dashOffset}
            strokeLinecap="round"
            transform={`scale(-1, 1) translate(-${RING_SIZE}, 0)`}
          />
          {/* Minutes ring - middle - white */}
          <Circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={MINUTES_RING_RADIUS}
            stroke="#FFFFFF"
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
            strokeDasharray={minuteRing.dashArray}
            strokeDashoffset={minuteRing.dashOffset}
            strokeLinecap="round"
            transform={`scale(-1, 1) translate(-${RING_SIZE}, 0)`}
          />
          {/* Intensity ring - innermost - coral/orange */}
          <Circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={INTENSITY_RING_RADIUS}
            stroke="#FF6B6B"
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
            strokeDasharray={intensityRing.dashArray}
            strokeDashoffset={intensityRing.dashOffset}
            strokeLinecap="round"
            transform={`scale(-1, 1) translate(-${RING_SIZE}, 0)`}
          />
        </G>
      </Svg>
    );
  };

  // Transparent version for Instagram Stories export
  if (transparent) {
    return (
      <View style={[styles.transparentContainer, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
        {/* Header */}
        <View style={styles.transparentHeader}>
          <View style={styles.transparentHeaderText}>
            <Text style={styles.transparentLabel}>Ultra-minimal</Text>
            <Text style={styles.transparentMoodCategory} numberOfLines={1}>
              {displayMoodCategory ? displayMoodCategory.toUpperCase() : 'WORKOUT COMPLETE'}
            </Text>
            <Text style={styles.transparentSubtitle} numberOfLines={1}>{spacedMoodPhrase}</Text>
          </View>
        </View>

        {/* Ring Section */}
        <View style={styles.ringSection}>
          {/* Duration text on left */}
          <View style={styles.durationContainer}>
            <Text style={styles.durationValue}>{displayDuration}</Text>
            <Text style={styles.durationLabel}>min</Text>
          </View>
          
          {/* Donut rings */}
          <View style={styles.ringContainer}>
            {renderRings(true)}
            {/* Center content */}
            <View style={styles.ringCenterContent}>
              <Text style={styles.centerCalorieValue}>{estimatedCalories}</Text>
              <Text style={styles.centerCalorieLabel}>calories</Text>
            </View>
          </View>
          
          {/* Intensity label on right */}
          <View style={styles.intensityContainer}>
            <Text style={styles.intensityLabel}>Intensity</Text>
            <Text style={styles.intensityValue}>{Math.round(intensityValue * 100)}%</Text>
          </View>
        </View>

        {/* Exercises List */}
        <View style={styles.transparentExercisesSection}>
          {workouts.slice(0, 4).map((workout, index) => (
            <View key={index} style={styles.transparentExerciseRow}>
              <View style={styles.transparentExerciseDot} />
              <Text style={styles.transparentExerciseText} numberOfLines={1}>
                {workout.workoutTitle || workout.workoutName}
              </Text>
            </View>
          ))}
          {workouts.length > 4 && (
            <Text style={styles.transparentMoreExercises}>+{workouts.length - 4} more</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.transparentFooter}>
          <Text style={styles.transparentBrandText}>MOOD</Text>
        </View>
      </View>
    );
  }

  // Standard card version
  return (
    <Animated.View style={[styles.container, { width: CARD_WIDTH, height: CARD_HEIGHT, opacity: fadeAnim }]}>
      <View style={styles.innerContainer}>
        {/* Subtle gradient */}
        <LinearGradient
          colors={['rgba(255, 215, 0, 0.06)', 'rgba(255, 215, 0, 0.02)', 'transparent']}
          style={styles.radialGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.labelText}>Ultra-minimal</Text>
            <Text style={styles.moodCategory} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              {displayMoodCategory ? displayMoodCategory.toUpperCase() : 'WORKOUT COMPLETE'}
            </Text>
            <Text style={styles.subtitle}>{spacedMoodPhrase}</Text>
          </View>
        </View>

        {/* Ring Section with duration and intensity */}
        <View style={styles.ringSection}>
          {/* Duration on left */}
          <View style={styles.durationContainer}>
            <Text style={styles.durationValue}>{displayDuration}</Text>
            <Text style={styles.durationLabel}>min</Text>
          </View>
          
          {/* Donut rings */}
          <Animated.View style={[styles.ringContainer, { transform: [{ scale: pulseAnim }] }]}>
            {renderRings(false)}
            {/* Center content */}
            <View style={styles.ringCenterContent}>
              <Text style={styles.centerCalorieValue}>{estimatedCalories}</Text>
              <Text style={styles.centerCalorieLabel}>calories</Text>
            </View>
          </Animated.View>
          
          {/* Intensity on right */}
          <View style={styles.intensityContainer}>
            <Text style={styles.intensityLabel}>Intensity</Text>
            <Text style={styles.intensityValue}>{Math.round(intensityValue * 100)}%</Text>
          </View>
        </View>

        {/* Ring legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFD700' }]} />
            <Text style={styles.legendText}>Cal</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFFFFF' }]} />
            <Text style={styles.legendText}>Min</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.legendText}>Intensity</Text>
          </View>
        </View>

        {/* Exercises List */}
        <View style={styles.exercisesSection}>
          {workouts.slice(0, 4).map((workout, index) => (
            <View key={index} style={styles.exerciseRow}>
              <View style={styles.exerciseDot} />
              <Text style={styles.exerciseText} numberOfLines={1}>
                {workout.workoutTitle || workout.workoutName}
              </Text>
            </View>
          ))}
          {workouts.length > 4 && (
            <Text style={styles.moreExercises}>+{workouts.length - 4} more</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.brandText}>MOOD</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderRadius: 20,
    overflow: 'hidden',
  },
  radialGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  headerText: {
    alignItems: 'flex-start',
  },
  labelText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  moodCategory: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
    marginTop: 6,
    fontWeight: '400',
  },
  
  // Ring Section
  ringSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  durationContainer: {
    alignItems: 'center',
    width: 50,
  },
  durationValue: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  durationLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCalorieValue: {
    fontSize: 26,
    fontWeight: '300',
    color: '#FFD700',
    letterSpacing: -1,
  },
  centerCalorieLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  intensityContainer: {
    alignItems: 'center',
    width: 50,
  },
  intensityLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  intensityValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FF6B6B',
  },
  
  // Legend
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  
  // Exercises
  exercisesSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  exerciseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.5)',
    marginRight: 10,
  },
  exerciseText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  moreExercises: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  brandText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '600',
    letterSpacing: 2,
  },

  // ===============================================
  // TRANSPARENT VERSION STYLES
  // ===============================================
  transparentContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  transparentHeader: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  transparentHeaderText: {
    alignItems: 'flex-start',
  },
  transparentLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  transparentMoodCategory: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadow: '0px 2px 6px rgba(0, 0, 0, 0.8)',
  },
  transparentSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
    marginTop: 6,
    textShadow: '0px 1px 4px rgba(0, 0, 0, 0.8)',
  },
  transparentExercisesSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  transparentExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  transparentExerciseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFD700',
    marginRight: 10,
  },
  transparentExerciseText: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '400',
    textShadow: '0px 1px 3px rgba(0, 0, 0, 0.8)',
  },
  transparentMoreExercises: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  transparentFooter: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  transparentBrandText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '700',
    letterSpacing: 3,
    textShadow: '0px 1px 4px rgba(0, 0, 0, 0.8)',
  },
});
