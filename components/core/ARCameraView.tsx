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

// Import ViroReact (without custom material system)
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroPolyline,
  ViroSphere,
  ViroText,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';

// --- AR SCENE COMPONENT (extracted for clarity) ---
// Simple measurement scene like Apple Measure app
const MeasurementScene = (props: any) => {
  const { points, distance, onInitialized, onCameraTransformUpdate } =
    props.sceneNavigator.viroAppProps;

  console.log('Scene rendering with points:', points.length);

  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      onCameraTransformUpdate={onCameraTransformUpdate}
    >
      {/* Render measurement points as visible spheres */}
      {points.map((point: any) => (
        <ViroSphere
          key={point.id}
          position={point.position}
          radius={0.05}
          widthSegmentCount={20}
          heightSegmentCount={20}
        />
      ))}

      {/* Render line between two points */}
      {points.length === 2 && (
        <>
          <ViroPolyline
            points={[points[0].position, points[1].position]}
            thickness={0.02}
          />
          {/* Distance label in 3D space */}
          <ViroText
            text={formatDistanceHelper(distance)}
            position={[
              (points[0].position[0] + points[1].position[0]) / 2,
              (points[0].position[1] + points[1].position[1]) / 2 +
                0.15,
              (points[0].position[2] + points[1].position[2]) / 2,
            ]}
            scale={[0.2, 0.2, 0.2]}
            style={styles.textStyle}
          />
        </>
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

  const onInitialized = (state: any, reason: any) => {
    console.log('AR Tracking State:', state, 'Reason:', reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log('✅ AR Tracking Normal - Ready to measure');
      setIsTracking(true);
    } else {
      console.log(
        '⚠️ AR Tracking NOT normal - Move device to scan surfaces'
      );
      setIsTracking(false);
    }
  };

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

  // Place point at center - calculate position from camera
  const addPointAtCenter = () => {
    if (!cameraPositionRef.current) {
      console.log('❌ Camera position not available yet');
      Alert.alert('Not Ready', 'Wait for AR tracking to initialize');
      return;
    }

    try {
      console.log('🎯 Placing point from camera center...');

      const camTransform = cameraPositionRef.current;
      const camPos = camTransform.position;
      const camForward = camTransform.forward;

      // Place point 0.5 meters in front of camera in the direction it's facing
      const dist = 0.5;
      const hitPosition = [
        camPos[0] + camForward[0] * dist,
        camPos[1] + camForward[1] * dist,
        camPos[2] + camForward[2] * dist,
      ];

      console.log('✅ Placing point at:', hitPosition);

      setPoints((curr) => {
        if (curr.length >= 2) {
          console.log('Resetting - starting new measurement');
          return [{ position: hitPosition, id: Math.random() }];
        }

        const newPts = [
          ...curr,
          { position: hitPosition, id: Math.random() },
        ];
        console.log('📍 Points count:', newPts.length);

        if (newPts.length === 2) {
          const calculatedDist = calculateDistance(
            newPts[0].position,
            newPts[1].position
          );
          console.log('📏 Distance:', calculatedDist, 'meters');
          setDistance(calculatedDist);
        }

        return newPts;
      });
    } catch (error) {
      console.log('❌ Error placing point:', error);
      Alert.alert('Error', 'Could not place point');
    }
  };

  const resetMeasurement = () => {
    console.log('🔄 Resetting measurement');
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
        }}
        style={StyleSheet.absoluteFill}
      />

      {/* Overlay UI - Simple like Apple Measure */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Center crosshair - like Apple Measure */}
        <View style={styles.centerCrosshair} pointerEvents="none">
          <View style={styles.crosshairDot} />
          <View style={styles.crosshairRingOuter}>
            <View style={styles.crosshairRingInner} />
          </View>
        </View>

        {/* Top bar with close and reset */}
        <View style={styles.topBar} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          {/* Show distance when both points are set */}
          {points.length === 2 && (
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
        <View style={styles.bottomBar}>
          {!isTracking ? (
            <View style={styles.instructionPanel}>
              <Text style={styles.instructionText}>
                Move device to scan surfaces
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.instructionPanel}>
                {points.length === 0 && (
                  <Text style={styles.instructionText}>
                    Point at surface, then tap + button
                  </Text>
                )}
                {points.length === 1 && (
                  <Text style={styles.instructionText}>
                    Move to end point and tap +
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
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Big add point button - like Apple Measure */}
              {points.length < 2 && (
                <TouchableOpacity
                  style={styles.addPointButton}
                  onPress={addPointAtCenter}
                >
                  <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  measurementText: {
    color: 'white',
    fontSize: 48,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bottomBar: {
    paddingBottom: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  instructionPanel: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 250,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 17,
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
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
