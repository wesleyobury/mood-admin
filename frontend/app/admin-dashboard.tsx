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
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

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
    heartbeatRef.current = setInterval(sendHeartbeat, 30000); // Every 30 seconds
    
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
      
      // Fetch real-time active users
      const realtimeResponse = await fetch(
        `${API_URL}/api/analytics/admin/realtime-active?timeout_minutes=5`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (realtimeResponse.ok) {
        const realtimeData = await realtimeResponse.json();
        setRealtimeActiveCount(realtimeData.active_count || 0);
      }
      
      // Fetch chart data
      const chartDays = chartPeriod === 'month' ? 365 : chartPeriod === 'week' ? 180 : 30;
      
      const [userGrowthRes, moodRes, sessionRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics/admin/chart-data/user_growth?period=${chartPeriod}&days=${chartDays}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/analytics/admin/chart-data/mood_distribution?period=${chartPeriod}&days=${chartDays}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/analytics/admin/chart-data/session_trend?period=${chartPeriod}&days=${chartDays}`, {
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
        endpoint = `/api/analytics/admin/users/new?days=${selectedPeriod}&limit=50`;
      } else {
        endpoint = `/api/analytics/admin/users/active?days=${selectedPeriod}&limit=50`;
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
        // In a real app, this would trigger a download
        // For now, show alert with count
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

  const pieChartColors = ['#FFD700', '#4CAF50', '#2196F3', '#E91E63', '#FF9800', '#9C27B0'];

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
                <Text style={styles.metricHint}>Tap to view list</Text>
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

            {/* Real-time Active */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(244, 67, 54, 0.15)' }]}>
                <View style={styles.liveDot} />
                <Ionicons name="radio" size={24} color="#F44336" />
              </View>
              <Text style={styles.metricValue}>{realtimeActiveCount}</Text>
              <Text style={styles.metricLabel}>Active Now</Text>
              <View style={styles.metricFooter}>
                <Text style={[styles.metricSubValue, { color: '#F44336' }]}>LIVE</Text>
              </View>
            </View>

            {/* App Sessions */}
            <TouchableOpacity 
              style={styles.metricCard}
              onPress={() => openUserList('active')}
            >
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                <Ionicons name="phone-portrait" size={24} color="#2196F3" />
              </View>
              <Text style={styles.metricValue}>{stats?.total_sessions?.toLocaleString() || 0}</Text>
              <Text style={styles.metricLabel}>App Sessions</Text>
              <View style={styles.metricFooter}>
                <Text style={styles.metricSubValue}>app opens</Text>
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

        {/* Top Mood Cards Selected */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Mood Cards Selected</Text>
            <Text style={styles.totalBadge}>{stats?.total_mood_selections?.toLocaleString() || 0} selections</Text>
          </View>
          
          {stats?.top_mood_cards && stats.top_mood_cards.length > 0 ? (
            <View style={styles.listContainer}>
              {stats.top_mood_cards.map((mood, index) => {
                const maxSelections = stats.top_mood_cards[0]?.selections || 1;
                const percentage = (mood.selections / maxSelections) * 100;
                
                return (
                  <View key={mood.mood_id} style={styles.listItem}>
                    <View style={[styles.listRank, { backgroundColor: getMoodColor(mood.mood_id) }]}>
                      <Ionicons name={getMoodIcon(mood.mood_id)} size={16} color="#fff" />
                    </View>
                    <View style={styles.listContent}>
                      <Text style={styles.listTitle}>{mood.mood}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: getMoodColor(mood.mood_id) }]} />
                      </View>
                    </View>
                    <View style={styles.listStats}>
                      <Text style={styles.listValue}>{mood.selections.toLocaleString()}</Text>
                      <Text style={styles.listSubValue}>{mood.unique_users} users</Text>
                    </View>
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

          {/* Session Trend Chart */}
          {sessionChart && sessionChart.labels.length > 0 ? (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>App Session Trends</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: sessionChart.labels.slice(-10),
                    datasets: [{ data: sessionChart.datasets[0]?.data.slice(-10) || [0] }]
                  }}
                  width={Math.max(screenWidth - 48, sessionChart.labels.slice(-10).length * 50)}
                  height={180}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  }}
                  bezier
                  style={styles.chart}
                  fromZero
                />
              </ScrollView>
            </View>
          ) : null}

          {/* Mood Distribution Pie Chart */}
          {moodChart && moodChart.labels.length > 0 ? (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Mood Selection Distribution</Text>
              <PieChart
                data={moodChart.labels.map((label, index) => ({
                  name: label.length > 12 ? label.substring(0, 12) + '...' : label,
                  count: moodChart.datasets[0]?.data[index] || 0,
                  color: pieChartColors[index % pieChartColors.length],
                  legendFontColor: '#fff',
                  legendFontSize: 11,
                }))}
                width={screenWidth - 48}
                height={180}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          ) : null}
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
                  // Debounce search
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
                  <View style={styles.userMeta}>
                    {item.last_active && (
                      <Text style={styles.lastActive}>
                        Last: {new Date(item.last_active).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
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

function getMoodColor(moodId: string): string {
  const colors: Record<string, string> = {
    'sweat': '#FF5722',
    'muscle': '#4CAF50',
    'outdoor': '#2196F3',
    'calisthenics': '#9C27B0',
    'lazy': '#FF9800',
    'explosive': '#E91E63',
  };
  return colors[moodId] || '#FFD700';
}

function getMoodIcon(moodId: string): any {
  const icons: Record<string, string> = {
    'sweat': 'water',
    'muscle': 'barbell',
    'outdoor': 'leaf',
    'calisthenics': 'body',
    'lazy': 'bed',
    'explosive': 'flash',
  };
  return icons[moodId] || 'fitness';
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
  userStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  userStat: {
    fontSize: 10,
    color: '#666',
  },
  userMeta: {
    alignItems: 'flex-end',
  },
  lastActive: {
    fontSize: 10,
    color: '#666',
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
