import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
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
      <View style={styles.iconContainer}>
        <Ionicons name="home-outline" size={20} color="#FFD700" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
