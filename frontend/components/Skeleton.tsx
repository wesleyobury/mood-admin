import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2a2a2a', '#3a3a3a'],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, backgroundColor },
        style,
      ]}
    />
  );
};

// Post Skeleton for Explore Feed
export const PostSkeleton: React.FC = () => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={styles.postHeaderText}>
        <Skeleton width={120} height={14} style={{ marginBottom: 4 }} />
        <Skeleton width={80} height={12} />
      </View>
    </View>
    <Skeleton width="100%" height={300} borderRadius={0} style={{ marginTop: 12 }} />
    <View style={styles.postActions}>
      <View style={styles.actionRow}>
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={60} height={24} borderRadius={12} style={{ marginLeft: 16 }} />
        <Skeleton width={60} height={24} borderRadius={12} style={{ marginLeft: 16 }} />
      </View>
    </View>
    <Skeleton width="90%" height={14} style={{ marginTop: 12, marginHorizontal: 16 }} />
  </View>
);

// Grid Item Skeleton for Profile
export const GridItemSkeleton: React.FC = () => (
  <View style={styles.gridItem}>
    <Skeleton width="100%" height="100%" borderRadius={2} />
  </View>
);

// Profile Header Skeleton
export const ProfileHeaderSkeleton: React.FC = () => (
  <View style={styles.profileHeader}>
    <Skeleton width={100} height={100} borderRadius={50} />
    <View style={styles.profileStats}>
      <View style={styles.statItem}>
        <Skeleton width={40} height={20} />
        <Skeleton width={60} height={12} style={{ marginTop: 4 }} />
      </View>
      <View style={styles.statItem}>
        <Skeleton width={40} height={20} />
        <Skeleton width={60} height={12} style={{ marginTop: 4 }} />
      </View>
      <View style={styles.statItem}>
        <Skeleton width={40} height={20} />
        <Skeleton width={60} height={12} style={{ marginTop: 4 }} />
      </View>
    </View>
    <Skeleton width={120} height={16} style={{ marginTop: 12 }} />
    <Skeleton width={200} height={12} style={{ marginTop: 8 }} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#2a2a2a',
  },
  postContainer: {
    backgroundColor: '#0c0c0c',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  postHeaderText: {
    marginLeft: 12,
  },
  postActions: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
});

export default Skeleton;
