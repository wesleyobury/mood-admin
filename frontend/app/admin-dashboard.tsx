import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';
import { LineChart, BarChart } from 'react-native-chart-kit';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
const screenWidth = Dimensions.get('window').width;

interface PlatformStats {
  total_users: number;
  active_users: number;
  daily_active_users: number;
  new_users: number;
  total_workouts_completed: number;
  total_posts_created: number;
  retention_rate: number;
  average_workouts_per_active_user: number;
  popular_mood_categories: Array<{ mood: string; count: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const router = useRouter();
  const { token } = useAuth();

  const fetchStats = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/api/analytics/admin/platform-stats?days=${selectedPeriod}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch platform stats:', response.status);
      }
    } catch (error) {
      console.error('Error fetching platform stats:', error);
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

  const chartConfig = {
    backgroundColor: '#1a1a1a',
    backgroundGradientFrom: '#1a1a1a',
    backgroundGradientTo: '#1a1a1a',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#FFD700',
    },
  };

  const moodData = {
    labels: stats?.popular_mood_categories.slice(0, 5).map(m => 
      m.mood.split(' ').slice(-1)[0] // Get last word
    ) || [],
    datasets: [
      {
        data: stats?.popular_mood_categories.slice(0, 5).map(m => m.count) || [0],
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
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

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Key Metrics</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Ionicons name="people" size={32} color="#FFD700" />
              <Text style={styles.metricNumber}>{stats?.total_users.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Total Users</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="pulse" size={32} color="#4CAF50" />
              <Text style={styles.metricNumber}>{stats?.active_users.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Active Users</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="today" size={32} color="#2196F3" />
              <Text style={styles.metricNumber}>{stats?.daily_active_users.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Daily Active</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="person-add" size={32} color="#FF9800" />
              <Text style={styles.metricNumber}>{stats?.new_users.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>New Users</Text>
            </View>
          </View>
        </View>

        {/* Engagement Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Engagement</Text>
          
          <View style={styles.engagementCard}>
            <View style={styles.engagementRow}>
              <View style={styles.engagementItem}>
                <Text style={styles.engagementNumber}>
                  {stats?.total_workouts_completed.toLocaleString()}
                </Text>
                <Text style={styles.engagementLabel}>Total Workouts</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.engagementItem}>
                <Text style={styles.engagementNumber}>
                  {stats?.total_posts_created.toLocaleString()}
                </Text>
                <Text style={styles.engagementLabel}>Total Posts</Text>
              </View>
            </View>

            <View style={[styles.engagementRow, { marginTop: 20 }]}>
              <View style={styles.engagementItem}>
                <Text style={styles.engagementNumber}>
                  {stats?.retention_rate.toFixed(1)}%
                </Text>
                <Text style={styles.engagementLabel}>Retention Rate</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.engagementItem}>
                <Text style={styles.engagementNumber}>
                  {stats?.average_workouts_per_active_user.toFixed(1)}
                </Text>
                <Text style={styles.engagementLabel}>Avg Workouts/User</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Popular Moods Chart */}
        {stats?.popular_mood_categories && stats.popular_mood_categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Popular Workout Moods</Text>
            
            <View style={styles.chartCard}>
              <BarChart
                data={moodData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                style={styles.chart}
                showValuesOnTopOfBars
              />
            </View>

            {/* Detailed List */}
            <View style={styles.moodList}>
              {stats.popular_mood_categories.map((mood, index) => (
                <View key={index} style={styles.moodItem}>
                  <View style={styles.moodRank}>
                    <Text style={styles.moodRankText}>#{index + 1}</Text>
                  </View>
                  <Text style={styles.moodName}>{mood.mood}</Text>
                  <Text style={styles.moodCount}>{mood.count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Quick Insights</Text>
          
          <View style={styles.insightCard}>
            <Ionicons name="trending-up" size={24} color="#4CAF50" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>User Engagement</Text>
              <Text style={styles.insightText}>
                {stats?.active_users} out of {stats?.total_users} users are active 
                ({stats?.retention_rate.toFixed(1)}% retention)
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Ionicons name="fitness" size={24} color="#FFD700" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Workout Activity</Text>
              <Text style={styles.insightText}>
                Average of {stats?.average_workouts_per_active_user.toFixed(1)} workouts per active user
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Ionicons name="people-circle" size={24} color="#2196F3" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Growth</Text>
              <Text style={styles.insightText}>
                {stats?.new_users} new users joined in the last {selectedPeriod} days
              </Text>
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
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#000',
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (screenWidth - 48) / 2,
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 12,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  engagementCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    marginHorizontal: 16,
  },
  engagementNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  engagementLabel: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  chart: {
    borderRadius: 16,
  },
  moodList: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.05)',
  },
  moodRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moodRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  moodName: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  moodCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  bottomPadding: {
    height: 40,
  },
});
