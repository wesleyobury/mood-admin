import React, { useEffect, useRef } from 'react';
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

export default function ChooseForMeButton({ onPress, disabled = false, style }: ChooseForMeButtonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowPosition = useRef(new Animated.Value(0)).current;

  // Subtle fade-in on mount with 1200ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Slow counterclockwise glow animation (12 seconds per rotation)
  useEffect(() => {
    if (!disabled) {
      const animation = Animated.loop(
        Animated.timing(glowPosition, {
          toValue: 1,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      );
      animation.start();
      return () => animation.stop();
    }
  }, [disabled, glowPosition]);

  // Handle press animation - subtle scale down
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // Calculate glow dot position (counterclockwise)
  // Position goes: top-center -> top-left -> left -> bottom-left -> bottom -> bottom-right -> right -> top-right -> top-center
  const dotTop = glowPosition.interpolate({
    inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    outputRange: [0, 0, 22, 44, 44, 44, 22, 0, 0], // Counterclockwise Y positions
  });

  const dotLeft = glowPosition.interpolate({
    inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    outputRange: ['50%', '25%', '0%', '25%', '50%', '75%', '100%', '75%', '50%'], // Counterclockwise X positions
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
      <View style={styles.buttonWrapper}>
        {/* Animated glow dot */}
        {!disabled && (
          <Animated.View
            style={[
              styles.glowDot,
              {
                top: dotTop,
                left: dotLeft,
                marginLeft: -6, // Center the dot
                marginTop: -6,
              }
            ]}
          />
        )}
        
        <TouchableOpacity
          style={[styles.container, disabled && styles.containerDisabled]}
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
  buttonWrapper: {
    position: 'relative',
  },
  glowDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#C9A44C',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 76, 0.5)', // Muted gold #C9A44C at ~50% opacity
    backgroundColor: 'rgba(201, 164, 76, 0.06)', // Very subtle gold tint fill (~6% opacity)
  },
  containerDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
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
    fontWeight: '500', // Medium weight, not bold
    color: 'rgba(240, 235, 220, 0.9)', // Off-white
    letterSpacing: 0.3,
  },
  textDisabled: {
    color: '#444',
  },
});
