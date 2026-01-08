import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, TouchableOpacity, AppState, Platform } from 'react-native';
import Constants from 'expo-constants';

// Get API URL with multiple fallbacks
const getApiUrl = (): string => {
  // Try process.env first (works in development/preview)
  if (process.env.EXPO_PUBLIC_BACKEND_URL) {
    return process.env.EXPO_PUBLIC_BACKEND_URL;
  }
  // Try expo config extra (works in production builds)
  if (Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL) {
    return Constants.expoConfig.extra.EXPO_PUBLIC_BACKEND_URL;
  }
  // Try manifest extra (older expo versions)
  if (Constants.manifest?.extra?.EXPO_PUBLIC_BACKEND_URL) {
    return Constants.manifest.extra.EXPO_PUBLIC_BACKEND_URL;
  }
  // Fallback for production - construct from experienceUrl
  if (Constants.expoConfig?.hostUri) {
    const host = Constants.expoConfig.hostUri.split(':')[0];
    return `https://${host}`;
  }
  return '';
};

interface AppBootstrapProps {
  children: React.ReactNode;
  onReady?: () => void;
}

type BootPhase = 'splash' | 'environment' | 'health' | 'ready' | 'error';

const AppBootstrap: React.FC<AppBootstrapProps> = ({ children, onReady }) => {
  const [phase, setPhase] = useState<BootPhase>('splash');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const mountedRef = useRef(true);
  const initStartedRef = useRef(false);
  
  const MAX_RETRIES = 3;
  const HEALTH_CHECK_TIMEOUT = 8000;
  const RETRY_DELAY = 1000;

  // Pulse animation for logo
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Health check with timeout
  const checkBackendHealth = useCallback(async (apiUrl: string): Promise<boolean> => {
    if (!apiUrl) {
      console.log('AppBootstrap: No API URL, skipping health check');
      return true;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);

    try {
      console.log(`AppBootstrap: Health check -> ${apiUrl}/api/health`);
      const response = await fetch(`${apiUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('AppBootstrap: Health check passed:', data);
        return true;
      }
      console.warn('AppBootstrap: Health check failed:', response.status);
      return false;
    } catch (error: any) {
      clearTimeout(timeoutId);
      const msg = error.name === 'AbortError' ? 'timeout' : error.message;
      console.warn('AppBootstrap: Health check error:', msg);
      return false;
    }
  }, []);

  // Main initialization
  const initialize = useCallback(async () => {
    if (!mountedRef.current) return;
    
    console.log('AppBootstrap: Starting initialization...');
    
    // Phase 1: Splash (brief pause for UX)
    setPhase('splash');
    setStatusMessage('');
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!mountedRef.current) return;

    // Phase 2: Check environment
    setPhase('environment');
    setStatusMessage('Loading...');
    
    const apiUrl = getApiUrl();
    console.log('AppBootstrap: API URL =', apiUrl || '(none)');
    
    await new Promise(resolve => setTimeout(resolve, 200));
    if (!mountedRef.current) return;

    // Phase 3: Health check with retries
    setPhase('health');
    setStatusMessage('Connecting...');
    
    let healthy = false;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      if (!mountedRef.current) return;
      
      console.log(`AppBootstrap: Health check attempt ${attempt}/${MAX_RETRIES}`);
      healthy = await checkBackendHealth(apiUrl);
      
      if (healthy) break;
      
      if (attempt < MAX_RETRIES) {
        setStatusMessage(`Retrying (${attempt}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
    
    if (!mountedRef.current) return;

    // Even if health check fails, proceed (app will handle gracefully)
    if (!healthy) {
      console.warn('AppBootstrap: Proceeding despite health check failure');
      setStatusMessage('Starting offline...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Phase 4: Ready - fade out and show app
    setPhase('ready');
    setStatusMessage('Ready');
    
    // Small delay before fade for smoother transition
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!mountedRef.current) return;

    // Fade out loading screen
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (mountedRef.current) {
        setIsReady(true);
        onReady?.();
      }
    });
  }, [checkBackendHealth, fadeAnim, onReady]);

  // Start initialization once
  useEffect(() => {
    mountedRef.current = true;
    
    if (!initStartedRef.current) {
      initStartedRef.current = true;
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(initialize, 50);
      return () => clearTimeout(timer);
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [initialize]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setErrorMessage('');
    setPhase('splash');
    initStartedRef.current = false;
    initialize();
  }, [initialize]);

  // Show children when ready
  if (isReady) {
    return <>{children}</>;
  }

  // Loading screen
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loadingScreen, { opacity: fadeAnim }]}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.logoText}>MOOD</Text>
          <Text style={styles.logoSubtext}>FITNESS</Text>
        </Animated.View>

        {/* Loading indicator */}
        <View style={styles.loadingArea}>
          {phase === 'error' ? (
            <>
              <Text style={styles.errorText}>{errorMessage || 'Connection failed'}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Tap to Retry</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color="#FFD700" />
              {statusMessage ? (
                <Text style={styles.statusText}>{statusMessage}</Text>
              ) : null}
            </>
          )}
        </View>

        {/* Phase indicators */}
        <View style={styles.phaseIndicators}>
          <View style={[styles.phaseIndicator, phase !== 'splash' && styles.phaseComplete]} />
          <View style={[styles.phaseIndicator, (phase === 'ready' || phase === 'health') && styles.phaseComplete]} />
          <View style={[styles.phaseIndicator, phase === 'ready' && styles.phaseComplete]} />
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
  loadingScreen: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 10,
  },
  logoSubtext: {
    fontSize: 13,
    color: '#666',
    letterSpacing: 8,
    marginTop: 8,
  },
  loadingArea: {
    alignItems: 'center',
    minHeight: 80,
  },
  statusText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    letterSpacing: 1,
  },
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  retryButtonText: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '600',
  },
  phaseIndicators: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
  },
  phaseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  phaseComplete: {
    backgroundColor: '#FFD700',
  },
});

export default AppBootstrap;
