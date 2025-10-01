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

interface Equipment {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface MuscleGroupEquipment {
  muscleGroup: string;
  equipment: Equipment[];
}

interface IntensityLevel {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const equipmentDatabase: MuscleGroupEquipment[] = [
  {
    muscleGroup: 'Compound',
    equipment: [
      { id: 'dumbbells-compound', name: 'Dumbbells', icon: 'fitness' },
      { id: 'hack-squat-compound', name: 'Hack Squat Machine', icon: 'triangle' },
      { id: 'leg-press-compound', name: 'Leg Press Machine', icon: 'hardware-chip' },
      { id: 'cable-machine-compound', name: 'Single Stack Cable Machine', icon: 'link' },
      { id: 'squat-rack-compound', name: 'Squat Rack', icon: 'barbell' },
      { id: 'trap-bar', name: 'Trap Bar', icon: 'remove' },
    ]
  },
  {
    muscleGroup: 'Glutes',
    equipment: [
      { id: 'glute-kick-machine', name: 'Glute Kick Machine', icon: 'ellipse' },
      { id: 'hip-abductor', name: 'Hip Abductor Machine', icon: 'resize' },
      { id: 'hip-thruster', name: 'Hip Thruster Equipment', icon: 'fitness' },
      { id: 'cable-machine', name: 'Single Stack Cable Machine', icon: 'link' },
    ]
  },
  {
    muscleGroup: 'Hammies',
    equipment: [
      { id: 'barbell-ham', name: 'Barbell', icon: 'barbell' },
      { id: 'dumbbells', name: 'Dumbbells', icon: 'fitness' },
      { id: 'leg-curl', name: 'Leg Curl Machine', icon: 'return-down-forward' },
      { id: 'roman-chair', name: 'Roman Chair', icon: 'desktop' },
    ]
  },
  {
    muscleGroup: 'Quads',
    equipment: [
      { id: 'barbell-quad', name: 'Barbell', icon: 'barbell' },
      { id: 'leg-extension', name: 'Leg Extension Machine', icon: 'trending-up' },
    ]
  },
  {
    muscleGroup: 'Calfs',
    equipment: [
      { id: 'barbell-calf', name: 'Barbell', icon: 'barbell' },
      { id: 'calf-raise', name: 'Calf Raise Machine', icon: 'arrow-up' },
      { id: 'dumbbells-calf', name: 'Dumbbells', icon: 'fitness' },
      { id: 'leg-press-calf', name: 'Leg Press Machine', icon: 'hardware-chip' },
    ]
  },
];

const intensityLevels: IntensityLevel[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    subtitle: 'New to leg workouts',
    icon: 'leaf'
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    subtitle: 'Some workout experience',
    icon: 'fitness'
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle: 'Experienced lifter',
    icon: 'flame'
  }
];

const EquipmentCard = ({ 
  equipment, 
  isSelected, 
  onPress 
}: { 
  equipment: Equipment; 
  isSelected: boolean;
  onPress: (equipment: Equipment) => void;
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
          color={isSelected ? "#000000" : "#FFD700"} 
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

const IntensityCard = ({ 
  intensity, 
  isSelected, 
  onPress 
}: { 
  intensity: IntensityLevel; 
  isSelected: boolean;
  onPress: (intensity: IntensityLevel) => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.intensityCard,
        isSelected && styles.intensityCardSelected
      ]}
      onPress={() => onPress(intensity)}
      activeOpacity={0.8}
    >
      <View style={[
        styles.intensityIconContainer,
        isSelected && styles.intensityIconContainerSelected
      ]}>
        <Ionicons 
          name={intensity.icon} 
          size={20} 
          color={isSelected ? "#000000" : "#FFD700"} 
        />
      </View>
      <View style={styles.intensityTextContainer}>
        <Text style={[
          styles.intensityTitle,
          isSelected && styles.intensityTitleSelected
        ]}>
          {intensity.title}
        </Text>
        <Text style={[
          styles.intensitySubtitle,
          isSelected && styles.intensitySubtitleSelected
        ]}>
          {intensity.subtitle}
        </Text>
      </View>
      {isSelected && (
        <View style={styles.intensityIndicator}>
          <Ionicons name="checkmark" size={16} color="#000000" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const MuscleGroupSection = ({ 
  muscleGroupData, 
  selectedEquipment, 
  onEquipmentSelect 
}: { 
  muscleGroupData: MuscleGroupEquipment;
  selectedEquipment: Equipment[];
  onEquipmentSelect: (equipment: Equipment) => void;
}) => {
  return (
    <View style={styles.muscleGroupSection}>
      <Text style={styles.muscleGroupTitle}>{muscleGroupData.muscleGroup}</Text>
      <View style={styles.equipmentGrid}>
        {muscleGroupData.equipment.map((equipment) => (
          <EquipmentCard
            key={equipment.id}
            equipment={equipment}
            isSelected={selectedEquipment.some(item => item.id === equipment.id)}
            onPress={onEquipmentSelect}
          />
        ))}
      </View>
    </View>
  );
};

export default function LegsEquipmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel | null>(null);
  
  const moodTitle = params.mood as string || 'Muscle gainer';
  const workoutType = params.workoutType as string || 'Legs';
  const muscleGroupsParam = params.muscleGroups as string || '';
  
  // Parse the muscle groups from the previous screen
  const muscleGroupNames = muscleGroupsParam ? decodeURIComponent(muscleGroupsParam).split(',') : [];
  
  // Filter equipment data based on selected muscle groups
  const relevantEquipmentData = equipmentDatabase.filter(mgEquipment => 
    muscleGroupNames.includes(mgEquipment.muscleGroup)
  );

  const handleEquipmentSelect = (equipment: Equipment) => {
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

  const handleContinue = () => {
    if (selectedEquipment.length > 0) {
      const equipmentNames = selectedEquipment.map(eq => eq.name);
      const equipmentNamesString = equipmentNames.join(',');
      
      console.log('Selected equipment:', equipmentNames);
      console.log('Selected muscle groups:', muscleGroupNames);
      
      // Navigate to legs workout display with both muscle groups and equipment
      router.push({
        pathname: '/legs-workout-display',
        params: { 
          mood: moodTitle,
          workoutType: workoutType,
          muscleGroups: encodeURIComponent(muscleGroupNames.join(',')),
          equipment: encodeURIComponent(equipmentNamesString)
        }
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const canContinue = selectedEquipment.length > 0;

  if (relevantEquipmentData.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>No Equipment Found</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.noEquipmentContainer}>
          <Text style={styles.noEquipmentText}>
            No equipment available for the selected muscle groups.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Select Equipment</Text>
          <Text style={styles.headerSubtitle}>{moodTitle}</Text>
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
              <Ionicons name="flame" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{moodTitle}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Ionicons name="walk" size={14} color="#000000" />
            </View>
            <Text style={styles.progressStepText}>{workoutType}</Text>
          </View>
          
          <View style={styles.progressConnector} />
          
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Text style={styles.progressStepNumber}>
                {muscleGroupNames.length}
              </Text>
            </View>
            <Text style={styles.progressStepText}>
              Muscle Groups ({muscleGroupNames.length})
            </Text>
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
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Equipment Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Equipment</Text>
          <Text style={styles.sectionSubtitle}>
            Select equipment for {muscleGroupNames.join(', ')} workout
          </Text>
          
          {relevantEquipmentData.map((muscleGroupData) => (
            <MuscleGroupSection
              key={muscleGroupData.muscleGroup}
              muscleGroupData={muscleGroupData}
              selectedEquipment={selectedEquipment}
              onEquipmentSelect={handleEquipmentSelect}
            />
          ))}
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
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 22,
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
    marginBottom: 24,
    lineHeight: 22,
  },
  muscleGroupSection: {
    marginBottom: 32,
  },
  muscleGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
    textAlign: 'left',
  },
  equipmentGrid: {
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
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  equipmentNameSelected: {
    color: '#000000',
  },
  equipmentIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  continueButton: {
    backgroundColor: '#333333',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    gap: 8,
  },
  continueButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  continueButtonTextActive: {
    color: '#000000',
  },
  noEquipmentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noEquipmentText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
});