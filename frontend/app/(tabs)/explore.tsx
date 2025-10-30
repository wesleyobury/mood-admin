import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  RefreshControl,
  Dimensions,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ImageCarousel from '../../components/ImageCarousel';
import CommentsBottomSheet from '../../components/CommentsBottomSheet';

const SCREEN_WIDTH = Dimensions.get('window').width;
// Use relative /api path which gets proxied to backend
const API_URL = '';

interface Author {
  id: string;
  username: string;
  avatar: string;
  name?: string;
}

interface Workout {
  id: string;
  title: string;
  duration: number;
  mood_category: string;
  difficulty: string;
}

interface Post {
  id: string;
  author: Author;
  workout?: Workout;
  caption: string;
  media_urls: string[];
  hashtags: string[];
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
}

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const router = useRouter();

  // Mock auth token - In real app, this would come from auth context
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Double tap to like functionality
  const lastTap = useRef<number>(0);
  const [likeAnimations] = useState<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    loadMockAuth();
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchPosts();
    }
  }, [authToken]);

  const loadMockAuth = async () => {
    // Try to login with mock user to get token
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

  const fetchPosts = async () => {
    if (!authToken) return;

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    if (!authToken) return;

    try {
      // Optimistic update
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !post.is_liked, 
              likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1 
            }
          : post
      ));

      // API call
      await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      fetchPosts();
    }
  };

  const handleComment = (postId: string) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const handleDoubleTapLike = (postId: string) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      const post = posts.find(p => p.id === postId);
      if (post && !post.is_liked) {
        handleLike(postId);
        
        // Trigger like animation
        if (!likeAnimations[postId]) {
          likeAnimations[postId] = new Animated.Value(0);
        }
        
        Animated.sequence([
          Animated.timing(likeAnimations[postId], {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(likeAnimations[postId], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
    
    lastTap.current = now;
  };

  const handleProfile = (userId: string) => {
    // TODO: Navigate to user profile
    Alert.alert('Profile', 'Profile view coming soon!');
  };

  const handleCreatePost = () => {
    router.push('/create-post');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreatePost}
          >
            <View style={styles.createIconContainer}>
              <Ionicons name="add" size={24} color="#000" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {posts.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <TouchableOpacity 
                style={styles.authorInfo}
                onPress={() => handleProfile(post.author.id)}
              >
                <View style={styles.avatarContainer}>
                  <Image 
                    source={{ uri: post.author.avatar }} 
                    style={styles.avatar}
                  />
                  <View style={styles.avatarRing} />
                </View>
                <View>
                  <Text style={styles.username}>{post.author.username}</Text>
                  <Text style={styles.timestamp}>{formatTimeAgo(post.created_at)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton}>
                <View style={styles.menuDot} />
                <View style={styles.menuDot} />
                <View style={styles.menuDot} />
              </TouchableOpacity>
            </View>

            {/* Image Carousel */}
            {post.media_urls.length > 0 && (
              <TouchableOpacity 
                activeOpacity={1}
                onPress={() => handleDoubleTapLike(post.id)}
              >
                <ImageCarousel images={post.media_urls} />
                {/* Double Tap Heart Animation */}
                {likeAnimations[post.id] && (
                  <Animated.View 
                    style={[
                      styles.doubleTapHeart,
                      {
                        opacity: likeAnimations[post.id],
                        transform: [{
                          scale: likeAnimations[post.id].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1.5],
                          }),
                        }],
                      },
                    ]}
                  >
                    <Ionicons name="heart" size={80} color="#FFD700" />
                  </Animated.View>
                )}
              </TouchableOpacity>
            )}

            {/* Actions Row */}
            <View style={styles.actionsRow}>
              <View style={styles.leftActions}>
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleLike(post.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.actionIconContainer,
                    post.is_liked && styles.likedIconContainer
                  ]}>
                    <Ionicons 
                      name={post.is_liked ? 'heart' : 'heart-outline'} 
                      size={22} 
                      color={post.is_liked ? '#000' : '#FFD700'} 
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleComment(post.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconContainer}>
                    <Ionicons name="chatbubble-outline" size={20} color="#FFD700" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionBtn}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIconContainer}>
                    <Ionicons name="paper-plane-outline" size={20} color="#FFD700" />
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.actionBtn}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="bookmark-outline" size={20} color="#FFD700" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Likes Count */}
            {post.likes_count > 0 && (
              <View style={styles.likesContainer}>
                <View style={styles.likesIconBadge}>
                  <Ionicons name="heart" size={12} color="#FFD700" />
                </View>
                <Text style={styles.likesCount}>
                  {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
                </Text>
              </View>
            )}

            {/* Caption */}
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>
                <Text style={styles.captionUsername}>{post.author.username}</Text>
                {' '}
                {post.caption}
              </Text>
            </View>

            {/* View Comments */}
            {post.comments_count > 0 && (
              <TouchableOpacity 
                style={styles.viewCommentsBtn}
                onPress={() => handleComment(post.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewCommentsText}>
                  View all {post.comments_count} comments
                </Text>
              </TouchableOpacity>
            )}

            {/* Workout Info */}
            {post.workout && (
              <View style={styles.workoutBadge}>
                <View style={styles.workoutIconContainer}>
                  <Ionicons name="fitness" size={14} color="#000" />
                </View>
                <Text style={styles.workoutBadgeText}>
                  {post.workout.mood_category} • {post.workout.duration} min
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Load More Placeholder */}
        {posts.length > 0 && (
          <View style={styles.endMessage}>
            <View style={styles.endMessageIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
            </View>
            <Text style={styles.endMessageText}>You're all caught up!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  createButton: {
    padding: 4,
  },
  createIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  postContainer: {
    marginBottom: 24,
    backgroundColor: '#000',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#000',
  },
  avatarRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
    flexDirection: 'column',
    gap: 3,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    padding: 8,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likedIconContainer: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 6,
  },
  likesIconBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likesCount: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
    color: '#FFD700',
  },
  viewCommentsBtn: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  viewCommentsText: {
    color: '#666',
    fontSize: 14,
  },
  workoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  workoutIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  workoutBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  endMessage: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  endMessageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endMessageText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});
