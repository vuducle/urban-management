// AR Model configurations and types
export type ModelType = 'cube' | 'pipeline';

export interface PlacedModel {
  id: number;
  position: number[];
  rotation: number[];
  scale: number[];
  type: ModelType;
}

export interface ModelConfig {
  source: any;
  type: 'OBJ' | 'GLB' | 'GLTF' | 'VRX';
  scale: number[];
  resources?: any[];
}

export const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  cube: {
    source: undefined,
    type: 'GLB',
    scale: [0.3, 0.3, 0.3],
  },
  pipeline: {
    source: require('../assets/models/pipeline/pipeline.glb'),
    type: 'GLB',
    scale: [0.01, 0.01, 0.01],
  }
};
