import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // User is authenticated, redirect to main app
      router.replace('/(tabs)');
    }
  }, [user, isLoading]);

  // TEMPORARY: Skip auth for testing mood cards
  // Remove this after testing
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Auto-redirecting to mood cards for testing...');
      router.replace('/(tabs)');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  // If user is not authenticated, show welcome screen
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0c0c0c', '#1a1a1a', '#0c0c0c']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
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
              onPress={() => router.push('/auth/register')}
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

            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.secondaryButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  logoContainer: {
    marginBottom: 20,
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
    paddingVertical: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    paddingBottom: 40,
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
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
});
