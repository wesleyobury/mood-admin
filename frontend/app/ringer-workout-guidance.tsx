import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';
import { Analytics } from '../utils/analytics';

interface MOODTip {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const parseWorkoutDescription = (description: string): string[] => {
  // Handle the new format with instructions and bulleted movements
  if (description.includes('\n•') || description.includes('\n')) {
    const lines = description
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const steps: string[] = [];
    
    for (const line of lines) {
      if (line.startsWith('•')) {
        // This is a movement/exercise
        const cleanStep = line.replace(/^•\s*/, '').trim();
        if (cleanStep) {
          const capitalized = cleanStep.charAt(0).toUpperCase() + cleanStep.slice(1);
          steps.push(`• ${capitalized}`);
        }
      } else {
        // This is an instruction - make it bold style
        const cleanStep = line.trim();
        if (cleanStep) {
          const capitalized = cleanStep.charAt(0).toUpperCase() + cleanStep.slice(1);
          steps.push(capitalized);
        }
      }
    }
    
    return steps.filter(step => step.length > 0);
  }
  
  return description.split(',').map(s => s.trim()).filter(s => s.length > 0);
};

export default function RingerWorkoutGuidance() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { addToCart, cartItems } = useCart();
  const { token } = useAuth();
  
  // Parse params
  const workoutId = params.workoutId as string;
  const workoutName = params.workoutName as string || 'Four Corners of Regret';
  const duration = params.duration as string || '60 min';
  const description = params.description as string || '';
  const equipment = params.equipment as string || 'Gym Equipment';
  const difficulty = params.difficulty as string || 'Advanced';
  const summary = params.summary as string || '';
  const moodTips: MOODTip[] = params.moodTips ? JSON.parse(params.moodTips as string) : [];
  
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCompleteConfirmation, setShowCompleteConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);
  
  // Track screen view
  useEffect(() => {
    if (token) {
      Analytics.screenViewed(token, {
        screen_name: 'ringer_workout_guidance',
        workout_name: workoutName,
      });
    }
  }, []);
  
  const handleStartTimer = () => {
    setIsTimerRunning(true);
    if (token) {
      Analytics.workoutStarted(token, {
        mood_category: 'ringer',
        difficulty,
        equipment,
      });
    }
  };
  
  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };
  
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setElapsedTime(0);
  };
  
  const handleComplete = () => {
    setShowCompleteConfirmation(true);
  };
  
  const confirmComplete = () => {
    setIsTimerRunning(false);
    setShowCompleteConfirmation(false);
    
    if (token) {
      Analytics.workoutCompleted(token, {
        mood_category: 'ringer',
        workout_name: workoutName,
        duration_seconds: elapsedTime,
        difficulty,
        equipment,
      });
    }
    
    setToastMessage('Challenge conquered! 💀');
    setShowToast(true);
    
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);
  };
  
  const isInCart = () => {
    return cartItems.some(item => item.id === `ringer-${workoutId}`);
  };
  
  const handleAddToCart = () => {
    if (isInCart()) {
      setToastMessage('Already in cart');
      setShowToast(true);
      return;
    }
    
    addToCart({
      id: `ringer-${workoutId}`,
      workoutTitle: workoutName,
      workoutName: workoutName,
      equipment: equipment,
      duration: duration,
      difficulty: difficulty,
      moodCategory: 'ringer',
      description: description,
      moodTips: moodTips,
      summary: summary,
    });
    
    setToastMessage('Added to cart');
    setShowToast(true);
  };
  
  const workoutSteps = parseWorkoutDescription(description);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="skull" size={20} color="#FFD700" />
          <Text style={styles.headerTitle} numberOfLines={1}>{workoutName}</Text>
        </View>
        <HomeButton />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Timer Card */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Elapsed Time</Text>
          <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
          
          <View style={styles.timerButtons}>
            {!isTimerRunning ? (
              <TouchableOpacity 
                style={styles.timerButton}
                onPress={handleStartTimer}
              >
                <LinearGradient
                  colors={['#FF8C00', '#FF6B00']}
                  style={styles.timerButtonGradient}
                >
                  <Ionicons name="play" size={24} color="#fff" />
                  <Text style={styles.timerButtonText}>
                    {elapsedTime > 0 ? 'Resume' : 'Start'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.timerButton}
                onPress={handlePauseTimer}
              >
                <View style={styles.pauseButton}>
                  <Ionicons name="pause" size={24} color="#FFD700" />
                  <Text style={[styles.timerButtonText, { color: '#FFD700' }]}>Pause</Text>
                </View>
              </TouchableOpacity>
            )}
            
            {elapsedTime > 0 && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleResetTimer}
              >
                <Ionicons name="refresh" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Workout Summary */}
        {summary && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Workout Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}
        
        {/* MOOD Tips */}
        {moodTips.length > 0 && (
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>MOOD Tips</Text>
            {moodTips.map((tip, index) => (
              <LinearGradient
                key={index}
                colors={['#2a2a2a', '#1a1a1a']}
                style={styles.tipCard}
              >
                <View style={styles.tipIconContainer}>
                  <Ionicons name={tip.icon} size={22} color="#FFD700" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        )}
        
        {/* Battle Plan */}
        <View style={styles.battlePlanSection}>
          <Text style={styles.sectionTitle}>Battle Plan</Text>
          <View style={styles.battlePlanCard}>
            {workoutSteps.map((step, index) => {
              const isHeader = !step.startsWith('•');
              return (
                <View 
                  key={index} 
                  style={[
                    styles.stepRow,
                    isHeader && styles.stepHeaderRow
                  ]}
                >
                  {isHeader ? (
                    <Text style={styles.stepHeaderText}>{step}</Text>
                  ) : (
                    <>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.stepText}>{step.replace('• ', '')}</Text>
                    </>
                  )}
                </View>
              );
            })}
          </View>
        </View>
        
        {/* Add to Cart Button */}
        <TouchableOpacity 
          style={[styles.addToCartButton, isInCart() && styles.addedToCartButton]}
          onPress={handleAddToCart}
        >
          <Ionicons 
            name={isInCart() ? "checkmark-circle" : "add-circle-outline"} 
            size={22} 
            color={isInCart() ? "#4CAF50" : "#FFD700"} 
          />
          <Text style={[styles.addToCartText, isInCart() && styles.addedToCartText]}>
            {isInCart() ? 'In Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
        
        {/* Complete Button */}
        {elapsedTime > 60 && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <LinearGradient
              colors={['#4CAF50', '#2E7D32']}
              style={styles.completeButtonGradient}
            >
              <Ionicons name="trophy" size={22} color="#fff" />
              <Text style={styles.completeButtonText}>Mark as Complete</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Complete Confirmation Modal */}
      {showCompleteConfirmation && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="skull" size={48} color="#FFD700" />
            <Text style={styles.modalTitle}>Challenge Complete?</Text>
            <Text style={styles.modalSubtitle}>
              Time: {formatTime(elapsedTime)}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowCompleteConfirmation(false)}
              >
                <Text style={styles.modalCancelText}>Not Yet</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={confirmComplete}
              >
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={styles.modalConfirmGradient}
                >
                  <Text style={styles.modalConfirmText}>Conquered!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Toast */}
      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
        type="success"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  timerCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  timerLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFD700',
    fontVariant: ['tabular-nums'],
    marginBottom: 20,
  },
  timerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timerButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  timerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  timerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  resetButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  summaryCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  tipsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  battlePlanSection: {
    marginBottom: 20,
  },
  battlePlanCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  stepHeaderRow: {
    marginTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  stepHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFD700',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginTop: 7,
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  addedToCartButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  addedToCartText: {
    color: '#4CAF50',
  },
  completeButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalConfirmGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
