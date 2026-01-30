import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

const { width, height } = Dimensions.get('window');

// Daily challenges data - users see one per day
const DAILY_CHALLENGES = [
  {
    id: 'four-corners-of-regret',
    name: 'Four Corners of Regret',
    duration: '60 min',
    description: `4 Stations — 15 min each
Rotate in order. No preset rest.

Station 1
• Freestyle Boxing
Shadowbox or bag — constant movement

Station 2
• Sled Push
Light–moderate load; steady turns

Station 3
• Hang Clean to Press
Light weight; smooth, repeatable reps

Station 4
• Burpee Box Jumps
Step down; rhythm over height`,
    summary: 'Light weight. Long grind. No place to hide.',
    moodTips: [
      {
        icon: 'barbell' as const,
        title: 'Keep loads light and cycleable',
        description: 'You should move continuously for 3–5 minutes without redlining',
      },
      {
        icon: 'flame' as const,
        title: 'Work at a sustainable burn',
        description: '~70% effort beats sprint–crash–recover',
      },
    ],
    imageUrl: 'https://res.cloudinary.com/dmeolrzzm/image/upload/v1738012917/HIIT1_xnvxl5.png',
    equipment: 'Gym Equipment',
    difficulty: 'Advanced',
  },
];

// Get today's challenge based on date
const getTodaysChallenge = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const challengeIndex = dayOfYear % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[challengeIndex];
};

