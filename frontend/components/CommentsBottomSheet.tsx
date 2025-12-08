import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

interface Author {
  id: string;
  username: string;
  avatar: string;
}

interface Comment {
  id: string;
  author: Author;
  text: string;
  created_at: string;
}

interface CommentsBottomSheetProps {
  postId: string;
  authToken: string;
  onClose: () => void;
  onCommentAdded?: () => void;
  onUserPress?: (userId: string) => void;
}

export default function CommentsBottomSheet({ postId, authToken, onClose, onCommentAdded, onUserPress }: CommentsBottomSheetProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchComments();
  }, [postId, authToken]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || posting) return;

    setPosting(true);

    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          text: newComment.trim(),
        }),
      });
      
      if (response.ok) {
        setNewComment('');
        fetchComments(); // Refresh comments
        if (onCommentAdded) {
          onCommentAdded(); // Notify parent component
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setPosting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerHandle} />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Comments</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments List */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubble-outline" size={48} color="#333" />
              <Text style={styles.emptyText}>No comments yet</Text>
              <Text style={styles.emptySubtext}>Be the first to comment!</Text>
            </View>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                <TouchableOpacity 
                  onPress={() => onUserPress && onUserPress(comment.author.id)}
                  activeOpacity={0.7}
                >
                  {comment.author.avatar ? (
                    <Image 
                      source={{ uri: comment.author.avatar }} 
                      style={styles.commentAvatar}
                    />
                  ) : (
                    <View style={[styles.commentAvatar, styles.avatarPlaceholder]}>
                      <Ionicons name="person" size={16} color="#666" />
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <TouchableOpacity 
                      onPress={() => onUserPress && onUserPress(comment.author.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.commentUsername}>{comment.author.username}</Text>
                    </TouchableOpacity>
                    <Text style={styles.commentTime}>{formatTimeAgo(comment.created_at)}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#666"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={300}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!newComment.trim() || posting) && styles.sendButtonDisabled
            ]}
            onPress={handleAddComment}
            disabled={!newComment.trim() || posting}
          >
            {posting ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="send" size={20} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  headerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#444',
    fontSize: 14,
    marginTop: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  avatarPlaceholder: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentUsername: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.1)',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
});
