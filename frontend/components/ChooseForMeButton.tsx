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
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

interface ChooseForMeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}

const GOLD_COLOR = '#C9A44C';
const BUTTON_HEIGHT = 56;
const BORDER_RADIUS = 12;

export default function ChooseForMeButton({ onPress, disabled = false, style }: ChooseForMeButtonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowProgress = useRef(new Animated.Value(0)).current;
  const isPressing = useRef(false);

  // Fade-in on mount with 400ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 400);
    
    return () => clearTimeout(timer);
  }, []);

  // Slow clockwise glow animation (4 seconds per loop)
  useEffect(() => {
    if (!disabled) {
      // Start animation after the same delay as fade-in
      const timer = setTimeout(() => {
        const animation = Animated.loop(
          Animated.timing(glowProgress, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: false,
          })
        );
        animation.start();
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [disabled, glowProgress]);

  // Handle press animation
  const handlePressIn = () => {
    isPressing.current = true;
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    isPressing.current = false;
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  // Interpolate glow position around the border (clockwise)
  // Progress: 0 = top-center, 0.25 = right-center, 0.5 = bottom-center, 0.75 = left-center, 1 = top-center
  const glowX = glowProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['50%', '100%', '50%', '0%', '50%'],
  });
  
  const glowY = glowProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0%', '50%', '100%', '50%', '0%'],
  });

  // Glow opacity - dims during press
  const glowOpacity = isPressing.current ? 0.25 : 0.5;

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
      {/* Base border glow layer */}
      <View style={styles.baseBorderGlow} />
      
      {/* Moving highlight glow */}
      {!disabled && (
        <Animated.View
          style={[
            styles.movingGlowContainer,
            {
              left: glowX,
              top: glowY,
            }
          ]}
          pointerEvents="none"
        >
          <View style={[styles.movingGlow, { opacity: glowOpacity }]} />
        </Animated.View>
      )}
      
      {/* Main button */}
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
  baseBorderGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: `rgba(201, 164, 76, 0.25)`, // Base glow ~25% opacity
    // Soft inner shadow effect
    shadowColor: GOLD_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  movingGlowContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  movingGlow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GOLD_COLOR,
    // Soft feathered edges
    shadowColor: GOLD_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  button: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: `rgba(201, 164, 76, 0.5)`, // Muted gold border
    backgroundColor: 'rgba(10, 10, 10, 0.98)', // Near-black, slightly transparent to show glow
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
    backgroundColor: 'rgba(201, 164, 76, 0.04)', // Very subtle gold tint
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(240, 235, 220, 0.9)', // Off-white
    letterSpacing: 0.3,
  },
  textDisabled: {
    color: '#444',
  },
});
