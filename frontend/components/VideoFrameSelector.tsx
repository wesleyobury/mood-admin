import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
  Image as RNImage,
} from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FILMSTRIP_HEIGHT = 52;
const FRAME_COUNT = 8;
const TOTAL_FRAMES = 24;
const FRAME_WIDTH = (SCREEN_WIDTH - 32) / FRAME_COUNT;
const FILMSTRIP_WIDTH = SCREEN_WIDTH - 32;

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
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [allFrames, setAllFrames] = useState<Frame[]>([]);
  const [isLoadingFrames, setIsLoadingFrames] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Current frame index for preview
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  
  // Scrubber position for animation
  const [scrubberX, setScrubberX] = useState(0);

  // Generate all frames when video loads
  useEffect(() => {
    if (duration > 0 && allFrames.length === 0) {
      generateAllFrames();
    }
  }, [duration]);

  const generateAllFrames = async () => {
    if (Platform.OS === 'web') {
      setIsLoadingFrames(false);
      return;
    }

    try {
      setIsLoadingFrames(true);
      const frames: Frame[] = [];
      const frameInterval = duration / TOTAL_FRAMES;
      
      console.log(`Generating ${TOTAL_FRAMES} frames for video duration ${duration}ms`);
      
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const timestamp = Math.floor(i * frameInterval);
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: timestamp,
            quality: 0.6,
          });
          frames.push({ uri, timestamp });
          console.log(`Generated frame ${i} at ${timestamp}ms`);
        } catch (e) {
          console.log(`Could not generate frame at ${timestamp}ms`);
          if (frames.length > 0) {
            frames.push({ uri: frames[frames.length - 1].uri, timestamp });
          }
        }
      }

      console.log(`Total frames generated: ${frames.length}`);
      setAllFrames(frames);
    } catch (err) {
      console.error('Error generating frames:', err);
    } finally {
      setIsLoadingFrames(false);
    }
  };

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded && status.durationMillis) {
      setIsVideoReady(true);
      setDuration(status.durationMillis);
    }
  }, []);

  // Handle touch on filmstrip
  const handleFilmstripTouch = (evt: any) => {
    const touchX = evt.nativeEvent.locationX;
    updatePositionFromTouch(touchX);
  };

  const handleFilmstripMove = (evt: any) => {
    const touchX = evt.nativeEvent.locationX;
    updatePositionFromTouch(touchX);
  };

  const updatePositionFromTouch = (touchX: number) => {
    if (allFrames.length === 0 || duration === 0) return;
    
    const clampedX = Math.max(0, Math.min(touchX, FILMSTRIP_WIDTH));
    const percentage = clampedX / FILMSTRIP_WIDTH;
    const newPosition = Math.floor(percentage * duration);
    
    // Find closest frame
    const frameIndex = Math.min(
      Math.floor(percentage * allFrames.length),
      allFrames.length - 1
    );
    
    console.log(`Touch at ${clampedX}, percentage ${percentage}, frameIndex ${frameIndex}`);
    
    setScrubberX(clampedX);
    setPosition(newPosition);
    setCurrentFrameIndex(frameIndex);
  };

  const captureAndConfirm = () => {
    if (allFrames.length > 0 && allFrames[currentFrameIndex]?.uri) {
      console.log(`Selecting frame ${currentFrameIndex}: ${allFrames[currentFrameIndex].uri}`);
      onFrameSelected(allFrames[currentFrameIndex].uri);
    } else {
      setError('No frame available to select');
    }
  };

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get current preview URI
  const currentPreviewUri = allFrames[currentFrameIndex]?.uri || '';
  
  // Get filmstrip frames (first 8 of the 24)
  const filmstripFrames = allFrames.filter((_, i) => i % 3 === 0).slice(0, FRAME_COUNT);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cover</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Cover selection is only available on mobile</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cover</Text>
        <TouchableOpacity 
          onPress={captureAndConfirm} 
          style={styles.headerButton}
          disabled={isCapturing || isLoadingFrames || allFrames.length === 0}
        >
          {isCapturing ? (
            <ActivityIndicator size="small" color="#FFD700" />
          ) : (
            <Text style={[
              styles.doneText,
              (isLoadingFrames || allFrames.length === 0) && styles.doneTextDisabled
            ]}>
              Done
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Preview Frame */}
      <View style={styles.previewSection}>
        <View style={styles.previewContainer}>
          {isLoadingFrames ? (
            <View style={styles.previewLoading}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Preparing frames...</Text>
            </View>
          ) : currentPreviewUri ? (
            <RNImage
              key={`preview-frame-${currentFrameIndex}`}
              source={{ uri: currentPreviewUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.previewLoading}>
              <Text style={styles.loadingText}>No preview available</Text>
            </View>
          )}
        </View>

        {/* Time badge */}
        {!isLoadingFrames && (
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>{formatTime(position)}</Text>
          </View>
        )}
        
        {/* Debug info */}
        {__DEV__ && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>Frame: {currentFrameIndex}/{allFrames.length}</Text>
          </View>
        )}
      </View>

      {/* Hidden video for duration */}
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.hiddenVideo}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        isMuted={true}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {/* Filmstrip */}
      <View style={styles.filmstripSection}>
        <Text style={styles.filmstripLabel}>Drag to select cover frame</Text>
        
        <View 
          style={styles.filmstripContainer}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleFilmstripTouch}
          onResponderMove={handleFilmstripMove}
        >
          <View style={styles.filmstrip}>
            {isLoadingFrames ? (
              <View style={styles.filmstripLoading}>
                <ActivityIndicator size="small" color="#FFD700" />
              </View>
            ) : (
              filmstripFrames.map((frame, index) => (
                <View key={`filmstrip-${index}`} style={styles.filmstripFrame}>
                  {frame.uri ? (
                    <RNImage
                      source={{ uri: frame.uri }}
                      style={styles.filmstripFrameImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.filmstripFramePlaceholder} />
                  )}
                </View>
              ))
            )}
          </View>

          {/* Scrubber */}
          {!isLoadingFrames && allFrames.length > 0 && (
            <View style={[styles.scrubberContainer, { left: scrubberX - 1.5 }]}>
              <LinearGradient
                colors={['#FFD700', '#FF8C00']}
                style={styles.scrubberLine}
              />
              <LinearGradient
                colors={['#FFD700', '#FF8C00']}
                style={styles.scrubberHandle}
              >
                <View style={styles.scrubberHandleInner} />
              </LinearGradient>
            </View>
          )}
        </View>

        <View style={styles.timeIndicators}>
          <Text style={styles.timeIndicatorText}>0:00</Text>
          <Text style={styles.timeIndicatorText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color="#FF6B6B" />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      <Text style={styles.hintText}>
        This image will show as the cover in your feed
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    width: 60,
    height: 44,
    justifyContent: 'center',
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
    color: '#555',
  },
  previewSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    maxHeight: SCREEN_WIDTH * 1.1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#888',
    fontSize: 14,
  },
  timeBadge: {
    position: 'absolute',
    top: 12,
    right: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timeBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  debugInfo: {
    position: 'absolute',
    bottom: 12,
    left: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  debugText: {
    color: '#FFD700',
    fontSize: 11,
  },
  hiddenVideo: {
    width: 1,
    height: 1,
    position: 'absolute',
    opacity: 0,
  },
  filmstripSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filmstripLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 12,
  },
  filmstripContainer: {
    height: FILMSTRIP_HEIGHT + 20,
    position: 'relative',
    justifyContent: 'center',
  },
  filmstrip: {
    flexDirection: 'row',
    height: FILMSTRIP_HEIGHT,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  filmstripLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filmstripFrame: {
    width: FRAME_WIDTH,
    height: FILMSTRIP_HEIGHT,
  },
  filmstripFrameImage: {
    width: '100%',
    height: '100%',
  },
  filmstripFramePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
  },
  scrubberContainer: {
    position: 'absolute',
    top: 0,
    height: FILMSTRIP_HEIGHT + 20,
    alignItems: 'center',
  },
  scrubberLine: {
    width: 3,
    height: FILMSTRIP_HEIGHT + 10,
    marginTop: 5,
    borderRadius: 1.5,
  },
  scrubberHandle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -4,
  },
  scrubberHandleInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
  },
  timeIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeIndicatorText: {
    fontSize: 11,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  errorBannerText: {
    color: '#FF6B6B',
    fontSize: 13,
  },
  hintText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.35)',
    textAlign: 'center',
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
});

export default VideoFrameSelector;
