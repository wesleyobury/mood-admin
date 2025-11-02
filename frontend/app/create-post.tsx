import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { captureRef } from 'react-native-view-shot';
import WorkoutStatsCard from '../components/WorkoutStatsCard';

const API_URL = '';

interface WorkoutStats {
  workouts: Array<{
    workoutName: string;
    equipment: string;
    duration: string;
    difficulty: string;
  }>;
  totalDuration: number;
  completedAt: string;
}

export default function CreatePost() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [caption, setCaption] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [hasStatsCard, setHasStatsCard] = useState(false);
  const statsCardRef = useRef(null);

  // Load auth token and workout stats
  useEffect(() => {
    loadMockAuth();
    
    // Check if we have workout stats from completed workout
    if (params.workoutStats) {
      try {
        const stats = JSON.parse(params.workoutStats as string);
        setWorkoutStats(stats);
        setHasStatsCard(true);
        setCaption(`Just crushed a ${stats.totalDuration} min workout! 💪 #workout #fitness #mood`);
      } catch (error) {
        console.error('Error parsing workout stats:', error);
      }
    }
  }, [params]);

  const loadMockAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'fitnessqueen',
          password: 'password123',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.token);
      }
    } catch (error) {
      console.error('Mock auth failed:', error);
    }
  };

  const pickImages = async () => {
    const maxImages = hasStatsCard ? 4 : 5; // Reserve 1 slot for stats card if present
    
    if (selectedImages.length >= maxImages) {
      Alert.alert('Limit Reached', `You can only select up to ${maxImages} images`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to select images!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages - selectedImages.length,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages([...selectedImages, ...newImages].slice(0, maxImages));
    }
  };

  const handleSaveCard = async () => {
    if (!workoutStats || !authToken) return;
    
    try {
      // Save workout card to backend
      const response = await fetch(`${API_URL}/api/workout-cards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutStats),
      });

      if (response.ok) {
        Alert.alert('Success', 'Workout card saved to your profile!');
      } else {
        Alert.alert('Error', 'Failed to save workout card.');
      }
    } catch (error) {
      console.error('Error saving workout card:', error);
      Alert.alert('Error', 'Something went wrong while saving the card.');
    }
  };

  const handleCancel = () => {
    if (hasStatsCard) {
      // If coming from workout completion, ask to save card
      Alert.alert(
        'Cancel Post',
        'Do you want to save your workout card before leaving?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.push('/(tabs)'),
          },
          {
            text: 'Save Card',
            onPress: async () => {
              await handleSaveCard();
              router.push('/(tabs)');
            },
          },
          {
            text: 'Keep Editing',
            style: 'cancel',
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < selectedImages.length; i++) {
      const imageUri = selectedImages[i];
      setUploadProgress(((i + 1) / selectedImages.length) * 100);

      try {
        // Create form data
        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('file', {
          uri: imageUri,
          name: filename,
          type,
        } as any);

        // Upload to backend
        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    return uploadedUrls;
  };

  const handleCreatePost = async () => {
    if (selectedImages.length === 0 && !caption.trim() && !hasStatsCard) {
      Alert.alert('Empty Post', 'Please add at least an image, caption, or workout card');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // If there's a workout stats card, save it automatically
      if (workoutStats && authToken) {
        await handleSaveCard();
      }

      // Upload images first
      const mediaUrls = await uploadImages();

      // Extract hashtags
      const hashtags = extractHashtags(caption);

      // Create post
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: caption.trim(),
          media_urls: mediaUrls,
          hashtags,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Post created successfully! Your workout card has been saved.', [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)'),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleCancel}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={styles.headerActions}>
            {hasStatsCard && (
              <TouchableOpacity 
                style={styles.saveCardButton}
                onPress={handleSaveCard}
                disabled={uploading}
              >
                <Ionicons name="bookmark" size={20} color="#FFD700" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[
                styles.postButton,
                (!caption.trim() && selectedImages.length === 0 && !hasStatsCard) && styles.postButtonDisabled
              ]}
              onPress={handleCreatePost}
              disabled={uploading || (!caption.trim() && selectedImages.length === 0 && !hasStatsCard)}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Workout Stats Card (if from completed workout) */}
          {workoutStats && (
            <View style={styles.section}>
              <View style={styles.statsCardHeader}>
                <Text style={styles.sectionTitle}>✨ Your Workout Achievement</Text>
                <TouchableOpacity onPress={handleSaveCard} style={styles.saveCardIconButton}>
                  <Ionicons name="bookmark-outline" size={20} color="#FFD700" />
                  <Text style={styles.saveCardText}>Save</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.statsCardContainer} ref={statsCardRef}>
                <WorkoutStatsCard {...workoutStats} />
              </View>
              <Text style={styles.statsCardHint}>
                This card will be the first image in your post carousel
              </Text>
            </View>
          )}

          {/* Image Picker Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Photos ({selectedImages.length}/{hasStatsCard ? 4 : 5})
              {hasStatsCard && <Text style={{color: '#666', fontSize: 12}}> + Stats Card</Text>}
            </Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
            >
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={pickImages}
                disabled={selectedImages.length >= 5}
              >
                <View style={styles.addImageIconContainer}>
                  <Ionicons name="add" size={32} color="#FFD700" />
                </View>
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>

              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FFD700" />
                  </TouchableOpacity>
                  <View style={styles.imageNumber}>
                    <Text style={styles.imageNumberText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Caption Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caption</Text>
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption... (use #hashtags)"
              placeholderTextColor="#666"
              value={caption}
              onChangeText={setCaption}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.captionCounter}>{caption.length}/500</Text>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <View style={styles.tipItem}>
              <Ionicons name="information-circle" size={20} color="#FFD700" />
              <Text style={styles.tipText}>Add up to 5 photos to create a carousel</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="pricetag" size={20} color="#FFD700" />
              <Text style={styles.tipText}>Use #hashtags to reach more people</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="fitness" size={20} color="#FFD700" />
              <Text style={styles.tipText}>Workout details coming soon!</Text>
            </View>
          </View>

          {/* Upload Progress */}
          {uploading && (
            <View style={styles.uploadProgressContainer}>
              <Text style={styles.uploadProgressText}>
                Uploading... {Math.round(uploadProgress)}%
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${uploadProgress}%` }
                  ]} 
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  backButton: {
    padding: 4,
    width: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveCardButton: {
    padding: 8,
  },
  postButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  postButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.05)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 12,
  },
  imageScroll: {
    marginTop: 8,
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  addImageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addImageText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginRight: 12,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  imageNumber: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNumberText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  captionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  captionCounter: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  tipsSection: {
    padding: 16,
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    color: '#888',
    fontSize: 14,
    flex: 1,
  },
  uploadProgressContainer: {
    padding: 16,
  },
  uploadProgressText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveCardIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  saveCardText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  statsCardContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  statsCardHint: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
