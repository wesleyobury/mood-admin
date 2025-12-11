import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; // 75% of screen width for more padding
const CARD_HEIGHT = CARD_WIDTH * 1.25; // Match 4:5 aspect ratio of carousel

interface WorkoutStatsCardProps {
  workouts: Array<{
    workoutTitle: string;
    workoutName: string;
    equipment: string;
    duration: string;
    difficulty: string;
  }>;
  totalDuration: number;
  completedAt: string;
}

export default function WorkoutStatsCard({ 
  workouts, 
  totalDuration, 
  completedAt 
}: WorkoutStatsCardProps) {
  return (
    <View style={[styles.container, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      {/* Background Gradient Effect */}
      <View style={styles.gradientOverlay} />
      
      {/* Compact Header - Trophy next to text */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="trophy" size={18} color="#FFD700" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Workout Complete!</Text>
          <Text style={styles.headerSubtitle}>Amazing work today 💪</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="fitness" size={18} color="#FFD700" />
            <Text style={styles.statValue}>{workouts.length}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          
          <View style={styles.statBox}>
            <Ionicons name="time" size={18} color="#FFD700" />
            <Text style={styles.statValue}>{totalDuration}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          
          <View style={styles.statBox}>
            <Ionicons name="flame" size={18} color="#FF6B6B" />
            <Text style={styles.statValue}>{Math.round(totalDuration * 8)}</Text>
            <Text style={styles.statLabel}>Cal (Est.)</Text>
          </View>
        </View>
      </View>

      {/* Workout List Section - Compact */}
      <View style={styles.workoutsSection}>
        <Text style={styles.workoutsTitle}>Exercises</Text>
        <View style={styles.workoutsList}>
          {workouts.slice(0, 3).map((workout, index) => (
            <View key={index} style={styles.workoutItem}>
              <View style={styles.workoutNumberContainer}>
                <Text style={styles.workoutNumber}>{index + 1}</Text>
              </View>
              <View style={styles.workoutDetails}>
                <View style={styles.workoutMeta}>
                  <Text style={styles.workoutMetaText} numberOfLines={1}>
                    {workout.workoutTitle || workout.workoutName}
                  </Text>
                  <Text style={styles.workoutDot}>•</Text>
                  <Text style={styles.workoutMetaText}>{workout.equipment}</Text>
                  <Text style={styles.workoutDot}>•</Text>
                  <Text style={styles.workoutMetaText}>{workout.difficulty}</Text>
                </View>
              </View>
            </View>
          ))}
          {workouts.length > 3 && (
            <Text style={styles.moreText}>+{workouts.length - 3} more</Text>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={11} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.dateText}>{completedAt}</Text>
        </View>
        <Text style={styles.brandText}>MOOD</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 215, 0, 0.04)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  statsSection: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.06)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.15)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  workoutsSection: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  workoutsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  workoutsList: {
    flex: 1,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  workoutNumberContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  workoutNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  workoutDetails: {
    flex: 1,
  },
  workoutName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  workoutMetaText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  workoutDot: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 4,
  },
  moreText: {
    fontSize: 10,
    color: 'rgba(255, 215, 0, 0.6)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  brandText: {
    fontSize: 9,
    color: 'rgba(255, 215, 0, 0.5)',
    fontWeight: '600',
    letterSpacing: 1,
  },
});
