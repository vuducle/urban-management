import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';

// Import ViroReact
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroNode,
  ViroPolyline,
  ViroSphere,
  ViroText,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';
import ErrorBoundary from '../ErrorBoundary';
import ARModelView from './ARModelView';

// --- AR SCENE COMPONENT ---
const MeasurementScene = (props: any) => {
  const {
    points,
    distance,
    onInitialized,
    onCameraTransformUpdate,
    mode,
    modelPosition,
  } = props.sceneNavigator.viroAppProps;

  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      onCameraTransformUpdate={onCameraTransformUpdate}
    >
      {/* Measurement mode */}
      {mode === 'measure' && (
        <ViroNode>
          {points.map((point: any) => (
            <ViroSphere
              key={point.id}
              position={point.position}
              radius={0.015} // Slightly smaller for elegance
              widthSegmentCount={20}
              heightSegmentCount={20}
            />
          ))}

          {/* Render line between two points */}
          {points.length === 2 && (
            <>
              <ViroPolyline
                points={[points[0].position, points[1].position]}
                thickness={0.005}
              />
              {/* Distance label in 3D space */}
              <ViroText
                text={formatDistanceHelper(distance)}
                position={[
                  (points[0].position[0] + points[1].position[0]) / 2,
                  (points[0].position[1] + points[1].position[1]) /
                    2 +
                    0.05,
                  (points[0].position[2] + points[1].position[2]) / 2,
                ]}
                scale={[0.1, 0.1, 0.1]}
                style={styles.textStyle}
              />
            </>
          )}
        </ViroNode>
      )}
    </ViroARScene>
  );
};

// --- HELPER FUNCTION TO FORMAT DISTANCE ---
const formatDistanceHelper = (meters: number): string => {
  if (meters < 1) return `${(meters * 100).toFixed(0)} cm`;
  return `${meters.toFixed(2)} m`;
};

