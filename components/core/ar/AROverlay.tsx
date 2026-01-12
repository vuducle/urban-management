import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AROverlayStyles } from '../../../assets/styles';

interface AROverlayProps {
  arError: string | null;
  isLoadingModel: boolean;
  isTracking: boolean;
  showPlanes: boolean;
  placedModels: any[];
  isCapturing: boolean;
  onClose: () => void;
  onTogglePlanes: () => void;
}

export const AROverlay = ({
  arError,
  isLoadingModel,
  isTracking,
  showPlanes,
  placedModels,
  isCapturing,
  onClose,
  onTogglePlanes,
}: AROverlayProps) => {
  if (isCapturing) return null;

  return (
    <View style={AROverlayStyles.overlay} pointerEvents="box-none">
      {/* Error Container */}
      {arError && (
        <View style={AROverlayStyles.errorContainer}>
          <Ionicons name="warning" size={24} color="#FF9500" />
          <Text style={AROverlayStyles.errorText}>{arError}</Text>
        </View>
      )}

      {/* Loading Indicator */}
      {isLoadingModel && (
        <View style={AROverlayStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={AROverlayStyles.loadingText}>
            Đang tải mô hình...
          </Text>
        </View>
      )}

      {/* Top Bar with Header & Controls */}
      <View style={AROverlayStyles.topBar}>
        <TouchableOpacity
          onPress={onClose}
          style={AROverlayStyles.iconButton}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={AROverlayStyles.headerTitle}>
          Mô hình 3D ({placedModels.length})
        </Text>
        <TouchableOpacity
          onPress={onTogglePlanes}
          style={AROverlayStyles.iconButton}
        >
          <Ionicons
            name={showPlanes ? 'eye' : 'eye-off'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Crosshair - center of screen */}
      <View
        style={AROverlayStyles.crosshairContainer}
        pointerEvents="none"
      >
        <View style={AROverlayStyles.crosshairDot} />
        <View style={AROverlayStyles.crosshairRing} />
      </View>
    </View>
  );
};
