import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ChooseForMeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}

export default function ChooseForMeButton({ onPress, disabled = false, style }: ChooseForMeButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.containerDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? ['#333333', '#222222'] : ['rgba(255, 215, 0, 0.15)', 'rgba(255, 165, 0, 0.1)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.content}>
          <Ionicons 
            name="sparkles" 
            size={18} 
            color={disabled ? '#666' : '#FFFFFF'} 
          />
          <Text style={[styles.text, disabled && styles.textDisabled]}>
            Build for me
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  containerDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  textDisabled: {
    color: '#666',
  },
});
