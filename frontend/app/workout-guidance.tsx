import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  // Clean up punctuation and extra spaces
  let cleanedDescription = description
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/,\s*\./g, '.') // Remove comma before period
    .replace(/\.\s*,/g, ',') // Remove period before comma
    .replace(/,+/g, ',') // Replace multiple commas with single comma
    .trim();

  // Enhanced splitting patterns for better readability
  const steps = cleanedDescription
    .split(/(?:,\s*)?(?=\d+\s*(?:min|sec))|(?:,\s*)?(?=repeat)|(?:,\s*)?(?=finish with)|(?::\s*)|(?:,\s*(?=\d+\s*(?:rounds?|times?|cycles?|sets?)))/i)
    .map(step => step.trim())
    .filter(step => step.length > 0)
    .map(step => {
      // Remove leading/trailing punctuation and clean up
      step = step.replace(/^[,.\s]+|[,.\s]+$/g, '').trim();
      
      // Handle specific patterns
      if (step.toLowerCase().includes('repeat')) {
        const repeatMatch = step.match(/repeat(?:\s+(?:for\s+)?(\d+\s*(?:x|times?|cycles?)))?/i);
        if (repeatMatch && repeatMatch[1]) {
          return `Repeat ${repeatMatch[1]}`;
        }
        return 'Repeat the sequence';
      }
      
      if (step.toLowerCase().startsWith('finish with')) {
        return `Finish with ${step.substring(11).trim()}`;
      }
      
      // Handle rounds/cycles/sets patterns
      if (/^\d+\s*(?:rounds?|cycles?|sets?)/.test(step)) {
        return step.charAt(0).toUpperCase() + step.slice(1);
      }
      
      // Handle time-based patterns (20 sec max effort, etc.)
      if (/^\d+\s*(?:sec|min)/.test(step)) {
        return step.charAt(0).toUpperCase() + step.slice(1);
      }
      
      // Capitalize first letter
      return step.charAt(0).toUpperCase() + step.slice(1);
    })
    .filter(step => step.length > 0); // Remove any empty steps
  
  return steps.length > 1 ? steps : [cleanedDescription];
};

