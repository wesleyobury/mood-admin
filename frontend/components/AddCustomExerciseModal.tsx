import React, { useState } from 'react';
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
import { useCart, WorkoutItem } from '../contexts/CartContext';

const { width, height } = Dimensions.get('window');

// Default athlete image for when no match is found
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

// Exercise name keywords to thumbnail mapping
const EXERCISE_THUMBNAILS: { [key: string]: string } = {
  'squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'lunge': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241281/mood_app/workout_images/cnnnnm30_db_reverse_lunge.jpg',
  'deadlift': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241323/mood_app/workout_images/5v2oyit3_dbrdl.jpg',
  'rdl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241323/mood_app/workout_images/5v2oyit3_dbrdl.jpg',
  'press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241316/mood_app/workout_images/r1uig0ll_download_4_.jpg',
  'bench': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241316/mood_app/workout_images/r1uig0ll_download_4_.jpg',
  'row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240692/mood_app/workout_images/2ctzlc7l_SA_db_row.jpg',
  'curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'tricep': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240568/mood_app/workout_images/7nj0ytab_tricep_push_down.jpg',
  'pull-up': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'pullup': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'push-up': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'pushup': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'swing': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'snatch': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'clean': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'thruster': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'burpee': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'plank': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'crunch': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'sit-up': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'jump': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/z0smxd1m_box_jump.jpg',
  'fly': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241316/mood_app/workout_images/r1uig0ll_download_4_.jpg',
  'lateral': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241344/mood_app/workout_images/hiyqkn20_db_lat_lunge.jpg',
  'shoulder': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241316/mood_app/workout_images/r1uig0ll_download_4_.jpg',
  'leg': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'calf': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'split': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241353/mood_app/workout_images/mxfs858v_dbbss.jpg',
};

// Find matching thumbnail based on exercise name and equipment
const findMatchingThumbnail = (exerciseName: string, equipment: string): string => {
  const lowerName = exerciseName.toLowerCase().trim();
  const lowerEquipment = equipment.toLowerCase().trim();
  
  // First, try to match by exercise name keywords
  for (const [keyword, url] of Object.entries(EXERCISE_THUMBNAILS)) {
    if (lowerName.includes(keyword)) {
      return url;
    }
  }
  
  // Then, try to match by equipment
  if (EQUIPMENT_THUMBNAILS[lowerEquipment]) {
    return EQUIPMENT_THUMBNAILS[lowerEquipment];
  }
  
  // Partial equipment match
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

  const resetForm = () => {
    setWorkoutTitle('');
    setEquipment('');
    setSets('');
    setReps('');
    setRest('');
  };

  const handleSave = () => {
    if (!workoutTitle.trim() || !equipment.trim() || !sets.trim() || !reps.trim()) {
      return;
    }

    // Find matching thumbnail based on exercise name and equipment
    const thumbnailUrl = findMatchingThumbnail(workoutTitle, equipment);

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

              {/* Save Button - Gray background, gold icon, white text */}
              <TouchableOpacity
                style={styles.saveButtonWrapper}
                onPress={handleSave}
                disabled={!isFormValid}
                activeOpacity={0.8}
              >
                <View style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}>
                  <Ionicons name="add-circle" size={20} color={isFormValid ? "#FFD700" : "#666"} />
                  <Text style={[styles.saveButtonText, !isFormValid && styles.saveButtonTextDisabled]}>
                    Add to Workout
                  </Text>
                </View>
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
    maxHeight: height * 0.70,
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
    maxHeight: height * 0.45,
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
    backgroundColor: '#333',
  },
  saveButtonDisabled: {
    backgroundColor: '#222',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
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
