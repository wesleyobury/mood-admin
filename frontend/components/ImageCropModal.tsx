import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImageCropTool } from 'expo-image-crop-tool';

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
  const cropToolRef = useRef<any>(null);

  const handleCrop = async (cropData: {
    originX: number;
    originY: number;
    width: number;
    height: number;
  }) => {
    setIsProcessing(true);
    try {
      // Apply the crop using expo-image-manipulator
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: Math.round(cropData.originX),
              originY: Math.round(cropData.originY),
              width: Math.round(cropData.width),
              height: Math.round(cropData.height),
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
          <Text style={styles.aspectText}>4:5 Aspect Ratio</Text>
        </View>

        {/* Crop Tool */}
        <View style={styles.cropContainer}>
          <ImageCropTool
            ref={cropToolRef}
            imageUri={imageUri}
            fixedAspectRatio={aspectRatio}
            onCrop={handleCrop}
            cropBoxStyle={{
              borderColor: '#FFD700',
              borderWidth: 2,
            }}
            overlayColor="rgba(0, 0, 0, 0.7)"
          />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Ionicons name="finger-print" size={18} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.instructionText}>
            Drag and pinch to adjust the crop area
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
            onPress={() => cropToolRef.current?.crop()}
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
    backgroundColor: '#000',
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
