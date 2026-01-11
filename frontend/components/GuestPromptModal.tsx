import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { GuestAnalytics } from '../utils/analytics';

const { width } = Dimensions.get('window');

interface GuestPromptModalProps {
  visible: boolean;
  onClose: () => void;
  action?: string; // What action was attempted (e.g., "save workouts", "like posts")
}

export default function GuestPromptModal({ visible, onClose, action = 'use this feature' }: GuestPromptModalProps) {
  const insets = useSafeAreaInsets();
  const { exitGuestMode } = useAuth();

  // Track when the modal is shown
  useEffect(() => {
    if (visible && action) {
      GuestAnalytics.signupPromptShown({ trigger_action: action });
    }
  }, [visible, action]);

  const handleSignUp = async () => {
    // Track the click
    GuestAnalytics.signupPromptClicked({ trigger_action: action, destination: 'register' });
    
    // Exit guest mode and navigate to register
    await exitGuestMode();
    onClose();
    router.push('/auth/register');
  };

  const handleSignIn = async () => {
    // Track the click
    GuestAnalytics.signupPromptClicked({ trigger_action: action, destination: 'login' });
    
    // Exit guest mode and navigate to login
    await exitGuestMode();
    onClose();
    router.push('/auth/login');
  };

  const handleDismiss = () => {
    // Track the dismissal
    GuestAnalytics.signupPromptDismissed({ trigger_action: action });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
          {/* Close button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleDismiss}
          >
            <Ionicons name="close" size={24} color="#888" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={32} color="#FFD700" />
            </View>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subtitle}>
              Sign up to {action} and unlock all features
            </Text>
          </View>

          {/* Benefits list */}
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="bookmark" size={20} color="#FFD700" />
              <Text style={styles.benefitText}>Save your favorite workouts</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="trending-up" size={20} color="#FFD700" />
              <Text style={styles.benefitText}>Track your progress & streaks</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="people" size={20} color="#FFD700" />
              <Text style={styles.benefitText}>Connect with the community</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="heart" size={20} color="#FFD700" />
              <Text style={styles.benefitText}>Like, comment & follow others</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.signUpButton}
              onPress={handleSignUp}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.signUpGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.signUpText}>Create Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Text style={styles.signInText}>I already have an account</Text>
            </TouchableOpacity>
          </View>

          {/* Continue as guest link */}
          <TouchableOpacity 
            style={styles.continueGuestButton}
            onPress={handleDismiss}
          >
            <Text style={styles.continueGuestText}>Continue browsing as guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  benefitsList: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  benefitText: {
    fontSize: 15,
    color: '#ccc',
    marginLeft: 14,
  },
  actions: {
    marginBottom: 16,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  signUpGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0c0c0c',
  },
  signInButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 12,
  },
  signInText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFD700',
  },
  continueGuestButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueGuestText: {
    fontSize: 14,
    color: '#666',
  },
});
