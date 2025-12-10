import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const PRIVACY_ACCEPTED_KEY = 'privacy_policy_accepted';

// Animated Feature Item Component
const AnimatedFeatureItem = ({ icon, title, description, delay = 0 }: { 
  icon: any; 
  title: string; 
  description: string; 
  delay?: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animation after delay
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
  }, []);

  // Interpolate rotation for simple Z-axis rotation
  const rotateZ = rotateAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  return (
    <View style={styles.featureItem}>
      <Animated.View 
        style={[
          styles.featureIcon,
          { 
            transform: [
              { scale: scaleAnim },
              { rotate: rotateZ }
            ] 
          }
        ]}
      >
        <Ionicons name={icon} size={24} color="#FFD700" />
      </Animated.View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState<boolean | null>(null);

  useEffect(() => {
    checkPrivacyAccepted();
  }, []);

  const checkPrivacyAccepted = async () => {
    try {
      const accepted = await AsyncStorage.getItem(PRIVACY_ACCEPTED_KEY);
      if (accepted === 'true') {
        setHasAcceptedPrivacy(true);
      } else {
        setHasAcceptedPrivacy(false);
        setShowPrivacyModal(true);
      }
    } catch (error) {
      console.error('Error checking privacy acceptance:', error);
      setHasAcceptedPrivacy(false);
      setShowPrivacyModal(true);
    }
  };

  const handleAcceptPrivacy = async () => {
    try {
      await AsyncStorage.setItem(PRIVACY_ACCEPTED_KEY, 'true');
      setHasAcceptedPrivacy(true);
      setShowPrivacyModal(false);
    } catch (error) {
      console.error('Error saving privacy acceptance:', error);
    }
  };

  const handleViewFullPolicy = () => {
    setShowPrivacyModal(false);
    router.push('/privacy-policy');
  };

  const handleGetStarted = () => {
    if (hasAcceptedPrivacy) {
      router.push('/auth/login');
    } else {
      setShowPrivacyModal(true);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="shield-checkmark" size={32} color="#FFD700" />
              </View>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <Text style={styles.modalSubtitle}>
                Before you continue, please review our privacy practices
              </Text>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.privacySummarySection}>
                <Text style={styles.privacySummaryTitle}>What we collect:</Text>
                
                <View style={styles.privacyItem}>
                  <View style={styles.privacyIconBadge}>
                    <Ionicons name="fitness" size={16} color="#FFD700" />
                  </View>
                  <View style={styles.privacyItemContent}>
                    <Text style={styles.privacyItemTitle}>Workout Data</Text>
                    <Text style={styles.privacyItemText}>
                      Exercise progress, equipment & difficulty preferences
                    </Text>
                  </View>
                </View>

                <View style={styles.privacyItem}>
                  <View style={styles.privacyIconBadge}>
                    <Ionicons name="analytics" size={16} color="#FFD700" />
                  </View>
                  <View style={styles.privacyItemContent}>
                    <Text style={styles.privacyItemTitle}>App Usage</Text>
                    <Text style={styles.privacyItemText}>
                      Session data, navigation patterns to improve experience
                    </Text>
                  </View>
                </View>

                <View style={styles.privacyItem}>
                  <View style={styles.privacyIconBadge}>
                    <Ionicons name="people" size={16} color="#FFD700" />
                  </View>
                  <View style={styles.privacyItemContent}>
                    <Text style={styles.privacyItemTitle}>Social Activity</Text>
                    <Text style={styles.privacyItemText}>
                      Posts, likes, comments, and follows (when you use these features)
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.privacyNote}>
                <Ionicons name="information-circle" size={18} color="#888" />
                <Text style={styles.privacyNoteText}>
                  We never sell your data. Your information is used only to improve your fitness journey.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.viewPolicyButton}
                onPress={handleViewFullPolicy}
              >
                <Ionicons name="document-text-outline" size={18} color="#FFD700" />
                <Text style={styles.viewPolicyText}>View Full Policy</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={handleAcceptPrivacy}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.acceptButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.acceptButtonText}>Accept & Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
              Nearly 1,000 curated workouts. Choose based on your mood, equipment, and goals.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <AnimatedFeatureItem
              icon="heart"
              title="Mood-Based Workouts"
              description="6 different moods, finely curated"
              delay={0}
            />
            <AnimatedFeatureItem
              icon="people"
              title="Social Community"
              description="Share your journey, inspire others"
              delay={1500}
            />
            <AnimatedFeatureItem
              icon="trending-up"
              title="Track Progress"
              description="Monitor streaks and achievements"
              delay={3000}
            />
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
    marginBottom: 16,
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
