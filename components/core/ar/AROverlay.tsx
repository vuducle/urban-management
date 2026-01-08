import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Error Container */}
      {arError && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={24} color="#FF9500" />
          <Text style={styles.errorText}>{arError}</Text>
        </View>
      )}

      {/* Loading Indicator */}
      {isLoadingModel && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.loadingText}>Đang tải mô hình...</Text>
        </View>
      )}

      {/* Top Bar with Header & Controls */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Mô hình 3D ({placedModels.length})
        </Text>
        <TouchableOpacity
          onPress={onTogglePlanes}
          style={styles.iconButton}
        >
          <Ionicons
            name={showPlanes ? 'eye' : 'eye-off'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Crosshair - center of screen */}
      <View style={styles.crosshairContainer} pointerEvents="none">
        <View style={styles.crosshairDot} />
        <View style={styles.crosshairRing} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  crosshairRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'white',
    opacity: 0.7,
  },
  loadingContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 12,
  },
  errorContainer: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.95)',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '80%',
    zIndex: 1000,
  },
  errorText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
