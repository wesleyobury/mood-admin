import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
  Image,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  PanGestureHandler,
  PinchGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import ReanimatedModule, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FILMSTRIP_HEIGHT = 56;
const FRAME_COUNT = 10;
const TOTAL_FRAMES = 30;
const FILMSTRIP_WIDTH = SCREEN_WIDTH - 32;
const SCRUBBER_WIDTH = 4;

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
}) => {
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);
  const [duration, setDuration] = useState(0);
  const [allFrames, setAllFrames] = useState<Frame[]>([]);
  const [isLoadingFrames, setIsLoadingFrames] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Reanimated shared values for smooth gestures
  const scrubberX = useSharedValue(FILMSTRIP_WIDTH / 2);
  const imageScale = useSharedValue(1);
  const imageTranslateX = useSharedValue(0);
  const imageTranslateY = useSharedValue(0);
  
  // For pinch gesture
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Update frame index from scrubber position
  const updateFrameFromScrubber = useCallback((x: number) => {
    if (allFrames.length === 0) return;
    const percentage = Math.max(0, Math.min(x / FILMSTRIP_WIDTH, 1));
    const index = Math.round(percentage * (allFrames.length - 1));
    setCurrentFrameIndex(Math.max(0, Math.min(index, allFrames.length - 1)));
  }, [allFrames.length]);

  // Scrubber pan gesture - using gesture handler for smooth response
  const scrubberGesture = Gesture.Pan()
    .onStart(() => {
      // Store starting position
    })
    .onUpdate((event) => {
      const newX = Math.max(0, Math.min(event.x, FILMSTRIP_WIDTH));
      scrubberX.value = newX;
      runOnJS(updateFrameFromScrubber)(newX);
    })
    .onEnd(() => {
      // Snap to nearest frame
      if (allFrames.length > 0) {
        const percentage = scrubberX.value / FILMSTRIP_WIDTH;
        const index = Math.round(percentage * (allFrames.length - 1));
        const snappedX = (index / (allFrames.length - 1)) * FILMSTRIP_WIDTH;
        scrubberX.value = withTiming(snappedX, { duration: 100 });
      }
    });

  // Tap gesture for filmstrip
  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      const newX = Math.max(0, Math.min(event.x, FILMSTRIP_WIDTH));
      scrubberX.value = withTiming(newX, { duration: 150 });
      runOnJS(updateFrameFromScrubber)(newX);
    });

  // Combined filmstrip gesture
  const filmstripGesture = Gesture.Race(scrubberGesture, tapGesture);

  // Image pinch-to-zoom gesture
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = imageScale.value;
    })
    .onUpdate((event) => {
      const newScale = Math.max(1, Math.min(savedScale.value * event.scale, 4));
      imageScale.value = newScale;
    })
    .onEnd(() => {
      if (imageScale.value < 1.1) {
        imageScale.value = withSpring(1);
        imageTranslateX.value = withSpring(0);
        imageTranslateY.value = withSpring(0);
      }
    });

  // Image pan gesture
  const imagePanGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = imageTranslateX.value;
      savedTranslateY.value = imageTranslateY.value;
    })
    .onUpdate((event) => {
      if (imageScale.value > 1) {
        const maxTranslate = (imageScale.value - 1) * 80;
        imageTranslateX.value = Math.max(-maxTranslate, Math.min(maxTranslate, 
          savedTranslateX.value + event.translationX));
        imageTranslateY.value = Math.max(-maxTranslate, Math.min(maxTranslate, 
          savedTranslateY.value + event.translationY));
      }
    })
    .onEnd(() => {
      // Snap back if needed
      const maxTranslate = (imageScale.value - 1) * 80;
      if (Math.abs(imageTranslateX.value) > maxTranslate) {
        imageTranslateX.value = withSpring(Math.sign(imageTranslateX.value) * maxTranslate);
      }
      if (Math.abs(imageTranslateY.value) > maxTranslate) {
        imageTranslateY.value = withSpring(Math.sign(imageTranslateY.value) * maxTranslate);
      }
    });

  // Combined image gesture - pinch and pan together
  const imageGesture = Gesture.Simultaneous(pinchGesture, imagePanGesture);

  // Animated styles
  const scrubberAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrubberX.value - SCRUBBER_WIDTH / 2 }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: imageScale.value },
      { translateX: imageTranslateX.value },
      { translateY: imageTranslateY.value },
    ],
  }));

  // Generate frames
  useEffect(() => {
    if (duration > 0 && allFrames.length === 0) {
      generateFrames();
    }
  }, [duration]);

  const generateFrames = async () => {
    if (Platform.OS === 'web') {
      setIsLoadingFrames(false);
      return;
    }

    try {
      setIsLoadingFrames(true);
      const frames: Frame[] = [];
      const interval = duration / TOTAL_FRAMES;

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        try {
          const timestamp = Math.round(i * interval);
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: timestamp,
            quality: 0.7,
          });
          frames.push({ uri, timestamp });
        } catch (e) {
          if (frames.length > 0) {
            frames.push({ ...frames[frames.length - 1] });
          }
        }
      }

      setAllFrames(frames);
      if (frames.length > 0) {
        const mid = Math.floor(frames.length / 2);
        setCurrentFrameIndex(mid);
        scrubberX.value = (mid / (frames.length - 1)) * FILMSTRIP_WIDTH;
      }
    } catch (err) {
      setError('Failed to generate frames');
    } finally {
      setIsLoadingFrames(false);
    }
  };

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded && status.durationMillis) {
      setDuration(status.durationMillis);
    }
  }, []);

  const resetTransform = () => {
    imageScale.value = withSpring(1);
    imageTranslateX.value = withSpring(0);
    imageTranslateY.value = withSpring(0);
  };

  const handleDone = async () => {
    if (allFrames.length === 0 || !allFrames[currentFrameIndex]?.uri) return;
    setIsCapturing(true);
    try {
      onFrameSelected(allFrames[currentFrameIndex].uri);
    } finally {
      setIsCapturing(false);
    }
  };

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
  };

  const currentFrame = allFrames[currentFrameIndex];
  const filmstripFrames = allFrames.filter((_, i) => i % Math.max(1, Math.floor(TOTAL_FRAMES / FRAME_COUNT)) === 0).slice(0, FRAME_COUNT);
  const showResetButton = imageScale.value > 1.05;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.headerBtn}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cover</Text>
          <View style={styles.headerBtn} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.grayText}>Cover selection is only available on mobile</Text>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.headerBtn}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cover</Text>
          <TouchableOpacity 
            onPress={handleDone} 
            style={styles.headerBtn}
            disabled={isCapturing || isLoadingFrames}
          >
            {isCapturing ? (
              <ActivityIndicator size="small" color="#FFD700" />
            ) : (
              <Text style={[styles.doneText, isLoadingFrames && styles.disabledText]}>Done</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Preview */}
        <View style={styles.previewSection}>
          <GestureDetector gesture={imageGesture}>
            <View style={styles.previewBox}>
              {isLoadingFrames ? (
                <View style={styles.centered}>
                  <ActivityIndicator size="large" color="#FFD700" />
                  <Text style={styles.loadingText}>Loading frames...</Text>
                </View>
              ) : currentFrame?.uri ? (
                <ReanimatedModule.View style={[styles.imageContainer, imageAnimatedStyle]}>
                  <Image source={{ uri: currentFrame.uri }} style={styles.previewImage} resizeMode="cover" />
                </ReanimatedModule.View>
              ) : (
                <View style={styles.centered}>
                  <Text style={styles.grayText}>No preview</Text>
                </View>
              )}
              
              {/* Crop corners */}
              <View style={styles.cropGuide} pointerEvents="none">
                <View style={[styles.corner, styles.tl]} />
                <View style={[styles.corner, styles.tr]} />
                <View style={[styles.corner, styles.bl]} />
                <View style={[styles.corner, styles.br]} />
              </View>
            </View>
          </GestureDetector>

          {/* Hint */}
          <View style={styles.hintRow}>
            {showResetButton && (
              <TouchableOpacity style={styles.resetBtn} onPress={resetTransform}>
                <Ionicons name="refresh" size={14} color="#FFD700" />
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.hintText}>Pinch to zoom • Drag to reposition</Text>
          </View>

          {/* Time */}
          {currentFrame && (
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>{formatTime(currentFrame.timestamp)}</Text>
            </View>
          )}
        </View>

        {/* Hidden video */}
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.hiddenVideo}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isMuted
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {/* Filmstrip */}
        <View style={styles.filmstripSection}>
          <Text style={styles.filmstripLabel}>Slide to choose frame</Text>
          
          <GestureDetector gesture={filmstripGesture}>
            <View style={styles.filmstripTouchArea}>
              <View style={styles.filmstrip}>
                {isLoadingFrames ? (
                  <View style={styles.filmstripLoading}>
                    <ActivityIndicator size="small" color="#FFD700" />
                  </View>
                ) : (
                  filmstripFrames.map((frame, i) => (
                    <View key={i} style={styles.filmstripFrame}>
                      {frame?.uri && <Image source={{ uri: frame.uri }} style={styles.filmstripImg} />}
                    </View>
                  ))
                )}
              </View>
              
              {/* Scrubber */}
              {!isLoadingFrames && allFrames.length > 0 && (
                <ReanimatedModule.View style={[styles.scrubber, scrubberAnimatedStyle]}>
                  <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.scrubberBar} />
                  <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.scrubberKnob}>
                    <View style={styles.scrubberDot} />
                  </LinearGradient>
                </ReanimatedModule.View>
              )}
            </View>
          </GestureDetector>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>0:00</Text>
            <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorBar}>
            <Ionicons name="warning" size={14} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.footer}>This will be your cover in the feed</Text>
      </View>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  headerBtn: { width: 60, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#fff' },
  doneText: { fontSize: 16, fontWeight: '600', color: '#FFD700' },
  disabledText: { color: '#555' },
  previewSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  previewBox: { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, backgroundColor: '#111', borderRadius: 12, overflow: 'hidden' },
  imageContainer: { width: '100%', height: '100%' },
  previewImage: { width: '100%', height: '100%' },
  cropGuide: { ...StyleSheet.absoluteFillObject, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  corner: { position: 'absolute', width: 20, height: 20, borderColor: '#FFD700' },
  tl: { top: 8, left: 8, borderLeftWidth: 2, borderTopWidth: 2 },
  tr: { top: 8, right: 8, borderRightWidth: 2, borderTopWidth: 2 },
  bl: { bottom: 8, left: 8, borderLeftWidth: 2, borderBottomWidth: 2 },
  br: { bottom: 8, right: 8, borderRightWidth: 2, borderBottomWidth: 2 },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,215,0,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, gap: 4 },
  resetText: { color: '#FFD700', fontSize: 12, fontWeight: '500' },
  hintText: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  timeBadge: { position: 'absolute', top: 12, right: 28, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  timeText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  hiddenVideo: { width: 1, height: 1, position: 'absolute', opacity: 0 },
  filmstripSection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  filmstripLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 12 },
  filmstripTouchArea: { height: FILMSTRIP_HEIGHT + 28, justifyContent: 'center' },
  filmstrip: { flexDirection: 'row', height: FILMSTRIP_HEIGHT, borderRadius: 6, overflow: 'hidden', backgroundColor: '#1a1a1a' },
  filmstripLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filmstripFrame: { flex: 1, height: FILMSTRIP_HEIGHT, backgroundColor: '#222' },
  filmstripImg: { width: '100%', height: '100%' },
  scrubber: { position: 'absolute', top: 0, left: 0, height: FILMSTRIP_HEIGHT + 28, alignItems: 'center' },
  scrubberBar: { width: SCRUBBER_WIDTH, height: FILMSTRIP_HEIGHT + 16, marginTop: 6, borderRadius: 2 },
  scrubberKnob: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: -4 },
  scrubberDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#000' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  timeLabel: { fontSize: 11, color: '#555' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 14 },
  grayText: { color: '#888', fontSize: 14, textAlign: 'center' },
  errorBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,107,107,0.15)', paddingVertical: 8, marginHorizontal: 16, borderRadius: 8, gap: 6 },
  errorText: { color: '#FF6B6B', fontSize: 12 },
  footer: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingHorizontal: 32, paddingBottom: 16 },
});

export default VideoFrameSelector;
