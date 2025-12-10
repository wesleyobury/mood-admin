import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';
import { useCart, WorkoutItem } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Analytics } from '../utils/analytics';

const CartItemComponent: React.FC<{
  item: WorkoutItem;
  index: number;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}> = ({ item, index, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) => {
  console.log('🛒 Rendering cart item:', item.id, 'moodCard:', item.moodCard);
  return (
    <View style={styles.cartItem}>
      <View style={styles.cartItemHeader}>
        <View style={styles.orderNumber}>
          <Text style={styles.orderNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.moodCardTitleContainer}>
          <Text style={styles.moodCardTitle}>
            {item.moodCard || 'Workout'}
          </Text>
          <View style={styles.workoutTypeContainer}>
            <View style={styles.workoutTypeDot} />
            <Text style={styles.workoutTypeText}>
              {(() => {
                // Handle "I'm feeling lazy - Lift weights - Upper body" format
                if (item.workoutType.includes("I'm feeling lazy") && item.workoutType.includes("Lift weights")) {
                  const parts = item.workoutType.split(' - ');
                  if (parts.length === 3) {
                    // Return "Lift weights • Upper body" (or Lower/Full body)
                    return `${parts[1]} • ${parts[2]}`;
                  }
                }
                // Handle "Muscle gainer - Legs - Compound" format (show full)
                if (item.workoutType.toLowerCase().includes('legs') || item.workoutType.toLowerCase().includes('compound')) {
                  return item.workoutType.split(' - ').join(' - ');
                }
                // Handle other formats like "Muscle gainer - Abs"
                if (item.workoutType.includes(' - ')) {
                  return item.workoutType.split(' - ')[1];
                }
                return item.workoutType;
              })()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            console.log('❌ X button pressed for item:', item.id, item.name);
            onRemove(item.id);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle" size={24} color="rgba(255, 215, 0, 0.7)" />
        </TouchableOpacity>
      </View>

      <View style={styles.cartItemContent}>
        <Image 
          source={{ uri: item.imageUrl }}
          style={styles.cartItemImage}
          resizeMode="cover"
        />
        
        <View style={styles.cartItemInfo}>
          <Text style={styles.cartItemName}>{item.name}</Text>
          <Text style={styles.cartItemEquipment}>{item.equipment}</Text>
          <View style={styles.cartItemMeta}>
            <Text style={styles.cartItemDuration}>{item.duration}</Text>
            <View style={styles.cartItemDifficulty}>
              <Text style={styles.cartItemDifficultyText}>{item.difficulty.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.reorderButtons}>
          <TouchableOpacity
            style={[styles.reorderButton, isFirst && styles.reorderButtonDisabled]}
            onPress={() => !isFirst && onMoveUp(index)}
            disabled={isFirst}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="chevron-up" 
              size={20} 
              color={isFirst ? 'rgba(255, 255, 255, 0.3)' : '#FFD700'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.reorderButton, isLast && styles.reorderButtonDisabled]}
            onPress={() => !isLast && onMoveDown(index)}
            disabled={isLast}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={isLast ? 'rgba(255, 255, 255, 0.3)' : '#FFD700'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartItems, removeFromCart, clearCart, reorderCart } = useCart();
  const [isStarting, setIsStarting] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleRemoveItem = (workoutId: string) => {
    console.log('🔥 Remove item button pressed for workout:', workoutId);
    console.log('🔥 Cart items before removal:', cartItems.length);
    // Direct removal for better web compatibility
    console.log('🔥 Removing workout from cart:', workoutId);
    removeFromCart(workoutId);
    console.log('🔥 Remove function called');
  };

  const handleClearCart = () => {
    console.log('🗑️ Clear cart button pressed');
    console.log('🗑️ Cart items before clearing:', cartItems.length);
    // Direct clear for better web compatibility
    console.log('🗑️ Clearing entire cart');
    clearCart();
    console.log('🗑️ Clear function called, navigating to home');
    router.push('/(tabs)');
  };

  const handleStartWorkoutSession = () => {
    if (cartItems.length === 0) return;
    
    setIsStarting(true);
    
    // Navigate to the original workout guidance screen with the first workout
    const firstWorkout = cartItems[0];
    router.push({
      pathname: '/workout-guidance',
      params: {
        workoutName: firstWorkout.name,
        equipment: firstWorkout.equipment,
        description: firstWorkout.description,
        battlePlan: firstWorkout.battlePlan,
        duration: firstWorkout.duration,
        difficulty: firstWorkout.difficulty,
        workoutType: firstWorkout.workoutType,
        moodCard: firstWorkout.moodCard,
        // Pass session data for navigation between workouts
        sessionWorkouts: JSON.stringify(cartItems.map(item => ({
          name: item.name,
          equipment: item.equipment,
          description: item.description,
          battlePlan: item.battlePlan,
          duration: item.duration,
          difficulty: item.difficulty,
          workoutType: item.workoutType,
          moodCard: item.moodCard,
          moodTips: item.moodTips || []
        }))),
        currentSessionIndex: '0',
        isSession: 'true',
        moodTips: encodeURIComponent(JSON.stringify(firstWorkout.moodTips || []))
      }
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderCart(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < cartItems.length - 1) {
      reorderCart(index, index + 1);
    }
  };

  const getTotalDuration = () => {
    return cartItems.reduce((total, item) => {
      const duration = parseInt(item.duration.split(' ')[0]) || 0;
      return total + duration;
    }, 0);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Workout Cart</Text>
          <Text style={styles.headerSubtitle}>
            {cartItems.length} workouts • ~{getTotalDuration()} min
          </Text>
        </View>
        {cartItems.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Ionicons name="trash-outline" size={20} color="rgba(255, 215, 0, 0.7)" />
          </TouchableOpacity>
        )}
        {cartItems.length === 0 && <HomeButton />}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="fitness-outline" size={64} color="rgba(255, 255, 255, 0.3)" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add workouts to your cart to create custom workout sessions
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreButtonText}>Explore Workouts</Text>
            <Ionicons name="chevron-forward" size={16} color="#000000" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.instructionsContainer}>
              <Ionicons name="information-circle" size={20} color="#FFD700" />
              <Text style={styles.instructionsText}>
                Your workouts will be performed in the order shown. Use the arrows to reorder.
              </Text>
            </View>

            {cartItems.map((item, index) => (
              <CartItemComponent
                key={item.id}
                item={item}
                index={index}
                onRemove={handleRemoveItem}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                isFirst={index === 0}
                isLast={index === cartItems.length - 1}
              />
            ))}
          </ScrollView>

          {/* Start Session Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.startSessionButton,
                isStarting && styles.startSessionButtonDisabled
              ]}
              onPress={handleStartWorkoutSession}
              disabled={isStarting}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={isStarting ? "hourglass" : "play"} 
                size={20} 
                color="#000000" 
              />
              <Text style={styles.startSessionButtonText}>
                {isStarting ? "Starting..." : "Start Workout Session"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
  },
  moodCardText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  instructionsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  cartItem: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  moodCardTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  moodCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 4,
  },
  workoutTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  workoutTypeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  workoutTypeText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  orderNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  removeButton: {
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cartItemEquipment: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 6,
  },
  cartItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartItemDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  cartItemDifficulty: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cartItemDifficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  reorderButtons: {
    flexDirection: 'column',
    gap: 4,
  },
  reorderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  reorderButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  startSessionButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  startSessionButtonDisabled: {
    backgroundColor: 'rgba(255, 215, 0, 0.5)',
  },
  startSessionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});