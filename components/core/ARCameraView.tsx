import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Renderer } from 'expo-three';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as THREE from 'three';
import { ARMode, RulerMode } from './ARMeasurementMode';
import { XRayMode } from './ARXRayMode';

const { width: screenWidth, height: screenHeight } =
  Dimensions.get('window');

// Enum for the state of the measurement process
enum MeasurementState {
  Idle,
  FirstPointSet,
  Completed,
}

interface ARCameraViewProps {
  onClose: () => void;
}

/**
 * @component ARCameraView
 * @description A full-screen component that provides an augmented reality experience.
 * It supports different modes like Ruler and X-Ray (placeholder).
 */
export default function ARCameraView({ onClose }: ARCameraViewProps) {
  // Refs for THREE.js objects and camera
  const cameraRef = useRef<CameraView>(null);
  const viewRef = useRef<View>(null);
  const glRef = useRef<ExpoWebGLRenderingContext | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const threeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameId = useRef<number | undefined>(undefined);

  // State management
  const [hasPermission, setHasPermission] = useState<boolean | null>(
    null
  );
  const [currentMode, setCurrentMode] = useState<ARMode>(
    ARMode.Ruler
  );
  const [measurementState, setMeasurementState] =
    useState<MeasurementState>(MeasurementState.Idle);
  const [distance, setDistance] = useState<number>(0);

  // Mode handlers
  const rulerModeRef = useRef<RulerMode>(new RulerMode());
  const xrayModeRef = useRef<XRayMode>(new XRayMode());

  // Request camera permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  /**
   * @method onContextCreate
   * @description Initializes the THREE.js scene, renderer, and camera.
   * This is called once the GLView is ready.
   */
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    glRef.current = gl;
    const { drawingBufferWidth: width, drawingBufferHeight: height } =
      gl;

    // Renderer setup
    const renderer = new Renderer({ gl, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Scene and Camera setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.01,
      100
    );
    threeCameraRef.current = camera;

    // Object groups for organization
    const pointsGroup = new THREE.Group();
    scene.add(pointsGroup);
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);
    const previewGroup = new THREE.Group();
    scene.add(previewGroup);

    // Materials for points and lines
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffff00,
      linewidth: 3,
    });
    const previewLineMaterial = new THREE.LineBasicMaterial({
      color: 0xffff00,
      linewidth: 2,
      transparent: true,
      opacity: 0.7,
    });

    // Main render loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      // Clear groups before re-rendering
      pointsGroup.clear();
      linesGroup.clear();
      previewGroup.clear();

      if (currentMode === ARMode.Ruler && threeCameraRef.current) {
        // Update the preview line from point A to the cursor
        rulerModeRef.current.updatePreview(
          threeCameraRef.current,
          screenWidth,
          screenHeight
        );
        const measurement = rulerModeRef.current.getMeasurement();

        // Render points
        if (measurement.pointA) {
          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.02, 16, 16),
            pointMaterial
          );
          sphere.position.copy(measurement.pointA.position);
          pointsGroup.add(sphere);
        }
        if (measurement.pointB) {
          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.02, 16, 16),
            pointMaterial
          );
          sphere.position.copy(measurement.pointB.position);
          pointsGroup.add(sphere);
        }

        // Render the final measurement line
        if (measurement.pointA && measurement.pointB) {
          const lineGeometry =
            new THREE.BufferGeometry().setFromPoints([
              measurement.pointA.position,
              measurement.pointB.position,
            ]);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          linesGroup.add(line);
        }

        // Update distance in state (including preview distance)
        if (measurement.distance > 0) {
          setDistance(measurement.distance);
        }

        // Render the preview line
        if (measurement.previewLine) {
          const { start, end } = measurement.previewLine;
          const previewLineGeo =
            new THREE.BufferGeometry().setFromPoints([start, end]);
          const previewLine = new THREE.Line(
            previewLineGeo,
            previewLineMaterial
          );
          previewGroup.add(previewLine);

          // Add endpoint sphere for preview
          const endSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.015, 16, 16),
            new THREE.MeshBasicMaterial({
              color: 0xffff00,
              transparent: true,
              opacity: 0.7,
            })
          );
          endSphere.position.copy(end);
          previewGroup.add(endSphere);
        }
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  /**
   * @method handleAddPoint
   * @description Adds a new measurement point at the center of the screen.
   * This is triggered by the user pressing the "Add Point" button.
   */
  const handleAddPoint = () => {
    if (currentMode !== ARMode.Ruler || !threeCameraRef.current)
      return;

    if (measurementState === MeasurementState.Idle) {
      rulerModeRef.current.addPoint(
        screenWidth / 2,
        screenHeight / 2,
        threeCameraRef.current,
        screenWidth,
        screenHeight
      );
      setMeasurementState(MeasurementState.FirstPointSet);
      console.log('First point added');
    } else if (measurementState === MeasurementState.FirstPointSet) {
      rulerModeRef.current.addPoint(
        screenWidth / 2,
        screenHeight / 2,
        threeCameraRef.current,
        screenWidth,
        screenHeight
      );
      setMeasurementState(MeasurementState.Completed);
      console.log('Second point added, measurement complete');
    }
  };

  /**
   * @method handleSave
   * @description Captures the current view and saves it to the device.
   */
  const handleSave = async () => {
    if (!viewRef.current) return;

    try {
      // Capture the view as an image
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert(
          'Erfolg',
          'Messung wurde in der Galerie gespeichert!'
        );
      } else {
        // If no permission, try to share instead
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Fehler', 'Keine Berechtigung zum Speichern');
        }
      }

      // Reset after saving
      handleReset();
    } catch (error) {
      console.error('Error saving measurement:', error);
      Alert.alert(
        'Fehler',
        'Messung konnte nicht gespeichert werden'
      );
    }
  };

  /**
   * @method handleReset
   * @description Resets the current AR mode to its initial state.
   */
  const handleReset = () => {
    if (currentMode === ARMode.Ruler) {
      rulerModeRef.current.reset();
      setMeasurementState(MeasurementState.Idle);
      setDistance(0);
    } else if (currentMode === ARMode.XRay) {
      xrayModeRef.current.reset();
    }
  };

  /**
   * @method handleModeSwitch
   * @description Switches between available AR modes.
   */
  const handleModeSwitch = (mode: ARMode) => {
    handleReset();
    setCurrentMode(mode);
  };

  /**
   * @method getInstructionText
   * @description Returns the instructional text based on the current state.
   */
  const getInstructionText = () => {
    if (currentMode === ARMode.XRay) {
      return 'X-Ray Mode (Coming Soon)';
    }

    switch (measurementState) {
      case MeasurementState.Idle:
        return 'Punkt 1 setzen';
      case MeasurementState.FirstPointSet:
        const previewDistInCm = distance * 100;
        return previewDistInCm < 100
          ? `${previewDistInCm.toFixed(1)} cm`
          : `${distance.toFixed(2)} m`;
      case MeasurementState.Completed:
        const distInCm = distance * 100;
        return distInCm < 100
          ? `${distInCm.toFixed(1)} cm`
          : `${distance.toFixed(2)} m`;
    }
  };

  if (hasPermission === null) {
    return <View style={styles.centered} />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen} ref={viewRef}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        ref={cameraRef}
      >
        <GLView
          style={StyleSheet.absoluteFill}
          onContextCreate={onContextCreate}
        />
      </CameraView>

      {/* Crosshair in the center of the screen */}
      <View style={styles.crosshair} pointerEvents="none">
        <Ionicons name="add" size={30} color="white" />
      </View>

      <View style={styles.overlay} pointerEvents="box-none">
        {/* Top bar with close, instructions, and reset */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              {getInstructionText()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomBar}>
          {/* Mode selectors */}
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                currentMode === ARMode.Ruler &&
                  styles.modeButtonActive,
              ]}
              onPress={() => handleModeSwitch(ARMode.Ruler)}
            >
              <Ionicons
                name="resize-outline"
                size={24}
                color={
                  currentMode === ARMode.Ruler ? '#00ff00' : 'white'
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                currentMode === ARMode.XRay &&
                  styles.modeButtonActive,
              ]}
              onPress={() => handleModeSwitch(ARMode.XRay)}
            >
              <Ionicons
                name="scan-outline"
                size={24}
                color={
                  currentMode === ARMode.XRay ? '#00ff00' : 'white'
                }
              />
            </TouchableOpacity>
          </View>

          {/* Add Point button */}
          {currentMode === ARMode.Ruler &&
            measurementState !== MeasurementState.Completed && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddPoint}
              >
                <Ionicons name="add-circle" size={60} color="white" />
              </TouchableOpacity>
            )}

          {/* Save button when measurement is complete */}
          {currentMode === ARMode.Ruler &&
            measurementState === MeasurementState.Completed && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={60}
                  color="#00ff00"
                />
                <Text style={styles.saveButtonText}>Speichern</Text>
              </TouchableOpacity>
            )}

          {/* Placeholder for other mode's buttons */}
          <View style={styles.rightActions}>
            {/* Future buttons can go here */}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionText: { color: 'white', fontSize: 18 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  instructionBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 5,
  },
  modeButton: {
    padding: 10,
    borderRadius: 20,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(0,255,0,0.2)',
  },
  addButton: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    transform: [{ translateX: -30 }], // Center the button
    bottom: -10,
  },
  saveButton: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    transform: [{ translateX: -30 }],
    bottom: -10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#00ff00',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -10,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});
