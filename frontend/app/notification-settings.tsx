import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../contexts/AuthContext';
import notificationService, { NotificationSettings } from '../utils/notifications';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  
  // Time picker states
  const [showQuietHoursStart, setShowQuietHoursStart] = useState(false);
  const [showQuietHoursEnd, setShowQuietHoursEnd] = useState(false);
  const [showDigestTime, setShowDigestTime] = useState(false);

  useEffect(() => {
    if (token) {
      notificationService.setAuthToken(token);
      loadSettings();
    }
  }, [token]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const fetchedSettings = await notificationService.getSettings();
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = useCallback(async (key: keyof NotificationSettings, value: any) => {
    if (!settings) return;
    
    // Optimistic update
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    setIsSaving(true);
    try {
      const updated = await notificationService.updateSettings({ [key]: value });
      if (!updated) {
        // Revert on failure
        setSettings(settings);
        Alert.alert('Error', 'Failed to save setting');
      }
    } catch (error) {
      setSettings(settings);
      console.error('Error updating setting:', error);
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon as any} size={18} color="#FFD700" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderToggle = (
    label: string,
    description: string,
    key: keyof NotificationSettings,
    disabled: boolean = false
  ) => (
    <View style={[styles.settingRow, disabled && styles.settingRowDisabled]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, disabled && styles.textDisabled]}>{label}</Text>
        <Text style={[styles.settingDescription, disabled && styles.textDisabled]}>{description}</Text>
      </View>
      <Switch
        value={settings?.[key] as boolean ?? false}
        onValueChange={(value) => updateSetting(key, value)}
        trackColor={{ false: '#333', true: '#FFD700' }}
        thumbColor={settings?.[key] ? '#fff' : '#888'}
        disabled={disabled || !settings}
      />
    </View>
  );

  const renderFrequencySelector = () => {
    const frequencies = [
      { value: 'daily', label: 'Daily' },
      { value: '3x_week', label: '3x/week' },
      { value: 'off', label: 'Off' },
    ];

    return (
      <View style={styles.frequencyContainer}>
        <Text style={styles.settingLabel}>Digest Frequency</Text>
        <View style={styles.frequencyButtons}>
          {frequencies.map((freq) => (
            <TouchableOpacity
              key={freq.value}
              style={[
                styles.frequencyButton,
                settings?.following_digest_frequency === freq.value && styles.frequencyButtonActive,
              ]}
              onPress={() => updateSetting('following_digest_frequency', freq.value)}
            >
              <Text
                style={[
                  styles.frequencyButtonText,
                  settings?.following_digest_frequency === freq.value && styles.frequencyButtonTextActive,
                ]}
              >
                {freq.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderTimeSelector = (
    label: string,
    value: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.timeSelector} onPress={onPress}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.timeValue}>
        <Text style={styles.timeValueText}>{value}</Text>
        <Ionicons name="chevron-forward" size={16} color="#888" />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  const masterEnabled = settings?.notifications_enabled ?? true;

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
        <Text style={styles.headerTitle}>Notifications</Text>
        {isSaving ? (
          <ActivityIndicator size="small" color="#FFD700" style={styles.savingIndicator} />
        ) : (
          <View style={styles.savingIndicator} />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Master Toggle */}
        <View style={styles.masterToggleContainer}>
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)']}
            style={styles.masterToggleGradient}
          >
            <View style={styles.masterToggleContent}>
              <View style={styles.masterToggleIcon}>
                <Ionicons 
                  name={masterEnabled ? "notifications" : "notifications-off"} 
                  size={28} 
                  color={masterEnabled ? "#FFD700" : "#666"} 
                />
              </View>
              <View style={styles.masterToggleInfo}>
                <Text style={styles.masterToggleLabel}>Push Notifications</Text>
                <Text style={styles.masterToggleDescription}>
                  {masterEnabled ? 'All notifications enabled' : 'All notifications paused'}
                </Text>
              </View>
              <Switch
                value={masterEnabled}
                onValueChange={(value) => updateSetting('notifications_enabled', value)}
                trackColor={{ false: '#333', true: '#FFD700' }}
                thumbColor={masterEnabled ? '#fff' : '#888'}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Social Notifications */}
        <View style={[styles.section, !masterEnabled && styles.sectionDisabled]}>
          {renderSectionHeader('Social', 'people-outline')}
          
          {renderToggle(
            'Follows',
            'When someone follows you',
            'follows_enabled',
            !masterEnabled
          )}
          
          {renderToggle(
            'Comments',
            'When someone comments on your post',
            'comments_enabled',
            !masterEnabled
          )}
          
          {settings?.comments_enabled && masterEnabled && (
            <View style={styles.subSetting}>
              {renderToggle(
                'Only from people I follow',
                'Limit comment notifications',
                'comments_from_following_only',
                !masterEnabled
              )}
            </View>
          )}
          
          {renderToggle(
            'Likes',
            'When someone likes your post',
            'likes_enabled',
            !masterEnabled
          )}
          
          {settings?.likes_enabled && masterEnabled && (
            <View style={styles.subSetting}>
              {renderToggle(
                'Only from people I follow',
                'Limit like notifications',
                'likes_from_following_only',
                !masterEnabled
              )}
            </View>
          )}
        </View>

        {/* Messages */}
        <View style={[styles.section, !masterEnabled && styles.sectionDisabled]}>
          {renderSectionHeader('Messages', 'chatbubble-outline')}
          
          {renderToggle(
            'Messages',
            'New direct messages',
            'messages_enabled',
            !masterEnabled
          )}
          
          {renderToggle(
            'Message Requests',
            'New message requests',
            'message_requests_enabled',
            !masterEnabled
          )}
        </View>

        {/* Workout & Content */}
        <View style={[styles.section, !masterEnabled && styles.sectionDisabled]}>
          {renderSectionHeader('Workouts & Content', 'fitness-outline')}
          
          {renderToggle(
            'Workout Reminders',
            'Scheduled workout nudges',
            'workout_reminders_enabled',
            !masterEnabled
          )}
          
          {renderToggle(
            'Featured Workouts',
            'New curated workout drops',
            'featured_workouts_enabled',
            !masterEnabled
          )}
          
          {renderToggle(
            'Featured Suggestions',
            'Motivational workout prompts',
            'featured_suggestions_enabled',
            !masterEnabled
          )}
        </View>

        {/* Activity Digest */}
        <View style={[styles.section, !masterEnabled && styles.sectionDisabled]}>
          {renderSectionHeader('Activity Digest', 'newspaper-outline')}
          
          {renderToggle(
            'Following Activity',
            'Updates from people you follow',
            'following_digest_enabled',
            !masterEnabled
          )}
          
          {settings?.following_digest_enabled && masterEnabled && (
            <View style={styles.subSetting}>
              {renderFrequencySelector()}
            </View>
          )}
        </View>

        {/* Quiet Hours */}
        <View style={[styles.section, !masterEnabled && styles.sectionDisabled]}>
          {renderSectionHeader('Quiet Hours', 'moon-outline')}
          
          {renderToggle(
            'Enable Quiet Hours',
            'Pause push notifications during set times',
            'quiet_hours_enabled',
            !masterEnabled
          )}
          
          {settings?.quiet_hours_enabled && masterEnabled && (
            <View style={styles.quietHoursConfig}>
              <View style={styles.quietHoursRow}>
                <View style={styles.quietHoursItem}>
                  <Text style={styles.quietHoursLabel}>Start</Text>
                  <TouchableOpacity 
                    style={styles.quietHoursValue}
                    onPress={() => {
                      // Simple time picker would go here
                      Alert.alert(
                        'Set Start Time',
                        'Enter quiet hours start time (e.g., 22:00)',
                        [
                          { text: '10:00 PM', onPress: () => updateSetting('quiet_hours_start', '22:00') },
                          { text: '11:00 PM', onPress: () => updateSetting('quiet_hours_start', '23:00') },
                          { text: '9:00 PM', onPress: () => updateSetting('quiet_hours_start', '21:00') },
                          { text: 'Cancel', style: 'cancel' },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.quietHoursValueText}>
                      {settings?.quiet_hours_start || '22:00'}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#888" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.quietHoursItem}>
                  <Text style={styles.quietHoursLabel}>End</Text>
                  <TouchableOpacity 
                    style={styles.quietHoursValue}
                    onPress={() => {
                      Alert.alert(
                        'Set End Time',
                        'Enter quiet hours end time (e.g., 08:00)',
                        [
                          { text: '7:00 AM', onPress: () => updateSetting('quiet_hours_end', '07:00') },
                          { text: '8:00 AM', onPress: () => updateSetting('quiet_hours_end', '08:00') },
                          { text: '9:00 AM', onPress: () => updateSetting('quiet_hours_end', '09:00') },
                          { text: 'Cancel', style: 'cancel' },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.quietHoursValueText}>
                      {settings?.quiet_hours_end || '08:00'}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#888" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.quietHoursNote}>
                Notifications will be silently saved to your inbox during quiet hours
              </Text>
            </View>
          )}
        </View>

        {/* Digest Time */}
        {settings?.following_digest_enabled && masterEnabled && (
          <View style={[styles.section, !masterEnabled && styles.sectionDisabled]}>
            {renderSectionHeader('Digest Delivery', 'time-outline')}
            
            <TouchableOpacity 
              style={styles.digestTimeSelector}
              onPress={() => {
                Alert.alert(
                  'Set Digest Time',
                  'Choose when to receive your daily digest',
                  [
                    { text: '6:00 PM', onPress: () => updateSetting('digest_time', '18:00') },
                    { text: '7:00 PM', onPress: () => updateSetting('digest_time', '19:00') },
                    { text: '8:00 PM', onPress: () => updateSetting('digest_time', '20:00') },
                    { text: '9:00 AM', onPress: () => updateSetting('digest_time', '09:00') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <View style={styles.digestTimeInfo}>
                <Text style={styles.settingLabel}>Delivery Time</Text>
                <Text style={styles.settingDescription}>When to send your digest</Text>
              </View>
              <View style={styles.digestTimeValue}>
                <Text style={styles.digestTimeText}>{settings?.digest_time || '18:00'}</Text>
                <Ionicons name="chevron-forward" size={16} color="#888" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#888',
    fontSize: 14,
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
  savingIndicator: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  masterToggleContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  masterToggleGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  masterToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  masterToggleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  masterToggleInfo: {
    flex: 1,
  },
  masterToggleLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  masterToggleDescription: {
    fontSize: 13,
    color: '#888',
  },
  section: {
    marginBottom: 24,
  },
  sectionDisabled: {
    opacity: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#888',
  },
  textDisabled: {
    color: '#555',
  },
  subSetting: {
    marginLeft: 16,
  },
  frequencyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  frequencyButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  frequencyButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888',
  },
  frequencyButtonTextActive: {
    color: '#FFD700',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  timeValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValueText: {
    fontSize: 15,
    color: '#FFD700',
    marginRight: 4,
  },
  quietHoursConfig: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  quietHoursRow: {
    flexDirection: 'row',
    gap: 16,
  },
  quietHoursItem: {
    flex: 1,
  },
  quietHoursLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quietHoursValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  quietHoursValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  quietHoursNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  digestTimeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
  },
  digestTimeInfo: {
    flex: 1,
  },
  digestTimeValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  digestTimeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFD700',
    marginRight: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});
