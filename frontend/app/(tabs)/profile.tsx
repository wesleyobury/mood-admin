import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WorkoutStatsCard from '../../components/WorkoutStatsCard';

const API_URL = '';
const { width } = Dimensions.get('window');

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

interface WorkoutCard {
  id: string;
  workouts: Array<{
    workoutName: string;
    equipment: string;
    duration: string;
    difficulty: string;
  }>;
  totalDuration: number;
  completedAt: string;
  created_at: string;
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

  const [recentWorkouts] = useState<RecentWorkout[]>([]);
  const [workoutCards, setWorkoutCards] = useState<WorkoutCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState<WorkoutCard | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'workouts' | 'achievements' | 'cards'>('workouts');

  // Load auth token
  useEffect(() => {
    loadMockAuth();
  }, []);

  // Load workout cards when Cards tab is selected
  useEffect(() => {
    if (activeTab === 'cards' && authToken) {
      fetchWorkoutCards();
    }
  }, [activeTab, authToken]);

  const loadMockAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'fitnessqueen',
          password: 'password123',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.token);
      }
    } catch (error) {
      console.error('Mock auth failed:', error);
    }
  };

  const fetchWorkoutCards = async () => {
    setLoadingCards(true);
    try {
      const response = await fetch(`${API_URL}/api/workout-cards`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkoutCards(data);
      }
    } catch (error) {
      console.error('Error fetching workout cards:', error);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/workout-cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setWorkoutCards(workoutCards.filter(card => card.id !== cardId));
        setModalVisible(false);
        setSelectedCard(null);
      }
    } catch (error) {
      console.error('Error deleting workout card:', error);
    }
  };

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleSettings = () => {
    console.log('Settings');
  };

  const handleFollowers = () => {
    console.log('View followers');
  };

  const handleFollowing = () => {
    console.log('View following');
  };

  const renderWorkoutCard = ({ item }: { item: WorkoutCard }) => (
    <TouchableOpacity
      style={styles.cardThumbnail}
      onPress={() => {
        setSelectedCard(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardThumbnailContent}>
        <Ionicons name="trophy" size={24} color="#FFD700" />
        <Text style={styles.cardThumbnailText}>{item.workouts.length} Exercises</Text>
        <Text style={styles.cardThumbnailDuration}>{item.totalDuration} min</Text>
      </View>
      <View style={styles.cardThumbnailFooter}>
        <Text style={styles.cardThumbnailDate}>{item.completedAt}</Text>
      </View>
    </TouchableOpacity>
  );

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
              size={18} 
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
            style={[styles.tab, activeTab === 'cards' && styles.activeTab]}
            onPress={() => setActiveTab('cards')}
          >
            <Ionicons 
              name="trophy" 
              size={18} 
              color={activeTab === 'cards' ? '#FFD700' : '#888'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'cards' && styles.activeTabText
            ]}>
              Cards
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Ionicons 
              name="ribbon" 
              size={18} 
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
          ) : activeTab === 'cards' ? (
            <View style={styles.cardsTab}>
              {loadingCards ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFD700" />
                  <Text style={styles.loadingText}>Loading workout cards...</Text>
                </View>
              ) : workoutCards.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="trophy-outline" size={48} color="#666" />
                  <Text style={styles.emptyTitle}>No workout cards yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Complete workouts to save your achievement cards!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={workoutCards}
                  renderItem={renderWorkoutCard}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.cardRow}
                  scrollEnabled={false}
                />
              )}
            </View>
          ) : (
            <View style={styles.achievementsTab}>
              <View style={styles.emptyState}>
                <Ionicons name="ribbon-outline" size={48} color="#666" />
                <Text style={styles.emptyTitle}>No achievements yet</Text>
                <Text style={styles.emptySubtitle}>
                  Complete workouts to unlock achievements!
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Workout Card Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Workout Achievement</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => selectedCard && handleDeleteCard(selectedCard.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {selectedCard && (
                <View style={styles.modalCardContainer}>
                  <WorkoutStatsCard {...selectedCard} />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFD700',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
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
  cardsTab: {
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
    fontSize: 14,
  },
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardThumbnail: {
    width: (width - 60) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    overflow: 'hidden',
  },
  cardThumbnailContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  cardThumbnailText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  cardThumbnailDuration: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cardThumbnailFooter: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  cardThumbnailDate: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#0c0c0c',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
  },
  deleteButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: '85%',
  },
  modalCardContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
