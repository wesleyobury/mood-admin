import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExerciseLookupTriggerProps {
  onPress: () => void;
}

export default function ExerciseLookupTrigger({ onPress }: ExerciseLookupTriggerProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="search" size={16} color="rgba(255,255,255,0.5)" />
      <Text style={styles.text}>Find visuals</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '400',
  },
});
