import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import FloatingCart from '../components/FloatingCart';
import { Analytics } from '../utils/analytics';

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

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Don't block the app for font loading - show content immediately
  // if (!loaded && !error) {
  //   return null;
  // }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar style="light" backgroundColor="#000000" translucent={false} />
      <SafeAreaProvider style={{ flex: 1, backgroundColor: '#000000' }}>
        <AuthProvider>
          <CartProvider>
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
              <Stack.Screen name="cart" options={{ headerShown: false, title: '', contentStyle: { backgroundColor: '#000000' } }} />
              <Stack.Screen name="workout-session" options={{ headerShown: false, title: '', contentStyle: { backgroundColor: '#000000' } }} />
            </Stack>
            <FloatingCart />
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}