import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';

interface VideoThumbnailProps {
  videoUrl: string;
  coverUrl?: string | null; // Pre-generated cover image URL
  style?: any;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ videoUrl, coverUrl, style }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(coverUrl || null);
  const [loading, setLoading] = useState(!coverUrl);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If we have a cover URL, use it directly
    if (coverUrl) {
      setThumbnail(coverUrl);
      setLoading(false);
      setError(false);
      return;
    }
    
    // Otherwise try to generate thumbnail (skip on web as it often fails)
    if (Platform.OS !== 'web') {
      generateThumbnail();
    } else {
      // On web, just show the fallback immediately
      setLoading(false);
      setError(true);
    }
  }, [videoUrl, coverUrl]);

  const generateThumbnail = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
        time: 1000, // Get frame at 1 second
        quality: 0.5,
      });
      
      setThumbnail(uri);
    } catch (e) {
      console.log('Thumbnail generation failed for:', videoUrl);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" color="#FFD700" />
      </View>
    );
  }

  // Show fallback with video icon when no thumbnail available
  if (error || !thumbnail) {
    return (
      <View style={[styles.container, styles.fallbackContainer, style]}>
        <View style={styles.videoIconWrapper}>
          <Ionicons name="videocam" size={32} color="#FFD700" />
        </View>
        <View style={styles.playIconOverlay}>
          <Ionicons name="play-circle" size={40} color="rgba(255, 255, 255, 0.9)" />
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
      />
      <View style={styles.playOverlay}>
        <Ionicons name="play-circle" size={36} color="rgba(255, 255, 255, 0.9)" />
      </View>
    </View>
  );
};

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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  playIconOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default VideoThumbnail;
