import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
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
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroNode,
  ViroSpotLight,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';

// --- AR SCENE COMPONENT ---
const ModelScene = (props: any) => {
  const {
    onInitialized,
    placedModels,
    showPlanes,
    onARPlaneDetected,
  } = props.sceneNavigator.viroAppProps;

  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      onAnchorFound={onARPlaneDetected}
    >
      {/* Lighting is essential for 3D models to look 3D */}
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={90}
        direction={[0, -1, -0.2]}
        position={[0, 3, 1]}
        color="#ffffff"
        castsShadow={true}
      />

      {/* Debug: Show detected planes if enabled */}
      {showPlanes && (
        <ViroARPlaneSelector>
          <ViroBox
            position={[0, 0, 0]}
            scale={[0.5, 0.01, 0.5]}
            materials={[{ diffuseColor: 'rgba(0,255,0,0.3)' }]}
          />
        </ViroARPlaneSelector>
      )}

      {/* Render all placed models */}
      {placedModels.map((model: any) => (
        <ViroNode
          key={model.id}
          position={model.position}
          rotation={model.rotation}
          scale={[0.1, 0.1, 0.1]} // Adjust scale based on your GLTF model size
          dragType="FixedToWorld"
          onDrag={() => {}} // Allows dragging the object after placement
        >
          {/* TODO: SWITCH TO GLTF MODEL HERE 
            Uncomment the Viro3DObject below and remove ViroBox to use your file.
          */}

          {/* <Viro3DObject
            source={require('@/assets/models/car.glb')} // Path to your GLB file
            type="GLB" 
            scale={[1, 1, 1]}
          /> 
          */}

          {/* Placeholder Box */}
          <ViroBox
            position={[0, 0.05, 0]}
            scale={[1, 1, 1]}
            materials={[{ diffuseColor: '#ff6b6b' }]}
          />
        </ViroNode>
      ))}
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
  const [placedModels, setPlacedModels] = useState<any[]>([]);
  const [showPlanes, setShowPlanes] = useState(false); // Toggle debug planes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setPlacedModels([]);
    };
  }, []);

  // Handle AR Initialization
  const onInitialized = (state: any, reason: any) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log('✅ AR Tracking Normal');
      setIsTracking(true);
    } else if (
      state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE
    ) {
      setIsTracking(false);
    }
  };

  // Keep track of camera position for fallback placement
  const onCameraTransformUpdate = (cameraTransform: any) => {
    cameraPositionRef.current = cameraTransform;
  };

  // Logic to place a new model - SIMPLIFIED
  const handleAddObject = () => {
    console.log('🎯 handleAddObject called');
    console.log('Is tracking:', isTracking);
    console.log('Current models:', placedModels.length);

    if (!isTracking) {
      Alert.alert('Chờ một chút', 'AR đang khởi động...');
      return;
    }

    // Simple placement: just place in front of camera at origin
    // Each model gets a slightly different position so they don't overlap
    const offset = placedModels.length * 0.2; // Spread them out
    const position = [
      offset, // X: spread horizontally
      -0.5, // Y: half meter below eye level (on ground)
      -1.0, // Z: 1 meter forward
    ];

    console.log('📦 Placing at position:', position);
    placeModel(position);
  };

  const placeModel = (position: number[]) => {
    const newModel = {
      id: Date.now(), // Unique ID
      position: position,
      rotation: [0, Math.random() * 360, 0], // Random rotation for variety
    };
    console.log('📍 Adding new model:', newModel);
    setPlacedModels((prev) => {
      const updated = [...prev, newModel];
      console.log('Total models now:', updated.length);
      return updated;
    });
    Alert.alert(
      '✅ Thành công',
      `Đã đặt mô hình #${placedModels.length + 1}`
    );
  };

  // Remove the last added object
  const handleUndo = () => {
    setPlacedModels((prev) => prev.slice(0, -1));
  };

  // Screenshot logic
  const takeScreenshot = async () => {
    if (!viewRef.current) return;
    try {
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 1,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Thành công', 'Ảnh đã được lưu vào thư viện');
      }
    } catch (e) {
      console.log('Screenshot error', e);
    }
  };

  return (
    <View style={styles.fullScreen} ref={viewRef} collapsable={false}>
      <ViroARSceneNavigator
        ref={arSceneRef}
        autofocus={true}
        initialScene={{ scene: ModelScene }}
        viroAppProps={{
          onInitialized,
          placedModels,
          showPlanes,
          onARPlaneDetected: () => {}, // Optional: Add logic if you want to detect planes specifically
        }}
        onCameraTransformUpdate={onCameraTransformUpdate}
        style={StyleSheet.absoluteFill}
      />

      {/* UI Overlay */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Top Bar */}
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

        {/* Center Crosshair (Target) */}
        <View style={styles.crosshairContainer} pointerEvents="none">
          <View style={styles.crosshairDot} />
          <View style={styles.crosshairRing} />
        </View>

        {/* Status Message */}
        {!isTracking && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              Đang quét môi trường...
            </Text>
            <Text style={styles.subMessageText}>
              Di chuyển thiết bị chậm rãi
            </Text>
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Undo/Clear Button */}
          <TouchableOpacity
            style={[
              styles.sideButton,
              { opacity: placedModels.length > 0 ? 1 : 0.5 },
            ]}
            onPress={handleUndo}
            disabled={placedModels.length === 0}
          >
            <Ionicons name="arrow-undo" size={24} color="white" />
            <Text style={styles.buttonLabel}>Hoàn tác</Text>
          </TouchableOpacity>

          {/* ADD Button (Big Plus) */}
          <TouchableOpacity
            style={[
              styles.addButton,
              !isTracking && styles.disabledButton,
            ]}
            onPress={handleAddObject}
            disabled={!isTracking}
          >
            <Ionicons name="add" size={40} color="white" />
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.sideButton,
              { opacity: placedModels.length > 0 ? 1 : 0.5 },
            ]}
            onPress={takeScreenshot}
            disabled={placedModels.length === 0}
          >
            <Ionicons
              name="download-outline"
              size={24}
              color="white"
            />
            <Text style={styles.buttonLabel}>Lưu ảnh</Text>
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

  // Top Header
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60, // Safe area
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Crosshair
  crosshairContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25, // Half of width
    marginTop: -25, // Half of height
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
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'white',
    opacity: 0.8,
  },

  // Status Messages
  messageContainer: {
    position: 'absolute',
    top: 120,
    width: '100%',
    alignItems: 'center',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subMessageText: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 4,
    textShadowColor: 'black',
    textShadowRadius: 2,
  },

  // Bottom Buttons
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
    backgroundColor: 'linear-gradient(...)', // Optional styling
  },
  addButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#34C759', // iOS Green
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  sideButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
