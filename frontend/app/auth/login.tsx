import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const { login } = useAuth();

  // Handle deep link redirect from Emergent Auth
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link received:', url);
      
      // Parse session_id from URL hash or query
      let sessionId = null;
      
      // Try hash first (#session_id=...)
      if (url.includes('#session_id=')) {
        sessionId = url.split('#session_id=')[1].split('&')[0];
      }
      // Try query (?session_id=...)
      else if (url.includes('?session_id=')) {
        sessionId = url.split('?session_id=')[1].split('&')[0];
      }
      
      if (sessionId) {
        console.log('Found session_id, processing OAuth login...');
        await handleOAuthCallback(sessionId);
      }
    };

    // Check initial URL (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Listen for URL changes (hot link)
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleOAuthCallback = async (sessionId: string) => {
    try {
      setIsLoading(true);
      console.log('Exchanging session_id for token...');
      
      const response = await fetch(`${API_URL}/api/auth/oauth/callback?session_id=${sessionId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with OAuth');
      }

      const data = await response.json();
      console.log('OAuth login successful!');
      
      // Store session token in AsyncStorage
      const { AsyncStorage } = require('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem('auth_token', data.session_token);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('OAuth error:', error);
      Alert.alert('Authentication Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Create redirect URL based on platform
      const redirectUrl = Platform.OS === 'web'
        ? `${API_URL}/`
        : Linking.createURL('/');
      
      console.log('Redirect URL:', redirectUrl);
      
      // Build Emergent Auth URL
      const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
      console.log('Opening auth URL:', authUrl);
      
      // Open OAuth session
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      
      console.log('Auth session result:', result.type);
      
      if (result.type === 'success' && result.url) {
        // Parse session_id from returned URL
        const url = result.url;
        let sessionId = null;
        
        if (url.includes('#session_id=')) {
          sessionId = url.split('#session_id=')[1].split('&')[0];
        } else if (url.includes('?session_id=')) {
          sessionId = url.split('?session_id=')[1].split('&')[0];
        }
        
        if (sessionId) {
          await handleOAuthCallback(sessionId);
        } else {
          throw new Error('No session ID returned from authentication');
        }
      } else if (result.type === 'cancel') {
        console.log('User cancelled authentication');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      Alert.alert('Login Failed', error.message || 'Unable to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Logging in..." />;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Login to continue your fitness journey</Text>
          </View>

          {/* Google Sign In Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <View style={styles.googleIconContainer}>
              <Ionicons name="logo-google" size={20} color="#fff" />
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#666"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Skip Login Option */}
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.skipButtonText}>Try Demo</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    height: 50,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  googleIconContainer: {
    backgroundColor: '#DB4437',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#fff',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c0c0c',
  },
  skipButton: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
  footerLink: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
});
