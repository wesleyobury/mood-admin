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

interface Equipment {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const muscleEquipment: Equipment[] = [
  {
    name: 'Barbells',
    icon: 'barbell',
    description: 'Heavy compound movements'
  },
  {
    name: 'Cable machine',
    icon: 'remove',
    description: 'Constant tension training'
  },
  {
    name: 'Dumbbells',
    icon: 'barbell',
    description: 'Unilateral strength work'
  },
  {
    name: 'Machine weights',
    icon: 'cog',
    description: 'Guided movement patterns'
  },
  {
    name: 'Plate weights',
    icon: 'disc',
    description: 'Loaded carries & holds'
  },
  {
    name: 'Smith machine',
    icon: 'grid',
    description: 'Stabilized barbell training'
  }
];

export default function MuscleEquipmentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const { mood, bodyParts } = params;
  const bodyPartsList = typeof bodyParts === 'string' ? bodyParts.split(',') : [];

  const handleEquipmentToggle = (equipmentName: string) => {
    setSelectedEquipment(prev => {
      if (prev.includes(equipmentName)) {
        return prev.filter(name => name !== equipmentName);
      } else {
        return [...prev, equipmentName];
      }
    });
  };

  const handleContinue = () => {
    if (selectedEquipment.length > 0) {
      // Navigate to difficulty selection
      router.push({
        pathname: '/muscle-difficulty',
        params: {
          mood: mood,
          bodyParts: bodyParts,
          equipment: selectedEquipment.join(','),
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
        <Text style={styles.headerTitle}>Select Equipment</Text>
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
            <View style={[styles.progressStep, styles.activeStep]}>
              <Text style={[styles.progressText, styles.activeProgressText]}>Equipment</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Equipment Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Choose the equipment you have access to for your muscle building workout
        </Text>
        
        <View style={styles.equipmentGrid}>
          {muscleEquipment.map((equipment) => {
            const isSelected = selectedEquipment.includes(equipment.name);
            return (
              <TouchableOpacity
                key={equipment.name}
                style={[
                  styles.equipmentCard,
                  isSelected && styles.selectedEquipmentCard
                ]}
                onPress={() => handleEquipmentToggle(equipment.name)}
              >
                <View style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer
                ]}>
                  <Ionicons 
                    name={equipment.icon} 
                    size={32} 
                    color={isSelected ? '#000' : '#FFD700'} 
                  />
                </View>
                <Text style={[
                  styles.equipmentName,
                  isSelected && styles.selectedEquipmentName
                ]}>
                  {equipment.name}
                </Text>
                <Text style={[
                  styles.equipmentDescription,
                  isSelected && styles.selectedEquipmentDescription
                ]}>
                  {equipment.description}
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

        {selectedEquipment.length > 0 && (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              Selected: {selectedEquipment.join(', ')} ({selectedEquipment.length} equipment type{selectedEquipment.length > 1 ? 's' : ''})
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      {selectedEquipment.length > 0 && (
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
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  equipmentCard: {
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
  selectedEquipmentCard: {
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
  equipmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedEquipmentName: {
    color: '#000',
  },
  equipmentDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedEquipmentDescription: {
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