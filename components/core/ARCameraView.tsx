import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Import ViroReact
import { ViroARSceneNavigator } from '@reactvision/react-viro';

// Import components and hooks
import { captureRef } from 'react-native-view-shot';
import { useARScreenshotDebug } from '../../hooks/use-ar-screenshot-debug';
import { useARTracking } from '../../hooks/use-ar-tracking';
import { useMeasurement } from '../../hooks/use-measurement';
import ErrorBoundary from '../ErrorBoundary';
import ARModelView from './ARModelView';
import { MeasurementControls } from './ar/MeasurementControls';
import { MeasurementScene } from './ar/MeasurementScene';
import { MeasurementTopBar } from './ar/MeasurementTopBar';

export default function ARCameraView({
  onClose,
}: {
  onClose: () => void;
}) {
  const viewRef = useRef<View>(null);
  const cameraPositionRef = useRef<any>(null);

  // State management
  const [mode, setMode] = useState<'measure' | 'model'>('measure');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [isARReady, setIsARReady] = useState(false);

  // Use custom hooks
  const { points, distance, addPoint, resetMeasurement } =
    useMeasurement();
  const {
    isTracking,
    arError,
    onInitialized,
    handleARPlaneDetected: _handleARPlaneDetected,
  } = useARTracking({
    onARPlaneDetected: () => {},
  });
  const { logCaptureMethods } = useARScreenshotDebug();
  const viroNavigatorRef = useRef<any>(null);
  const backgroundCameraRef = useRef<CameraView>(null);
  const uiRef = useRef<View>(null);
  const hiddenCompositionRef = useRef<View>(null);
  const [compositionImages, setCompositionImages] = useState<{
    bg: string;
    fg: string;
    ar?: string | null;
  } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Initialize camera and AR
  useEffect(() => {
    console.log('🚀 ARCameraView mounted');
    logCaptureMethods();
    requestCameraPermission();

    if (Platform.OS === 'android') {
      console.log('📱 Checking ARCore availability...');
    }

    const arReadyTimer = setTimeout(() => setIsARReady(true), 500);

    return () => {
      clearTimeout(arReadyTimer);
      setIsARReady(false);
      resetMeasurement();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');

      if (status !== 'granted') {
        Alert.alert(
          'Yêu cầu quyền truy cập camera',
          'Tính năng AR yêu cầu quyền truy cập camera.',
          [
            {
              text: 'Hủy',
              onPress: () => onClose(),
              style: 'cancel',
            },
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

  // Handle mode transitions
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [mode]);

  const onCameraTransformUpdate = (cameraTransform: any) => {
    cameraPositionRef.current = cameraTransform;
  };

  const handleAddPoint = () => {
    if (!cameraPositionRef.current) {
      Alert.alert(
        'Chưa sẵn sàng',
        'Vui lòng đợi AR theo dõi khởi tạo'
      );
      return;
    }

    try {
      const { position, forward } = cameraPositionRef.current;
      const hitPosition = [
        position[0] + forward[0] * 0.5,
        position[1] + forward[1] * 0.5,
        position[2] + forward[2] * 0.5,
      ];
      addPoint(hitPosition);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * Captures a screenshot of the AR scene.
   *
   * On Android: Notifies user to use device native screenshot (Volume Down + Power Button)
   * On iOS: Uses react-native-view-shot for UI capture
   */
  const saveScreenshot = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền bị từ chối',
          'Chúng tôi cần quyền truy cập vào ảnh của bạn để lưu ảnh chụp màn hình.'
        );
        return;
      }

      // --- Android Strategy: Device Native Screenshot ---
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

      // --- iOS / Standard Path ---
      if (Platform.OS === 'ios') {
        if (viewRef.current) {
          const uri = await captureRef(viewRef.current, {
            format: 'png',
            quality: 1,
            result: 'tmpfile',
          });
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync(
            'AR Measurements',
            asset,
            false
          );
          Alert.alert('✅ Success', 'Screenshot saved!');
        }
        return;
      }
    } catch (e) {
      console.error('Screenshot operation failed:', e);
      Alert.alert(
        'Error',
        'An unexpected error occurred during capture.'
      );
      setIsCapturing(false);
      setShowCamera(false);
    }
  };

  // Loading during transition
  if (isTransitioning) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang chuyển chế độ...</Text>
      </View>
    );
  }

  // Loading during initialization
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

  // Permission error
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

  // Model mode
  if (mode === 'model') {
    return (
      <ErrorBoundary
        onError={(error) => {
          console.error('🚨 ARModelView CRASHED:', error.message);
          Alert.alert('Model Mode Error', error.message);
          setTimeout(() => setMode('measure'), 100);
        }}
      >
        <ARModelView onClose={() => setMode('measure')} />
      </ErrorBoundary>
    );
  }

  // Measurement mode
  return (
    <View style={styles.fullScreen} ref={viewRef} collapsable={false}>
      {showCamera && (
        <CameraView
          ref={backgroundCameraRef}
          style={[StyleSheet.absoluteFill, { zIndex: 1000 }]} // Bring to front when creating
          facing="back"
        />
      )}
      <ViroARSceneNavigator
        ref={viroNavigatorRef}
        allowScreenCapture={true}
        secureTextEntry={false}
        initialScene={{ scene: MeasurementScene }}
        renderingMode="Texture"
        videoType="Texture"
        worldAlignment="GravityAndHeading"
        viroAppProps={{
          points,
          distance,
          onInitialized,
          onCameraTransformUpdate,
          mode,
        }}
        style={StyleSheet.absoluteFill}
      />

      <View
        ref={uiRef}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
        collapsable={false}
      >
        {/* Top Bar with Mode Toggle and Controls */}
        <View style={styles.topContainer} pointerEvents="auto">
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'measure' && styles.modeButtonActive,
              ]}
              onPress={() => {
                setMode('measure');
                resetMeasurement();
              }}
            >
              <Text style={styles.modeButtonText}>Đo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'model' && styles.modeButtonActive,
              ]}
              onPress={() => setMode('model')}
            >
              <Text style={styles.modeButtonText}>Mô hình</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetMeasurement}
          >
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Distance Display */}
        {points.length === 2 && (
          <MeasurementTopBar
            mode={mode}
            points={points}
            distance={distance}
            onClose={onClose}
            onReset={resetMeasurement}
          />
        )}

        {/* Crosshair */}
        {isTracking && (
          <View style={styles.centerCrosshair} pointerEvents="none">
            <View style={styles.crosshairDot} />
            <View style={styles.crosshairRingOuter}>
              <View style={styles.crosshairRingInner} />
            </View>
          </View>
        )}

        {/* Bottom Controls */}
        <MeasurementControls
          isTracking={isTracking}
          pointsCount={points.length}
          onAddPoint={handleAddPoint}
          onSwitchMode={() => setMode('model')}
          onSaveScreenshot={() => {
            if (isTracking) {
              setTimeout(() => {
                saveScreenshot();
              }, 500);
            } else {
              Alert.alert('Wait', 'AR is still calibrating...');
            }
          }}
        />

        {/* Error Banner */}
        {arError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{arError}</Text>
          </View>
        )}
      </View>

      {/* Composition View */}
      {compositionImages && (
        <View
          ref={hiddenCompositionRef}
          style={[
            StyleSheet.absoluteFill,
            { zIndex: 9999, backgroundColor: 'black' },
          ]}
          collapsable={false}
        >
          {/* 1. Base Layer: Real World OR Native AR (if Real World missing) */}
          <Image
            source={{ uri: compositionImages.bg }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />

          {/* 2. AR Overlay Layer */}
          {/* If we have BOTH real world (bg) and AR (ar), we overlay AR with opacity */}
          {compositionImages.bg !== compositionImages.ar &&
            compositionImages.ar && (
              <Image
                source={{ uri: compositionImages.ar }}
                style={[StyleSheet.absoluteFill, { opacity: 0.8 }]}
                contentFit="cover"
              />
            )}

          {/* 3. UI Layer (Top) */}
          <Image
            source={{ uri: compositionImages.fg }}
            style={StyleSheet.absoluteFill}
            contentFit="contain" // Contain ensures entire UI fits; assuming aspect ratio matches
          />
        </View>
      )}
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
  loadingText: { color: 'white', marginTop: 16, fontSize: 16 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: { color: 'white', fontSize: 16, textAlign: 'center' },
  errorBanner: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.95)',
    padding: 15,
    borderRadius: 12,
    maxWidth: '80%',
    zIndex: 1000,
  },
  topContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 200,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    minWidth: 80,
  },
  modeButtonActive: { backgroundColor: 'white' },
  modeButtonText: { color: '#333', fontWeight: '600', fontSize: 14 },
  centerCrosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    position: 'absolute',
  },
  crosshairRingOuter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairRingInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
