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
      startOrbitAnimation();
      return;
    }
    
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
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
        duration: 8000, // Very slow 8-second orbit
        easing: Easing.linear,
        useNativeDriver: false,
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

  // Calculate positions for orbiting glows
  // Orb 1 starts at top center, Orb 2 starts at bottom center (opposite)
  const orb1Left = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['50%', '100%', '50%', '0%', '50%'],
  });
  
  const orb1Top = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0%', '50%', '100%', '50%', '0%'],
  });
  
  // Orb 2 is offset by 180 degrees (0.5)
  const orb2Left = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['50%', '0%', '50%', '100%', '50%'],
  });
  
  const orb2Top = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['100%', '50%', '0%', '50%', '100%'],
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
        {/* Orbiting welder glows */}
        {!disabled && (
          <>
            {/* Orb 1 - Welder glow */}
            <Animated.View
              style={[
                styles.welderOrb,
                {
                  left: orb1Left,
                  top: orb1Top,
                  opacity: isPressed ? 0.2 : 0.85,
                }
              ]}
            >
              {/* Outer soft glow */}
              <View style={styles.welderGlowOuter} />
              {/* Middle warm glow */}
              <View style={styles.welderGlowMiddle} />
              {/* Inner hot core */}
              <View style={styles.welderGlowCore} />
            </Animated.View>
            
            {/* Orb 2 - Welder glow (opposite side) */}
            <Animated.View
              style={[
                styles.welderOrb,
                {
                  left: orb2Left,
                  top: orb2Top,
                  opacity: isPressed ? 0.2 : 0.85,
                }
              ]}
            >
              {/* Outer soft glow */}
              <View style={styles.welderGlowOuter} />
              {/* Middle warm glow */}
              <View style={styles.welderGlowMiddle} />
              {/* Inner hot core */}
              <View style={styles.welderGlowCore} />
            </Animated.View>
          </>
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
  },
  welderOrb: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welderGlowOuter: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 160, 60, 0.15)',
  },
  welderGlowMiddle: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 200, 100, 0.4)',
  },
  welderGlowCore: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 250, 220, 0.9)',
  },
  borderGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 76, 0.2)',
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
