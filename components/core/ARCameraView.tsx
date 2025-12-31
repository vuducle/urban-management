import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { EXGLContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as THREE from 'three';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } =
  Dimensions.get('window');

interface ARCameraViewProps {
  onClose: () => void;
  onCapture: (uri: string) => void;
}

// Enum for measurement state
enum MeasurementState {
  WaitingForPointA,
  WaitingForPointB,
  Completed,
}

export default function ARCameraView({
  onClose,
  onCapture,
}: ARCameraViewProps) {
  const cameraRef = useRef<CameraView>(null);
  const glRef = useRef<EXGLContext | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(
    null
  );
  const animationFrameId = useRef<number>();
  const pointsRef = useRef<THREE.Vector3[]>([]);
  const [displayDistance, setDisplayDistance] = useState<number>(0);

  // Ruler feature state
  const [measurementState, setMeasurementState] =
    useState<MeasurementState>(MeasurementState.WaitingForPointA);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [distance, setDistance] = useState<number>(0);

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

  const onContextCreate = async (gl: EXGLContext) => {
    glRef.current = gl;
    const { drawingBufferWidth: width, drawingBufferHeight: height } =
      gl;

    const renderer = new Renderer({ gl, alpha: true });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const scene = new THREE.Scene();
    const threeCamera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.01,
      1000
    );

    // if (gl.createCameraTextureAsync && cameraRef.current) {
    //   const cameraTexture = await gl.createCameraTextureAsync(
    //     cameraRef.current
    //   );

    //   // In Three.js einbinden
    //   const texture = new THREE.Texture();
    //   texture.image = {
    //     data: cameraTexture,
    //     width: gl.drawingBufferWidth,
    //     height: gl.drawingBufferHeight,
    //   };
    //   texture.needsUpdate = true;
    //   scene.background = texture;
    // }

    // --- Ruler feature objects ---
    const pointsGroup = new THREE.Group(); // To hold spheres
    scene.add(pointsGroup);
    const lineGroup = new THREE.Group(); // To hold the line
    scene.add(lineGroup);

    const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 2,
    });

    // This plane is used for raycasting to place points in 3D space
    const raycastPlane = new THREE.Plane(
      new THREE.Vector3(0, 0, 1),
      3
    );
    const raycaster = new THREE.Raycaster();
    // --- End of Ruler objects ---

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      // Wichtig: Gruppe leeren
      pointsGroup.clear();
      lineGroup.clear();

      const currentPoints = pointsRef.current;

      currentPoints.forEach((point) => {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(point);
        pointsGroup.add(sphere);
      });

      if (currentPoints.length === 2) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(
          currentPoints
        );
        const line = new THREE.Line(lineGeometry, lineMaterial);
        lineGroup.add(line);
      }

      renderer.render(scene, threeCamera);
      gl.endFrameEXP();
    };
    animate();
  };

  const handleTouch = (event: any) => {
    if (measurementState === MeasurementState.Completed) return;

    const { locationX, locationY } = event.nativeEvent;

    // 1. Koordinaten normalisieren
    const mouse = new THREE.Vector2();
    mouse.x = (locationX / screenWidth) * 2 - 1;
    mouse.y = -(locationY / screenHeight) * 2 + 1;

    // 2. Nutze eine Kamera mit denselben Werten wie im Renderer
    const tempCamera = new THREE.PerspectiveCamera(
      75,
      screenWidth / screenHeight,
      0.01,
      1000
    );
    tempCamera.position.z = 0; // Kamera ist im Ursprung

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, tempCamera);

    // 3. Eine virtuelle Ebene 3 Einheiten vor der Kamera (Z = -3)
    // Der Normalenvektor zeigt zur Kamera (0, 0, 1), der Abstand ist 3
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 3);
    const intersectionPoint = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
      // Punkt zum State hinzufügen
      setPoints((prev) => [...prev, intersectionPoint.clone()]);

      // Status-Update
      if (measurementState === MeasurementState.WaitingForPointA) {
        setMeasurementState(MeasurementState.WaitingForPointB);
      } else {
        setMeasurementState(MeasurementState.Completed);
      }
    }

    if (intersectionPoint) {
      const newPoints = [
        ...pointsRef.current,
        intersectionPoint.clone(),
      ];
      pointsRef.current = newPoints; // Ref sofort updaten

      if (measurementState === MeasurementState.WaitingForPointA) {
        setMeasurementState(MeasurementState.WaitingForPointB);
      } else {
        // Berechnung der Distanz
        const dist = newPoints[0].distanceTo(newPoints[1]);
        setDistance(dist); // Für die Logik
        setDisplayDistance(dist); // Für die UI
        setMeasurementState(MeasurementState.Completed);
      }
    }
  };

  const resetMeasurement = () => {
    setPoints([]);
    setDistance(0);
    setMeasurementState(MeasurementState.WaitingForPointA);
  };

  const getInstructionText = () => {
    switch (measurementState) {
      case MeasurementState.WaitingForPointA:
        return 'Tippe, um den ersten Punkt zu setzen';
      case MeasurementState.WaitingForPointB:
        return 'Tippe, um den zweiten Punkt zu setzen';
      case MeasurementState.Completed:
        return `Distanz: ${distance.toFixed(2)} Einheiten`;
    }
  };

  if (hasPermission === null || hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          Kamerazugriff wird benötigt
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen} onTouchEnd={handleTouch}>
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
      <View style={styles.overlay}>
        {/* Top UI */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.closeButton}
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
            style={styles.resetButton}
            onPress={resetMeasurement}
          >
            <Ionicons name="refresh" size={28} color="white" />
          </TouchableOpacity>
        </View>
        {/* Bottom UI can be added here if needed */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  centered: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: { color: 'white', fontSize: 16 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
  },
  closeButton: { padding: 5 },
  resetButton: { padding: 5 },
  instructionBox: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
