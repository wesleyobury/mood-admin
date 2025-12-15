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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';
import { BarChart } from 'react-native-chart-kit';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';
const screenWidth = Dimensions.get('window').width;

interface PlatformStats {
  total_users: number;
  active_users: number;
  daily_active_users: number;
  new_users: number;
  total_workouts_started: number;
  total_workouts_completed: number;
  total_workouts_skipped: number;
  total_workouts_abandoned: number;
  workout_completion_rate: number;
  total_exercises_completed: number;
  total_posts_created: number;
  total_likes: number;
  total_comments: number;
  total_follows: number;
  total_unfollows: number;
  total_profile_views: number;
  total_app_sessions: number;
  total_app_opens: number;
  total_screen_views: number;
  total_tab_switches: number;
  total_mood_selections: number;
  total_equipment_selections: number;
  total_difficulty_selections: number;
  featured_workout_clicks: number;
  featured_workout_starts: number;
  featured_workout_completions: number;
  featured_workout_conversion_rate: number;
  workouts_added_to_cart: number;
  workouts_removed_from_cart: number;
  cart_views: number;
  retention_rate: number;
  average_workouts_per_active_user: number;
  popular_mood_categories: Array<{ mood: string; count: number }>;
}

const ADMIN_EMAIL = 'wesleyogsbury@gmail.com';

interface SignupTrendData {
  period: string;
  labels: string[];
  values: number[];
  total: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(1); // 1 day default
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [signupTrend, setSignupTrend] = useState<SignupTrendData | null>(null);
  const [signupPeriod, setSignupPeriod] = useState<'day' | 'week' | 'month'>('day');
  const router = useRouter();
  const { token, user } = useAuth();

  const periods = [
    { value: 1, label: '24h' },
    { value: 7, label: '7d' },
    { value: 30, label: '30d' },
    { value: 90, label: '90d' },
  ];