// --- MAIN AR CAMERA VIEW COMPONENT ---
export default function ARCameraView({
  onClose,
}: {
  onClose: () => void;
}) {
  const viewRef = useRef<View>(null);
  const arSceneRef = useRef<any>(null);
  const cameraPositionRef = useRef<any>(null);

  // Measurement state
  const [points, setPoints] = useState<any[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [isTracking, setIsTracking] = useState(false);
  const [mode, setMode] = useState<'measure' | 'model'>('measure');
  const [arError, setArError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Check for Android ARCore
    if (Platform.OS === 'android') {
      console.log('Android AR Camera: Checking ARCore...');
      console.log('📱 Device Info:', {
        platform: Platform.OS,
        version: Platform.Version,
      });
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 ARCameraView unmounting');
    };
  }, []);

  // Handle mode transitions with proper AR session cleanup
  useEffect(() => {
    console.log('🔄 Mode transition triggered:', mode);

    // Always transition to ensure proper AR session cleanup
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      if (mode === 'model') {
        console.log('✅ Switching to Model Mode complete');
      } else {
        console.log('✅ Switching to Measure Mode complete');
      }
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [mode]);

  // Track mode changes
  useEffect(() => {
    console.log('🔀 Mode changed to:', mode);
  }, [mode]);

  // --- HIER WAR DER SYNTAX FEHLER KORRIGIERT ---
  const onInitialized = (state: any, reason: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] AR Tracking State:`, {
      state,
      reason,
      mode,
      stateNames:
        {
          1: 'TRACKING_UNAVAILABLE',
          2: 'TRACKING_LIMITED',
          3: 'TRACKING_NORMAL',
        }[state] || 'UNKNOWN',
    });

    try {
      if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
        console.log('✅ AR Tracking Normal');
        if (!isTracking) {
          setIsTracking(true);
        }
        if (arError) {
          setArError(null);
        }
      } else if (
        state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE
      ) {
        console.warn('⚠️ AR Tracking Unavailable - Reason:', reason);
        console.warn('Current Mode:', mode);

        if (isTracking) {
          setIsTracking(false);
        }

        // On Android, check if ARCore is the issue - but don't spam
        if (Platform.OS === 'android' && !arError) {
          console.warn(
            '🟡 ARCore might not be installed - this is NORMAL on first start'
          );
          console.log(
            '📌 To fix: Install "Google Play Services for AR" from Play Store'
          );
          setArError(
            'Tính năng AR không khả dụng. Vui lòng di chuyển thiết bị của bạn hoặc cài đặt ARCore..'
          );
        }
      } else if (
        state === ViroTrackingStateConstants.TRACKING_LIMITED
      ) {
        console.log('⚠️ AR Tracking Limited');
        if (!isTracking) {
          setIsTracking(true);
        }
        if (!arError) {
          setArError(
            'Theo dõi bị giới hạn. Vui lòng cung cấp nhiều ánh sáng hơn hoặc di chuyển thiết bị.'
          );
        }
      }
    } catch (error) {
      console.error('❌ CRITICAL ERROR in onInitialized:', error);
      console.error('Stack:', error.stack);
    }
  };
  // ---------------------------------------------

  // Track camera position and forward direction
  const onCameraTransformUpdate = (cameraTransform: any) => {
    cameraPositionRef.current = cameraTransform;
  };

  const calculateDistance = (p1: number[], p2: number[]) => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dz = p2[2] - p1[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  // Place point at center
  const addPointAtCenter = () => {
    if (!cameraPositionRef.current) {
      Alert.alert('Not Ready', 'Wait for AR tracking to initialize');
      return;
    }

    try {
      const camTransform = cameraPositionRef.current;
      const camPos = camTransform.position;
      const camForward = camTransform.forward;

      // Place point 0.5 meters in front of camera
      const dist = 0.5;
      const hitPosition = [
        camPos[0] + camForward[0] * dist,
        camPos[1] + camForward[1] * dist,
        camPos[2] + camForward[2] * dist,
      ];

      setPoints((curr) => {
        if (curr.length >= 2) {
          // Reset if we already have 2 points and click again
          return [{ position: hitPosition, id: Math.random() }];
        }

        const newPts = [
          ...curr,
          { position: hitPosition, id: Math.random() },
        ];

        if (newPts.length === 2) {
          const calculatedDist = calculateDistance(
            newPts[0].position,
            newPts[1].position
          );
          setDistance(calculatedDist);
        }

        return newPts;
      });
    } catch (error) {
      console.log('❌ Error placing point:', error);
    }
  };

  const resetMeasurement = () => {
    setPoints([]);
    setDistance(0);
  };

  const takeScreenshot = async () => {
    if (!viewRef.current) return;
    try {
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 1,
      });
      if (await Sharing.isAvailableAsync())
        await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert('Error', 'Screenshot failed');
    }
  };

  // Show loading screen during AR session transition
  if (isTransitioning) {
    return (
      <View
        style={[
          styles.fullScreen,
          {
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text
          style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}
        >
          Đang chuyển chế độ...
        </Text>
        <Text style={{ color: '#888', fontSize: 14, marginTop: 10 }}>
          Vui lòng đợi
        </Text>
      </View>
    );
  }

  // Handle model mode - show ARModelView as full screen instead of dummy
  if (mode === 'model') {
    console.log(
      '🔄 Rendering Model Mode at:',
      new Date().toISOString()
    );
    console.log('📊 Current State:', {
      isTracking,
      arError,
      points: points.length,
    });

    return (
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('🚨 ARModelView CRASHED:');
          console.error('Error:', error.message);
          console.error('Stack:', error.stack);
          console.error('Component Stack:', errorInfo.componentStack);
          // Return to measure mode on crash
          Alert.alert(
            'Lỗi chế độ Model',
            `Không thể khởi động chế độ Model:\n${error.message}\n\nQuay về chế độ đo đạc...`,
            [{ text: 'Đồng ý' }]
          );
          setTimeout(() => setMode('measure'), 100);
        }}
      >
        <ARModelView
          onClose={() => {
            console.log(
              '🔙 Closing Model Mode, returning to Measure at:',
              new Date().toISOString()
            );
            setMode('measure');
          }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <View style={styles.fullScreen} ref={viewRef} collapsable={false}>
      <ViroARSceneNavigator
        ref={arSceneRef}
        autofocus={true}
        initialScene={{ scene: MeasurementScene }}
        viroAppProps={{
          points,
          distance,
          onInitialized,
          onCameraTransformUpdate,
          mode,
        }}
        style={StyleSheet.absoluteFill}
        collapsable={false}
      />

      {/* Overlay UI */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Mode toggle */}
        <View style={styles.modeToggle} pointerEvents="auto">
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'measure' && styles.modeButtonActive,
            ]}
            onPress={() => {
              setMode('measure');
              setPoints([]);
              setDistance(0);
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

        {/* Center crosshair */}
        {mode === 'measure' && (
          <View style={styles.centerCrosshair} pointerEvents="none">
            <View style={styles.crosshairDot} />
            <View style={styles.crosshairRingOuter}>
              <View style={styles.crosshairRingInner} />
            </View>
          </View>
        )}

        {/* Top bar */}
        <View style={styles.topBar} pointerEvents="auto">
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          {mode === 'measure' && points.length === 2 && (
            <View style={styles.distanceDisplay}>
              <Text style={styles.measurementText}>
                {formatDistanceHelper(distance)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetMeasurement}
          >
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Bottom instruction panel */}
        {mode === 'measure' && (
          <View style={styles.bottomBar} pointerEvents="auto">
            {!isTracking ? (
              <View style={styles.instructionPanel}>
                <Text style={styles.instructionText}>
                  Di chuyển thiết bị để quét các khu vực cần thiết.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.instructionPanel}>
                  {points.length === 0 && (
                    <Text style={styles.instructionText}>
                      Nhắm vào điểm bắt đầu, sau đó nhấn +
                    </Text>
                  )}
                  {points.length === 1 && (
                    <Text style={styles.instructionText}>
                      Nhắm vào điểm kết thúc, sau đó nhấn +
                    </Text>
                  )}
                  {points.length === 2 && (
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={takeScreenshot}
                    >
                      <Ionicons
                        name="download-outline"
                        size={20}
                        color="white"
                      />
                      <Text style={styles.saveButtonText}>Lưu</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {points.length < 2 && (
                  <TouchableOpacity
                    style={styles.addPointButton}
                    onPress={addPointAtCenter}
                  >
                    <Ionicons name="add" size={32} color="#333" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  textStyle: {
    fontFamily: 'System',
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  // Mode Toggle Styles (Waren im Original nicht definiert!)
  modeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 50, // Safe Area Top
    gap: 10,
    zIndex: 200,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    minWidth: 80,
  },
  modeButtonActive: {
    backgroundColor: 'white',
  },
  modeButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },

  // Crosshair
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

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // Top padding wird vom ModeToggle übernommen, daher hier etwas weniger oder absolut positioniert
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    zIndex: 150,
  },
  closeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceDisplay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    position: 'absolute',
    left: '50%',
    transform: [{ translateY: '200%' }, { translateX: '-50%' }],
  },
  measurementText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },

  // Bottom Bar
  bottomBar: {
    paddingBottom: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    zIndex: 100,
  },
  instructionPanel: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  addPointButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
