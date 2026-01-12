import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroARScene,
  ViroBox,
  ViroDirectionalLight,
  ViroNode,
  ViroSphere,
} from '@reactvision/react-viro';
import React from 'react';
import {
  MODEL_CONFIGS,
  PlacedModel,
} from '../../../constants/ar-models';

interface ModelSceneProps {
  sceneNavigator: any;
  onModelClick?: (modelId: number) => void;
}

export const ModelScene = (props: ModelSceneProps) => {
  const {
    onInitialized,
    placedModels,
    showPlanes,
    onARPlaneDetected,
    onCameraTransformUpdate,
    setIsLoadingModel,
    onRegisterNavigator,
    onModelClick,
  } = props.sceneNavigator.viroAppProps;

  React.useEffect(() => {
    if (onRegisterNavigator && props.sceneNavigator) {
      console.log('🔗 Registering sceneNavigator to parent');
      onRegisterNavigator(props.sceneNavigator);
    }
  }, []);

  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      onAnchorFound={onARPlaneDetected}
      onCameraTransformUpdate={onCameraTransformUpdate}
    >
      {/* Improved lighting: Multiple light sources for better illumination */}
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

      {/* AR Plane Detection Visualization */}
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
                diffuseColor: 'rgba(0, 122, 255, 0.4)',
                lightingModel: 'Constant',
              },
            ]}
          />
        </ViroARPlaneSelector>
      )}

      {/* Render placed models */}
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
              <>
                {/* Visible cube */}
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
                {/* Invisible larger sphere hitbox for easier clicking from ~1m away */}
                <ViroSphere
                  position={[0, 0, 0]}
                  radius={0.3}
                  opacity={0}
                  onClick={() => {
                    console.log(
                      '🎯 Cube clicked:',
                      model.id,
                      model.type
                    );
                    onModelClick?.(model.id);
                  }}
                />
              </>
            ) : (
              <>
                {/* Visible 3D model */}
                <Viro3DObject
                  source={config.source}
                  type={config.type}
                  position={[0, 0, 0]}
                  scale={config.scale}
                  resources={config.resources}
                  lightReceivingBitMask={1}
                  shadowCastingBitMask={0}
                  highAccuracyEvents={true}
                  transformBehaviors={['billboardY']}
                  animation={undefined}
                  onLoadStart={() => setIsLoadingModel(true)}
                  onLoadEnd={() => setIsLoadingModel(false)}
                  onError={(event) => {
                    console.log('Model load error:', event);
                    setIsLoadingModel(false);
                  }}
                />
                {/* Invisible larger sphere hitbox for easier clicking from ~1m away */}
                <ViroSphere
                  position={[0, 0, 0]}
                  radius={0.5}
                  opacity={0}
                  onClick={() => {
                    console.log(
                      '🎯 3D Model clicked:',
                      model.id,
                      model.type
                    );
                    onModelClick?.(model.id);
                  }}
                />
              </>
            )}
          </ViroNode>
        );
      })}
    </ViroARScene>
  );
};
