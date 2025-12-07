import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddWorkoutIndicatorProps {
  visible: boolean;
}

export default function AddWorkoutIndicator({ visible }: AddWorkoutIndicatorProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    if (visible) {
      // Fade in animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Fade out after 2 seconds
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.indicatorContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.bubble}>
        <View style={styles.contentRow}>
          <Ionicons name="hand-left" size={16} color="#FFD700" style={styles.handIcon} />
          <Text style={styles.indicatorText}>Tap here to add workout</Text>
        </View>
        <View style={styles.arrow} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  indicatorContainer: {
    position: 'absolute',
    top: -50,
    right: 0,
    zIndex: 1000,
  },
  bubble: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  handIcon: {
    transform: [{ rotate: '90deg' }],
  },
  indicatorText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  arrow: {
    position: 'absolute',
    bottom: -6,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFD700',
  },
});
