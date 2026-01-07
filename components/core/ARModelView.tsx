import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';

import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroDirectionalLight,
  ViroNode,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';

// --- AR MODEL CONFIGURATION ---

type ModelType = 'cube' | 'leon' | 'tv' | 'house';

interface PlacedModel {
  id: number;
  position: number[];
  rotation: number[];
  scale: number[];
  type: ModelType;
}

interface ModelConfig {
  source: any;
  type: 'OBJ' | 'GLB' | 'GLTF2' | 'VRX';
  scale: number[];
  resources?: any[];
}

const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  cube: {
    source: undefined,
    type: 'GLB',
    scale: [0.3, 0.3, 0.3],
  },
  leon: {
    source: require('../../assets/models/leon_s_kennedy.obj'),
    type: 'OBJ',
    scale: [1, 1, 1],
  },
  tv: {
    source: require('../../assets/models/crt_tv.glb'),
    type: 'GLB',
    scale: [0.1, 0.1, 0.1],
  },
  house: {
    source: require('../../assets/models/leon_s_kennedy.glb'),
    type: 'GLB',
    scale: [1, 1, 1],
  },
};

// --- AR SCENE COMPONENT ---
const ModelScene = (props: any) => {
  const {
    onInitialized,
    placedModels,
    showPlanes,
    onARPlaneDetected,
    onCameraTransformUpdate,
    onSceneRef,
    updateModelTransform,
    setIsLoadingModel,
  } = props.sceneNavigator.viroAppProps;

  return (
    <ViroARScene
      ref={onSceneRef}
      onTrackingUpdated={onInitialized}
      onAnchorFound={onARPlaneDetected}
      onCameraTransformUpdate={onCameraTransformUpdate}
    >
      {/* Improved lighting:
          Models that are too dark often look broken.
          Multiple light sources for better illumination and fewer artifacts.
      */}
      <ViroAmbientLight color="#ffffff" intensity={500} />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.2]}
        intensity={300}
        castsShadow={false}
      />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[1, 0, 0]}
        intensity={200}
        castsShadow={false}
      />

      {showPlanes && (
        <ViroARPlaneSelector
          minHeight={0.1}
          minWidth={0.1}
          alignment="Horizontal"
        >
          <ViroBox
            position={[0, 0, 0]}
            scale={[1, 0.01, 1]}
            materials={[
              {
                diffuseColor: 'rgba(52, 199, 89, 0.4)',
                lightingModel: 'Constant',
              },
            ]}
          />
        </ViroARPlaneSelector>
      )}

      {placedModels.map((model: PlacedModel) => {
        const config = MODEL_CONFIGS[model.type];
        return (
          <ViroNode
            key={model.id}
            position={model.position}
            rotation={model.rotation}
            scale={model.scale}
            dragType="FixedToWorld"
            onDrag={() => {}}
          >
            {model.type === 'cube' ? (
              // Native Cube without external file
              <ViroBox
                position={[0, 0, 0]}
                scale={config.scale}
                materials={[
                  {
                    diffuseColor: '#FF6B6B',
                    lightingModel: 'Phong',
                  },
                ]}
              />
            ) : (
              <Viro3DObject
                source={config.source}
                type={config.type}
                position={[0, 0, 0]}
                scale={config.scale}
                resources={config.resources}
                materials={
                  config.type === 'GLB' ? undefined : undefined
                }
                lightReceivingBitMask={1}
                shadowCastingBitMask={0}
                highAccuracyEvents={true}
                transformBehaviors={['billboardY']} // Prevents distortion during rotation
                // Important for GLB: Disable animation and morphing
                animation={undefined}
                onLoadStart={() => setIsLoadingModel(true)}
                onLoadEnd={() => setIsLoadingModel(false)}
                onError={(event) => {
                  console.log('Model load error:', event);
                  setIsLoadingModel(false);
                }}
              />
            )}
          </ViroNode>
        );
      })}
    </ViroARScene>
  );
};

