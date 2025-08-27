import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserStats {
  workouts: number;
  followers: number;
  following: number;
  streak: number;
}

interface RecentWorkout {
  id: string;
  title: string;
  mood: string;
  duration: number;
  date: string;
}

export default function Profile() {
  const [user] = useState({
    id: 'current-user',
    username: 'your_username',
    name: 'Your Name',
    bio: 'Fitness enthusiast • Living my best life • Let\'s get stronger together 💪',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
    isVerified: false,
  });

  const [stats] = useState<UserStats>({
    workouts: 0,
    followers: 0,
    following: 0,
    streak: 0,
  });

  const [recentWorkouts] = useState<RecentWorkout[]>([
    // Will be populated from API
  ]);

  const [activeTab, setActiveTab] = useState<'workouts' | 'achievements'>('workouts');

  const handleEditProfile = () => {
    console.log('Edit profile');
    // TODO: Navigate to edit profile screen
  };

  const handleSettings = () => {
    console.log('Settings');
    // TODO: Navigate to settings screen
  };

  const handleFollowers = () => {
    console.log('View followers');
    // TODO: Navigate to followers screen
  };

  const handleFollowing = () => {
    console.log('View following');
    // TODO: Navigate to following screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>@{user.username}</Text>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{stats.workouts}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem} onPress={handleFollowers}>
                <Text style={styles.statValue}>{stats.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem} onPress={handleFollowing}>
                <Text style={styles.statValue}>{stats.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.displayName}>{user.name}</Text>
              {user.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color="#FFD700" />
              )}
            </View>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* Current Streak */}
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={24} color="#FF6B6B" />
            <Text style={styles.streakText}>
              {stats.streak} day streak
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'workouts' && styles.activeTab]}
            onPress={() => setActiveTab('workouts')}
          >
            <Ionicons 
              name="fitness" 
              size={20} 
              color={activeTab === 'workouts' ? '#FFD700' : '#888'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'workouts' && styles.activeTabText
            ]}>
              Workouts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Ionicons 
              name="trophy" 
              size={20} 
              color={activeTab === 'achievements' ? '#FFD700' : '#888'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'achievements' && styles.activeTabText
            ]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'workouts' ? (
            <View style={styles.workoutsTab}>
              {recentWorkouts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="fitness-outline" size={48} color="#666" />
                  <Text style={styles.emptyTitle}>No workouts yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Start your fitness journey by selecting a mood!
                  </Text>
                  <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start First Workout</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                recentWorkouts.map((workout) => (
                  <View key={workout.id} style={styles.workoutItem}>
                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                    <Text style={styles.workoutMood}>{workout.mood}</Text>
                    <Text style={styles.workoutDuration}>{workout.duration} minutes</Text>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.achievementsTab}>
              <View style={styles.emptyState}>
                <Ionicons name="trophy-outline" size={48} color="#666" />
                <Text style={styles.emptyTitle}>No achievements yet</Text>
                <Text style={styles.emptySubtitle}>
                  Complete workouts to unlock achievements!
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  profileInfo: {
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 4,
  },
  bio: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  editButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  streakText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#FFD700',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  workoutsTab: {
    flex: 1,
  },
  achievementsTab: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#0c0c0c',
    fontSize: 14,
    fontWeight: '600',
  },
  workoutItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  workoutMood: {
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 4,
  },
  workoutDuration: {
    fontSize: 12,
    color: '#888',
  },
});