import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

interface ActivityStats {
  total_workouts: number;
  total_posts: number;
  total_comments: number;
  total_likes: number;
  current_streak: number;
}

interface WorkoutStats {
  total_workouts_completed: number;
  completion_rate: number;
  workouts_by_mood: { [key: string]: number };
  workouts_by_difficulty: { [key: string]: number };
  average_workouts_per_week: number;
}

interface SocialStats {
  posts_created: number;
  likes_given: number;
  comments_made: number;
  follows: number;
  current_followers: number;
  current_following: number;
  engagement_score: number;
}

export default function UserStatsScreen() {
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [socialStats, setSocialStats] = useState<SocialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const router = useRouter();
  const { token } = useAuth();

  const fetchStats = async () => {
    if (!token) return;

    try {
      const [activity, workout, social] = await Promise.all([
        fetch(`${API_URL}/api/analytics/activity-summary?days=${selectedPeriod}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/workout-stats?days=${selectedPeriod}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/social-stats?days=${selectedPeriod}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json())
      ]);

      setActivityStats(activity);
      setWorkoutStats(workout);
      setSocialStats(social);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Stats</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {[7, 30, 90].map(days => (
            <TouchableOpacity
              key={days}
              style={[styles.periodButton, selectedPeriod === days && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod(days)}
            >
              <Text style={[styles.periodText, selectedPeriod === days && styles.periodTextActive]}>
                {days} days
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Workout Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Text style={styles.streakEmoji}>🔥</Text>
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>{activityStats?.current_streak || 0}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Workout Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Workout Stats</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{workoutStats?.total_workouts_completed || 0}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{workoutStats?.completion_rate.toFixed(0) || 0}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{workoutStats?.average_workouts_per_week.toFixed(1) || 0}</Text>
              <Text style={styles.statLabel}>Per Week</Text>
            </View>
          </View>

          {/* Favorite Mood */}
          {workoutStats?.workouts_by_mood && Object.keys(workoutStats.workouts_by_mood).length > 0 && (
            <View style={styles.favoriteCard}>
              <Text style={styles.favoriteLabel}>Favorite Mood</Text>
              <Text style={styles.favoriteValue}>
                {Object.entries(workoutStats.workouts_by_mood)
                  .sort((a, b) => b[1] - a[1])[0][0]}
              </Text>
              <Text style={styles.favoriteCount}>
                {Object.entries(workoutStats.workouts_by_mood)
                  .sort((a, b) => b[1] - a[1])[0][1]} workouts
              </Text>
            </View>
          )}

          {/* Difficulty Breakdown */}
          {workoutStats?.workouts_by_difficulty && Object.keys(workoutStats.workouts_by_difficulty).length > 0 && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>By Difficulty</Text>
              {Object.entries(workoutStats.workouts_by_difficulty).map(([difficulty, count]) => (
                <View key={difficulty} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{difficulty}</Text>
                  <Text style={styles.breakdownValue}>{count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Social Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Social Engagement</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{socialStats?.posts_created || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{socialStats?.likes_given || 0}</Text>
              <Text style={styles.statLabel}>Likes Given</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{socialStats?.comments_made || 0}</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>
          </View>

          <View style={styles.followerCard}>
            <View style={styles.followerStat}>
              <Text style={styles.followerNumber}>{socialStats?.current_followers || 0}</Text>
              <Text style={styles.followerLabel}>Followers</Text>
            </View>
            <View style={styles.followerDivider} />
            <View style={styles.followerStat}>
              <Text style={styles.followerNumber}>{socialStats?.current_following || 0}</Text>
              <Text style={styles.followerLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.engagementCard}>
            <Text style={styles.engagementLabel}>Engagement Score</Text>
            <Text style={styles.engagementValue}>{socialStats?.engagement_score || 0}</Text>
          </View>
        </View>

        {/* Activity Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Activity Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Ionicons name="fitness" size={20} color="#FFD700" />
              <Text style={styles.summaryLabel}>Total Workouts</Text>
              <Text style={styles.summaryValue}>{activityStats?.total_workouts || 0}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="create" size={20} color="#FFD700" />
              <Text style={styles.summaryLabel}>Posts Created</Text>
              <Text style={styles.summaryValue}>{activityStats?.total_posts || 0}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="chatbubble" size={20} color="#FFD700" />
              <Text style={styles.summaryLabel}>Comments</Text>
              <Text style={styles.summaryValue}>{activityStats?.total_comments || 0}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="heart" size={20} color="#FFD700" />
              <Text style={styles.summaryLabel}>Likes</Text>
              <Text style={styles.summaryValue}>{activityStats?.total_likes || 0}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c0c0c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  periodButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  periodButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  periodText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#000',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  streakIcon: {
    marginRight: 20,
  },
  streakEmoji: {
    fontSize: 48,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  streakLabel: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  favoriteCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  favoriteLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  favoriteValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  favoriteCount: {
    fontSize: 14,
    color: '#FFD700',
  },
  breakdownCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#888',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  followerCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  followerStat: {
    flex: 1,
    alignItems: 'center',
  },
  followerDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    marginHorizontal: 16,
  },
  followerNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  followerLabel: {
    fontSize: 14,
    color: '#888',
  },
  engagementCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  engagementLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  engagementValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  summaryCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.05)',
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    marginLeft: 12,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  bottomPadding: {
    height: 40,
  },
});
