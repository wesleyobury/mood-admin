import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';

const { width } = Dimensions.get('window');

interface BodyPart {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  subOptions?: SubOption[];
}

interface SubOption {
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
    description: 'Biceps, triceps & forearms',
    subOptions: [
      {
        name: "Bi's",
        icon: 'fitness',
        description: 'Front arm muscles'
      },
      {
        name: "Tri's",
        icon: 'magnet',
        description: 'Back arm muscles'
      }
    ]
  },
  {
    name: 'Back',
    icon: 'person-outline',
    description: 'Lats, rhomboids & traps'
  },
  {
    name: 'Chest',
    icon: 'shield',
    description: 'Pectorals & upper body'
  },
  {
    name: 'Legs',
    icon: 'walk',
    description: 'Quads, hamstrings & glutes'
  },
  {
    name: 'Shoulders',
    icon: 'diamond-outline',
    description: 'Deltoids & rotator cuffs'
  }
];

export default function BodyPartsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [selectedSubOption, setSelectedSubOption] = useState<string>('');
  const [expandedBodyPart, setExpandedBodyPart] = useState<string>('');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

  const { mood } = params;

  const handleBodyPartSelect = (bodyPartName: string) => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Special handling for Arms with sub-options
    if (bodyPartName === 'Arms') {
      if (expandedBodyPart === 'Arms') {
        // Collapse Arms if already expanded
        setExpandedBodyPart('');
        setSelectedBodyPart('');
        setSelectedSubOption('');
        Animated.timing(expandAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        // Expand Arms to show Biceps and Triceps
        setExpandedBodyPart('Arms');
        setSelectedBodyPart('');
        setSelectedSubOption('');
        Animated.timing(expandAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    } else {
      // Handle regular body parts
      if (selectedBodyPart === bodyPartName) {
        setSelectedBodyPart(''); // Deselect if already selected
      } else {
        setSelectedBodyPart(bodyPartName); // Select new body part
        setExpandedBodyPart(''); // Collapse Arms if another body part is selected
        setSelectedSubOption('');
        Animated.timing(expandAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const handleSubOptionSelect = (subOptionName: string) => {
    if (selectedSubOption === subOptionName) {
      setSelectedSubOption(''); // Deselect if already selected
    } else {
      setSelectedSubOption(subOptionName); // Select sub-option
      setSelectedBodyPart('Arms'); // Set Arms as the main selection
    }
  };

  const handleContinue = () => {
    if (selectedBodyPart) {
      console.log('Selected body part:', selectedBodyPart);
      console.log('Selected sub-option:', selectedSubOption);
      
      if (selectedBodyPart === 'Chest') {
        // Navigate to chest equipment screen
        router.push({
          pathname: '/chest-equipment',
          params: {
            mood: mood,
            bodyPart: selectedBodyPart,
          }
        });
      } else if (selectedBodyPart === 'Shoulders') {
        // Navigate to shoulders equipment screen
        router.push({
          pathname: '/shoulders-equipment',
          params: {
            mood: mood,
            bodyPart: selectedBodyPart,
          }
        });
      } else if (selectedBodyPart === 'Back') {
        // Navigate to back equipment screen
        router.push({
          pathname: '/back-equipment',
          params: {
            mood: mood,
            bodyPart: selectedBodyPart,
          }
        });
      } else if (selectedBodyPart === 'Arms' && selectedSubOption) {
        // Navigate to arms equipment screen with sub-option
        if (selectedSubOption === "Bi's") {
          router.push({
            pathname: '/biceps-equipment',
            params: {
              mood: mood,
              bodyPart: 'Biceps',
            }
          });
        } else if (selectedSubOption === "Tri's") {
          router.push({
            pathname: '/triceps-equipment',
            params: {
              mood: mood,
              bodyPart: 'Triceps',
            }
          });
        }
      } else if (selectedBodyPart === 'Legs') {
        // Navigate to legs muscle groups screen
        router.push({
          pathname: '/legs-muscle-groups',
          params: {
            mood: mood,
            bodyPart: selectedBodyPart,
          }
        });
      } else if (selectedBodyPart === 'Abs') {
        // Navigate to abs equipment screen
        router.push({
          pathname: '/abs-equipment',
          params: {
            mood: mood,
            bodyPart: selectedBodyPart,
          }
        });
      } else {
        // TODO: Navigate to other body part screens when implemented
        console.log(`Navigation for ${selectedBodyPart} will be implemented later`);
      }
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
        <HomeButton />
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
            const isExpanded = expandedBodyPart === bodyPart.name;
            
            return (
              <Animated.View
                key={bodyPart.name}
                style={[
                  styles.bodyPartCard,
                  isSelected && styles.selectedBodyPartCard,
                  isExpanded && styles.expandedBodyPartCard,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              >
                {/* Regular body part content */}
                {bodyPart.name !== 'Arms' || !isExpanded ? (
                  <TouchableOpacity
                    style={styles.bodyPartContent}
                    onPress={() => handleBodyPartSelect(bodyPart.name)}
                  >
                    <View style={[
                      styles.iconContainer,
                      isSelected && styles.selectedIconContainer
                    ]}>
                      <Ionicons 
                        name={bodyPart.icon} 
                        size={32} 
                        color={isSelected ? '#FFD700' : '#FFD700'} 
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
                    {isSelected && !isExpanded && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark-circle" size={20} color="#000" />
                      </View>
                    )}
                    {bodyPart.name === 'Arms' && (
                      <View style={styles.expandIndicator}>
                        <Ionicons 
                          name="chevron-down" 
                          size={16} 
                          color="#999" 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ) : (
                  /* Arms expanded content - centered sub-options */
                  <Animated.View
                    style={[
                      styles.expandedContent,
                      {
                        opacity: expandAnim,
                      }
                    ]}
                  >
                    {/* Centered Sub-options within the same card */}
                    <View style={styles.centeredSubOptions}>
                      {bodyPart.subOptions?.map((subOption) => {
                        const isSubSelected = selectedSubOption === subOption.name;
                        return (
                          <TouchableOpacity
                            key={subOption.name}
                            style={[
                              styles.centeredSubOptionButton,
                              isSubSelected && styles.selectedCenteredSubOption
                            ]}
                            onPress={() => handleSubOptionSelect(subOption.name)}
                          >
                            <View style={[
                              styles.centeredSubIcon,
                              isSubSelected && styles.selectedCenteredSubIcon
                            ]}>
                              <Ionicons 
                                name={subOption.icon} 
                                size={16} 
                                color={isSubSelected ? '#FFD700' : '#888'} 
                              />
                            </View>
                            <View style={styles.buttonContent}>
                              <Text style={[
                                styles.centeredSubName,
                                isSubSelected && styles.selectedCenteredSubName
                              ]}>
                                {subOption.name}
                              </Text>
                            </View>
                            {isSubSelected && (
                              <View style={styles.centeredCheckmark}>
                                <Ionicons name="checkmark-circle" size={16} color="#FFD700" />
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Small back arrow in corner */}
                    <TouchableOpacity 
                      style={styles.cornerBackButton}
                      onPress={() => handleBodyPartSelect('Arms')}
                    >
                      <Ionicons name="chevron-back" size={14} color="#888" />
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </Animated.View>
            );
          })}
        </View>

        {selectedBodyPart && (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              Selected: {selectedBodyPart}{selectedSubOption ? ` > ${selectedSubOption}` : ''}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      {(selectedBodyPart && (selectedBodyPart !== 'Arms' || selectedSubOption)) && (
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
    height: 160, // Fixed height for consistent layout
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  bodyPartContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBodyPartCard: {
    backgroundColor: '#1a1a1a',
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  expandedBodyPartCard: {
    backgroundColor: '#2a2a2a',
    borderColor: '#FFD700',
  },
  expandedContent: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centeredSubOptions: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  centeredSubOptionButton: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(136, 136, 136, 0.3)',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedCenteredSubOption: {
    backgroundColor: '#333333',
    borderColor: '#FFD700',
  },
  centeredSubIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(136, 136, 136, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedCenteredSubIcon: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  centeredSubName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  selectedCenteredSubName: {
    color: '#FFD700',
  },
  centeredSubDesc: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedCenteredSubDesc: {
    color: '#ccc',
  },
  centeredCheckmark: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  buttonContent: {
    flex: 1,
    marginLeft: 4,
    marginRight: 24, // Space for checkmark
  },
  cornerBackButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(136, 136, 136, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
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
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  bodyPartName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedBodyPartName: {
    color: '#FFD700',
  },
  bodyPartDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedBodyPartDescription: {
    color: '#ccc',
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