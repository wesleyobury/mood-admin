import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <View style={styles.simplifiedGradient}>
        <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.logoBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="fitness" size={48} color="#0c0c0c" />
              </LinearGradient>
            </View>

            <Text style={styles.title}>MOOD</Text>
            <Text style={styles.subtitle}>
              Workouts that match your{'\n'}
              <Text style={styles.highlightText}>mood</Text>
            </Text>

            <Text style={styles.description}>
              Discover personalized workouts based on how you're feeling today.
              Connect with a fitness community that gets you.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="heart" size={24} color="#FFD700" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Mood-Based Workouts</Text>
                <Text style={styles.featureDescription}>
                  7 different moods, infinite possibilities
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="people" size={24} color="#FFD700" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Social Community</Text>
                <Text style={styles.featureDescription}>
                  Share your journey, inspire others
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="trending-up" size={24} color="#FFD700" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Track Progress</Text>
                <Text style={styles.featureDescription}>
                  Monitor streaks and achievements
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => router.push('/auth/login')}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c', // Dark background edge-to-edge
  },
  simplifiedGradient: {
    flex: 1,
    backgroundColor: '#0c0c0c', // Use solid color instead of gradient for better performance
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: height * 0.06, // Reduced from 0.1 to move content up
  },
  logoContainer: {
    marginBottom: 16, // Reduced from 20
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 24,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  highlightText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresSection: {
    paddingTop: 32, // Top padding for features
    paddingBottom: 16, // Reduced bottom padding to close gap with button
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Further reduced from 20 to tighten spacing
    paddingHorizontal: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#888',
  },
  actionSection: {
    paddingTop: 8, // Minimal top padding between features and button
    paddingBottom: 10, // Bottom padding
  },
  primaryButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c0c0c',
  },
});
