import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ImageCarousel from '../../components/ImageCarousel';

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
  const router = useRouter();

  // Mock auth token - In real app, this would come from auth context
  const [authToken, setAuthToken] = useState<string | null>(null);

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
    // TODO: Navigate to comments screen
    Alert.alert('Comments', 'Comments feature coming soon!');
  };

  const handleProfile = (userId: string) => {
    // TODO: Navigate to user profile
    Alert.alert('Profile', 'Profile view coming soon!');
  };

  const handleCreatePost = () => {
    // TODO: Navigate to create post screen
    Alert.alert('Create Post', 'Post creation feature coming soon!');
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
            <Ionicons name="add-circle" size={28} color="#FFD700" />
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
                <Image 
                  source={{ uri: post.author.avatar }} 
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.username}>{post.author.username}</Text>
                  <Text style={styles.timestamp}>{formatTimeAgo(post.created_at)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Image Carousel */}
            {post.media_urls.length > 0 && (
              <ImageCarousel images={post.media_urls} />
            )}

            {/* Actions Row */}
            <View style={styles.actionsRow}>
              <View style={styles.leftActions}>
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleLike(post.id)}
                >
                  <Ionicons 
                    name={post.is_liked ? 'heart' : 'heart-outline'} 
                    size={28} 
                    color={post.is_liked ? '#FF3B30' : '#fff'} 
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleComment(post.id)}
                >
                  <Ionicons name="chatbubble-outline" size={26} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="paper-plane-outline" size={26} color="#fff" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="bookmark-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Likes Count */}
            {post.likes_count > 0 && (
              <Text style={styles.likesCount}>
                {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
              </Text>
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
              >
                <Text style={styles.viewCommentsText}>
                  View all {post.comments_count} comments
                </Text>
              </TouchableOpacity>
            )}

            {/* Workout Info */}
            {post.workout && (
              <View style={styles.workoutBadge}>
                <Ionicons name="fitness" size={14} color="#FFD700" />
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
            <Text style={styles.endMessageText}>You're all caught up! 🎉</Text>
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
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
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
    marginBottom: 16,
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 0.5,
    borderColor: '#333',
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
  },
  likesCount: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
  },
  viewCommentsBtn: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  viewCommentsText: {
    color: '#888',
    fontSize: 14,
  },
  workoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignSelf: 'flex-start',
  },
  workoutBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  endMessage: {
    padding: 32,
    alignItems: 'center',
  },
  endMessageText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});
