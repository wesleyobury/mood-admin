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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Data Types
interface Workout {
  id: string;
  name: string;
  duration: string;
  imageUrl: string;
  description: string;
  intensityReason: string;
  battlePlan: string;
  moodTips: string[];
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

const bicepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: "Adjustable bench",
    icon: "trending-up-outline",
    workouts: {
      beginner: [
        {
          id: "bicep_bench_1",
          name: "Hammer Curls on Bench",
          duration: "15 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBIxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Sitting on an incline bench, perform controlled hammer curls to target the biceps and forearms.",
          intensityReason: "Perfect for beginners to learn proper form and control.",
          battlePlan: "3 sets of 8-10 reps with moderate weight, focus on slow controlled movement.",
          moodTips: ["Start with lighter weights to master the form", "Keep your back against the bench for stability"]
        },
        {
          id: "bicep_bench_2",
          name: "Incline Dumbbell Curls",
          duration: "12 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBIxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Perform curls on an inclined bench to stretch the biceps and increase range of motion.",
          intensityReason: "Incline position provides better bicep stretch and activation.",
          battlePlan: "3 sets of 10-12 reps, focus on the stretch at the bottom of the movement.",
          moodTips: ["Feel the stretch at the bottom", "Don't let the weights swing"]
        }
      ],
      intermediate: [
        {
          id: "bicep_bench_int_1",
          name: "Concentration Curls",
          duration: "18 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBIxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Seated on bench, perform single-arm curls with elbow braced against inner thigh for isolation.",
          intensityReason: "Isolation movement with focused mind-muscle connection.",
          battlePlan: "4 sets of 8-10 reps per arm, squeeze at the top for 2 seconds.",
          moodTips: ["Focus on one arm at a time", "Really squeeze at the top"]
        }
      ],
      advanced: [
        {
          id: "bicep_bench_adv_1",
          name: "21s Bicep Protocol",
          duration: "20 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBIxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Advanced bicep protocol: 7 partial reps bottom half, 7 partial reps top half, 7 full reps.",
          intensityReason: "High-intensity protocol for maximum muscle stimulation and growth.",
          battlePlan: "3 sets of 21 total reps (7+7+7), minimal rest between phases.",
          moodTips: ["This will burn - embrace it", "Push through the challenge"]
        }
      ]
    }
  },
  {
    equipment: "Barbell",
    icon: "remove",
    workouts: {
      beginner: [
        {
          id: "bicep_barbell_1",
          name: "Standing Barbell Curls",
          duration: "15 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBIxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Classic bicep exercise using a straight barbell with proper standing form.",
          intensityReason: "Foundational movement that builds overall bicep strength and size.",
          battlePlan: "3 sets of 8-10 reps, focus on controlled movement and no swinging.",
          moodTips: ["Keep your core tight", "Don't use momentum"]
        }
      ],
      intermediate: [
        {
          id: "bicep_barbell_int_1",
          name: "Preacher Barbell Curls",
          duration: "18 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBIxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Using an incline bench as a preacher pad to isolate biceps with strict form.",
          intensityReason: "Preacher position eliminates momentum and isolates the biceps effectively.",
          battlePlan: "4 sets of 6-8 reps with heavier weight, focus on the negative.",
          moodTips: ["Control the negative", "Feel the burn in isolation"]
        }
      ],
      advanced: [
        {
          id: "bicep_barbell_adv_1",
          name: "Drag Curls",
          duration: "20 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBIxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Advanced technique where the barbell is dragged up the body targeting the long head of biceps.",
          intensityReason: "Unique movement pattern that maximally targets the bicep's long head.",
          battlePlan: "4 sets of 8-10 reps, keep elbows behind body throughout movement.",
          moodTips: ["Keep elbows back", "Feel it in the bicep peak"]
        }
      ]
    }
  },
  {
    equipment: "Dumbbells",
    icon: "fitness",
    workouts: {
      beginner: [
        {
          id: "bicep_db_1",
          name: "Alternating Dumbbell Curls",
          duration: "15 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBIxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Fundamental dumbbell exercise alternating arms to build bicep strength and coordination.",
          intensityReason: "Perfect starting movement for learning proper bicep activation and control.",
          battlePlan: "3 sets of 10-12 reps per arm, maintain strict form throughout.",
          moodTips: ["One arm at a time", "Focus on the working muscle"]
        }
      ],
      intermediate: [
        {
          id: "bicep_db_int_1",
          name: "Hammer Curls",
          duration: "18 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBIxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Neutral grip dumbbell curls that target both biceps and forearms effectively.",
          intensityReason: "Neutral grip allows for heavier weight and targets multiple muscle groups.",
          battlePlan: "4 sets of 8-10 reps, focus on controlled tempo and squeeze.",
          moodTips: ["Keep wrists straight", "Feel it in biceps and forearms"]
        }
      ],
      advanced: [
        {
          id: "bicep_db_adv_1",
          name: "Zottman Curls",
          duration: "22 min",
          imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABQACBAYHAwj/xAAuEAACAQMDAgUDAwUAAAAAAAABAgMABBEFEiExQVEGEyJhcYGRoRQy0eHB8P/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHxEAAgICAgMBAAAAAAAAAAAAAAECEQMhBBSxQVFh/9oADAMBAAIRAxEAPwDuFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF//Z",
          description: "Advanced technique: curl up with supinated grip, rotate to pronated at top, lower slowly.",
          intensityReason: "Complex movement targeting biceps concentrically and forearms eccentrically.",
          battlePlan: "4 sets of 6-8 reps, emphasize the rotation and slow negative.",
          moodTips: ["Slow and controlled", "Focus on the rotation"]
        }
      ]
    }
  }
];

