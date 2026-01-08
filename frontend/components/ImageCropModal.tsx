import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  const [currentScale, setCurrentScale] = useState(1);
  
  // Crop box is FULL WIDTH of the screen with padding
  const cropBoxWidth = SCREEN_WIDTH - 32; // 16px padding on each side
  const cropBoxHeight = cropBoxWidth / aspectRatio;
  
  // Calculate initial image size to FILL the crop box (cover, not contain)
  const imageAspect = imageWidth / imageHeight;
  const cropAspect = aspectRatio;
  
  let baseImageWidth: number;
  let baseImageHeight: number;
  
  // Image should fill the crop box completely (cover mode)
  if (imageAspect > cropAspect) {
    // Image is wider - fit height, overflow width
    baseImageHeight = cropBoxHeight;
    baseImageWidth = cropBoxHeight * imageAspect;
  } else {
    // Image is taller - fit width, overflow height
    baseImageWidth = cropBoxWidth;
    baseImageHeight = cropBoxWidth / imageAspect;
  }
  
  // Animated values
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  // Tracking refs
  const panOffset = useRef({ x: 0, y: 0 });
  const scaleValue = useRef(1);
  const lastDistance = useRef(0);
  const isZooming = useRef(false);
  
  // Listen to scale changes
  useEffect(() => {
    const id = scale.addListener(({ value }) => {
      scaleValue.current = value;
      setCurrentScale(value);
    });
    return () => scale.removeListener(id);
  }, []);
  
  // Reset when modal opens
  useEffect(() => {
    if (visible) {
      pan.setValue({ x: 0, y: 0 });
      scale.setValue(1);
      panOffset.current = { x: 0, y: 0 };
      scaleValue.current = 1;
      setCurrentScale(1);
    }
  }, [visible]);
  
  // Calculate bounds for panning
  const getBounds = (currentScaleVal: number) => {
    const scaledWidth = baseImageWidth * currentScaleVal;
    const scaledHeight = baseImageHeight * currentScaleVal;
    
    // How much the image extends beyond the crop box
    const overflowX = Math.max(0, (scaledWidth - cropBoxWidth) / 2);
    const overflowY = Math.max(0, (scaledHeight - cropBoxHeight) / 2);
    
    return { overflowX, overflowY };
  };
  
  // Clamp position to bounds
  const clampPosition = (x: number, y: number, currentScaleVal: number) => {
    const { overflowX, overflowY } = getBounds(currentScaleVal);
    return {
      x: Math.max(-overflowX, Math.min(overflowX, x)),
      y: Math.max(-overflowY, Math.min(overflowY, y)),
    };
  };
  
  // Get distance between two touch points
  const getDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    
    onPanResponderGrant: (evt) => {
      const touches = evt.nativeEvent.touches;
      isZooming.current = touches.length >= 2;
      
      if (isZooming.current) {
        lastDistance.current = getDistance(touches);
      }
      
      // Store current position
      panOffset.current = {
        x: pan.x._value,
        y: pan.y._value,
      };
    },
    
    onPanResponderMove: (evt, gestureState) => {
      const touches = evt.nativeEvent.touches;
      
      if (touches.length >= 2) {
        // Pinch to zoom
        isZooming.current = true;
        const distance = getDistance(touches);
        
        if (lastDistance.current > 0) {
          const scaleDelta = distance / lastDistance.current;
          const newScale = Math.max(1, Math.min(4, scaleValue.current * scaleDelta));
          scale.setValue(newScale);
          lastDistance.current = distance;
          
          // Adjust pan to keep image in bounds when zooming
          const clamped = clampPosition(panOffset.current.x, panOffset.current.y, newScale);
          pan.setValue(clamped);
          panOffset.current = clamped;
        }
      } else if (!isZooming.current) {
        // Single finger drag - always enabled
        const newX = panOffset.current.x + gestureState.dx;
        const newY = panOffset.current.y + gestureState.dy;
        
        // Clamp to bounds
        const clamped = clampPosition(newX, newY, scaleValue.current);
        pan.setValue(clamped);
      }
    },
    
    onPanResponderRelease: () => {
      isZooming.current = false;
      lastDistance.current = 0;
      
      // Save final position
      panOffset.current = {
        x: pan.x._value,
        y: pan.y._value,
      };
      
      // Snap back to bounds if needed
      const clamped = clampPosition(panOffset.current.x, panOffset.current.y, scaleValue.current);
      
      if (clamped.x !== panOffset.current.x || clamped.y !== panOffset.current.y) {
        Animated.spring(pan, {
          toValue: clamped,
          useNativeDriver: false,
          friction: 7,
        }).start(() => {
          panOffset.current = clamped;
        });
      }
    },
  }), [baseImageWidth, baseImageHeight, cropBoxWidth, cropBoxHeight]);

  const handleCrop = async () => {
    setIsProcessing(true);
    try {
      const currentPanX = pan.x._value;
      const currentPanY = pan.y._value;
      const currentScaleVal = scaleValue.current;
      
      // Calculate what portion of the original image is visible in the crop box
      const scaledImageWidth = baseImageWidth * currentScaleVal;
      const scaledImageHeight = baseImageHeight * currentScaleVal;
      
      // The crop box center relative to the image center (accounting for pan)
      // Pan moves the image, so negative pan means we see more of the right/bottom
      const visibleCenterX = (scaledImageWidth / 2) - currentPanX;
      const visibleCenterY = (scaledImageHeight / 2) - currentPanY;
      
      // Convert to original image coordinates
      const scaleFromBase = imageWidth / baseImageWidth;
      const scaleFromScaled = scaleFromBase / currentScaleVal;
      
      // Crop dimensions in original image pixels
      const cropW = cropBoxWidth * scaleFromScaled;
      const cropH = cropBoxHeight * scaleFromScaled;
      
      // Crop origin in original image pixels
      const originX = (visibleCenterX - cropBoxWidth / 2) * scaleFromScaled;
      const originY = (visibleCenterY - cropBoxHeight / 2) * scaleFromScaled;
      
      // Clamp to image bounds
      const safeX = Math.max(0, Math.min(Math.round(originX), imageWidth - cropW));
      const safeY = Math.max(0, Math.min(Math.round(originY), imageHeight - cropH));
      const safeW = Math.round(Math.min(cropW, imageWidth - safeX));
      const safeH = Math.round(Math.min(cropH, imageHeight - safeY));
      
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [{
          crop: {
            originX: safeX,
            originY: safeY,
            width: Math.max(1, safeW),
            height: Math.max(1, safeH),
          },
        }],
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

  // Current displayed image size
  const displayWidth = baseImageWidth * currentScale;
  const displayHeight = baseImageHeight * currentScale;

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
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adjust</Text>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleCrop}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFD700" />
            ) : (
              <Text style={styles.doneText}>Done</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Main crop area */}
        <View style={styles.cropAreaContainer}>
          {/* Image container with gestures */}
          <View 
            style={[styles.cropArea, { width: cropBoxWidth, height: cropBoxHeight }]}
            {...panResponder.panHandlers}
          >
            <Animated.Image
              source={{ uri: imageUri }}
              style={{
                width: displayWidth,
                height: displayHeight,
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                ],
              }}
              resizeMode="cover"
            />
            
            {/* Grid overlay */}
            <View style={styles.gridOverlay} pointerEvents="none">
              <View style={[styles.gridLine, styles.gridH1]} />
              <View style={[styles.gridLine, styles.gridH2]} />
              <View style={[styles.gridLine, styles.gridV1]} />
              <View style={[styles.gridLine, styles.gridV2]} />
            </View>
            
            {/* Border */}
            <View style={styles.cropBorder} pointerEvents="none" />
          </View>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <View style={styles.zoomIndicator}>
            <Ionicons name="search" size={16} color="#FFD700" />
            <Text style={styles.zoomText}>{currentScale.toFixed(1)}x</Text>
          </View>
          
          <View style={styles.hint}>
            <Text style={styles.hintText}>Drag to reposition • Pinch to zoom</Text>
          </View>
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
    paddingHorizontal: 8,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerButton: {
    width: 60,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  doneText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFD700',
  },
  cropAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  cropArea: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  gridH1: {
    left: 0,
    right: 0,
    top: '33.33%',
    height: 0.5,
  },
  gridH2: {
    left: 0,
    right: 0,
    top: '66.66%',
    height: 0.5,
  },
  gridV1: {
    top: 0,
    bottom: 0,
    left: '33.33%',
    width: 0.5,
  },
  gridV2: {
    top: 0,
    bottom: 0,
    left: '66.66%',
    width: 0.5,
  },
  cropBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  zoomIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  zoomText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  hint: {
    opacity: 0.5,
  },
  hintText: {
    fontSize: 13,
    color: '#fff',
  },
});
