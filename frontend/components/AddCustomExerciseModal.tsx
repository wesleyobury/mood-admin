import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useCart, WorkoutItem } from '../contexts/CartContext';

const { width, height } = Dimensions.get('window');

// Default athlete image for when no equipment match is found
const DEFAULT_ATHLETE_IMAGE = 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241316/mood_app/workout_images/r1uig0ll_download_4_.jpg';

// Equipment to thumbnail mapping
const EQUIPMENT_THUMBNAILS: { [key: string]: string } = {
  'dumbbells': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'dumbbell': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'barbell': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'kettlebell': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'kettlebells': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'cable': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'cable machine': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'resistance band': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241378/mood_app/workout_images/k8lo936w_download.jpg',
  'bands': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241378/mood_app/workout_images/k8lo936w_download.jpg',
  'bodyweight': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'none': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'pull-up bar': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'pullup bar': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'bench': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241316/mood_app/workout_images/r1uig0ll_download_4_.jpg',
  'medicine ball': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  'med ball': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  'sled': 'https://res.cloudinary.com/dfsygar5c/video/upload/so_1.0,w_720,c_fill,q_auto,f_jpg/exercise_library/sled_push.jpg',
  'battle rope': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/yvkcgdyx_battle_rope.jpg',
  'battle ropes': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/yvkcgdyx_battle_rope.jpg',
  'treadmill': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/iyo0yj2x_treadmill.jpg',
  'bike': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/rqfuzqkk_bike.jpg',
  'rowing machine': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/f8gj5uou_rower.jpg',
  'rower': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/f8gj5uou_rower.jpg',
  'box': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/z0smxd1m_box_jump.jpg',
  'plyo box': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/z0smxd1m_box_jump.jpg',
  'tire': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tire_flip.jpg',
  'sledgehammer': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/sledgehammer.jpg',
};

// Find matching thumbnail based on equipment
const getEquipmentThumbnail = (equipment: string): string => {
  const lowerEquipment = equipment.toLowerCase().trim();
  
  // Direct match
  if (EQUIPMENT_THUMBNAILS[lowerEquipment]) {
    return EQUIPMENT_THUMBNAILS[lowerEquipment];
  }
  
  // Partial match - check if equipment contains any known keywords
  for (const [key, url] of Object.entries(EQUIPMENT_THUMBNAILS)) {
    if (lowerEquipment.includes(key) || key.includes(lowerEquipment)) {
      return url;
    }
  }
  
  // No match - return default athlete image
  return DEFAULT_ATHLETE_IMAGE;
};

interface AddCustomExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd?: (workout: WorkoutItem) => void;
}

