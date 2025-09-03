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

interface WorkoutStep {
  duration: number; // in seconds
  instruction: string;
  intensity: 'easy' | 'moderate' | 'hard' | 'sprint' | 'rest';
}

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

const getIntensityColor = (intensity: string): string => {
  switch (intensity) {
    case 'easy': return '#FFD700';      // Gold for easy
    case 'moderate': return '#FFA500';  // Dark gold for moderate  
    case 'hard': return '#B8860B';      // Dark golden rod for hard
    case 'sprint': return '#DAA520';    // Golden rod for sprint
    case 'rest': return '#F0E68C';      // Khaki (lighter gold) for rest
    default: return '#FFD700';
  }
};

const parseWorkoutSteps = (description: string): WorkoutStep[] => {
  // Parse workout description into structured steps
  // This is a simplified parser - in production, you'd have structured workout data
  const steps: WorkoutStep[] = [];
  
  // Extract time-based instructions
  const timeMatches = description.match(/(\d+)\s*min\s+([^,]+)/g);
  
  if (timeMatches) {
    timeMatches.forEach(match => {
      const timeMatch = match.match(/(\d+)\s*min\s+(.+)/);
      if (timeMatch) {
        const duration = parseInt(timeMatch[1]) * 60; // convert to seconds
        const instruction = timeMatch[2].trim();
        
        let intensity: WorkoutStep['intensity'] = 'moderate';
        if (instruction.toLowerCase().includes('easy') || instruction.toLowerCase().includes('rest')) {
          intensity = 'easy';
        } else if (instruction.toLowerCase().includes('sprint') || instruction.toLowerCase().includes('fast')) {
          intensity = 'sprint';
        } else if (instruction.toLowerCase().includes('hard') || instruction.toLowerCase().includes('climb')) {
          intensity = 'hard';
        }
        
        steps.push({ duration, instruction, intensity });
      }
    });
  }
  
  // If no structured steps found, create a single step
  if (steps.length === 0) {
    steps.push({
      duration: 600, // 10 minutes default
      instruction: description,
      intensity: 'moderate'
    });
  }
  
  return steps;
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
  
  const [elapsedTime, setElapsedTime] = useState(0); // Timer starts from 0:00
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Simple elapsed time timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
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
  
  const handleStop = () => {
    Alert.alert(
      'Stop Workout?',
      'Are you sure you want to stop this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Stop', style: 'destructive', onPress: () => router.back() }
      ]
    );
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
  
  if (showTips) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{workoutName}</Text>
            <Text style={styles.headerSubtitle}>{equipment} • {difficulty}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* MOOD Tips */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={32} color="#FFD700" />
              <Text style={styles.tipsTitle}>MOOD Tips</Text>
              <Text style={styles.tipsSubtitle}>Maximize your workout efficiency</Text>
            </View>
            
            {moodTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipIconContainer}>
                  <Ionicons name={tip.icon} size={24} color="#FFD700" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
            
            <View style={styles.workoutPreview}>
              <Text style={styles.previewTitle}>Workout Overview</Text>
              <Text style={styles.previewDuration}>Duration: {duration}</Text>
              <Text style={styles.previewDescription}>{description}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Start Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
            <Ionicons name="play" size={24} color="#000000" />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with Timer */}
      <View style={styles.workoutHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.timerLabel}>
            Step {currentStepIndex + 1} of {workoutSteps.length}
          </Text>
        </View>
        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
          <Ionicons name="stop" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>

      {/* Current Step */}
      <View style={styles.stepContainer}>
        <View style={[
          styles.intensityBadge,
          { backgroundColor: getIntensityColor(currentStep?.intensity || 'moderate') }
        ]}>
          <Text style={styles.intensityText}>
            {currentStep?.intensity.toUpperCase() || 'MODERATE'}
          </Text>
        </View>
        <Text style={styles.stepInstruction}>
          {currentStep?.instruction || 'Follow the workout instructions'}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((totalDuration - timeRemaining) / totalDuration) * 100}%`
              }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(((totalDuration - timeRemaining) / totalDuration) * 100)}% Complete
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, styles.pauseButton]} 
          onPress={handlePauseResume}
        >
          <Ionicons 
            name={isPaused ? "play" : "pause"} 
            size={32} 
            color="#000000" 
          />
          <Text style={styles.controlButtonText}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Workout Steps Preview */}
      <ScrollView style={styles.stepsPreview} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepsTitle}>Workout Steps</Text>
        {workoutSteps.map((step, index) => (
          <View 
            key={index} 
            style={[
              styles.stepItem,
              index === currentStepIndex && styles.activeStepItem
            ]}
          >
            <View style={[
              styles.stepNumber,
              index === currentStepIndex && styles.activeStepNumber
            ]}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepDetails}>
              <Text style={styles.stepDuration}>
                {formatTime(step.duration)}
              </Text>
              <Text style={styles.stepInstructionText}>
                {step.instruction}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  tipsContainer: {
    padding: 24,
  },
  tipsHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 12,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tipsSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  workoutPreview: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  previewDuration: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  startButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    backgroundColor: '#111111',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timerLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  stepContainer: {
    padding: 24,
    alignItems: 'center',
  },
  intensityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  intensityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepInstruction: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 26,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  controlButton: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pauseButton: {
    backgroundColor: '#FFD700',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  stepsPreview: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111111',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeStepItem: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeStepNumber: {
    backgroundColor: '#FFD700',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepDetails: {
    flex: 1,
  },
  stepDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  stepInstructionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});