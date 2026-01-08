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
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
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
  aspectRatio?: number; // Default is 4:5
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
  
  // Container dimensions
  const containerWidth = SCREEN_WIDTH - 40;
  const containerHeight = SCREEN_HEIGHT - 350;
  
  // Zoom state (1 = original size, 2 = 2x zoom, etc.)
  const [scale, setScale] = useState(1);
  const [lastScale, setLastScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(0);
  
  // Image offset for panning when zoomed
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [lastOffsetX, setLastOffsetX] = useState(0);
  const [lastOffsetY, setLastOffsetY] = useState(0);
  
  // Calculate image display size (fit within container)
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
  
  // Scaled dimensions
  const displayWidth = baseDisplayWidth * scale;
  const displayHeight = baseDisplayHeight * scale;
  
  // Calculate crop box size (fixed aspect ratio, fits within base display)
  const cropAspect = aspectRatio;
  let cropBoxWidth: number;
  let cropBoxHeight: number;
  
  if (cropAspect > baseDisplayWidth / baseDisplayHeight) {
    cropBoxWidth = baseDisplayWidth * 0.85;
    cropBoxHeight = cropBoxWidth / cropAspect;
  } else {
    cropBoxHeight = baseDisplayHeight * 0.85;
    cropBoxWidth = cropBoxHeight * cropAspect;
  }
  
  // Calculate distance between two touches
  const getDistance = (touches: any[]): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Pan responder for moving and zooming
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          // Start pinch - record initial distance
          setInitialDistance(getDistance(touches));
          setLastScale(scale);
        } else {
          // Start pan - record current offset
          setLastOffsetX(offsetX);
          setLastOffsetY(offsetY);
        }
      },
      
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        
        if (touches.length === 2) {
          // Pinch to zoom
          const currentDistance = getDistance(touches);
          if (initialDistance > 0) {
            const newScale = Math.max(1, Math.min(4, lastScale * (currentDistance / initialDistance)));
            setScale(newScale);
            
            // Constrain offset when zooming out
            if (newScale <= 1) {
              setOffsetX(0);
              setOffsetY(0);
            }
          }
        } else if (scale > 1) {
          // Pan when zoomed in
          const scaledDisplayWidth = baseDisplayWidth * scale;
          const scaledDisplayHeight = baseDisplayHeight * scale;
          
          // Calculate max offset based on how much the image extends beyond the crop box
          const maxOffsetX = Math.max(0, (scaledDisplayWidth - cropBoxWidth) / 2);
          const maxOffsetY = Math.max(0, (scaledDisplayHeight - cropBoxHeight) / 2);
          
          const newOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, lastOffsetX + gestureState.dx));
          const newOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, lastOffsetY + gestureState.dy));
          
          setOffsetX(newOffsetX);
          setOffsetY(newOffsetY);
        }
      },
      
      onPanResponderRelease: () => {
        setInitialDistance(0);
        setLastScale(scale);
        setLastOffsetX(offsetX);
        setLastOffsetY(offsetY);
      },
    })
  ).current;
  
  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setScale(1);
      setLastScale(1);
      setOffsetX(0);
      setOffsetY(0);
      setLastOffsetX(0);
      setLastOffsetY(0);
    }
  }, [visible]);

  const handleCrop = async () => {
    setIsProcessing(true);
    try {
      // Calculate the visible crop area in original image coordinates
      const scaleToOriginal = imageWidth / baseDisplayWidth;
      
      // The crop box is centered in the container
      // With zoom and offset, we need to calculate what part of the original image is visible
      
      // Center of the crop box in display coordinates (relative to image center)
      const cropCenterX = -offsetX;
      const cropCenterY = -offsetY;
      
      // Crop box dimensions in current scale
      const scaledCropWidth = cropBoxWidth / scale;
      const scaledCropHeight = cropBoxHeight / scale;
      
      // Convert to original image coordinates
      const originX = ((baseDisplayWidth / 2) + cropCenterX - (scaledCropWidth / 2)) * scaleToOriginal;
      const originY = ((baseDisplayHeight / 2) + cropCenterY - (scaledCropHeight / 2)) * scaleToOriginal;
      const cropWidth = scaledCropWidth * scaleToOriginal;
      const cropHeight = scaledCropHeight * scaleToOriginal;
      
      // Ensure we stay within bounds
      const safeOriginX = Math.max(0, Math.min(Math.round(originX), imageWidth - cropWidth));
      const safeOriginY = Math.max(0, Math.min(Math.round(originY), imageHeight - cropHeight));
      const safeWidth = Math.min(Math.round(cropWidth), imageWidth - safeOriginX);
      const safeHeight = Math.min(Math.round(cropHeight), imageHeight - safeOriginY);
      
      // Apply the crop using expo-image-manipulator
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: safeOriginX,
              originY: safeOriginY,
              width: safeWidth,
              height: safeHeight,
            },
          },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      onCropComplete(result.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
      // If crop fails, return original image
      onCropComplete(imageUri);
    } finally {
      setIsProcessing(false);
    }
  };

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

        {/* Aspect Ratio & Zoom Info */}
        <View style={styles.aspectInfo}>
          <Ionicons name="crop" size={16} color="#FFD700" />
          <Text style={styles.aspectText}>4:5 Portrait</Text>
          <View style={styles.zoomBadge}>
            <Ionicons name="search" size={12} color="#FFD700" />
            <Text style={styles.zoomText}>{scale.toFixed(1)}x</Text>
          </View>
        </View>

        {/* Crop Area */}
        <View style={styles.cropContainer}>
          <View 
            style={[styles.imageContainer, { width: containerWidth, height: containerHeight }]}
            {...panResponder.panHandlers}
          >
            {/* Image with zoom and offset */}
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: imageUri }}
                style={[
                  styles.image,
                  { 
                    width: displayWidth, 
                    height: displayHeight,
                    transform: [
                      { translateX: offsetX },
                      { translateY: offsetY },
                    ],
                  }
                ]}
                resizeMode="contain"
              />
            </View>
            
            {/* Dark overlay with crop box cutout */}
            <View style={styles.overlayContainer} pointerEvents="none">
              {/* Top overlay */}
              <View style={[styles.overlay, { 
                top: 0, 
                left: 0, 
                right: 0, 
                height: (containerHeight - cropBoxHeight) / 2 
              }]} />
              {/* Bottom overlay */}
              <View style={[styles.overlay, { 
                bottom: 0, 
                left: 0, 
                right: 0, 
                height: (containerHeight - cropBoxHeight) / 2 
              }]} />
              {/* Left overlay */}
              <View style={[styles.overlay, { 
                top: (containerHeight - cropBoxHeight) / 2, 
                left: 0, 
                width: (containerWidth - cropBoxWidth) / 2, 
                height: cropBoxHeight 
              }]} />
              {/* Right overlay */}
              <View style={[styles.overlay, { 
                top: (containerHeight - cropBoxHeight) / 2, 
                right: 0, 
                width: (containerWidth - cropBoxWidth) / 2, 
                height: cropBoxHeight 
              }]} />
              
              {/* Crop box border */}
              <View 
                style={[
                  styles.cropBox, 
                  { 
                    width: cropBoxWidth, 
                    height: cropBoxHeight,
                    left: (containerWidth - cropBoxWidth) / 2,
                    top: (containerHeight - cropBoxHeight) / 2,
                  }
                ]}
              >
                {/* Grid lines */}
                <View style={[styles.gridLine, styles.gridHorizontal, { top: '33%' }]} />
                <View style={[styles.gridLine, styles.gridHorizontal, { top: '66%' }]} />
                <View style={[styles.gridLine, styles.gridVertical, { left: '33%' }]} />
                <View style={[styles.gridLine, styles.gridVertical, { left: '66%' }]} />
                
                {/* Corner indicators */}
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
            <Ionicons name="finger-print" size={16} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.instructionText}>Drag to move</Text>
          </View>
          <View style={styles.instructionDivider} />
          <View style={styles.instructionRow}>
            <Ionicons name="expand" size={16} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.instructionText}>Pinch to zoom</Text>
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
  imageWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // Dimensions set dynamically
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
