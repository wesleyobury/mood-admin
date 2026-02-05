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
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FILMSTRIP_HEIGHT = 52;
const FRAME_COUNT = 8;
const TOTAL_FRAMES = 30; // More frames for better precision
const FRAME_WIDTH = (SCREEN_WIDTH - 32) / FRAME_COUNT;
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

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
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
  
  // Position/zoom transform for cover
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  
  // Pan responder state
  const lastTransform = useRef<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const lastDistance = useRef<number>(0);

  // Pan responder for drag and pinch-to-zoom
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        lastTransform.current = { ...transform };
      },
      
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const touches = evt.nativeEvent.touches;
        
        if (touches.length === 2) {
          // Pinch to zoom
          const touch1 = touches[0];
          const touch2 = touches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          
          if (lastDistance.current === 0) {
            lastDistance.current = distance;
          }
          
          const scaleChange = distance / lastDistance.current;
          const newScale = Math.max(1, Math.min(3, lastTransform.current.scale * scaleChange));
          
          setTransform(prev => ({
            ...prev,
            scale: newScale,
          }));
        } else if (touches.length === 1) {
          // Pan/drag
          const maxTranslate = (transform.scale - 1) * 100;
          const newTranslateX = Math.max(-maxTranslate, Math.min(maxTranslate, 
            lastTransform.current.translateX + gestureState.dx));
          const newTranslateY = Math.max(-maxTranslate, Math.min(maxTranslate, 
            lastTransform.current.translateY + gestureState.dy));
          
          setTransform(prev => ({
            ...prev,
            translateX: newTranslateX,
            translateY: newTranslateY,
          }));
        }
      },
      
      onPanResponderRelease: () => {
        lastDistance.current = 0;
        lastTransform.current = { ...transform };
      },
    })
  ).current;

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
        // Use exact timestamp for each frame
        const timestamp = Math.round(i * frameInterval);
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: timestamp,
            quality: 0.8, // Higher quality for better cover
          });
          frames.push({ uri, timestamp });
        } catch (e) {
          console.log(`Could not generate frame at ${timestamp}ms`);
          if (frames.length > 0) {
            frames.push({ uri: frames[frames.length - 1].uri, timestamp });
          }
        }
      }

      console.log(`Total frames generated: ${frames.length}`);
      setAllFrames(frames);
      
      // Set initial scrubber position to middle
      if (frames.length > 0) {
        const middleIndex = Math.floor(frames.length / 2);
        setCurrentFrameIndex(middleIndex);
        setScrubberX(FILMSTRIP_WIDTH / 2);
        setPosition(frames[middleIndex].timestamp);
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
      setIsVideoReady(true);
      setDuration(status.durationMillis);
    }
  }, []);

  // Handle touch on filmstrip - snap to nearest frame
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
    
    // Calculate exact frame index
    const exactFrameIndex = percentage * (allFrames.length - 1);
    const frameIndex = Math.round(exactFrameIndex); // Round to nearest frame
    const clampedFrameIndex = Math.max(0, Math.min(frameIndex, allFrames.length - 1));
    
    // Calculate scrubber position to align with frame
    const alignedX = (clampedFrameIndex / (allFrames.length - 1)) * FILMSTRIP_WIDTH;
    
    setScrubberX(alignedX);
    setPosition(allFrames[clampedFrameIndex].timestamp);
    setCurrentFrameIndex(clampedFrameIndex);
  };

  // Reset transform
  const resetTransform = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
    lastTransform.current = { scale: 1, translateX: 0, translateY: 0 };
  };

  // Capture and apply transform to create final cover
  const captureAndConfirm = async () => {
    if (allFrames.length === 0 || !allFrames[currentFrameIndex]?.uri) {
      setError('No frame available to select');
      return;
    }

    setIsCapturing(true);
    
    try {
      const sourceUri = allFrames[currentFrameIndex].uri;
      console.log(`Processing frame ${currentFrameIndex} with transform:`, transform);
      
      // If transform is applied, crop/manipulate the image
      if (transform.scale > 1 || transform.translateX !== 0 || transform.translateY !== 0) {
        // Get image info
        const imageInfo = await ImageManipulator.manipulateAsync(
          sourceUri,
          [],
          { format: ImageManipulator.SaveFormat.JPEG }
        );
        
        // Calculate crop region based on transform
        // This creates a crop that matches what the user sees
        const imageWidth = 1080; // Assume standard width
        const imageHeight = 1350; // 4:5 aspect ratio
        
        const cropWidth = imageWidth / transform.scale;
        const cropHeight = imageHeight / transform.scale;
        
        // Calculate origin based on translate (inverted because translate moves view, not crop)
        const originX = (imageWidth - cropWidth) / 2 - (transform.translateX * (imageWidth / PREVIEW_WIDTH));
        const originY = (imageHeight - cropHeight) / 2 - (transform.translateY * (imageHeight / PREVIEW_HEIGHT));
        
        const result = await ImageManipulator.manipulateAsync(
          sourceUri,
          [
            {
              crop: {
                originX: Math.max(0, originX),
                originY: Math.max(0, originY),
                width: Math.min(cropWidth, imageWidth - originX),
                height: Math.min(cropHeight, imageHeight - originY),
              },
            },
            {
              resize: { width: 1080 }, // Standard cover size
            },
          ],
          { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 }
        );
        
        console.log('Cover processed with crop:', result.uri);
        onFrameSelected(result.uri);
      } else {
        // No transform, use frame directly
        console.log('Using frame directly:', sourceUri);
        onFrameSelected(sourceUri);
      }
    } catch (err) {
      console.error('Error processing cover:', err);
      // Fallback to original frame
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

  // Get current preview URI
  const currentPreviewUri = allFrames[currentFrameIndex]?.uri || '';
  
  // Get filmstrip frames (evenly distributed)
  const filmstripFrames = allFrames.filter((_, i) => {
    const step = Math.floor(allFrames.length / FRAME_COUNT);
    return i % Math.max(1, step) === 0;
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

      {/* Preview Frame with Pan/Zoom */}
      <View style={styles.previewSection}>
        <View style={styles.previewContainer} {...panResponder.panHandlers}>
          {isLoadingFrames ? (
            <View style={styles.previewLoading}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Preparing frames...</Text>
            </View>
          ) : currentPreviewUri ? (
            <View style={styles.imageWrapper}>
              <RNImage
                key={`preview-frame-${currentFrameIndex}`}
                source={{ uri: currentPreviewUri }}
                style={[
                  styles.previewImage,
                  {
                    transform: [
                      { scale: transform.scale },
                      { translateX: transform.translateX },
                      { translateY: transform.translateY },
                    ],
                  },
                ]}
                resizeMode="cover"
              />
              {/* Crop overlay guide */}
              <View style={styles.cropOverlay}>
                <View style={styles.cropCorner} />
                <View style={[styles.cropCorner, styles.cropCornerTR]} />
                <View style={[styles.cropCorner, styles.cropCornerBL]} />
                <View style={[styles.cropCorner, styles.cropCornerBR]} />
              </View>
            </View>
          ) : (
            <View style={styles.previewLoading}>
              <Text style={styles.loadingText}>No preview available</Text>
            </View>
          )}
        </View>

        {/* Transform controls */}
        {!isLoadingFrames && currentPreviewUri && (
          <View style={styles.transformControls}>
            {transform.scale > 1 && (
              <TouchableOpacity style={styles.resetButton} onPress={resetTransform}>
                <Ionicons name="refresh" size={16} color="#FFD700" />
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.transformHint}>
              {transform.scale > 1 ? `${Math.round(transform.scale * 100)}%` : 'Pinch to zoom • Drag to position'}
            </Text>
          </View>
        )}

        {/* Time badge */}
        {!isLoadingFrames && (
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>{formatTime(position)}</Text>
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
        <Text style={styles.filmstripLabel}>Drag to select frame</Text>
        
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
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  transformControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 12,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  resetButtonText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '500',
  },
  transformHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
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
