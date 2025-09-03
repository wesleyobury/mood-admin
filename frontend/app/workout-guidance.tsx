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
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Workout Guidance</Text>
          <Text style={styles.headerSubtitle}>{workoutName}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Extended Progress Bar - Persistent */}
      <View style={styles.extendedProgressContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.extendedProgressContent}
        >
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
        </ScrollView>
      </View>

      {/* Timer Section */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Workout Timer</Text>
        <Text style={styles.timerDisplay}>{formatTime(elapsedTime)}</Text>
        
        {/* Timer Controls */}
        <View style={styles.timerControls}>
          <TouchableOpacity 
            style={[styles.timerButton, styles.primaryButton]}
            onPress={handleStartPauseTimer}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={!isRunning ? "play" : isPaused ? "play" : "pause"} 
              size={20} 
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
            <Ionicons name="refresh" size={20} color="#FFD700" />
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.timerStatus}>
          {isRunning ? (isPaused ? "Timer Paused" : "Timer Running") : "Timer Stopped"}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Workout Instructions - Enhanced */}
        <View style={styles.instructionsContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="list" size={24} color="#FFD700" />
            </View>
            <Text style={styles.sectionTitle}>Workout Instructions</Text>
            <View style={styles.headerAccent} />
          </View>
          
          <View style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <View style={styles.workoutTitleSection}>
                <Text style={styles.workoutTitle}>{workoutName}</Text>
                <View style={styles.equipmentTag}>
                  <Ionicons name="fitness" size={16} color="#FFD700" />
                  <Text style={styles.equipmentText}>{equipment}</Text>
                </View>
              </View>
              <View style={styles.workoutMeta}>
                <View style={styles.durationContainer}>
                  <Ionicons name="time" size={16} color="#FFD700" />
                  <Text style={styles.workoutDuration}>{duration}</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
                  <Ionicons name="speedometer" size={14} color="#000000" />
                  <Text style={styles.difficultyText}>{difficulty.toUpperCase()}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.descriptionContainer}>
              <View style={styles.descriptionHeader}>
                <Ionicons name="document-text" size={18} color="#FFD700" />
                <Text style={styles.descriptionLabel}>Step-by-Step Instructions</Text>
              </View>
              <Text style={styles.workoutDescription}>{description}</Text>
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
          
          {/* Performance Stats Block */}
          <View style={styles.performanceBlock}>
            <View style={styles.performanceHeader}>
              <Ionicons name="analytics" size={20} color="#FFD700" />
              <Text style={styles.performanceTitle}>Performance Tracker</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Reps</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Sets</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'beginner': return '#FFD700';    // Gold for beginners
    case 'intermediate': return '#FFA500'; // Dark gold for intermediate  
    case 'advanced': return '#B8860B';     // Dark golden rod for advanced
    default: return '#FFD700';
  }
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
    alignItems: 'center',
    paddingHorizontal: 10,
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
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  timerLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    minWidth: 100,
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
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
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
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
  },
  workoutMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  workoutDuration: {
    fontSize: 16,
    fontWeight: 'bold',
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
  tipCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
  },
  tipDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
});