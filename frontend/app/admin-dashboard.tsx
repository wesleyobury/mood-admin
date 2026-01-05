import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Modal,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { BarChart, LineChart } from 'react-native-chart-kit';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';
const screenWidth = Dimensions.get('window').width;

const ADMIN_USERNAME = 'officialmoodapp';

// Time period options
const TIME_PERIODS = [
  { value: 1, label: 'Today', shortLabel: '1D' },
  { value: 7, label: 'This Week', shortLabel: '7D' },
  { value: 30, label: 'This Month', shortLabel: '30D' },
  { value: 90, label: '90 Days', shortLabel: '90D' },
];

// Mood colors - EXACT match from home screen mood cards gradients (first color)
const MOOD_COLORS: Record<string, string> = {
  'sweat': '#FF6B6B',      // I want to sweat - flame gradient
  'muscle': '#4ECDC4',     // Muscle gainer - teal gradient  
  'explosive': '#FFD93D',  // Build explosion - yellow gradient
  'lazy': '#D299C2',       // Feeling lazy - purple/pink gradient
  'calisthenics': '#667eea', // Calisthenics - purple/indigo gradient
  'outdoor': '#56ab2f',    // Get outside - green gradient
};

// Mood icons - EXACT match from home screen mood cards
const MOOD_ICONS: Record<string, string> = {
  'sweat': 'flame',        // I want to sweat
  'muscle': 'barbell',     // Muscle gainer
  'explosive': 'flash',    // Build explosion
  'lazy': 'bed',           // Feeling lazy
  'calisthenics': 'body',  // Calisthenics
  'outdoor': 'bicycle',    // Get outside
};

// Display names for moods
const MOOD_DISPLAY_NAMES: Record<string, string> = {
  'sweat': 'I want to sweat',
  'muscle': 'Muscle gainer',
  'explosive': 'Build explosion',
  'lazy': "I'm feeling lazy",
  'calisthenics': 'Calisthenics',
  'outdoor': 'Get outside',
};

interface ComprehensiveStats {
  period_days: number;
  total_users: number;
  new_users: number;
  realtime_active_users: number;
  users_with_activity: number;
  total_sessions: number;
  total_screen_views: number;
  top_pages: Array<{ page: string; views: number; unique_users: number }>;
  total_mood_selections: number;
  top_mood_cards: Array<{ mood: string; mood_id: string; selections: number; unique_users: number }>;
  workouts_started: number;
  workouts_completed: number;
  workout_completion_rate: number;
  posts_created: number;
  total_likes: number;
  total_comments: number;
  total_follows: number;
}

interface UserItem {
  user_id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
  last_active?: string;
  events_count: number;
  workouts_completed: number;
  posts_created: number;
  followers_count: number;
}

interface ActiveUser {
  user_id: string;
  username: string;
  avatar_url?: string;
  last_active?: string;
}

interface ChartDataset {
  label: string;
  data: number[];
}