interface WorkoutCardProps {
  equipment: string;
  icon: keyof typeof Ionicons.glyphMap;
  workouts: Workout[];
  difficulty: string;
  difficultyColor: string;
  onStartWorkout: (workout: Workout, equipment: string, difficulty: string) => void;
}

const WorkoutCard = ({ equipment, icon, workouts, difficulty, difficultyColor, onStartWorkout }: WorkoutCardProps) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderWorkout = ({ item, index }: { item: Workout; index: number }) => (
    <View style={[styles.workoutSlide, { width: width - 48 }]}>
      {/* Workout Image with Rounded Edges */}
      <View style={styles.workoutImageContainer}>
        <Image 
          source={{ uri: item.imageUrl }}
          style={styles.workoutImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
        <View style={styles.swipeIndicator}>
          <Ionicons name="swap-horizontal" size={20} color="#FFD700" />
          <Text style={styles.swipeText}>Swipe for more</Text>
        </View>
      </View>

      {/* Workout Content */}
      <View style={styles.workoutContent}>
        {/* Workout Title */}
        <Text style={styles.workoutName}>{item.name}</Text>
        
        {/* Duration & Intensity Level on Same Line */}
        <View style={styles.durationIntensityRow}>
          <Text style={styles.workoutDuration}>{item.duration}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: '#FFD700' }]}>
            <Text style={styles.difficultyBadgeText}>{difficulty.toUpperCase()}</Text>
          </View>
        </View>

        {/* Intensity Reason - Same Width as Photo */}
        <View style={styles.intensityContainer}>
          <Ionicons name="information-circle" size={16} color="#FFD700" />
          <Text style={styles.intensityReason}>{item.intensityReason}</Text>
        </View>

        {/* Workout Description - Same Width as Photo */}
        <View style={styles.workoutDescriptionContainer}>
          <Text style={styles.workoutDescription}>{item.description}</Text>
        </View>

        {/* Start Workout Button - Same Width as Photo */}
        <TouchableOpacity 
          style={styles.startWorkoutButton}
          onPress={() => onStartWorkout(item, equipment, difficulty)}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={20} color="#000000" />
          <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Simple touch-based swipe detection for reliable web compatibility
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(null);
    setTouchStart(e.nativeEvent.touches[0].clientX);
  };

  const onTouchMove = (e: any) => {
    setTouchEnd(e.nativeEvent.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentWorkoutIndex < workouts.length - 1) {
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
    }
    if (isRightSwipe && currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(currentWorkoutIndex - 1);
    }
  };

  return (
    <View style={styles.workoutCard}>
      {/* Equipment Header */}
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentIconContainer}>
          <Ionicons name={icon} size={24} color="#FFD700" />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        <View style={styles.workoutIndicator}>
          <Text style={styles.workoutCount}>{currentWorkoutIndex + 1}/{workouts.length}</Text>
        </View>
      </View>

      {/* Workout List with Touch Swiping */}
      <View 
        style={styles.workoutList}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <FlatList
          ref={flatListRef}
          data={workouts}
          renderItem={renderWorkout}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideSize = width - 48;
            const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
            setCurrentWorkoutIndex(index);
          }}
          initialScrollIndex={currentWorkoutIndex}
          getItemLayout={(data, index) => ({
            length: width - 48,
            offset: (width - 48) * index,
            index,
          })}
          keyExtractor={(item, index) => `${equipment}-${item.name}-${index}`}
        />
      </View>

      {/* Workout Indicator Dots */}
      <View style={styles.dotsContainer}>
        <Text style={styles.dotsLabel}>Swipe to explore</Text>
        <View style={styles.dotsRow}>
          {workouts.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                currentWorkoutIndex === index && styles.activeDot,
              ]}
              onPress={() => {
                setCurrentWorkoutIndex(index);
                flatListRef.current?.scrollToIndex({ 
                  index, 
                  animated: true 
                });
              }}
              activeOpacity={0.7}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default function BicepsWorkoutDisplay() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Biceps';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse selected equipment from URL parameter
  const selectedEquipment = equipmentParam ? 
    decodeURIComponent(equipmentParam).split(',').map(eq => eq.trim()) : 
    [];

  // Filter workout database based on selected equipment
  const userWorkouts = bicepsWorkoutDatabase.filter(item => 
    selectedEquipment.includes(item.equipment)
  );

  // Remove duplicates if any
  const uniqueUserWorkouts = userWorkouts.filter((item, index, self) => 
    index === self.findIndex((t) => t.equipment === item.equipment)
  );

  const selectedEquipmentNames = uniqueUserWorkouts.map(eq => eq.equipment);

  // Get difficulty color
  const difficultyColor = difficulty === 'beginner' ? '#FFD700' : 
                         difficulty === 'intermediate' ? '#FFA500' : '#B8860B';

  const handleGoBack = () => {
    router.back();
  };

  const handleStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    console.log('🚀 Starting biceps workout:', workout.name);
    
    try {
      router.push({
        pathname: '/workout-guidance',
        params: {
          workoutName: workout.name,
          equipment: equipment,
          description: workout.battlePlan || '',
          duration: workout.duration || '15 min',
          difficulty: difficulty,
          workoutType: workoutType,
          // Pass MOOD tips as properly encoded JSON string
          moodTips: encodeURIComponent(JSON.stringify(workout.moodTips || []))
        }
      });
      
      console.log('✅ Navigation completed - using simplified parameters');
    } catch (error) {
      console.error('❌ Error starting workout:', error);
    }
  };

  // Create progress bar - single row with requested order
  const createProgressRows = () => {
    const steps = [
      { key: 'mood', icon: 'flame', text: moodTitle },
      { key: 'bodyPart', icon: 'fitness', text: workoutType },
      { key: 'difficulty', icon: 'speedometer', text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
      { key: 'equipment', icon: 'construct', text: `${selectedEquipmentNames.length} Equipment` },
    ];

    // Return single row
    return [steps];
  };

  const getEquipmentIcon = (equipmentName: string): keyof typeof Ionicons.glyphMap => {
    const equipmentIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'Adjustable bench': 'trending-up-outline',
      'Barbell': 'remove',
      'Dumbbells': 'fitness'
    };
    return equipmentIconMap[equipmentName] || 'fitness';
  };

  if (uniqueUserWorkouts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Workouts</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.emptyState}>
          <Ionicons name="fitness" size={64} color="#666" />
          <Text style={styles.emptyStateText}>No biceps workouts found for your selected equipment.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Workouts</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Your Workout Path</Text>
          {createProgressRows().map((row, rowIndex) => (
            <View key={rowIndex} style={styles.progressRow}>
              {row.map((step, stepIndex) => (
                <View key={step.key} style={styles.progressStep}>
                  <View style={styles.progressIcon}>
                    <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={16} color="#FFD700" />
                  </View>
                  <Text style={styles.progressText}>{step.text}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Workout Cards */}
        <View style={styles.workoutsContainer}>
          {uniqueUserWorkouts.map((equipmentData, index) => {
            const difficultyWorkouts = equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts] || [];
            
            return (
              <WorkoutCard
                key={equipmentData.equipment}
                equipment={equipmentData.equipment}
                icon={equipmentData.icon}
                workouts={difficultyWorkouts}
                difficulty={difficulty}
                difficultyColor={difficultyColor}
                onStartWorkout={handleStartWorkout}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  progressSection: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
    maxWidth: '25%',
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 11,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  workoutsContainer: {
    paddingBottom: 100,
  },
  workoutCard: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 24,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#262626',
  },
  equipmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  workoutCount: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  workoutList: {
    // Container for FlatList
  },
  workoutSlide: {
    padding: 20,
  },
  workoutImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  workoutImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  swipeText: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '500',
  },
  workoutContent: {
    // Content container
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutDuration: {
    fontSize: 16,
    color: '#cccccc',
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  intensityReason: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  workoutDescriptionContainer: {
    marginBottom: 16,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 8,
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dotsLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFD700',
    width: 24,
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});