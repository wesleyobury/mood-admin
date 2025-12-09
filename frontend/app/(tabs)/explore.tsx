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
  ActivityIndicator,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import ImageCarousel from '../../components/ImageCarousel';
import CommentsBottomSheet from '../../components/CommentsBottomSheet';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

interface Author {
  id: string;
  username: string;
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  author: Author;
  caption: string;
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  workout?: any;
}

interface SearchUser {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  is_self: boolean;
}

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();
  const { token, user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Double tap to like functionality
  const lastTap = useRef<number>(0);
  const [likeAnimations] = useState<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token, activeTab]);

  // Scroll to top when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
    }, [])
  );

  const fetchPosts = async () => {
    if (!token) {
      console.log('No token available for fetching posts');
      setLoading(false);
      return;
    }

    try {
      const endpoint = activeTab === 'following' 
        ? `${API_URL}/api/posts/following` 
        : `${API_URL}/api/posts`;
      
      console.log('Fetching posts from:', endpoint);
        
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Posts fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Posts fetched successfully:', data.length, 'posts');
        setPosts(data);
      } else {
        console.error('Failed to fetch posts:', response.status);
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

  const searchUsers = async (query: string) => {
    if (!token || query.trim().length < 1) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/users/search/query?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Failed to search users:', response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search - wait 300ms after user stops typing
    if (text.trim().length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(text);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const handleFollowToggle = async (userId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update search results
        setSearchResults(prevResults =>
          prevResults.map(user =>
            user.id === userId
              ? { ...user, is_following: !user.is_following }
              : user
          )
        );
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleDoubleTap = (postId: string) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      handleLike(postId);
      showLikeAnimation(postId);
    }

    lastTap.current = now;
  };

  const showLikeAnimation = (postId: string) => {
    if (!likeAnimations[postId]) {
      likeAnimations[postId] = new Animated.Value(0);
    }

    const animation = likeAnimations[postId];
    animation.setValue(0);

    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = async (postId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, is_liked: data.liked, likes_count: data.likes_count }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleProfile = (userId: string) => {
    // If clicking on own profile, navigate to profile tab
    if (user && user.id === userId) {
      router.push('/(tabs)/profile');
    } else {
      // Otherwise navigate to user-profile screen (keeps tabs visible)
      router.push(`/user-profile?userId=${userId}`);
    }
  };

  const handleCreatePost = () => {
    router.push('/create-post');
  };

  const handleComments = (postId: string) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const handleCommentAdded = () => {
    // Refresh posts to update comment count
    fetchPosts();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.title}>Explore</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading feed...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons name={showSearch ? "close" : "search"} size={24} color="#FFD700" />
          </TouchableOpacity>
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

      {/* Feed Type Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'forYou' && styles.activeTab]}
          onPress={() => setActiveTab('forYou')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'forYou' && styles.activeTabText
          ]}>
            For You
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'following' && styles.activeTabText
          ]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.feed}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />
        }
      >
        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fitness" size={64} color="#666" />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'following' 
                ? 'Follow users to see their posts here'
                : 'Be the first to share your fitness journey!'}
            </Text>
          </View>
        ) : (
          posts.map((post) => {
            const likeScale = likeAnimations[post.id]
              ? likeAnimations[post.id].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                })
              : new Animated.Value(0);

            return (
              <View key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <TouchableOpacity
                    style={styles.authorInfo}
                    onPress={() => handleProfile(post.author.id)}
                  >
                    {post.author.avatar ? (
                      <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Ionicons name="person" size={20} color="#666" />
                      </View>
                    )}
                    <View>
                      <Text style={styles.authorName}>{post.author.name || post.author.username}</Text>
                      <Text style={styles.authorUsername}>@{post.author.username}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Post Images */}
                {post.media_urls.length > 0 && (
                  <View>
                    <ImageCarousel 
                      images={post.media_urls.map(url => {
                        // If URL doesn't start with http/https, prepend backend URL
                        if (!url.startsWith('http')) {
                          return url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/api/uploads/${url}`;
                        }
                        return url;
                      })} 
                    />
                    {likeAnimations[post.id] && (
                      <Animated.View
                        style={[
                          styles.likeAnimationContainer,
                          {
                            opacity: likeScale,
                            transform: [
                              {
                                scale: likeScale.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 1.5],
                                }),
                              },
                            ],
                          },
                        ]}
                        pointerEvents="none"
                      >
                        <Ionicons name="heart" size={80} color="#FFD700" />
                      </Animated.View>
                    )}
                  </View>
                )}

                {/* Post Actions */}
                <View style={styles.postActions}>
                  <View style={styles.leftActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleLike(post.id)}
                    >
                      <Ionicons
                        name={post.is_liked ? 'heart' : 'heart-outline'}
                        size={26}
                        color={post.is_liked ? '#FF6B6B' : '#fff'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleComments(post.id)}
                    >
                      <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="paper-plane-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="bookmark-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Likes Count */}
                <View style={styles.likesSection}>
                  <Text style={styles.likesText}>
                    {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
                  </Text>
                </View>

                {/* Caption */}
                {post.caption && (
                  <View style={styles.captionSection}>
                    <Text style={styles.caption}>
                      <Text style={styles.captionUsername}>@{post.author.username} </Text>
                      {post.caption}
                    </Text>
                  </View>
                )}

                {/* Comments Preview */}
                <TouchableOpacity onPress={() => handleComments(post.id)}>
                  <Text style={styles.viewComments}>
                    {post.comments_count > 0 
                      ? `View all ${post.comments_count} ${post.comments_count === 1 ? 'comment' : 'comments'}`
                      : 'Add a comment...'
                    }
                  </Text>
                </TouchableOpacity>

                {/* Timestamp */}
                <Text style={styles.timestamp}>
                  {new Date(post.created_at).toLocaleDateString()}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Comments Bottom Sheet */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPostId && token && (
              <CommentsBottomSheet
                postId={selectedPostId}
                authToken={token}
                onClose={() => setShowComments(false)}
                onCommentAdded={handleCommentAdded}
                onUserPress={handleProfile}
              />
            )}
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
    fontSize: 14,
  },
  feed: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#0c0c0c',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
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
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  avatarPlaceholder: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  authorUsername: {
    fontSize: 12,
    color: '#888',
  },
  likeAnimationContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    zIndex: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  likesSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  captionSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  caption: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
    color: '#FFD700',
  },
  viewComments: {
    fontSize: 13,
    color: '#888',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '75%',
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFD700',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
  },
  activeTabText: {
    color: '#FFD700',
  },
});