interface ChartData {
  chart_type: string;
  labels: string[];
  datasets: ChartDataset[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  
  // Data states
  const [stats, setStats] = useState<ComprehensiveStats | null>(null);
  const [realtimeActiveCount, setRealtimeActiveCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [userGrowthChart, setUserGrowthChart] = useState<ChartData | null>(null);
  const [moodChart, setMoodChart] = useState<ChartData | null>(null);
  const [sessionChart, setSessionChart] = useState<ChartData | null>(null);
  
  // User list modal state
  const [showUserList, setShowUserList] = useState(false);
  const [userListType, setUserListType] = useState<'all' | 'new' | 'active'>('all');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  
  // Active users modal state
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  
  // Session chart modal state
  const [showSessionChart, setShowSessionChart] = useState(false);
  
  // Chart period selection
  const [chartPeriod, setChartPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  // Heartbeat interval
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  // Check authorization
  useEffect(() => {
    if (user) {
      const authorized = user.username?.toLowerCase() === ADMIN_USERNAME.toLowerCase();
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

  // Send heartbeat for real-time tracking
  useEffect(() => {
    if (!token || !isAuthorized) return;
    
    const sendHeartbeat = async () => {
      try {
        await fetch(`${API_URL}/api/analytics/heartbeat`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.log('Heartbeat error:', error);
      }
    };
    
    // Send initial heartbeat
    sendHeartbeat();
    
    // Set up interval
    heartbeatRef.current = setInterval(sendHeartbeat, 30000);
    
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [token, isAuthorized]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    if (!token || !isAuthorized) return;
    
    try {
      // Fetch comprehensive stats
      const statsResponse = await fetch(
        `${API_URL}/api/analytics/admin/comprehensive-stats?days=${selectedPeriod}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
      // Fetch real-time active users with details
      const realtimeResponse = await fetch(
        `${API_URL}/api/analytics/admin/realtime-active?timeout_minutes=5`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (realtimeResponse.ok) {
        const realtimeData = await realtimeResponse.json();
        setRealtimeActiveCount(realtimeData.active_count || 0);
        setActiveUsers(realtimeData.users || []);
      }
      
      // Fetch chart data - always use 'day' for session chart as requested
      const chartDays = chartPeriod === 'month' ? 365 : chartPeriod === 'week' ? 180 : 30;
      
      const [userGrowthRes, moodRes, sessionRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics/admin/chart-data/user_growth?period=${chartPeriod}&days=${chartDays}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/analytics/admin/chart-data/mood_distribution?period=${chartPeriod}&days=${chartDays}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        // Session chart always uses daily data
        fetch(`${API_URL}/api/analytics/admin/chart-data/session_trend?period=day&days=30`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);
      
      if (userGrowthRes.ok) {
        setUserGrowthChart(await userGrowthRes.json());
      }
      if (moodRes.ok) {
        setMoodChart(await moodRes.json());
      }
      if (sessionRes.ok) {
        setSessionChart(await sessionRes.json());
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, isAuthorized, selectedPeriod, chartPeriod]);

  useEffect(() => {
    if (isAuthorized) {
      fetchAllData();
    }
  }, [fetchAllData, isAuthorized]);

  // Fetch users for modal
  const fetchUsers = async (type: 'all' | 'new' | 'active', search: string = '') => {
    if (!token) return;
    setUsersLoading(true);
    
    try {
      let endpoint = '';
      if (type === 'all') {
        endpoint = `/api/analytics/admin/users/list?days=${selectedPeriod}&limit=50&search=${search}`;
      } else if (type === 'new') {
        endpoint = `/api/analytics/admin/users/list?days=${selectedPeriod}&limit=50&sort_by=created_at&sort_order=desc`;
      } else {
        endpoint = `/api/analytics/admin/users/list?days=${selectedPeriod}&limit=50`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalUsersCount(data.total_count || data.total || data.users?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const openUserList = (type: 'all' | 'new' | 'active') => {
    setUserListType(type);
    setUserSearchQuery('');
    setShowUserList(true);
    fetchUsers(type);
  };

  // Delete user function
  const deleteUser = async (userId: string, username: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete "${username}"?\n\nThis user's profile will be stored safely for 7 days and can be recovered if needed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/analytics/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              
              if (response.ok) {
                const data = await response.json();
                Alert.alert(
                  'User Deleted',
                  `${username} has been deleted.\n\nRecoverable until: ${new Date(data.recoverable_until).toLocaleDateString()}`,
                  [{ text: 'OK' }]
                );
                // Refresh user list
                fetchUsers(userListType, userSearchQuery);
                // Refresh stats
                fetchAllData();
              } else {
                const error = await response.json();
                Alert.alert('Error', error.detail || 'Failed to delete user');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Export users as CSV
  const exportUsers = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(
        `${API_URL}/api/analytics/admin/export/users?days=${selectedPeriod}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          'Export Ready',
          `${data.count} users exported. In production, this would download as CSV.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export users data.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  // Format signup date nicely
  const formatSignupDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthorized) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  // Chart configurations
  const chartConfig = {
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
  };

  // Calculate total mood selections for percentage
  const totalMoodSelections = moodChart?.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Analytics Dashboard</Text>
          <Text style={styles.headerSubtitle}>Board-Ready Insights</Text>
        </View>
        <TouchableOpacity onPress={exportUsers} style={styles.exportButton}>
          <Ionicons name="download-outline" size={22} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        {TIME_PERIODS.map(period => (
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
              {period.shortLabel}
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
          />
        }
      >
        {/* Key Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <Text style={styles.sectionSubtitle}>
            {selectedPeriod === 1 ? 'Last 24 hours' : `Last ${selectedPeriod} days`}
          </Text>
          
          <View style={styles.metricsGrid}>
            {/* Total Users */}
            <TouchableOpacity 
              style={styles.metricCard}
              onPress={() => openUserList('all')}
            >
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(255, 215, 0, 0.15)' }]}>
                <Ionicons name="people" size={24} color="#FFD700" />
              </View>
              <Text style={styles.metricValue}>{stats?.total_users?.toLocaleString() || 0}</Text>
              <Text style={styles.metricLabel}>Total Users</Text>
              <View style={styles.metricFooter}>
                <Ionicons name="chevron-forward" size={14} color="#666" />
                <Text style={styles.metricHint}>View all users</Text>
              </View>
            </TouchableOpacity>

            {/* New Users */}
            <TouchableOpacity 
              style={styles.metricCard}
              onPress={() => openUserList('new')}
            >
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                <Ionicons name="person-add" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.metricValue}>{stats?.new_users?.toLocaleString() || 0}</Text>
              <Text style={styles.metricLabel}>New Users</Text>
              <View style={styles.metricFooter}>
                <Text style={styles.metricSubValue}>
                  {selectedPeriod === 1 ? 'today' : `in ${selectedPeriod}d`}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Real-time Active - Opens active users list */}
            <TouchableOpacity 
              style={styles.metricCard}
              onPress={() => setShowActiveUsers(true)}
            >
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(244, 67, 54, 0.15)' }]}>
                <View style={styles.liveDot} />
                <Ionicons name="radio" size={24} color="#F44336" />
              </View>
              <Text style={styles.metricValue}>{realtimeActiveCount}</Text>
              <Text style={styles.metricLabel}>Active Now</Text>
              <View style={styles.metricFooter}>
                <Text style={[styles.metricSubValue, { color: '#F44336' }]}>LIVE</Text>
                <Ionicons name="chevron-forward" size={14} color="#666" />
              </View>
            </TouchableOpacity>

            {/* App Sessions - Opens session chart */}
            <TouchableOpacity 
              style={styles.metricCard}
              onPress={() => setShowSessionChart(true)}
            >
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                <Ionicons name="phone-portrait" size={24} color="#2196F3" />
              </View>
              <Text style={styles.metricValue}>{stats?.total_sessions?.toLocaleString() || 0}</Text>
              <Text style={styles.metricLabel}>App Sessions</Text>
              <View style={styles.metricFooter}>
                <Text style={styles.metricSubValue}>View chart</Text>
                <Ionicons name="bar-chart-outline" size={14} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Pages Visited */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Pages Visited</Text>
            <Text style={styles.totalBadge}>{stats?.total_screen_views?.toLocaleString() || 0} views</Text>
          </View>
          
          {stats?.top_pages && stats.top_pages.length > 0 ? (
            <View style={styles.listContainer}>
              {stats.top_pages.slice(0, 5).map((page, index) => {
                const maxViews = stats.top_pages[0]?.views || 1;
                const percentage = (page.views / maxViews) * 100;
                
                return (
                  <View key={page.page} style={styles.listItem}>
                    <View style={styles.listRank}>
                      <Text style={[styles.rankText, index === 0 && styles.rankTextGold]}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.listContent}>
                      <Text style={styles.listTitle}>{formatPageName(page.page)}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                      </View>
                    </View>
                    <View style={styles.listStats}>
                      <Text style={styles.listValue}>{page.views.toLocaleString()}</Text>
                      <Text style={styles.listSubValue}>{page.unique_users} users</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="analytics-outline" size={32} color="#666" />
              <Text style={styles.emptyText}>No page view data yet</Text>
            </View>
          )}
        </View>

        {/* Mood Selection Distribution - Custom on-brand design */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mood Selection Distribution</Text>
            <Text style={styles.totalBadge}>{stats?.total_mood_selections?.toLocaleString() || 0} total</Text>
          </View>
          
          {moodChart && moodChart.labels.length > 0 ? (
            <View style={styles.moodDistributionContainer}>
              {/* Visual bars for each mood */}
              {moodChart.labels.map((label, index) => {
                const count = moodChart.datasets[0]?.data[index] || 0;
                const percentage = totalMoodSelections > 0 ? (count / totalMoodSelections) * 100 : 0;
                const moodId = stats?.top_mood_cards?.find(m => m.mood === label)?.mood_id || '';
                const color = MOOD_COLORS[moodId] || '#FFD700';
                const icon = MOOD_ICONS[moodId] || 'fitness';
                
                return (
                  <View key={label} style={styles.moodBarRow}>
                    <View style={styles.moodLabelContainer}>
                      <View style={[styles.moodIconCircle, { backgroundColor: `${color}20` }]}>
                        <Ionicons name={icon as any} size={16} color={color} />
                      </View>
                      <Text style={styles.moodLabel} numberOfLines={1}>{label}</Text>
                    </View>
                    <View style={styles.moodBarContainer}>
                      <View style={[styles.moodBar, { width: `${percentage}%`, backgroundColor: color }]} />
                    </View>
                    <Text style={styles.moodPercentage}>{percentage.toFixed(0)}%</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="happy-outline" size={32} color="#666" />
              <Text style={styles.emptyText}>No mood selection data yet</Text>
            </View>
          )}
        </View>

        {/* Charts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Growth Charts</Text>
            <View style={styles.chartPeriodSelector}>
              {['day', 'week', 'month'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.chartPeriodBtn, chartPeriod === p && styles.chartPeriodBtnActive]}
                  onPress={() => setChartPeriod(p as 'day' | 'week' | 'month')}
                >
                  <Text style={[styles.chartPeriodText, chartPeriod === p && styles.chartPeriodTextActive]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* User Growth Chart */}
          {userGrowthChart && userGrowthChart.labels.length > 0 ? (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>New User Signups</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={{
                    labels: userGrowthChart.labels.slice(-10),
                    datasets: [{ data: userGrowthChart.datasets[0]?.data.slice(-10) || [0] }]
                  }}
                  width={Math.max(screenWidth - 48, userGrowthChart.labels.slice(-10).length * 50)}
                  height={180}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  style={styles.chart}
                  showValuesOnTopOfBars
                  fromZero
                />
              </ScrollView>
            </View>
          ) : (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>New User Signups</Text>
              <View style={styles.noChartData}>
                <Ionicons name="bar-chart-outline" size={32} color="#666" />
                <Text style={styles.noChartText}>No signup data available</Text>
              </View>
            </View>
          )}
        </View>

        {/* Engagement Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement Summary</Text>
          
          <View style={styles.engagementGrid}>
            <View style={styles.engagementCard}>
              <Ionicons name="fitness" size={20} color="#FFD700" />
              <Text style={styles.engagementValue}>{stats?.workouts_completed || 0}</Text>
              <Text style={styles.engagementLabel}>Workouts Completed</Text>
              {stats?.workout_completion_rate ? (
                <Text style={styles.engagementSub}>{stats.workout_completion_rate}% completion</Text>
              ) : null}
            </View>
            
            <View style={styles.engagementCard}>
              <Ionicons name="create" size={20} color="#4CAF50" />
              <Text style={styles.engagementValue}>{stats?.posts_created || 0}</Text>
              <Text style={styles.engagementLabel}>Posts Created</Text>
            </View>
            
            <View style={styles.engagementCard}>
              <Ionicons name="heart" size={20} color="#E91E63" />
              <Text style={styles.engagementValue}>{stats?.total_likes || 0}</Text>
              <Text style={styles.engagementLabel}>Likes</Text>
            </View>
            
            <View style={styles.engagementCard}>
              <Ionicons name="chatbubble" size={20} color="#2196F3" />
              <Text style={styles.engagementValue}>{stats?.total_comments || 0}</Text>
              <Text style={styles.engagementLabel}>Comments</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Data generated at {new Date().toLocaleString()}
          </Text>
          <Text style={styles.footerText}>
            Active user tracking: 5-minute heartbeat interval
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Active Users Modal */}
      <Modal
        visible={showActiveUsers}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowActiveUsers(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowActiveUsers(false)} style={styles.modalClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.modalTitleContainer}>
              <View style={styles.liveIndicator}>
                <View style={styles.livePulse} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.modalTitle}>Active Users</Text>
            </View>
            <Text style={styles.modalCount}>{realtimeActiveCount} online</Text>
          </View>

          <Text style={styles.activeUsersSubtitle}>
            Users with app open in the last 5 minutes
          </Text>

          {activeUsers.length > 0 ? (
            <FlatList
              data={activeUsers}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item }) => (
                <View style={styles.activeUserItem}>
                  <View style={styles.activeUserAvatar}>
                    {item.avatar_url ? (
                      <Image 
                        source={{ uri: item.avatar_url.startsWith('http') ? item.avatar_url : `${API_URL}${item.avatar_url}` }} 
                        style={styles.avatarImage} 
                      />
                    ) : (
                      <Ionicons name="person" size={24} color="#666" />
                    )}
                    <View style={styles.onlineDot} />
                  </View>
                  <View style={styles.activeUserInfo}>
                    <Text style={styles.activeUserName}>{item.username}</Text>
                    <Text style={styles.activeUserTime}>
                      Last active: {item.last_active ? new Date(item.last_active).toLocaleTimeString() : 'Just now'}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyActiveUsers}>
              <Ionicons name="people-outline" size={48} color="#666" />
              <Text style={styles.emptyActiveText}>No users currently online</Text>
            </View>
          )}
        </View>
      </Modal>

      {/* Session Chart Modal */}
      <Modal
        visible={showSessionChart}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSessionChart(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSessionChart(false)} style={styles.modalClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>App Sessions by Day</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.sessionChartSubtitle}>
            Daily app session activity (last 30 days)
          </Text>

          {sessionChart && sessionChart.labels.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sessionChartContainer}
            >
              <LineChart
                data={{
                  labels: sessionChart.labels,
                  datasets: [{ data: sessionChart.datasets[0]?.data || [0] }]
                }}
                width={Math.max(screenWidth - 32, sessionChart.labels.length * 40)}
                height={280}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                }}
                bezier
                style={styles.sessionLineChart}
                fromZero
              />
            </ScrollView>
          ) : (
            <View style={styles.noSessionData}>
              <Ionicons name="analytics-outline" size={48} color="#666" />
              <Text style={styles.noSessionText}>No session data available</Text>
            </View>
          )}

          <View style={styles.sessionSummary}>
            <View style={styles.sessionSummaryItem}>
              <Text style={styles.sessionSummaryValue}>{stats?.total_sessions?.toLocaleString() || 0}</Text>
              <Text style={styles.sessionSummaryLabel}>Total Sessions</Text>
            </View>
            <View style={styles.sessionSummaryDivider} />
            <View style={styles.sessionSummaryItem}>
              <Text style={styles.sessionSummaryValue}>
                {sessionChart?.datasets[0]?.data.length 
                  ? Math.round(sessionChart.datasets[0].data.reduce((a, b) => a + b, 0) / sessionChart.datasets[0].data.length)
                  : 0}
              </Text>
              <Text style={styles.sessionSummaryLabel}>Avg Daily</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* User List Modal */}
      <Modal
        visible={showUserList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUserList(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowUserList(false)} style={styles.modalClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {userListType === 'all' ? 'All Users' : userListType === 'new' ? 'New Users' : 'Active Users'}
            </Text>
            <Text style={styles.modalCount}>{totalUsersCount} total</Text>
          </View>

          {userListType === 'all' && (
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by username or email..."
                placeholderTextColor="#666"
                value={userSearchQuery}
                onChangeText={(text) => {
                  setUserSearchQuery(text);
                  setTimeout(() => fetchUsers('all', text), 300);
                }}
              />
            </View>
          )}

          {usersLoading ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" color="#FFD700" />
            </View>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item, index }) => (
                <View style={styles.userItem}>
                  <View style={styles.userRank}>
                    <Text style={styles.userRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.userAvatar}>
                    {item.avatar_url ? (
                      <Image 
                        source={{ uri: item.avatar_url.startsWith('http') ? item.avatar_url : `${API_URL}${item.avatar_url}` }} 
                        style={styles.avatarImage} 
                      />
                    ) : (
                      <Ionicons name="person" size={20} color="#666" />
                    )}
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.username}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    <Text style={styles.userSignupDate}>
                      📅 Signed up: {formatSignupDate(item.created_at)}
                    </Text>
                    <View style={styles.userStatsRow}>
                      <Text style={styles.userStat}>
                        <Ionicons name="fitness" size={12} color="#FFD700" /> {item.workouts_completed || 0}
                      </Text>
                      <Text style={styles.userStat}>
                        <Ionicons name="create" size={12} color="#4CAF50" /> {item.posts_created || 0}
                      </Text>
                      <Text style={styles.userStat}>
                        <Ionicons name="people" size={12} color="#2196F3" /> {item.followers_count || 0}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteUserBtn}
                    onPress={() => deleteUser(item.user_id, item.username)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>No users found</Text>
                </View>
              }
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

// Helper functions
function formatPageName(pageName: string): string {
  const nameMap: Record<string, string> = {
    'index': 'Home',
    'explore': 'Explore',
    'profile': 'Profile',
    'cart': 'Workout Cart',
    'workout-session': 'Workout Session',
    'create-post': 'Create Post',
    'admin-dashboard': 'Admin Dashboard',
    'featured-workout-detail': 'Featured Workout',
    'user-profile': 'User Profile',
    'settings': 'Settings',
  };
  return nameMap[pageName] || pageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  exportButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0c0c0c',
  },
  periodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 50,
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    marginBottom: 12,
  },
  totalBadge: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (screenWidth - 44) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  metricFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  metricHint: {
    fontSize: 10,
    color: '#666',
  },
  metricSubValue: {
    fontSize: 11,
    color: '#666',
  },
  liveDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  listContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  listRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
  },
  rankTextGold: {
    color: '#FFD700',
  },
  listContent: {
    flex: 1,
    marginRight: 12,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  listStats: {
    alignItems: 'flex-end',
  },
  listValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  listSubValue: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  // Mood Distribution styles (on-brand)
  moodDistributionContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  moodBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
  },
  moodIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  moodLabel: {
    fontSize: 12,
    color: '#fff',
    flex: 1,
  },
  moodBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  moodBar: {
    height: '100%',
    borderRadius: 4,
  },
  moodPercentage: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
    width: 40,
    textAlign: 'right',
  },
  chartPeriodSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  chartPeriodBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
  },
  chartPeriodBtnActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  chartPeriodText: {
    fontSize: 11,
    color: '#888',
  },
  chartPeriodTextActive: {
    color: '#FFD700',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 8,
  },
  noChartData: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noChartText: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
  engagementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  engagementCard: {
    width: (screenWidth - 44) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  engagementValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  engagementLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  engagementSub: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  modalClose: {
    padding: 4,
  },
  modalTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  modalCount: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  // Active users modal styles
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F44336',
  },
  activeUsersSubtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 12,
  },
  activeUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  activeUserAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  activeUserInfo: {
    flex: 1,
  },
  activeUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  activeUserTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  emptyActiveUsers: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyActiveText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  // Session chart modal styles
  sessionChartSubtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 12,
  },
  sessionChartContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sessionLineChart: {
    borderRadius: 12,
  },
  noSessionData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSessionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  sessionSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  sessionSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  sessionSummaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD700',
  },
  sessionSummaryLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  sessionSummaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#333',
    marginHorizontal: 20,
  },
  // User list styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#fff',
    fontSize: 14,
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  userRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userRankText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  userEmail: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  userSignupDate: {
    fontSize: 10,
    color: '#FFD700',
    marginTop: 4,
  },
  userStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  userStat: {
    fontSize: 10,
    color: '#666',
  },
  deleteUserBtn: {
    padding: 8,
    marginLeft: 8,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyListText: {
    color: '#666',
    fontSize: 14,
  },
});
