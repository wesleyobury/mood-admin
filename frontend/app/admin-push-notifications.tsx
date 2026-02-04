import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

export default function AdminPushNotifications() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token, user } = useAuth();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Push form state
  const [pushType, setPushType] = useState<'featured_workout' | 'featured_suggestion'>('featured_suggestion');
  const [workoutName, setWorkoutName] = useState('');
  const [workoutId, setWorkoutId] = useState('');
  const [customCopy, setCustomCopy] = useState('');
  const [sending, setSending] = useState(false);
  
  // Copy library
  const [copyLibrary, setCopyLibrary] = useState<string[]>([]);
  const [selectedCopyIndex, setSelectedCopyIndex] = useState<number | null>(null);

  useEffect(() => {
    checkAuthorization();
    fetchCopyLibrary();
  }, [token, user]);

  const checkAuthorization = async () => {
    if (!token || !user) {
      setLoading(false);
      return;
    }
    
    // Check if user is admin
    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthorized(data.is_admin === true);
      }
    } catch (error) {
      console.error('Error checking authorization:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCopyLibrary = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/copy-library`);
      if (response.ok) {
        const data = await response.json();
        setCopyLibrary(data.copy || []);
      }
    } catch (error) {
      console.error('Error fetching copy library:', error);
    }
  };

  const sendPush = async () => {
    if (pushType === 'featured_workout' && (!workoutName || !workoutId)) {
      Alert.alert('Error', 'Please enter workout name and ID');
      return;
    }

    setSending(true);
    
    try {
      const endpoint = pushType === 'featured_workout' 
        ? '/api/admin/notifications/featured-workout'
        : '/api/admin/notifications/featured-suggestion';
      
      const body = pushType === 'featured_workout'
        ? { workout_id: workoutId, workout_name: workoutName }
        : { custom_copy: customCopy || null };
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          'Success',
          `${data.notifications_sent} notifications sent!`,
          [{ text: 'OK', onPress: () => {
            setWorkoutName('');
            setWorkoutId('');
            setCustomCopy('');
            setSelectedCopyIndex(null);
          }}]
        );
      } else {
        const error = await response.json();
        Alert.alert('Error', error.detail || 'Failed to send notifications');
      }
    } catch (error) {
      console.error('Error sending push:', error);
      Alert.alert('Error', 'Failed to send notifications');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!isAuthorized) {
    return (
      <View style={[styles.container, styles.centerContent, { paddingTop: insets.top }]}>
        <Ionicons name="lock-closed" size={48} color="#666" />
        <Text style={styles.unauthorizedText}>Admin access required</Text>
        <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Push Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Push Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                pushType === 'featured_suggestion' && styles.typeButtonActive,
              ]}
              onPress={() => setPushType('featured_suggestion')}
            >
              <Ionicons 
                name="sparkles" 
                size={20} 
                color={pushType === 'featured_suggestion' ? '#0c0c0c' : '#888'} 
              />
              <Text style={[
                styles.typeButtonText,
                pushType === 'featured_suggestion' && styles.typeButtonTextActive,
              ]}>
                Featured Suggestion
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                pushType === 'featured_workout' && styles.typeButtonActive,
              ]}
              onPress={() => setPushType('featured_workout')}
            >
              <Ionicons 
                name="flash" 
                size={20} 
                color={pushType === 'featured_workout' ? '#0c0c0c' : '#888'} 
              />
              <Text style={[
                styles.typeButtonText,
                pushType === 'featured_workout' && styles.typeButtonTextActive,
              ]}>
                Featured Workout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Workout Form */}
        {pushType === 'featured_workout' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Details</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Workout Name</Text>
              <TextInput
                style={styles.input}
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="e.g., Morning HIIT Blast"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Workout ID</Text>
              <TextInput
                style={styles.input}
                value={workoutId}
                onChangeText={setWorkoutId}
                placeholder="Enter workout ID"
                placeholderTextColor="#666"
              />
            </View>
          </View>
        )}

        {/* Featured Suggestion Form */}
        {pushType === 'featured_suggestion' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Message</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Custom Copy (optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={customCopy}
                onChangeText={(text) => {
                  setCustomCopy(text);
                  setSelectedCopyIndex(null);
                }}
                placeholder="Leave empty for random"
                placeholderTextColor="#666"
                multiline
                numberOfLines={2}
              />
            </View>
            
            <Text style={styles.copyLibraryTitle}>Or select from library:</Text>
            <View style={styles.copyLibrary}>
              {copyLibrary.map((copy, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.copyItem,
                    selectedCopyIndex === index && styles.copyItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCopyIndex(index);
                    setCustomCopy(copy);
                  }}
                >
                  <Text style={[
                    styles.copyItemText,
                    selectedCopyIndex === index && styles.copyItemTextSelected,
                  ]}>
                    {copy}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={styles.previewIcon}>
                <Ionicons 
                  name={pushType === 'featured_workout' ? 'flash' : 'sparkles'} 
                  size={16} 
                  color="#FFD700" 
                />
              </View>
              <Text style={styles.previewTitle}>
                {pushType === 'featured_workout' ? 'New Featured Workout' : 'MOOD'}
              </Text>
            </View>
            <Text style={styles.previewBody}>
              {pushType === 'featured_workout' 
                ? (workoutName ? `"${workoutName}" just dropped` : '"Workout Name" just dropped')
                : (customCopy || 'Random motivational message')}
            </Text>
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendButton, sending && styles.sendButtonDisabled]}
          onPress={sendPush}
          disabled={sending}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.sendButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#0c0c0c" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#0c0c0c" />
                <Text style={styles.sendButtonText}>Send to All Users</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This will send a push notification to all users who have notifications enabled.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  unauthorizedText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonLarge: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888',
  },
  typeButtonTextActive: {
    color: '#0c0c0c',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  copyLibraryTitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
    marginTop: 8,
  },
  copyLibrary: {
    gap: 8,
  },
  copyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  copyItemSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  copyItemText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  copyItemTextSelected: {
    color: '#FFD700',
  },
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  previewBody: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    marginLeft: 38,
  },
  sendButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c0c0c',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
