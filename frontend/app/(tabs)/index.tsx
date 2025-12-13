import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  Linking,
  Platform,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { useAuth } from '../../contexts/AuthContext';
import { Analytics } from '../../utils/analytics';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = SCREEN_WIDTH - (CAROUSEL_PADDING * 2);

// Workout carousel data - 5 featured workouts with mood + workout format
// Images provided by user for carousel display
const featuredWorkouts = [
  {
    id: '1',
    mood: 'I Want to Sweat',
    title: 'Cardio Based',
    duration: '25–35 min',
    badge: 'Top pick',
    exercises: [
      'Stationary Bike - Hill & Sprint',
      'Stair Master - Hill Climb',
    ],
    // Cardio Based Sweat image
    image: 'https://customer-assets.emergentagent.com/job_3f3e12c6-013b-4158-b2e9-29980fb2b4f9/artifacts/tfdiqbfo_download.png',
  },
  {
    id: '2',
    mood: 'Muscle Gainer',
    title: 'Back & Bis Volume',
    duration: '45–60 min',
    badge: 'Trending',
    exercises: [
      'Adjustable Bench - Chest Support Row',
      'T-Bar Row Machine - Slow Neg Row',
      'Pull Up Bar - Pull Up + Hold',
      'Cable Machine - Cable Negatives',
      'EZ Curl Bar - Narrow Curl',
    ],
    // First exercise: Chest-Support Row - Adjustable bench
    image: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
  },
  {
    id: '6',
    mood: 'I Want to Sweat',
    title: 'HIIT - Intense Full Body',
    duration: '45–55 min',
    badge: 'Intense',
    exercises: [
      'Kettlebells - AMRAP 15',
      'Battle Ropes - Gauntlet',
      'Sled - Sled & Burpee Circuit',
    ],
    // Kettlebell AMRAP 15 image
    image: 'https://customer-assets.emergentagent.com/job_3f3e12c6-013b-4158-b2e9-29980fb2b4f9/artifacts/p7pyg0r0_download%20%289%29.png',
  },
  {
    id: '3',
    mood: 'Build Explosion',
    title: 'Power Lifting',
    duration: '30–40 min',
    badge: 'Popular',
    exercises: [
      'Power Lifting Platform - Hang Clean Pull to Tall Shrug',
      'Power Lifting Platform - Push Press Launch',
      'Trap Hex Bar - Trap Bar Jump',
      'Landmine Attachment - Hacksquat Jump',
    ],
    // Power Lifting image
    image: 'https://customer-assets.emergentagent.com/job_3f3e12c6-013b-4158-b2e9-29980fb2b4f9/artifacts/o0vkrre5_download%20%289%29.png',
  },
  {
    id: '4',
    mood: 'Calisthenics',
    title: 'Pulls & Dips',
    duration: '25–35 min',
    badge: 'Staff pick',
    exercises: [
      'Pull Up Bar - Eccentric Lines',
      'Pull Up Bar - Strict Pull',
      'Parallel Bars Dip Station - Eccentric Power',
    ],
    // Calisthenics image - updated
    image: 'https://customer-assets.emergentagent.com/job_healthtracker-133/artifacts/jiw9nz1m_download%20%282%29.png',
  },
  {
    id: '5',
    mood: 'Get Outside',
    title: 'Hill Workout',
    duration: '30–40 min',
    badge: 'New',
    exercises: [
      'Hills - Power Mix',
      'Hills - Sprint Only 30s',
    ],
    // First exercise: Hill Power Mix - Hills
    image: 'https://customer-assets.emergentagent.com/job_exercise-library-12/artifacts/zqqramht_download%20%2813%29.png',
  },
];

