import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChooseForMeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: object;
  variant?: 'workoutType' | 'equipment' | 'muscleGroup';
}

const GOLD_COLOR = '#C9A44C';
const BORDER_RADIUS = 12;
const DOT_SIZE = 6;

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
  const [buttonLayout, setButtonLayout] = useState({ width: 0, height: 0 });

  const backgroundColor = COLORS[variant];

  // Fade-in on mount - no delay for muscleGroup variant, 2200ms delay for others
  useEffect(() => {
    if (variant === 'muscleGroup') {
      // Start orbit immediately for muscleGroup
      orbitAnim.setValue(0);
      const animationRef = Animated.loop(
        Animated.timing(orbitAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        { iterations: -1 }
      );
      animationRef.start();
      return () => animationRef.stop();
    }
    
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 2200);
    
    return () => clearTimeout(timer);
  }, [variant]);

  // Continuous orbit animation for non-muscleGroup variants
  useEffect(() => {
    if (variant === 'muscleGroup') return;
    
    let animationRef: Animated.CompositeAnimation | null = null;
    
    const timer = setTimeout(() => {
      orbitAnim.setValue(0);
      
      animationRef = Animated.loop(
        Animated.timing(orbitAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        { iterations: -1 }
      );
      animationRef.start();
    }, 2200);
    
    return () => {
      clearTimeout(timer);
      if (animationRef) {
        animationRef.stop();
      }
    };
  }, [orbitAnim, variant]);

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

  // Calculate position along the button's border (perimeter path)
  const getPositionAlongPerimeter = (progress: number, width: number, height: number) => {
    // Total perimeter (approximate rectangle with rounded corners)
    const straightWidth = width - 2 * BORDER_RADIUS;
    const straightHeight = height - 2 * BORDER_RADIUS;
    const cornerArc = Math.PI * BORDER_RADIUS / 2;
    const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    
    // Distance along the perimeter
    const distance = progress * totalPerimeter;
    
    // Segments: top, top-right corner, right, bottom-right corner, bottom, bottom-left corner, left, top-left corner
    const segments = [
      { length: straightWidth, type: 'horizontal', startX: BORDER_RADIUS, startY: 0, direction: 1 },
      { length: cornerArc, type: 'corner', centerX: width - BORDER_RADIUS, centerY: BORDER_RADIUS, startAngle: -Math.PI / 2 },
      { length: straightHeight, type: 'vertical', startX: width, startY: BORDER_RADIUS, direction: 1 },
      { length: cornerArc, type: 'corner', centerX: width - BORDER_RADIUS, centerY: height - BORDER_RADIUS, startAngle: 0 },
      { length: straightWidth, type: 'horizontal', startX: width - BORDER_RADIUS, startY: height, direction: -1 },
      { length: cornerArc, type: 'corner', centerX: BORDER_RADIUS, centerY: height - BORDER_RADIUS, startAngle: Math.PI / 2 },
      { length: straightHeight, type: 'vertical', startX: 0, startY: height - BORDER_RADIUS, direction: -1 },
      { length: cornerArc, type: 'corner', centerX: BORDER_RADIUS, centerY: BORDER_RADIUS, startAngle: Math.PI },
    ];
    
    let remainingDistance = distance;
    
    for (const segment of segments) {
      if (remainingDistance <= segment.length) {
        if (segment.type === 'horizontal') {
          return {
            x: segment.startX + remainingDistance * segment.direction,
            y: segment.startY,
          };
        } else if (segment.type === 'vertical') {
          return {
            x: segment.startX,
            y: segment.startY + remainingDistance * segment.direction,
          };
        } else if (segment.type === 'corner') {
          const angle = segment.startAngle + (remainingDistance / BORDER_RADIUS);
          return {
            x: segment.centerX + BORDER_RADIUS * Math.cos(angle),
            y: segment.centerY + BORDER_RADIUS * Math.sin(angle),
          };
        }
      }
      remainingDistance -= segment.length;
    }
    
    return { x: BORDER_RADIUS, y: 0 };
  };

  // Animated dot positions
  const dot1Position = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  const dot2Position = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.5], // Offset by half
  });

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setButtonLayout({ width, height });
  };

  // Calculate dot positions based on animation
  const renderDots = () => {
    if (buttonLayout.width === 0 || disabled) return null;
    
    const { width, height } = buttonLayout;
    
    return (
      <>
        {/* First glowing dot */}
        <Animated.View
          style={[
            styles.orbitDot,
            {
              opacity: isPressed ? 0.3 : 1,
              transform: [
                {
                  translateX: orbitAnim.interpolate({
                    inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                    outputRange: [
                      width / 2 - DOT_SIZE / 2,  // top center
                      width - DOT_SIZE,           // top right
                      width - DOT_SIZE,           // right center
                      width - DOT_SIZE,           // bottom right
                      width / 2 - DOT_SIZE / 2,  // bottom center
                      0,                          // bottom left
                      0,                          // left center
                      0,                          // top left
                      width / 2 - DOT_SIZE / 2,  // back to top center
                    ],
                  }),
                },
                {
                  translateY: orbitAnim.interpolate({
                    inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                    outputRange: [
                      -DOT_SIZE / 2,              // top center
                      height / 4 - DOT_SIZE / 2, // top right corner area
                      height / 2 - DOT_SIZE / 2, // right center
                      height * 0.75 - DOT_SIZE / 2, // bottom right corner area
                      height - DOT_SIZE / 2,     // bottom center
                      height * 0.75 - DOT_SIZE / 2, // bottom left corner area
                      height / 2 - DOT_SIZE / 2, // left center
                      height / 4 - DOT_SIZE / 2, // top left corner area
                      -DOT_SIZE / 2,              // back to top center
                    ],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.dotGlow} />
          <View style={styles.dotCore} />
        </Animated.View>
        
        {/* Second glowing dot (opposite side - 180 degrees offset) */}
        <Animated.View
          style={[
            styles.orbitDot,
            {
              opacity: isPressed ? 0.3 : 1,
              transform: [
                {
                  translateX: orbitAnim.interpolate({
                    inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                    outputRange: [
                      width / 2 - DOT_SIZE / 2,  // bottom center (opposite of top)
                      0,                          // bottom left
                      0,                          // left center
                      0,                          // top left
                      width / 2 - DOT_SIZE / 2,  // top center
                      width - DOT_SIZE,           // top right
                      width - DOT_SIZE,           // right center
                      width - DOT_SIZE,           // bottom right
                      width / 2 - DOT_SIZE / 2,  // back to bottom center
                    ],
                  }),
                },
                {
                  translateY: orbitAnim.interpolate({
                    inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                    outputRange: [
                      height - DOT_SIZE / 2,     // bottom center
                      height * 0.75 - DOT_SIZE / 2, // bottom left corner area
                      height / 2 - DOT_SIZE / 2, // left center
                      height / 4 - DOT_SIZE / 2, // top left corner area
                      -DOT_SIZE / 2,              // top center
                      height / 4 - DOT_SIZE / 2, // top right corner area
                      height / 2 - DOT_SIZE / 2, // right center
                      height * 0.75 - DOT_SIZE / 2, // bottom right corner area
                      height - DOT_SIZE / 2,     // back to bottom center
                    ],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.dotGlow} />
          <View style={styles.dotCore} />
        </Animated.View>
      </>
    );
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
      {/* "or" divider with lines */}
      <View style={styles.orDividerContainer}>
        <View style={styles.orDividerLine} />
        <Text style={styles.orDividerText}>or</Text>
        <View style={styles.orDividerLine} />
      </View>

      {/* Button wrapper with orbiting dots */}
      <View style={styles.buttonWrapper} onLayout={handleLayout}>
        {/* Orbiting dots */}
        {renderDots()}
        
        {/* Subtle border glow */}
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
  borderGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: BORDER_RADIUS + 1,
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 76, 0.2)',
  },
  borderGlowDisabled: {
    borderColor: 'rgba(100, 100, 100, 0.2)',
  },
  orbitDot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotGlow: {
    position: 'absolute',
    width: DOT_SIZE * 3,
    height: DOT_SIZE * 3,
    borderRadius: DOT_SIZE * 1.5,
    backgroundColor: 'rgba(201, 164, 76, 0.3)',
  },
  dotCore: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: GOLD_COLOR,
    shadowColor: GOLD_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
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