  const signupPeriods = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
  ];

  // Check if user is authorized to access admin dashboard
  useEffect(() => {
    if (user) {
      const authorized = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      setIsAuthorized(authorized);
      if (!authorized) {
        Alert.alert(
          'Access Denied',
          'You do not have permission to access the admin dashboard.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    }
  }, [user]);

  const fetchSignupTrend = async () => {
    if (!token || !isAuthorized) return;
    
    try {
      const response = await fetch(
        `${API_URL}/api/analytics/admin/users/signup-trend?period=${signupPeriod}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSignupTrend(data);
      }
    } catch (error) {
      console.error('Error fetching signup trend:', error);
    }
  };

  const fetchStats = async () => {
    if (!token || !isAuthorized) return;

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
    if (isAuthorized) {
      fetchStats();
      fetchSignupTrend();
    }
  }, [selectedPeriod, isAuthorized]);

  useEffect(() => {
    if (isAuthorized) {
      fetchSignupTrend();
    }
  }, [signupPeriod, isAuthorized]);

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
            <TouchableOpacity 
              style={styles.metricCard}
              onPress={() => router.push(`/analytics-detail?type=users&days=${selectedPeriod}`)}
            >
              <View style={styles.metricIconContainer}>
                <Ionicons name="people" size={24} color="#FFD700" />
              </View>
              <Text style={styles.metricValue}>{stats?.total_users?.toLocaleString() || 0}</Text>
              <Text style={styles.metricLabel}>Total Users</Text>
              <Text style={styles.metricDescription}>All registered accounts</Text>
              <Ionicons name="chevron-forward" size={14} color="#666" style={styles.drilldownIcon} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.metricCard}
              onPress={() => router.push(`/analytics-detail?type=activeUsers&days=${selectedPeriod}`)}
            >
              <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="pulse" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.metricValue}>{stats?.active_users?.toLocaleString() || 0}</Text>
              <Text style={styles.metricLabel}>Active Users</Text>
              <Text style={styles.metricDescription}>Used app in last {selectedPeriod} {selectedPeriod === 1 ? 'day' : 'days'}</Text>
              <Ionicons name="chevron-forward" size={14} color="#666" style={styles.drilldownIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.metricsRow}>
            <TouchableOpacity 
              style={styles.metricCard}
              onPress={() => router.push(`/analytics-detail?type=dailyActiveUsers&days=${selectedPeriod}`)}
            >
              <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Ionicons name="today" size={24} color="#2196F3" />
              </View>
              <Text style={styles.metricValue}>{stats?.daily_active_users?.toLocaleString() || 0}</Text>
              <Text style={styles.metricLabel}>Daily Active</Text>
              <Text style={styles.metricDescription}>Active in last 24 hours</Text>
              <Ionicons name="chevron-forward" size={14} color="#666" style={styles.drilldownIcon} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.metricCard}
              onPress={() => router.push(`/analytics-detail?type=newUsers&days=${selectedPeriod}`)}
            >
              <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Ionicons name="person-add" size={24} color="#FF9800" />
              </View>
              <Text style={styles.metricValue}>{stats?.new_users?.toLocaleString() || 0}</Text>
              <Text style={styles.metricLabel}>New Users</Text>
              <Text style={styles.metricDescription}>Joined in last {selectedPeriod} {selectedPeriod === 1 ? 'day' : 'days'}</Text>
              <Ionicons name="chevron-forward" size={14} color="#666" style={styles.drilldownIcon} />
            </TouchableOpacity>
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
                {stats?.total_workouts_completed?.toLocaleString() || 0}
              </Text>
            </View>

            <View style={styles.engagementDivider} />

            <View style={styles.engagementItem}>
              <View style={styles.engagementHeader}>
                <Ionicons name="create" size={20} color="#FFD700" />
                <Text style={styles.engagementLabel}>Posts</Text>
              </View>
              <Text style={styles.engagementValue}>
                {stats?.total_posts_created?.toLocaleString() || 0}
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>{stats?.retention_rate?.toFixed(1) || 0}%</Text>
              <Text style={styles.statBoxLabel}>Retention Rate</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>
                {stats?.average_workouts_per_active_user?.toFixed(1) || 0}
              </Text>
              <Text style={styles.statBoxLabel}>Avg Workouts/User</Text>
            </View>
          </View>
        </View>

        {/* User Signup Trend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New User Signups</Text>
            <Text style={styles.trendTotal}>{signupTrend?.total || 0} total</Text>
          </View>
          
          {/* Period selector */}
          <View style={styles.signupPeriodSelector}>
            {signupPeriods.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.signupPeriodButton,
                  signupPeriod === p.value && styles.signupPeriodButtonActive
                ]}
                onPress={() => setSignupPeriod(p.value as 'day' | 'week' | 'month')}
              >
                <Text style={[
                  styles.signupPeriodText,
                  signupPeriod === p.value && styles.signupPeriodTextActive
                ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chart */}
          {signupTrend && signupTrend.values.length > 0 ? (
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: signupTrend.labels.slice(-10),
                  datasets: [{ data: signupTrend.values.slice(-10) }]
                }}
                width={screenWidth - 48}
                height={180}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#1a1a1a',
                  backgroundGradientFrom: '#1a1a1a',
                  backgroundGradientTo: '#1a1a1a',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 12 },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: '#333',
                  },
                  barPercentage: 0.6,
                }}
                style={{ borderRadius: 12, marginTop: 8 }}
                showValuesOnTopOfBars={true}
                fromZero={true}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="bar-chart-outline" size={32} color="#666" />
              <Text style={styles.noDataText}>No signup data available</Text>
            </View>
          )}
        </View>

        {/* Workout Funnel */}
        <TouchableOpacity 
          style={styles.section}
          onPress={() => router.push(`/analytics-detail?type=workoutFunnel&days=${selectedPeriod}`)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workout Funnel</Text>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </View>
          
          <View style={styles.funnelContainer}>
            <View style={styles.funnelItem}>
              <View style={styles.funnelBar}>
                <View style={[styles.funnelFill, { width: '100%', backgroundColor: '#4CAF50' }]} />
              </View>
              <View style={styles.funnelInfo}>
                <Text style={styles.funnelLabel}>Started</Text>
                <Text style={styles.funnelValue}>{stats?.total_workouts_started?.toLocaleString() || 0}</Text>
              </View>
            </View>

            <View style={styles.funnelItem}>
              <View style={styles.funnelBar}>>
                <View style={[styles.funnelFill, { 
                  width: `${stats?.workout_completion_rate || 0}%`, 
                  backgroundColor: '#FFD700' 
                }]} />
              </View>
              <View style={styles.funnelInfo}>
                <Text style={styles.funnelLabel}>Completed</Text>
                <Text style={styles.funnelValue}>
                  {stats?.total_workouts_completed?.toLocaleString() || 0}
                  <Text style={styles.funnelPercent}> ({stats?.workout_completion_rate || 0}%)</Text>
                </Text>
              </View>
            </View>

            <View style={styles.funnelItem}>
              <View style={styles.funnelBar}>
                <View style={[styles.funnelFill, { 
                  width: `${stats?.total_workouts_started ? ((stats?.total_workouts_skipped || 0) / stats.total_workouts_started * 100) : 0}%`, 
                  backgroundColor: '#FF9800' 
                }]} />
              </View>
              <View style={styles.funnelInfo}>
                <Text style={styles.funnelLabel}>Skipped</Text>
                <Text style={styles.funnelValue}>{stats?.total_workouts_skipped?.toLocaleString() || 0}</Text>
              </View>
            </View>

            <View style={styles.funnelItem}>
              <View style={styles.funnelBar}>
                <View style={[styles.funnelFill, { 
                  width: `${stats?.total_workouts_started ? ((stats?.total_workouts_abandoned || 0) / stats.total_workouts_started * 100) : 0}%`, 
                  backgroundColor: '#F44336' 
                }]} />
              </View>
              <View style={styles.funnelInfo}>
                <Text style={styles.funnelLabel}>Abandoned</Text>
                <Text style={styles.funnelValue}>{stats?.total_workouts_abandoned?.toLocaleString() || 0}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Featured Workouts Analytics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Workouts</Text>
          </View>
          
          <View style={styles.funnelContainer}>
            <View style={styles.funnelItem}>
              <View style={styles.funnelBar}>
                <View style={[styles.funnelFill, { width: '100%', backgroundColor: '#9C27B0' }]} />
              </View>
              <View style={styles.funnelInfo}>
                <Text style={styles.funnelLabel}>Clicks</Text>
                <Text style={styles.funnelValue}>{stats?.featured_workout_clicks?.toLocaleString() || 0}</Text>
              </View>
            </View>

            <View style={styles.funnelItem}>
              <View style={styles.funnelBar}>
                <View style={[styles.funnelFill, { 
                  width: stats?.featured_workout_clicks ? `${Math.round((stats?.featured_workout_starts || 0) / stats.featured_workout_clicks * 100)}%` : '0%',
                  backgroundColor: '#2196F3' 
                }]} />
              </View>
              <View style={styles.funnelInfo}>
                <Text style={styles.funnelLabel}>Started</Text>
                <Text style={styles.funnelValue}>
                  {stats?.featured_workout_starts?.toLocaleString() || 0}
                  {stats?.featured_workout_clicks ? (
                    <Text style={styles.funnelPercent}> ({Math.round((stats?.featured_workout_starts || 0) / stats.featured_workout_clicks * 100)}%)</Text>
                  ) : null}
                </Text>
              </View>
            </View>

            <View style={styles.funnelItem}>
              <View style={styles.funnelBar}>
                <View style={[styles.funnelFill, { 
                  width: `${stats?.featured_workout_conversion_rate || 0}%`,
                  backgroundColor: '#FFD700' 
                }]} />
              </View>
              <View style={styles.funnelInfo}>
                <Text style={styles.funnelLabel}>Completed</Text>
                <Text style={styles.funnelValue}>
                  {stats?.featured_workout_completions?.toLocaleString() || 0}
                  <Text style={styles.funnelPercent}> ({stats?.featured_workout_conversion_rate || 0}%)</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cart Analytics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cart Activity</Text>
          </View>
          
          <View style={styles.socialGrid}>
            <View style={styles.socialCard}>
              <Ionicons name="add-circle" size={20} color="#4CAF50" />
              <Text style={styles.socialValue}>{stats?.workouts_added_to_cart?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Added to Cart</Text>
            </View>

            <View style={styles.socialCard}>
              <Ionicons name="remove-circle" size={20} color="#F44336" />
              <Text style={styles.socialValue}>{stats?.workouts_removed_from_cart?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Removed</Text>
            </View>

            <View style={styles.socialCard}>
              <Ionicons name="cart" size={20} color="#FF9800" />
              <Text style={styles.socialValue}>{stats?.cart_views?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Cart Views</Text>
            </View>

            <View style={styles.socialCard}>
              <Ionicons name="trending-up" size={20} color="#2196F3" />
              <Text style={styles.socialValue}>
                {stats?.workouts_added_to_cart && stats?.cart_views 
                  ? Math.round(stats.workouts_added_to_cart / stats.cart_views * 100) 
                  : 0}%
              </Text>
              <Text style={styles.socialLabel}>Add Rate</Text>
            </View>
          </View>
        </View>

        {/* App Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>App Activity</Text>
            <TouchableOpacity onPress={() => router.push(`/analytics-detail?type=screens&days=${selectedPeriod}`)}>
              <Text style={styles.seeAllText}>See Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.socialGrid}>
            <View style={styles.socialCard}>
              <Ionicons name="log-in" size={20} color="#4CAF50" />
              <Text style={styles.socialValue}>{stats?.total_app_sessions?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>App Sessions</Text>
            </View>

            <View style={styles.socialCard}>
              <Ionicons name="eye" size={20} color="#9C27B0" />
              <Text style={styles.socialValue}>{stats?.total_profile_views?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Profile Views</Text>
            </View>

            <TouchableOpacity 
              style={styles.socialCard}
              onPress={() => router.push(`/analytics-detail?type=screens&days=${selectedPeriod}`)}
            >
              <Ionicons name="layers" size={20} color="#2196F3" />
              <Text style={styles.socialValue}>{stats?.total_screen_views?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Screen Views</Text>
              <Ionicons name="chevron-forward" size={12} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>

            <View style={styles.socialCard}>
              <Ionicons name="swap-horizontal" size={20} color="#FF9800" />
              <Text style={styles.socialValue}>{stats?.total_tab_switches?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Tab Switches</Text>
            </View>
          </View>
        </View>

        {/* User Journey Analytics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User Journey</Text>
          </View>
          
          <View style={styles.socialGrid}>
            <TouchableOpacity 
              style={styles.socialCard}
              onPress={() => router.push(`/analytics-detail?type=moods&days=${selectedPeriod}`)}
            >
              <Ionicons name="happy" size={20} color="#FFD700" />
              <Text style={styles.socialValue}>{stats?.total_mood_selections?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Mood Selections</Text>
              <Ionicons name="chevron-forward" size={12} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialCard}
              onPress={() => router.push(`/analytics-detail?type=equipment&days=${selectedPeriod}`)}
            >
              <Ionicons name="barbell" size={20} color="#4CAF50" />
              <Text style={styles.socialValue}>{stats?.total_equipment_selections?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Equipment Selected</Text>
              <Ionicons name="chevron-forward" size={12} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialCard}
              onPress={() => router.push(`/analytics-detail?type=difficulties&days=${selectedPeriod}`)}
            >
              <Ionicons name="speedometer" size={20} color="#E91E63" />
              <Text style={styles.socialValue}>{stats?.total_difficulty_selections?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Difficulty Selected</Text>
              <Ionicons name="chevron-forward" size={12} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialCard}
              onPress={() => router.push(`/analytics-detail?type=exercises&days=${selectedPeriod}`)}
            >
              <Ionicons name="checkmark-circle" size={20} color="#00BCD4" />
              <Text style={styles.socialValue}>{stats?.total_exercises_completed?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Exercises Done</Text>
              <Ionicons name="chevron-forward" size={12} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Engagement */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Social Activity</Text>
            <TouchableOpacity onPress={() => router.push(`/analytics-detail?type=social&days=${selectedPeriod}`)}>
              <Text style={styles.seeAllText}>Top Users</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.socialGrid}>
            <TouchableOpacity 
              style={styles.socialCard}
              onPress={() => router.push(`/analytics-detail?type=social&days=${selectedPeriod}`)}
            >
              <Ionicons name="heart" size={20} color="#E91E63" />
              <Text style={styles.socialValue}>{stats?.total_likes?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Likes</Text>
              <Ionicons name="chevron-forward" size={12} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialCard}
              onPress={() => router.push(`/analytics-detail?type=social&days=${selectedPeriod}`)}
            >
              <Ionicons name="chatbubble" size={20} color="#2196F3" />
              <Text style={styles.socialValue}>{stats?.total_comments?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Comments</Text>
              <Ionicons name="chevron-forward" size={12} color="#666" style={styles.cardArrow} />
            </TouchableOpacity>

            <View style={styles.socialCard}>
              <Ionicons name="person-add" size={20} color="#4CAF50" />
              <Text style={styles.socialValue}>{stats?.total_follows?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Follows</Text>
            </View>

            <View style={styles.socialCard}>
              <Ionicons name="person-remove" size={20} color="#FF5722" />
              <Text style={styles.socialValue}>{stats?.total_unfollows?.toLocaleString() || 0}</Text>
              <Text style={styles.socialLabel}>Unfollows</Text>
            </View>
          </View>
        </View>

        {/* Popular Moods */}
        {moodData && (
          <TouchableOpacity 
            style={styles.section}
            onPress={() => router.push(`/analytics-detail?type=moods&days=${selectedPeriod}`)}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Most Selected Workout Modes</Text>
              <Ionicons name="chevron-forward" size={18} color="#666" />
            </View>
            
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
                        <Text style={[styles.moodRankText, { color: index === 0 ? '#000' : '#fff' }]}>
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
          </TouchableOpacity>
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
    color: '#fff',
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
    color: '#fff',
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
    color: '#fff',
    textAlign: 'center',
  },
  metricDescription: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  drilldownIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  cardArrow: {
    position: 'absolute',
    top: 8,
    right: 8,
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
    color: '#fff',
    fontWeight: '500',
  },
  engagementValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
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
    color: '#fff',
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
  trendTotal: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  signupPeriodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  signupPeriodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  signupPeriodButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#FFD700',
  },
  signupPeriodText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  signupPeriodTextActive: {
    color: '#FFD700',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  noDataText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
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
    color: '#fff',
    marginBottom: 2,
  },
  moodPercentage: {
    fontSize: 11,
    color: '#fff',
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
    color: '#fff',
    lineHeight: 20,
  },
  insightBold: {
    color: '#fff',
    fontWeight: '600',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialCard: {
    width: (screenWidth - 64) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
  },
  socialValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  socialLabel: {
    fontSize: 11,
    color: '#fff',
  },
  funnelContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  funnelItem: {
    marginBottom: 16,
  },
  funnelBar: {
    height: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  funnelFill: {
    height: '100%',
    borderRadius: 6,
  },
  funnelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  funnelLabel: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  funnelValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  funnelPercent: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  bottomPadding: {
    height: 40,
  },
});
