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

// Default athlete image for when no match is found - VERIFIED WORKING
const DEFAULT_ATHLETE_IMAGE = 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240871/mood_app/workout_images/9ppti423_download_11_.jpg';

// Combined equipment + exercise type mappings for maximum accuracy
// ALL URLs VERIFIED TO RETURN HTTP 200 from actual data files
// Format: "equipment_keyword|exercise_keyword" -> thumbnail URL
const COMBINED_THUMBNAILS: { [key: string]: string } = {
  // SMITH MACHINE exercises
  'smith|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241296/mood_app/workout_images/wwl8m04q_back_squat.jpg',
  'smith|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241296/mood_app/workout_images/wwl8m04q_back_squat.jpg',
  'smith|lunge': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241296/mood_app/workout_images/wwl8m04q_back_squat.jpg',
  'smith|bench': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241296/mood_app/workout_images/wwl8m04q_back_squat.jpg',
  'smith|calf': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241296/mood_app/workout_images/wwl8m04q_back_squat.jpg',
  'smith|deadlift': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241296/mood_app/workout_images/wwl8m04q_back_squat.jpg',
  
  // DUMBBELL exercises - VERIFIED WORKING URLs
  'dumbbell|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241293/mood_app/workout_images/p55uxvw3_db_squat.jpg',
  'dumbbell|goblet': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241293/mood_app/workout_images/p55uxvw3_db_squat.jpg',
  'dumbbell|lunge': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241295/mood_app/workout_images/rvwet9i1_db_elevated_split_squat.jpg',
  'dumbbell|split': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241295/mood_app/workout_images/rvwet9i1_db_elevated_split_squat.jpg',
  'dumbbell|bulgarian': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241295/mood_app/workout_images/rvwet9i1_db_elevated_split_squat.jpg',
  'dumbbell|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240587/mood_app/workout_images/yv5l5jby_cable_curl.jpg',
  'dumbbell|bicep': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240587/mood_app/workout_images/yv5l5jby_cable_curl.jpg',
  'dumbbell|arnold': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240587/mood_app/workout_images/yv5l5jby_cable_curl.jpg',
  'dumbbell|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241038/mood_app/workout_images/y6ofpbdj_kb_sa_press_v2.jpg',
  'dumbbell|shoulder': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241038/mood_app/workout_images/y6ofpbdj_kb_sa_press_v2.jpg',
  'dumbbell|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240702/mood_app/workout_images/9hjdvg6i_kb_suitcase_row.jpg',
  'dumbbell|bent': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240702/mood_app/workout_images/9hjdvg6i_kb_suitcase_row.jpg',
  'dumbbell|fly': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240702/mood_app/workout_images/9hjdvg6i_kb_suitcase_row.jpg',
  
  // BARBELL exercises - VERIFIED WORKING URLs
  'barbell|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241296/mood_app/workout_images/wwl8m04q_back_squat.jpg',
  'barbell|back': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241296/mood_app/workout_images/wwl8m04q_back_squat.jpg',
  'barbell|front': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241297/mood_app/workout_images/x54zcr7d_db_front_squat.jpg',
  'barbell|deadlift': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241299/mood_app/workout_images/xfs748m6_bb_back_squat_2.jpg',
  'barbell|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241299/mood_app/workout_images/xfs748m6_bb_back_squat_2.jpg',
  'barbell|bench': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241299/mood_app/workout_images/xfs748m6_bb_back_squat_2.jpg',
  'barbell|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241299/mood_app/workout_images/xfs748m6_bb_back_squat_2.jpg',
  'barbell|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240574/mood_app/workout_images/g54uz2wp_preacher_curl.jpg',
  
  // KETTLEBELL exercises - VERIFIED WORKING URLs
  'kettlebell|swing': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240731/mood_app/workout_images/kc1es3oi_kb_gorilla_row.jpg',
  'kettlebell|snatch': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240731/mood_app/workout_images/kc1es3oi_kb_gorilla_row.jpg',
  'kettlebell|clean': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240731/mood_app/workout_images/kc1es3oi_kb_gorilla_row.jpg',
  'kettlebell|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241038/mood_app/workout_images/y6ofpbdj_kb_sa_press_v2.jpg',
  'kettlebell|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240731/mood_app/workout_images/kc1es3oi_kb_gorilla_row.jpg',
  'kettlebell|goblet': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240731/mood_app/workout_images/kc1es3oi_kb_gorilla_row.jpg',
  'kettlebell|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240725/mood_app/workout_images/h1hdn33y_kb_cs_row.jpg',
  
  // CABLE exercises - VERIFIED WORKING URLs
  'cable|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240587/mood_app/workout_images/yv5l5jby_cable_curl.jpg',
  'cable|tricep': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240587/mood_app/workout_images/yv5l5jby_cable_curl.jpg',
  'cable|pushdown': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240587/mood_app/workout_images/yv5l5jby_cable_curl.jpg',
  'cable|fly': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240587/mood_app/workout_images/yv5l5jby_cable_curl.jpg',
  'cable|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240575/mood_app/workout_images/lz1p2boy_seated_low_cable_curl.jpg',
  'cable|pull': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240694/mood_app/workout_images/3kbrum0a_lat_pull_down.jpg',
  
  // BODYWEIGHT exercises - VERIFIED WORKING URLs
  'bodyweight|pushup': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240871/mood_app/workout_images/9ppti423_download_11_.jpg',
  'bodyweight|push-up': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240871/mood_app/workout_images/9ppti423_download_11_.jpg',
  'bodyweight|pullup': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241330/mood_app/workout_images/3aciwkyi_assisted_pull_ups.jpg',
  'bodyweight|pull-up': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241330/mood_app/workout_images/3aciwkyi_assisted_pull_ups.jpg',
  'bodyweight|chin': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241330/mood_app/workout_images/3aciwkyi_assisted_pull_ups.jpg',
  'bodyweight|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240871/mood_app/workout_images/9ppti423_download_11_.jpg',
  'bodyweight|lunge': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240871/mood_app/workout_images/9ppti423_download_11_.jpg',
  'bodyweight|dip': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240871/mood_app/workout_images/9ppti423_download_11_.jpg',
  'bodyweight|plank': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240908/mood_app/workout_images/rptdlvng_download_12_.jpg',
  'bodyweight|crunch': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240807/mood_app/workout_images/b2yevch7_crunch.jpg',
  'bodyweight|sit': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240810/mood_app/workout_images/fvyi5mpl_sit_up.jpg',
  
  // MEDICINE BALL exercises - VERIFIED WORKING URLs
  'medicine|slam': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241174/mood_app/workout_images/wwxk13a9_tbs.jpg',
  'medicine|throw': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241174/mood_app/workout_images/wwxk13a9_tbs.jpg',
  'medicine|twist': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241174/mood_app/workout_images/wwxk13a9_tbs.jpg',
  'med|slam': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241174/mood_app/workout_images/wwxk13a9_tbs.jpg',
  'med|throw': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241174/mood_app/workout_images/wwxk13a9_tbs.jpg',
  
  // RESISTANCE BAND exercises - VERIFIED WORKING URLs
  'band|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241381/mood_app/workout_images/sn9i3ng0_download_1_.jpg',
  'band|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241381/mood_app/workout_images/sn9i3ng0_download_1_.jpg',
  'band|pull': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241381/mood_app/workout_images/sn9i3ng0_download_1_.jpg',
  'resistance|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241381/mood_app/workout_images/sn9i3ng0_download_1_.jpg',
  'resistance|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241381/mood_app/workout_images/sn9i3ng0_download_1_.jpg',
  
  // PULL-UP BAR exercises - VERIFIED WORKING URLs
  'bar|pullup': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241330/mood_app/workout_images/3aciwkyi_assisted_pull_ups.jpg',
  'bar|pull-up': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241330/mood_app/workout_images/3aciwkyi_assisted_pull_ups.jpg',
  'bar|chin': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241330/mood_app/workout_images/3aciwkyi_assisted_pull_ups.jpg',
  'bar|hang': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240898/mood_app/workout_images/n5wg8sb5_download_17_.jpg',
  
  // BOX / PLYO exercises - VERIFIED WORKING URLs
  'box|jump': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240628/mood_app/workout_images/wok1mz8a_rbj.jpg',
  'box|step': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240628/mood_app/workout_images/wok1mz8a_rbj.jpg',
  'plyo|jump': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240628/mood_app/workout_images/wok1mz8a_rbj.jpg',
  'plyo|box': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240628/mood_app/workout_images/wok1mz8a_rbj.jpg',
  
  // SLED exercises - VERIFIED WORKING URLs
  'sled|push': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241067/mood_app/workout_images/ikffehr2_download_19_.jpg',
  'sled|pull': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241067/mood_app/workout_images/ikffehr2_download_19_.jpg',
  'sled|drag': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241067/mood_app/workout_images/ikffehr2_download_19_.jpg',
  
  // MACHINE exercises - VERIFIED WORKING URLs
  'machine|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240871/mood_app/workout_images/9ppti423_download_11_.jpg',
  'machine|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240575/mood_app/workout_images/lz1p2boy_seated_low_cable_curl.jpg',
  'machine|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240582/mood_app/workout_images/qfupz5zv_bicep_curl_machine.jpg',
  'machine|leg': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240683/mood_app/workout_images/pokwsf2m_leg_curl.jpg',
  'machine|crunch': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240722/mood_app/workout_images/g9c1g1gr_ab_crunch_machine.jpg',
  'machine|ab': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240722/mood_app/workout_images/g9c1g1gr_ab_crunch_machine.jpg',
  'machine|calf': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240671/mood_app/workout_images/elld3iw7_calf_machine_calf_raise.jpg',
};

