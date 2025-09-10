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
        <View style={styles.progressBar}>
          <View style={styles.progressStep}>
            <Text style={styles.progressText}>{mood}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
          <View style={[styles.progressStep, styles.activeStep]}>
            <Text style={[styles.progressText, styles.activeProgressText]}>Select Muscle Group</Text>
          </View>
        </View>
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
      {selectedBodyParts.length > 0 && (
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