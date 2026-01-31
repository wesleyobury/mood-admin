import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import HomeButton from '../components/HomeButton';
import ChooseForMeButton from '../components/ChooseForMeButton';
import IntensitySelectionModal, { IntensityLevel } from '../components/IntensitySelectionModal';
import GeneratedWorkoutView, { GeneratedCart } from '../components/GeneratedWorkoutView';
import GuestPromptModal from '../components/GuestPromptModal';
import { generateSweatBurnFatCarts } from '../utils/workoutGenerator';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

interface WorkoutTypeOption {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const workoutTypeOptions: WorkoutTypeOption[] = [
  {
    id: 'cardio',
    title: 'Cardio Based',
    subtitle: 'Get your heart pumping',
    icon: 'heart',
    description: 'High-intensity cardio workouts to burn calories and improve cardiovascular health',
  },
  {
    id: 'weight',
    title: 'Light weights',
    subtitle: 'Using weights & equipment to burn cals',
    icon: 'barbell',
    description: 'Strength training with weights and equipment to burn calories and build lean muscle',
  },
];

const WorkoutTypeOption = ({ 
  option, 
  onPress,
  isSelected 
}: { 
  option: WorkoutTypeOption; 
  onPress: (option: WorkoutTypeOption) => void;
  isSelected: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress(option);
  };

  return (
    <Animated.View style={[styles.optionContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.optionCard, isSelected && styles.selectedOptionCard]}>
          <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
            <Ionicons 
              name={option.icon} 
              size={32} 
              color={isSelected ? '#FFD700' : '#FFD700'} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.optionTitle, isSelected && styles.selectedOptionTitle]}>{option.title}</Text>
            <Text style={[styles.optionSubtitle, isSelected && styles.selectedOptionSubtitle]}>{option.subtitle}</Text>
            <Text style={[styles.optionDescription, isSelected && styles.selectedOptionDescription]}>{option.description}</Text>
          </View>
          <View style={styles.arrowContainer}>
            {isSelected ? (
              <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
            ) : (
              <Ionicons name="chevron-forward" size={20} color='rgba(255, 255, 255, 0.3)' />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function WorkoutTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState<WorkoutTypeOption | null>(null);
  const [showIntensityModal, setShowIntensityModal] = useState(false);
  const [generatedCarts, setGeneratedCarts] = useState<GeneratedCart[]>([]);
  const [showGeneratedWorkout, setShowGeneratedWorkout] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [remainingUses, setRemainingUses] = useState(3);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const { addToCart, clearCart } = useCart();
  const { isGuest, token } = useAuth();
  
  const moodTitle = params.mood as string || 'Sweat / burn fat';

  // Fetch usage on mount for logged-in users
  useEffect(() => {
    const fetchUsage = async () => {
      if (isGuest || !token) return;
      
      setIsLoadingUsage(true);
      try {
        const response = await fetch(`${API_URL}/api/choose-for-me/usage`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRemainingUses(data.remaining_uses);
        }
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setIsLoadingUsage(false);
      }
    };
    
    fetchUsage();
  }, [isGuest, token]);

  const handleWorkoutTypeSelect = (option: WorkoutTypeOption) => {
    console.log('Selected workout type:', option.title, 'for mood:', moodTitle);
    setSelectedOption(option);
  };

  const handleChooseForMe = () => {
    // Show guest prompt if user is a guest
    if (isGuest) {
      setShowGuestPrompt(true);
      return;
    }
    
    // Check if user has remaining uses
    if (remainingUses <= 0) {
      Alert.alert(
        'Daily Limit Reached',
        'You can only use Choose for Me 3 times per day. Try again tomorrow!',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setShowIntensityModal(true);
  };

  const handleIntensitySelect = async (intensity: IntensityLevel) => {
    setShowIntensityModal(false);
    
    // Generate combined workout carts from cardio + light weights
    const carts = generateSweatBurnFatCarts(intensity, moodTitle, 'Mixed Workout');
    
    if (carts.length > 0) {
      // Save to backend
      if (!isGuest && token) {
        try {
          const response = await fetch(`${API_URL}/api/choose-for-me/generate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              carts: carts.map(cart => ({
                id: cart.id,
                workouts: cart.workouts.map(w => ({
                  name: w.name,
                  duration: w.duration,
                  equipment: w.equipment,
                  description: w.description,
                  imageUrl: w.imageUrl,
                })),
                totalDuration: cart.totalDuration,
                intensity: cart.intensity,
                moodCard: moodTitle,
                workoutType: 'Mixed Workout',
              })),
              moodCard: moodTitle,
              intensity: intensity,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setRemainingUses(data.remaining_uses);
          } else if (response.status === 429) {
            Alert.alert(
              'Daily Limit Reached',
              'You can only use Choose for Me 3 times per day. Try again tomorrow!',
              [{ text: 'OK' }]
            );
            return;
          }
        } catch (error) {
          console.error('Error saving generated workout:', error);
        }
      }
      
      setGeneratedCarts(carts);
      setShowGeneratedWorkout(true);
    }
  };

  const handleStartWorkout = (cart: GeneratedCart) => {
    // Clear current cart and add generated workouts
    clearCart();
    cart.workouts.forEach(workout => {
      addToCart(workout);
    });
    
    // Navigate to cart screen
    setShowGeneratedWorkout(false);
    router.push('/cart');
  };

  const handleCloseGeneratedWorkout = () => {
    setShowGeneratedWorkout(false);
    setGeneratedCarts([]);
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    
    if (selectedOption.id === 'cardio') {
      // Navigate to cardio equipment selection screen
      router.push({
        pathname: '/cardio-equipment',
        params: { mood: moodTitle, workoutType: selectedOption.title }
      });
    } else if (selectedOption.id === 'weight') {
      // Navigate to light weights equipment selection screen (cardio path)
      router.push({
        pathname: '/light-weights-equipment',
        params: { mood: moodTitle, workoutType: selectedOption.title }
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Handle skip (costs 1 generation)
  const handleSkip = async (): Promise<boolean> => {
    if (!token || isGuest) return false;
    
    try {
      const response = await fetch(`${API_URL}/api/choose-for-me/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carts: [], // Empty for skip tracking
          moodCard: moodTitle,
          intensity: 'skip',
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setRemainingUses(data.remaining_uses);
        return true;
      } else if (response.status === 429) {
        return false;
      }
    } catch (error) {
      console.error('Error recording skip:', error);
    }
    return false;
  };

  // Handle save workout to saved workouts
  const handleSaveWorkout = async (cart: GeneratedCart): Promise<void> => {
    if (!token || isGuest) return;
    
    try {
      // Save as a regular saved workout
      const workoutData = {
        name: `${workoutType} - Generated`,
        workouts: cart.workouts.map(w => ({
          name: w.name,
          duration: w.duration,
          equipment: w.equipment,
          description: w.description || '',
          imageUrl: w.imageUrl || '',
          difficulty: w.difficulty || cart.intensity,
          moodCard: moodTitle,
          workoutType: 'Mixed Workout',
        })),
        totalDuration: cart.totalDuration,
        isGenerated: true,
        generatedIntensity: cart.intensity,
        moodCard: moodTitle,
      };
      
      const response = await fetch(`${API_URL}/api/saved-workouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  };

  // Show generated workout view as modal
  if (showGeneratedWorkout && generatedCarts.length > 0) {
    return (
      <Modal visible={true} animationType="slide" presentationStyle="fullScreen">
        <GeneratedWorkoutView
          carts={generatedCarts}
          moodTitle={moodTitle}
          workoutType="Mixed Workout"
          onStartWorkout={handleStartWorkout}
          onClose={handleCloseGeneratedWorkout}
          onSkip={handleSkip}
          onSave={handleSaveWorkout}
          remainingGenerations={remainingUses}
        />
      </Modal>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color='#FFD700' />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Workout Type</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <HomeButton />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>Choose Your Focus</Text>
            <Text style={styles.instructionText}>
              Select the type of workout that matches your goals today
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {workoutTypeOptions.map((option, index) => (
              <View key={option.id}>
                <WorkoutTypeOption
                  option={option}
                  onPress={handleWorkoutTypeSelect}
                  isSelected={selectedOption?.id === option.id}
                />
                {/* Place Choose for Me button after the second option (Light Weights) */}
                {index === 1 && (
                  <View style={styles.chooseForMeContainer}>
                    <ChooseForMeButton onPress={handleChooseForMe} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      {selectedOption && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color='#0c0c0c' style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Intensity Selection Modal */}
      <IntensitySelectionModal
        visible={showIntensityModal}
        onClose={() => setShowIntensityModal(false)}
        onSelect={handleIntensitySelect}
        moodTitle={moodTitle}
        remainingUses={remainingUses}
      />

      {/* Guest Prompt Modal */}
      <GuestPromptModal
        visible={showGuestPrompt}
        onClose={() => setShowGuestPrompt(false)}
        action="use Choose for Me"
      />
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
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  scrollView: {
    flex: 1,
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  instructionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 20,
  },
  chooseForMeContainer: {
    marginTop: 16,
  },
  optionContainer: {
    marginBottom: 0,
  },
  optionCard: {
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  selectedOptionCard: {
    backgroundColor: '#1a1a1a',
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  selectedIconContainer: {
    backgroundColor: '#333333',
  },
  selectedOptionTitle: {
    color: '#FFFFFF',
  },
  selectedOptionSubtitle: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedOptionDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c0c0c',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});