// --- MAIN COMPONENT ---
export default function ARModelView({
  onClose,
}: {
  onClose: () => void;
}) {
  const viewRef = useRef<View>(null);
  const arSceneRef = useRef<any>(null);
  const cameraPositionRef = useRef<any>(null);

  // State
  const [isTracking, setIsTracking] = useState(false);
  const [placedModels, setPlacedModels] = useState<PlacedModel[]>([]);
  const [showPlanes, setShowPlanes] = useState(true);
  const [planesDetected, setPlanesDetected] = useState(false);
  const [detectedPlaneAnchors, setDetectedPlaneAnchors] = useState<
    any[]
  >([]); // Store all planes
  const [selectedModel, setSelectedModel] =
    useState<ModelType>('cube');
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  useEffect(() => {
    return () => setPlacedModels([]);
  }, []);

  const onInitialized = (state: any) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setIsTracking(true);
    }
  };

  const onARPlaneDetected = (anchor: any) => {
    console.log('🔍 AR Plane detected:', {
      position: anchor?.position,
      center: anchor?.center,
      extent: anchor?.extent,
      alignment: anchor?.alignment,
    });

    if (!planesDetected) {
      setPlanesDetected(true);
    }

    // Collect all detected planes
    if (anchor?.position) {
      setDetectedPlaneAnchors((prev) => {
        // Add new anchor, store max 10 planes
        const updated = [...prev, anchor];
        return updated.slice(-10);
      });
    }
  };

  const onSceneRef = (scene: any) => {
    arSceneRef.current = scene;
  };

  const onCameraTransformUpdate = (cameraTransform: any) => {
    cameraPositionRef.current = cameraTransform;
    // Log only occasionally to avoid spamming the console
    if (Math.random() < 0.01) {
      console.log('📷 Camera update:', {
        position: cameraTransform?.position,
        forward: cameraTransform?.forward,
      });
    }
  };

  const handleAddObject = async () => {
    if (!isTracking) {
      Alert.alert('Chờ một chút', 'AR đang khởi động...');
      return;
    }

    console.log('➕ Adding object:', {
      selectedModel,
      planesDetected,
      planeCount: detectedPlaneAnchors.length,
      hasCamera: !!cameraPositionRef.current,
      hasScene: !!arSceneRef.current,
    });

    if (!planesDetected) {
      Alert.alert(
        'Tìm bề mặt',
        'Di chuyển điện thoại để phát hiện mặt phẳng (bật nút mắt để xem)'
      );
      return;
    }

    // Manueller Ray-Plane Schnittpunkt
    if (
      cameraPositionRef.current &&
      detectedPlaneAnchors.length > 0
    ) {
      const { position: camPos, forward: camForward } =
        cameraPositionRef.current;

      console.log('📍 Camera for intersection:', {
        camPos,
        camForward,
        planeCount: detectedPlaneAnchors.length,
      });

      // Find closest plane and calculate intersection
      let closestIntersection: number[] | null = null;
      let closestDistance = Infinity;

      for (const plane of detectedPlaneAnchors) {
        if (!plane.position || !plane.center) continue;

        // Plane parameters: position and normal (for horizontal: [0, 1, 0])
        const planeY = plane.position[1]; // Y height of the plane
        const planeNormal = [0, 1, 0]; // Horizontal plane points upwards

        // Ray-Plane Intersection formula:
        // t = (planeY - camPos.y) / camForward.y
        const denominator = camForward[1];

        // Check if ray is parallel to the plane
        if (Math.abs(denominator) < 0.0001) continue;

        const t = (planeY - camPos[1]) / denominator;

        // Only positive t (in front of the camera)
        if (t < 0) continue;

        // Calculate intersection
        const intersection = [
          camPos[0] + camForward[0] * t,
          planeY, // Exact plane height
          camPos[2] + camForward[2] * t,
        ];

        // Distance to the camera
        const distance = Math.sqrt(
          Math.pow(intersection[0] - camPos[0], 2) +
            Math.pow(intersection[1] - camPos[1], 2) +
            Math.pow(intersection[2] - camPos[2], 2)
        );

        console.log('🔵 Plane intersection:', {
          planeY,
          t,
          intersection,
          distance,
        });

        // Take next intersection
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIntersection = intersection;
        }
      }

      if (closestIntersection) {
        console.log('✅ Using intersection at:', closestIntersection);
        console.log('📊 Distance:', closestDistance.toFixed(2), 'm');
        placeModel(closestIntersection);
      } else {
        console.warn('⚠️ No valid intersection, using fallback');
        placeFallback();
      }
    } else {
      console.warn('⚠️ No camera or planes available');
      placeFallback();
    }
  };

  const placeFallback = () => {
    // Fallback: In front of the camera at last plane height
    if (cameraPositionRef.current) {
      const { position: camPos, forward: camForward } =
        cameraPositionRef.current;

      let targetHeight = camPos[1] - 1.0;

      if (detectedPlaneAnchors.length > 0) {
        const latestPlane =
          detectedPlaneAnchors[detectedPlaneAnchors.length - 1];
        if (latestPlane?.position) {
          targetHeight = latestPlane.position[1];
        }
      }

      const pos = [
        camPos[0] + camForward[0] * 1.0,
        targetHeight,
        camPos[2] + camForward[2] * 1.0,
      ];

      console.log('🔄 Fallback placement at:', pos);
      placeModel(pos);
    }
  };

  const placeModel = (position: number[]) => {
    // Model-specific rotation
    let rotation = [0, 0, 0];
    if (selectedModel === 'leon') {
      rotation = [0, 0, 0]; // GLB models often have correct orientation
    }

    const newModel: PlacedModel = {
      id: Date.now(),
      position,
      rotation,
      scale: [1, 1, 1], // Initial scale for the node (object is scaled separately)
      type: selectedModel,
    };

    console.log('✅ Model placed:', {
      type: newModel.type,
      position: newModel.position,
      rotation: newModel.rotation,
      id: newModel.id,
    });

    setPlacedModels((prev) => [...prev, newModel]);
  };

  const handleUndo = () =>
    setPlacedModels((prev) => prev.slice(0, -1));

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
      Alert.alert('Lỗi', 'Không thể chụp ảnh');
    }
  };

  return (
    <View style={styles.fullScreen} ref={viewRef} collapsable={false}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{ scene: ModelScene }}
        viroAppProps={{
          onInitialized,
          placedModels,
          showPlanes,
          onARPlaneDetected,
          onCameraTransformUpdate,
          onSceneRef,
          updateModelTransform: () => {}, // Platzhalter falls nicht genutzt
          setIsLoadingModel,
        }}
        style={StyleSheet.absoluteFill}
      />

      {/* UI Overlay */}
      <View style={styles.overlay} pointerEvents="box-none">
        {isLoadingModel && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#34C759" />
            <Text style={styles.loadingText}>
              Đang tải mô hình...
            </Text>
          </View>
        )}

        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.iconButton}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Mô hình 3D ({placedModels.length})
          </Text>
          <TouchableOpacity
            onPress={() => setShowPlanes(!showPlanes)}
            style={styles.iconButton}
          >
            <Ionicons
              name={showPlanes ? 'eye' : 'eye-off'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.crosshairContainer} pointerEvents="none">
          <View style={styles.crosshairDot} />
          <View style={styles.crosshairRing} />
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.sideButton}
            onPress={handleUndo}
            disabled={placedModels.length === 0}
          >
            <Ionicons
              name="arrow-undo"
              size={24}
              color="white"
              style={{ opacity: placedModels.length ? 1 : 0.4 }}
            />
            <Text style={styles.buttonLabel}>Hoàn tác</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addButton,
              !isTracking && styles.disabledButton,
            ]}
            onPress={handleAddObject}
          >
            <Ionicons name="add" size={40} color="white" />
          </TouchableOpacity>

          <View style={styles.modelSelector}>
            {(['cube', 'leon', 'tv', 'house'] as ModelType[]).map(
              (type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.modelBtn,
                    selectedModel === type && styles.modelBtnActive,
                  ]}
                  onPress={() => setSelectedModel(type)}
                >
                  <Text style={styles.modelBtnText}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <TouchableOpacity
            style={styles.sideButton}
            onPress={takeScreenshot}
            disabled={placedModels.length === 0}
          >
            <Ionicons
              name="camera"
              size={24}
              color="white"
              style={{ opacity: placedModels.length ? 1 : 0.4 }}
            />
            <Text style={styles.buttonLabel}>Chụp ảnh</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  crosshairRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'white',
    opacity: 0.7,
  },
  loadingContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: { color: 'white', marginTop: 10, fontSize: 12 },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 10,
  },
  addButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  disabledButton: { backgroundColor: '#555' },
  sideButton: { alignItems: 'center', width: 60 },
  buttonLabel: { color: 'white', fontSize: 10, marginTop: 4 },
  modelSelector: {
    position: 'absolute',
    bottom: 130,
    flexDirection: 'row',
    gap: 8,
  },
  modelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
  },
  modelBtnActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  modelBtnText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
});
