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

interface EquipmentOption {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface DifficultyLevel {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

// Calisthenics equipment options (alphabetically ordered)
const equipmentOptions: EquipmentOption[] = [
  { id: 'ab-wheel', name: 'Ab wheel', icon: 'ellipse' },
  { id: 'gymnast-rings', name: 'Gymnast rings', icon: 'radio-button-off' },
  { id: 'parallel-bars', name: 'Parallel bars / dip station', icon: 'remove' },
  { id: 'pull-up-bar', name: 'Pull up bar', icon: 'remove-outline' },
  { id: 'pure-bodyweight', name: 'Pure bodyweight', icon: 'body' },
  { id: 'pushup-bars', name: 'Pushup bars / parallettes', icon: 'reorder-three' },
];

// Difficulty levels with calisthenics-appropriate descriptions
const difficultyLevels: DifficultyLevel[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    subtitle: 'New to calisthenics movements',
    color: '#FFD700',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    subtitle: 'Comfortable with basic calisthenics',
    color: '#FFD700',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle: 'Mastering advanced calisthenics skills',
    color: '#FFD700',
  },
];

const EquipmentCard = ({ 
  equipment, 
  isSelected, 
  onPress 
}: { 
  equipment: EquipmentOption; 
  isSelected: boolean;
  onPress: (equipment: EquipmentOption) => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.equipmentCard,
        isSelected && styles.equipmentCardSelected
      ]}
      onPress={() => onPress(equipment)}
      activeOpacity={0.8}
    >
      <View style={[
        styles.equipmentIconContainer,
        isSelected && styles.equipmentIconContainerSelected
      ]}>
        <Ionicons 
          name={equipment.icon} 
          size={20} 
          color={isSelected ? "#FFFFFF" : "#FFD700"} 
        />
      </View>
      <Text style={[
        styles.equipmentName,
        isSelected && styles.equipmentNameSelected
      ]}>
        {equipment.name}
      </Text>
      {isSelected && (
        <View style={styles.equipmentIndicator}>
          <Ionicons name="checkmark" size={16} color="#000000" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const DifficultyCard = ({ 
  level, 
  isSelected, 
  onPress 
}: { 
  level: DifficultyLevel; 
  isSelected: boolean;
  onPress: (level: DifficultyLevel) => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.difficultyCard,
        isSelected && styles.difficultyCardSelected,
        isSelected && { borderColor: level.color }
      ]}
      onPress={() => onPress(level)}
      activeOpacity={0.8}
    >
      <View style={styles.difficultyContent}>
        <Text style={[
          styles.difficultyTitle,
          isSelected && { color: level.color }
        ]}>
          {level.title}
        </Text>
        <Text style={styles.difficultySubtitle}>{level.subtitle}</Text>
      </View>
      {isSelected && (
        <View style={[styles.difficultyIndicator, { backgroundColor: level.color }]}>
          <Ionicons name="checkmark" size={16} color="#ffffff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function CalisthenicsEquipmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentOption[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  
  const moodTitle = "I want to do calisthenics";
  const workoutType = 'Bodyweight exercises';

  const handleEquipmentSelect = (equipment: EquipmentOption) => {
    setSelectedEquipment(prev => {
      const isAlreadySelected = prev.some(item => item.id === equipment.id);
      if (isAlreadySelected) {
        // Remove from selection
        return prev.filter(item => item.id !== equipment.id);
      } else {
        // Add to selection
        return [...prev, equipment];
      }
    });
  };

  const handleDifficultySelect = (level: DifficultyLevel) => {
    setSelectedDifficulty(level);
  };

  const handleContinue = () => {
    if (selectedEquipment.length > 0 && selectedDifficulty) {
      console.log('Selected equipment:', selectedEquipment.map(eq => eq.name));
      console.log('Selected difficulty:', selectedDifficulty.title);
      
      // Route to calisthenics workouts screen with all selected equipment
      const equipmentNames = selectedEquipment.map(eq => eq.name).join(',');
      
      router.push({
        pathname: '/calisthenics-workouts',
        params: { 
          mood: moodTitle,
          workoutType: workoutType,
          equipment: encodeURIComponent(equipmentNames),
          difficulty: selectedDifficulty.id
        }
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const canContinue = selectedEquipment.length > 0 && selectedDifficulty;

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
          <Text style={styles.headerTitle}>Calisthenics Equipment</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
        </View>
        <HomeButton />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="body" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>Calisthenics</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={[
              styles.progressStepCircle,
              selectedEquipment.length > 0 && styles.progressStepActive
            ]}>
              <Text style={[
                styles.progressStepNumber,
                selectedEquipment.length > 0 && styles.progressStepNumberActive
              ]}>
                {selectedEquipment.length}
              </Text>
            </View>
            <Text style={styles.progressStepText}>Equipment</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={[
              styles.progressStepCircle,
              selectedDifficulty && styles.progressStepActive
            ]}>
              <Ionicons 
                name={selectedDifficulty ? "checkmark" : "star"} 
                size={14} 
                color={selectedDifficulty ? "#000000" : "rgba(255, 215, 0, 0.7)"} 
              />
            </View>
            <Text style={styles.progressStepText}>Difficulty</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Equipment Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Equipment</Text>
          <Text style={styles.sectionSubtitle}>Choose one or multiple equipment for bodyweight training</Text>
          
          <View style={styles.equipmentContainer}>
            {equipmentOptions.map((equipment) => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
                isSelected={selectedEquipment.some(item => item.id === equipment.id)}
                onPress={handleEquipmentSelect}
              />
            ))}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Difficulty</Text>
          <Text style={styles.sectionSubtitle}>Choose your calisthenics skill level</Text>
          
          <View style={styles.difficultyContainer}>
            {difficultyLevels.map((level) => (
              <DifficultyCard
                key={level.id}
                level={level}
                isSelected={selectedDifficulty?.id === level.id}
                onPress={handleDifficultySelect}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            canContinue && styles.continueButtonActive
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            canContinue && styles.continueButtonTextActive
          ]}>
            Continue
          </Text>
          {canContinue && (
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          )}
        </TouchableOpacity>
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
  progressContainer: {
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  progressStep: {
    alignItems: 'center',
    width: 70,
    flex: 0,
  },
  progressStepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  progressStepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 215, 0, 0.7)',
  },
  progressStepNumberActive: {
    color: '#000000',
  },
  progressStepText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 70,
    lineHeight: 12,
  },
  progressConnector: {
    width: 12,
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: 1,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    lineHeight: 22,
  },
  equipmentContainer: {
    gap: 12,
  },
  equipmentCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  equipmentCardSelected: {
    backgroundColor: '#111111',
    borderColor: '#FFD700',
    borderWidth: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  equipmentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginRight: 12,
  },
  equipmentIconContainerSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  equipmentNameSelected: {
    color: '#FFD700',
  },
  equipmentIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyContainer: {
    gap: 16,
    marginBottom: 16,
  },
  difficultyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  difficultyCardSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  difficultyContent: {
    flex: 1,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  difficultySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  difficultyIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  continueButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 215, 0, 0.7)',
    marginRight: 8,
  },
  continueButtonTextActive: {
    color: '#000000',
  },
});