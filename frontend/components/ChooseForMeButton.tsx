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
}

const GOLD_COLOR = '#C9A44C';
const BORDER_RADIUS = 12;

export default function ChooseForMeButton({ onPress, disabled = false, style }: ChooseForMeButtonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowRotation = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  // Fade-in on mount with 1200ms delay and slower fade
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Slower fade in
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Slow clockwise glow animation (4 seconds per loop)
  useEffect(() => {
    if (!disabled) {
      const timer = setTimeout(() => {
        const animation = Animated.loop(
          Animated.timing(glowRotation, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        );
        animation.start();
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [disabled, glowRotation]);

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

  // Rotation interpolation for clockwise motion
  const rotation = glowRotation.interpolate({
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
      {/* Animated border glow container */}
      <View style={styles.borderGlowWrapper}>
        {/* Base subtle glow border */}
        <View style={styles.baseBorderGlow} />
        
        {/* Rotating gradient highlight - only when not disabled and not pressed */}
        {!disabled && (
          <Animated.View
            style={[
              styles.rotatingGlowWrapper,
              {
                opacity: isPressed ? 0.15 : 1,
                transform: [{ rotate: rotation }],
              }
            ]}
          >
            <LinearGradient
              colors={[
                'rgba(201, 164, 76, 0.5)',  // Highlight at top
                'rgba(201, 164, 76, 0.08)', // Fade
                'rgba(201, 164, 76, 0.02)', // Near invisible
                'rgba(201, 164, 76, 0.02)', // Near invisible
                'rgba(201, 164, 76, 0.08)', // Fade back in
                'rgba(201, 164, 76, 0.5)',  // Highlight completes
              ]}
              locations={[0, 0.15, 0.3, 0.7, 0.85, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.rotatingGradient}
            />
          </Animated.View>
        )}
      </View>
      
      {/* Main button content */}
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
            color={disabled ? '#444' : 'rgba(240, 235, 220, 0.85)'} 
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
    position: 'relative',
  },
  borderGlowWrapper: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: BORDER_RADIUS + 1,
    overflow: 'hidden',
  },
  baseBorderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BORDER_RADIUS + 1,
    borderWidth: 1,
    borderColor: `rgba(201, 164, 76, 0.25)`, // Base glow ~25% opacity
  },
  rotatingGlowWrapper: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BORDER_RADIUS + 1,
    overflow: 'hidden',
  },
  rotatingGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: `rgba(201, 164, 76, 0.4)`,
    backgroundColor: 'rgba(10, 10, 10, 0.98)',
    overflow: 'hidden',
  },
  buttonDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(10, 10, 10, 0.98)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
    backgroundColor: 'rgba(201, 164, 76, 0.03)',
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
