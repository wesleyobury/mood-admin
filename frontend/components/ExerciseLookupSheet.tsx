import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.85;

// Types
export interface Exercise {
  _id: string;
  name: string;
  aliases: string[];
  equipment: string[];
  thumbnail_url: string;
  video_url: string;
  cues: string[];
  mistakes?: string[];
}

interface ExerciseLookupSheetProps {
  visible: boolean;
  onClose: () => void;
}

// Popular exercises (default chips)
const POPULAR_EXERCISES = [
  'Squat',
  'Bench',
  'Row',
  'Deadlift',
  'Lunge',
  'Lat Pulldown',
];

const RECENT_LOOKUPS_KEY = '@exercise_recent_lookups';
const MAX_RECENT = 6;

export default function ExerciseLookupSheet({ visible, onClose }: ExerciseLookupSheetProps) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [recentLookups, setRecentLookups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [videoError, setVideoError] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<Video>(null);
  
  const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

  // Load recent lookups from storage
  useEffect(() => {
    loadRecentLookups();
  }, []);

  // Focus search input when sheet opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else {
      setSearchQuery('');
      setExercises([]);
      setSelectedExercise(null);
    }
  }, [visible]);

  const loadRecentLookups = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_LOOKUPS_KEY);
      if (stored) {
        setRecentLookups(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent lookups:', error);
    }
  };

  const saveRecentLookup = async (exerciseName: string) => {
    try {
      const updated = [exerciseName, ...recentLookups.filter(r => r !== exerciseName)].slice(0, MAX_RECENT);
      setRecentLookups(updated);
      await AsyncStorage.setItem(RECENT_LOOKUPS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent lookup:', error);
    }
  };

  // Debounced search
  const searchExercises = useCallback(async (query: string) => {
    if (!query.trim()) {
      setExercises([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/exercises/search?q=${encodeURIComponent(query)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setExercises(data.exercises || []);
      }
    } catch (error) {
      console.error('Error searching exercises:', error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search (150ms)
    searchTimeoutRef.current = setTimeout(() => {
      searchExercises(text);
    }, 150);
  };

  const handleChipPress = (term: string) => {
    setSearchQuery(term);
    searchExercises(term);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setVideoError(false);
    saveRecentLookup(exercise.name);
    Keyboard.dismiss();
  };

  const handleBackToList = () => {
    setSelectedExercise(null);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleRetryVideo = async () => {
    setVideoError(false);
    if (videoRef.current) {
      try {
        await videoRef.current.playAsync();
      } catch (e) {
        setVideoError(true);
      }
    }
  };

  // Render exercise detail view
  const renderExerciseDetail = () => {
    if (!selectedExercise) return null;

    return (
      <View style={styles.detailContainer}>
        {/* Back button */}
        <TouchableOpacity style={styles.detailBackButton} onPress={handleBackToList}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
          <Text style={styles.detailBackText}>Back</Text>
        </TouchableOpacity>

        {/* Video Player */}
        <View style={styles.videoContainer}>
          {videoError ? (
            <TouchableOpacity style={styles.videoErrorContainer} onPress={handleRetryVideo}>
              <Image
                source={{ uri: selectedExercise.thumbnail_url }}
                style={styles.videoThumbnail}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <View style={styles.videoErrorOverlay}>
                <Ionicons name="refresh" size={32} color="#FFD700" />
                <Text style={styles.videoErrorText}>Tap to retry</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: selectedExercise.video_url }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              isLooping
              isMuted
              shouldPlay
              onError={handleVideoError}
              posterSource={{ uri: selectedExercise.thumbnail_url }}
              usePoster
            />
          )}
        </View>

        {/* Exercise Info */}
        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.exerciseTitle}>{selectedExercise.name}</Text>
          
          {/* Equipment */}
          {selectedExercise.equipment.length > 0 && (
            <View style={styles.equipmentRow}>
              {selectedExercise.equipment.map((eq, idx) => (
                <View key={idx} style={styles.equipmentChip}>
                  <Ionicons name="barbell-outline" size={12} color="#FFD700" />
                  <Text style={styles.equipmentText}>{eq}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Cues */}
          {selectedExercise.cues.length > 0 && (
            <View style={styles.cuesContainer}>
              <Text style={styles.sectionTitle}>Key Cues</Text>
              {selectedExercise.cues.map((cue, idx) => (
                <View key={idx} style={styles.cueItem}>
                  <View style={styles.cueNumber}>
                    <Text style={styles.cueNumberText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.cueText}>{cue}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Common Mistakes */}
          {selectedExercise.mistakes && selectedExercise.mistakes.length > 0 && (
            <View style={styles.mistakesContainer}>
              <Text style={styles.sectionTitle}>Common Mistakes</Text>
              {selectedExercise.mistakes.map((mistake, idx) => (
                <View key={idx} style={styles.mistakeItem}>
                  <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                  <Text style={styles.mistakeText}>{mistake}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  // Render exercise list item
  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseItem}
      onPress={() => handleExerciseSelect(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.thumbnail_url }}
        style={styles.exerciseThumbnail}
        contentFit="cover"
        cachePolicy="memory-disk"
        placeholder={require('../assets/images/icon.png')}
        transition={200}
      />
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        {item.equipment.length > 0 && (
          <Text style={styles.exerciseEquipment}>
            {item.equipment.slice(0, 2).join(' • ')}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
    </TouchableOpacity>
  );

  // Render chip
  const renderChip = (text: string, isRecent: boolean = false) => (
    <TouchableOpacity
      key={text}
      style={[
        styles.chip,
        searchQuery.toLowerCase() === text.toLowerCase() && styles.chipActive,
      ]}
      onPress={() => handleChipPress(text)}
      activeOpacity={0.7}
    >
      {isRecent && <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.6)" style={styles.chipIcon} />}
      <Text style={[
        styles.chipText,
        searchQuery.toLowerCase() === text.toLowerCase() && styles.chipTextActive,
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { paddingTop: insets.top }]}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {selectedExercise ? (
          renderExerciseDetail()
        ) : (
          <>
            {/* Search Header */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder="Find visuals"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => handleSearchChange('')}>
                    <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Recent Lookups */}
            {recentLookups.length > 0 && searchQuery.length === 0 && (
              <View style={styles.chipsSection}>
                <Text style={styles.chipsSectionTitle}>Recent</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                  {recentLookups.map(term => renderChip(term, true))}
                </ScrollView>
              </View>
            )}

            {/* Popular */}
            {searchQuery.length === 0 && (
              <View style={styles.chipsSection}>
                <Text style={styles.chipsSectionTitle}>Popular</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                  {POPULAR_EXERCISES.map(term => renderChip(term))}
                </ScrollView>
              </View>
            )}

            {/* Results */}
            <View style={styles.resultsContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFD700" />
                </View>
              ) : exercises.length > 0 ? (
                <FlatList
                  data={exercises}
                  renderItem={renderExerciseItem}
                  keyExtractor={(item) => item._id}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.resultsList}
                />
              ) : searchQuery.length > 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyText}>No exercises found</Text>
                </View>
              ) : null}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SHEET_HEIGHT,
    paddingHorizontal: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
    marginRight: 8,
  },
  chipsSection: {
    marginBottom: 16,
  },
  chipsSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderColor: '#FFD700',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFD700',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  exerciseThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 14,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  exerciseEquipment: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  // Detail View Styles
  detailContainer: {
    flex: 1,
  },
  detailBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  detailBackText: {
    fontSize: 16,
    color: '#FFD700',
    marginLeft: 4,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 20,
    maxHeight: 400,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoErrorContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoErrorText: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 8,
  },
  detailContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  equipmentText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  cuesContainer: {
    marginBottom: 24,
  },
  cueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cueNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,215,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cueNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  cueText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  mistakesContainer: {
    marginBottom: 24,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  mistakeText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
});
