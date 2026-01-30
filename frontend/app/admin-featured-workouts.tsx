/**
 * Featured Workouts Admin Editor
 * 
 * Admin-only screen to manage featured workouts:
 * - View/reorder featured carousel order
 * - Create/edit/delete featured workouts
 * - Publish changes to featured_config
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FeaturedWorkout {
  _id: string;
  title: string;
  mood: string;
  duration?: string;
  badge?: string;
  heroImageUrl?: string;
  difficulty?: string;
  exercises: any[];
  created_at?: string;
}

interface FeaturedConfig {
  featuredWorkoutIds: string[];
  ttlHours: number;
  updatedAt?: string;
}

// Mood options for workout creation
const MOOD_OPTIONS = [
  'Sweat / Burn Fat',
  'Muscle Gainer',
  'Build Explosion',
  'Calisthenics',
  'Get Outside',
  "I'm Feeling Lazy",
];

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Beginner–Intermediate'];
const BADGE_OPTIONS = ['Top pick', 'Trending', 'Popular', 'Staff pick', 'New', 'Intense'];

export default function FeaturedWorkoutsEditor() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<FeaturedConfig>({ featuredWorkoutIds: [], ttlHours: 12 });
  const [allWorkouts, setAllWorkouts] = useState<FeaturedWorkout[]>([]);
  const [featuredWorkouts, setFeaturedWorkouts] = useState<FeaturedWorkout[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Modal states
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  const [showAddToFeatured, setShowAddToFeatured] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<FeaturedWorkout | null>(null);
  
  // Workout builder form
  const [formTitle, setFormTitle] = useState('');
  const [formMood, setFormMood] = useState(MOOD_OPTIONS[0]);
  const [formDuration, setFormDuration] = useState('30-40 min');
  const [formBadge, setFormBadge] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('Intermediate');
  const [formHeroImage, setFormHeroImage] = useState('');
  const [formExercises, setFormExercises] = useState<any[]>([]);
  
  // Validation errors
  const [errors, setErrors] = useState<string[]>([]);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      // Fetch config
      const configRes = await fetch(`${API_URL}/api/featured/config`);
      const configData = await configRes.json();
      setConfig(configData);
      
      // Fetch all workouts (admin only)
      const workoutsRes = await fetch(`${API_URL}/api/featured/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (workoutsRes.status === 403) {
        Alert.alert('Access Denied', 'You must be an admin to access this page.');
        router.back();
        return;
      }
      
      const workoutsData = await workoutsRes.json();
      setAllWorkouts(workoutsData.workouts || []);
      
      // Build featured list in order
      const featuredIds = configData.featuredWorkoutIds || [];
      const workoutMap = new Map((workoutsData.workouts || []).map((w: FeaturedWorkout) => [w._id, w]));
      const orderedFeatured = featuredIds
        .map((id: string) => workoutMap.get(id))
        .filter(Boolean) as FeaturedWorkout[];
      setFeaturedWorkouts(orderedFeatured);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load featured workouts data');
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Validate before publish
  const validateConfig = (): string[] => {
    const validationErrors: string[] = [];
    
    if (featuredWorkouts.length === 0) {
      validationErrors.push('Featured list cannot be empty');
    }
    
    featuredWorkouts.forEach((workout, index) => {
      if (!workout.exercises || workout.exercises.length === 0) {
        validationErrors.push(`"${workout.title}" has no exercises`);
      }
    });
    
    return validationErrors;
  };

  // Publish featured config
  const handlePublish = async () => {
    const validationErrors = validateConfig();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      Alert.alert(
        'Validation Failed',
        validationErrors.join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }
    
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/featured/config`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featuredWorkoutIds: featuredWorkouts.map(w => w._id),
          ttlHours: config.ttlHours,
        }),
      });
      
      if (response.ok) {
        setHasChanges(false);
        setErrors([]);
        Alert.alert('Success', 'Featured workouts published successfully!');
        fetchData();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Failed to publish');
      }
    } catch (error) {
      console.error('Error publishing:', error);
      Alert.alert('Error', 'Failed to publish featured workouts');
    } finally {
      setSaving(false);
    }
  };

  // Reorder featured workouts
  const handleDragEnd = ({ data }: { data: FeaturedWorkout[] }) => {
    setFeaturedWorkouts(data);
    setHasChanges(true);
  };

  // Remove from featured
  const handleRemoveFromFeatured = (workoutId: string) => {
    Alert.alert(
      'Remove from Featured',
      'This workout will be removed from the featured carousel but not deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFeaturedWorkouts(prev => prev.filter(w => w._id !== workoutId));
            setHasChanges(true);
          },
        },
      ]
    );
  };

  // Add to featured
  const handleAddToFeatured = (workout: FeaturedWorkout) => {
    if (featuredWorkouts.find(w => w._id === workout._id)) {
      Alert.alert('Already Featured', 'This workout is already in the featured list.');
      return;
    }
    setFeaturedWorkouts(prev => [...prev, workout]);
    setHasChanges(true);
    setShowAddToFeatured(false);
  };

  // Delete workout entirely
  const handleDeleteWorkout = async (workoutId: string) => {
    Alert.alert(
      'Delete Workout',
      'This will permanently delete the workout. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/featured/workouts/${workoutId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              
              if (response.ok) {
                fetchData();
                Alert.alert('Success', 'Workout deleted');
              } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.detail || 'Failed to delete');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  // Open workout builder for new workout
  const openNewWorkoutBuilder = () => {
    setEditingWorkout(null);
    setFormTitle('');
    setFormMood(MOOD_OPTIONS[0]);
    setFormDuration('30-40 min');
    setFormBadge('');
    setFormDifficulty('Intermediate');
    setFormHeroImage('');
    setFormExercises([{
      name: '',
      equipment: '',
      description: '',
      battlePlan: '',
      duration: '10 min',
      imageUrl: '',
      intensityReason: '',
      difficulty: 'intermediate',
      workoutType: '',
      moodCard: '',
      moodTips: [],
    }]);
    setShowWorkoutBuilder(true);
  };

  // Open workout builder for editing
  const openEditWorkout = (workout: FeaturedWorkout) => {
    setEditingWorkout(workout);
    setFormTitle(workout.title);
    setFormMood(workout.mood);
    setFormDuration(workout.duration || '30-40 min');
    setFormBadge(workout.badge || '');
    setFormDifficulty(workout.difficulty || 'Intermediate');
    setFormHeroImage(workout.heroImageUrl || '');
    setFormExercises(workout.exercises.length > 0 ? workout.exercises : [{
      name: '',
      equipment: '',
      description: '',
      battlePlan: '',
      duration: '10 min',
      imageUrl: '',
      intensityReason: '',
      difficulty: 'intermediate',
      workoutType: '',
      moodCard: '',
      moodTips: [],
    }]);
    setShowWorkoutBuilder(true);
  };

  // Save workout
  const handleSaveWorkout = async () => {
    if (!formTitle.trim()) {
      Alert.alert('Error', 'Please enter a workout title');
      return;
    }
    
    if (formExercises.length === 0 || !formExercises[0].name) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }
    
    setSaving(true);
    try {
      const workoutData = {
        title: formTitle,
        mood: formMood,
        duration: formDuration,
        badge: formBadge || undefined,
        difficulty: formDifficulty,
        heroImageUrl: formHeroImage || undefined,
        exercises: formExercises.filter(ex => ex.name).map((ex, index) => ({
          ...ex,
          exerciseId: ex.exerciseId || '',
          order: index,
          moodCard: formMood,
          workoutType: `${formMood} - ${formTitle}`,
        })),
      };
      
      let response;
      if (editingWorkout) {
        response = await fetch(`${API_URL}/api/featured/workouts/${editingWorkout._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workoutData),
        });
      } else {
        response = await fetch(`${API_URL}/api/featured/workouts`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workoutData),
        });
      }
      
      if (response.ok) {
        setShowWorkoutBuilder(false);
        fetchData();
        Alert.alert('Success', editingWorkout ? 'Workout updated' : 'Workout created');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Failed to save workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout');
    } finally {
      setSaving(false);
    }
  };

  // Add exercise to form
  const addExerciseToForm = () => {
    setFormExercises(prev => [...prev, {
      name: '',
      equipment: '',
      description: '',
      battlePlan: '',
      duration: '10 min',
      imageUrl: '',
      intensityReason: '',
      difficulty: 'intermediate',
      workoutType: '',
      moodCard: '',
      moodTips: [],
    }]);
  };

  // Update exercise in form
  const updateFormExercise = (index: number, field: string, value: string) => {
    setFormExercises(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Remove exercise from form
  const removeFormExercise = (index: number) => {
    if (formExercises.length <= 1) {
      Alert.alert('Error', 'Workout must have at least one exercise');
      return;
    }
    setFormExercises(prev => prev.filter((_, i) => i !== index));
  };

  // Render featured workout item (draggable)
  const renderFeaturedItem = ({ item, drag, isActive }: RenderItemParams<FeaturedWorkout>) => (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.featuredItem,
          isActive && styles.featuredItemActive,
        ]}
      >
        <View style={styles.dragHandle}>
          <Ionicons name="reorder-three" size={24} color="#666" />
        </View>
        
        <View style={styles.featuredItemContent}>
          <Text style={styles.featuredItemTitle}>{item.mood} - {item.title}</Text>
          <Text style={styles.featuredItemMeta}>
            {item.exercises?.length || 0} exercises • {item.duration || 'No duration'}
          </Text>
          {item.badge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.featuredItemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditWorkout(item)}
          >
            <Ionicons name="create-outline" size={20} color="#4A90D9" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRemoveFromFeatured(item._id)}
          >
            <Ionicons name="remove-circle-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  // Render loading
  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Featured Workouts</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90D9" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Featured Workouts</Text>
          <TouchableOpacity
            onPress={handlePublish}
            disabled={!hasChanges || saving}
            style={[
              styles.publishButton,
              (!hasChanges || saving) && styles.publishButtonDisabled,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.publishButtonText}>Publish</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <View style={styles.errorsContainer}>
            {errors.map((error, index) => (
              <Text key={index} style={styles.errorText}>• {error}</Text>
            ))}
          </View>
        )}

        {/* Changes indicator */}
        {hasChanges && (
          <View style={styles.changesIndicator}>
            <Ionicons name="alert-circle" size={16} color="#FFD700" />
            <Text style={styles.changesText}>Unsaved changes</Text>
          </View>
        )}

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Featured Carousel Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Carousel Order</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddToFeatured(true)}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.sectionHint}>Long press and drag to reorder</Text>
            
            {featuredWorkouts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="albums-outline" size={48} color="#666" />
                <Text style={styles.emptyStateText}>No featured workouts</Text>
                <Text style={styles.emptyStateHint}>Add workouts to the featured carousel</Text>
              </View>
            ) : (
              <DraggableFlatList
                data={featuredWorkouts}
                onDragEnd={handleDragEnd}
                keyExtractor={(item) => item._id}
                renderItem={renderFeaturedItem}
                scrollEnabled={false}
              />
            )}
          </View>

          {/* All Workouts Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Workouts ({allWorkouts.length})</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={openNewWorkoutBuilder}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Create New</Text>
              </TouchableOpacity>
            </View>
            
            {allWorkouts.map((workout) => (
              <View key={workout._id} style={styles.workoutListItem}>
                <View style={styles.workoutListContent}>
                  <Text style={styles.workoutListTitle}>{workout.mood} - {workout.title}</Text>
                  <Text style={styles.workoutListMeta}>
                    {workout.exercises?.length || 0} exercises • {workout.duration || 'No duration'}
                  </Text>
                </View>
                
                <View style={styles.workoutListActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditWorkout(workout)}
                  >
                    <Ionicons name="create-outline" size={20} color="#4A90D9" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteWorkout(workout._id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Add to Featured Modal */}
        <Modal
          visible={showAddToFeatured}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { paddingTop: Platform.OS === 'ios' ? 20 : 0 }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddToFeatured(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add to Featured</Text>
              <View style={{ width: 60 }} />
            </View>
            
            <ScrollView style={styles.modalContent}>
              {allWorkouts
                .filter(w => !featuredWorkouts.find(f => f._id === w._id))
                .map((workout) => (
                  <TouchableOpacity
                    key={workout._id}
                    style={styles.selectableWorkout}
                    onPress={() => handleAddToFeatured(workout)}
                  >
                    <View style={styles.selectableWorkoutContent}>
                      <Text style={styles.selectableWorkoutTitle}>
                        {workout.mood} - {workout.title}
                      </Text>
                      <Text style={styles.selectableWorkoutMeta}>
                        {workout.exercises?.length || 0} exercises
                      </Text>
                    </View>
                    <Ionicons name="add-circle-outline" size={24} color="#4A90D9" />
                  </TouchableOpacity>
                ))}
              
              {allWorkouts.filter(w => !featuredWorkouts.find(f => f._id === w._id)).length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>All workouts are already featured</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Modal>

        {/* Workout Builder Modal */}
        <Modal
          visible={showWorkoutBuilder}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowWorkoutBuilder(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingWorkout ? 'Edit Workout' : 'Create Workout'}
              </Text>
              <TouchableOpacity onPress={handleSaveWorkout} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color="#4A90D9" />
                ) : (
                  <Text style={styles.modalSave}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} keyboardShouldPersistTaps="handled">
              {/* Title */}
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.textInput}
                value={formTitle}
                onChangeText={setFormTitle}
                placeholder="e.g., Back & Bis Volume"
                placeholderTextColor="#666"
              />
              
              {/* Mood */}
              <Text style={styles.inputLabel}>Mood Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {MOOD_OPTIONS.map((mood) => (
                  <TouchableOpacity
                    key={mood}
                    style={[styles.chip, formMood === mood && styles.chipSelected]}
                    onPress={() => setFormMood(mood)}
                  >
                    <Text style={[styles.chipText, formMood === mood && styles.chipTextSelected]}>
                      {mood}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Duration */}
              <Text style={styles.inputLabel}>Duration</Text>
              <TextInput
                style={styles.textInput}
                value={formDuration}
                onChangeText={setFormDuration}
                placeholder="e.g., 30-40 min"
                placeholderTextColor="#666"
              />
              
              {/* Badge */}
              <Text style={styles.inputLabel}>Badge (optional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                <TouchableOpacity
                  style={[styles.chip, !formBadge && styles.chipSelected]}
                  onPress={() => setFormBadge('')}
                >
                  <Text style={[styles.chipText, !formBadge && styles.chipTextSelected]}>None</Text>
                </TouchableOpacity>
                {BADGE_OPTIONS.map((badge) => (
                  <TouchableOpacity
                    key={badge}
                    style={[styles.chip, formBadge === badge && styles.chipSelected]}
                    onPress={() => setFormBadge(badge)}
                  >
                    <Text style={[styles.chipText, formBadge === badge && styles.chipTextSelected]}>
                      {badge}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Difficulty */}
              <Text style={styles.inputLabel}>Difficulty</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {DIFFICULTY_OPTIONS.map((diff) => (
                  <TouchableOpacity
                    key={diff}
                    style={[styles.chip, formDifficulty === diff && styles.chipSelected]}
                    onPress={() => setFormDifficulty(diff)}
                  >
                    <Text style={[styles.chipText, formDifficulty === diff && styles.chipTextSelected]}>
                      {diff}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Hero Image URL */}
              <Text style={styles.inputLabel}>Hero Image URL (optional)</Text>
              <TextInput
                style={styles.textInput}
                value={formHeroImage}
                onChangeText={setFormHeroImage}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
              
              {/* Exercises */}
              <View style={styles.exercisesHeader}>
                <Text style={styles.inputLabel}>Exercises *</Text>
                <TouchableOpacity style={styles.addExerciseButton} onPress={addExerciseToForm}>
                  <Ionicons name="add" size={18} color="#4A90D9" />
                  <Text style={styles.addExerciseText}>Add Exercise</Text>
                </TouchableOpacity>
              </View>
              
              {formExercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseForm}>
                  <View style={styles.exerciseFormHeader}>
                    <Text style={styles.exerciseFormTitle}>Exercise {index + 1}</Text>
                    {formExercises.length > 1 && (
                      <TouchableOpacity onPress={() => removeFormExercise(index)}>
                        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <TextInput
                    style={styles.exerciseInput}
                    value={exercise.name}
                    onChangeText={(v) => updateFormExercise(index, 'name', v)}
                    placeholder="Exercise Name *"
                    placeholderTextColor="#666"
                  />
                  
                  <TextInput
                    style={styles.exerciseInput}
                    value={exercise.equipment}
                    onChangeText={(v) => updateFormExercise(index, 'equipment', v)}
                    placeholder="Equipment"
                    placeholderTextColor="#666"
                  />
                  
                  <TextInput
                    style={[styles.exerciseInput, styles.multilineInput]}
                    value={exercise.description}
                    onChangeText={(v) => updateFormExercise(index, 'description', v)}
                    placeholder="Description"
                    placeholderTextColor="#666"
                    multiline
                  />
                  
                  <TextInput
                    style={[styles.exerciseInput, styles.multilineInput]}
                    value={exercise.battlePlan}
                    onChangeText={(v) => updateFormExercise(index, 'battlePlan', v)}
                    placeholder="Battle Plan / Instructions"
                    placeholderTextColor="#666"
                    multiline
                  />
                  
                  <View style={styles.exerciseRow}>
                    <TextInput
                      style={[styles.exerciseInput, { flex: 1, marginRight: 8 }]}
                      value={exercise.duration}
                      onChangeText={(v) => updateFormExercise(index, 'duration', v)}
                      placeholder="Duration"
                      placeholderTextColor="#666"
                    />
                    <TextInput
                      style={[styles.exerciseInput, { flex: 1 }]}
                      value={exercise.difficulty}
                      onChangeText={(v) => updateFormExercise(index, 'difficulty', v)}
                      placeholder="Difficulty"
                      placeholderTextColor="#666"
                    />
                  </View>
                  
                  <TextInput
                    style={styles.exerciseInput}
                    value={exercise.imageUrl}
                    onChangeText={(v) => updateFormExercise(index, 'imageUrl', v)}
                    placeholder="Image URL"
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                  />
                  
                  <TextInput
                    style={[styles.exerciseInput, styles.multilineInput]}
                    value={exercise.intensityReason}
                    onChangeText={(v) => updateFormExercise(index, 'intensityReason', v)}
                    placeholder="Intensity Reason"
                    placeholderTextColor="#666"
                    multiline
                  />
                </View>
              ))}
              
              <View style={{ height: 100 }} />
            </ScrollView>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  publishButton: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: '#333',
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    marginTop: 12,
  },
  errorsContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
    padding: 12,
    margin: 16,
    marginBottom: 0,
    borderRadius: 4,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginBottom: 4,
  },
  changesIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  changesText: {
    color: '#FFD700',
    fontSize: 13,
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  sectionHint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90D9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 15,
    marginTop: 12,
  },
  emptyStateHint: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },
  featuredItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  featuredItemActive: {
    backgroundColor: '#222',
    borderColor: '#4A90D9',
  },
  dragHandle: {
    paddingRight: 12,
  },
  featuredItemContent: {
    flex: 1,
  },
  featuredItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  featuredItemMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  badgeContainer: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  featuredItemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
  workoutListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  workoutListContent: {
    flex: 1,
  },
  workoutListTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  workoutListMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  workoutListActions: {
    flexDirection: 'row',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  modalCancel: {
    fontSize: 16,
    color: '#888',
  },
  modalSave: {
    fontSize: 16,
    color: '#4A90D9',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  selectableWorkout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectableWorkoutContent: {
    flex: 1,
  },
  selectableWorkoutTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  selectableWorkoutMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  
  // Form styles
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  chipSelected: {
    backgroundColor: '#4A90D9',
    borderColor: '#4A90D9',
  },
  chipText: {
    color: '#999',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addExerciseText: {
    color: '#4A90D9',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  exerciseForm: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseFormTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  exerciseInput: {
    backgroundColor: '#0c0c0c',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 8,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  exerciseRow: {
    flexDirection: 'row',
  },
});