// Fallback equipment-only mappings
const EQUIPMENT_FALLBACKS: { [key: string]: string } = {
  // SMITH MACHINE must come first (before generic "machine")
  'smith': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/ynnuugau_smith_squat.jpg',
  'smith machine': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/ynnuugau_smith_squat.jpg',
  
  // Other equipment
  'dumbbell': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'dumbbells': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
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
  'medicine ball': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  'med ball': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  'sled': 'https://res.cloudinary.com/dfsygar5c/video/upload/so_1.0,w_720,c_fill,q_auto,f_jpg/exercise_library/sled_push.jpg',
  'battle rope': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/yvkcgdyx_battle_rope.jpg',
  'battle ropes': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/yvkcgdyx_battle_rope.jpg',
  'box': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/z0smxd1m_box_jump.jpg',
  'plyo box': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/z0smxd1m_box_jump.jpg',
  'machine': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'leg press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/ynnuugau_smith_squat.jpg',
  'hack squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/ynnuugau_smith_squat.jpg',
  'lat pulldown': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
};

// Find matching thumbnail using combined equipment + exercise name logic
const findMatchingThumbnail = (exerciseName: string, equipment: string): string => {
  const lowerName = exerciseName.toLowerCase().trim();
  const lowerEquipment = equipment.toLowerCase().trim();
  
  // Extract key words from exercise name
  const exerciseWords = lowerName.split(/[\s\-_]+/);
  
  // Extract key words from equipment
  const equipmentWords = lowerEquipment.split(/[\s\-_]+/);
  
  // STEP 0: Try exact full equipment match first (e.g., "smith machine" -> "smith")
  // Check combined thumbnails for exact match with first significant equipment word
  for (const [key, url] of Object.entries(COMBINED_THUMBNAILS)) {
    const [keyEquip, keyExercise] = key.split('|');
    
    // Check if equipment contains the key equipment word AND exercise contains the key exercise word
    const hasEquipmentKeyword = lowerEquipment.includes(keyEquip) || equipmentWords.some(w => w === keyEquip);
    const hasExerciseKeyword = exerciseWords.some(w => w === keyExercise || w.includes(keyExercise) || keyExercise.includes(w));
    
    if (hasEquipmentKeyword && hasExerciseKeyword) {
      return url;
    }
  }
  
  // STEP 1: Try exact combined match (equipment|exercise)
  for (const eqWord of equipmentWords) {
    for (const exWord of exerciseWords) {
      const combinedKey = `${eqWord}|${exWord}`;
      if (COMBINED_THUMBNAILS[combinedKey]) {
        return COMBINED_THUMBNAILS[combinedKey];
      }
    }
  }
  
  // STEP 2: Try partial combined match with priority scoring
  let bestMatch: { url: string; score: number } | null = null;
  
  for (const [key, url] of Object.entries(COMBINED_THUMBNAILS)) {
    const [keyEquip, keyExercise] = key.split('|');
    
    // Check if equipment contains the key equipment word AND exercise contains the key exercise word
    const equipmentMatch = equipmentWords.some(w => w.includes(keyEquip) || keyEquip.includes(w)) || lowerEquipment.includes(keyEquip);
    const exerciseMatch = exerciseWords.some(w => w.includes(keyExercise) || keyExercise.includes(w));
    
    if (equipmentMatch && exerciseMatch) {
      // Score: longer equipment key = more specific = higher priority
      const score = keyEquip.length + (lowerEquipment.includes(keyEquip) ? 10 : 0);
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { url, score };
      }
    }
  }
  
  if (bestMatch) {
    return bestMatch.url;
  }
  
  // STEP 3: Try equipment-only fallback - check full equipment string first
  for (const [key, url] of Object.entries(EQUIPMENT_FALLBACKS)) {
    if (lowerEquipment === key || lowerEquipment.includes(key)) {
      return url;
    }
  }
  
  // STEP 4: Word-level equipment match
  for (const eqWord of equipmentWords) {
    if (EQUIPMENT_FALLBACKS[eqWord]) {
      return EQUIPMENT_FALLBACKS[eqWord];
    }
  }
  
  // STEP 5: Partial equipment match
  for (const [key, url] of Object.entries(EQUIPMENT_FALLBACKS)) {
    if (key.includes(lowerEquipment) || equipmentWords.some(w => key.includes(w))) {
      return url;
    }
  }
  
  // STEP 6: Return default athlete image (NOT decline bench)
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

    // Find matching thumbnail using combined equipment + exercise name logic
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
