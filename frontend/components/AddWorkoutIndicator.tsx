import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddWorkoutIndicatorProps {
  visible: boolean;
}

export default function AddWorkoutIndicator({ visible }: AddWorkoutIndicatorProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in and bounce animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -8,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      // Fade out after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, bounceAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.arrowContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: bounceAnim }],
        },
      ]}
      pointerEvents="none"
    >
      <Ionicons name="arrow-down" size={24} color="#FFD700" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  arrowContainer: {
    position: 'absolute',
    top: -32,
    right: 8,
    zIndex: 9999,
  },
});
