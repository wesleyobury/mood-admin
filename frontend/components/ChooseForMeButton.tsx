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
import { LinearGradient } from 'expo-linear-gradient';

interface ChooseForMeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: object;
  variant?: 'workoutType' | 'equipment' | 'muscleGroup';
}

const GOLD_COLOR = '#C9A44C';
const GOLD_WARM = '#D4A84B';
const BORDER_RADIUS = 12;

// Background colors matching the respective screens
const COLORS = {
  workoutType: '#1a1a1a',
  equipment: '#111111',
  muscleGroup: '#1a1a1a',
};

export default function ChooseForMeButton({ 
  onPress, 
  disabled = false, 
  style,
  variant = 'workoutType' 
}: ChooseForMeButtonProps) {
  const fadeAnim = useRef(new Animated.Value(variant === 'muscleGroup' ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const orbitAnim = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  const backgroundColor = COLORS[variant];

  // Fade-in on mount - no delay for muscleGroup variant
  useEffect(() => {
    if (variant === 'muscleGroup') {
      // Start orbit immediately for muscleGroup
      startOrbitAnimation();
      return;
    }
    
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
      startOrbitAnimation();
    }, 2200);
    
    return () => clearTimeout(timer);
  }, [variant]);

  const startOrbitAnimation = () => {
    orbitAnim.setValue(0);
    Animated.loop(
      Animated.timing(orbitAnim, {
        toValue: 1,
        duration: 6000, // Slow 6-second orbit
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { iterations: -1 }
    ).start();
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  // Rotation for the glow elements
  const rotation = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
      {/* "or" divider with lines */}
      <View style={styles.orDividerContainer}>
        <View style={styles.orDividerLine} />
        <Text style={styles.orDividerText}>or</Text>
        <View style={styles.orDividerLine} />
      </View>

      {/* Button wrapper */}
      <View style={styles.buttonWrapper}>
        {/* Orbiting glow container - rotates around the button */}
        {!disabled && (
          <Animated.View
            style={[
              styles.orbitContainer,
              {
                opacity: isPressed ? 0.3 : 1,
                transform: [{ rotate: rotation }],
              }
            ]}
          >
            {/* First warm glow streak - top */}
            <View style={styles.glowPositionTop}>
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(212, 168, 75, 0.03)',
                  'rgba(212, 168, 75, 0.15)',
                  'rgba(212, 168, 75, 0.4)',
                  'rgba(212, 168, 75, 0.15)',
                  'rgba(212, 168, 75, 0.03)',
                  'transparent',
                ]}
                locations={[0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.glowStreak}
              />
            </View>
            
            {/* Second warm glow streak - bottom (opposite) */}
            <View style={styles.glowPositionBottom}>
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(212, 168, 75, 0.03)',
                  'rgba(212, 168, 75, 0.15)',
                  'rgba(212, 168, 75, 0.4)',
                  'rgba(212, 168, 75, 0.15)',
                  'rgba(212, 168, 75, 0.03)',
                  'transparent',
                ]}
                locations={[0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.glowStreak}
              />
            </View>
          </Animated.View>
        )}
        
        {/* Subtle static border */}
        <View style={[styles.borderGlow, disabled && styles.borderGlowDisabled]} />
        
        {/* Main button content */}
        <TouchableOpacity
          style={[
            styles.button, 
            { backgroundColor },
            disabled && styles.buttonDisabled
          ]}
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
              color={disabled ? '#444' : 'rgba(240, 235, 220, 0.85)'} 
            />
            <Text style={[styles.text, disabled && styles.textDisabled]}>
              Build for me
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  orDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  orDividerLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(100, 100, 100, 0.4)',
  },
  orDividerText: {
    color: 'rgba(150, 150, 150, 0.8)',
    fontSize: 13,
    fontWeight: '400',
    paddingHorizontal: 16,
    textTransform: 'lowercase',
  },
  buttonWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS,
  },
  orbitContainer: {
    position: 'absolute',
    top: -30,
    left: -30,
    right: -30,
    bottom: -30,
    zIndex: 1,
  },
  glowPositionTop: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowPositionBottom: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    height: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowStreak: {
    width: 120,
    height: 4,
    borderRadius: 2,
  },
  borderGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 76, 0.15)',
    zIndex: 0,
  },
  borderGlowDisabled: {
    borderColor: 'rgba(100, 100, 100, 0.15)',
  },
  button: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    zIndex: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
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
    color: 'rgba(240, 235, 220, 0.9)',
    letterSpacing: 0.3,
  },
  textDisabled: {
    color: '#444',
  },
});
