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

interface ExplosivenessTypeOption {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const explosivenessTypeOptions: ExplosivenessTypeOption[] = [
  {
    id: 'bodyweight',
    title: 'Body Weight',
    subtitle: 'Explosive bodyweight movements',
    icon: 'body',
    description: 'Plyometric exercises using your own bodyweight for explosive power training',
  },
  {
    id: 'weight',
    title: 'Weight Based',
    subtitle: 'Explosive movements with weights',
    icon: 'barbell',
    description: 'Power training with weights and equipment to build explosive strength',
  },
];

const ExplosivenessTypeOption = ({ 
  option, 
  onPress,
  isSelected
}: { 
  option: ExplosivenessTypeOption; 
  onPress: (option: ExplosivenessTypeOption) => void;
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

export default function ExplosivenessTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const moodTitle = params.mood as string || 'Build explosion';

  const handleExplosivenessTypeSelect = (option: ExplosivenessTypeOption) => {
    console.log('Selected explosiveness type:', option.title, 'for mood:', moodTitle);
    
    if (option.id === 'bodyweight') {
      // Navigate to bodyweight equipment selection
      router.push({
        pathname: '/bodyweight-equipment',
        params: { mood: moodTitle, workoutType: option.title }
      });
    } else if (option.id === 'weight') {
      // Navigate to weight-based equipment selection
      router.push({
        pathname: '/weight-equipment',
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
          <Text style={styles.instructionTitle}>Build Your Power</Text>
          <Text style={styles.instructionText}>
            Choose the type of explosive training that matches your goals today
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {explosivenessTypeOptions.map((option) => (
            <ExplosivenessTypeOption
              key={option.id}
              option={option}
              onPress={handleExplosivenessTypeSelect}
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
    shadowRadius: 15,
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