import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.title}>How are you feeling today?</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.moodGrid}>
          {moodCards.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={styles.moodCardContainer}
              onPress={() => handleMoodSelect(mood)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={mood.gradient}
                style={styles.moodCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <Ionicons 
                    name={mood.icon} 
                    size={32} 
                    color="white" 
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardTitle}>{mood.title}</Text>
                  <Text style={styles.cardSubtitle}>{mood.subtitle}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickStats}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    position: 'relative',
  },
  greeting: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  notificationBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  moodGrid: {
    marginTop: 20,
  },
  moodCardContainer: {
    marginBottom: 16,
  },
  moodCard: {
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  quickStats: {
    marginTop: 32,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});