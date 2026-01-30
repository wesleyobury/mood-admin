import React, { useState, useEffect, memo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Ionicons } from '@expo/vector-icons';
import { Video, AVPlaybackStatus } from 'expo-av';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FRAME_WIDTH = 80;
const FRAME_HEIGHT = 100; // 4:5 aspect ratio

interface VideoFrameSelectorProps {
  videoUri: string;
  onFrameSelected: (frameUri: string) => void;
  onCancel: () => void;
  currentCover?: string;
}

interface Frame {
  uri: string;
  timestamp: number;
}

const VideoFrameSelector: React.FC<VideoFrameSelectorProps> = memo(({
  videoUri,
  onFrameSelected,
  onCancel,
  currentCover,
}) => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Generate thumbnails when component mounts
  useEffect(() => {
    generateThumbnails();
  }, [videoUri]);

  const generateThumbnails = async () => {
    if (Platform.OS === 'web') {
      setError('Frame selection is not available on web');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // First, get video duration
      // We'll generate frames at intervals throughout the video
      const maxFrames = 10;
      const generatedFrames: Frame[] = [];
      
      // Generate thumbnail at start
      try {
        const startFrame = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time: 0,
          quality: 0.8,
        });
        generatedFrames.push({ uri: startFrame.uri, timestamp: 0 });
      } catch (e) {
        console.log('Could not generate frame at 0ms');
      }

      // Generate frames at various timestamps (in milliseconds)
      // Try 1s, 2s, 3s, etc. up to 10 seconds
      const timestamps = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
      
      for (const timestamp of timestamps) {
        if (generatedFrames.length >= maxFrames) break;
        
        try {
          const frame = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: timestamp,
            quality: 0.8,
          });
          generatedFrames.push({ uri: frame.uri, timestamp });
        } catch (e) {
          // Video might be shorter than this timestamp - that's ok
          console.log(`Could not generate frame at ${timestamp}ms`);
        }
      }

      if (generatedFrames.length === 0) {
        setError('Could not extract frames from this video');
      } else {
        setFrames(generatedFrames);
        // Auto-select first frame if no current cover
        if (!currentCover) {
          setSelectedIndex(0);
        }
      }
    } catch (err: any) {
      console.error('Error generating thumbnails:', err);
      setError('Failed to extract video frames');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFrame = (index: number) => {
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (selectedIndex >= 0 && selectedIndex < frames.length) {
      onFrameSelected(frames[selectedIndex].uri);
    }
  };

  const formatTimestamp = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Cover Frame</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Extracting frames...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Cover Frame</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={generateThumbnails}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Cover Frame</Text>
        <TouchableOpacity 
          onPress={handleConfirm} 
          style={styles.headerButton}
          disabled={selectedIndex < 0}
        >
          <Text style={[
            styles.doneText,
            selectedIndex < 0 && styles.doneTextDisabled
          ]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>

      {/* Preview of selected frame */}
      <View style={styles.previewContainer}>
        {selectedIndex >= 0 && frames[selectedIndex] ? (
          <Image
            source={{ uri: frames[selectedIndex].uri }}
            style={styles.previewImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Ionicons name="image-outline" size={48} color="#666" />
            <Text style={styles.previewPlaceholderText}>Select a frame below</Text>
          </View>
        )}
      </View>

      {/* Frame selector */}
      <View style={styles.frameSelectorContainer}>
        <Text style={styles.sectionTitle}>Choose a frame for cover</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.framesScrollContent}
        >
          {frames.map((frame, index) => (
            <TouchableOpacity
              key={`frame-${index}`}
              style={[
                styles.frameItem,
                selectedIndex === index && styles.frameItemSelected,
              ]}
              onPress={() => handleSelectFrame(index)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: frame.uri }}
                style={styles.frameImage}
                contentFit="cover"
              />
              <View style={styles.frameTimestamp}>
                <Text style={styles.frameTimestampText}>
                  {formatTimestamp(frame.timestamp)}
                </Text>
              </View>
              {selectedIndex === index && (
                <View style={styles.selectedOverlay}>
                  <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Hint */}
      <Text style={styles.hintText}>
        This cover will be shown in the feed before the video plays
      </Text>
    </View>
  );
});

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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    width: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  doneTextDisabled: {
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#888',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  previewContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25, // 4:5 aspect ratio
    backgroundColor: '#1a1a1a',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPlaceholderText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  frameSelectorContainer: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  framesScrollContent: {
    paddingHorizontal: 12,
  },
  frameItem: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frameItemSelected: {
    borderColor: '#FFD700',
  },
  frameImage: {
    width: '100%',
    height: '100%',
  },
  frameTimestamp: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  frameTimestampText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  hintText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginTop: 8,
  },
});

export default VideoFrameSelector;
