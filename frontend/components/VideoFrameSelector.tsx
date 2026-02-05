import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
  Image as RNImage,
  Animated,
  PanResponder,
} from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImageManipulator from 'expo-image-manipulator';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FILMSTRIP_HEIGHT = 52;
const FRAME_COUNT = 10;
const TOTAL_FRAMES = 40; // More frames for smoother scrubbing
const FILMSTRIP_WIDTH = SCREEN_WIDTH - 32;

// Preview dimensions (4:5 aspect ratio like Instagram)
const PREVIEW_WIDTH = SCREEN_WIDTH - 32;
const PREVIEW_HEIGHT = PREVIEW_WIDTH * 1.25;

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
  const [duration, setDuration] = useState(0);
  const [allFrames, setAllFrames] = useState<Frame[]>([]);
  const [isLoadingFrames, setIsLoadingFrames] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  
  // Animated values for smooth interactions
  const scrubberPosition = useRef(new Animated.Value(FILMSTRIP_WIDTH / 2)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  
  // Refs for gesture tracking
  const baseScale = useRef(1);
  const baseTranslateX = useRef(0);
  const baseTranslateY = useRef(0);
  const lastPinchDistance = useRef(0);
  const isScrubbing = useRef(false);

  // Image pan/zoom responder - smoother with direct animated value updates
  const imagePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      
      onPanResponderGrant: () => {
        // Store current values as base
        baseScale.current = (scale as any)._value || 1;
        baseTranslateX.current = (translateX as any)._value || 0;
        baseTranslateY.current = (translateY as any)._value || 0;
        lastPinchDistance.current = 0;
      },
      
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        
        if (touches.length === 2) {
          // Pinch to zoom
          const touch1 = touches[0];
          const touch2 = touches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          
          if (lastPinchDistance.current === 0) {
            lastPinchDistance.current = distance;
            return;
          }
          
          const scaleChange = distance / lastPinchDistance.current;
          const newScale = Math.max(1, Math.min(3, baseScale.current * scaleChange));
          
          // Direct setValue for immediate response
          scale.setValue(newScale);
          
        } else if (touches.length === 1) {
          // Pan/drag - only if zoomed in
          const currentScale = (scale as any)._value || 1;
          if (currentScale > 1) {
            const maxTranslate = (currentScale - 1) * 80;
            const newX = Math.max(-maxTranslate, Math.min(maxTranslate, 
              baseTranslateX.current + gestureState.dx * 0.8));
            const newY = Math.max(-maxTranslate, Math.min(maxTranslate, 
              baseTranslateY.current + gestureState.dy * 0.8));
            
            translateX.setValue(newX);
            translateY.setValue(newY);
          }
        }
      },
      
      onPanResponderRelease: () => {
        lastPinchDistance.current = 0;
        // Snap back if scale is too low
        const currentScale = (scale as any)._value || 1;
        if (currentScale < 1.1) {
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 }),
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 7 }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 7 }),
          ]).start();
        }
      },
    })
  ).current;

  // Scrubber pan responder - optimized for smooth scrubbing
  const scrubberPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt) => {
        isScrubbing.current = true;
        const touchX = evt.nativeEvent.locationX;
        updateFrameFromPosition(touchX);
      },
      
      onPanResponderMove: (evt) => {
        if (!isScrubbing.current) return;
        const touchX = evt.nativeEvent.locationX;
        updateFrameFromPosition(touchX);
      },
      
      onPanResponderRelease: () => {
        isScrubbing.current = false;
      },
    })
  ).current;

  // Update frame based on touch position - smooth interpolation
  const updateFrameFromPosition = useCallback((touchX: number) => {
    if (allFrames.length === 0 || duration === 0) return;
    
    const clampedX = Math.max(0, Math.min(touchX, FILMSTRIP_WIDTH));
    const percentage = clampedX / FILMSTRIP_WIDTH;
    const frameIndex = Math.round(percentage * (allFrames.length - 1));
    const safeIndex = Math.max(0, Math.min(frameIndex, allFrames.length - 1));
    
    // Animate scrubber smoothly
    Animated.timing(scrubberPosition, {
      toValue: (safeIndex / (allFrames.length - 1)) * FILMSTRIP_WIDTH,
      duration: 50,
      useNativeDriver: true,
    }).start();
    
    setCurrentFrameIndex(safeIndex);
  }, [allFrames, duration, scrubberPosition]);

  // Generate frames on mount
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
      
      // Generate frames in parallel batches for speed
      const batchSize = 8;
      for (let batch = 0; batch < Math.ceil(TOTAL_FRAMES / batchSize); batch++) {
        const promises: Promise<void>[] = [];
        
        for (let i = 0; i < batchSize; i++) {
          const frameIndex = batch * batchSize + i;
          if (frameIndex >= TOTAL_FRAMES) break;
          
          const timestamp = Math.round(frameIndex * frameInterval);
          promises.push(
            VideoThumbnails.getThumbnailAsync(videoUri, {
              time: timestamp,
              quality: 0.7,
            }).then(({ uri }) => {
              frames[frameIndex] = { uri, timestamp };
            }).catch(() => {
              // Use previous frame as fallback
              if (frameIndex > 0 && frames[frameIndex - 1]) {
                frames[frameIndex] = { ...frames[frameIndex - 1], timestamp };
              }
            })
          );
        }
        
        await Promise.all(promises);
      }

      // Filter out undefined entries
      const validFrames = frames.filter(f => f && f.uri);
      setAllFrames(validFrames);
      
      if (validFrames.length > 0) {
        const middleIndex = Math.floor(validFrames.length / 2);
        setCurrentFrameIndex(middleIndex);
        scrubberPosition.setValue((middleIndex / (validFrames.length - 1)) * FILMSTRIP_WIDTH);
      }
    } catch (err) {
      console.error('Error generating frames:', err);
      setError('Failed to generate video frames');
    } finally {
      setIsLoadingFrames(false);
    }
  };

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded && status.durationMillis) {
      setDuration(status.durationMillis);
    }
  }, []);

  const resetTransform = useCallback(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 }),
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 7 }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 7 }),
    ]).start();
    baseScale.current = 1;
    baseTranslateX.current = 0;
    baseTranslateY.current = 0;
  }, [scale, translateX, translateY]);

  const captureAndConfirm = async () => {
    if (allFrames.length === 0 || !allFrames[currentFrameIndex]?.uri) {
      setError('No frame available');
      return;
    }

    setIsCapturing(true);
    
    try {
      const sourceUri = allFrames[currentFrameIndex].uri;
      const currentScale = (scale as any)._value || 1;
      const currentTranslateX = (translateX as any)._value || 0;
      const currentTranslateY = (translateY as any)._value || 0;
      
      if (currentScale > 1.05) {
        // Apply crop based on transform
        const cropWidth = 1080 / currentScale;
        const cropHeight = 1350 / currentScale;
        const originX = Math.max(0, (1080 - cropWidth) / 2 - currentTranslateX * 2);
        const originY = Math.max(0, (1350 - cropHeight) / 2 - currentTranslateY * 2);
        
        const result = await ImageManipulator.manipulateAsync(
          sourceUri,
          [
            { crop: { originX, originY, width: cropWidth, height: cropHeight } },
            { resize: { width: 1080 } },
          ],
          { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 }
        );
        
        onFrameSelected(result.uri);
      } else {
        onFrameSelected(sourceUri);
      }
    } catch (err) {
      console.error('Error processing cover:', err);
      onFrameSelected(allFrames[currentFrameIndex].uri);
    } finally {
      setIsCapturing(false);
    }
  };

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentFrame = allFrames[currentFrameIndex];
  const currentScale = (scale as any)._value || 1;
  
  // Get evenly distributed filmstrip frames
  const filmstripFrames = allFrames.filter((_, i) => {
    const step = Math.max(1, Math.floor(allFrames.length / FRAME_COUNT));
    return i % step === 0;
  }).slice(0, FRAME_COUNT);

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

      {/* Preview with zoom/pan */}
      <View style={styles.previewSection}>
        <View style={styles.previewContainer} {...imagePanResponder.panHandlers}>
          {isLoadingFrames ? (
            <View style={styles.previewLoading}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Generating frames...</Text>
            </View>
          ) : currentFrame?.uri ? (
            <Animated.View style={styles.imageWrapper}>
              <Animated.Image
                source={{ uri: currentFrame.uri }}
                style={[
                  styles.previewImage,
                  {
                    transform: [
                      { scale },
                      { translateX },
                      { translateY },
                    ],
                  },
                ]}
                resizeMode="cover"
              />
              {/* Crop guides */}
              <View style={styles.cropOverlay} pointerEvents="none">
                <View style={styles.cropCorner} />
                <View style={[styles.cropCorner, styles.cropCornerTR]} />
                <View style={[styles.cropCorner, styles.cropCornerBL]} />
                <View style={[styles.cropCorner, styles.cropCornerBR]} />
              </View>
            </Animated.View>
          ) : (
            <View style={styles.previewLoading}>
              <Text style={styles.loadingText}>No preview</Text>
            </View>
          )}
        </View>

        {/* Transform hint */}
        {!isLoadingFrames && currentFrame?.uri && (
          <View style={styles.hintRow}>
            {currentScale > 1.05 && (
              <TouchableOpacity style={styles.resetButton} onPress={resetTransform}>
                <Ionicons name="refresh" size={14} color="#FFD700" />
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.hintText}>
              {currentScale > 1.05 ? `${Math.round(currentScale * 100)}%` : 'Pinch to zoom • Drag to reposition'}
            </Text>
          </View>
        )}

        {/* Time badge */}
        {!isLoadingFrames && currentFrame && (
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>{formatTime(currentFrame.timestamp)}</Text>
          </View>
        )}
      </View>

      {/* Hidden video for duration detection */}
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.hiddenVideo}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        isMuted={true}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {/* Filmstrip scrubber */}
      <View style={styles.filmstripSection}>
        <Text style={styles.filmstripLabel}>Slide to select frame</Text>
        
        <View style={styles.filmstripContainer} {...scrubberPanResponder.panHandlers}>
          <View style={styles.filmstrip}>
            {isLoadingFrames ? (
              <View style={styles.filmstripLoading}>
                <ActivityIndicator size="small" color="#FFD700" />
              </View>
            ) : (
              filmstripFrames.map((frame, index) => (
                <View key={index} style={styles.filmstripFrame}>
                  {frame?.uri ? (
                    <RNImage source={{ uri: frame.uri }} style={styles.filmstripImage} />
                  ) : (
                    <View style={styles.filmstripPlaceholder} />
                  )}
                </View>
              ))
            )}
          </View>

          {/* Animated scrubber */}
          {!isLoadingFrames && allFrames.length > 0 && (
            <Animated.View 
              style={[
                styles.scrubber,
                { transform: [{ translateX: Animated.subtract(scrubberPosition, 1.5) }] }
              ]}
            >
              <LinearGradient colors={['#FFD700', '#FF8C00']} style={styles.scrubberLine} />
              <LinearGradient colors={['#FFD700', '#FF8C00']} style={styles.scrubberHandle}>
                <View style={styles.scrubberDot} />
              </LinearGradient>
            </Animated.View>
          )}
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>0:00</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={14} color="#FF6B6B" />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      <Text style={styles.footerHint}>This will be your cover photo in the feed</Text>
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
    borderBottomColor: 'rgba(255,255,255,0.1)',
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
    width: PREVIEW_WIDTH,
    height: PREVIEW_HEIGHT,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  cropOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  cropCorner: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#FFD700',
  },
  cropCornerTR: {
    left: undefined,
    right: 8,
    borderLeftWidth: 0,
    borderRightWidth: 2,
  },
  cropCornerBL: {
    top: undefined,
    bottom: 8,
    borderTopWidth: 0,
    borderBottomWidth: 2,
  },
  cropCornerBR: {
    top: undefined,
    left: undefined,
    right: 8,
    bottom: 8,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 10,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  resetText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
  },
  hintText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  previewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  timeBadge: {
    position: 'absolute',
    top: 12,
    right: 28,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timeBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: 12,
  },
  filmstripContainer: {
    height: FILMSTRIP_HEIGHT + 24,
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
    flex: 1,
    height: FILMSTRIP_HEIGHT,
  },
  filmstripImage: {
    width: '100%',
    height: '100%',
  },
  filmstripPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
  },
  scrubber: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: FILMSTRIP_HEIGHT + 24,
    alignItems: 'center',
  },
  scrubberLine: {
    width: 3,
    height: FILMSTRIP_HEIGHT + 12,
    marginTop: 6,
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
  scrubberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 11,
    color: '#555',
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
    backgroundColor: 'rgba(255,107,107,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  errorBannerText: {
    color: '#FF6B6B',
    fontSize: 12,
  },
  footerHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
});

export default VideoFrameSelector;
