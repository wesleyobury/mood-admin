import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';


interface MoodCard {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
}

// Animated Mood Card Component - SIMPLIFIED FOR VISIBILITY
const AnimatedMoodCard = ({ mood, index, onPress }: { 
  mood: MoodCard; 
  index: number; 
  onPress: (mood: MoodCard) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.moodCardContainer}
      onPress={() => onPress(mood)}
      activeOpacity={0.8}
    >
      {/* Highly Visible Card */}
      <View style={styles.visibleMoodCard}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={mood.icon} 
              size={28} 
              color="#C9A961" 
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
  const [scrollY, setScrollY] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleMoodSelect = (mood: MoodCard) => {
    console.log('Selected mood:', mood.title);
    
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
      await WebBrowser.openBrowserAsync(url);
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
        scrollEventThrottle={16}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
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

        {/* Parallax Hero Image */}
        <View style={styles.parallaxContainer}>
          <Image 
            source={{ uri: 'https://customer-assets.emergentagent.com/job_mood-workout-app/artifacts/kuk8f49i_download%20%282%29.webp' }}
            style={[
              styles.parallaxImage,
              {
                transform: [
                  {
                    translateY: scrollY * 0.5, // Parallax effect - image moves slower than scroll
                  },
                ],
              },
            ]}
            resizeMode="cover"
            onLoad={() => console.log('Parallax image loaded successfully')}
            onError={(error) => console.log('Parallax image load error:', error.nativeEvent.error)}
          />
          <View style={styles.parallaxOverlay} />
        </View>

        {/* Mood Selection Section */}
        <View style={styles.moodCardsContainer}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.leftAccent} />
            <Text style={styles.uniqueSectionTitle}>Choose your mood</Text>
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


  centeredBrandingHeader: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 24,
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
    marginBottom: 8,
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
    marginBottom: 20,
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
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
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
    borderWidth: 0.5,
    borderColor: 'rgba(255, 215, 0, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
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
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
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
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 4,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.45)',
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
});