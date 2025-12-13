import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useAuth } from '../contexts/AuthContext';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
const SUPPORT_EMAIL = 'wesleyogsbury@gmail.com';

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token, logout, user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleContactSupport = async () => {
    const subject = encodeURIComponent('Support request - MOOD');
    const body = encodeURIComponent(`Hi,\n\nI need help with:\n\n\n---\nUser: ${user?.username || 'Unknown'}\nApp Version: 1.0.0`);
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    
    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert(
          'Contact Support',
          `Please email us at:\n${SUPPORT_EMAIL}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Contact Support',
        `Please email us at:\n${SUPPORT_EMAIL}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert(
          'Account Deleted',
          'Your account has been successfully deleted.',
          [
            {
              text: 'OK',
              onPress: () => {
                logout();
                router.replace('/');
              },
            },
          ]
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('Error', errorData.detail || 'Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      Alert.alert('Error', 'Failed to delete account. Please check your connection and try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 16 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => setShowTerms(true)}
          >
            <View style={styles.settingsItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="document-text-outline" size={22} color="#fff" />
              </View>
              <Text style={styles.settingsItemText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleContactSupport}
          >
            <View style={styles.settingsItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={22} color="#fff" />
              </View>
              <Text style={styles.settingsItemText}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={[styles.settingsItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
            disabled={isDeleting}
          >
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, styles.dangerIconContainer]}>
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FF4444" />
                ) : (
                  <Ionicons name="trash-outline" size={22} color="#FF4444" />
                )}
              </View>
              <Text style={styles.dangerText}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FF4444" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Terms of Service Modal */}
      <Modal
        visible={showTerms}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTerms(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowTerms(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Terms of Service</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.termsContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.termsLastUpdated}>Last Updated: December 2024</Text>
            
            <Text style={styles.termsHeading}>1. Acceptance of Terms</Text>
            <Text style={styles.termsText}>
              By accessing and using this fitness application ("App"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the App.
            </Text>

            <Text style={styles.termsHeading}>2. Description of Service</Text>
            <Text style={styles.termsText}>
              The App provides fitness tracking, workout planning, and social features designed to help users achieve their health and fitness goals. Features include workout logging, progress tracking, social sharing, and personalized workout recommendations.
            </Text>

            <Text style={styles.termsHeading}>3. User Accounts</Text>
            <Text style={styles.termsText}>
              To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to provide accurate and complete information when creating your account.
            </Text>

            <Text style={styles.termsHeading}>4. User Content</Text>
            <Text style={styles.termsText}>
              You retain ownership of content you post through the App. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with the App's services.
            </Text>

            <Text style={styles.termsHeading}>5. Acceptable Use</Text>
            <Text style={styles.termsText}>
              You agree not to:{'\n'}
              • Post harmful, offensive, or inappropriate content{'\n'}
              • Harass, abuse, or harm other users{'\n'}
              • Attempt to gain unauthorized access to the App{'\n'}
              • Use the App for any illegal purposes{'\n'}
              • Interfere with the proper functioning of the App
            </Text>

            <Text style={styles.termsHeading}>6. Health Disclaimer</Text>
            <Text style={styles.termsText}>
              The App is for informational purposes only and is not intended as medical advice. Always consult with a qualified healthcare professional before starting any exercise program. You use the App and perform any exercises at your own risk.
            </Text>

            <Text style={styles.termsHeading}>7. Privacy</Text>
            <Text style={styles.termsText}>
              Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy. By using the App, you consent to our collection and use of data as described in the Privacy Policy.
            </Text>

            <Text style={styles.termsHeading}>8. Intellectual Property</Text>
            <Text style={styles.termsText}>
              All content, features, and functionality of the App, including but not limited to text, graphics, logos, and software, are owned by us and are protected by intellectual property laws.
            </Text>

            <Text style={styles.termsHeading}>9. Termination</Text>
            <Text style={styles.termsText}>
              We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason at our discretion. You may also delete your account at any time through the App settings.
            </Text>

            <Text style={styles.termsHeading}>10. Limitation of Liability</Text>
            <Text style={styles.termsText}>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the App.
            </Text>

            <Text style={styles.termsHeading}>11. Changes to Terms</Text>
            <Text style={styles.termsText}>
              We may update these terms from time to time. We will notify users of any material changes. Your continued use of the App after changes constitutes acceptance of the new terms.
            </Text>

            <Text style={styles.termsHeading}>12. Contact</Text>
            <Text style={styles.termsText}>
              If you have questions about these Terms of Service, please contact us at {SUPPORT_EMAIL}.
            </Text>

            <View style={styles.termsFooter} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  dangerItem: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
  },
  dangerIconContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
  },
  dangerText: {
    fontSize: 16,
    color: '#FF4444',
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  appVersion: {
    fontSize: 13,
    color: '#666',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  termsContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  termsLastUpdated: {
    fontSize: 13,
    color: '#888',
    marginTop: 20,
    marginBottom: 24,
  },
  termsHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  termsText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  termsFooter: {
    height: 40,
  },
});
