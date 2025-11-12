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
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, router as globalRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { captureRef } from 'react-native-view-shot';
import WorkoutStatsCard from '../components/WorkoutStatsCard';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

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
  const { user, token, isLoading } = useAuth();
  const [caption, setCaption] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [hasStatsCard, setHasStatsCard] = useState(false);
  const [saveButtonPressed, setSaveButtonPressed] = useState(false);
  const statsCardRef = useRef(null);
  
  // Success animation state (inline button animation like "Add workout")
  const [cardSaved, setCardSaved] = useState(false);
  const [saveScaleAnim] = useState(new Animated.Value(1));

  // Debug auth state
  useEffect(() => {
    console.log('🔍 Auth state:', { 
      hasToken: !!token, 
      hasUser: !!user, 
      isLoading,
      tokenLength: token?.length || 0 
    });
  }, [token, user, isLoading]);

  // Load workout stats
  useEffect(() => {
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
  }, [params.workoutStats]);

  const pickImages = async () => {
    const maxImages = hasStatsCard ? 4 : 5;
    
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

  const showSaveAnimation = () => {
    // Same animation as "Add workout" button
    Animated.sequence([
      Animated.timing(saveScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(saveScaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(saveScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSaveCard = async () => {
    console.log('handleSaveCard called');
    console.log('Current auth state:', { 
      hasWorkoutStats: !!workoutStats, 
      hasToken: !!token, 
      isLoading,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
    });
    
    if (isLoading) {
      showAlert('Please wait', 'Loading authentication...');
      return;
    }
    
    if (!token) {
      console.error('❌ No auth token available!');
      showAlert('Authentication Error', 'Please wait a moment and try again. If the problem persists, try refreshing the app.');
      return;
    }
    
    if (!workoutStats) {
      console.log('No workout stats to save');
      return;
    }
    
    try {
      console.log('Saving card to API...');
      
      // Transform camelCase to snake_case for backend
      const cardData = {
        workouts: workoutStats.workouts,
        total_duration: workoutStats.totalDuration,
        completed_at: workoutStats.completedAt,
      };
      
      const response = await fetch(`${API_URL}/api/workout-cards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      console.log('Save response status:', response.status);
      if (response.ok) {
        console.log('✅ Card saved successfully! Showing button animation...');
        setCardSaved(true);
        showSaveAnimation();
      } else {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        showAlert('Error', 'Failed to save workout card.');
      }
    } catch (error) {
      console.error('Error saving workout card:', error);
      showAlert('Error', 'Something went wrong while saving the card.');
    }
  };

  const navigateToHome = () => {
    console.log('navigateToHome called - starting navigation...');
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        console.log('Platform is web, using window.location');
        console.log('Current URL:', window.location.href);
        // Navigate to the mood cards screen (tabs/index)
        window.location.href = '/(tabs)';
        console.log('window.location.href set to /(tabs)');
      } else {
        console.log('Platform is native, using router.replace');
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      if (router.canGoBack()) {
        console.log('Trying router.back()');
        router.back();
      }
    }
    console.log('navigateToHome completed');
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      // Use native web alert for web platform
      console.log(`Alert: ${title} - ${message}`);
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleCancel = () => {
    console.log('handleCancel called');
    
    if (Platform.OS === 'web') {
      // On web, use native confirm dialog
      if (hasStatsCard) {
        const shouldSave = window.confirm('Do you want to save your workout card before leaving?\n\nClick OK to save, Cancel to discard.');
        if (shouldSave) {
          console.log('User chose to save');
          handleSaveCard().then(() => {
            console.log('Card saved, now navigating...');
            navigateToHome();
          });
        } else {
          console.log('User chose to discard');
          navigateToHome();
        }
      } else {
        console.log('No stats card, navigating home');
        navigateToHome();
      }
    } else {
      // On native, use Alert.alert with buttons
      if (hasStatsCard) {
        Alert.alert(
          'Cancel Post',
          'Do you want to save your workout card to your profile before leaving?',
          [
            {
              text: 'Discard All',
              style: 'destructive',
              onPress: () => {
                console.log('Discard All pressed');
                navigateToHome();
              },
            },
            {
              text: 'Save Card Only',
              onPress: async () => {
                console.log('Save Card Only pressed');
                await handleSaveCard();
                navigateToHome();
              },
            },
            {
              text: 'Keep Editing',
              style: 'cancel',
            },
          ]
        );
      } else {
        console.log('No stats card, going home');
        navigateToHome();
      }
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
        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('file', {
          uri: imageUri,
          name: filename,
          type,
        } as any);

        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
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
      showAlert('Empty Post', 'Please add at least an image, caption, or workout card');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const mediaUrls = await uploadImages();
      const hashtags = extractHashtags(caption);

      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: caption.trim(),
          media_urls: mediaUrls,
          hashtags,
        }),
      });

      if (response.ok) {
        showAlert('Posted! ✨', 'Your workout has been shared to your feed!');
        // Navigate after a short delay
        setTimeout(() => {
          navigateToHome();
        }, 1500);
      } else {
        showAlert('Error', 'Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showAlert('Error', 'Something went wrong. Please try again.');
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
            style={styles.closeButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Share Your Achievement</Text>
            <Text style={styles.headerSubtitle}>Post to your feed</Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.postButton,
              (!caption.trim() && selectedImages.length === 0 && !hasStatsCard) && styles.postButtonDisabled
            ]}
            onPress={handleCreatePost}
            disabled={uploading || (!caption.trim() && selectedImages.length === 0 && !hasStatsCard)}
            activeOpacity={0.7}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="send" size={20} color="#000" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Attachments Label */}
          <View style={styles.attachmentsHeader}>
            <Ionicons name="attach" size={18} color="#FFD700" />
            <Text style={styles.attachmentsLabel}>Attachments</Text>
          </View>

          {/* 1. Image Picker Section - FIRST */}
          <View style={styles.attachmentCard}>
            <View style={styles.attachmentHeader}>
              <View style={styles.attachmentLabelContainer}>
                <Ionicons name="images" size={16} color="#FFD700" />
                <Text style={styles.attachmentType}>
                  Photos ({selectedImages.length}/{hasStatsCard ? 4 : 5})
                </Text>
              </View>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
              contentContainerStyle={styles.imageScrollContent}
            >
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={pickImages}
                disabled={selectedImages.length >= (hasStatsCard ? 4 : 5)}
              >
                <View style={styles.addImageIconContainer}>
                  <Ionicons name="add" size={28} color="#FFD700" />
                </View>
                <Text style={styles.addImageText}>Add</Text>
              </TouchableOpacity>

              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={22} color="#FFD700" />
                  </TouchableOpacity>
                  <View style={styles.imageNumber}>
                    <Text style={styles.imageNumberText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            {selectedImages.length === 0 && (
              <Text style={styles.emptyText}>Optional: Add photos to your post</Text>
            )}
          </View>

          {/* 2. Caption Input - SECOND */}
          <View style={styles.captionSection}>
            <View style={styles.captionHeader}>
              <Ionicons name="create-outline" size={20} color="#FFD700" />
              <Text style={styles.captionLabel}>Caption</Text>
            </View>
            <TextInput
              style={styles.captionInput}
              placeholder="Share your thoughts... (use #hashtags)"
              placeholderTextColor="#666"
              value={caption}
              onChangeText={setCaption}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.captionCounter}>{caption.length}/500</Text>
          </View>

          {/* 3. Workout Stats Card - LAST */}
          {workoutStats && (
            <View style={styles.attachmentCard}>
              <View style={styles.attachmentHeader}>
                <View style={styles.attachmentLabelContainer}>
                  <Ionicons name="trophy" size={16} color="#FFD700" />
                  <Text style={styles.attachmentType}>Workout Achievement</Text>
                </View>
                <Animated.View style={{ transform: [{ scale: saveScaleAnim }] }}>
                  <TouchableOpacity 
                    onPress={handleSaveCard} 
                    disabled={cardSaved}
                    style={[
                      styles.saveCardButton,
                      cardSaved && styles.saveCardButtonSaved
                    ]}
                    activeOpacity={0.7}
                  >
                    {cardSaved ? (
                      <Text style={styles.savedText}>Saved to profile</Text>
                    ) : (
                      <>
                        <Ionicons name="bookmark-outline" size={18} color="#FFD700" />
                        <Text style={styles.saveButtonText}>Save</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
              <View style={styles.statsCardWrapper}>
                <WorkoutStatsCard {...workoutStats} />
              </View>
              <View style={styles.saveExplanation}>
                <Ionicons name="information-circle-outline" size={14} color="rgba(255, 215, 0, 0.7)" />
                <Text style={styles.saveExplanationText}>
                  Tap Save to keep this card in your Profile without posting
                </Text>
              </View>
              <Text style={styles.attachmentHint}>
                👆 This will appear as the last item in your post
              </Text>
            </View>
          )}

          {/* Upload Progress */}
          {uploading && (
            <View style={styles.uploadProgressContainer}>
              <View style={styles.uploadingHeader}>
                <ActivityIndicator size="small" color="#FFD700" />
                <Text style={styles.uploadProgressText}>
                  Posting... {Math.round(uploadProgress)}%
                </Text>
              </View>
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

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacer} />
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.15)',
    backgroundColor: '#0a0a0a',
  },
  closeButton: {
    padding: 4,
    width: 50,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  postButton: {
    backgroundColor: '#FFD700',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.4,
  },
  scrollView: {
    flex: 1,
  },
  attachmentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  attachmentsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  attachmentCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.15)',
    padding: 14,
  },
  attachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  attachmentLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachmentType: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  saveCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    minWidth: 80,
  },
  saveCardButtonSaved: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
  savedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
  statsCardWrapper: {
    alignItems: 'center',
    marginVertical: 6,
  },
  saveExplanation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 10,
  },
  saveExplanationText: {
    flex: 1,
    fontSize: 11,
    color: 'rgba(255, 215, 0, 0.7)',
    lineHeight: 16,
  },
  attachmentHint: {
    color: 'rgba(255, 215, 0, 0.6)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  imageScroll: {
    marginTop: 4,
  },
  imageScrollContent: {
    paddingRight: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.03)',
  },
  addImageIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  addImageText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#000',
    borderRadius: 11,
  },
  imageNumber: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNumberText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  captionSection: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.15)',
    padding: 14,
  },
  captionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  captionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  captionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  captionCounter: {
    color: '#666',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
  },
  uploadProgressContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  uploadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  uploadProgressText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  bottomSpacer: {
    height: 40,
  },
});
