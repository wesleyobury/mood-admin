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
  Animated,
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
  
  // Calculate display dimensions
  const containerWidth = SCREEN_WIDTH - 40;
  const containerHeight = SCREEN_HEIGHT - 300;
  
  // Calculate image display size (fit within container)
  const imageAspect = imageWidth / imageHeight;
  let displayWidth: number;
  let displayHeight: number;
  
  if (imageAspect > containerWidth / containerHeight) {
    displayWidth = containerWidth;
    displayHeight = containerWidth / imageAspect;
  } else {
    displayHeight = containerHeight;
    displayWidth = containerHeight * imageAspect;
  }
  
  // Calculate crop box size (fixed aspect ratio)
  const cropAspect = aspectRatio;
  let cropBoxWidth: number;
  let cropBoxHeight: number;
  
  if (cropAspect > displayWidth / displayHeight) {
    cropBoxWidth = displayWidth * 0.9;
    cropBoxHeight = cropBoxWidth / cropAspect;
  } else {
    cropBoxHeight = displayHeight * 0.9;
    cropBoxWidth = cropBoxHeight * cropAspect;
  }
  
  // Crop box position (centered initially)
  const [cropX, setCropX] = useState((displayWidth - cropBoxWidth) / 2);
  const [cropY, setCropY] = useState((displayHeight - cropBoxHeight) / 2);
  
  // Pan responder for moving crop box
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = Math.max(0, Math.min(displayWidth - cropBoxWidth, cropX + gestureState.dx));
        const newY = Math.max(0, Math.min(displayHeight - cropBoxHeight, cropY + gestureState.dy));
        setCropX(newX);
        setCropY(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const newX = Math.max(0, Math.min(displayWidth - cropBoxWidth, cropX + gestureState.dx));
        const newY = Math.max(0, Math.min(displayHeight - cropBoxHeight, cropY + gestureState.dy));
        setCropX(newX);
        setCropY(newY);
      },
    })
  ).current;
  
  // Reset position when modal opens
  useEffect(() => {
    if (visible) {
      setCropX((displayWidth - cropBoxWidth) / 2);
      setCropY((displayHeight - cropBoxHeight) / 2);
    }
  }, [visible, displayWidth, displayHeight, cropBoxWidth, cropBoxHeight]);

  const handleCrop = async () => {
    setIsProcessing(true);
    try {
      // Calculate scale from display to original image
      const scaleX = imageWidth / displayWidth;
      const scaleY = imageHeight / displayHeight;
      
      // Convert display coordinates to image coordinates
      const originX = Math.round(cropX * scaleX);
      const originY = Math.round(cropY * scaleY);
      const width = Math.round(cropBoxWidth * scaleX);
      const height = Math.round(cropBoxHeight * scaleY);
      
      // Ensure we don't exceed image bounds
      const safeOriginX = Math.max(0, Math.min(originX, imageWidth - width));
      const safeOriginY = Math.max(0, Math.min(originY, imageHeight - height));
      const safeWidth = Math.min(width, imageWidth - safeOriginX);
      const safeHeight = Math.min(height, imageHeight - safeOriginY);
      
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

        {/* Aspect Ratio Info */}
        <View style={styles.aspectInfo}>
          <Ionicons name="crop" size={16} color="#FFD700" />
          <Text style={styles.aspectText}>4:5 Aspect Ratio (Portrait)</Text>
        </View>

        {/* Crop Area */}
        <View style={styles.cropContainer}>
          <View style={[styles.imageContainer, { width: displayWidth, height: displayHeight }]}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: displayWidth, height: displayHeight }}
              resizeMode="contain"
            />
            
            {/* Dark overlay with crop box cutout */}
            <View style={[styles.overlay, { top: 0, left: 0, right: 0, height: cropY }]} />
            <View style={[styles.overlay, { top: cropY + cropBoxHeight, left: 0, right: 0, bottom: 0 }]} />
            <View style={[styles.overlay, { top: cropY, left: 0, width: cropX, height: cropBoxHeight }]} />
            <View style={[styles.overlay, { top: cropY, right: 0, width: displayWidth - cropX - cropBoxWidth, height: cropBoxHeight }]} />
            
            {/* Crop box */}
            <View 
              {...panResponder.panHandlers}
              style={[
                styles.cropBox, 
                { 
                  width: cropBoxWidth, 
                  height: cropBoxHeight,
                  left: cropX,
                  top: cropY,
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
              
              {/* Move icon */}
              <View style={styles.moveIcon}>
                <Ionicons name="move" size={24} color="rgba(255, 255, 255, 0.7)" />
              </View>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Ionicons name="finger-print" size={18} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.instructionText}>
            Drag the box to select crop area
          </Text>
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
                <Text style={styles.cropButtonText}>Apply Crop</Text>
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
    paddingBottom: 16,
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
    paddingVertical: 12,
    gap: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  aspectText: {
    fontSize: 14,
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
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'transparent',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  moveIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  instructionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
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
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
