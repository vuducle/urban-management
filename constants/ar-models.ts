// AR Model configurations and types
export type ModelType = 'cube' | 'leon' | 'tv' | 'house';

export interface PlacedModel {
  id: number;
  position: number[];
  rotation: number[];
  scale: number[];
  type: ModelType;
}

export interface ModelConfig {
  source: any;
  type: 'OBJ' | 'GLB' | 'GLTF2' | 'VRX';
  scale: number[];
  resources?: any[];
}

export const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  cube: {
    source: undefined,
    type: 'GLB',
    scale: [0.3, 0.3, 0.3],
  },
  leon: {
    source: require('../assets/models/leon_s_kennedy.obj'),
    type: 'OBJ',
    scale: [1, 1, 1],
  },
  tv: {
    source: require('../assets/models/crt_tv.glb'),
    type: 'GLB',
    scale: [0.1, 0.1, 0.1],
  },
  house: {
    source: require('../assets/models/leon_s_kennedy.glb'),
    type: 'GLB',
    scale: [1, 1, 1],
  },
};
