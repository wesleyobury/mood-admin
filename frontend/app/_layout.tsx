import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { Analytics } from '../utils/analytics';
import FloatingCart from '../components/FloatingCart';
import ErrorBoundary from '../components/ErrorBoundary';
import AppBootstrap from '../components/AppBootstrap';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// App State Tracker Component
function AppStateTracker() {
  const { token } = useAuth();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (token) {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          // App came to foreground
          Analytics.appOpened(token);
        } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
          // App went to background
          Analytics.appBackgrounded(token);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [token]);

  return null;
}

// Main App Content - separated to decouple from initialization
function AppContent() {
  return (
    <>
      <AppStateTracker />
      <Stack 
        screenOptions={{ 
          headerShown: false, 
          contentStyle: { backgroundColor: '#000000' },
          animation: 'default'
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: '', contentStyle: { backgroundColor: '#000000' } }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '', contentStyle: { backgroundColor: '#000000' } }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false, title: '', contentStyle: { backgroundColor: '#000000' } }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false, title: '', contentStyle: { backgroundColor: '#000000' } }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false, title: '', contentStyle: { backgroundColor: '#000000' } }} />
        <Stack.Screen name="cart" options={{ headerShown: false, title: '', contentStyle: { backgroundColor: '#000000' } }} />
        <Stack.Screen name="workout-session" options={{ headerShown: false, title: '', contentStyle: { backgroundColor: '#000000' } }} />
      </Stack>
      <FloatingCart />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appReady, setAppReady] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Hide splash screen when fonts are loaded AND app is ready
  const handleAppReady = useCallback(() => {
    console.log('App bootstrap complete, hiding splash screen');
    setAppReady(true);
    SplashScreen.hideAsync();
  }, []);

  // Handle error boundary retry
  const handleRetry = useCallback(() => {
    setRetryKey(prev => prev + 1);
  }, []);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }} />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar style="light" backgroundColor="#000000" translucent={false} />
      <SafeAreaProvider style={{ flex: 1, backgroundColor: '#000000' }}>
        <ErrorBoundary key={retryKey} onRetry={handleRetry}>
          <AuthProvider>
            <CartProvider>
              <AppBootstrap onReady={handleAppReady}>
                <AppContent />
              </AppBootstrap>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
