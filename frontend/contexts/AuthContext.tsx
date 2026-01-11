import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { trackEvent, aliasGuestToUser, GuestAnalytics } from '../utils/analytics';

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  followers_count: number;
  following_count: number;
  workouts_count: number;
  current_streak: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isGuest: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshAuth: () => Promise<void>;
  continueAsGuest: () => void;
  exitGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Prioritize process.env for development/preview environments
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Auto-login or load stored session
    const initAuth = async () => {
      try {
        console.log('🔐 Initializing auth...');
        console.log('API_URL:', API_URL);
        
        // Check if user is in guest mode
        const guestMode = await AsyncStorage.getItem('is_guest');
        if (guestMode === 'true') {
          console.log('🚶 User is in guest mode');
          setIsGuest(true);
          setUser(null);
          setToken(null);
          setIsLoading(false);
          return;
        }
        
        // Try to get stored token first
        const storedToken = await AsyncStorage.getItem('auth_token');
        if (storedToken) {
          console.log('Found stored token, validating...');
          
          // Validate token by fetching user
          const userResp = await fetch(`${API_URL}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${storedToken}` },
          });
          
          if (userResp.ok) {
            const userData = await userResp.json();
            // Check if it's the correct demo user, if not clear and re-login
            if (userData.username === 'Ogeeezzbury') {
              console.log('Old demo user detected, clearing and re-logging...');
              await AsyncStorage.removeItem('auth_token');
              // Continue to auto-login below
            } else {
              setToken(storedToken);
              setUser(userData);
              console.log('✅ Restored session for:', userData.username);
              
              // Track app session start on successful restore
              trackEvent(storedToken, 'app_session_start', {
                restored_session: true,
              });
              
              setIsLoading(false);
              return;
            }
          } else {
            console.log('Stored token invalid, clearing...');
            await AsyncStorage.removeItem('auth_token');
          }
        }
        
        // No valid stored token - user needs to log in
        console.log('No valid session found, user needs to authenticate');
        setUser(null);
        setToken(null);
      } catch (err) {
        console.error('❌ Auth error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Delay to ensure component is mounted
    const timer = setTimeout(initAuth, 100);
    return () => clearTimeout(timer);
  }, []); // Only run once

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        await fetchCurrentUser(storedToken);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, clear it
        await logout();
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      await logout();
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token: authToken, user_id } = data;
        setToken(authToken);
        await AsyncStorage.setItem('auth_token', authToken);
        
        // Clear guest mode if user was a guest
        const wasGuest = await AsyncStorage.getItem('is_guest');
        if (wasGuest === 'true') {
          await AsyncStorage.removeItem('is_guest');
          setIsGuest(false);
          
          // Alias guest activity to the user account (identity merge)
          console.log('🔗 Merging guest activity to user account...');
          const mergedCount = await aliasGuestToUser(authToken);
          console.log(`✅ Merged ${mergedCount} guest events to user account`);
        }
        
        await fetchCurrentUser(authToken);
      } else {
        throw new Error(data.detail || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, name?: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token: authToken, user_id } = data;
        setToken(authToken);
        await AsyncStorage.setItem('auth_token', authToken);
        
        // Clear guest mode if user was a guest
        const wasGuest = await AsyncStorage.getItem('is_guest');
        if (wasGuest === 'true') {
          await AsyncStorage.removeItem('is_guest');
          setIsGuest(false);
          
          // Alias guest activity to the new user account (identity merge)
          console.log('🔗 Merging guest activity to new user account...');
          const mergedCount = await aliasGuestToUser(authToken);
          console.log(`✅ Merged ${mergedCount} guest events to new user account`);
        }
        
        await fetchCurrentUser(authToken);
      } else {
        throw new Error(data.detail || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('is_guest');
      setToken(null);
      setUser(null);
      setIsGuest(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Continue as guest - allows browsing without account
  const continueAsGuest = async () => {
    console.log('🚶 Continuing as guest...');
    setIsGuest(true);
    setUser(null);
    setToken(null);
    try {
      await AsyncStorage.setItem('is_guest', 'true');
      
      // Track guest session start
      await GuestAnalytics.guestSessionStarted();
      console.log('📊 Guest session tracking started');
    } catch (error) {
      console.error('Error saving guest state:', error);
    }
  };

  // Exit guest mode - used when guest wants to sign up
  const exitGuestMode = async () => {
    console.log('👋 Exiting guest mode...');
    setIsGuest(false);
    try {
      await AsyncStorage.removeItem('is_guest');
    } catch (error) {
      console.error('Error clearing guest state:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Heartbeat for real-time active user tracking
  useEffect(() => {
    if (!token) return;
    
    const sendHeartbeat = async () => {
      try {
        await fetch(`${API_URL}/api/analytics/heartbeat`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.log('Heartbeat failed:', error);
      }
    };
    
    // Send initial heartbeat
    sendHeartbeat();
    
    // Set up interval - every 45 seconds
    const heartbeatInterval = setInterval(sendHeartbeat, 45000);
    
    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [token]);

  // Refresh auth from stored token - used after OAuth/Apple login
  const refreshAuth = async () => {
    try {
      console.log('🔄 Refreshing auth from stored token...');
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        await fetchCurrentUser(storedToken);
        console.log('✅ Auth refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isGuest,
    login,
    register,
    logout,
    updateUser,
    refreshAuth,
    continueAsGuest,
    exitGuestMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}