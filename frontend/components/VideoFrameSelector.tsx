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
} from 'react-native';
import { Image } from 'expo-image';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FRAME_WIDTH = 60;
const FRAME_HEIGHT = 75; // 4:5 aspect ratio

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
  const videoRef = useRef<Video>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewFrames, setPreviewFrames] = useState<Frame[]>([]);
  const [framesLoading, setFramesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Current captured frame for preview
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);

  // Generate preview frames for quick selection
  useEffect(() => {
    generatePreviewFrames();
  }, [videoUri]);

  const generatePreviewFrames = async () => {
    if (Platform.OS === 'web') {
      setFramesLoading(false);
      return;
    }

    try {
      setFramesLoading(true);
      const frames: Frame[] = [];
      
      // Generate frames at various timestamps (0s to 30s max)
      const timestamps = [0, 1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000, 30000];
      
      for (const timestamp of timestamps) {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: timestamp,
            quality: 0.6,
          });
          frames.push({ uri, timestamp });
        } catch (e) {
          // Video might be shorter than this timestamp
          break;
        }
      }

      setPreviewFrames(frames);
    } catch (err) {
      console.error('Error generating preview frames:', err);
    } finally {
      setFramesLoading(false);
    }
  };

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsVideoReady(true);
      if (status.durationMillis) {
        setDuration(status.durationMillis);
      }
      if (!isSeeking && status.positionMillis !== undefined) {
        setPosition(status.positionMillis);
      }
    }
  }, [isSeeking]);

  const handleSliderValueChange = useCallback((value: number) => {
    setPosition(value);
  }, []);

  const handleSliderSlidingStart = useCallback(() => {
    setIsSeeking(true);
    // Pause video while seeking for smoother experience
    videoRef.current?.pauseAsync();
  }, []);

  const handleSliderSlidingComplete = useCallback(async (value: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value);
    }
    setPosition(value);
    setIsSeeking(false);
  }, []);

  const handlePreviewFrameTap = useCallback(async (frame: Frame) => {
    // Seek video to this timestamp
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(frame.timestamp);
      setPosition(frame.timestamp);
    }
  }, []);

  const captureCurrentFrame = async () => {
    if (Platform.OS === 'web') {
      setError('Frame capture is not available on web');
      return;
    }

    setIsCapturing(true);
    try {
      // Pause video to get exact frame
      await videoRef.current?.pauseAsync();
      
      // Generate thumbnail at current position
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: position,
        quality: 0.9,
      });
      
      setCapturedFrame(uri);
    } catch (err) {
      console.error('Error capturing frame:', err);
      setError('Failed to capture frame. Try a different position.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirm = () => {
    if (capturedFrame) {
      onFrameSelected(capturedFrame);
    }
  };

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (Platform.OS === 'web') {
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
          <Text style={styles.errorText}>Frame selection is only available on mobile devices</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Go Back</Text>
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
          disabled={!capturedFrame}
        >
          <Text style={[
            styles.doneText,
            !capturedFrame && styles.doneTextDisabled
          ]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>

      {/* Video Preview */}
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

        {/* Current time indicator */}
        <View style={styles.timeIndicator}>
          <Ionicons name="time-outline" size={14} color="#fff" />
          <Text style={styles.timeText}>{formatTime(position)}</Text>
        </View>
      </View>

      {/* Scrubber / Timeline */}
      <View style={styles.scrubberContainer}>
        <Text style={styles.scrubberLabel}>Drag to find the perfect frame</Text>
        <View style={styles.sliderRow}>
          <Text style={styles.timeLabel}>{formatTime(0)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            onValueChange={handleSliderValueChange}
            onSlidingStart={handleSliderSlidingStart}
            onSlidingComplete={handleSliderSlidingComplete}
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
            thumbTintColor="#FFD700"
          />
          <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Capture Button */}
      <View style={styles.captureSection}>
        <TouchableOpacity 
          style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
          onPress={captureCurrentFrame}
          disabled={isCapturing || !isVideoReady}
        >
          {isCapturing ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <>
              <Ionicons name="camera" size={20} color="#000" />
              <Text style={styles.captureButtonText}>Capture This Frame</Text>
            </>
          )}
        </TouchableOpacity>
        
        {capturedFrame && (
          <View style={styles.capturedPreview}>
            <Image
              source={{ uri: capturedFrame }}
              style={styles.capturedImage}
              contentFit="cover"
            />
            <View style={styles.capturedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.capturedText}>Selected</Text>
            </View>
          </View>
        )}
      </View>

      {/* Quick Select Frames */}
      {previewFrames.length > 0 && (
        <View style={styles.quickSelectContainer}>
          <Text style={styles.quickSelectLabel}>Or quick select:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.framesScrollContent}
          >
            {previewFrames.map((frame, index) => (
              <TouchableOpacity
                key={`frame-${index}`}
                style={styles.frameItem}
                onPress={() => handlePreviewFrameTap(frame)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: frame.uri }}
                  style={styles.frameImage}
                  contentFit="cover"
                />
                <View style={styles.frameTimestamp}>
                  <Text style={styles.frameTimestampText}>
                    {formatTime(frame.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {framesLoading && (
        <View style={styles.framesLoadingContainer}>
          <ActivityIndicator size="small" color="#FFD700" />
          <Text style={styles.framesLoadingText}>Loading preview frames...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color="#FF6B6B" />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}
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
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75, // 4:3 for video preview
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    marginTop: 12,
    color: '#888',
    fontSize: 14,
  },
  timeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  timeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  scrubberContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrubberLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  timeLabel: {
    fontSize: 12,
    color: '#888',
    width: 40,
    textAlign: 'center',
  },
  captureSection: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  captureButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  capturedPreview: {
    position: 'relative',
  },
  capturedImage: {
    width: 70,
    height: 87.5, // 4:5 aspect ratio
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  capturedBadge: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  capturedText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  quickSelectContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickSelectLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  framesScrollContent: {
    paddingHorizontal: 12,
  },
  frameItem: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    marginHorizontal: 4,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  frameImage: {
    width: '100%',
    height: '100%',
  },
  frameTimestamp: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  frameTimestampText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '500',
  },
  framesLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  framesLoadingText: {
    color: '#888',
    fontSize: 12,
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
  cancelButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  errorBannerText: {
    color: '#FF6B6B',
    fontSize: 13,
  },
});

export default VideoFrameSelector;
