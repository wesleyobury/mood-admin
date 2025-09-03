import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
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

const workoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Treadmill',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Walk & Jog Mixer',
          duration: '20 min',
          description: '3 min brisk walk (3.0 mph), 2 min power walk (4.0 mph, incline 2%), 1 min light jog (5.0 mph), repeat 3x, finish with 3 min walk (3.0 mph, incline 1%).'
        },
        {
          name: 'Rolling Hills',
          duration: '20 min',
          description: '2 min walk (3.0 mph, incline 0%), 2 min walk (3.0 mph, incline 4%), 2 min walk (3.5 mph, incline 2%), 2 min jog (4.5 mph, incline 0%), repeat sequence, finish with 2 min walk (3.0 mph).'
        }
      ],
      intermediate: [
        {
          name: 'Speed Ladder',
          duration: '25 min',
          description: '3 min jog (5.5 mph), 2 min run (6.5 mph), 1 min fast run (7.5 mph), 2 min walk (3.5 mph, incline 3%), repeat 3x, finish with 3 min jog (5.5 mph).'
        },
        {
          name: 'Incline Intervals',
          duration: '30 min',
          description: '2 min run (6.0 mph, incline 1%), 1 min run (6.0 mph, incline 5%), 2 min walk (3.5 mph, incline 2%), repeat 5x, finish with 3 min walk (3.0 mph).'
        }
      ],
      advanced: [
        {
          name: 'Sprint Pyramid',
          duration: '30 min',
          description: '2 min jog (6.0 mph), 30 sec sprint (9.0 mph), 1 min jog, 45 sec sprint, 1 min jog, 1 min sprint, 2 min jog, repeat pyramid, finish with 5 min incline walk (4.0 mph, incline 8%).'
        },
        {
          name: 'Tempo & Hill Challenge',
          duration: '35 min',
          description: '5 min warm-up (jog), 10 min tempo run (7.0 mph, incline 2%), 5 x 1 min hill sprints (8.0 mph, incline 6%, 1 min walk between), 5 min cool-down.'
        }
      ]
    }
  },
  {
    equipment: 'Elliptical',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Resistance Rounds',
          duration: '20 min',
          description: '3 min easy (resistance 3), 2 min moderate (resistance 6), 1 min fast (resistance 4), repeat 4x, finish with 3 min easy (resistance 2).'
        },
        {
          name: 'Cadence Play',
          duration: '18 min',
          description: '2 min steady (RPM 55), 1 min fast (RPM 70), 2 min moderate (RPM 60), 1 min slow (RPM 50, resistance 5), repeat 3x.'
        }
      ],
      intermediate: [
        {
          name: 'Climb & Sprint',
          duration: '25 min',
          description: '2 min moderate (resistance 5), 1 min climb (resistance 10), 1 min sprint (resistance 4, RPM 80+), repeat 5x, finish with 3 min easy.'
        },
        {
          name: 'Reverse & Forward',
          duration: '30 min',
          description: '3 min forward (resistance 6), 2 min reverse (resistance 4), 1 min sprint (forward, resistance 5), repeat 4x, finish with 2 min easy.'
        }
      ],
      advanced: [
        {
          name: 'Tabata Elliptical',
          duration: '24 min',
          description: '8 rounds: 20 sec max effort (resistance 8), 10 sec easy (resistance 3), 2 min recovery, repeat for 3 cycles.'
        },
        {
          name: 'Endurance Builder',
          duration: '35 min',
          description: '5 min easy, 10 min moderate (resistance 7), 5 min hard (resistance 10), 5 min fast (resistance 5, RPM 80+), 5 min reverse (resistance 6), 5 min cool-down.'
        }
      ]
    }
  },
  {
    equipment: 'Arm bicycle',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Speed & Resistance Mix',
          duration: '12 min',
          description: '2 min easy (resistance 2), 1 min moderate (resistance 4), 1 min fast (resistance 2), repeat 3x, finish with 2 min easy.'
        },
        {
          name: 'Interval Builder',
          duration: '15 min',
          description: '1 min easy, 1 min moderate, 30 sec fast, 1 min easy, 1 min reverse, repeat 3x.'
        }
      ],
      intermediate: [
        {
          name: 'Pyramid Challenge',
          duration: '18 min',
          description: '1 min easy, 1 min moderate, 1 min hard, 1 min moderate, 1 min easy, repeat 3x.'
        },
        {
          name: 'Reverse & Forward',
          duration: '20 min',
          description: '2 min forward (resistance 5), 1 min reverse (resistance 3), 1 min sprint (forward, resistance 4), repeat 4x.'
        }
      ],
      advanced: [
        {
          name: 'HIIT Sprints',
          duration: '20 min',
          description: '30 sec max effort (resistance 8), 1 min easy (resistance 3), repeat 10x, finish with 5 min moderate.'
        },
        {
          name: 'Endurance & Power',
          duration: '25 min',
          description: '5 min moderate, 10 x 30 sec sprint (resistance 10) with 30 sec easy, 5 min reverse, 5 min cool-down.'
        }
      ]
    }
  },
  {
    equipment: 'Stationary bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Rolling Ride',
          duration: '20 min',
          description: '3 min easy (resistance 2), 2 min moderate (resistance 5), 1 min fast (resistance 3), repeat 4x.'
        },
        {
          name: 'Cadence Intervals',
          duration: '18 min',
          description: '2 min steady (70 RPM), 1 min fast (90 RPM), 2 min moderate (80 RPM), 1 min slow (60 RPM, resistance 6), repeat 3x.'
        }
      ],
      intermediate: [
        {
          name: 'Hill & Sprint',
          duration: '25 min',
          description: '2 min moderate (resistance 6), 1 min hill (resistance 10), 1 min sprint (resistance 4, 100+ RPM), repeat 5x.'
        },
        {
          name: 'Pyramid Ride',
          duration: '30 min',
          description: '3 min easy, 2 min moderate, 1 min hard, 2 min moderate, 3 min easy, repeat 3x.'
        }
      ],
      advanced: [
        {
          name: 'Tabata Bike',
          duration: '24 min',
          description: '8 rounds: 20 sec max effort (resistance 8), 10 sec easy (resistance 3), 2 min recovery, repeat for 3 cycles.'
        },
        {
          name: 'Endurance & Power',
          duration: '35 min',
          description: '5 min easy, 10 min moderate (resistance 7), 5 min hard (resistance 10), 5 min fast (resistance 5, 100+ RPM), 5 min standing climb (resistance 8), 5 min cool-down.'
        }
      ]
    }
  },
  {
    equipment: 'Assault bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Intro Intervals',
          duration: '12 min',
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.'
        },
        {
          name: 'Resistance Play',
          duration: '15 min',
          description: '2 min easy, 1 min moderate (increase resistance), 1 min fast, repeat 3x, finish with 2 min easy.'
        }
      ],
      intermediate: [
        {
          name: 'Sprint & Recover',
          duration: '18 min',
          description: '20 sec sprint, 40 sec easy, repeat 10x, 5 min moderate.'
        },
        {
          name: 'Ladder Intervals',
          duration: '20 min',
          description: '30 sec sprint, 1 min easy, 45 sec sprint, 1 min easy, 1 min sprint, 1 min easy, repeat sequence.'
        }
      ],
      advanced: [
        {
          name: 'Tabata Assault',
          duration: '16 min',
          description: '8 rounds: 20 sec max effort, 10 sec rest, 2 min easy, repeat for 2 cycles.'
        },
        {
          name: 'EMOM Challenge',
          duration: '20 min',
          description: 'Every minute: 20 sec sprint, 40 sec moderate, repeat for 20 min.'
        }
      ]
    }
  },
  {
    equipment: 'Stair master',
    icon: 'trending-up',
    workouts: {
      beginner: [
        {
          name: 'Step & Recover',
          duration: '12 min',
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.'
        },
        {
          name: 'Pace Changer',
          duration: '15 min',
          description: '2 min steady, 1 min double step (skip a step), 2 min slow, repeat 3x.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Climb',
          duration: '20 min',
          description: '1 min fast, 2 min moderate, 1 min side step (face sideways), repeat 4x.'
        },
        {
          name: 'Hill Climb',
          duration: '25 min',
          description: '2 min moderate, 1 min fast, 1 min slow, 1 min double step, repeat 5x.'
        }
      ],
      advanced: [
        {
          name: 'Speed & Endurance',
          duration: '30 min',
          description: '2 min fast, 1 min side step, 1 min double step, 2 min moderate, repeat 5x.'
        },
        {
          name: 'HIIT Steps',
          duration: '20 min',
          description: '30 sec sprint, 1 min moderate, 30 sec skip steps, 1 min slow, repeat 5x.'
        }
      ]
    }
  },
  {
    equipment: 'Row machine',
    icon: 'boat',
    workouts: {
      beginner: [
        {
          name: 'Row & Rest',
          duration: '12 min',
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.'
        },
        {
          name: 'Stroke Play',
          duration: '15 min',
          description: '2 min steady (22 SPM), 1 min fast (28 SPM), 2 min slow (20 SPM), repeat 3x.'
        }
      ],
      intermediate: [
        {
          name: 'Power Intervals',
          duration: '20 min',
          description: '1 min hard (28 SPM), 2 min moderate (24 SPM), 1 min slow (20 SPM), repeat 4x.'
        },
        {
          name: 'Pyramid Row',
          duration: '25 min',
          description: '1 min easy, 1 min hard, 2 min easy, 2 min hard, 3 min easy, 3 min hard, then back down.'
        }
      ],
      advanced: [
        {
          name: 'Sprint & Recover',
          duration: '20 min',
          description: '30 sec sprint (32 SPM), 1 min moderate (24 SPM), repeat 10x.'
        },
        {
          name: 'Endurance Builder',
          duration: '30 min',
          description: '5 min easy, 10 min moderate, 5 min hard, 5 min fast, 5 min cool-down.'
        }
      ]
    }
  },
  {
    equipment: 'Ski machine',
    icon: 'snow',
    workouts: {
      beginner: [
        {
          name: 'Ski & Glide',
          duration: '12 min',
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.'
        },
        {
          name: 'Resistance Play',
          duration: '15 min',
          description: '2 min steady (resistance 3), 1 min moderate (resistance 5), 2 min slow (resistance 2), repeat 3x.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Ski',
          duration: '18 min',
          description: '1 min hard, 2 min moderate, 1 min slow, repeat 4x.'
        },
        {
          name: 'Pyramid Ski',
          duration: '20 min',
          description: '1 min easy, 1 min hard, 2 min easy, 2 min hard, 3 min easy, 3 min hard.'
        }
      ],
      advanced: [
        {
          name: 'Sprint & Recover',
          duration: '20 min',
          description: '30 sec sprint, 1 min moderate, repeat 10x.'
        },
        {
          name: 'HIIT Ski',
          duration: '16 min',
          description: '8 rounds: 20 sec max effort, 10 sec rest, 2 min easy, repeat for 2 cycles.'
        }
      ]
    }
  },
  {
    equipment: 'Curve treadmill',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Walk & Jog',
          duration: '12 min',
          description: '2 min walk, 1 min jog, 2 min walk, 1 min jog, repeat 2x.'
        },
        {
          name: 'Speed Play',
          duration: '15 min',
          description: '1 min walk, 30 sec jog, 1 min walk, 30 sec fast walk, repeat 4x.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Run',
          duration: '18 min',
          description: '1 min run, 2 min walk, 1 min fast run, 2 min walk, repeat 3x.'
        },
        {
          name: 'Pyramid Pace',
          duration: '20 min',
          description: '1 min walk, 1 min jog, 1 min run, 1 min jog, 1 min walk, repeat 3x.'
        }
      ],
      advanced: [
        {
          name: 'Sprint Intervals',
          duration: '20 min',
          description: '20 sec sprint, 40 sec walk, repeat 15x.'
        },
        {
          name: 'EMOM Challenge',
          duration: '15 min',
          description: 'Every minute: 20 sec sprint, 40 sec moderate jog, repeat for 15 min.'
        }
      ]
    }
  },
  {
    equipment: 'Punching bag',
    icon: 'hand-left',
    workouts: {
      beginner: [
        {
          name: 'Combo Builder',
          duration: '10 min',
          description: '30 sec jab-cross, 30 sec rest, 30 sec jab-cross-hook, 30 sec rest, repeat 5x.'
        },
        {
          name: 'Movement Mix',
          duration: '12 min',
          description: '30 sec light punches, 30 sec footwork (move around bag), 30 sec rest, repeat 4x.'
        }
      ],
      intermediate: [
        {
          name: 'Power Rounds',
          duration: '15 min',
          description: '1 min combos (jab-cross-hook-uppercut), 30 sec rest, 1 min power punches, 30 sec rest, repeat 4x.'
        },
        {
          name: 'Speed & Defense',
          duration: '16 min',
          description: '30 sec fast punches, 30 sec slips/ducks, 30 sec rest, repeat 6x.'
        }
      ],
      advanced: [
        {
          name: 'HIIT Boxing',
          duration: '20 min',
          description: '45 sec max effort combos, 15 sec rest, repeat 15x.'
        },
        {
          name: 'Endurance Rounds',
          duration: '20 min',
          description: '2 min all-out, 1 min rest, 2 min footwork & defense, 1 min rest, repeat 3x.'
        }
      ]
    }
  },
  {
    equipment: 'Vertical Climber',
    icon: 'triangle',
    workouts: {
      beginner: [
        {
          name: 'Climb & Rest',
          duration: '10 min',
          description: '1 min climb, 1 min rest, repeat 5x.'
        },
        {
          name: 'Pace Play',
          duration: '12 min',
          description: '30 sec slow, 30 sec moderate, 30 sec fast, 30 sec rest, repeat 3x.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Climb',
          duration: '15 min',
          description: '1 min hard, 1 min moderate, 1 min slow, repeat 5x.'
        },
        {
          name: 'Ladder Climb',
          duration: '18 min',
          description: '30 sec fast, 1 min moderate, 30 sec slow, repeat 6x.'
        }
      ],
      advanced: [
        {
          name: 'Sprint & Recover',
          duration: '20 min',
          description: '20 sec sprint, 40 sec moderate, repeat 15x.'
        },
        {
          name: 'Endurance Climb',
          duration: '20 min',
          description: '2 min hard, 1 min moderate, repeat 6x.'
        }
      ]
    }
  },
  {
    equipment: 'Jump rope',
    icon: 'git-compare',
    workouts: {
      beginner: [
        {
          name: 'Jump & Rest',
          duration: '10 min',
          description: '30 sec jump, 30 sec rest, repeat 10x.'
        },
        {
          name: 'Skill Builder',
          duration: '12 min',
          description: '20 sec jump, 20 sec high knees, 20 sec rest, repeat 6x.'
        }
      ],
      intermediate: [
        {
          name: 'Interval Jumps',
          duration: '15 min',
          description: '1 min jump, 30 sec rest, 1 min high knees, 30 sec rest, repeat 4x.'
        },
        {
          name: 'Combo Rounds',
          duration: '16 min',
          description: '30 sec jump, 30 sec double-unders, 30 sec rest, repeat 6x.'
        }
      ],
      advanced: [
        {
          name: 'HIIT Rope',
          duration: '20 min',
          description: '40 sec double-unders, 20 sec rest, repeat 15x.'
        },
        {
          name: 'Endurance Challenge',
          duration: '20 min',
          description: '2 min jump, 1 min high knees, 1 min crossovers, 1 min rest, repeat 4x.'
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
}

const WorkoutCard = ({ equipment, icon, workouts, difficulty, difficultyColor }: WorkoutCardProps) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderWorkout = ({ item, index }: { item: Workout; index: number }) => (
    <View style={[styles.workoutSlide, { width: width - 48 }]}>
      <View style={styles.workoutHeader}>
        <View style={styles.workoutTitleContainer}>
          <Text style={styles.workoutName}>{item.name}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.difficultyBadgeText}>{difficulty.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.workoutDuration}>{item.duration}</Text>
      </View>
      <ScrollView style={styles.workoutDescriptionContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.workoutDescription}>{item.description}</Text>
      </ScrollView>
    </View>
  );

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentWorkoutIndex(viewableItems[0].index);
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
          <Text style={styles.workoutCount}>{currentWorkoutIndex + 1}/2</Text>
        </View>
      </View>

      {/* Swipeable Workouts */}
      <FlatList
        ref={flatListRef}
        data={workouts}
        renderItem={renderWorkout}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={styles.workoutList}
      />

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {workouts.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              currentWorkoutIndex === index && styles.activeDot
            ]}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index, animated: true });
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default function WorkoutDisplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Parse parameters with error handling
  const equipmentParam = params.equipment as string || '';
  let selectedEquipmentNames: string[] = [];
  
  try {
    selectedEquipmentNames = equipmentParam ? equipmentParam.split(',').map(name => name.trim()) : [];
  } catch (error) {
    console.error('Error parsing equipment parameter:', error);
    // Fallback to default equipment for testing
    selectedEquipmentNames = ['Treadmill'];
  }
  
  const difficulty = (params.difficulty as string || 'beginner').toLowerCase();
  const moodTitle = params.mood as string || 'I want to sweat';
  
  console.log('Parsed parameters:', { selectedEquipmentNames, difficulty, moodTitle });

  // Get difficulty color
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#4CAF50';
    }
  };

  const difficultyColor = getDifficultyColor(difficulty);

  // Filter workouts based on selected equipment
  const userWorkouts = workoutDatabase.filter(item => 
    selectedEquipmentNames.includes(item.equipment)
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleStartWorkout = (equipment: string, workout: Workout) => {
    console.log('Starting workout:', workout.name, 'on', equipment);
    // TODO: Navigate to workout timer/tracker screen
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Your Workouts</Text>
          <Text style={styles.headerSubtitle}>{moodTitle} • {difficulty}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressContent}
        >
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="flame" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="heart" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Cardio Based</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Text style={styles.progressStepNumberActive}>
                {selectedEquipmentNames.length}
              </Text>
            </View>
            <Text style={styles.progressStepText}>
              Equipment ({selectedEquipmentNames.length})
            </Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="checkmark" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="fitness" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Workouts</Text>
          </View>
        </ScrollView>
      </View>

      {/* Workout Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>
          {userWorkouts.length} Equipment • {userWorkouts.length * 2} Workouts
        </Text>
        <Text style={styles.summarySubtitle}>
          Swipe left/right on each card to see both workout options
        </Text>
      </View>

      {/* Workouts List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {userWorkouts.map((equipmentData, index) => (
          <WorkoutCard
            key={equipmentData.equipment}
            equipment={equipmentData.equipment}
            icon={equipmentData.icon}
            workouts={equipmentData.workouts[difficulty as keyof typeof equipmentData.workouts]}
            difficulty={difficulty}
            difficultyColor={difficultyColor}
          />
        ))}
      </ScrollView>
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
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  progressContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 80,
  },
  progressStepActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  progressStepNumberActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressStepText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 80,
  },
  progressConnector: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 8,
    marginTop: 16,
  },
  summaryContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 20,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  equipmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  equipmentName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  workoutList: {
    height: 200,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  workoutDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  workoutDescriptionContainer: {
    flex: 1,
  },
  workoutDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
});