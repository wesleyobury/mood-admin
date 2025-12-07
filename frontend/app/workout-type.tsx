import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';

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
  return (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => onPress(option)}
      activeOpacity={0.8}
    >
      <View style={[styles.optionCard, isSelected && styles.selectedOptionCard]}>
        <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
          <Ionicons 
            name={option.icon} 
            size={48} 
            color={isSelected ? "#FFD700" : "#FFD700"} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.optionTitle, isSelected && styles.selectedOptionTitle]}>{option.title}</Text>
          <Text style={[styles.optionSubtitle, isSelected && styles.selectedOptionSubtitle]}>{option.subtitle}</Text>
          <Text style={[styles.optionDescription, isSelected && styles.selectedOptionDescription]}>{option.description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          {isSelected ? (
            <Ionicons name="checkmark-circle" size={28} color="#FFD700" />
          ) : (
            <Ionicons name="chevron-forward" size={24} color="#FFD700" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function WorkoutTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState<WorkoutTypeOption | null>(null);
  
  const moodTitle = params.mood as string || 'I want to sweat';

  const handleWorkoutTypeSelect = (option: WorkoutTypeOption) => {
    console.log('Selected workout type:', option.title, 'for mood:', moodTitle);
    setSelectedOption(option);
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
            {workoutTypeOptions.map((option) => (
              <WorkoutTypeOption
                key={option.id}
                option={option}
                onPress={handleWorkoutTypeSelect}
                isSelected={selectedOption?.id === option.id}
              />
            ))}
          </View>

          {selectedOption && (
            <View style={styles.selectionSummary}>
              <Text style={styles.selectionText}>
                Selected: {selectedOption.title}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Continue Button */}
      {selectedOption && (
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
  optionContainer: {
    marginBottom: 0,
  },
  optionCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 215, 0, 0.12)',
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
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 8,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOptionCard: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  selectedIconContainer: {
    backgroundColor: '#000',
    borderColor: '#FFD700',
  },
  selectedOptionTitle: {
    color: '#000',
  },
  selectedOptionSubtitle: {
    color: '#000',
    fontWeight: '600',
  },
  selectedOptionDescription: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  selectionSummary: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
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