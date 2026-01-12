import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Text,
  View,
} from 'react-native';

import {
  ViroARSceneNavigator,
  ViroConstants,
} from '@reactvision/react-viro';

import { useARPlacement } from '../../hooks/use-ar-placement';
import { useARTracking } from '../../hooks/use-ar-tracking';
import { ARControls } from './ar/ARControls';
import { AROverlay } from './ar/AROverlay';
import { ModelScene } from './ar/ModelScene';
import { ObjectRotationControls } from './ar/ObjectRotationControls';
import { ObjectSelector } from './ar/ObjectSelector';
import { ARModelViewStyles } from '../styles';

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
  const [selectedObjectId, setSelectedObjectId] = useState<
    number | null
  >(null);

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
    updateModelRotation,
    updateModelScale,
    updateModelPosition,
    resetModelTransform,
    deleteModel,
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
          'Yêu cầu quyền truy cập camera',
          'Tính năng AR yêu cầu quyền truy cập camera. Vui lòng bật quyền truy cập camera trong cài đặt của bạn.',
          [
            { text: 'Hủy', onPress: handleClose, style: 'cancel' },
            {
              text: 'Cài đặt',
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
    setSelectedObjectId(null);
    internalNavigatorRef.current = null;
    cameraPositionRef.current = null;

    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleModelClick = (modelId: number) => {
    console.log('📌 Model selected for rotation:', modelId);
    setSelectedObjectId(
      selectedObjectId === modelId ? null : modelId
    );
  };

  const handleRotationChange = (
    modelId: number,
    axis: 'x' | 'y' | 'z',
    value: number
  ) => {
    updateModelRotation(modelId, axis, value);
  };

  const handleScaleChange = (modelId: number, value: number) => {
    updateModelScale(modelId, value);
  };

  const handlePositionChange = (
    modelId: number,
    axis: 'x' | 'y' | 'z',
    delta: number
  ) => {
    updateModelPosition(modelId, axis, delta);
  };

  const handleResetTransform = (modelId: number) => {
    resetModelTransform(modelId);
  };

  const handleDeleteModel = (modelId: number) => {
    Alert.alert(
      'Xóa đối tượng',
      'Bạn có chắc chắn muốn xóa đối tượng này?',
      [
        { text: 'Hủy', onPress: () => {}, style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => {
            deleteModel(modelId);
            setSelectedObjectId(null);
          },
          style: 'destructive',
        },
      ]
    );
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
          'Quyền bị từ chối',
          'Chúng tôi cần quyền truy cập vào ảnh của bạn để lưu ảnh chụp màn hình.'
        );
        setIsCapturing(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // --- Android Strategy: Native Device Screenshot ---
      // Screenshot feature is in development for AR mode on Android.
      // Users should use device native screenshot: Volume Down + Power Button
      if (Platform.OS === 'android') {
        console.log('📸 Android screenshot - showing user guide...');
        Alert.alert(
          '📸 Hướng dẫn chụp ảnh màn hình',
          'Tính năng chụp ảnh màn hình AR hiện đang trong quá trình phát triển.\n\n' +
            'Để chụp ảnh màn hình có nội dung AR:\n\n' +
            '1. Nhấn và giữ nút Giảm âm lượng + Nút Nguồn cùng lúc\n' +
            '2. Hoặc sử dụng cài đặt nhanh của thiết bị để chụp ảnh màn hình\n\n' +
            'Ảnh chụp màn hình của bạn sẽ được lưu vào thư viện ảnh của thiết bị.',
          [
            {
              text: 'OK',
              onPress: () => setIsCapturing(false),
              style: 'default',
            },
          ]
        );
        return;
      }

      // --- iOS / Standard Viro Path ---
      let uri = '';
      const navigatorRef = internalNavigatorRef.current;

      if (!navigatorRef) {
        throw new Error(
          'Cảnh AR chưa sẵn sàng - vui lòng đợi AR khởi tạo hoàn tất'
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
        let errorMessage = 'Lỗi chụp ảnh màn hình không xác định';
        const code =
          screenshotError?.code !== undefined
            ? screenshotError.code
            : screenshotError;

        // Map Viro error codes based on docs
        switch (code) {
          case ViroConstants.RECORD_ERROR_NO_PERMISSION:
            errorMessage = 'Không có quyền lưu ảnh chụp màn hình';
            break;
          case ViroConstants.RECORD_ERROR_INITIALIZATION:
            errorMessage =
              'Lỗi khởi tạo trong quá trình chụp ảnh màn hình';
            break;
          case ViroConstants.RECORD_ERROR_WRITE_TO_FILE:
            errorMessage = 'Không thể ghi ảnh chụp màn hình vào tệp';
            break;
          case ViroConstants.RECORD_ERROR_ALREADY_RUNNING:
            errorMessage =
              'Ảnh chụp màn hình/Quay phim đang được thực hiện';
            break;
          case ViroConstants.RECORD_ERROR_UNKNOWN:
            errorMessage = 'Lỗi quay phim Viro không xác định';
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

      Alert.alert(
        'Đã lưu',
        'Ảnh đã được lưu vào thư viện ảnh của bạn.'
      );
    } catch (e: any) {
      console.error('Screenshot error:', e);
      Alert.alert('Lỗi', e.message || 'Không thể chụp ảnh màn hình');
    } finally {
      setIsCapturing(false);
    }
  };

  // Show loading screen while waiting for permissions and AR initialization
  if (hasCameraPermission === null || !isARReady) {
    return (
      <View style={ARModelViewStyles.fullScreen}>
        <View style={ARModelViewStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={ARModelViewStyles.loadingText}>
            Đang khởi tạo AR...
          </Text>
        </View>
      </View>
    );
  }

  // Show error if camera permission denied
  if (!hasCameraPermission) {
    return (
      <View style={ARModelViewStyles.fullScreen}>
        <View style={ARModelViewStyles.errorContainer}>
          <Text style={ARModelViewStyles.errorText}>
            Yêu cầu quyền truy cập camera để sử dụng tính năng AR
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={ARModelViewStyles.fullScreen}
      ref={viewRef}
      collapsable={false}
    >
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
          onModelClick: handleModelClick,
        }}
        style={ARModelViewStyles.absoluteFill}
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

      {/* Object Selector - List view for easy selection */}
      <ObjectSelector
        placedModels={placedModels}
        selectedObjectId={selectedObjectId}
        onSelectObject={setSelectedObjectId}
      />

      {/* Object Rotation Controls */}
      {selectedObjectId !== null && (
        <ObjectRotationControls
          selectedObject={
            placedModels.find((m) => m.id === selectedObjectId) ||
            null
          }
          onRotationChange={handleRotationChange}
          onScaleChange={handleScaleChange}
          onPositionChange={handlePositionChange}
          onReset={handleResetTransform}
          onDelete={handleDeleteModel}
          onClose={() => setSelectedObjectId(null)}
        />
      )}

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
