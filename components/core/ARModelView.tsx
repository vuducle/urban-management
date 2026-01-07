import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Import ViroReact
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroText,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';

// --- AR SCENE COMPONENT ---
const ModelScene = (props: any) => {
  const { onInitialized, modelPosition } =
    props.sceneNavigator.viroAppProps;

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* Simple cube model as placeholder */}
      {modelPosition && (
        <>
          <ViroBox
            position={modelPosition}
            scale={[0.1, 0.1, 0.1]}
            materials={['defaultMaterial']}
          />
          <ViroText
            text="AR Model"
            position={[
              modelPosition[0],
              modelPosition[1] + 0.15,
              modelPosition[2],
            ]}
            scale={[0.1, 0.1, 0.1]}
            style={styles.textStyle}
          />
        </>
      )}
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

  // Place model in front of camera
  const placeModel = () => {
    if (!cameraPositionRef.current) {
      Alert.alert('Not Ready', 'Wait for AR tracking');
      return;
    }

    const camPos = cameraPositionRef.current.position;
    const camForward = cameraPositionRef.current.forward;

    const modelPos = [
      camPos[0] + camForward[0] * 0.5,
      camPos[1] + camForward[1] * 0.5,
      camPos[2] + camForward[2] * 0.5,
    ];

    console.log('📦 Model placed at:', modelPos);
  };

  return (
    <View style={styles.fullScreen} ref={viewRef}>
      <ViroARSceneNavigator
        ref={arSceneRef}
        autofocus={true}
        initialScene={{ scene: ModelScene }}
        viroAppProps={{
          onInitialized,
          modelPosition: cameraPositionRef.current
            ? [
                cameraPositionRef.current.position[0],
                cameraPositionRef.current.position[1] - 0.3,
                cameraPositionRef.current.position[2] - 0.5,
              ]
            : null,
        }}
        onCameraTransformUpdate={onCameraTransformUpdate}
        style={StyleSheet.absoluteFill}
      />

      {/* Simple UI */}
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>3D Model</Text>
          <View style={{ width: 40 }} />
        </View>

        {!isTracking ? (
          <View style={styles.centerText}>
            <Text style={styles.instruction}>
              Scanning environment...
            </Text>
          </View>
        ) : (
          <View style={styles.centerText}>
            <Text style={styles.instruction}>
              Tap + to place model
            </Text>
          </View>
        )}

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.placeButton}
            onPress={placeModel}
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
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  placeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontFamily: 'System',
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
