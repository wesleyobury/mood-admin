import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChooseForMeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}

const BORDER_RADIUS = 12;

export default function ChooseForMeButton({ onPress, disabled = false, style }: ChooseForMeButtonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Fade-in on mount with 1200ms delay and slow fade
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800, // Slow fade in
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={[
        styles.outerContainer, 
        style,
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        <View style={styles.content}>
          <Ionicons 
            name="sparkles" 
            size={16} 
            color={disabled ? '#666' : '#FFFFFF'} 
          />
          <Text style={[styles.text, disabled && styles.textDisabled]}>
            Build for me
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  button: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: '#2A2A2A', // Charcoal
    overflow: 'hidden',
  },
  buttonDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#1A1A1A',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF', // White text
    letterSpacing: 0.3,
  },
  textDisabled: {
    color: '#666',
  },
});
