import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
  PanResponder,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FILMSTRIP_HEIGHT = 52;
const FRAME_COUNT = 8; // Number of frames in filmstrip
const FRAME_WIDTH = (SCREEN_WIDTH - 32) / FRAME_COUNT;
const SCRUBBER_WIDTH = 3;

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
  const [filmstripFrames, setFilmstripFrames] = useState<Frame[]>([]);
  const [isLoadingFrames, setIsLoadingFrames] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // For pan gesture on filmstrip
  const scrubberPosition = useRef(new Animated.Value(0)).current;
  const filmstripWidth = SCREEN_WIDTH - 32;
  
  // Track if we have a selected frame ready
  const [selectedFrameUri, setSelectedFrameUri] = useState<string | null>(null);

  // Generate filmstrip frames when video loads
  useEffect(() => {
    if (duration > 0) {
      generateFilmstripFrames();
    }
  }, [duration, videoUri]);

  const generateFilmstripFrames = async () => {
    if (Platform.OS === 'web') {
      setIsLoadingFrames(false);
      return;
    }

    try {
      setIsLoadingFrames(true);
      const frames: Frame[] = [];
      const interval = duration / FRAME_COUNT;
      
      for (let i = 0; i < FRAME_COUNT; i++) {
        const timestamp = Math.floor(i * interval);
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: timestamp,
            quality: 0.5,
          });
          frames.push({ uri, timestamp });
        } catch (e) {
          console.log(`Could not generate frame at ${timestamp}ms`);
          // Add placeholder
          frames.push({ uri: '', timestamp });
        }
      }

      setFilmstripFrames(frames);
    } catch (err) {
      console.error('Error generating filmstrip:', err);
    } finally {
      setIsLoadingFrames(false);
    }
  };

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsVideoReady(true);
      if (status.durationMillis) {
        setDuration(status.durationMillis);
      }
    }
  }, []);

  // Pan responder for scrubbing through filmstrip
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        // Get initial touch position
        const touchX = evt.nativeEvent.locationX;
        handleScrub(touchX);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Calculate position from gesture
        const touchX = Math.max(0, Math.min(gestureState.moveX - 16, filmstripWidth));
        handleScrub(touchX);
      },
      onPanResponderRelease: () => {
        // Capture frame on release
        captureCurrentFrame();
      },
    })
  ).current;

  const handleScrub = useCallback((touchX: number) => {
    const clampedX = Math.max(0, Math.min(touchX, filmstripWidth));
    const percentage = clampedX / filmstripWidth;
    const newPosition = Math.floor(percentage * duration);
    
    scrubberPosition.setValue(clampedX);
    setPosition(newPosition);
    
    // Seek video to this position
    if (videoRef.current && duration > 0) {
      videoRef.current.setPositionAsync(newPosition);
    }
  }, [duration, filmstripWidth]);

  // Handle tap on filmstrip
  const handleFilmstripTap = useCallback((evt: any) => {
    const touchX = evt.nativeEvent.locationX;
    handleScrub(touchX);
    // Auto-capture on tap
    setTimeout(() => captureCurrentFrame(), 100);
  }, [handleScrub]);

  const captureCurrentFrame = async () => {
    if (Platform.OS === 'web' || isCapturing) return;

    setIsCapturing(true);
    setError(null);
    
    try {
      // Pause video first
      await videoRef.current?.pauseAsync();
      
      // Small delay to ensure video is paused at exact frame
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Try multiple quality levels to avoid failures
      let capturedUri: string | null = null;
      const qualities = [0.8, 0.6, 0.4];
      
      for (const quality of qualities) {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: position,
            quality,
          });
          capturedUri = uri;
          break;
        } catch (e) {
          console.log(`Failed at quality ${quality}, trying lower...`);
        }
      }
      
      if (capturedUri) {
        setSelectedFrameUri(capturedUri);
      } else {
        // Fallback: try to get frame from nearest filmstrip frame
        const nearestFrame = filmstripFrames.find(f => Math.abs(f.timestamp - position) < 500);
        if (nearestFrame && nearestFrame.uri) {
          setSelectedFrameUri(nearestFrame.uri);
        } else {
          setError('Could not capture this frame. Try a different position.');
        }
      }
    } catch (err) {
      console.error('Error capturing frame:', err);
      setError('Failed to capture frame. Try moving to a different position.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirm = () => {
    if (selectedFrameUri) {
      onFrameSelected(selectedFrameUri);
    }
  };

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update scrubber position when position changes
  useEffect(() => {
    if (duration > 0) {
      const percentage = position / duration;
      const newX = percentage * filmstripWidth;
      scrubberPosition.setValue(newX);
    }
  }, [position, duration]);

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
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Cover selection is only available on mobile</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header - Instagram Style */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cover</Text>
        <TouchableOpacity 
          onPress={handleConfirm} 
          style={styles.headerButton}
          disabled={!selectedFrameUri}
        >
          <Text style={[
            styles.doneText,
            !selectedFrameUri && styles.doneTextDisabled
          ]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>

      {/* Video Preview - Large, centered */}
      <View style={styles.videoSection}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
            isLooping={false}
            isMuted={true}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onError={(error) => {
              console.error('Video error:', error);
              setError('Failed to load video');
            }}
          />
          
          {!isVideoReady && (
            <View style={styles.videoLoadingOverlay}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
        </View>

        {/* Current time badge */}
        <View style={styles.timeBadge}>
          <Text style={styles.timeBadgeText}>{formatTime(position)}</Text>
        </View>
      </View>

      {/* Selected Frame Preview */}
      {selectedFrameUri && (
        <View style={styles.selectedPreviewContainer}>
          <Image
            source={{ uri: selectedFrameUri }}
            style={styles.selectedPreviewImage}
            contentFit="cover"
          />
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
            <Text style={styles.selectedBadgeText}>Selected</Text>
          </View>
        </View>
      )}

      {/* Filmstrip Scrubber - Instagram Style */}
      <View style={styles.filmstripSection}>
        <Text style={styles.filmstripLabel}>Drag to select cover</Text>
        
        <View 
          style={styles.filmstripContainer}
          {...panResponder.panHandlers}
        >
          {/* Filmstrip frames background */}
          <View style={styles.filmstrip}>
            {isLoadingFrames ? (
              <View style={styles.filmstripLoading}>
                <ActivityIndicator size="small" color="#FFD700" />
              </View>
            ) : (
              filmstripFrames.map((frame, index) => (
                <View key={index} style={styles.filmstripFrame}>
                  {frame.uri ? (
                    <Image
                      source={{ uri: frame.uri }}
                      style={styles.filmstripFrameImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.filmstripFramePlaceholder} />
                  )}
                </View>
              ))
            )}
          </View>

          {/* Gradient Scrubber Handle */}
          <Animated.View 
            style={[
              styles.scrubberContainer,
              { transform: [{ translateX: scrubberPosition }] }
            ]}
          >
            <LinearGradient
              colors={['#FFD700', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.scrubberLine}
            />
            <LinearGradient
              colors={['#FFD700', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scrubberHandle}
            >
              <View style={styles.scrubberHandleInner} />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Time indicators */}
        <View style={styles.timeIndicators}>
          <Text style={styles.timeIndicatorText}>0:00</Text>
          <Text style={styles.timeIndicatorText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Capture Button with Gradient */}
      <View style={styles.captureSection}>
        <TouchableOpacity 
          style={styles.captureButtonContainer}
          onPress={captureCurrentFrame}
          disabled={isCapturing || !isVideoReady}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isCapturing ? ['#666', '#444'] : ['#FFD700', '#FF8C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.captureButton}
          >
            {isCapturing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="camera" size={20} color="#000" />
                <Text style={styles.captureButtonText}>Capture This Frame</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color="#FF6B6B" />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

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
  videoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    maxHeight: SCREEN_WIDTH * 1.1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    fontVariant: ['tabular-nums'],
  },
  selectedPreviewContainer: {
    position: 'absolute',
    bottom: 200,
    right: 24,
    alignItems: 'center',
  },
  selectedPreviewImage: {
    width: 56,
    height: 70,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  selectedBadgeText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
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
    marginLeft: -1.5,
  },
  scrubberLine: {
    width: SCRUBBER_WIDTH,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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
    fontVariant: ['tabular-nums'],
  },
  captureSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  captureButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  captureButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
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
