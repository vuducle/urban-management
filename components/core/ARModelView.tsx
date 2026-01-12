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

import {
  ViroARSceneNavigator,
  ViroConstants,
} from '@reactvision/react-viro';
// Native Module for System Capture (Android 14+ Fix)
import MyArScreenshot from '../../modules/my-ar-screenshot';

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

      // --- Android Strategy: Native AR Screenshot (ARCore) ---
      // We prioritize ARCore Frame Capture (Background + AR) to bypass SurfaceView/DRM issues.
      // Fallback to System Recording (MediaProjection) if ARCore fails.
      if (
        Platform.OS === 'android' &&
        MyArScreenshot &&
        MyArScreenshot.requestScreenCapture
      ) {
        console.log('📸 Using Native AR Module for Android...');

        try {
          // Attempt 1: Direct ARCore Frame Capture
          // This must be available in the native module
          if (MyArScreenshot.captureARCore) {
            console.log('🤖 Attempting ARCore direct capture...');
            const arUri = await MyArScreenshot.captureARCore();
            console.log('✅ ARCore Capture Success:', arUri);

            if (arUri) {
              const asset = await MediaLibrary.createAssetAsync(
                arUri
              );
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
              Alert.alert('✅ Saved', 'Snapshot saved to Gallery!');
              setIsCapturing(false);
              return;
            }
          }
        } catch (arErr) {
          console.warn(
            '⚠️ ARCore capture failed, falling back to System Recorder:',
            arErr
          );
        }

        // 1. Reset state (Fallback)
        if (MyArScreenshot.reset) {
          await MyArScreenshot.reset();
        }

        // 2. Alert User (Required flow for MediaProjection)
        Alert.alert(
          'Capture Screenshot',
          'Standard screenshot failed. Using System Recorder fallback. Please tap "Start" when prompted.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setIsCapturing(false),
            },
            {
              text: 'Start',
              onPress: async () => {
                try {
                  // Wait for alert to dismiss visually
                  await new Promise((r) => setTimeout(r, 300));

                  // 3. Request System Capture
                  const uri =
                    await MyArScreenshot.requestScreenCapture();
                  console.log('✅ Android System Capture URI:', uri);

                  if (uri) {
                    const asset = await MediaLibrary.createAssetAsync(
                      uri
                    );
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
                    Alert.alert('✅ Saved', 'Full screen captured!');
                  } else {
                    throw new Error(
                      'No image returned from system capture'
                    );
                  }
                } catch (sysErr) {
                  console.error('System Capture Error:', sysErr);
                  Alert.alert('Capture Failed', String(sysErr));
                } finally {
                  setIsCapturing(false);
                }
              },
            },
          ]
        );
        return; // Exit here, async flow handles the rest
      }

      // --- iOS / Standard Viro Path ---
      let uri = '';
      const navigatorRef = internalNavigatorRef.current;

      if (!navigatorRef) {
        throw new Error(
          'AR Scene not ready - please wait for AR to initialize'
        );
      }

      console.log('📸 Taking AR screenshot with Viro...');
      try {
        const result = await navigatorRef.takeScreenshot(
          'ar_capture',
          true
        );
        uri = result.url || result;

        // ViroConstants.RECORD_ERROR_NONE is -1, so 0 or greater usually implies some warning/state if returned in error callback
        if (result.errorCode && result.errorCode !== -1) {
          console.warn(
            'Viro Screenshot warning code:',
            result.errorCode
          );
        }
      } catch (screenshotError: any) {
        let errorMessage = 'Unknown screenshot error';
        const code =
          screenshotError?.code !== undefined
            ? screenshotError.code
            : screenshotError;

        // Map Viro error codes based on docs
        switch (code) {
          case ViroConstants.RECORD_ERROR_NO_PERMISSION:
            errorMessage = 'No permission to save screenshot';
            break;
          case ViroConstants.RECORD_ERROR_INITIALIZATION:
            errorMessage = 'Initialization error during screenshot';
            break;
          case ViroConstants.RECORD_ERROR_WRITE_TO_FILE:
            errorMessage = 'Failed to write screenshot to file';
            break;
          case ViroConstants.RECORD_ERROR_ALREADY_RUNNING:
            errorMessage = 'Screenshot/Recording already in progress';
            break;
          case ViroConstants.RECORD_ERROR_UNKNOWN:
            errorMessage = 'Unknown Viro recording error';
            break;
          default:
            errorMessage = `Screenshot failed with code: ${code}`;
        }
        console.error(
          `Viro TakeScreenshot Failed: ${errorMessage}`,
          screenshotError
        );
        throw new Error(errorMessage);
      }

      if (!uri) throw new Error('No URI returned');

      if (
        !uri.startsWith('file://') &&
        !uri.startsWith('content://')
      ) {
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
