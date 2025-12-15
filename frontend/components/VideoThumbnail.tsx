import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';

interface VideoThumbnailProps {
  videoUrl: string;
  style?: any;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ videoUrl, style }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    generateThumbnail();
  }, [videoUrl]);

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

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" color="#FFD700" />
      </View>
    );
  }

  if (error || !thumbnail) {
    return (
      <View style={[styles.container, style]}>
        <Ionicons name="play-circle" size={40} color="#fff" />
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
