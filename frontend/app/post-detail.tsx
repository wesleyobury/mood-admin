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
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import MediaCarousel from '../components/MediaCarousel';
import ReportModal from '../components/ReportModal';
import GuestPromptModal from '../components/GuestPromptModal';
import Constants from 'expo-constants';

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
}

export default function PostDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token, user, isGuest } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [guestAction, setGuestAction] = useState('');

  // Check if current user is the post author
  const isOwnPost = post && user && post.author.id === user.id;

  useEffect(() => {
    if (params.postId && token) {
      fetchPost();
    }
  }, [params.postId, token]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${params.postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        console.error('Failed to fetch post:', response.status);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDelete 
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!post || !token) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Post deleted successfully');
        router.back();
      } else {
        const data = await response.json();
        Alert.alert('Error', data.detail || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (isGuest) {
      setGuestAction('like posts');
      setShowGuestPrompt(true);
      return;
    }
    if (!post || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPost({
          ...post,
          is_liked: data.liked,
          likes_count: data.likes_count,
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = async () => {
    if (isGuest) {
      setGuestAction('save posts');
      setShowGuestPrompt(true);
      return;
    }
    if (!post || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/posts/${post.id}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPost({
          ...post,
          is_saved: data.is_saved,
        });
        Alert.alert('Success', data.is_saved ? 'Post saved!' : 'Post removed from saved');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleReportPost = async (reason: string, details?: string) => {
    if (!post || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/moderation/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_id: post.id,
          content_type: 'post',
          reason: reason,
          details: details,
        }),
      });

      if (response.ok) {
        Alert.alert('Report Submitted', 'Thank you for helping keep our community safe.');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.detail || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        {isOwnPost ? (
          <TouchableOpacity onPress={handleDeletePost} disabled={isDeleting}>
            {isDeleting ? (
              <ActivityIndicator size="small" color="#888" />
            ) : (
              <Ionicons name="trash-outline" size={24} color="#888" />
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Author Info */}
        <View style={styles.authorSection}>
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
        </View>

        {/* Media (Images/Videos) */}
        {post.media_urls.length > 0 && (
          <MediaCarousel 
            media={post.media_urls.map(url => {
              // If URL doesn't start with http/https, prepend backend URL
              if (!url.startsWith('http')) {
                return url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/api/uploads/${url}`;
              }
              return url;
            })} 
          />
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons
              name={post.is_liked ? 'heart' : 'heart-outline'}
              size={28}
              color={post.is_liked ? '#FF6B6B' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Likes Count */}
        <Text style={styles.likesText}>
          {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
        </Text>

        {/* Caption */}
        {post.caption && (
          <View style={styles.captionSection}>
            <Text style={styles.caption}>
              <Text style={styles.captionUsername}>@{post.author.username} </Text>
              {post.caption}
            </Text>
          </View>
        )}

        {/* Timestamp */}
        <Text style={styles.timestamp}>
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  authorUsername: {
    fontSize: 13,
    color: '#888',
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  captionSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 24,
  },
});
