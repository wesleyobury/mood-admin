import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WigglingAddButtonProps {
  isInCart: boolean;
  onPress: () => void;
  scaleAnim: Animated.Value;
}

export default function WigglingAddButton({ isInCart, onPress, scaleAnim }: WigglingAddButtonProps) {
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Only wiggle if not in cart
    if (!isInCart) {
      const wiggleAnimation = () => {
        Animated.sequence([
          Animated.timing(wiggleAnim, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start();
      };

      // Initial wiggle after a short delay
      const initialTimer = setTimeout(wiggleAnimation, 1000);
      
      // Wiggle every 3 seconds
      const interval = setInterval(wiggleAnimation, 3000);

      return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
      };
    }
  }, [isInCart, wiggleAnim]);

  const wiggleInterpolate = wiggleAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  return (
    <TouchableOpacity
      style={[
        styles.addToCartButton,
        isInCart && styles.addToCartButtonAdded
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View 
        style={[
          styles.addToCartButtonContent, 
          { 
            transform: [
              { scale: scaleAnim },
              { rotate: isInCart ? '0deg' : wiggleInterpolate }
            ] 
          }
        ]}
      >
        {isInCart ? (
          <Ionicons name="checkmark" size={16} color="#FFD700" />
        ) : (
          <>
            <Ionicons name="add" size={14} color="#FFD700" />
            <Text style={styles.addToCartButtonText}>Add workout</Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addToCartButton: {
    backgroundColor: '#333333',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonAdded: {
    backgroundColor: '#444444',
  },
  addToCartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
