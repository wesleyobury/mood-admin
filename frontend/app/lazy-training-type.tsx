import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';

interface LazyTrainingTypeOption {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const lazyTrainingTypeOptions: LazyTrainingTypeOption[] = [
  {
    id: 'bodyweight',
    title: 'Move your body',
    subtitle: 'Light movements',
    icon: 'walk',
    description: 'Easy flows and gentle bodyweight exercises to get you moving at your own comfortable pace today',
  },
  {
    id: 'weights',
    title: 'Lift weights',
    subtitle: 'Easy strength training',
    icon: 'barbell',
    description: 'Simple weight exercises with lighter loads and comfortable pacing for relaxed strength building at your own tempo',
  },
];

const LazyTrainingTypeOption = ({ 
  option, 
  onPress 
}: { 
  option: LazyTrainingTypeOption; 
  onPress: (option: LazyTrainingTypeOption) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => onPress(option)}
      activeOpacity={0.8}
    >
      <View style={styles.optionCard}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={option.icon} 
            size={48} 
            color="#FFD700" 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color="#FFD700" 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function LazyTrainingTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const moodTitle = params.mood as string || "I'm feeling lazy";

  const handleLazyTrainingTypeSelect = (option: LazyTrainingTypeOption) => {
    console.log('Selected lazy training type:', option.title, 'for mood:', moodTitle);
    
    if (option.id === 'bodyweight') {
      // Navigate to lazy bodyweight equipment selection
      router.push({
        pathname: '/lazy-bodyweight-equipment',
        params: { mood: moodTitle, workoutType: option.title }
      });
    } else if (option.id === 'weights') {
      // Navigate to lazy weight selection
      router.push({
        pathname: '/lazy-weight-selection',
        params: { mood: moodTitle, workoutType: option.title }
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
          <Text style={styles.headerTitle}>Training Type</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <HomeButton />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Take It Easy</Text>
          <Text style={styles.instructionText}>
            Choose a gentle way to move your body today - no pressure, just progress
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {lazyTrainingTypeOptions.map((option) => (
            <LazyTrainingTypeOption
              key={option.id}
              option={option}
              onPress={handleLazyTrainingTypeSelect}
            />
          ))}
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
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
    borderRadius: 20,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
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
});