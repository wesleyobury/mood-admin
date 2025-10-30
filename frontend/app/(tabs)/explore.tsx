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
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const { EXPO_BACKEND_URL } = Constants.expoConfig?.extra || {};
const API_URL = EXPO_BACKEND_URL || 'http://localhost:8001';

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

// Mock data - will be replaced with API calls
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      username: 'fitnessqueen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c5db?w=100&h=100&fit=crop&crop=face',
    },
    workout: {
      title: 'Morning Sweat Session',
      duration: 45,
      mood: 'I want to sweat',
    },
    caption: 'Started my day with an intense cardio session! 💪 Feeling energized and ready to conquer the day. Who else loves morning workouts?',
    likes: 24,
    comments: 8,
    timestamp: '2h ago',
    isLiked: false,
  },
  {
    id: '2',
    author: {
      id: 'user2',
      username: 'strengthbeast',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    workout: {
      title: 'Push Day Power',
      duration: 60,
      mood: 'I want to push and gain muscle',
    },
    caption: 'Heavy chest and shoulder day in the books! New PR on bench press 🔥',
    likes: 31,
    comments: 12,
    timestamp: '4h ago',
    isLiked: true,
  },
];

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch fresh posts from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
    // TODO: Navigate to comments screen
  };

  const handleProfile = (userId: string) => {
    console.log('View profile:', userId);
    // TODO: Navigate to user profile
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={24} color="#FFD700" />
        </TouchableOpacity>
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
                  <Text style={styles.timestamp}>{post.timestamp}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Workout Info */}
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{post.workout.title}</Text>
              <View style={styles.workoutMeta}>
                <View style={styles.workoutTag}>
                  <Text style={styles.workoutTagText}>{post.workout.mood}</Text>
                </View>
                <Text style={styles.duration}>{post.workout.duration} min</Text>
              </View>
            </View>

            {/* Caption */}
            <Text style={styles.caption}>{post.caption}</Text>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => handleLike(post.id)}
              >
                <Ionicons 
                  name={post.isLiked ? 'heart' : 'heart-outline'} 
                  size={24} 
                  color={post.isLiked ? '#FF6B6B' : '#888'} 
                />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => handleComment(post.id)}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#888" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="share-outline" size={24} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Load More */}
        <TouchableOpacity style={styles.loadMore}>
          <Text style={styles.loadMoreText}>Load More Posts</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBtn: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#1a1a1a',
    marginBottom: 12,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  workoutInfo: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  workoutTagText: {
    fontSize: 12,
    color: '#0c0c0c',
    fontWeight: '600',
  },
  duration: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  caption: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 4,
  },
  loadMore: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});