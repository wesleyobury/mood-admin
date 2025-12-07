import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WorkoutStatsCard from '../../components/WorkoutStatsCard';
import { useAuth } from '../../contexts/AuthContext';
import FollowListModal from '../../components/FollowListModal';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';
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

interface Post {
  id: string;
  media_urls: string[];
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
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
  const [user, setUser] = useState({
    id: 'current-user',
    username: 'your_username',
    name: 'Your Name',
    bio: 'Fitness enthusiast • Living my best life • Let\'s get stronger together 💪',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
    isVerified: false,
  });

  const [stats, setStats] = useState<UserStats>({
    workouts: 0,
    followers: 0,
    following: 0,
    streak: 0,
  });

  const [recentWorkouts] = useState<RecentWorkout[]>([]);
  const [workoutCards, setWorkoutCards] = useState<WorkoutCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [selectedCard, setSelectedCard] = useState<WorkoutCard | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [followListVisible, setFollowListVisible] = useState(false);
  const [followListType, setFollowListType] = useState<'followers' | 'following'>('followers');
  const { token, user: authUser, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'posts' | 'achievements' | 'cards'>('posts');
  const router = useRouter();

  // Load user profile when token is available
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  // Refetch profile data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        fetchUserProfile();
        // Also refetch posts if on posts tab
        if (activeTab === 'posts' && user.id !== 'current-user') {
          fetchUserPosts();
        }
      }
    }, [token, activeTab, user.id])
  );

  // Sync with AuthContext user data when it changes
  useEffect(() => {
    if (authUser) {
      // Fix avatar URL if it doesn't include the backend URL
      let avatarUrl = authUser.avatar || '';
      if (avatarUrl && !avatarUrl.startsWith('http')) {
        avatarUrl = avatarUrl.startsWith('/') ? `${API_URL}${avatarUrl}` : `${API_URL}/api/uploads/${avatarUrl}`;
      }
      
      setUser({
        id: authUser.id,
        username: authUser.username,
        name: authUser.name || authUser.username,
        bio: authUser.bio || '',
        avatar: avatarUrl,
        isVerified: false,
      });
      setStats({
        workouts: authUser.workouts_count || 0,
        followers: authUser.followers_count || 0,
        following: authUser.following_count || 0,
        streak: authUser.current_streak || 0,
      });
    }
  }, [authUser]);

  // Load workout cards when Cards tab is selected
  useEffect(() => {
    if (activeTab === 'cards' && token) {
      fetchWorkoutCards();
    }
  }, [activeTab, token]);

  // Load user posts when Posts tab is selected
  useEffect(() => {
    if (activeTab === 'posts' && token && user.id !== 'current-user') {
      fetchUserPosts();
    }
  }, [activeTab, token, user.id]);

  const fetchUserProfile = async () => {
    if (!token) {
      console.log('No token available for profile');
      setLoadingProfile(false);
      return;
    }

    try {
      console.log('Fetching user profile from:', `${API_URL}/api/users/me`);
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Profile fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Profile data loaded:', data.username);
        
        // Fix avatar URL if it doesn't include the backend URL
        let avatarUrl = data.avatar || '';
        if (avatarUrl && !avatarUrl.startsWith('http')) {
          avatarUrl = avatarUrl.startsWith('/') ? `${API_URL}${avatarUrl}` : `${API_URL}/api/uploads/${avatarUrl}`;
        }
        
        setUser({
          id: data.id,
          username: data.username,
          name: data.name || data.username,
          bio: data.bio || '',
          avatar: avatarUrl,
          isVerified: false,
        });
        setStats({
          workouts: data.workouts_count || 0,
          followers: data.followers_count || 0,
          following: data.following_count || 0,
          streak: data.current_streak || 0,
        });
        // Also update the AuthContext with the fetched data
        updateUser({
          username: data.username,
          name: data.name,
          bio: data.bio,
          avatar: data.avatar,
          followers_count: data.followers_count || 0,
          following_count: data.following_count || 0,
          workouts_count: data.workouts_count || 0,
          current_streak: data.current_streak || 0,
        });
      } else {
        console.error('Failed to fetch profile:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchWorkoutCards = async () => {
    setLoadingCards(true);
    try {
      console.log('Fetching workout cards...');
      const response = await fetch(`${API_URL}/api/workout-cards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Workout cards response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched workout cards:', data);
        
        // Transform snake_case to camelCase for frontend
        const transformedData = data.map((card: any) => ({
          id: card.id,
          workouts: card.workouts,
          totalDuration: card.total_duration,
          completedAt: card.completed_at,
          created_at: card.created_at,
        }));
        
        setWorkoutCards(transformedData);
      } else {
        console.error('Failed to fetch workout cards:', response.status);
      }
    } catch (error) {
      console.error('Error fetching workout cards:', error);
    } finally {
      setLoadingCards(false);
    }
  };

  const fetchUserPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserPosts(data);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/workout-cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    router.push('/edit-profile');
  };

  const handleCreatePost = () => {
    router.push('/create-post');
  };

  const handleFollowers = () => {
    setFollowListType('followers');
    setFollowListVisible(true);
  };

  const handleFollowing = () => {
    setFollowListType('following');
    setFollowListVisible(true);
  };

  const renderWorkoutCard = ({ item }: { item: WorkoutCard }) => {
    // Get up to 3 workout titles
    const workoutTitles = item.workouts.slice(0, 3).map(w => w.workoutName);
    const hasMore = item.workouts.length > 3;
    
    return (
      <TouchableOpacity
        style={styles.cardThumbnail}
        onPress={() => {
          setSelectedCard(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.cardThumbnailContent}>
          <Ionicons name="trophy" size={20} color="#FFD700" />
          
          {/* Workout titles - up to 3 */}
          <View style={styles.workoutTitlesContainer}>
            {workoutTitles.map((title, index) => (
              <Text key={index} style={styles.workoutTitle} numberOfLines={1}>
                {title}
              </Text>
            ))}
            {hasMore && (
              <Text style={styles.workoutTitleMore}>
                +{item.workouts.length - 3} more
              </Text>
            )}
          </View>
          
          {/* Stats row */}
          <View style={styles.cardStats}>
            <Text style={styles.cardStat}>{item.workouts.length} exercises</Text>
            <Text style={styles.cardStatDivider}>•</Text>
            <Text style={styles.cardStat}>{item.totalDuration} min</Text>
          </View>
        </View>
        <View style={styles.cardThumbnailFooter}>
          <Text style={styles.cardThumbnailDate}>{item.completedAt}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.username}>@{user.username}</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreatePost}
        >
          <View style={styles.createIconContainer}>
            <Ionicons name="add" size={24} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={handleEditProfile} style={styles.avatarContainer}>
              <Image 
                source={{ uri: user.avatar }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={styles.editIconContainer}>
                <Ionicons name="pencil" size={16} color="#0c0c0c" />
              </View>
            </TouchableOpacity>
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
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons 
              name="grid" 
              size={18} 
              color={activeTab === 'posts' ? '#FFD700' : '#888'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'posts' && styles.activeTabText
            ]}>
              Posts
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
          {activeTab === 'posts' ? (
            <View style={styles.postsTab}>
              {loadingPosts ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFD700" />
                  <Text style={styles.loadingText}>Loading posts...</Text>
                </View>
              ) : userPosts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="images-outline" size={48} color="#666" />
                  <Text style={styles.emptyTitle}>No posts yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Share your fitness journey with your first post!
                  </Text>
                </View>
              ) : (
                <View style={styles.postsGrid}>
                  {userPosts.map((post) => {
                    let imageUrl = post.media_urls && post.media_urls.length > 0 
                      ? post.media_urls[0] 
                      : null;
                    
                    // Fix image URL if it doesn't include the backend URL
                    if (imageUrl && !imageUrl.startsWith('http')) {
                      imageUrl = imageUrl.startsWith('/') ? `${API_URL}${imageUrl}` : `${API_URL}/api/uploads/${imageUrl}`;
                    }
                    
                    return (
                      <TouchableOpacity
                        key={post.id}
                        style={styles.gridItem}
                        onPress={() => {
                          router.push(`/post-detail?postId=${post.id}`);
                        }}
                      >
                        {imageUrl ? (
                          <Image 
                            source={imageUrl}
                            style={styles.gridImage}
                            contentFit="cover"
                            transition={150}
                            cachePolicy="memory-disk"
                            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                          />
                        ) : (
                          <View style={[styles.gridImage, styles.placeholderGrid]}>
                            <Ionicons name="image-outline" size={40} color="#666" />
                          </View>
                        )}
                        {post.media_urls && post.media_urls.length > 1 && (
                          <View style={styles.multipleIndicator}>
                            <Ionicons name="copy-outline" size={16} color="#fff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
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

      {/* Follow List Modal */}
      <FollowListModal
        visible={followListVisible}
        onClose={() => setFollowListVisible(false)}
        userId={user.id}
        type={followListType}
      />
    </View>
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
  createButton: {
    padding: 4,
  },
  createIconContainer: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
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
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0c0c0c',
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
  postsTab: {
    flex: 1,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridItem: {
    width: (width - 44) / 3, // 3 columns with small gaps
    height: (width - 44) / 3, // 1:1 aspect ratio
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  placeholderGrid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  multipleIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
    padding: 4,
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
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  workoutTitlesContainer: {
    width: '100%',
    marginTop: 8,
    gap: 3,
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  workoutTitleMore: {
    color: '#888',
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  cardStat: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  cardStatDivider: {
    color: '#666',
    fontSize: 12,
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
