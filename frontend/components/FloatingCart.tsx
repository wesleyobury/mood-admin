import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useRouter, useRootNavigationState } from 'expo-router';

const FloatingCart: React.FC = () => {
  const { cartItems } = useCart();
  const rootNavigationState = useRootNavigationState();
  const cartCount = cartItems.length;

  // Don't render until navigation is ready
  if (!rootNavigationState?.key) {
    return null;
  }

  const router = useRouter();

  const handleCartPress = () => {
    router.push('/cart');
  };

  if (cartCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleCartPress}
        activeOpacity={0.8}
      >
        <Ionicons name="fitness" size={24} color="#000000" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    zIndex: 999,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FloatingCart;