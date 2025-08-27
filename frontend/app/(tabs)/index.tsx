import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

interface MoodCard {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
}

// Animated Mood Card Component
const AnimatedMoodCard = ({ mood, index, onPress }: { 
  mood: MoodCard; 
  index: number; 
  onPress: (mood: MoodCard) => void;
}) => {
  const scaleValue = new Animated.Value(1);
  const opacityValue = new Animated.Value(0);

  useEffect(() => {
    // Stagger the card animations
    Animated.sequence([
      Animated.delay(index * 150),
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
    onPress(mood);
  };

  return (
    <Animated.View
      style={[
        styles.animatedCardContainer,
        {
          opacity: opacityValue,
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.moodCardContainer}
      >
        {/* Gold Neon Glow Effect */}
        <View style={styles.neonGlow}>
          <LinearGradient
            colors={mood.gradient}
            style={styles.moodCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={mood.icon} 
                  size={40} 
                  color="white" 
                  style={styles.cardIcon}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{mood.title}</Text>
                <Text style={styles.cardSubtitle}>{mood.subtitle}</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color="rgba(255, 255, 255, 0.7)" 
                />
              </View>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
    title: 'I want to push and gain muscle',
    subtitle: 'Strength training focus',
    icon: 'barbell',
    gradient: ['#4ECDC4', '#44A08D'],
  },
  {
    id: 'explosive',
    title: 'I want to build explosiveness',
    subtitle: 'Power & plyometric moves',
    icon: 'flash',
    gradient: ['#FFD93D', '#FF6B6B'],
  },
  {
    id: 'light',
    title: 'I want a light sweat',
    subtitle: 'Moderate intensity',
    icon: 'sunny',
    gradient: ['#A8EDEA', '#FED6E3'],
  },
  {
    id: 'lazy',
    title: "I'm feeling lazy",
    subtitle: 'Gentle movement',
    icon: 'leaf',
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
    icon: 'trail-sign',
    gradient: ['#56ab2f', '#a8e6cf'],
  },
];

export default function WorkoutsHome() {
  const insets = useSafeAreaInsets();
    const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleMoodSelect = (mood: MoodCard) => {
    console.log('Selected mood:', mood.title);
    // TODO: Navigate to workout selection based on mood
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView 
        style={styles.fullScrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        bounces={true}
        scrollEventThrottle={16}
      >
        {/* Header with Gold Neon Accent */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.title}>How are you feeling today?</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <View style={styles.notificationGlow}>
              <Ionicons name="notifications-outline" size={24} color="#FFD700" />
            </View>
          </TouchableOpacity>
        </View>
        {/* Mood Cards Column */}
        <View style={styles.moodCardsContainer}>
          <Text style={styles.sectionTitle}>Choose your mood</Text>
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

        {/* Stats Section with Gold Accent */}
        <View style={styles.quickStats}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.goldAccentLine} />
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pure black background
  },
  fullScrollView: {
    flex: 1,
    backgroundColor: '#000000', // Pure black background
  },
  scrollContentContainer: {
    paddingTop: 50, // Add top padding for status bar
    paddingBottom: 100, // Extra bottom padding for better scroll experience
    backgroundColor: '#000000', // Pure black background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 25,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  headerContent: {
    flex: 1,
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
  notificationBtn: {
    padding: 12,
  },
  notificationGlow: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 12,
  },
  moodCardsContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  moodColumn: {
    gap: 20,
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
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  moodCard: {
    borderRadius: 21,
    padding: 0,
    minHeight: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  cardIcon: {
    textShadowColor: 'rgba(255, 215, 0, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStats: {
    marginTop: 50,
    marginHorizontal: 24,
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 10,
  },
  statsHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  goldAccentLine: {
    width: 80,
    height: 3,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    textShadowColor: 'rgba(255, 215, 0, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
});
