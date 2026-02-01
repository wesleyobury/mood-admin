import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import HomeButton from '../components/HomeButton';
import { 
  videoLibraryData, 
  videoCategories, 
  videoEquipmentTypes,
  VideoItem 
} from '../data/video-library-data';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

const FilterChip = ({ 
  label, 
  isSelected, 
  onPress 
}: { 
  label: string; 
  isSelected: boolean; 
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.filterChip, isSelected && styles.filterChipSelected]}
    onPress={onPress}
  >
    <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const VideoCard = ({ 
  video, 
  onPress 
}: { 
  video: VideoItem; 
  onPress: (video: VideoItem) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => onPress(video)}
      activeOpacity={0.8}
    >
      <View style={styles.videoThumbnail}>
        <Ionicons name="play-circle" size={40} color="rgba(255, 215, 0, 0.8)" />
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoName} numberOfLines={2}>{video.name}</Text>
        <View style={styles.videoTags}>
          <View style={styles.equipmentTag}>
            <Ionicons name="barbell" size={10} color="#888" />
            <Text style={styles.tagText}>{video.equipment}</Text>
          </View>
        </View>
        <View style={styles.muscleGroupsRow}>
          {video.muscleGroups.slice(0, 2).map((mg, index) => (
            <View key={index} style={styles.muscleTag}>
              <Text style={styles.muscleTagText}>{mg}</Text>
            </View>
          ))}
          {video.muscleGroups.length > 2 && (
            <Text style={styles.moreText}>+{video.muscleGroups.length - 2}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function VideoLibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Filter videos based on selected filters
  const filteredVideos = videoLibraryData.filter(video => {
    const categoryMatch = selectedCategory === 'All' || video.category === selectedCategory;
    const equipmentMatch = selectedEquipment === 'All' || video.equipment === selectedEquipment;
    return categoryMatch && equipmentMatch;
  });

  const handleVideoPress = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Exercise Library</Text>
          <Text style={styles.headerSubtitle}>{videoLibraryData.length} Videos</Text>
        </View>
        <HomeButton />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {videoCategories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              isSelected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>
        
        <Text style={[styles.filterLabel, { marginTop: 12 }]}>Equipment</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {videoEquipmentTypes.map((equipment) => (
            <FilterChip
              key={equipment}
              label={equipment}
              isSelected={selectedEquipment === equipment}
              onPress={() => setSelectedEquipment(equipment)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Video Grid */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.videoGrid}>
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPress={handleVideoPress}
            />
          ))}
        </View>
        
        {filteredVideos.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="videocam-off" size={48} color="#666" />
            <Text style={styles.emptyStateText}>No videos match your filters</Text>
          </View>
        )}
      </ScrollView>

      {/* Video Player Modal */}
      <Modal
        visible={selectedVideo !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseVideo}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseVideo}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Video Title */}
            <Text style={styles.modalTitle}>{selectedVideo?.name}</Text>
            
            {/* Video Player */}
            {selectedVideo && (
              <View style={styles.videoPlayerContainer}>
                <Video
                  ref={videoRef}
                  source={{ uri: selectedVideo.videoUrl }}
                  style={styles.videoPlayer}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={isPlaying}
                  isLooping
                />
              </View>
            )}

            {/* Video Info */}
            {selectedVideo && (
              <View style={styles.modalInfo}>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="barbell" size={16} color="#FFD700" />
                  <Text style={styles.modalInfoText}>{selectedVideo.equipment}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="fitness" size={16} color="#FFD700" />
                  <Text style={styles.modalInfoText}>{selectedVideo.category}</Text>
                </View>
                <View style={styles.modalMuscleGroups}>
                  {selectedVideo.muscleGroups.map((mg, index) => (
                    <View key={index} style={styles.modalMuscleTag}>
                      <Text style={styles.modalMuscleTagText}>{mg}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 2,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterChipSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#FFD700',
  },
  filterChipText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#FFD700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  videoCard: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  videoThumbnail: {
    width: '100%',
    height: 100,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 12,
  },
  videoName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 18,
  },
  videoTags: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#888',
  },
  muscleGroupsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  muscleTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  muscleTagText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 10,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 32,
    maxHeight: '90%',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginRight: 40,
  },
  videoPlayerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  modalInfo: {
    marginTop: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#ccc',
  },
  modalMuscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  modalMuscleTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalMuscleTagText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
  },
});
