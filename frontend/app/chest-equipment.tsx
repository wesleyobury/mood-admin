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

// Chest equipment options sorted alphabetically
const equipmentOptions: EquipmentOption[] = [
  { id: 'adjustable-bench', name: 'Adjustable bench', icon: 'barbell' },
  { id: 'cable-crossover', name: 'Cable Crossover', icon: 'remove' },
  { id: 'chest-press-machine', name: 'Chest Press Machine', icon: 'cog' },
  { id: 'decline-bench', name: 'Decline bench', icon: 'trending-down' },
  { id: 'dip-station', name: 'Dip Station', icon: 'triangle' },
  { id: 'flat-bench', name: 'Flat bench', icon: 'remove' },
  { id: 'incline-bench', name: 'Incline bench', icon: 'trending-up' },
  { id: 'pec-deck', name: 'Pec Deck', icon: 'albums' },
  { id: 'smith-machine', name: 'Smith Machine', icon: 'grid' },
];

const difficultyLevels: DifficultyLevel[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    subtitle: 'New to chest training',
    color: '#FFD700',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    subtitle: 'Some chest experience',
    color: '#FFD700',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle: 'Experienced chest training',
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
          size={24} 
          color={isSelected ? "#000000" : "#FFD700"} 
        />
      </View>
      <Text style={[
        styles.equipmentName,
        isSelected && styles.equipmentNameSelected
      ]}>
        {equipment.name}
      </Text>
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
          <Ionicons name="checkmark" size={20} color="#000000" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function ChestEquipmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentOption[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  
  const moodTitle = params.mood as string || 'Muscle gainer';
  const bodyPart = params.bodyPart as string || 'Chest';

  const handleEquipmentSelect = (equipment: EquipmentOption) => {
    setSelectedEquipment(prev => {
      const isAlreadySelected = prev.some(item => item.id === equipment.id);
      if (isAlreadySelected) {
        return prev.filter(item => item.id !== equipment.id);
      } else {
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
      
      // TODO: Navigate to chest workout display screen
      // For now, just log the selections
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
          <Text style={styles.headerTitle}>Chest Equipment</Text>
          <Text style={styles.headerSubtitle}>{bodyPart}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressContent}
        >
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="barbell" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="shield" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{bodyPart}</Text>
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
            <Text style={styles.progressStepText}>
              Equipment {selectedEquipment.length > 0 && `(${selectedEquipment.length})`}
            </Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={[
              styles.progressStepCircle,
              selectedDifficulty && styles.progressStepActive
            ]}>
              {selectedDifficulty ? (
                <Ionicons name="checkmark" size={14} color="#000000" />
              ) : (
                <Text style={styles.progressStepNumber}>4</Text>
              )}
            </View>
            <Text style={styles.progressStepText}>
              {selectedDifficulty ? selectedDifficulty.title : 'Difficulty'}
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          
          {/* Equipment Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Select Your Equipment</Text>
            <Text style={styles.sectionSubtitle}>
              Choose the chest equipment you have access to
            </Text>
            
            <View style={styles.equipmentGrid}>
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
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Choose Your Level</Text>
            <Text style={styles.sectionSubtitle}>
              Select your chest training experience
            </Text>
            
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

        </View>
      </ScrollView>

      {/* Continue Button */}
      {canContinue && (
        <View style={styles.continueContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#000000" />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
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
  },
  progressContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  progressStep: {
    alignItems: 'center',
    minWidth: 80,
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
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  progressStepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressStepNumberActive: {
    color: '#000000',
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  equipmentCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  equipmentCardSelected: {
    backgroundColor: '#2a2a2a',
    borderColor: '#FFD700',
  },
  equipmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  equipmentIconContainerSelected: {
    backgroundColor: '#FFD700',
  },
  equipmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
  },
  equipmentNameSelected: {
    color: '#FFD700',
  },
  difficultyContainer: {
    gap: 16,
  },
  difficultyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  difficultyCardSelected: {
    backgroundColor: '#2a2a2a',
  },
  difficultyContent: {
    flex: 1,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  difficultySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  difficultyIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
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
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 8,
  },
});