export default function RingerChallenge() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { addToCart, cartItems } = useCart();
  const { token } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Animations
  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const loadingScale = useRef(new Animated.Value(1)).current;
  const skullRotate = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(100)).current;
  const cardScale = useRef(new Animated.Value(0.8)).current;
  
  const todaysChallenge = getTodaysChallenge();
  
  // Skull rotation animation during loading
  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(skullRotate, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(skullRotate, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    rotateAnimation.start();
    
    // Loading duration - 3 seconds
    const loadingTimer = setTimeout(() => {
      // Fade out loading screen
      Animated.parallel([
        Animated.timing(loadingOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(loadingScale, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsLoading(false);
        rotateAnimation.stop();
        
        // Animate card into view
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(cardTranslateY, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, {
            toValue: 1,
            friction: 6,
            tension: 50,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);
    
    return () => {
      clearTimeout(loadingTimer);
      rotateAnimation.stop();
    };
  }, []);
  
  const skullRotateInterpolate = skullRotate.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-15deg', '15deg', '-15deg'],
  });
  
  const isInCart = () => {
    return cartItems.some(item => item.id === `ringer-${todaysChallenge.id}`);
  };
  
  const handleAddToCart = () => {
    if (isInCart()) {
      setToastMessage('Already in cart');
      setShowToast(true);
      return;
    }
    
    addToCart({
      id: `ringer-${todaysChallenge.id}`,
      workoutTitle: todaysChallenge.name,
      workoutName: todaysChallenge.name,
      equipment: todaysChallenge.equipment,
      duration: todaysChallenge.duration,
      difficulty: todaysChallenge.difficulty,
      moodCategory: 'ringer',
      description: todaysChallenge.description,
      moodTips: todaysChallenge.moodTips,
      summary: todaysChallenge.summary,
    });
    
    setToastMessage('Added to cart');
    setShowToast(true);
  };
  
  const handleStartWorkout = () => {
    router.push({
      pathname: '/ringer-workout-guidance',
      params: {
        workoutId: todaysChallenge.id,
        workoutName: todaysChallenge.name,
        duration: todaysChallenge.duration,
        description: todaysChallenge.description,
        equipment: todaysChallenge.equipment,
        difficulty: todaysChallenge.difficulty,
        summary: todaysChallenge.summary,
        moodTips: JSON.stringify(todaysChallenge.moodTips),
      },
    });
  };
  
  // Loading Screen
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View 
          style={[
            styles.loadingContainer,
            {
              opacity: loadingOpacity,
              transform: [{ scale: loadingScale }],
            }
          ]}
        >
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#FFD700" />
          </TouchableOpacity>
          
          {/* Skull with X */}
          <Animated.View 
            style={[
              styles.skullContainer,
              { transform: [{ rotate: skullRotateInterpolate }] }
            ]}
          >
            <View style={styles.xBackground}>
              <Ionicons name="close" size={120} color="rgba(255, 215, 0, 0.3)" />
            </View>
            <Ionicons name="skull" size={80} color="#FFD700" style={styles.skullIcon} />
          </Animated.View>
          
          {/* Loading Text */}
          <Text style={styles.loadingTitle}>Loading Challenge</Text>
          
          {/* Info message */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="rgba(255, 215, 0, 0.7)" />
            <Text style={styles.infoText}>
              New challenge unlocks daily.{'\n'}One brutal workout per day.
            </Text>
          </View>
          
          {/* Pulsing dots */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((i) => (
              <Animated.View 
                key={i}
                style={[
                  styles.dot,
                  {
                    opacity: skullRotate.interpolate({
                      inputRange: [0, 0.33, 0.66, 1],
                      outputRange: i === 0 ? [1, 0.3, 0.3, 1] : i === 1 ? [0.3, 1, 0.3, 0.3] : [0.3, 0.3, 1, 0.3],
                    }),
                  }
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    );
  }
  
  // Challenge Card Screen
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="skull" size={24} color="#FFD700" />
          <Text style={styles.headerTitle}>Daily Challenge</Text>
        </View>
        <HomeButton />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Workout Card */}
        <Animated.View 
          style={[
            styles.workoutCardContainer,
            {
              opacity: cardOpacity,
              transform: [
                { translateY: cardTranslateY },
                { scale: cardScale },
              ],
            }
          ]}
        >
          <LinearGradient
            colors={['#1a1a1a', '#2a2a2a']}
            style={styles.workoutCard}
          >
            {/* Card Header with X behind skull */}
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="close" size={50} color="rgba(255, 215, 0, 0.2)" style={styles.xBehind} />
                <Ionicons name="skull" size={32} color="#FFD700" />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{todaysChallenge.name}</Text>
                <View style={styles.cardBadges}>
                  <View style={styles.badge}>
                    <Ionicons name="time-outline" size={12} color="#FFD700" />
                    <Text style={styles.badgeText}>{todaysChallenge.duration}</Text>
                  </View>
                  <View style={[styles.badge, styles.difficultyBadge]}>
                    <Text style={styles.badgeText}>{todaysChallenge.difficulty}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>{todaysChallenge.summary}</Text>
            </View>
            
            {/* Equipment */}
            <View style={styles.equipmentContainer}>
              <Ionicons name="barbell-outline" size={16} color="#888" />
              <Text style={styles.equipmentText}>{todaysChallenge.equipment}</Text>
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.addButton, isInCart() && styles.addedButton]}
                onPress={handleAddToCart}
              >
                <Ionicons 
                  name={isInCart() ? "checkmark" : "add"} 
                  size={20} 
                  color={isInCart() ? "#4CAF50" : "#FFD700"} 
                />
                <Text style={[styles.addButtonText, isInCart() && styles.addedButtonText]}>
                  {isInCart() ? 'Added' : 'Add to Cart'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.startButton}
                onPress={handleStartWorkout}
              >
                <LinearGradient
                  colors={['#FF8C00', '#FF6B00']}
                  style={styles.startButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="play" size={20} color="#fff" />
                  <Text style={styles.startButtonText}>Start</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* Daily Reset Info */}
        <Animated.View 
          style={[
            styles.resetInfo,
            {
              opacity: cardOpacity,
            }
          ]}
        >
          <Ionicons name="refresh-circle" size={18} color="rgba(255, 215, 0, 0.5)" />
          <Text style={styles.resetText}>New challenge unlocks at midnight</Text>
        </Animated.View>
      </ScrollView>
      
      {/* Toast */}
      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
        type="success"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  skullContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  xBackground: {
    position: 'absolute',
  },
  skullIcon: {
    position: 'absolute',
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  workoutCardContainer: {
    marginTop: 20,
  },
  workoutCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xBehind: {
    position: 'absolute',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  cardBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
  },
  badgeText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  equipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  equipmentText: {
    fontSize: 13,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  addedButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  addedButtonText: {
    color: '#4CAF50',
  },
  startButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  resetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
  },
  resetText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
