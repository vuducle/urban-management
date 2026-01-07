import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Import ViroReact
import {
  ViroARPlaneSelector,
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroText,
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
      displayPointCloud={false}
      onAnchorFound={onARPlaneDetected}
    >
      {/* Show detected planes for debugging */}
      {showPlanes && (
        <ViroARPlaneSelector>
          <ViroBox
            position={[0, 0, 0]}
            scale={[1, 0.01, 1]}
            materials={[
              {
                diffuseColor: '#00ff0050',
                lightingModel: 'Constant',
              },
            ]}
          />
        </ViroARPlaneSelector>
      )}

      {/* Render all placed models */}
      {placedModels.map((model: any) => (
        <React.Fragment key={model.id}>
          <ViroBox
            position={model.position}
            scale={[0.1, 0.1, 0.1]}
            materials={[
              {
                diffuseColor: '#ff6b6b',
                lightingModel: 'Lambert',
              },
            ]}
            rotation={model.rotation || [0, 0, 0]}
          />
          <ViroText
            text={`Model ${model.id}`}
            position={[
              model.position[0],
              model.position[1] + 0.15,
              model.position[2],
            ]}
            scale={[0.05, 0.05, 0.05]}
            style={styles.textStyle}
          />
        </React.Fragment>
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

  const [isTracking, setIsTracking] = useState(false);
  const [placedModels, setPlacedModels] = useState<any[]>([]);
  const [showPlanes, setShowPlanes] = useState(true);
  const [planesDetected, setPlanesDetected] = useState(false);
  const detectedPlanesRef = useRef<any[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up AR Model View');
      setPlacedModels([]);
      setIsTracking(false);
      setPlanesDetected(false);
      detectedPlanesRef.current = [];
    };
  }, []);

  const onInitialized = (state: any, reason: any) => {
    console.log('AR Tracking State:', state);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log('✅ AR Ready');
      setIsTracking(true);
    } else {
      setIsTracking(false);
    }
  };

  // Track camera for model placement
  const onCameraTransformUpdate = (cameraTransform: any) => {
    cameraPositionRef.current = cameraTransform;
  };

  // Track detected AR planes
  const onARPlaneDetected = (anchor: any) => {
    console.log('🎯 AR Plane detected:', anchor);
    detectedPlanesRef.current.push(anchor);
    if (!planesDetected) {
      setPlanesDetected(true);
      console.log('✅ First plane detected - ready to place objects');
    }
  };

  // Place model using AR Hit Test on real surfaces
  const placeModelWithHitTest = () => {
    if (!cameraPositionRef.current) {
      Alert.alert('Chưa sẵn sàng', 'Chờ tính năng theo dõi AR');
      return;
    }

    console.log('🎯 Attempting to place model...');
    console.log(
      'Camera position:',
      cameraPositionRef.current.position
    );
    console.log('AR Scene ref exists:', !!arSceneRef.current);

    // Try performARHitTestWithRay first
    if (
      arSceneRef.current?.arSceneNavigator?.performARHitTestWithRay
    ) {
      const screenCenter = [0.5, 0.5];
      console.log('Trying performARHitTestWithRay...');

      arSceneRef.current.arSceneNavigator
        .performARHitTestWithRay(screenCenter)
        .then((results: any[]) => {
          console.log('Hit test results:', results);
          if (results && results.length > 0) {
            placeModelAtHit(results[0]);
          } else {
            console.log('No hit results, using fallback');
            placeModelFallback();
          }
        })
        .catch((error: any) => {
          console.error('Hit test error:', error);
          placeModelFallback();
        });
    } else {
      console.log(
        'performARHitTestWithRay not available, using fallback'
      );
      placeModelFallback();
    }
  };

  // Place model at hit test result
  const placeModelAtHit = (hit: any) => {
    const hitPosition = [
      hit.transform?.position?.[0] || hit.position?.[0] || 0,
      hit.transform?.position?.[1] || hit.position?.[1] || 0,
      hit.transform?.position?.[2] || hit.position?.[2] || 0,
    ];

    console.log('✅ Placing model at hit position:', hitPosition);

    const newModel = {
      id: Date.now(),
      position: hitPosition,
      rotation: [0, Math.random() * 360, 0],
    };

    setPlacedModels((prev) => [...prev, newModel]);
    Alert.alert(
      'Mô hình được đặt!',
      `Vị trí: [${hitPosition.map((v) => v.toFixed(2)).join(', ')}]`
    );
  };

  // Fallback: Place model in front of camera
  const placeModelFallback = () => {
    if (!cameraPositionRef.current) return;

    const camPos = cameraPositionRef.current.position;
    const camForward = cameraPositionRef.current.forward || [
      0, 0, -1,
    ];

    // Place 1 meter in front and slightly down
    const distance = 1.0;
    const hitPosition = [
      camPos[0] + camForward[0] * distance,
      camPos[1] + camForward[1] * distance - 0.3,
      camPos[2] + camForward[2] * distance,
    ];

    console.log('📦 Using fallback placement:', hitPosition);

    const newModel = {
      id: Date.now(),
      position: hitPosition,
      rotation: [0, Math.random() * 360, 0],
    };

    setPlacedModels((prev) => [...prev, newModel]);
    Alert.alert(
      'Mô hình được đặt!',
      `Vị trí: [${hitPosition
        .map((v) => v.toFixed(2))
        .join(', ')}]\n(Vị trí ước tính)`
    );
  };

  const clearModels = () => {
    setPlacedModels([]);
  };

  const handleClose = () => {
    console.log('🚪 Closing AR Model View - resetting state');
    setPlacedModels([]);
    setIsTracking(false);
    setPlanesDetected(false);
    detectedPlanesRef.current = [];
    onClose();
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
          onARPlaneDetected,
        }}
        onCameraTransformUpdate={onCameraTransformUpdate}
        style={StyleSheet.absoluteFill}
        collapsable={false}
      />

      {/* Enhanced UI with Hit Test */}
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar} pointerEvents="auto">
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>
            3D Mô hình ({placedModels.length})
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPlanes(!showPlanes)}
          >
            <Ionicons
              name={showPlanes ? 'eye' : 'eye-off'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Crosshair for aiming */}
        <View style={styles.centerCrosshair} pointerEvents="none">
          <View style={styles.crosshairDot} />
          <View style={styles.crosshairRing} />
        </View>

        {!isTracking ? (
          <View style={styles.centerText}>
            <Text style={styles.instruction}>
              🔍 Môi trường đang được quét...
            </Text>
            <Text style={styles.subInstruction}>
              Di chuyển thiết bị chậm rãi
            </Text>
          </View>
        ) : !planesDetected ? (
          <View style={styles.centerText}>
            <Text style={styles.instruction}>
              🔎 Đang tìm kiếm bề mặt...
            </Text>
            <Text style={styles.subInstruction}>
              Hướng camera vào sàn hoặc đường
            </Text>
          </View>
        ) : (
          <View style={styles.centerText}>
            <Text style={styles.instruction}>
              ✅ Sẵn sàng đặt mô hình
            </Text>
            <Text style={styles.subInstruction}>
              Nhắm và nhấn + để đặt
            </Text>
          </View>
        )}

        <View style={styles.bottomBar} pointerEvents="auto">
          <View style={styles.buttonRow}>
            {placedModels.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  console.log('🗑️ Clearing all models');
                  clearModels();
                }}
              >
                <Ionicons name="trash" size={24} color="white" />
                <Text style={styles.buttonLabel}>Xóa</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.placeButton,
                !isTracking && styles.placeButtonDisabled,
              ]}
              onPress={() => {
                console.log('➕ Place button pressed');
                console.log('Current state:', {
                  isTracking,
                  planesDetected,
                  placedModelsCount: placedModels.length,
                });
                placeModelWithHitTest();
              }}
              disabled={!isTracking}
            >
              <Ionicons
                name="add"
                size={40}
                color={isTracking ? 'white' : 'gray'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    zIndex: 100,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  centerCrosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 50,
    height: 50,
    marginLeft: -25,
    marginTop: -25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    position: 'absolute',
  },
  crosshairRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.8,
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  instruction: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  subInstruction: {
    color: 'white',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 60,
    zIndex: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  placeButton: {
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
  placeButtonDisabled: {
    backgroundColor: 'rgba(150,150,150,0.5)',
  },
  clearButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,59,48,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 4,
    minWidth: 70,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  textStyle: {
    fontFamily: 'System',
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
