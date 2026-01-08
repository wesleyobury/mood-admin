import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Image } from 'expo-image';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

interface AppBootstrapProps {
  children: React.ReactNode;
  onReady?: () => void;
}

type BootState = 'initializing' | 'checking' | 'ready' | 'error';

const AppBootstrap: React.FC<AppBootstrapProps> = ({ children, onReady }) => {
  const [bootState, setBootState] = useState<BootState>('initializing');
  const [statusMessage, setStatusMessage] = useState('Starting up...');
  const [retryCount, setRetryCount] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [showChildren, setShowChildren] = useState(false);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1500;

  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    if (!API_URL) {
      console.log('No API_URL configured, skipping health check');
      return true; // Allow app to proceed without backend
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      console.log('Checking backend health:', `${API_URL}/api/health`);
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend health check passed:', data);
        return true;
      } else {
        console.warn('Backend health check failed with status:', response.status);
        return false;
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.warn('Backend health check timed out');
      } else {
        console.warn('Backend health check error:', error.message);
      }
      return false;
    }
  }, []);

  const initialize = useCallback(async () => {
    console.log('AppBootstrap: Starting initialization...');
    setBootState('initializing');
    setStatusMessage('Starting up...');

    // Brief delay to ensure splash screen is visible
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check environment variables
    console.log('AppBootstrap: API_URL =', API_URL);
    if (!API_URL) {
      console.warn('AppBootstrap: No API_URL configured');
      setStatusMessage('Connecting...');
    }

    // Check backend health with retries
    setBootState('checking');
    setStatusMessage('Connecting to server...');

    let healthCheckPassed = false;
    let attempts = 0;

    while (!healthCheckPassed && attempts < MAX_RETRIES) {
      attempts++;
      console.log(`AppBootstrap: Health check attempt ${attempts}/${MAX_RETRIES}`);
      
      healthCheckPassed = await checkBackendHealth();
      
      if (!healthCheckPassed && attempts < MAX_RETRIES) {
        setStatusMessage(`Retrying connection (${attempts}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }

    if (!healthCheckPassed) {
      console.warn('AppBootstrap: Backend health check failed after all retries, proceeding anyway');
      setStatusMessage('Offline mode...');
      // Still allow app to proceed - it will handle errors gracefully
    }

    // Ready to show app
    setBootState('ready');
    setStatusMessage('Ready!');

    // Fade out loading screen
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowChildren(true);
      onReady?.();
    });

  }, [checkBackendHealth, fadeAnim, onReady]);

  useEffect(() => {
    initialize();
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    initialize();
  }, [initialize]);

  // Always render children in background for faster perceived loading
  // But only show them after boot is complete
  if (showChildren) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {/* Render children in background but hidden */}
      <View style={styles.hiddenChildren}>
        {children}
      </View>
      
      {/* Loading overlay */}
      <Animated.View style={[styles.loadingOverlay, { opacity: fadeAnim }]}>
        <View style={styles.content}>
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>MOOD</Text>
            <Text style={styles.logoSubtext}>FITNESS</Text>
          </View>

          {/* Loading indicator */}
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>

          {/* Progress dots */}
          <View style={styles.progressDots}>
            <View style={[styles.dot, bootState !== 'initializing' && styles.dotActive]} />
            <View style={[styles.dot, bootState === 'ready' && styles.dotActive]} />
            <View style={[styles.dot, bootState === 'ready' && styles.dotActive]} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  hiddenChildren: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 8,
  },
  logoSubtext: {
    fontSize: 14,
    color: '#888888',
    letterSpacing: 6,
    marginTop: 8,
  },
  loadingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusText: {
    marginTop: 16,
    fontSize: 14,
    color: '#888888',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
  },
  dotActive: {
    backgroundColor: '#FFD700',
  },
});

export default AppBootstrap;
