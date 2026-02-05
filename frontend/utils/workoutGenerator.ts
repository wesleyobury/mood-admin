import { WorkoutItem } from '../contexts/CartContext';
import { lightWeightsDatabase } from '../data/light-weights-data';
import { cardioWorkoutsDatabase } from '../data/cardio-workouts-data';
import { bodyweightExplosivenessDatabase } from '../data/bodyweight-explosiveness-data';
import { explosivenessWeightsDatabase } from '../data/explosiveness-weights-data';
import { lazyBodyweightDatabase } from '../data/lazy-bodyweight-data';
import { lazyUpperBodyDatabase } from '../data/lazy-upper-body-data';
import { lazyLowerBodyDatabase } from '../data/lazy-lower-body-data';
import { lazyFullBodyDatabase } from '../data/lazy-full-body-data';
import { additionalWorkoutDatabase as calisthenicsDatabase } from '../data/calisthenics-all-workouts-data';
import { outdoorRunWorkoutDatabase } from '../data/outdoor-workouts-data';
// Muscle gainer data imports
import { chestWorkoutDatabase } from '../data/chest-workouts-data';
import { backWorkoutDatabase } from '../data/back-workouts-data';
import { shouldersWorkoutDatabase } from '../data/shoulders-workouts-data';
import { bicepsWorkoutDatabase } from '../data/biceps-workouts-data';
import { tricepsWorkoutDatabase } from '../data/triceps-workouts-data';
import { absWorkoutDatabase } from '../data/abs-workouts-data';
import { quadsWorkoutDatabase } from '../data/quads-workouts-data';
import { hamstringsWorkoutDatabase } from '../data/hamstrings-workouts-data';
import { glutesWorkoutDatabase } from '../data/glutes-workouts-data';
import { calvesWorkoutDatabase } from '../data/calves-workouts-data';
import { Workout, EquipmentWorkouts } from '../types/workout';
import { IntensityLevel } from '../components/IntensitySelectionModal';
import { GeneratedCart } from '../components/GeneratedWorkoutView';

// Time limits based on intensity (in minutes)
const TIME_LIMITS: Record<IntensityLevel, { min: number; max: number }> = {
  beginner: { min: 25, max: 40 },
  intermediate: { min: 40, max: 60 },
  advanced: { min: 55, max: 80 },
};

// Exercise count per cart based on intensity
const EXERCISE_COUNTS: Record<IntensityLevel, { min: number; max: number }> = {
  beginner: { min: 2, max: 3 },
  intermediate: { min: 3, max: 4 },
  advanced: { min: 3, max: 4 },
};

