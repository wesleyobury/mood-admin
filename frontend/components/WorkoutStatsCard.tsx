import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.4; // 7:10 aspect ratio for Instagram-like post

interface WorkoutStatsCardProps {
  workouts: Array<{
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
      
      {/* Top Section - Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="trophy" size={32} color="#FFD700" />
        </View>
        <Text style={styles.headerTitle}>Workout Complete!</Text>
        <Text style={styles.headerSubtitle}>Great job crushing it today 💪</Text>
      </View>

      {/* Middle Section - Stats Grid */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="fitness" size={24} color="#FFD700" />
            <Text style={styles.statValue}>{workouts.length}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          
          <View style={styles.statBox}>
            <Ionicons name="time" size={24} color="#FFD700" />
            <Text style={styles.statValue}>{totalDuration}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          
          <View style={styles.statBox}>
            <Ionicons name="flame" size={24} color="#FF6B6B" />
            <Text style={styles.statValue}>{Math.round(totalDuration * 8)}</Text>
            <Text style={styles.statLabel}>Cal (Est.)</Text>
          </View>
        </View>
      </View>

      {/* Workout List Section */}
      <View style={styles.workoutsSection}>
        <Text style={styles.workoutsTitle}>Exercises Completed</Text>
        <View style={styles.workoutsList}>
          {workouts.map((workout, index) => (
            <View key={index} style={styles.workoutItem}>
              <View style={styles.workoutNumberContainer}>
                <Text style={styles.workoutNumber}>{index + 1}</Text>
              </View>
              <View style={styles.workoutDetails}>
                <Text style={styles.workoutName} numberOfLines={1}>
                  {workout.workoutName}
                </Text>
                <View style={styles.workoutMeta}>
                  <Text style={styles.workoutMetaText}>{workout.equipment}</Text>
                  <Text style={styles.workoutDot}>•</Text>
                  <Text style={styles.workoutMetaText}>{workout.duration}</Text>
                  <Text style={styles.workoutDot}>•</Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>
                      {workout.difficulty === 'intermediate' ? 'INT' : workout.difficulty.substring(0, 3).toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.dateText}>{completedAt}</Text>
        </View>
        <Text style={styles.brandText}>MOOD • Fitness Tracker</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  workoutsSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  workoutsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  workoutsList: {
    flex: 1,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  workoutNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  workoutDetails: {
    flex: 1,
  },
  workoutName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  workoutMetaText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  workoutDot: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 6,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  brandText: {
    fontSize: 11,
    color: 'rgba(255, 215, 0, 0.6)',
    fontWeight: '600',
    letterSpacing: 1,
  },
});
