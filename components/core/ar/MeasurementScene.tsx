import {
  ViroARScene,
  ViroNode,
  ViroPolyline,
  ViroSphere,
  ViroText,
} from '@reactvision/react-viro';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  formatDistance,
  MeasurementPoint,
} from '../../../hooks/use-measurement';

interface MeasurementSceneProps {
  sceneNavigator: any;
}

export const MeasurementScene = (props: MeasurementSceneProps) => {
  const {
    points,
    distance,
    onInitialized,
    onCameraTransformUpdate,
    mode,
  } = props.sceneNavigator.viroAppProps;

  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      onCameraTransformUpdate={onCameraTransformUpdate}
    >
      {/* Measurement mode */}
      {mode === 'measure' && (
        <ViroNode>
          {/* Render measurement points */}
          {points.map((point: MeasurementPoint) => (
            <ViroSphere
              key={point.id}
              position={point.position}
              radius={0.015}
              widthSegmentCount={20}
              heightSegmentCount={20}
            />
          ))}

          {/* Render line and distance label between two points */}
          {points.length === 2 && (
            <>
              <ViroPolyline
                points={[points[0].position, points[1].position]}
                thickness={0.005}
              />
              <ViroText
                text={formatDistance(distance)}
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

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: '#ffffff',
  },
});
