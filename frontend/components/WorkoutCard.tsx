import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Workout } from '../types/workout';
import CustomWorkoutModal from './CustomWorkoutModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

const TOOLTIP_SHOWN_KEY = 'custom_workout_tooltip_shown_v5';
const GUEST_TOOLTIP_SESSION_KEY = 'guest_tooltip_session_shown';

const { width, height } = Dimensions.get('window');

export interface WorkoutCardProps {
  equipment: string;
  icon: keyof typeof Ionicons.glyphMap;
  workouts: Workout[];
  difficulty: string;
  isInCart: (workoutId: string) => boolean;
  createWorkoutId: (workout: Workout, equipment: string, difficulty: string) => string;
  handleAddToCart: (workout: Workout, equipment: string) => void;
  onStartWorkout: (workout: Workout, equipment: string, difficulty: string) => void;
}

const WorkoutCard = React.memo(({
  equipment,
  icon,
  workouts,
  difficulty,
  isInCart,
  createWorkoutId,
  handleAddToCart,
  onStartWorkout,
}: WorkoutCardProps) => {
  const { isGuest, token } = useAuth();
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [localScaleAnim] = useState(new Animated.Value(1));
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [selectedWorkoutForEdit, setSelectedWorkoutForEdit] = useState<Workout | null>(null);
  const [showHighlight, setShowHighlight] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const isMounted = useRef(true);
  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animation values for wiggle effect on each button
  const wiggleAnim1 = useRef(new Animated.Value(0)).current; // Pencil
  const wiggleAnim2 = useRef(new Animated.Value(0)).current; // Add workout
  const wiggleAnim3 = useRef(new Animated.Value(0)).current; // Preview

  // Track component mount/unmount to cancel highlight if user leaves
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
      }
    };
  }, []);

  // Check if highlight should be shown
  // Guests: show every session, Logged-in users: show only once
  useEffect(() => {
    const checkHighlightStatus = async () => {
      try {
        let shouldShow = false;
        
        if (isGuest) {
          const hasSeenThisSession = await AsyncStorage.getItem(GUEST_TOOLTIP_SESSION_KEY);
          shouldShow = !hasSeenThisSession;
        } else if (token) {
          const hasSeenHighlight = await AsyncStorage.getItem(TOOLTIP_SHOWN_KEY);
          shouldShow = !hasSeenHighlight;
        }
        
        if (shouldShow) {
          highlightTimerRef.current = setTimeout(() => {
            if (isMounted.current) {
              setShowHighlight(true);
              startWiggleAnimation();
            }
          }, 1500);
        }
      } catch (error) {
        console.log('Error checking highlight status:', error);
      }
    };
    checkHighlightStatus();
    
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, [isGuest, token]);

  const startWiggleAnimation = () => {
    const createWiggle = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: -1,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.delay(800),
        ])
      ).start();
    };
    
    createWiggle(wiggleAnim1, 0);
    createWiggle(wiggleAnim2, 100);
    createWiggle(wiggleAnim3, 200);
  };

  const dismissHighlight = async () => {
    setShowHighlight(false);
    wiggleAnim1.stopAnimation();
    wiggleAnim2.stopAnimation();
    wiggleAnim3.stopAnimation();
    wiggleAnim1.setValue(0);
    wiggleAnim2.setValue(0);
    wiggleAnim3.setValue(0);
    try {
      if (isGuest) {
        await AsyncStorage.setItem(GUEST_TOOLTIP_SESSION_KEY, 'true');
      } else {
        await AsyncStorage.setItem(TOOLTIP_SHOWN_KEY, 'true');
      }
    } catch (error) {
      console.log('Error saving highlight status:', error);
    }
  };

  const handleOpenCustomModal = (workout: Workout) => {
    setSelectedWorkoutForEdit(workout);
    setCustomModalVisible(true);
  };

  const handleAddToCartWithAnimation = (workout: Workout) => {
    // Animate locally without affecting parent
    Animated.sequence([
      Animated.timing(localScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(localScaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(localScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Call parent handler
    handleAddToCart(workout, equipment);
  };

  const renderWorkout = ({ item, index }: { item: Workout; index: number }) => (
    <View style={[styles.workoutSlide, { width: width - 48 }]}>
      {/* Workout Image */}
      <View style={styles.workoutImageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.workoutImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageGradient}
        />
      </View>

      {/* Workout Content */}
      <View style={styles.workoutContent}>
        {/* Workout Name */}
        <Text style={styles.workoutName}>{item.name}</Text>

        {/* Duration and Intensity on same line */}
        <View style={styles.durationIntensityRow}>
          <Text style={styles.workoutDuration}>{item.duration}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: '#FFD700' }]}>
            <Text style={styles.difficultyBadgeText}>
              {(difficulty === 'intermediate' ? 'INTERMED.' : difficulty).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Workout Description */}
        <View style={styles.workoutDescriptionContainer}>
          <Text style={styles.workoutDescription}>{item.description}</Text>
        </View>

        {/* Add Workout Button - with direct glow and wiggle when highlighted */}
        <Animated.View 
          style={[
            showHighlight && styles.glowingButton,
            showHighlight && {
              transform: [{ rotate: wiggleAnim2.interpolate({
                inputRange: [-1, 1],
                outputRange: ['-2deg', '2deg']
              })}]
            }
          ]}
        >
          <Animated.View style={{ transform: [{ scale: localScaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.addWorkoutButton,
                showHighlight && styles.highlightedBorder,
              ]}
              onPress={() => handleAddToCartWithAnimation(item)}
              activeOpacity={0.8}
              disabled={isInCart(createWorkoutId(item, equipment, difficulty))}
            >
              <Ionicons
                name={isInCart(createWorkoutId(item, equipment, difficulty)) ? 'checkmark' : 'add'}
                size={18}
                color="#FFD700"
              />
              <Text style={styles.addWorkoutButtonText}>
                {isInCart(createWorkoutId(item, equipment, difficulty)) ? 'Added' : 'Add workout'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Swipe for more text */}
        <Text style={styles.swipeForMoreText}>Swipe for more</Text>
      </View>
    </View>
  );

  if (workouts.length === 0) {
    return null;
  }

  return (
    <View style={styles.workoutCard}>
      {/* Equipment Header */}
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentIconContainer}>
          <Ionicons name={icon} size={24} color="#FFD700" />
        </View>
        <Text style={styles.equipmentName}>{equipment}</Text>
        
        {/* Preview Button - with direct glow and wiggle when highlighted */}
        <Animated.View 
          style={[
            showHighlight && styles.glowingButton,
            showHighlight && {
              transform: [{ rotate: wiggleAnim3.interpolate({
                inputRange: [-1, 1],
                outputRange: ['-3deg', '3deg']
              })}]
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.previewButton,
              showHighlight && styles.highlightedBorder,
            ]}
            onPress={() => onStartWorkout(workouts[currentWorkoutIndex], equipment, difficulty)}
            activeOpacity={0.8}
          >
            <Ionicons name="eye" size={14} color="#FFD700" />
            <Text style={styles.previewButtonText}>Preview</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Workout List */}
      <View style={styles.workoutList}>
        <FlatList
          ref={flatListRef}
          data={workouts}
          renderItem={renderWorkout}
          horizontal
          pagingEnabled
          snapToInterval={width - 48}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            if (boundedIndex !== currentWorkoutIndex) {
              setCurrentWorkoutIndex(boundedIndex);
            }
          }}
          onMomentumScrollEnd={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            setCurrentWorkoutIndex(boundedIndex);
          }}
          onScrollEndDrag={(event) => {
            const slideSize = width - 48;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.round(offset / slideSize);
            const boundedIndex = Math.max(0, Math.min(index, workouts.length - 1));
            setCurrentWorkoutIndex(boundedIndex);
          }}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: width - 48,
            offset: (width - 48) * index,
            index,
          })}
          keyExtractor={(item, index) => `${equipment}-${difficulty}-${index}`}
        />
      </View>

      {/* Navigation Dots - Centered */}
      <View style={styles.dotsContainer}>
        <View style={styles.dotsRow}>
          {workouts.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dotTouchArea,
                currentWorkoutIndex === index && styles.activeDotTouchArea,
              ]}
              onPress={() => {
                const offset = (width - 48) * index;
                flatListRef.current?.scrollToOffset({
                  offset: offset,
                  animated: true,
                });
                setCurrentWorkoutIndex(index);
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View
                style={[
                  styles.dot,
                  currentWorkoutIndex === index && styles.activeDot,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Edit Button - with direct glow and wiggle when highlighted */}
        <Animated.View 
          style={[
            styles.editButtonWrapper,
            showHighlight && styles.glowingButton,
            showHighlight && {
              transform: [{ rotate: wiggleAnim1.interpolate({
                inputRange: [-1, 1],
                outputRange: ['-5deg', '5deg']
              })}]
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.editButton,
              showHighlight && styles.highlightedBorder,
            ]}
            onPress={() => handleOpenCustomModal(workouts[currentWorkoutIndex])}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={18} color="#FFD700" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Semi-transparent overlay - tap to dismiss */}
      {showHighlight && (
        <Pressable 
          style={styles.highlightOverlay} 
          onPress={dismissHighlight}
        />
      )}

      {/* Custom Workout Modal */}
      <CustomWorkoutModal
        visible={customModalVisible}
        onClose={() => {
          setCustomModalVisible(false);
          setSelectedWorkoutForEdit(null);
        }}
        imageUrl={selectedWorkoutForEdit?.imageUrl || workouts[currentWorkoutIndex]?.imageUrl || ''}
        equipment={equipment}
        difficulty={difficulty}
        defaultWorkoutName={selectedWorkoutForEdit?.name || ''}
      />
    </View>
  );
});

export default WorkoutCard;

const styles = StyleSheet.create({
  workoutCard: {
    marginBottom: 25,
    marginHorizontal: 24,
    backgroundColor: '#111111',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  equipmentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  previewButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  previewButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutList: {
    height: 330,
  },
  workoutSlide: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  workoutImageContainer: {
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  editButtonWrapper: {
    position: 'absolute',
    top: -10,
    right: 21,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Highlight Overlay Styles
  highlightOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  highlightedButton: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  highlightedPencilButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  highlightedAddButton: {
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  highlightedAddButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  highlightedPreviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  highlightedPreviewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  workoutContent: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  workoutDescriptionContainer: {
    height: 40,
    marginBottom: 12,
    overflow: 'hidden',
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  addWorkoutButton: {
    height: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  addWorkoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  swipeForMoreText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 12,
  },
  dotsContainer: {
    height: 40,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 25,
    backgroundColor: 'transparent',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  dotTouchArea: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
    borderRadius: 16,
  },
  activeDotTouchArea: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    minHeight: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
});
