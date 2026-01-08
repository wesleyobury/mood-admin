import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageCropModalProps {
  visible: boolean;
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  onCropComplete: (croppedUri: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export default function ImageCropModal({
  visible,
  imageUri,
  imageWidth,
  imageHeight,
  onCropComplete,
  onCancel,
  aspectRatio = 4 / 5,
}: ImageCropModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayScale, setDisplayScale] = useState(1);
  
  // Container dimensions
  const containerWidth = SCREEN_WIDTH - 40;
  const containerHeight = SCREEN_HEIGHT - 350;
  
  // Calculate base image display size (fit within container)
  const imageAspect = imageWidth / imageHeight;
  let baseDisplayWidth: number;
  let baseDisplayHeight: number;
  
  if (imageAspect > containerWidth / containerHeight) {
    baseDisplayWidth = containerWidth;
    baseDisplayHeight = containerWidth / imageAspect;
  } else {
    baseDisplayHeight = containerHeight;
    baseDisplayWidth = containerHeight * imageAspect;
  }
  
  // Calculate crop box size (fixed aspect ratio)
  let cropBoxWidth: number;
  let cropBoxHeight: number;
  
  if (aspectRatio > baseDisplayWidth / baseDisplayHeight) {
    cropBoxWidth = baseDisplayWidth * 0.85;
    cropBoxHeight = cropBoxWidth / aspectRatio;
  } else {
    cropBoxHeight = baseDisplayHeight * 0.85;
    cropBoxWidth = cropBoxHeight * aspectRatio;
  }
  
  // Animated values for pan and zoom
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  // Refs for tracking gesture state
  const lastPan = useRef({ x: 0, y: 0 });
  const lastScale = useRef(1);
  const lastDistance = useRef(0);
  const currentScale = useRef(1);
  
  // Update display scale when animated value changes
  useEffect(() => {
    const id = scale.addListener(({ value }) => {
      setDisplayScale(value);
      currentScale.current = value;
    });
    return () => scale.removeListener(id);
  }, [scale]);
  
  // Reset when modal opens
  useEffect(() => {
    if (visible) {
      pan.setValue({ x: 0, y: 0 });
      scale.setValue(1);
      lastPan.current = { x: 0, y: 0 };
      lastScale.current = 1;
      currentScale.current = 1;
      setDisplayScale(1);
    }
  }, [visible]);
  
  // Calculate distance between two touches
  const getDistance = (touches: any[]): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Pan responder for gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length >= 2) {
          lastDistance.current = getDistance(touches);
          lastScale.current = currentScale.current;
        }
        lastPan.current = { x: pan.x._value, y: pan.y._value };
      },
      
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        
        if (touches.length >= 2) {
          // Pinch to zoom
          const distance = getDistance(touches);
          if (lastDistance.current > 0) {
            const newScale = Math.max(1, Math.min(4, lastScale.current * (distance / lastDistance.current)));
            scale.setValue(newScale);
          }
        } else {
          // Single finger pan (only when zoomed)
          if (currentScale.current > 1) {
            const scaledWidth = baseDisplayWidth * currentScale.current;
            const scaledHeight = baseDisplayHeight * currentScale.current;
            
            const maxX = Math.max(0, (scaledWidth - cropBoxWidth) / 2);
            const maxY = Math.max(0, (scaledHeight - cropBoxHeight) / 2);
            
            const newX = Math.max(-maxX, Math.min(maxX, lastPan.current.x + gestureState.dx));
            const newY = Math.max(-maxY, Math.min(maxY, lastPan.current.y + gestureState.dy));
            
            pan.setValue({ x: newX, y: newY });
          }
        }
      },
      
      onPanResponderRelease: () => {
        lastPan.current = { x: pan.x._value, y: pan.y._value };
        lastScale.current = currentScale.current;
        
        // Reset pan if zoomed back to 1x
        if (currentScale.current <= 1.05) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
          }).start(() => {
            lastPan.current = { x: 0, y: 0 };
            lastScale.current = 1;
          });
        }
      },
    })
  ).current;

  const handleCrop = async () => {
    setIsProcessing(true);
    try {
      const currentPanX = pan.x._value;
      const currentPanY = pan.y._value;
      const currentScaleVal = currentScale.current;
      
      // Calculate the visible crop area in original image coordinates
      const scaleToOriginal = imageWidth / baseDisplayWidth;
      
      // Crop box dimensions adjusted for current zoom
      const scaledCropWidth = cropBoxWidth / currentScaleVal;
      const scaledCropHeight = cropBoxHeight / currentScaleVal;
      
      // Center offset adjusted for pan
      const centerOffsetX = -currentPanX / currentScaleVal;
      const centerOffsetY = -currentPanY / currentScaleVal;
      
      // Convert to original image coordinates
      const originX = ((baseDisplayWidth - scaledCropWidth) / 2 + centerOffsetX) * scaleToOriginal;
      const originY = ((baseDisplayHeight - scaledCropHeight) / 2 + centerOffsetY) * scaleToOriginal;
      const cropWidth = scaledCropWidth * scaleToOriginal;
      const cropHeight = scaledCropHeight * scaleToOriginal;
      
      // Ensure we stay within bounds
      const safeOriginX = Math.max(0, Math.min(Math.round(originX), imageWidth - 1));
      const safeOriginY = Math.max(0, Math.min(Math.round(originY), imageHeight - 1));
      const safeWidth = Math.min(Math.round(cropWidth), imageWidth - safeOriginX);
      const safeHeight = Math.min(Math.round(cropHeight), imageHeight - safeOriginY);
      
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: safeOriginX,
              originY: safeOriginY,
              width: Math.max(1, safeWidth),
              height: Math.max(1, safeHeight),
            },
          },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      onCropComplete(result.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
      onCropComplete(imageUri);
    } finally {
      setIsProcessing(false);
    }
  };

  const scaledWidth = baseDisplayWidth * displayScale;
  const scaledHeight = baseDisplayHeight * displayScale;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onCancel}
            disabled={isProcessing}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crop Image</Text>
          <View style={styles.headerButton} />
        </View>

        {/* Zoom Info */}
        <View style={styles.aspectInfo}>
          <Ionicons name="crop" size={16} color="#FFD700" />
          <Text style={styles.aspectText}>4:5 Portrait</Text>
          <View style={styles.zoomBadge}>
            <Ionicons name="search" size={12} color="#FFD700" />
            <Text style={styles.zoomText}>{displayScale.toFixed(1)}x</Text>
          </View>
        </View>

        {/* Crop Area */}
        <View style={styles.cropContainer}>
          <View 
            style={[styles.imageContainer, { width: containerWidth, height: containerHeight }]}
            {...panResponder.panHandlers}
          >
            {/* Animated Image */}
            <Animated.Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                {
                  width: scaledWidth,
                  height: scaledHeight,
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                  ],
                },
              ]}
              resizeMode="contain"
            />
            
            {/* Overlay with crop box cutout */}
            <View style={styles.overlayContainer} pointerEvents="none">
              <View style={[styles.overlay, { 
                top: 0, left: 0, right: 0, 
                height: (containerHeight - cropBoxHeight) / 2 
              }]} />
              <View style={[styles.overlay, { 
                bottom: 0, left: 0, right: 0, 
                height: (containerHeight - cropBoxHeight) / 2 
              }]} />
              <View style={[styles.overlay, { 
                top: (containerHeight - cropBoxHeight) / 2, 
                left: 0, 
                width: (containerWidth - cropBoxWidth) / 2, 
                height: cropBoxHeight 
              }]} />
              <View style={[styles.overlay, { 
                top: (containerHeight - cropBoxHeight) / 2, 
                right: 0, 
                width: (containerWidth - cropBoxWidth) / 2, 
                height: cropBoxHeight 
              }]} />
              
              {/* Crop box border */}
              <View style={[styles.cropBox, { 
                width: cropBoxWidth, 
                height: cropBoxHeight,
                left: (containerWidth - cropBoxWidth) / 2,
                top: (containerHeight - cropBoxHeight) / 2,
              }]}>
                <View style={[styles.gridLine, styles.gridHorizontal, { top: '33%' }]} />
                <View style={[styles.gridLine, styles.gridHorizontal, { top: '66%' }]} />
                <View style={[styles.gridLine, styles.gridVertical, { left: '33%' }]} />
                <View style={[styles.gridLine, styles.gridVertical, { left: '66%' }]} />
                
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <View style={styles.instructionRow}>
            <Ionicons name="hand-left" size={16} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.instructionText}>Pinch to zoom</Text>
          </View>
          <View style={styles.instructionDivider} />
          <View style={styles.instructionRow}>
            <Ionicons name="move" size={16} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.instructionText}>Drag when zoomed</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={isProcessing}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.cropButton, isProcessing && styles.cropButtonDisabled]}
            onPress={handleCrop}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#000" />
                <Text style={styles.cropButtonText}>Apply</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  aspectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
  },
  aspectText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  zoomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  zoomText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  cropContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'transparent',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  gridHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  instructionDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  instructionText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 36,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cropButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cropButtonDisabled: {
    backgroundColor: 'rgba(255, 215, 0, 0.5)',
  },
  cropButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});
