import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useAuth } from '../../contexts/AuthContext';
import MediaCarousel from '../../components/MediaCarousel';
import CommentsBottomSheet from '../../components/CommentsBottomSheet';
import { Analytics } from '../../utils/analytics';
import { useScreenTime } from '../../hooks/useScreenTime';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

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
  is_saved: boolean;
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
  // Track screen time
  useScreenTime('Explore');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const router = useRouter();
  const { token, user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const postLayoutsRef = useRef<{ [key: string]: { y: number; height: number } }>({});
  const PAGE_SIZE = 20;

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

  const fetchPosts = async (loadMore = false, retryCount = 0) => {
    if (!token) {
      console.log('No token available for fetching posts');
      setLoading(false);
      return;
    }

    if (loadMore && !hasMore) return;
    if (loadMore) {
      setLoadingMore(true);
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const skip = loadMore ? posts.length : 0;
      // Reduce initial load to 10 posts for faster first render
      const limit = loadMore ? PAGE_SIZE : 10;
      const endpoint = activeTab === 'following' 
        ? `${API_URL}/api/posts/following?limit=${limit}&skip=${skip}` 
        : `${API_URL}/api/posts?limit=${limit}&skip=${skip}`;
      
      console.log('Fetching posts from:', endpoint);
        
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      console.log(`Posts fetch completed in ${responseTime}ms, status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Posts fetched successfully:', data.length, 'posts');
        
        // Check if there are more posts
        if (data.length < limit) {
          setHasMore(false);
        }
        
        // Posts now include is_saved from the backend - no need for individual API calls
        const postsWithSaveStatus = data.map((post: Post) => ({
          ...post,
          is_saved: post.is_saved || false
        }));
        
        if (loadMore) {
          setPosts(prev => [...prev, ...postsWithSaveStatus]);
        } else {
          setPosts(postsWithSaveStatus);
          setHasMore(true);
        }
        
        // Prefetch images for next batch
        prefetchPostImages(postsWithSaveStatus);
      } else {
        console.error('Failed to fetch posts:', response.status);
        // Retry on server errors
        if (response.status >= 500 && retryCount < 2) {
          console.log(`Retrying fetch (attempt ${retryCount + 1})...`);
          setTimeout(() => fetchPosts(loadMore, retryCount + 1), 1000 * (retryCount + 1));
          return;
        }
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('Posts fetch timed out');
        // Retry on timeout
        if (retryCount < 2) {
          console.log(`Retrying after timeout (attempt ${retryCount + 1})...`);
          setTimeout(() => fetchPosts(loadMore, retryCount + 1), 1000);
          return;
        }
      } else {
        console.error('Error fetching posts:', error);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Prefetch images for posts
  const prefetchPostImages = (postsToCache: Post[]) => {
    const imagesToPrefetch: string[] = [];
    postsToCache.forEach(post => {
      // Add author avatar
      if (post.author.avatar) {
        const avatarUrl = post.author.avatar.startsWith('http') 
          ? post.author.avatar 
          : `${API_URL}${post.author.avatar}`;
        imagesToPrefetch.push(avatarUrl);
      }
      // Add first media URL (thumbnail)
      if (post.media_urls && post.media_urls.length > 0) {
        const mediaUrl = post.media_urls[0].startsWith('http')
          ? post.media_urls[0]
          : `${API_URL}${post.media_urls[0]}`;
        // Only prefetch images, not videos
        if (!mediaUrl.match(/\.(mov|mp4|avi|webm)$/i)) {
          imagesToPrefetch.push(mediaUrl);
        }
      }
    });
    
    // Use expo-image prefetch
    imagesToPrefetch.forEach(url => {
      Image.prefetch(url).catch(() => {});
    });
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
        const data = await response.json();
        const isNowFollowing = data.following;

        // Update search results
        setSearchResults(prevResults =>
          prevResults.map(user =>
            user.id === userId
              ? { ...user, is_following: isNowFollowing }
              : user
          )
        );

        // Track follow/unfollow
        if (isNowFollowing) {
          Analytics.userFollowed(token, { followed_user_id: userId });
        } else {
          Analytics.userUnfollowed(token, { unfollowed_user_id: userId });
        }
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

        // Track like event
        if (data.liked) {
          Analytics.postLiked(token, { post_id: postId });
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = async (postId: string) => {
    if (!token) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      const method = post.is_saved ? 'DELETE' : 'POST';
      const response = await fetch(`${API_URL}/api/posts/${postId}/save`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prevPosts =>
          prevPosts.map(p =>
            p.id === postId
              ? { ...p, is_saved: data.is_saved }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Error saving post:', error);
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

  const handleDeletePost = (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => confirmDeletePost(postId)
        },
      ]
    );
  };

  const confirmDeletePost = async (postId: string) => {
    if (!token) return;

    setDeletingPostId(postId);
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the post from local state
        setPosts(prev => prev.filter(p => p.id !== postId));
        Alert.alert('Success', 'Post deleted successfully');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.detail || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    } finally {
      setDeletingPostId(null);
    }
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

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Search Results */}
      {showSearch && searchQuery.length > 0 && (
        <ScrollView style={styles.searchResults}>
          {searchLoading ? (
            <View style={styles.searchLoadingContainer}>
              <ActivityIndicator size="small" color="#FFD700" />
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No users found</Text>
            </View>
          ) : (
            searchResults.map((user) => (
              <View key={user.id} style={styles.userResultCard}>
                <TouchableOpacity
                  style={styles.userResultInfo}
                  onPress={() => handleProfile(user.id)}
                >
                  {user.avatar ? (
                    <Image 
                      source={{ 
                        uri: user.avatar.startsWith('http') 
                          ? user.avatar 
                          : `${API_URL}${user.avatar}` 
                      }} 
                      style={styles.userResultAvatar} 
                    />
                  ) : (
                    <View style={[styles.userResultAvatar, styles.avatarPlaceholder]}>
                      <Ionicons name="person" size={24} color="#666" />
                    </View>
                  )}
                  <View style={styles.userResultDetails}>
                    <Text style={styles.userResultName}>{user.name || user.username}</Text>
                    <Text style={styles.userResultUsername}>@{user.username}</Text>
                    {user.bio && <Text style={styles.userResultBio} numberOfLines={1}>{user.bio}</Text>}
                    <Text style={styles.userResultStats}>
                      {user.followers_count} followers · {user.following_count} following
                    </Text>
                  </View>
                </TouchableOpacity>
                {!user.is_self && (
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      user.is_following && styles.followingButton
                    ]}
                    onPress={() => handleFollowToggle(user.id)}
                  >
                    <Text style={[
                      styles.followButtonText,
                      user.is_following && styles.followingButtonText
                    ]}>
                      {user.is_following ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Feed Type Tabs */}
      {!showSearch && <View style={styles.tabContainer}>
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
      </View>}

      {!showSearch && <ScrollView
        ref={scrollViewRef}
        style={styles.feed}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 100;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            if (!loadingMore && hasMore) {
              fetchPosts(true);
            }
          }
          
          // Determine which post is visible
          const scrollY = nativeEvent.contentOffset.y;
          const viewportCenter = scrollY + (layoutMeasurement.height / 2);
          
          // Find the post that's most visible
          for (const postId of Object.keys(postLayoutsRef.current)) {
            const layout = postLayoutsRef.current[postId];
            if (layout && viewportCenter >= layout.y && viewportCenter <= layout.y + layout.height) {
              if (visiblePostId !== postId) {
                setVisiblePostId(postId);
              }
              break;
            }
          }
        }}
        scrollEventThrottle={100}
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
              <View 
                key={post.id} 
                style={styles.postCard}
                onLayout={(event) => {
                  const { y, height } = event.nativeEvent.layout;
                  postLayoutsRef.current[post.id] = { y, height };
                }}
              >
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <TouchableOpacity
                    style={styles.authorInfo}
                    onPress={() => handleProfile(post.author.id)}
                  >
                    {post.author.avatar ? (
                      <Image 
                        source={{ 
                          uri: post.author.avatar.startsWith('http') 
                            ? post.author.avatar 
                            : `${API_URL}${post.author.avatar}` 
                        }} 
                        style={styles.avatar}
                        contentFit="cover"
                        transition={100}
                        cachePolicy="memory-disk"
                      />
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
                  {/* Delete button for post owner */}
                  {user && user.id === post.author.id && (
                    <TouchableOpacity
                      style={styles.deletePostButton}
                      onPress={() => handleDeletePost(post.id)}
                      disabled={deletingPostId === post.id}
                    >
                      {deletingPostId === post.id ? (
                        <ActivityIndicator size="small" color="#888" />
                      ) : (
                        <Ionicons name="trash-outline" size={20} color="#888" />
                      )}
                    </TouchableOpacity>
                  )}
                </View>

                {/* Post Media (Images and Videos) */}
                {post.media_urls.length > 0 && (
                  <View>
                    <MediaCarousel 
                      media={post.media_urls.map(url => {
                        // If URL doesn't start with http/https, prepend backend URL
                        if (!url.startsWith('http')) {
                          return url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/api/uploads/${url}`;
                        }
                        return url;
                      })}
                      isPostVisible={visiblePostId === post.id}
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
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleSave(post.id)}
                  >
                    <Ionicons 
                      name={post.is_saved ? 'bookmark' : 'bookmark-outline'} 
                      size={24} 
                      color={post.is_saved ? '#FFD700' : '#fff'} 
                    />
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
        
        {/* Loading more indicator */}
        {loadingMore && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color="#FFD700" />
            <Text style={styles.loadingMoreText}>Loading more posts...</Text>
          </View>
        )}
        
        {/* End of posts indicator */}
        {!hasMore && posts.length > 0 && (
          <View style={styles.endOfPosts}>
            <Text style={styles.endOfPostsText}>You've reached the end!</Text>
          </View>
        )}
      </ScrollView>}

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
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
  deletePostButton: {
    padding: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: '#1a1a1a',
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 0,
  },
  searchResults: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  searchLoadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#888',
    fontSize: 16,
  },
  userResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  userResultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userResultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  userResultDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  userResultUsername: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  userResultBio: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 4,
  },
  userResultStats: {
    fontSize: 12,
    color: '#666',
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFD700',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  followingButtonText: {
    color: '#FFD700',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingMoreText: {
    color: '#888',
    fontSize: 14,
  },
  endOfPosts: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  endOfPostsText: {
    color: '#666',
    fontSize: 14,
  },
});