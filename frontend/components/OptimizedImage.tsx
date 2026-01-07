import React, { useState, useEffect, memo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

interface OptimizedImageProps {
  source: string;
  style?: any;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: string;
  showRetry?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

// Prefetch queue for images
const prefetchQueue: string[] = [];
let isPrefetching = false;

export const prefetchImages = async (urls: string[]) => {
  prefetchQueue.push(...urls.filter(url => url && url.startsWith('http')));
  if (!isPrefetching) {
    processPrefetchQueue();
  }
};

const processPrefetchQueue = async () => {
  if (prefetchQueue.length === 0) {
    isPrefetching = false;
    return;
  }
  
  isPrefetching = true;
  const batch = prefetchQueue.splice(0, 5); // Process 5 at a time
  
  try {
    await Promise.all(batch.map(url => Image.prefetch(url)));
  } catch (e) {
    // Silently fail prefetch errors
  }
  
  // Continue with next batch
  setTimeout(processPrefetchQueue, 100);
};

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  source,
  style,
  contentFit = 'cover',
  placeholder,
  showRetry = true,
  onLoad,
  onError,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSource, setCurrentSource] = useState(source);

  useEffect(() => {
    setCurrentSource(source);
    setError(false);
    setLoading(true);
  }, [source]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
    onError?.();
  }, [onError]);

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setLoading(true);
      setError(false);
      // Add cache buster for retry
      const separator = source.includes('?') ? '&' : '?';
      setCurrentSource(`${source}${separator}_retry=${Date.now()}`);
    }
  }, [source, retryCount]);

  if (error && showRetry) {
    return (
      <View style={[styles.container, style, styles.errorContainer]}>
        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Ionicons name="refresh" size={24} color="#FFD700" />
          <Text style={styles.retryText}>
            {retryCount >= 3 ? 'Failed to load' : 'Tap to retry'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#FFD700" />
        </View>
      )}
      <Image
        source={{ uri: currentSource }}
        style={StyleSheet.absoluteFill}
        contentFit={contentFit}
        transition={150}
        cachePolicy="memory-disk"
        placeholder={placeholder ? { uri: placeholder } : { blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        onLoad={handleLoad}
        onError={handleError}
        recyclingKey={source}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  retryButton: {
    alignItems: 'center',
    padding: 16,
  },
  retryText: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },
});

export default OptimizedImage;
