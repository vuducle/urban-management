import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ViroARSceneNavigator } from '@reactvision/react-viro';

import { useARPlacement } from '../../hooks/use-ar-placement';
import { useARTracking } from '../../hooks/use-ar-tracking';
import { ARControls } from './ar/ARControls';
import { AROverlay } from './ar/AROverlay';
import { ModelScene } from './ar/ModelScene';

export default function ARModelView({
  onClose,
}: {
  onClose: () => void;
}) {
  const viewRef = useRef<View>(null);
  const cameraPositionRef = useRef<any>(null);
  const internalNavigatorRef = useRef<any>(null);

  const [showPlanes, setShowPlanes] = useState(true);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [isARReady, setIsARReady] = useState(false);

  // AR Tracking Hook
  const {
    isTracking,
    arError,
    planesDetected,
    detectedPlaneAnchors,
    onInitialized,
    handleARPlaneDetected,
  } = useARTracking({
    onARPlaneDetected: () => {},
  });

  // AR Placement Hook
  const {
    placedModels,
    selectedModel,
    setSelectedModel,
    handleAddObject,
    handleUndo,
  } = useARPlacement({
    isTracking,
    planesDetected,
    detectedPlaneAnchors,
    cameraPositionRef,
  });

  useEffect(() => {
    console.log(
      '🚀 ARModelView mounted at:',
      new Date().toISOString()
    );
    console.log('📱 Platform:', Platform.OS);

    // Request camera permissions
    requestCameraPermission();

    if (Platform.OS === 'android') {
      checkARCoreAvailability();
    }

    // Add delay to ensure camera is ready
    const arReadyTimer = setTimeout(() => {
      setIsARReady(true);
    }, 500);

    return () => {
      console.log(
        '🧹 Cleanup ARModelView at:',
        new Date().toISOString()
      );
      clearTimeout(arReadyTimer);
      setIsARReady(false);
      setShowPlanes(true);
      setIsLoadingModel(false);
      setIsCapturing(false);
      internalNavigatorRef.current = null;
      cameraPositionRef.current = null;
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');

      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'AR features require camera access. Please enable camera permissions in your settings.',
          [
            { text: 'Cancel', onPress: handleClose, style: 'cancel' },
            {
              text: 'Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasCameraPermission(false);
    }
  };

  const checkARCoreAvailability = async () => {
    try {
      console.log('Kiểm tra tính khả dụng của ARCore...');
    } catch (error) {
      console.error('ARCore check error:', error);
      Alert.alert(
        'AR không khả dụng',
        'Ứng dụng này yêu cầu Google ARCore. Bạn có muốn cài đặt nó không?',
        [
          { text: 'Cancel', onPress: handleClose, style: 'cancel' },
          {
            text: 'Install',
            onPress: () => {
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.google.ar.core'
              );
              handleClose();
            },
          },
        ]
      );
    }
  };

  const handleClose = () => {
    // Reset all state before closing
    setShowPlanes(true);
    setIsLoadingModel(false);
    setIsCapturing(false);
    internalNavigatorRef.current = null;
    cameraPositionRef.current = null;

    setTimeout(() => {
      onClose();
    }, 100);
  };

  const onRegisterNavigator = (navigator: any) => {
    internalNavigatorRef.current = navigator;
    console.log('✅ Internal Navigator registered:', !!navigator);
  };

  const onCameraTransformUpdate = (cameraTransform: any) => {
    cameraPositionRef.current = cameraTransform;
    if (Math.random() < 0.01) {
      console.log('📷 Camera update:', {
        position: cameraTransform?.position,
        forward: cameraTransform?.forward,
      });
    }
  };

  const takeScreenshot = async () => {
    setIsCapturing(true);

    try {
      let permissionResponse;
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        permissionResponse =
          await MediaLibrary.requestPermissionsAsync(false);
      } else {
        permissionResponse =
          await MediaLibrary.requestPermissionsAsync();
      }

      if (permissionResponse.status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'We need access to your photos to save screenshots.'
        );
        setIsCapturing(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      let uri = '';
      const navigatorRef = internalNavigatorRef.current;

      if (!navigatorRef) {
        throw new Error(
          'AR Scene not ready - please wait for AR to initialize'
        );
      }

      console.log('📸 Taking AR screenshot with Viro...');
      const result = await navigatorRef.takeScreenshot(
        'ar_capture',
        false
      );
      uri = result.url || result;

      if (!uri.startsWith('file://')) {
        uri = `file://${uri}`;
      }

      console.log('📸 Screenshot URI:', uri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync(
        'Urban Management AR'
      );
      if (album == null) {
        await MediaLibrary.createAlbumAsync(
          'Urban Management AR',
          asset,
          false
        );
      } else {
        await MediaLibrary.addAssetsToAlbumAsync(
          [asset],
          album,
          false
        );
      }

      Alert.alert('Saved', 'Photo saved to gallery');
    } catch (e: any) {
      console.error('Screenshot error:', e);
      Alert.alert('Error', e.message || 'Could not take photo');
    } finally {
      setIsCapturing(false);
    }
  };

  // Show loading screen while waiting for permissions and AR initialization
  if (hasCameraPermission === null || !isARReady) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.loadingText}>Đang khởi tạo AR...</Text>
        </View>
      </View>
    );
  }

  // Show error if camera permission denied
  if (hasCameraPermission === false) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Camera permission is required for AR features
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen} ref={viewRef} collapsable={false}>
      <ViroARSceneNavigator
        initialScene={{ scene: ModelScene }}
        viroAppProps={{
          onInitialized,
          placedModels,
          showPlanes,
          onARPlaneDetected: handleARPlaneDetected,
          onCameraTransformUpdate,
          updateModelTransform: () => {},
          setIsLoadingModel,
          onRegisterNavigator,
        }}
        style={StyleSheet.absoluteFill}
        worldAlignment="GravityAndHeading"
      />

      {/* AR UI Overlay */}
      <AROverlay
        arError={arError}
        isLoadingModel={isLoadingModel}
        isTracking={isTracking}
        showPlanes={showPlanes}
        placedModels={placedModels}
        isCapturing={isCapturing}
        onClose={handleClose}
        onTogglePlanes={() => setShowPlanes(!showPlanes)}
      />

      {/* Bottom Controls */}
      <ARControls
        placedModels={placedModels}
        isTracking={isTracking}
        selectedModel={selectedModel}
        isCapturing={isCapturing}
        onAddObject={handleAddObject}
        onUndo={handleUndo}
        onSelectModel={setSelectedModel}
        onTakeScreenshot={takeScreenshot}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
