import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';

// Import ViroReact
import {
  ViroARScene,
  ViroARSceneNavigator, // Optional, falls benötigt
  ViroNode,
  ViroPolyline,
  ViroSphere,
  ViroText,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';

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
              radius={0.015} // Etwas kleiner für Eleganz
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

      {/* Model mode - simple sphere placeholder */}
      {mode === 'model' && modelPosition && (
        <ViroSphere
          position={modelPosition}
          radius={0.1}
          widthSegmentCount={20}
          heightSegmentCount={20}
        />
      )}
    </ViroARScene>
  );
};

// Hilfsfunktion
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

  // --- HIER WAR DER SYNTAX FEHLER KORRIGIERT ---
  const onInitialized = (state: any, reason: any) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log('✅ AR Tracking Normal');
      setIsTracking(true);
    } else if (
      state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE
    ) {
      console.log('⚠️ AR Tracking Unavailable');
      setIsTracking(false);
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

  return (
    <View style={styles.fullScreen} ref={viewRef}>
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
          modelPosition: cameraPositionRef.current
            ? [
                cameraPositionRef.current.position[0],
                cameraPositionRef.current.position[1] - 0.3,
                cameraPositionRef.current.position[2] - 0.5,
              ]
            : null,
        }}
        style={StyleSheet.absoluteFill}
      />

      {/* Overlay UI */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Mode toggle */}
        <View style={styles.modeToggle}>
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
            <Text style={styles.modeButtonText}>Messen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'model' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('model')}
          >
            <Text style={styles.modeButtonText}>Modell</Text>
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
        <View style={styles.topBar} pointerEvents="box-none">
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
          <View style={styles.bottomBar}>
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
    zIndex: 10,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    zIndex: 5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceDisplay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
