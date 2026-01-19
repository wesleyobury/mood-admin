import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface TermsAcceptanceModalProps {
  visible: boolean;
  onAccept: () => Promise<void>;
  isLoading?: boolean;
}

export default function TermsAcceptanceModal({ 
  visible, 
  onAccept, 
  isLoading = false 
}: TermsAcceptanceModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    if (!agreed || submitting) return;
    
    setSubmitting(true);
    try {
      await onAccept();
    } catch (error) {
      console.error('Error accepting terms:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openTermsOfService = () => {
    router.push('/terms-of-service');
  };

  const openCommunityGuidelines = () => {
    // Open the same terms page which contains community guidelines
    router.push('/terms-of-service');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      // Cannot be dismissed - no onRequestClose
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="shield-checkmark" size={40} color="#FFD700" />
            <Text style={styles.title}>Terms of Service</Text>
            <Text style={styles.subtitle}>Please review and accept to continue</Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {/* Zero Tolerance Notice - CRITICAL FOR APP STORE */}
            <View style={styles.zeroToleranceBox}>
              <View style={styles.zeroToleranceHeader}>
                <Ionicons name="shield-checkmark" size={24} color="#FFD700" />
                <Text style={styles.zeroToleranceTitle}>Zero Tolerance Policy</Text>
              </View>
              <Text style={styles.zeroToleranceText}>
                We have zero tolerance for objectionable content or abusive users.
              </Text>
              <Text style={styles.zeroToleranceSubtext}>
                Violations will result in immediate account termination and may be reported to authorities.
              </Text>
            </View>

            {/* Agreement Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>By accepting, you agree to:</Text>
              
              <View style={styles.bulletPoint}>
                <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
                <Text style={styles.bulletText}>
                  Not post offensive, abusive, or inappropriate content
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
                <Text style={styles.bulletText}>
                  Not harass, bully, or threaten other users
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
                <Text style={styles.bulletText}>
                  Not share sexually explicit or pornographic material
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
                <Text style={styles.bulletText}>
                  Not promote hate speech, violence, or illegal activities
                </Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
                <Text style={styles.bulletText}>
                  Consult a healthcare professional before beginning any fitness program
                </Text>
              </View>
            </View>

            {/* Links to Full Documents */}
            <View style={styles.linksSection}>
              <TouchableOpacity style={styles.linkButton} onPress={openTermsOfService}>
                <Ionicons name="document-text-outline" size={18} color="#FFD700" />
                <Text style={styles.linkText}>Read Full Terms of Service</Text>
                <Ionicons name="chevron-forward" size={16} color="#888" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.linkButton} onPress={openCommunityGuidelines}>
                <Ionicons name="people-outline" size={18} color="#FFD700" />
                <Text style={styles.linkText}>Community Guidelines</Text>
                <Ionicons name="chevron-forward" size={16} color="#888" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Checkbox Agreement */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Ionicons name="checkmark" size={16} color="#000" />}
            </View>
            <Text style={styles.checkboxLabel}>
              I have read and agree to the{' '}
              <Text style={styles.linkInline} onPress={openTermsOfService}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text style={styles.linkInline} onPress={openCommunityGuidelines}>
                Community Guidelines
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Accept Button */}
          <TouchableOpacity
            style={[
              styles.acceptButton,
              (!agreed || submitting) && styles.acceptButtonDisabled
            ]}
            onPress={handleAccept}
            disabled={!agreed || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text style={styles.acceptButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Notice */}
          <Text style={styles.notice}>
            You must accept to use social features
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  contentScroll: {
    maxHeight: 280,
  },
  zeroToleranceBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  zeroToleranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  zeroToleranceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
  },
  zeroToleranceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 4,
  },
  zeroToleranceSubtext: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  summarySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#ccc',
    lineHeight: 18,
  },
  linksSection: {
    marginBottom: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: '#ccc',
    lineHeight: 20,
  },
  linkInline: {
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
  acceptButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: '#444',
    opacity: 0.7,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  notice: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
});