// Workout Carousel Card Component
const WorkoutCarouselCard = ({ 
  workout, 
  onPress,
  onSave,
  onUnsave,
  isSaved,
  isSaving 
}: { 
  workout: typeof featuredWorkouts[0]; 
  onPress: () => void;
  onSave: () => void;
  onUnsave: () => void;
  isSaved: boolean;
  isSaving: boolean;
}) => {
  return (
    <TouchableOpacity 
      style={styles.carouselCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: workout.image }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
      <View style={styles.carouselOverlay} />
      
      {/* Badge - top left */}
      <View style={styles.carouselBadge}>
        <Text style={styles.carouselBadgeText}>{workout.badge}</Text>
      </View>
      
      {/* Bookmark/Save button - top right */}
      <TouchableOpacity 
        style={styles.bookmarkButton}
        onPress={() => {
          if (!isSaving) {
            if (isSaved) {
              onUnsave();
            } else {
              onSave();
            }
          }
        }}
      >
        <Ionicons 
          name={isSaved ? "bookmark" : "bookmark-outline"} 
          size={20} 
          color={isSaved ? "#FFD700" : "#fff"} 
        />
      </TouchableOpacity>
      
      {/* Bottom info - mood + workout format */}
      <View style={styles.carouselInfo}>
        <Text style={styles.carouselTitle}>{workout.mood} - {workout.title}</Text>
        <Text style={styles.carouselDuration}>{workout.duration}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Animated Carousel Pagination Dots
const CarouselDots = ({ activeIndex, total }: { activeIndex: number; total: number }) => {
  const animatedValues = useRef(
    Array.from({ length: total }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animate all dots
    animatedValues.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index === activeIndex ? 1 : 0,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }).start();
    });
  }, [activeIndex]);

  return (
    <View style={styles.dotsContainer}>
      {animatedValues.map((anim, index) => {
        const width = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 24],
        });
        const backgroundColor = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgba(255, 255, 255, 0.3)', '#ffffff'],
        });
        
        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width,
                backgroundColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
};


interface MoodCard {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
}

// Animated Mood Card Component - MOBILE OPTIMIZED
const AnimatedMoodCard = ({ mood, index, onPress }: { 
  mood: MoodCard; 
  index: number; 
  onPress: (mood: MoodCard) => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Stagger the animation start based on index - matching welcome page timing
    const delay = index * 1500; // 1.5 seconds between each card's animation start
    
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 450,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 450,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 450,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 2,
              duration: 450,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(3500), // Wait 3.5 seconds before next animation
        ])
      ).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);

  // Interpolate rotation for simple Z-axis rotation
  const rotateZ = rotateAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  return (
    <TouchableOpacity
      style={styles.moodCardContainer}
      onPress={() => onPress(mood)}
      activeOpacity={0.8}
    >
      {/* Highly Visible Card */}
      <View style={styles.visibleMoodCard}>
        <View style={styles.cardContent}>
          <Animated.View 
            style={[
              styles.iconContainer,
              { 
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotateZ }
                ] 
              }
            ]}
          >
            <Ionicons 
              name={mood.icon} 
              size={28} 
              color="#FFD700" 
              style={styles.cardIcon}
            />
          </Animated.View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{mood.title}</Text>
            <Text style={styles.cardSubtitle}>{mood.subtitle}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color="rgba(255, 255, 255, 0.3)" 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const moodCards: MoodCard[] = [
  {
    id: 'sweat',
    title: 'I want to sweat',
    subtitle: 'High intensity cardio',
    icon: 'flame',
    gradient: ['#FF6B6B', '#FF8E53'],
  },
  {
    id: 'muscle',
    title: 'Muscle gainer',
    subtitle: 'Strength training focus',
    icon: 'barbell',
    gradient: ['#4ECDC4', '#44A08D'],
  },
  {
    id: 'explosive',
    title: 'Build explosion',
    subtitle: 'Power & plyometric moves',
    icon: 'flash',
    gradient: ['#FFD93D', '#FF6B6B'],
  },
  {
    id: 'lazy',
    title: "I'm feeling lazy",
    subtitle: 'Gentle movement',
    icon: 'bed',
    gradient: ['#D299C2', '#FEF9D7'],
  },
  {
    id: 'calisthenics',
    title: 'I want to do calisthenics',
    subtitle: 'Bodyweight exercises',
    icon: 'body',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 'outdoor',
    title: 'I want to get outside',
    subtitle: 'Fresh air workouts',
    icon: 'bicycle',
    gradient: ['#56ab2f', '#a8e6cf'],
  },
];

