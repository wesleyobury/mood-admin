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
import { BarChart } from 'react-native-chart-kit';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
const screenWidth = Dimensions.get('window').width;

interface PlatformStats {
  total_users: number;
  active_users: number;
  daily_active_users: number;
  new_users: number;
  total_workouts_completed: number;
  total_posts_created: number;
  total_likes: number;
  total_comments: number;
  total_follows: number;
  total_unfollows: number;
  retention_rate: number;
  average_workouts_per_active_user: number;
  popular_mood_categories: Array<{ mood: string; count: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(1); // 1 day default
  const router = useRouter();
  const { token } = useAuth();

  const periods = [
    { value: 1, label: '24h' },
    { value: 7, label: '7d' },
    { value: 30, label: '30d' },
    { value: 90, label: '90d' },
  ];

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
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(255, 215, 0, 0.1)',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  const moodData = stats?.popular_mood_categories && stats.popular_mood_categories.length > 0 ? {
    labels: stats.popular_mood_categories.slice(0, 5).map(m => {
      const words = m.mood.split(' ');
      return words[words.length - 1];
    }),
    datasets: [
      {
        data: stats.popular_mood_categories.slice(0, 5).map(m => m.count),
      },
    ],
  } : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Platform Overview</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        {periods.map(period => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.periodChip,
              selectedPeriod === period.value && styles.periodChipActive
            ]}
            onPress={() => setSelectedPeriod(period.value)}
          >
            <Text style={[
              styles.periodChipText,
              selectedPeriod === period.value && styles.periodChipTextActive
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
      >
        {/* Key Metrics Grid */}
        <View style={styles.metricsSection}>
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={styles.metricIconContainer}>
                <Ionicons name="people" size={24} color="#FFD700" />
              </View>
              <Text style={styles.metricValue}>{stats?.total_users.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Total Users</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="pulse" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.metricValue}>{stats?.active_users.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Active</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Ionicons name="today" size={24} color="#2196F3" />
              </View>
              <Text style={styles.metricValue}>{stats?.daily_active_users.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Daily Active</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Ionicons name="person-add" size={24} color="#FF9800" />
              </View>
              <Text style={styles.metricValue}>{stats?.new_users.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>New Users</Text>
            </View>
          </View>
        </View>

        {/* Engagement Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement Metrics</Text>
          
          <View style={styles.engagementCard}>
            <View style={styles.engagementItem}>
              <View style={styles.engagementHeader}>
                <Ionicons name="fitness" size={20} color="#FFD700" />
                <Text style={styles.engagementLabel}>Workouts</Text>
              </View>
              <Text style={styles.engagementValue}>
                {stats?.total_workouts_completed.toLocaleString()}
              </Text>
            </View>

            <View style={styles.engagementDivider} />

            <View style={styles.engagementItem}>
              <View style={styles.engagementHeader}>
                <Ionicons name="create" size={20} color="#FFD700" />
                <Text style={styles.engagementLabel}>Posts</Text>
              </View>
              <Text style={styles.engagementValue}>
                {stats?.total_posts_created.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>{stats?.retention_rate.toFixed(1)}%</Text>
              <Text style={styles.statBoxLabel}>Retention Rate</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>
                {stats?.average_workouts_per_active_user.toFixed(1)}
              </Text>
              <Text style={styles.statBoxLabel}>Avg Workouts/User</Text>
            </View>
          </View>
        </View>

        {/* Popular Moods */}
        {moodData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Workout Moods</Text>
            
            <View style={styles.chartContainer}>
              <BarChart
                data={moodData}
                width={screenWidth - 64}
                height={200}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                style={styles.chart}
                showValuesOnTopOfBars
                fromZero
                withInnerLines={false}
              />
            </View>

            <View style={styles.moodList}>
              {stats.popular_mood_categories.slice(0, 5).map((mood, index) => {
                const total = stats.popular_mood_categories.reduce((sum, m) => sum + m.count, 0);
                const percentage = ((mood.count / total) * 100).toFixed(1);
                
                return (
                  <View key={index} style={styles.moodItem}>
                    <View style={styles.moodLeft}>
                      <View style={[styles.moodRank, { backgroundColor: index === 0 ? '#FFD700' : '#2a2a2a' }]}>
                        <Text style={[styles.moodRankText, { color: index === 0 ? '#000' : '#FFD700' }]}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={styles.moodName} numberOfLines={1}>{mood.mood}</Text>
                    </View>
                    <View style={styles.moodRight}>
                      <Text style={styles.moodCount}>{mood.count}</Text>
                      <Text style={styles.moodPercentage}>{percentage}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
          
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>
                <Text style={styles.insightBold}>{stats?.active_users}</Text> out of{' '}
                <Text style={styles.insightBold}>{stats?.total_users}</Text> users are active
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="fitness" size={20} color="#FFD700" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>
                Average of <Text style={styles.insightBold}>
                  {stats?.average_workouts_per_active_user.toFixed(1)}
                </Text> workouts per active user
              </Text>
            </View>
          </View>

          {stats?.new_users && stats.new_users > 0 && (
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <Ionicons name="person-add" size={20} color="#FF9800" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightText}>
                  <Text style={styles.insightBold}>{stats.new_users}</Text> new users joined in the last{' '}
                  {selectedPeriod === 1 ? '24 hours' : `${selectedPeriod} days`}
                </Text>
              </View>
            </View>
          )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
    backgroundColor: '#0c0c0c',
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  placeholder: {
    width: 32,
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#0c0c0c',
  },
  periodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    minWidth: 60,
    alignItems: 'center',
  },
  periodChipActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  periodChipText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  periodChipTextActive: {
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  metricsSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  engagementCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
    marginBottom: 12,
  },
  engagementItem: {
    flex: 1,
  },
  engagementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  engagementLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  engagementValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFD700',
  },
  engagementDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    marginHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  moodList: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.05)',
  },
  moodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  moodRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moodRankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  moodName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  moodRight: {
    alignItems: 'flex-end',
  },
  moodCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 2,
  },
  moodPercentage: {
    fontSize: 11,
    color: '#888',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  insightBold: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