export default function WorkoutGuidanceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const workoutName = params.workoutName as string || 'Workout';
  const equipment = params.equipment as string || 'Equipment';
  const description = params.description as string || '';
  const duration = params.duration as string || '20 min';
  const difficulty = params.difficulty as string || 'beginner';
  
  // Parse MOOD tips from params (passed as JSON string)
  const moodTipsParam = params.moodTips as string || '[]';
  let moodTips: MOODTip[] = [];
  try {
    moodTips = JSON.parse(decodeURIComponent(moodTipsParam));
  } catch (error) {
    console.error('Error parsing MOOD tips:', error);
    // Fallback tips
    moodTips = [
      {
        icon: 'fitness',
        title: 'Form First',
        description: 'Focus on proper form over speed for maximum effectiveness and injury prevention.'
      },
      {
        icon: 'heart',
        title: 'Breathe Right',
        description: 'Maintain steady breathing rhythm to optimize oxygen delivery and performance.'
      }
    ];
  }
  
  // Get selected equipment names from router state or parse from URL
  // For demo purposes, we'll extract from the navigation path
  const selectedEquipmentNames = [equipment]; // This should be passed from navigation
  const moodTitle = 'I want to sweat'; // This should be passed from navigation
  
  const [elapsedTime, setElapsedTime] = useState(0); // Timer starts from 0:00
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Simple elapsed time timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);
  
  const handleStartPauseTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };
  
  const handleResetTimer = () => {
    setElapsedTime(0);
    setIsRunning(false);
    setIsPaused(false);
  };
  
  const handleCompletedWorkout = () => {
    // Navigate back to the previous workout cards screen
    router.back();
  };
  
  const handleGoBack = () => {
    if (isRunning) {
      Alert.alert(
        'Workout in Progress',
        'Are you sure you want to go back? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go Back', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header - Simple */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Workout Guidance</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Extended Progress Bar - Single Non-Scrolling Line */}
      <View style={styles.extendedProgressContainer}>
        <View style={styles.extendedProgressContent}>
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="flame" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="heart" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Cardio Based</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          {selectedEquipmentNames.map((equipmentName, index) => (
            <React.Fragment key={equipmentName}>
              <View style={styles.progressStep}>
                <View style={styles.progressStepActive}>
                  <Ionicons name="fitness" size={14} color="#000000" />
                </View>
                <Text style={styles.progressStepText}>{equipmentName}</Text>
              </View>
              {index < selectedEquipmentNames.length - 1 && <View style={styles.progressConnector} />}
            </React.Fragment>
          ))}
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="checkmark" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="play" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>In Progress</Text>
          </View>
        </View>
      </View>

      {/* Timer Section - Compact */}
      <View style={styles.timerContainer}>
        <View style={styles.timerRow}>
          <Text style={styles.timerLabel}>Timer:</Text>
          <Text style={styles.timerDisplay}>{formatTime(elapsedTime)}</Text>
          <TouchableOpacity 
            style={[styles.timerButton, styles.primaryButton]}
            onPress={handleStartPauseTimer}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={!isRunning ? "play" : isPaused ? "play" : "pause"} 
              size={16} 
              color="#000000" 
            />
            <Text style={styles.primaryButtonText}>
              {!isRunning ? "Start" : isPaused ? "Resume" : "Pause"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.timerButton, styles.secondaryButton]}
            onPress={handleResetTimer}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={16} color="#FFD700" />
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Workout Instructions - Simplified */}
        <View style={styles.instructionsContainer}>
          <View style={styles.workoutCard}>
            {/* Centered Workout Title */}
            <Text style={styles.centeredWorkoutTitle}>{workoutName}</Text>
            
            {/* Step-by-Step Instructions - User Friendly Format */}
            <View style={styles.stepsContainer}>
              <Text style={styles.stepsHeader}>Step-by-Step Instructions</Text>
              <View style={styles.stepsList}>
                {parseWorkoutDescription(description).map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.bulletPoint}>
                      <Text style={styles.bulletText}>•</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* MOOD Tips Section - Enhanced */}
        <View style={styles.moodTipsContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="bulb" size={24} color="#FFD700" />
            </View>
            <Text style={styles.sectionTitle}>MOOD Tips for Maximum Efficiency</Text>
            <View style={styles.headerAccent} />
          </View>
          
          <View style={styles.tipsGrid}>
            {moodTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipCardHeader}>
                  <View style={styles.tipIconContainer}>
                    <Ionicons name={tip.icon} size={28} color="#FFD700" />
                  </View>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>{index + 1}</Text>
                  </View>
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
                <View style={styles.tipAccentLine} />
              </View>
            ))}
          </View>
          
          {/* Enhanced Workout Details */}
          <View style={styles.workoutDetailsBlock}>
            <View style={styles.detailsHeader}>
              <Ionicons name="clipboard" size={20} color="#FFD700" />
              <Text style={styles.detailsTitle}>Workout Details</Text>
            </View>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <Ionicons name="time" size={24} color="#FFD700" />
                <Text style={styles.detailValue}>{duration}</Text>
                <Text style={styles.detailLabel}>Duration</Text>
              </View>
              
              <View style={styles.detailCard}>
                <Ionicons name="speedometer" size={24} color="#FFD700" />
                <Text style={styles.detailValueSmall}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Text>
                <Text style={styles.detailLabel}>Intensity</Text>
              </View>
              
              <View style={styles.detailCard}>
                <Ionicons name="fitness" size={24} color="#FFD700" />
                <Text style={styles.detailValue}>{equipment}</Text>
                <Text style={styles.detailLabel}>Equipment</Text>
              </View>
            </View>
            
            {/* Workout Preparation Section */}
            <View style={styles.preparationSection}>
              <View style={styles.preparationHeader}>
                <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
                <Text style={styles.preparationTitle}>Before You Begin</Text>
              </View>
              <View style={styles.preparationList}>
                <View style={styles.preparationItem}>
                  <Ionicons name="water" size={16} color="#FFD700" />
                  <Text style={styles.preparationText}>Ensure you have water nearby for hydration</Text>
                </View>
                <View style={styles.preparationItem}>
                  <Ionicons name="body" size={16} color="#FFD700" />
                  <Text style={styles.preparationText}>Start with light warm-up movements</Text>
                </View>
                <View style={styles.preparationItem}>
                  <Ionicons name="timer" size={16} color="#FFD700" />
                  <Text style={styles.preparationText}>Focus on proper form over speed</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Completed Workout Button - Fixed at Bottom */}
      <View style={styles.completedButtonContainer}>
        <TouchableOpacity 
          style={styles.completedButton}
          onPress={handleCompletedWorkout}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={24} color="#000000" />
          <Text style={styles.completedButtonText}>Completed Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getDifficultyColor = (level: string) => {
  return '#FFD700'; // Same neon gold for all difficulty levels
};

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
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  extendedProgressContainer: {
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  extendedProgressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    flexWrap: 'nowrap',
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 80,
  },
  progressStepActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  progressStepText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 80,
  },
  progressConnector: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 8,
    marginTop: 16,
  },
  timerContainer: {
    backgroundColor: '#111111',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  timerLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  timerDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'center',
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    minWidth: 80,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFD700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  timerStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  instructionsContainer: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 215, 0, 0.3)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  headerAccent: {
    width: 4,
    height: 40,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  workoutCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  workoutTitleSection: {
    flex: 1,
    marginRight: 16,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  equipmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  equipmentText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  workoutMeta: {
    alignItems: 'flex-end',
    gap: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  workoutDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  workoutDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  moodTipsContainer: {
    padding: 24,
    paddingTop: 0,
  },
  tipsGrid: {
    gap: 16,
  },
  tipCard: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  tipCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tipIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  tipDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    marginBottom: 16,
  },
  tipAccentLine: {
    height: 3,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  workoutDetailsBlock: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  detailCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    textAlign: 'center',
  },
  preparationSection: {
    marginTop: 16,
  },
  preparationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  preparationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  preparationList: {
    gap: 8,
  },
  preparationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  preparationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  // New styles for simplified workout instructions
  centeredWorkoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  bulletPoint: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  detailValueSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  stepText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    flex: 1,
  },
  // Completed workout button styles
  completedButtonContainer: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  completedButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  completedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});