/**
 * ATTACHED WORKOUT - Canonical types and cart builder for "Try This Workout"
 * 
 * This is the ONLY source of truth for workout replication.
 * No fallbacks, no partial data, no generic placeholders.
 */

import { WorkoutItem } from '../contexts/CartContext';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AttachedWorkoutExercise {
  exerciseId: string;
  name: string;
  imageUrl: string;  // REQUIRED - no fallbacks
  duration: string;
  equipment: string;
  difficulty: string;
  description?: string;
  battlePlan: string;  // REQUIRED - workout guidance
  intensityReason?: string;
  moodTips?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface AttachedWorkout {
  version: number;
  title: string;
  totalDuration: number;
  moodCategory: string;
  completedAt: string;
  exercises: AttachedWorkoutExercise[];
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate that an attached_workout has all required fields.
 * This is a strict validation - if ANY required field is missing, the workout is unavailable.
 */
export function validateAttachedWorkout(workout: AttachedWorkout | null | undefined): ValidationResult {
  if (!workout) {
    return { isValid: false, error: 'No workout data available' };
  }

  if (!workout.title) {
    return { isValid: false, error: 'Workout title is missing' };
  }

  if (!workout.moodCategory) {
    return { isValid: false, error: 'Workout category is missing' };
  }

  if (!workout.exercises || workout.exercises.length === 0) {
    return { isValid: false, error: 'Workout has no exercises' };
  }

  // Validate each exercise
  for (let i = 0; i < workout.exercises.length; i++) {
    const ex = workout.exercises[i];
    
    if (!ex.exerciseId) {
      return { isValid: false, error: `Exercise ${i + 1} is missing an ID` };
    }
    
    if (!ex.name) {
      return { isValid: false, error: `Exercise ${i + 1} is missing a name` };
    }
    
    if (!ex.imageUrl) {
      return { isValid: false, error: `Exercise ${i + 1} is missing an image` };
    }
    
    if (!ex.battlePlan) {
      return { isValid: false, error: `Exercise ${i + 1} is missing workout guidance` };
    }
  }

  return { isValid: true };
}

// ============================================================================
// CART BUILDER - THE ONLY ENTRY POINT FOR "TRY THIS WORKOUT"
// ============================================================================

/**
 * Build cart items from an attached_workout.
 * This is the ONE AND ONLY function that should be used to populate the cart
 * from a "Try This Workout" action.
 * 
 * NO FALLBACKS - if the workout is invalid, return empty array.
 */
export function buildCartFromAttachedWorkout(workout: AttachedWorkout): WorkoutItem[] {
  const validation = validateAttachedWorkout(workout);
  
  if (!validation.isValid) {
    console.error('❌ buildCartFromAttachedWorkout: Validation failed -', validation.error);
    return [];
  }

  const cartItems: WorkoutItem[] = workout.exercises.map((exercise, index) => ({
    // Core identification
    id: `attached-${exercise.exerciseId}-${Date.now()}-${index}`,
    
    // Display fields
    name: exercise.name,
    imageUrl: exercise.imageUrl,
    duration: exercise.duration,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    
    // Content fields
    description: exercise.description || exercise.battlePlan,
    battlePlan: exercise.battlePlan,
    intensityReason: exercise.intensityReason || `${exercise.difficulty} intensity workout`,
    
    // Category fields
    workoutType: workout.moodCategory,
    moodCard: workout.moodCategory,
    
    // Tips
    moodTips: exercise.moodTips || [],
    
    // Source tracking
    source: 'build_for_me' as const,
  }));

  console.log(`✅ buildCartFromAttachedWorkout: Built ${cartItems.length} cart items`);
  return cartItems;
}