// Parse duration string to get average minutes
function parseDuration(durationStr: string): number {
  // Handle formats like "15–18 min", "20 min", "~30 min"
  const cleaned = durationStr.replace(/[~]/g, '').replace('min', '').trim();
  
  if (cleaned.includes('–') || cleaned.includes('-')) {
    const parts = cleaned.split(/[–-]/);
    const low = parseInt(parts[0].trim()) || 0;
    const high = parseInt(parts[1].trim()) || low;
    return Math.round((low + high) / 2);
  }
  
  return parseInt(cleaned) || 15;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate unique ID for workout item
function generateWorkoutId(workout: Workout, equipment: string, intensity: string): string {
  return `generated-${workout.name}-${equipment}-${intensity}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Convert Workout to WorkoutItem
function workoutToItem(
  workout: Workout,
  equipment: string,
  intensity: IntensityLevel,
  moodCard: string,
  workoutType: string
): WorkoutItem {
  return {
    id: generateWorkoutId(workout, equipment, intensity),
    name: workout.name,
    duration: workout.duration,
    description: workout.description,
    battlePlan: workout.battlePlan,
    imageUrl: workout.imageUrl,
    intensityReason: workout.intensityReason,
    equipment: equipment,
    difficulty: intensity,
    workoutType: workoutType,
    moodCard: moodCard,
    moodTips: workout.moodTips.map(tip => ({
      icon: tip.icon as string,
      title: tip.title,
      description: tip.description,
    })),
  };
}

// Get all workouts from a database for a specific intensity
function getAllWorkoutsForIntensity(
  database: EquipmentWorkouts[],
  intensity: IntensityLevel
): { workout: Workout; equipment: string }[] {
  const allWorkouts: { workout: Workout; equipment: string }[] = [];
  
  for (const equipmentData of database) {
    const workouts = equipmentData.workouts[intensity] || [];
    for (const workout of workouts) {
      allWorkouts.push({
        workout,
        equipment: equipmentData.equipment,
      });
    }
  }
  
  return allWorkouts;
}

// Select complementary workouts for a cart
function selectComplementaryWorkouts(
  availableWorkouts: { workout: Workout; equipment: string }[],
  exerciseCount: number,
  maxDuration: number,
  usedWorkoutNames: Set<string>
): { workout: Workout; equipment: string }[] {
  const selected: { workout: Workout; equipment: string }[] = [];
  const usedEquipment = new Set<string>();
  let totalDuration = 0;
  
  // Shuffle to get randomness
  const shuffled = shuffleArray(availableWorkouts);
  
  for (const item of shuffled) {
    // Skip if already used this workout name
    if (usedWorkoutNames.has(item.workout.name)) {
      continue;
    }
    
    const duration = parseDuration(item.workout.duration);
    
    // Check if adding this workout would exceed time limit
    if (totalDuration + duration > maxDuration) {
      continue;
    }
    
    // Try to vary equipment for variety (but allow same if needed)
    const equipmentAlreadyUsed = usedEquipment.has(item.equipment);
    const shouldPreferVariety = selected.length > 0 && selected.length < exerciseCount - 1;
    
    if (shouldPreferVariety && equipmentAlreadyUsed && Math.random() > 0.3) {
      continue; // 70% chance to skip same equipment for variety
    }
    
    selected.push(item);
    usedEquipment.add(item.equipment);
    usedWorkoutNames.add(item.workout.name);
    totalDuration += duration;
    
    if (selected.length >= exerciseCount) {
      break;
    }
  }
  
  return selected;
}

// Main function to generate workout carts
export function generateWorkoutCarts(
  intensity: IntensityLevel,
  moodCard: string,
  workoutType: string,
  database: EquipmentWorkouts[] = lightWeightsDatabase,
  cartCount: number = 3
): GeneratedCart[] {
  const timeLimit = TIME_LIMITS[intensity];
  const exerciseRange = EXERCISE_COUNTS[intensity];
  
  // Get all available workouts for this intensity
  const allWorkouts = getAllWorkoutsForIntensity(database, intensity);
  
  if (allWorkouts.length === 0) {
    console.warn('No workouts found for intensity:', intensity);
    return [];
  }
  
  const carts: GeneratedCart[] = [];
  const usedWorkoutNames = new Set<string>();
  
  for (let i = 0; i < cartCount; i++) {
    // Randomize exercise count within range
    const exerciseCount = Math.floor(
      Math.random() * (exerciseRange.max - exerciseRange.min + 1)
    ) + exerciseRange.min;
    
    // Select complementary workouts
    const selectedWorkouts = selectComplementaryWorkouts(
      allWorkouts,
      exerciseCount,
      timeLimit.max,
      usedWorkoutNames
    );
    
    if (selectedWorkouts.length === 0) {
      // If no unique workouts left, reset and allow reuse
      usedWorkoutNames.clear();
      continue;
    }
    
    // Convert to WorkoutItems
    const workoutItems = selectedWorkouts.map(item =>
      workoutToItem(item.workout, item.equipment, intensity, moodCard, workoutType)
    );
    
    // Calculate total duration
    const totalDuration = workoutItems.reduce(
      (sum, item) => sum + parseDuration(item.duration),
      0
    );
    
    carts.push({
      id: `cart-${i + 1}-${Date.now()}`,
      workouts: workoutItems,
      totalDuration,
      intensity,
    });
  }
  
  return carts;
}

// Export for specific mood paths
export function generateLightWeightsCarts(
  intensity: IntensityLevel,
  moodCard: string = 'Sweat / burn fat',
  workoutType: string = 'Light Weights'
): GeneratedCart[] {
  return generateWorkoutCarts(intensity, moodCard, workoutType, lightWeightsDatabase);
}

// Export for cardio path
export function generateCardioCarts(
  intensity: IntensityLevel,
  moodCard: string = 'Sweat / burn fat',
  workoutType: string = 'Cardio Based'
): GeneratedCart[] {
  return generateWorkoutCarts(intensity, moodCard, workoutType, cardioWorkoutsDatabase);
}

// Export for combined Sweat/burn fat path (cardio + light weights)
export function generateSweatBurnFatCarts(
  intensity: IntensityLevel,
  moodCard: string = 'Sweat / burn fat',
  workoutType: string = 'Mixed'
): GeneratedCart[] {
  // Combine both cardio and light weights databases
  const combinedDatabase = [...cardioWorkoutsDatabase, ...lightWeightsDatabase];
  return generateWorkoutCarts(intensity, moodCard, workoutType, combinedDatabase);
}

// Export for Build Explosion path (bodyweight + weights)
export function generateExplosivenessCarts(
  intensity: IntensityLevel,
  moodCard: string = 'I want to build explosion',
  workoutType: string = 'Mixed Explosive'
): GeneratedCart[] {
  // Combine both bodyweight and weight-based explosiveness databases
  const combinedDatabase = [...bodyweightExplosivenessDatabase, ...explosivenessWeightsDatabase];
  return generateWorkoutCarts(intensity, moodCard, workoutType, combinedDatabase);
}

// Export for I'm Feeling Lazy path (all lazy workouts combined)
export function generateLazyCarts(
  intensity: IntensityLevel,
  moodCard: string = "I'm feeling lazy",
  workoutType: string = 'Mixed Lazy'
): GeneratedCart[] {
  // Combine all lazy databases
  const combinedDatabase = [
    ...lazyBodyweightDatabase,
    ...lazyUpperBodyDatabase,
    ...lazyLowerBodyDatabase,
    ...lazyFullBodyDatabase
  ];
  return generateWorkoutCarts(intensity, moodCard, workoutType, combinedDatabase);
}

// Export for Calisthenics path
export function generateCalisthenicsCarts(
  intensity: IntensityLevel,
  moodCard: string = 'I want to do calisthenics',
  workoutType: string = 'Calisthenics'
): GeneratedCart[] {
  return generateWorkoutCarts(intensity, moodCard, workoutType, calisthenicsDatabase);
}

// Export for Outdoor/Get Outside path
export function generateOutdoorCarts(
  intensity: IntensityLevel,
  moodCard: string = 'Get outside',
  workoutType: string = 'Outdoor'
): GeneratedCart[] {
  return generateWorkoutCarts(intensity, moodCard, workoutType, outdoorRunWorkoutDatabase);
}

// Mapping of muscle group names to their databases
const muscleGroupDatabases: Record<string, EquipmentWorkouts[]> = {
  'Chest': chestWorkoutDatabase,
  'Back': backWorkoutDatabase,
  'Shoulders': shouldersWorkoutDatabase,
  'Biceps': bicepsWorkoutDatabase,
  'Triceps': tricepsWorkoutDatabase,
  'Abs': absWorkoutDatabase,
  'Quads': quadsWorkoutDatabase,
  'Hamstrings': hamstringsWorkoutDatabase,
  'Glutes': glutesWorkoutDatabase,
  'Calves': calvesWorkoutDatabase,
  'Legs': [...quadsWorkoutDatabase, ...hamstringsWorkoutDatabase, ...glutesWorkoutDatabase, ...calvesWorkoutDatabase],
};

// Define primary vs ancillary muscle groups for ordering
const PRIMARY_MUSCLE_GROUPS = ['Legs', 'Chest', 'Back', 'Shoulders', 'Quads', 'Hamstrings', 'Glutes', 'Calves'];
const ANCILLARY_MUSCLE_GROUPS = ['Biceps', 'Triceps', 'Abs']; // Abs should always be last

// Minimum exercise counts for primary muscle groups (intermediate/advanced)
const MIN_EXERCISES_PRIMARY: Record<string, number> = {
  'Legs': 4,
  'Quads': 3,
  'Hamstrings': 3,
  'Glutes': 3,
  'Calves': 2,
  'Chest': 3,
  'Back': 3,
  'Shoulders': 3,
};

// Compound exercises for legs (must include at least 1 for legs)
const LEG_COMPOUND_EXERCISES = [
  'Barbell Back Squat',
  'Front Squat',
  'Leg Press',
  'Romanian Deadlift',
  'Deadlift',
  'Bulgarian Split Squat',
  'Lunges',
  'Goblet Squat',
  'Hack Squat',
  'Sumo Deadlift',
  'Barbell Hack Squat',
  'Dumbbell Lunges',
  'Walking Lunges',
  'Smith Machine Squat',
  'Trap Bar Deadlift',
  'Barbell Squat',
  'Dumbbell Squat',
  'Split Squat',
  'Step Up',
  'Zercher Squat',
];

// Leg sub-groups for isolation exercises
const LEG_ISOLATION_GROUPS = ['Quads', 'Hamstrings', 'Glutes', 'Calves'];

// Check if a workout is a compound leg exercise
function isCompoundLegExercise(workoutName: string): boolean {
  return LEG_COMPOUND_EXERCISES.some(compound => 
    workoutName.toLowerCase().includes(compound.toLowerCase()) ||
    compound.toLowerCase().includes(workoutName.toLowerCase())
  );
}

// Get workouts from database with muscle group tagging
function getWorkoutsForMuscleGroup(
  muscleGroup: string,
  intensity: IntensityLevel
): { workout: Workout; equipment: string; muscleGroup: string }[] {
  const database = muscleGroupDatabases[muscleGroup];
  if (!database) return [];
  
  const workouts: { workout: Workout; equipment: string; muscleGroup: string }[] = [];
  
  for (const equipmentData of database) {
    const intensityWorkouts = equipmentData.workouts[intensity] || [];
    for (const workout of intensityWorkouts) {
      workouts.push({
        workout,
        equipment: equipmentData.equipment,
        muscleGroup: muscleGroup,
      });
    }
  }
  
  return workouts;
}

// Special function to select leg workouts with compound-first rule
function selectLegWorkouts(
  intensity: IntensityLevel,
  usedWorkoutNames: Set<string>
): { workout: Workout; equipment: string; muscleGroup: string }[] {
  const isBeginner = intensity === 'beginner';
  
  // Get compound count and isolation count based on intensity
  const compoundCount = 2;
  const isolationCount = isBeginner ? 1 : 2; // Beginner: 2+1=3, Int/Adv: 2+2=4
  
  const selected: { workout: Workout; equipment: string; muscleGroup: string }[] = [];
  
  // Step 1: Get all leg workouts from all sub-groups
  const allLegWorkouts: { workout: Workout; equipment: string; muscleGroup: string }[] = [];
  for (const subGroup of LEG_ISOLATION_GROUPS) {
    const subGroupWorkouts = getWorkoutsForMuscleGroup(subGroup, intensity);
    allLegWorkouts.push(...subGroupWorkouts);
  }
  
  // Shuffle for variety
  const shuffledWorkouts = shuffleArray(allLegWorkouts);
  
  // Step 2: Select compound exercises first
  const compoundWorkouts = shuffledWorkouts.filter(w => 
    isCompoundLegExercise(w.workout.name) && !usedWorkoutNames.has(w.workout.name)
  );
  
  for (const compound of compoundWorkouts) {
    if (selected.length >= compoundCount) break;
    selected.push(compound);
    usedWorkoutNames.add(compound.workout.name);
  }
  
  // Step 3: Select isolation exercises from different sub-groups (no duplicates from same group)
  const usedSubGroups = new Set<string>();
  const isolationWorkouts = shuffledWorkouts.filter(w => 
    !isCompoundLegExercise(w.workout.name) && !usedWorkoutNames.has(w.workout.name)
  );
  
  for (const isolation of isolationWorkouts) {
    if (selected.length >= compoundCount + isolationCount) break;
    
    // Don't pick two exercises from the same sub-group
    if (usedSubGroups.has(isolation.muscleGroup)) continue;
    
    selected.push(isolation);
    usedWorkoutNames.add(isolation.workout.name);
    usedSubGroups.add(isolation.muscleGroup);
  }
  
  // If we still need more isolation exercises (unlikely but handle edge case)
  // Allow same sub-group but different exercises
  if (selected.length < compoundCount + isolationCount) {
    for (const isolation of isolationWorkouts) {
      if (selected.length >= compoundCount + isolationCount) break;
      if (usedWorkoutNames.has(isolation.workout.name)) continue;
      
      selected.push(isolation);
      usedWorkoutNames.add(isolation.workout.name);
    }
  }
  
  // Tag all selected as "Legs" for proper grouping
  return selected.map(w => ({
    ...w,
    muscleGroup: 'Legs'
  }));
}

// Select workouts for a specific muscle group with minimum count requirements
function selectWorkoutsForMuscleGroup(
  muscleGroup: string,
  intensity: IntensityLevel,
  minCount: number,
  maxCount: number,
  usedWorkoutNames: Set<string>,
  requireCompound: boolean = false
): { workout: Workout; equipment: string; muscleGroup: string }[] {
  const availableWorkouts = getWorkoutsForMuscleGroup(muscleGroup, intensity);
  const selected: { workout: Workout; equipment: string; muscleGroup: string }[] = [];
  
  // Shuffle for randomness
  const shuffled = shuffleArray(availableWorkouts);
  
  // If we need a compound exercise for legs, find one first
  if (requireCompound) {
    const compoundWorkout = shuffled.find(
      w => LEG_COMPOUND_EXERCISES.some(name => 
        w.workout.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(w.workout.name.toLowerCase())
      ) && !usedWorkoutNames.has(w.workout.name)
    );
    if (compoundWorkout) {
      selected.push(compoundWorkout);
      usedWorkoutNames.add(compoundWorkout.workout.name);
    }
  }
  
  // Fill remaining slots
  for (const item of shuffled) {
    if (usedWorkoutNames.has(item.workout.name)) continue;
    if (selected.length >= maxCount) break;
    
    selected.push(item);
    usedWorkoutNames.add(item.workout.name);
  }
  
  // Ensure minimum count (allow reuse if necessary)
  if (selected.length < minCount) {
    for (const item of shuffled) {
      if (selected.length >= minCount) break;
      if (!selected.some(s => s.workout.name === item.workout.name)) {
        selected.push(item);
      }
    }
  }
  
  return selected;
}

// Export for Muscle Gainer path (uses selected muscle groups only)
export function generateMuscleGainerCarts(
  intensity: IntensityLevel,
  selectedMuscleGroups: string[] = [],
  moodCard: string = 'I want to gain muscle',
  workoutType: string = 'Muscle Building'
): GeneratedCart[] {
  // If no muscle groups selected, return empty
  if (selectedMuscleGroups.length === 0) {
    return [];
  }

  const carts: GeneratedCart[] = [];
  const isBeginner = intensity === 'beginner';
  
  // Generate 3 cart options
  for (let cartIndex = 0; cartIndex < 3; cartIndex++) {
    const usedWorkoutNames = new Set<string>();
    const allWorkouts: { workout: Workout; equipment: string; muscleGroup: string }[] = [];
    
    // Separate muscle groups into primary and ancillary
    const primaryGroups = selectedMuscleGroups.filter(g => PRIMARY_MUSCLE_GROUPS.includes(g));
    const ancillaryGroups = selectedMuscleGroups.filter(g => ANCILLARY_MUSCLE_GROUPS.includes(g));
    
    // Sort ancillary groups to ensure Abs is last
    ancillaryGroups.sort((a, b) => {
      if (a === 'Abs') return 1;
      if (b === 'Abs') return -1;
      return 0;
    });
    
    // Process primary muscle groups first
    for (const muscleGroup of primaryGroups) {
      // Special handling for "Legs" - use dedicated function
      if (muscleGroup === 'Legs') {
        const legWorkouts = selectLegWorkouts(intensity, usedWorkoutNames);
        allWorkouts.push(...legWorkouts);
        continue;
      }
      
      // Determine exercise count for this muscle group
      let minCount = isBeginner ? 2 : (MIN_EXERCISES_PRIMARY[muscleGroup] || 3);
      let maxCount = isBeginner ? 3 : minCount + 1;
      
      // Check if this is a leg-related sub-group that needs a compound
      const isLegSubGroup = ['Quads', 'Hamstrings', 'Glutes'].includes(muscleGroup);
      const requireCompound = !isBeginner && isLegSubGroup;
      
      const groupWorkouts = selectWorkoutsForMuscleGroup(
        muscleGroup,
        intensity,
        minCount,
        maxCount,
        usedWorkoutNames,
        requireCompound
      );
      
      allWorkouts.push(...groupWorkouts);
    }
    
    // Process ancillary muscle groups (always at the end, abs last)
    for (const muscleGroup of ancillaryGroups) {
      // Ancillary groups should always have at least 2 exercises
      const minCount = 2;
      const maxCount = isBeginner ? 2 : 3;
      
      const groupWorkouts = selectWorkoutsForMuscleGroup(
        muscleGroup,
        intensity,
        minCount,
        maxCount,
        usedWorkoutNames,
        false
      );
      
      allWorkouts.push(...groupWorkouts);
    }
    
    // Now sort the workouts to group by muscle group consecutively
    // Primary groups first (in order selected), then ancillary (with abs last)
    const sortedWorkouts = sortWorkoutsByMuscleGroup(allWorkouts, [...primaryGroups, ...ancillaryGroups]);
    
    // Convert to WorkoutItems
    const workoutItems = sortedWorkouts.map(item =>
      workoutToItem(item.workout, item.equipment, intensity, moodCard, `${workoutType} - ${item.muscleGroup}`)
    );
    
    // Calculate total duration
    const totalDuration = workoutItems.reduce(
      (sum, item) => sum + parseDuration(item.duration),
      0
    );
    
    if (workoutItems.length > 0) {
      carts.push({
        id: `cart-${cartIndex + 1}-${Date.now()}`,
        workouts: workoutItems,
        totalDuration,
        intensity,
      });
    }
  }
  
  return carts;
}

// Sort workouts to group by muscle group consecutively
function sortWorkoutsByMuscleGroup(
  workouts: { workout: Workout; equipment: string; muscleGroup: string }[],
  muscleGroupOrder: string[]
): { workout: Workout; equipment: string; muscleGroup: string }[] {
  // Create a map to track the order position of each muscle group
  const orderMap = new Map<string, number>();
  muscleGroupOrder.forEach((group, index) => {
    orderMap.set(group, index);
  });
  
  // Sort workouts by their muscle group's position in the order
  return [...workouts].sort((a, b) => {
    const orderA = orderMap.get(a.muscleGroup) ?? 999;
    const orderB = orderMap.get(b.muscleGroup) ?? 999;
    return orderA - orderB;
  });
}
