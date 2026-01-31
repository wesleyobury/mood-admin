import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ChooseForMeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}

export default function ChooseForMeButton({ onPress, disabled = false, style }: ChooseForMeButtonProps) {
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!disabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [disabled]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0.3, 0.6],
    outputRange: [0.3, 0.6],
  });

  return (
    <View style={[styles.outerContainer, style]}>
      {/* Subtle glow effect behind the button */}
      {!disabled && (
        <Animated.View 
          style={[
            styles.glowEffect,
            { opacity: glowOpacity }
          ]} 
        />
      )}
      <TouchableOpacity
        style={[styles.container, disabled && styles.containerDisabled]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={disabled 
            ? ['#1a1a1a', '#111111'] 
            : ['rgba(255, 215, 0, 0.08)', 'rgba(255, 180, 0, 0.12)', 'rgba(255, 215, 0, 0.08)']
          }
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.content}>
            <View style={[styles.iconWrapper, disabled && styles.iconWrapperDisabled]}>
              <Ionicons 
                name="sparkles" 
                size={16} 
                color={disabled ? '#444' : '#FFD700'} 
              />
            </View>
            <Text style={[styles.text, disabled && styles.textDisabled]}>
              Build for me
            </Text>
            <View style={styles.arrowWrapper}>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color={disabled ? '#333' : 'rgba(255, 215, 0, 0.6)'} 
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    opacity: 0.15,
  },
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
    backgroundColor: '#0a0a0a',
  },
  containerDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0a0a0a',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  textDisabled: {
    color: '#444',
  },
  arrowWrapper: {
    marginLeft: 4,
  },
});
