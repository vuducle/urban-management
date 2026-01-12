import { useState } from 'react';
import { Alert } from 'react-native';
import {
  ModelType,
  PlacedModel,
  MODEL_CONFIGS,
} from '../constants/ar-models';

interface UseARPlacementProps {
  isTracking: boolean;
  planesDetected: boolean;
  detectedPlaneAnchors: any[];
  cameraPositionRef: React.MutableRefObject<any>;
}

export const useARPlacement = ({
  isTracking,
  planesDetected,
  detectedPlaneAnchors,
  cameraPositionRef,
}: UseARPlacementProps) => {
  const [placedModels, setPlacedModels] = useState<PlacedModel[]>([]);
  const [selectedModel, setSelectedModel] =
    useState<ModelType>('cube');

  /**
   * Calculate the intersection point of the camera's forward ray with detected planes
   * and return the closest intersection point to the camera.
   */
  const calculateRayPlaneIntersection = (
    camPos: number[],
    camForward: number[]
  ): number[] | null => {
    let closestIntersection: number[] | null = null;
    let closestDistance = Infinity;

    for (const plane of detectedPlaneAnchors) {
      if (!plane.position || !plane.center) continue;

      const planeY = plane.position[1];
      const denominator = camForward[1];

      if (Math.abs(denominator) < 0.0001) continue;

      const t = (planeY - camPos[1]) / denominator;
      if (t < 0) continue;

      const intersection = [
        camPos[0] + camForward[0] * t,
        planeY,
        camPos[2] + camForward[2] * t,
      ];

      const distance = Math.sqrt(
        Math.pow(intersection[0] - camPos[0], 2) +
          Math.pow(intersection[1] - camPos[1], 2) +
          Math.pow(intersection[2] - camPos[2], 2)
      );


      if (distance < closestDistance) {
        closestDistance = distance;
        closestIntersection = intersection;
      }
    }

    return closestIntersection;
  };

  /**
   * Place model in front of the camera at a default distance and height
   * if no plane intersection is found.
   */
  const placeFallback = () => {
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

  /**
   * Place the selected model at the specified position
   * with appropriate rotation based on model type.
   */
  const placeModel = (position: number[]) => {
    try {
      console.log('🔧 placeModel called with position:', position);

      let rotation = [0, 0, 0];
      if (selectedModel === 'pipeline') {
        rotation = [0, 0, 0];
      }

      const newModel: PlacedModel = {
        id: Date.now(),
        position,
        rotation,
        scale: [1, 1, 1],
        type: selectedModel,
      };

      console.log('✅ Model created:', {
        type: newModel.type,
        position: newModel.position,
        rotation: newModel.rotation,
        id: newModel.id,
      });

      setPlacedModels((prev) => {
        const updated = [...prev, newModel];
        console.log(
          '📦 Models state updated, count:',
          updated.length
        );
        return updated;
      });
    } catch (error) {
      console.error('❌ CRASH in placeModel:', error);
      Alert.alert('Lỗi', 'Không thể đặt mô hình. Vui lòng thử lại.');
    }
  };

  /**
   * Handle adding a new object in AR scene
   * with robust checks and fallbacks.
   */
  const handleAddObject = async () => {
    try {
      console.log(
        '🎯 handleAddObject called at:',
        new Date().toISOString()
      );
      console.log('📊 Pre-check state:', {
        isTracking,
        planesDetected,
        modelCount: placedModels.length,
      });

      if (!isTracking) {
        console.log('⚠️  Not tracking - showing alert');
        Alert.alert('Vui lòng đợi', 'AR đang khởi tạo...');
        return;
      }

      console.log('➕ Adding object:', {
        selectedModel,
        planesDetected,
        planeCount: detectedPlaneAnchors.length,
        hasCamera: !!cameraPositionRef.current,
      });

      if (!planesDetected) {
        Alert.alert(
          'Tìm kiếm bề mặt',
          'Di chuyển thiết bị để phát hiện mặt phẳng (bật biểu tượng mắt để xem mặt phẳng)'
        );
        return;
      }

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

        const closestIntersection = calculateRayPlaneIntersection(
          camPos,
          camForward
        );

        if (closestIntersection) {
          console.log(
            '✅ Using intersection at:',
            closestIntersection
          );
          placeModel(closestIntersection);
        } else {
          console.warn('⚠️ No valid intersection, using fallback');
          placeFallback();
        }
      } else {
        console.warn('⚠️ No camera or planes available');
        placeFallback();
      }
    } catch (error) {
      console.error('❌ CRASH in handleAddObject:', error);
      Alert.alert(
        'Lỗi',
        'Không thể thêm đối tượng. Vui lòng thử lại.'
      );
    }
  };

  const handleUndo = () =>
    setPlacedModels((prev) => prev.slice(0, -1));

  /**
   * Update the rotation of the specified model
   * on the given axis.
   */
  const updateModelRotation = (
    modelId: number,
    axis: 'x' | 'y' | 'z',
    value: number
  ) => {
    const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;

    setPlacedModels((prev) =>
      prev.map((model) => {
        if (model.id === modelId) {
          const newRotation = [...model.rotation];
          newRotation[axisIndex] = value;
          console.log(
            `🔄 Updated ${axis} axis to ${value}° for model ${modelId}`,
            newRotation
          );
          return { ...model, rotation: newRotation };
        }
        return model;
      })
    );
  };

  /**
   * Update the scale of the specified model
   * uniformly across all axes.
   */
  const updateModelScale = (modelId: number, value: number) => {
    setPlacedModels((prev) =>
      prev.map((model) => {
        if (model.id === modelId) {
          const newScale = [value, value, value];
          console.log(
            `📏 Updated scale to ${value} for model ${modelId}`,
            newScale
          );
          return { ...model, scale: newScale };
        }
        return model;
      })
    );
  };

  /**
   * Update the position of the specified model
   * on the given axis by a delta amount.
   */
  const updateModelPosition = (
    modelId: number,
    axis: 'x' | 'y' | 'z',
    delta: number
  ) => {
    const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;

    setPlacedModels((prev) =>
      prev.map((model) => {
        if (model.id === modelId) {
          const newPosition = [...model.position];
          newPosition[axisIndex] += delta;
          console.log(
            `📍 Moved ${axis} axis by ${delta} for model ${modelId}`,
            newPosition
          );
          return { ...model, position: newPosition };
        }
        return model;
      })
    );
  };

  /**
   * Reset the transform (position, rotation, scale) of the specified model
   *
   */
  const resetModelTransform = (modelId: number) => {
    setPlacedModels((prev) =>
      prev.map((model) => {
        if (model.id === modelId) {
          const config = MODEL_CONFIGS[model.type];
          console.log(`🔄 Reset transform for model ${modelId}`, {
            rotation: [0, 0, 0],
            scale: config.scale,
          });
          return {
            ...model,
            rotation: [0, 0, 0],
            scale: config.scale,
          };
        }
        return model;
      })
    );
  };

  const deleteModel = (modelId: number) => {
    setPlacedModels((prev) =>
      prev.filter((model) => model.id !== modelId)
    );
    console.log(`🗑️ Deleted model ${modelId}`);
  };

  return {
    placedModels,
    selectedModel,
    setSelectedModel,
    handleAddObject,
    handleUndo,
    updateModelRotation,
    updateModelScale,
    updateModelPosition,
    resetModelTransform,
    deleteModel,
  };
};
