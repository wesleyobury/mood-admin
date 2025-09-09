import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Difficulty {
  level: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  color: string;
}

const difficultyLevels: Difficulty[] = [
  {
    level: 'Beginner',
    icon: 'leaf',
    description: 'New to strength training\n8-12 reps • 2-3 sets',
    color: '#FFD700'
  },
  {
    level: 'Intermediate',
    icon: 'flash',
    description: 'Some training experience\n6-10 reps • 3-4 sets',
    color: '#FFA500'
  },
  {
    level: 'Advanced',
    icon: 'flame',
    description: 'Experienced lifter\n4-8 reps • 4-5 sets',
    color: '#B8860B'
  }
];

export default function MuscleDifficultyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const { mood, bodyParts, equipment } = params;
  const bodyPartsList = typeof bodyParts === 'string' ? bodyParts.split(',') : [];
  const equipmentList = typeof equipment === 'string' ? equipment.split(',') : [];

  const handleDifficultySelect = (level: string) => {
    setSelectedDifficulty(level);
  };

  const handleContinue = () => {
    if (selectedDifficulty) {
      // Navigate to muscle workout display
      router.push({
        pathname: '/muscle-workout-display',
        params: {
          mood: mood,
          bodyParts: bodyParts,
          equipment: equipment,
          difficulty: selectedDifficulty,
        }
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Difficulty</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.progressBar}>
            <View style={styles.progressStep}>
              <Text style={styles.progressText}>{mood}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
            <View style={styles.progressStep}>
              <Text style={styles.progressText}>{bodyPartsList.join(', ')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
            <View style={styles.progressStep}>
              <Text style={styles.progressText}>Equipment ({equipmentList.length})</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
            <View style={[styles.progressStep, styles.activeStep]}>
              <Text style={[styles.progressText, styles.activeProgressText]}>Difficulty</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Difficulty Selection */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Choose your strength training experience level
        </Text>
        
        <View style={styles.difficultyContainer}>
          {difficultyLevels.map((difficulty) => {
            const isSelected = selectedDifficulty === difficulty.level;
            return (
              <TouchableOpacity
                key={difficulty.level}
                style={[
                  styles.difficultyCard,
                  isSelected && styles.selectedDifficultyCard,
                  { borderColor: difficulty.color }
                ]}
                onPress={() => handleDifficultySelect(difficulty.level)}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: difficulty.color }
                ]}>
                  <Ionicons 
                    name={difficulty.icon} 
                    size={36} 
                    color="#000" 
                  />
                </View>
                <Text style={[
                  styles.difficultyLevel,
                  isSelected && { color: difficulty.color }
                ]}>
                  {difficulty.level}
                </Text>
                <Text style={[
                  styles.difficultyDescription,
                  isSelected && styles.selectedDifficultyDescription
                ]}>
                  {difficulty.description}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={24} color={difficulty.color} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedDifficulty && (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              Selected: {selectedDifficulty} level training
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      {selectedDifficulty && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#000" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStep: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  activeStep: {
    backgroundColor: '#FFD700',
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  activeProgressText: {
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  difficultyContainer: {
    gap: 20,
  },
  difficultyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedDifficultyCard: {
    backgroundColor: '#222',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  difficultyLevel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedDifficultyDescription: {
    color: '#ccc',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  selectionSummary: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  selectionText: {
    fontSize: 14,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  continueButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});