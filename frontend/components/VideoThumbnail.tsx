import React, { useState, useEffect, memo } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';

interface VideoThumbnailProps {
  videoUrl: string;
  coverUrl?: string | null;
  style?: any;
}

// Cache for generated thumbnails to avoid regenerating
const thumbnailCache: { [key: string]: string } = {};

const VideoThumbnail: React.FC<VideoThumbnailProps> = memo(({ videoUrl, coverUrl, style }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(coverUrl || thumbnailCache[videoUrl] || null);
  const [loading, setLoading] = useState(!coverUrl && !thumbnailCache[videoUrl]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If we have a cover URL, use it directly
    if (coverUrl) {
      setThumbnail(coverUrl);
      setLoading(false);
      setError(false);
      return;
    }
    
    // Check cache first
    if (thumbnailCache[videoUrl]) {
      setThumbnail(thumbnailCache[videoUrl]);
      setLoading(false);
      setError(false);
      return;
    }
    
    // Generate thumbnail on native platforms
    if (Platform.OS !== 'web') {
      generateThumbnail();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [videoUrl, coverUrl]);

  const generateThumbnail = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
        time: 1000,
        quality: 0.7, // Slightly higher quality for better appearance
      });
      
      // Cache the generated thumbnail
      thumbnailCache[videoUrl] = uri;
      setThumbnail(uri);
    } catch (e) {
      console.log('Thumbnail generation failed for:', videoUrl);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" color="#FFD700" />
      </View>
    );
  }

  if (error || !thumbnail) {
    return (
      <View style={[styles.container, styles.fallbackContainer, style]}>
        <View style={styles.videoIconWrapper}>
          <Ionicons name="videocam" size={28} color="#FFD700" />
        </View>
        <View style={styles.playIconOverlay}>
          <Ionicons name="play-circle" size={32} color="rgba(255, 255, 255, 0.9)" />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={{ uri: thumbnail }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={100}
        cachePolicy="memory-disk"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
      <View style={styles.playOverlay}>
        <Ionicons name="play-circle" size={32} color="rgba(255, 255, 255, 0.9)" />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContainer: {
    backgroundColor: '#0c0c0c',
  },
  videoIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});

export default VideoThumbnail;