const AddCustomExerciseModal: React.FC<AddCustomExerciseModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const { addToCart } = useCart();
  
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [equipment, setEquipment] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [rest, setRest] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(DEFAULT_ATHLETE_IMAGE);

  // Update preview image when equipment changes
  useEffect(() => {
    if (equipment.trim()) {
      setPreviewImage(getEquipmentThumbnail(equipment));
    } else {
      setPreviewImage(DEFAULT_ATHLETE_IMAGE);
    }
  }, [equipment]);

  const resetForm = () => {
    setWorkoutTitle('');
    setEquipment('');
    setSets('');
    setReps('');
    setRest('');
    setPreviewImage(DEFAULT_ATHLETE_IMAGE);
  };

  const handleSave = () => {
    if (!workoutTitle.trim() || !equipment.trim() || !sets.trim() || !reps.trim()) {
      return;
    }

    const thumbnailUrl = getEquipmentThumbnail(equipment);

    // Generate battle plan from user input
    const battlePlan = rest.trim() 
      ? `${sets} sets × ${reps} reps\n• ${workoutTitle}\n• Equipment: ${equipment}\n• Rest: ${rest} between sets`
      : `${sets} sets × ${reps} reps\n• ${workoutTitle}\n• Equipment: ${equipment}`;

    // Create workout item for cart
    const customWorkout: WorkoutItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: workoutTitle.trim(),
      duration: `${parseInt(sets) * 2}-${parseInt(sets) * 3} min`,
      description: `Custom exercise using ${equipment}`,
      battlePlan: battlePlan,
      imageUrl: thumbnailUrl,
      intensityReason: `Custom exercise targeting specific muscle groups.`,
      equipment: equipment.trim(),
      difficulty: 'Custom',
      workoutType: 'Custom',
      moodCard: 'Custom Exercise',
      moodTips: [],
    };

    // Use callback if provided, otherwise add directly to cart
    if (onAdd) {
      onAdd(customWorkout);
    } else {
      addToCart(customWorkout);
    }
    
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
      onClose();
    }, 1200);
  };

  const isFormValid = workoutTitle.trim() && equipment.trim() && sets.trim() && reps.trim();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={styles.modalContent}>
          {showSuccess ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={32} color="#FFD700" />
              <Text style={styles.successText}>Exercise Added!</Text>
            </View>
          ) : (
            <>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="add-circle-outline" size={22} color="#FFD700" />
                  </View>
                  <Text style={styles.headerTitle}>Add Custom Exercise</Text>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Ionicons name="close" size={22} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Form */}
              <ScrollView 
                style={styles.formContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Preview Image */}
                <View style={styles.previewContainer}>
                  <Image
                    source={{ uri: previewImage }}
                    style={styles.previewImage}
                    contentFit="cover"
                  />
                  <View style={styles.previewOverlay}>
                    <Ionicons name="image-outline" size={16} color="#FFD700" />
                    <Text style={styles.previewText}>Preview</Text>
                  </View>
                </View>

                {/* Exercise Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Exercise Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Goblet Squats, Bicep Curls"
                    placeholderTextColor="#666"
                    value={workoutTitle}
                    onChangeText={setWorkoutTitle}
                    maxLength={40}
                  />
                </View>

                {/* Equipment */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Equipment</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Dumbbells, Barbell, Kettlebell"
                    placeholderTextColor="#666"
                    value={equipment}
                    onChangeText={setEquipment}
                    maxLength={50}
                  />
                  <Text style={styles.helperText}>
                    Image will match your equipment
                  </Text>
                </View>

                {/* Sets and Reps Row */}
                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, styles.halfInput]}>
                    <Text style={styles.inputLabel}>Sets</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="3"
                      placeholderTextColor="#666"
                      value={sets}
                      onChangeText={(text) => setSets(text.replace(/[^0-9]/g, ''))}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.halfInput]}>
                    <Text style={styles.inputLabel}>Reps</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="12"
                      placeholderTextColor="#666"
                      value={reps}
                      onChangeText={(text) => setReps(text.replace(/[^0-9]/g, ''))}
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                  </View>
                </View>

                {/* Rest (Optional) */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>Rest</Text>
                    <Text style={styles.optionalLabel}>Optional</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., 60 sec, 2 min"
                    placeholderTextColor="#666"
                    value={rest}
                    onChangeText={setRest}
                    maxLength={20}
                  />
                </View>
              </ScrollView>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButtonWrapper}
                onPress={handleSave}
                disabled={!isFormValid}
                activeOpacity={0.8}
              >
                {isFormValid ? (
                  <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    style={styles.saveButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="add-circle" size={20} color="#000" />
                    <Text style={styles.saveButtonText}>Add to Workout</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.saveButton, styles.saveButtonDisabled]}>
                    <Ionicons name="add-circle" size={20} color="#666" />
                    <Text style={[styles.saveButtonText, styles.saveButtonTextDisabled]}>
                      Add to Workout
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    maxHeight: height * 0.82,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: height * 0.52,
  },
  previewContainer: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewText: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionalLabel: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  helperText: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: '#0d0d0d',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  saveButtonWrapper: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#2a2a2a',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  saveButtonTextDisabled: {
    color: '#666',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default AddCustomExerciseModal;
