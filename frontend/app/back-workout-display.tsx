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
  battlePlan: string;
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

// Back workout database - placeholder structure for now, will be populated with actual workouts later
const backWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Adjustable bench',
    icon: 'trending-up-outline',
    workouts: {
      beginner: [
        {
          name: 'Row Foundation',
          duration: '12–15 min',
          description: 'Supported rows and reverse fly for\nback strength and posture.\n ',
          battlePlan: '• 3 rounds:\n• 12 supported single-arm row\n• 10 reverse fly\n• Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect introduction to back rowing and posterior chain.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Row: Pull elbow behind torso',
              description: 'Focus on squeezing shoulder blade toward spine for lat activation.'
            },
            {
              icon: 'body',
              title: 'Reverse fly: Keep slight bend in arms',
              description: 'Target rear delts and improve posture with controlled motion.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Back Power',
          duration: '15–18 min',
          description: 'Incline rows and chest-supported movements\nfor intermediate back development.\n ',
          battlePlan: '• 4 rounds:\n• 10 incline dumbbell row\n• 8 chest-supported reverse fly\n• 12 prone Y-raises\n• Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive back training with multiple angles and planes.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Incline row: Pull to lower ribs',
              description: 'Target different lat fibers with varied pull angles.'
            },
            {
              icon: 'flash',
              title: 'Y-raises: Thumbs up toward ceiling',
              description: 'Activates lower traps and improves shoulder stability.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Back Complex',
          duration: '18–22 min',
          description: 'Advanced rowing complex with\nvariations for complete development.\n ',
          battlePlan: '• 3 rounds:\n• 8 heavy single-arm row\n• 10 incline row\n• 8 reverse fly\n• 12 prone T-raises\n• Rest 2 min',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced back complex for maximum posterior development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Heavy rows: Control the negative',
              description: 'Slow eccentric phase builds strength and muscle mass.'
            },
            {
              icon: 'construct',
              title: 'T-raises: Focus on mid-trap activation',
              description: 'Target often-neglected middle trapezius for complete development.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbell',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Row & Deadlift',
          duration: '14–16 min',
          description: 'Rows and deadlifts develop base power\nand muscle control.\n ',
          battlePlan: '3 rounds:\n• 10 Barbell Bent-Over Row\nRest 60–75s after each set\n• 10 Barbell Deadlift\nRest 60–75s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Builds foundational back strength with compound lifts.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace core, hinge hips, maintain flat back',
              description: 'Proper spine alignment protects back on all lifts.'
            },
            {
              icon: 'flash',
              title: 'Tight lats protect spine',
              description: 'Lat engagement improves pulling strength and safety.'
            }
          ]
        },
        {
          name: 'Row Flow Combo',
          duration: '12–14 min',
          description: 'Combines row grips and good mornings\nfor total back work.\n ',
          battlePlan: '3 rounds:\n• 10 Bent-Over Row\n• 10 Underhand Grip Row\n• 10 Barbell Good Morning\nRest 60–75s after completing the full sequence',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Varied grip rowing boosts muscular activation volume.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Transition smoothly between grips',
              description: 'Don\'t rush form between grip changes for better activation.'
            },
            {
              icon: 'body',
              title: 'Drive hips back, spine neutral',
              description: 'Proper hip hinge pattern during good mornings.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Pendlay + RDL',
          duration: '16–18 min',
          description: 'Pendlay rows and RDLs balance power\nwith hamstring load.\n ',
          battlePlan: '4 rounds:\n• 8 Pendlay Row\nRest 75–90s after each set\n• 10 Romanian Deadlift\nRest 75–90s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive pulls and slow RDLs strengthen full posterior.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Reset back tightness between Pendlay reps',
              description: 'Dead stop allows full lat engagement each rep.'
            },
            {
              icon: 'timer',
              title: 'Lower bar under control',
              description: 'Control eccentric to fully stretch hamstrings.'
            }
          ]
        },
        {
          name: 'Row Shrug Flow',
          duration: '16–18 min',
          description: 'Multi-grip rows, shrugs, deads build\ntraps and mid-back.\n ',
          battlePlan: '3 rounds:\n• 8 Bent-Over Row\n• 8 Reverse-Grip Row\n• 8 Barbell Shrugs\n• 8 Deadlift\nRest 90s after finishing the full circuit',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Combo of rows, shrugs, and deads creates dense fatigue.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Squeeze shrugs hard for one second',
              description: 'Peak contraction at top maximizes trap activation.'
            },
            {
              icon: 'construct',
              title: 'Stabilize posture before transitioning',
              description: 'Reset form between exercises for safety and effectiveness.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Barbell',
          duration: '20–22 min',
          description: 'Rows, deads, shrugs overload traps\nand spinal erectors.\n ',
          battlePlan: '4 rounds:\n• 8 Barbell Bent-Over Row\nRest 90–120s after each set\n• 8 Barbell Deadlift\nRest 90–120s after each set\n• 8 Barbell Shrug\nRest 90–120s after each set',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Higher volume heavy lifts establish raw size and mass.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Control eccentric for time under tension',
              description: 'Slow lowering phase builds strength and muscle mass.'
            },
            {
              icon: 'trending-up',
              title: 'Drive hips and traps through lockouts',
              description: 'Complete range of motion for maximum development.'
            }
          ]
        },
        {
          name: 'Power Complex',
          duration: '20–22 min',
          description: 'Row, high pull, and clean complex\nmaximizes back output.\n ',
          battlePlan: '4 rounds:\n• 8 Barbell Row\n• 8 Barbell High Pull\n• 8 Barbell Power Clean\nRest 90–120s after completing the full sequence',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive high pulls and cleans target power capacity.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Keep elbows leading bar path',
              description: 'Proper elbow position in high pulls for maximum power.'
            },
            {
              icon: 'flash',
              title: 'Explode hips to drive bar fast',
              description: 'Hip drive generates power for explosive cleans.'
            }
          ]
        }
      ]
    }
  }
  // TODO: Add remaining equipment types (Grip variation pull up bar, Kettle bells, etc.)
  // This is a placeholder structure - full equipment database will be implemented later
];

