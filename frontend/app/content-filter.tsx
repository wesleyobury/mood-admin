import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTENT_FILTER_KEY = '@mood_content_filter';

interface FilterSettings {
  enabled: boolean;
  keywords: string[];
}

export default function ContentFilterSettings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<FilterSettings>({
    enabled: false,
    keywords: [],
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(CONTENT_FILTER_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading filter settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSettings = async (newSettings: FilterSettings) => {
    setSaving(true);
    try {
      await AsyncStorage.setItem(CONTENT_FILTER_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      Alert.alert('Error", 'Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = () => {
    saveSettings({ ...settings, enabled: !settings.enabled });
  };

  const addKeyword = () => {
    const keyword = newKeyword.trim().toLowerCase();
    if (!keyword) {
      Alert.alert('Error", 'Please enter a keyword");
      return;
    }
    if (settings.keywords.includes(keyword)) {
      Alert.alert('Error", 'This keyword is already in your filter list");
      return;
    }
    saveSettings({ ...settings, keywords: [...settings.keywords, keyword] });
    setNewKeyword('');
  };

  const removeKeyword = (keyword: string) => {
    saveSettings({ 
      ...settings, 
      keywords: settings.keywords.filter(k => k !== keyword) 
    });
  };

  const clearAllKeywords = () => {
    Alert.alert(
      'Clear All Keywords',
      'Are you sure you want to remove all filter keywords?',
      [
        { text: "Cancel', style: 'cancel" },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => saveSettings({ ...settings, keywords: [] })
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 16 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Content Filter</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={32} color="#FFD700" />
          <Text style={styles.infoTitle}>Custom Content Filter</Text>
          <Text style={styles.infoText}>
            Hide posts and comments containing specific words or phrases from your feed. 
            This is in addition to the app's automatic content moderation.
          </Text>
        </View>

        {/* Enable Toggle */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleLeft}>
            <Ionicons name="filter" size={22} color="#FFD700" />
            <View>
              <Text style={styles.toggleLabel}>Enable Content Filter</Text>
              <Text style={styles.toggleSubtext}>
                {settings.enabled ? 'Filtering is active" : 'Filtering is disabled"}
              </Text>
            </View>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={toggleEnabled}
            trackColor={{ false: '#333", true: 'rgba(255,215,0,0.4)" }}
            thumbColor={settings.enabled ? '#FFD700' : '#666'}
          />
        </View>

        {/* Add Keyword Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Keyword</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter word or phrase..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={newKeyword}
              onChangeText={setNewKeyword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={addKeyword}
            />
            <TouchableOpacity 
              style={[styles.addButton, !newKeyword.trim() && styles.addButtonDisabled]}
              onPress={addKeyword}
              disabled={!newKeyword.trim()}
            >
              <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Keywords List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Your Keywords ({settings.keywords.length})
            </Text>
            {settings.keywords.length > 0 && (
              <TouchableOpacity onPress={clearAllKeywords}>
                <Text style={styles.clearAll}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          {settings.keywords.length === 0 ? (
            <View style={styles.emptyKeywords}>
              <Ionicons name="chatbubble-ellipses-outline" size={40} color="#333" />
              <Text style={styles.emptyText}>No keywords added yet</Text>
              <Text style={styles.emptySubtext}>
                Add words you want to filter from your feed
              </Text>
            </View>
          ) : (
            <View style={styles.keywordsList}>
              {settings.keywords.map((keyword, index) => (
                <View key={index} style={styles.keywordChip}>
                  <Text style={styles.keywordText}>{keyword}</Text>
                  <TouchableOpacity
                    style={styles.removeKeyword}
                    onPress={() => removeKeyword(keyword)}
                  >
                    <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.6)" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips</Text>
          <View style={styles.tip}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>Keywords are case-insensitive</Text>
          </View>
          <View style={styles.tip}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>Add phrases to filter specific content</Text>
          </View>
          <View style={styles.tip}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>Filtered content is hidden, not deleted</Text>
          </View>
        </View>

        {saving && (
          <View style={styles.savingIndicator}>
            <ActivityIndicator size="small" color="#FFD700" />
            <Text style={styles.savingText}>Saving...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  toggleSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  clearAll: {
    fontSize: 14,
    color: '#FF4444',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: 'rgba(255,215,0,0.3)',
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
    gap: 6,
  },
  keywordText: {
    color: '#fff',
    fontSize: 14,
  },
  removeKeyword: {
    padding: 2,
  },
  emptyKeywords: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  },
  tipsSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  savingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
});
