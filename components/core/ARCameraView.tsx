import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera'; // Aktuelle Expo-Empfehlung
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as THREE from 'three';

interface ARCameraViewProps {
  onClose: () => void;
  onCapture: (uri: string) => void;
}

type Shape = 'cube' | 'cylinder' | 'pipe';

export default function ARCameraView({
  onClose,
  onCapture,
}: ARCameraViewProps) {
  const cameraRef = useRef<any>(null);
  const [shape, setShape] = useState<Shape>('cube');

  const onContextCreate = async (gl: any) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    let geometry: THREE.BufferGeometry;
    switch (shape) {
      case 'cube':
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 32);
        break;
      case 'pipe':
        geometry = new THREE.CylinderGeometry(
          0.3,
          0.3,
          0.8,
          32,
          1,
          true
        );
        break;
      default:
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    }

    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const marker = new THREE.Mesh(geometry, material);
    marker.position.z = -3;
    scene.add(marker);

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      onCapture(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />

      <GLView
        style={StyleSheet.absoluteFill}
        onContextCreate={onContextCreate}
        key={shape}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
          <View style={styles.shapeButtons}>
            <TouchableOpacity
              style={styles.shapeButton}
              onPress={() => setShape('cube')}
            >
              <Text style={styles.shapeButtonText}>Cube</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shapeButton}
              onPress={() => setShape('cylinder')}
            >
              <Text style={styles.shapeButtonText}>Cylinder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shapeButton}
              onPress={() => setShape('pipe')}
            >
              <Text style={styles.shapeButtonText}>Pipe</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}
        >
          <View style={styles.captureInternal} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  closeButton: { alignSelf: 'flex-start' },
  shapeButtons: { flexDirection: 'row', gap: 10 },
  shapeButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
  },
  shapeButtonText: { color: 'white' },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInternal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});
