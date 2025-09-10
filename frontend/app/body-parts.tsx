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

interface BodyPart {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const bodyParts: BodyPart[] = [
  {
    name: 'Abs',
    icon: 'fitness',
    description: 'Core strength & stability'
  },
  {
    name: 'Arms',
    icon: 'barbell',
    description: 'Biceps, triceps & forearms'
  },
  {
    name: 'Back',
    icon: 'body',
    description: 'Lats, rhomboids & traps'
  },
  {
    name: 'Chest',
    icon: 'heart',
    description: 'Pectorals & upper body'
  },
  {
    name: 'Legs',
    icon: 'walk',
    description: 'Quads, hamstrings & glutes'
  },
  {
    name: 'Shoulders',
    icon: 'trophy',
    description: 'Deltoids & rotator cuffs'
  }
];

export default function BodyPartsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');

  const { mood } = params;

  const handleBodyPartSelect = (bodyPartName: string) => {
    if (selectedBodyPart === bodyPartName) {
      setSelectedBodyPart(''); // Deselect if already selected
    } else {
      setSelectedBodyPart(bodyPartName); // Select new body part
    }
  };

  const handleContinue = () => {
    if (selectedBodyPart) {
      // TODO: Navigate to next screen in muscle building path
      console.log('Selected body part:', selectedBodyPart);
      // Will implement navigation to next screen later
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
        <Text style={styles.headerTitle}>Select Body Parts</Text>
        <View style={styles.placeholder} />
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
              <Ionicons name="flame" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{mood}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={[
              styles.progressStepCircle,
              selectedBodyPart && styles.progressStepActive
            ]}>
              {selectedBodyPart ? (
                <Ionicons name="checkmark" size={14} color="#000000" />
              ) : (
                <Text style={styles.progressStepNumber}>2</Text>
              )}
            </View>
            <Text style={styles.progressStepText}>
              {selectedBodyPart ? selectedBodyPart : 'Muscle Group'}
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Body Parts Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Select one muscle group to focus on. Return to this screen to work another muscle group.
        </Text>
        
        <View style={styles.bodyPartsGrid}>
          {bodyParts.map((bodyPart) => {
            const isSelected = selectedBodyPart === bodyPart.name;
            return (
              <TouchableOpacity
                key={bodyPart.name}
                style={[
                  styles.bodyPartCard,
                  isSelected && styles.selectedBodyPartCard
                ]}
                onPress={() => handleBodyPartSelect(bodyPart.name)}
              >
                <View style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer
                ]}>
                  <Ionicons 
                    name={bodyPart.icon} 
                    size={32} 
                    color={isSelected ? '#000' : '#FFD700'} 
                  />
                </View>
                <Text style={[
                  styles.bodyPartName,
                  isSelected && styles.selectedBodyPartName
                ]}>
                  {bodyPart.name}
                </Text>
                <Text style={[
                  styles.bodyPartDescription,
                  isSelected && styles.selectedBodyPartDescription
                ]}>
                  {bodyPart.description}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={20} color="#000" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedBodyPart && (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              Selected: {selectedBodyPart}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      {selectedBodyPart && (
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  bodyPartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  bodyPartCard: {
    width: (width - 60) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 16,
    position: 'relative',
  },
  selectedBodyPartCard: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  selectedIconContainer: {
    backgroundColor: '#000',
  },
  bodyPartName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedBodyPartName: {
    color: '#000',
  },
  bodyPartDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedBodyPartDescription: {
    color: '#333',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
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