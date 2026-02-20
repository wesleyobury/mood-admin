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

// Default athlete image for when no match is found - NOT a decline bench
const DEFAULT_ATHLETE_IMAGE = 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg';

// Combined equipment + exercise type mappings for maximum accuracy
// Format: "equipment_keyword|exercise_keyword" -> thumbnail URL
const COMBINED_THUMBNAILS: { [key: string]: string } = {
  // SMITH MACHINE exercises - must be first to match before generic "machine"
  'smith|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/ynnuugau_smith_squat.jpg',
  'smith|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241289/mood_app/workout_images/le4l1rje_smith_squat_2.jpg',
  'smith|lunge': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/ynnuugau_smith_squat.jpg',
  'smith|incline': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241289/mood_app/workout_images/le4l1rje_smith_squat_2.jpg',
  'smith|flat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241289/mood_app/workout_images/le4l1rje_smith_squat_2.jpg',
  'smith|bench': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241289/mood_app/workout_images/le4l1rje_smith_squat_2.jpg',
  'smith|calf': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/ynnuugau_smith_squat.jpg',
  'smith|shoulder': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241289/mood_app/workout_images/le4l1rje_smith_squat_2.jpg',
  'smith|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241289/mood_app/workout_images/le4l1rje_smith_squat_2.jpg',
  'smith|deadlift': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/ynnuugau_smith_squat.jpg',
  'smith|rdl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/ynnuugau_smith_squat.jpg',
  
  // DUMBBELL exercises
  'dumbbell|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'dumbbell|goblet': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'dumbbell|lunge': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241281/mood_app/workout_images/cnnnnm30_db_reverse_lunge.jpg',
  'dumbbell|split': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241353/mood_app/workout_images/mxfs858v_dbbss.jpg',
  'dumbbell|bulgarian': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241353/mood_app/workout_images/mxfs858v_dbbss.jpg',
  'dumbbell|deadlift': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241323/mood_app/workout_images/5v2oyit3_dbrdl.jpg',
  'dumbbell|rdl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241323/mood_app/workout_images/5v2oyit3_dbrdl.jpg',
  'dumbbell|romanian': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241323/mood_app/workout_images/5v2oyit3_dbrdl.jpg',
  'dumbbell|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240692/mood_app/workout_images/2ctzlc7l_SA_db_row.jpg',
  'dumbbell|bent': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240692/mood_app/workout_images/2ctzlc7l_SA_db_row.jpg',
  'dumbbell|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'dumbbell|bicep': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'dumbbell|lateral': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241344/mood_app/workout_images/hiyqkn20_db_lat_lunge.jpg',
  'dumbbell|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'dumbbell|shoulder': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'dumbbell|fly': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240692/mood_app/workout_images/2ctzlc7l_SA_db_row.jpg',
  'dumbbell|thruster': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'dumbbell|snatch': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  'dumbbell|swing': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
  
  // BARBELL exercises
  'barbell|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'barbell|deadlift': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'barbell|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'barbell|bench': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'barbell|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'barbell|clean': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'barbell|snatch': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'barbell|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'barbell|lunge': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  'barbell|thruster': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/tyk9o76q_barbell_row.jpg',
  
  // KETTLEBELL exercises
  'kettlebell|swing': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'kettlebell|snatch': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'kettlebell|clean': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'kettlebell|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'kettlebell|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'kettlebell|goblet': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'kettlebell|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'kettlebell|deadlift': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  'kettlebell|turkish': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241311/mood_app/workout_images/jujebppz_KB_Swing.jpg',
  
  // CABLE exercises
  'cable|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'cable|tricep': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240568/mood_app/workout_images/7nj0ytab_tricep_push_down.jpg',
  'cable|pushdown': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240568/mood_app/workout_images/7nj0ytab_tricep_push_down.jpg',
  'cable|fly': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'cable|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'cable|pull': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'cable|face': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'cable|lateral': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  
  // BODYWEIGHT exercises
  'bodyweight|pushup': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'bodyweight|push-up': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'bodyweight|pullup': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'bodyweight|pull-up': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'bodyweight|chin': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'bodyweight|squat': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'bodyweight|lunge': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'bodyweight|dip': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'bodyweight|plank': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'bodyweight|burpee': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'bodyweight|crunch': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'bodyweight|sit': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  
  // MEDICINE BALL exercises
  'medicine|slam': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  'medicine|throw': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  'medicine|twist': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  'medicine|rotation': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  'med ball|slam': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  'med ball|throw': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/k0hx2a1l_med_ball_slam.jpg',
  
  // RESISTANCE BAND exercises
  'band|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241378/mood_app/workout_images/k8lo936w_download.jpg',
  'band|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241378/mood_app/workout_images/k8lo936w_download.jpg',
  'band|pull': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241378/mood_app/workout_images/k8lo936w_download.jpg',
  'band|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241378/mood_app/workout_images/k8lo936w_download.jpg',
  'resistance|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241378/mood_app/workout_images/k8lo936w_download.jpg',
  'resistance|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241378/mood_app/workout_images/k8lo936w_download.jpg',
  
  // PULL-UP BAR exercises
  'bar|pullup': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'bar|pull-up': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'bar|chin': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  'bar|hang': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241283/mood_app/workout_images/ht4gv5dv_Pull-up.jpg',
  
  // BOX exercises
  'box|jump': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/z0smxd1m_box_jump.jpg',
  'box|step': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/z0smxd1m_box_jump.jpg',
  'plyo|jump': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241300/mood_app/workout_images/z0smxd1m_box_jump.jpg',
  
  // SLED exercises
  'sled|push': 'https://res.cloudinary.com/dfsygar5c/video/upload/so_1.0,w_720,c_fill,q_auto,f_jpg/exercise_library/sled_push.jpg',
  'sled|pull': 'https://res.cloudinary.com/dfsygar5c/video/upload/so_1.0,w_720,c_fill,q_auto,f_jpg/exercise_library/sled_pull.jpg',
  'sled|drag': 'https://res.cloudinary.com/dfsygar5c/video/upload/so_1.0,w_720,c_fill,q_auto,f_jpg/exercise_library/sled_drag.jpg',
  
  // BATTLE ROPE exercises
  'battle|wave': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/yvkcgdyx_battle_rope.jpg',
  'battle|slam': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/yvkcgdyx_battle_rope.jpg',
  'rope|wave': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/yvkcgdyx_battle_rope.jpg',
  'rope|slam': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241360/mood_app/workout_images/yvkcgdyx_battle_rope.jpg',
  
  // MACHINE exercises (avoid decline bench)
  'machine|press': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'machine|row': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770240916/mood_app/workout_images/xgk4blng_download_2_.jpg',
  'machine|curl': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241309/mood_app/workout_images/kgk21twi_cable_curl.jpg',
  'machine|leg': 'https://res.cloudinary.com/dfsygar5c/image/upload/v1770241263/mood_app/workout_images/0t57iowy_db_goblet_squat.jpg',
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
  
  // STEP 1: Try exact combined match (equipment|exercise)
  for (const eqWord of equipmentWords) {
    for (const exWord of exerciseWords) {
      const combinedKey = `${eqWord}|${exWord}`;
      if (COMBINED_THUMBNAILS[combinedKey]) {
        return COMBINED_THUMBNAILS[combinedKey];
      }
    }
  }
  
  // STEP 2: Try partial combined match
  for (const [key, url] of Object.entries(COMBINED_THUMBNAILS)) {
    const [keyEquip, keyExercise] = key.split('|');
    
    // Check if equipment contains the key equipment word AND exercise contains the key exercise word
    const equipmentMatch = equipmentWords.some(w => w.includes(keyEquip) || keyEquip.includes(w));
    const exerciseMatch = exerciseWords.some(w => w.includes(keyExercise) || keyExercise.includes(w));
    
    if (equipmentMatch && exerciseMatch) {
      return url;
    }
  }
  
  // STEP 3: Try equipment-only fallback
  for (const eqWord of equipmentWords) {
    if (EQUIPMENT_FALLBACKS[eqWord]) {
      return EQUIPMENT_FALLBACKS[eqWord];
    }
  }
  
  // STEP 4: Partial equipment match
  for (const [key, url] of Object.entries(EQUIPMENT_FALLBACKS)) {
    if (lowerEquipment.includes(key) || key.includes(lowerEquipment)) {
      return url;
    }
  }
  
  // STEP 5: Return default athlete image (NOT decline bench)
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
