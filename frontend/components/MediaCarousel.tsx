import React, { useState, useRef, memo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Helper to detect if a URL is a video
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.m4v'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext));
};

interface MediaCarouselProps {
  media: string[];
}

interface VideoPlayerProps {
  uri: string;
  isActive: boolean;
}

const VideoPlayer = memo(({ uri, isActive }: VideoPlayerProps) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      if (!isSeeking) {
        setPosition(status.positionMillis || 0);
      }
      setDuration(status.durationMillis || 0);
      if (status.didJustFinish) {
        // Loop the video
        videoRef.current?.replayAsync();
      }
    }
  }, [isSeeking]);

  const togglePlayPause = useCallback(async () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(async () => {
    if (!videoRef.current) return;
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleSeekStart = useCallback(() => {
    setIsSeeking(true);
  }, []);

  const handleSeekComplete = useCallback(async (value: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value);
    }
    setIsSeeking(false);
  }, []);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Auto-pause when not active
  React.useEffect(() => {
    if (!isActive && videoRef.current && isPlaying) {
      videoRef.current.pauseAsync();
    }
  }, [isActive, isPlaying]);

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="videocam-off-outline" size={48} color="#666" />
        <Text style={styles.errorText}>Failed to load video</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.videoContainer} 
      activeOpacity={1}
      onPress={togglePlayPause}
    >
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isActive}
        isLooping
        isMuted={isMuted}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={(error) => {
          console.error('Video error:', error);
          setHasError(true);
        }}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}
      
      {/* Play/Pause overlay - shown when paused */}
      {!isPlaying && !isLoading && (
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={40} color="#fff" />
          </View>
        </View>
      )}
      
      {/* Video indicator badge */}
      <View style={styles.videoBadge}>
        <Ionicons name="videocam" size={14} color="#fff" />
      </View>
      
      {/* Mute/Unmute button */}
      <TouchableOpacity 
        style={styles.muteButton}
        onPress={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
      >
        <Ionicons 
          name={isMuted ? "volume-mute" : "volume-high"} 
          size={18} 
          color="#fff" 
        />
      </TouchableOpacity>

      {/* Video Scrubber/Progress Bar */}
      {duration > 0 && (
        <View style={styles.scrubberContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingStart={handleSeekStart}
              onSlidingComplete={handleSeekComplete}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
              thumbTintColor="#FFD700"
            />
          </View>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const MediaCarousel = memo(({ media }: MediaCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const [errorStates, setErrorStates] = useState<{ [key: number]: boolean }>({});
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    if (index !== activeIndex && index >= 0 && index < media.length) {
      setActiveIndex(index);
    }
  };

  const handleLoadStart = (index: number) => {
    setLoadingStates(prev => ({ ...prev, [index]: true }));
  };

  const handleLoadEnd = (index: number) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
  };

  const handleError = (index: number, error: any) => {
    console.error(`Error loading media ${index}:`, error);
    setErrorStates(prev => ({ ...prev, [index]: true }));
    setLoadingStates(prev => ({ ...prev, [index]: false }));
  };

  if (!media || media.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
      >
        {media.map((mediaUrl, index) => {
          const isVideo = isVideoUrl(mediaUrl);
          
          return (
            <View key={`${mediaUrl}-${index}`} style={styles.mediaContainer}>
              {isVideo ? (
                <VideoPlayer 
                  uri={mediaUrl} 
                  isActive={index === activeIndex}
                />
              ) : (
                <>
                  <Image
                    source={mediaUrl}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                    priority="high"
                    placeholderContentFit="cover"
                    placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                    onLoadStart={() => handleLoadStart(index)}
                    onLoad={() => handleLoadEnd(index)}
                    onError={(e) => handleError(index, e)}
                  />
                  {loadingStates[index] && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#FFD700" />
                    </View>
                  )}
                  {errorStates[index] && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="image-outline" size={48} color="#666" />
                      <Text style={styles.errorText}>Failed to load image</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Dot Indicators */}
      {media.length > 1 && (
        <View style={styles.dotsContainer}>
          {media.map((url, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25, // 4:5 aspect ratio (portrait)
    backgroundColor: '#000',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
    backgroundColor: '#1a1a1a',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
    backgroundColor: '#000',
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorText: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5, // Offset for play icon visual center
  },
  videoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  muteButton: {
    position: 'absolute',
    bottom: 50,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#FFD700',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default MediaCarousel;
