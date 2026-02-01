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
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface ChooseForMeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}

const AnimatedView = Animated.View;

export default function ChooseForMeButton({ onPress, disabled = false, style }: ChooseForMeButtonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowRotation = useRef(new Animated.Value(0)).current;

  // Slower fade-in on mount with 1200ms delay, longer duration
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800, // Slower fade-in
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Slow counterclockwise glow rotation (15 seconds per rotation)
  useEffect(() => {
    if (!disabled) {
      const animation = Animated.loop(
        Animated.timing(glowRotation, {
          toValue: -1, // Negative for counterclockwise
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
      return () => animation.stop();
    }
  }, [disabled, glowRotation]);

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

  // Rotation interpolation
  const rotateStyle = glowRotation.interpolate({
    inputRange: [-1, 0],
    outputRange: ['-360deg', '0deg'],
  });

  return (
    <AnimatedView 
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
        {/* Rotating glow gradient layer */}
        {!disabled && (
          <AnimatedView
            style={[
              styles.glowContainer,
              {
                transform: [{ rotate: rotateStyle }],
              }
            ]}
          >
            {/* Large feathered glow spot */}
            <View style={styles.glowSpot} />
          </AnimatedView>
        )}
        
        {/* Main button */}
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
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  buttonWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  glowContainer: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  glowSpot: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C9A44C',
    opacity: 0.6,
    // Heavy feathering with large shadow
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 76, 0.5)', // Muted gold #C9A44C at ~50% opacity
    backgroundColor: 'rgba(10, 10, 10, 0.95)', // Near-black to hide glow inside
  },
  containerDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
    backgroundColor: 'rgba(201, 164, 76, 0.06)', // Very subtle gold tint
    borderRadius: 11,
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