export default function WorkoutsHome() {
  const [greeting, setGreeting] = useState('');
  const [userStats, setUserStats] = useState({ workouts: 0, minutes: 0, streak: 0 });
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [savedWorkoutIds, setSavedWorkoutIds] = useState<Set<string>>(new Set());
  const [savingWorkoutIds, setSavingWorkoutIds] = useState<Set<string>>(new Set());
  const carouselRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { token } = useAuth();
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Check which featured workouts are already saved
  // This refreshes every time the screen comes into focus
  const checkSavedWorkouts = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/saved-workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const savedWorkouts = await response.json();
        const savedNames = new Set(savedWorkouts.map((w: any) => w.name));
        const savedIds = new Set<string>();
        
        // Match saved workout names to featured workout IDs
        featuredWorkouts.forEach(fw => {
          const name = `${fw.mood} - ${fw.title}`;
          if (savedNames.has(name)) {
            savedIds.add(fw.id);
          }
        });
        
        setSavedWorkoutIds(savedIds);
      }
    } catch (error) {
      console.log('Error checking saved workouts:', error);
    }
  }, [token]);

  // Refresh saved workouts when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      checkSavedWorkouts();
    }, [checkSavedWorkouts])
  );

  // Save a featured workout
  const handleSaveFeaturedWorkout = async (workout: typeof featuredWorkouts[0]) => {
    if (!token) {
      Alert.alert('Login Required', 'Please login to save workouts');
      return;
    }
    
    // Add to saving state
    setSavingWorkoutIds(prev => new Set(prev).add(workout.id));
    
    try {
      // We need to get the full workout data from the detail data
      // For now, we'll save with basic info and the exercises list
      const response = await fetch(`${API_URL}/api/saved-workouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${workout.mood} - ${workout.title}`,
          workouts: workout.exercises.map(name => ({
            name: name,
            equipment: 'Various',
            duration: '5-10 min',
            difficulty: 'Intermediate',
          })),
          total_duration: parseInt(workout.duration.split('–')[0]) || 30,
          source: 'featured',
          featured_workout_id: workout.id,
          mood: workout.mood,
          title: workout.title,
        }),
      });
      
      if (response.ok || response.status === 400) {
        // Add to saved state
        setSavedWorkoutIds(prev => new Set(prev).add(workout.id));
      } else {
        Alert.alert('Error', 'Failed to save workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout');
    } finally {
      // Remove from saving state
      setSavingWorkoutIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(workout.id);
        return newSet;
      });
    }
  };

  // Unsave a featured workout
  const handleUnsaveFeaturedWorkout = async (workout: typeof featuredWorkouts[0]) => {
    if (!token) return;
    
    console.log('handleUnsaveFeaturedWorkout called for:', workout.title);
    
    // Add to saving state
    setSavingWorkoutIds(prev => new Set(prev).add(workout.id));
    
    try {
      const workoutName = `${workout.mood} - ${workout.title}`;
      console.log('Looking for workout to delete:', workoutName);
      
      // First, get all saved workouts to find the one to delete
      const listResponse = await fetch(`${API_URL}/api/saved-workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (listResponse.ok) {
        const savedWorkouts = await listResponse.json();
        console.log('Saved workouts:', savedWorkouts.map((w: any) => w.name));
        const workoutToDelete = savedWorkouts.find((w: any) => w.name === workoutName);
        
        if (workoutToDelete) {
          console.log('Found workout to delete:', workoutToDelete._id);
          // Delete the saved workout
          const deleteResponse = await fetch(`${API_URL}/api/saved-workouts/${workoutToDelete._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          
          console.log('Delete response status:', deleteResponse.status);
          
          if (deleteResponse.ok) {
            // Remove from saved state
            setSavedWorkoutIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(workout.id);
              console.log('Removed workout from saved state:', workout.id);
              return newSet;
            });
          }
        } else {
          console.log('Workout not found in saved list');
        }
      }
    } catch (error) {
      console.error('Error unsaving workout:', error);
    } finally {
      // Remove from saving state
      setSavingWorkoutIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(workout.id);
        return newSet;
      });
    }
  };

  // Auto-scroll carousel every 4 seconds (slower)
  // Timer resets when user manually swipes
  const startAutoScroll = useCallback(() => {
    // Clear existing timer first
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    
    autoScrollTimer.current = setInterval(() => {
      setActiveCarouselIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % featuredWorkouts.length;
        carouselRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000);
  }, []);

  useEffect(() => {
    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [startAutoScroll]);

  // Handle carousel scroll end to update active index and reset timer
  const onCarouselScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (CARD_WIDTH + CARD_GAP));
    if (index !== activeCarouselIndex && index >= 0 && index < featuredWorkouts.length) {
      setActiveCarouselIndex(index);
      // Reset the auto-scroll timer when user manually swipes
      startAutoScroll();
    }
  }, [activeCarouselIndex, startAutoScroll]);

  // Render carousel item
  const renderCarouselItem = useCallback(({ item }: { item: typeof featuredWorkouts[0] }) => {
    return (
      <WorkoutCarouselCard 
        workout={item} 
        onPress={() => {
          // Track featured workout click
          if (token) {
            Analytics.featuredWorkoutClicked(token, {
              workout_id: item.id,
              workout_title: item.title,
              mood_category: item.mood,
            });
          }
          router.push({
            pathname: '/featured-workout-detail',
            params: { id: item.id },
          });
        }}
        onSave={() => handleSaveFeaturedWorkout(item)}
        onUnsave={() => handleUnsaveFeaturedWorkout(item)}
        isSaved={savedWorkoutIds.has(item.id)}
        isSaving={savingWorkoutIds.has(item.id)}
      />
    );
  }, [router, token, savedWorkoutIds, savingWorkoutIds]);

  // Fetch user workout stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${API_URL}/api/users/me/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserStats({
            workouts: data.workouts_completed || 0,
            minutes: data.total_minutes || 0,
            streak: data.current_streak || 0,
          });
        }
      } catch (error) {
        console.log('Error fetching user stats:', error);
      }
    };
    
    fetchUserStats();
  }, [token]);

  const handleMoodSelect = (mood: MoodCard) => {
    console.log('Selected mood:', mood.title);
    
    // Track mood selection
    if (token) {
      Analytics.moodSelected(token, { mood_category: mood.id });
    }
    
    if (mood.id === 'sweat') {
      // Navigate to workout type selection for "I want to sweat"
      router.push({
        pathname: '/workout-type',
        params: { mood: mood.title }
      });
    } else if (mood.id === 'muscle') {
      // Navigate to body parts selection for "Muscle gainer"
      router.push({
        pathname: '/body-parts',
        params: { mood: mood.title }
      });
    } else if (mood.id === 'explosive') {
      // Navigate to explosiveness workout type selection
      router.push({
        pathname: '/explosiveness-type',
        params: { mood: mood.title }
      });
    } else if (mood.id === 'lazy') {
      // Navigate to lazy training type selection
      router.push({
        pathname: '/lazy-training-type',
        params: { mood: mood.title }
      });
    } else if (mood.id === 'calisthenics') {
      // Navigate to calisthenics equipment selection
      router.push({
        pathname: '/calisthenics-equipment',
        params: { mood: mood.title }
      });
    } else if (mood.id === 'outdoor') {
      // Navigate to outdoor equipment selection
      router.push({
        pathname: '/outdoor-equipment',
        params: { mood: mood.title }
      });
    } else {
      // TODO: Navigate to workout selection based on other moods
      console.log('Navigation for other moods will be implemented later');
    }
  };

  const handleSocialLink = async (url: string, platform: string) => {
    try {
      // For web platform, use window.open to open in new tab
      if (Platform.OS === 'web') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // For mobile (iOS/Android), use Linking to open in native browser or app
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', `Could not open ${platform}. Please check if you have the app installed.`);
        }
      }
    } catch (error) {
      Alert.alert('Error', `Could not open ${platform}. Please try again.`);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.fullScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContentContainer, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 40) }]}
          bounces={true}
        >
        {/* Centered MOOD Branding */}
        <View style={styles.centeredBrandingHeader}>
          <Text style={styles.centeredBrandTitle}>MOOD</Text>
          <Text style={styles.centeredBrandSubtitle}>Workouts based on your mood</Text>
          <View style={styles.centeredSocialContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://www.instagram.com/officialmoodapp/', 'Instagram')}
            >
              <Ionicons name="logo-instagram" size={18} color="#FFD700" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://www.tiktok.com/@officialmoodapp', 'TikTok')}
            >
              <Ionicons name="logo-tiktok" size={18} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Tracker - Moved to top */}
        <View style={styles.topProgressSection}>
          <View style={styles.progressStatsRow}>
            <View style={styles.progressStatItem}>
              <Text style={styles.progressStatValue}>{userStats.workouts}</Text>
              <Text style={styles.progressStatLabel}>Workouts</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressStatItem}>
              <Text style={styles.progressStatValue}>{userStats.minutes}</Text>
              <Text style={styles.progressStatLabel}>Minutes</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressStatItem}>
              <View style={styles.streakContainer}>
                <Text style={styles.progressStatValue}>{userStats.streak}</Text>
                {userStats.streak > 0 && <Ionicons name="flame" size={16} color="#FFD700" style={styles.streakIcon} />}
              </View>
              <Text style={styles.progressStatLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Featured Workouts Carousel - Condensed */}
        <View style={styles.carouselSection}>
          <Text style={styles.carouselTitle2}>Featured Workouts</Text>
          
          <FlatList
            ref={carouselRef}
            data={featuredWorkouts}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_GAP}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselList}
            onScroll={onCarouselScroll}
            scrollEventThrottle={16}
            getItemLayout={(data, index) => ({
              length: CARD_WIDTH + CARD_GAP,
              offset: (CARD_WIDTH + CARD_GAP) * index,
              index,
            })}
          />
          
          <CarouselDots activeIndex={activeCarouselIndex} total={featuredWorkouts.length} />
        </View>

        {/* Mood Selection Section */}
        <View style={styles.moodCardsContainer}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.leftAccent} />
            <Text style={styles.uniqueSectionTitle}>Choose your <Text style={styles.moodHighlight}>MOOD</Text></Text>
            <View style={styles.rightAccent} />
          </View>
          <View style={styles.moodColumn}>
            {moodCards.map((mood, index) => (
              <AnimatedMoodCard
                key={mood.id}
                mood={mood}
                index={index}
                onPress={handleMoodSelect}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000000', // Pure black background - extends to edges
  },
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pure black background
  },
  fullScrollView: {
    flex: 1,
    backgroundColor: '#000000', // Pure black background
  },
  scrollContentContainer: {
    paddingBottom: 60, // Base bottom padding, will be enhanced with safe area
    backgroundColor: '#000000', // Pure black background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 25,
    marginBottom: 10,
  },
  centeredQuestionHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 25,
    marginBottom: 10,
  },
  visibleQuestionHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
    marginVertical: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.05)', // Slight background to ensure visibility
  },
  headerContent: {
    flex: 1,
  },
  centeredHeaderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  centeredTitle: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  animatedCenteredTitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
    paddingHorizontal: 20,
  },
  visibleCenteredTitle: {
    fontSize: 26,
    color: '#FFD700', // Bright gold color for maximum visibility
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  ultraVisibleHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginVertical: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Gold background
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 15,
    marginHorizontal: 20,
  },
  ultraVisibleText: {
    fontSize: 22,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 28,
  },
  questionSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  questionText: {
    fontSize: 22,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  spacer: {
    height: 20,
  },
  parallaxContainer: {
    height: 280,
    marginVertical: 20,
    marginHorizontal: 0, // Edge-to-edge flow
    borderRadius: 0, // Straight edges top and bottom
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  parallaxImage: {
    width: '100%',
    height: '120%', // Slightly larger for parallax effect
    position: 'absolute',
    top: -20, // Offset for parallax movement
  },
  parallaxOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for text readability
    borderRadius: 0, // Straight edges to match container
  },

  // Carousel Styles - Condensed
  carouselSection: {
    marginVertical: 8,
    paddingTop: 4,
  },
  carouselTitle2: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 24,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  carouselList: {
    paddingHorizontal: CAROUSEL_PADDING,
  },
  carouselCard: {
    width: CARD_WIDTH,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: CARD_GAP,
    backgroundColor: '#1a1a1a',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    zIndex: 2,
  },
  carouselBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    zIndex: 10,
  },
  carouselBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.2,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  bookmarkButtonSaved: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  savingText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  carouselInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingLeft: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  carouselDuration: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },

  centeredBrandingHeader: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 215, 0, 0.08)',
  },
  centeredBrandTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.15)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  centeredBrandSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '400',
    letterSpacing: 0.5,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    marginBottom: 8,
    textAlign: 'center',
  },
  centeredSocialContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 215, 0, 0.12)',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  moodCardsContainer: {
    marginTop: 32,
    paddingHorizontal: 28,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  leftAccent: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    marginRight: 12,
  },
  rightAccent: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    marginLeft: 12,
  },
  uniqueSectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  moodHighlight: {
    color: '#FFD700',
    fontWeight: '600',
  },
  moodColumn: {
    gap: 14,
  },
  animatedCardContainer: {
    marginBottom: 8,
  },
  moodCardContainer: {
    marginBottom: 0,
  },
  neonGlow: {
    borderRadius: 24,
    padding: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  visibleMoodCard: {
    borderRadius: 16,
    padding: 0,
    minHeight: 80,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#1a1a1a',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardIcon: {
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  quickStats: {
    marginTop: 48,
    marginHorizontal: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 215, 0, 0.08)',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  statsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 10,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    letterSpacing: 1,
  },
  goldAccentLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 1,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 6,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  // New top progress section styles
  topProgressSection: {
    marginHorizontal: 24,
    marginTop: -6,
    marginBottom: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.03)',
    borderRadius: 16,
    padding: 12,
  },
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressStatLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    marginLeft: 4,
  },
});