import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(tabs)');
  };

  return (
    <TouchableOpacity 
      style={styles.homeButton}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Ionicons name="home-outline" size={24} color="#FFD700" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
});
