import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { trackEvent } from '../utils/analytics';

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
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-login or load stored session
    const initAuth = async () => {
      try {
        console.log('🔐 Initializing auth...');
        console.log('API_URL:', API_URL);
        
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
            setToken(storedToken);
            setUser(userData);
            console.log('✅ Restored session for:', userData.username);
            
            // Track app session start on successful restore
            trackEvent(storedToken, 'app_session_start', {
              restored_session: true,
            });
            
            setIsLoading(false);
            return;
          } else {
            console.log('Stored token invalid, clearing...');
            await AsyncStorage.removeItem('auth_token');
          }
        }
        
        // No valid stored token, do auto-login
        console.log('No valid session, attempting auto-login...');
        
        // Try to get the first user from database as a demo user
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Ogeeezzbury',
            password: 'password123',
          }),
        });

        console.log('Login response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Login successful, got token');
          setToken(data.token);
          await AsyncStorage.setItem('auth_token', data.token);
          
          // Track app session start on fresh login
          trackEvent(data.token, 'app_session_start', {
            restored_session: false,
          });
          
          // Get user info
          const userResp = await fetch(`${API_URL}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${data.token}` },
          });
          
          if (userResp.ok) {
            const userData = await userResp.json();
            setUser(userData);
            console.log('✅ User data loaded:', userData.username);
          }
        } else {
          const errorData = await response.text();
          console.error('❌ Login failed:', response.status, errorData);
        }
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
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
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