export default function BackWorkoutDisplay() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Back';
  const equipmentParam = params.equipment as string || '';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse selected equipment from URL parameter
  const selectedEquipment = equipmentParam ? 
    decodeURIComponent(equipmentParam).split(',').map(eq => eq.trim()) : 
    [];

  // Filter workout database based on selected equipment
  const userWorkouts = backWorkoutDatabase.filter(equipmentGroup => 
    selectedEquipment.includes(equipmentGroup.equipment)
  );

  const selectedEquipmentNames = userWorkouts.map(eq => eq.equipment);

  // Get difficulty color
  const difficultyColor = difficulty === 'beginner' ? '#FFD700' : 
                         difficulty === 'intermediate' ? '#FFA500' : '#B8860B';

  const handleGoBack = () => {
    router.back();
  };

  const onStartWorkout = (workout: Workout, equipment: string, difficulty: string) => {
    console.log('🚀 Starting back workout:', workout.name);
    
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

  // Equipment Workout Component matching chest path exactly
  const EquipmentWorkout = ({ equipment, icon, workouts }: { 
    equipment: string; 
    icon: keyof typeof Ionicons.glyphMap; 
    workouts: Workout[] 
  }) => {
    const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
    
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
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Text style={styles.difficultyBadgeText}>{difficulty.toUpperCase()}</Text>
            </View>
          </View>

          {/* Intensity Reason - Same Width as Photo */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: 'rgba(255, 215, 0, 0.12)',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(255, 215, 0, 0.25)',
            marginHorizontal: 0,
          }}>
            <Ionicons name="information-circle" size={16} color="#FFD700" style={{ color: '#FFD700' }} />
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

    const handleTouchStart = (e: any) => {
      const touch = e.nativeEvent.touches ? e.nativeEvent.touches[0] : e.nativeEvent;
      setTouchEnd(null);
      setTouchStart(touch.pageX || touch.clientX);
      console.log('👆 Touch started at:', touch.pageX || touch.clientX);
    };

    const handleTouchMove = (e: any) => {
      const touch = e.nativeEvent.touches ? e.nativeEvent.touches[0] : e.nativeEvent;
      setTouchEnd(touch.pageX || touch.clientX);
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;
      
      console.log('🎯 Swipe detected! Distance:', distance);
      
      if (isLeftSwipe && currentWorkoutIndex < workouts.length - 1) {
        const newIndex = currentWorkoutIndex + 1;
        console.log('👉 Swiped left, changing to workout index:', newIndex);
        setCurrentWorkoutIndex(newIndex);
      }
      
      if (isRightSwipe && currentWorkoutIndex > 0) {
        const newIndex = currentWorkoutIndex - 1;
        console.log('👈 Swiped right, changing to workout index:', newIndex);
        setCurrentWorkoutIndex(newIndex);
      }
      
      setTouchStart(null);
      setTouchEnd(null);
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

        {/* Swipeable Workouts - Touch-based Implementation */}
        <View 
          style={[styles.workoutList, { width: width - 48 }]}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {renderWorkout({ item: workouts[currentWorkoutIndex], index: currentWorkoutIndex })}
        </View>

        {/* Enhanced Dots Indicator */}
        <View style={styles.dotsContainer}>
          <Text style={styles.dotsLabel}>Swipe to explore</Text>
          <View style={styles.dotsRow}>
            {workouts.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  currentWorkoutIndex === index && styles.activeDot
                ]}
                onPress={() => {
                  console.log('🔘 Dot clicked, changing to workout index:', index);
                  setCurrentWorkoutIndex(index);
                }}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Create rows of progress steps with max 4 per row (matching cardio format)
  const createProgressRows = () => {
    const allSteps = [
      { icon: 'flame', text: moodTitle, key: 'mood' },
      { icon: 'fitness', text: workoutType, key: 'type' },
      { icon: 'speedometer', text: difficulty.charAt(0).toUpperCase() + difficulty.slice(1), key: 'difficulty' },
      ...selectedEquipmentNames.map((equipment, index) => ({
        icon: getEquipmentIcon(equipment),
        text: equipment,
        key: `equipment-${index}`
      }))
    ];

    const rows = [];
    for (let i = 0; i < allSteps.length; i += 4) {
      rows.push(allSteps.slice(i, i + 4));
    }
    return rows;
  };

  const getEquipmentIcon = (equipmentName: string): keyof typeof Ionicons.glyphMap => {
    const equipmentIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      'Adjustable bench': 'trending-up-outline',
      'Barbell': 'remove',
      'Grip variation pull up bar': 'git-branch-outline',
      'Kettle bells': 'cafe-outline',
      'Lat pull down machine': 'arrow-down-circle-outline',
      'Roman chair': 'analytics-outline',
      'Seated cable machine': 'accessibility-outline',
      'Seated Chest Supported Row Machine': 'desktop-outline',
      'Straight pull up bar': 'remove-circle-outline',
      'T bar row machine': 'add-outline'
    };
    return equipmentIconMap[equipmentName] || 'fitness';
  };

  if (userWorkouts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>No Workouts Found</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={64} color="#FFD700" />
          <Text style={styles.emptyStateText}>
            No workouts available for the selected back equipment.
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Please try selecting different equipment or check back later.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar with Row Layout */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          {createProgressRows().map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.progressRow}>
              {row.map((step, stepIndex) => (
                <React.Fragment key={step.key}>
                  <View style={styles.progressStep}>
                    <View style={styles.progressStepActive}>
                      <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={10} color="#000000" />
                    </View>
                    <Text style={styles.progressStepText}>{step.text}</Text>
                  </View>
                  {stepIndex < row.length - 1 && <View style={styles.progressConnector} />}
                </React.Fragment>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Workouts List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {userWorkouts.map((equipmentGroup, index) => {
          const workoutsForDifficulty = equipmentGroup.workouts[difficulty as keyof typeof equipmentGroup.workouts] || [];
          
          return (
            <EquipmentWorkout
              key={`${equipmentGroup.equipment}-${index}`}
              equipment={equipmentGroup.equipment}
              icon={equipmentGroup.icon}
              workouts={workoutsForDifficulty}
            />
          );
        })}
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  progressContent: {
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 60,
  },
  progressStepActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 60,
  },
  progressConnector: {
    width: 20,
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 4,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  workoutCard: {
    backgroundColor: '#111111',
    marginHorizontal: 24,
    marginVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  equipmentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
  },
  workoutIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
  workoutList: {
    height: 420,
    overflow: 'hidden',
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  workoutImageContainer: {
    height: 120,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 16,
  },
  workoutImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  swipeText: {
    fontSize: 10,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '600',
  },
  workoutContent: {
    paddingHorizontal: 0,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  durationIntensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  difficultyBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.5,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    marginHorizontal: 0,
  },
  intensityReason: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginLeft: 8,
  },
  workoutDescriptionContainer: {
    marginBottom: 16,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  startWorkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  dotsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    transform: [{ scale: 1.2 }],
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});