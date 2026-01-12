import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ModelType } from '../../../constants/ar-models';
import { ARControlsStyles } from '../../styles';

interface ARControlsProps {
  placedModels: any[];
  isTracking: boolean;
  selectedModel: ModelType;
  isCapturing: boolean;
  onAddObject: () => void;
  onUndo: () => void;
  onSelectModel: (model: ModelType) => void;
  onTakeScreenshot: () => void;
}

export const ARControls = ({
  placedModels,
  isTracking,
  selectedModel,
  isCapturing,
  onAddObject,
  onUndo,
  onSelectModel,
  onTakeScreenshot,
}: ARControlsProps) => {
  if (isCapturing) return null;

  return (
    <View
      style={ARControlsStyles.bottomControls}
      pointerEvents="box-none"
    >
      {/* Undo Button */}
      <TouchableOpacity
        style={ARControlsStyles.sideButton}
        onPress={onUndo}
        disabled={placedModels.length === 0}
      >
        <Ionicons
          name="arrow-undo"
          size={24}
          color="white"
          style={{ opacity: placedModels.length ? 1 : 0.4 }}
        />
        <Text style={ARControlsStyles.buttonLabel}>Hoàn tác</Text>
      </TouchableOpacity>

      {/* Main Add Button */}
      <TouchableOpacity
        style={[
          ARControlsStyles.addButton,
          !isTracking && ARControlsStyles.disabledButton,
        ]}
        onPress={onAddObject}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>

      {/* Model Selector */}
      <View style={ARControlsStyles.modelSelector}>
        {(['cube', 'pipeline'] as ModelType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              ARControlsStyles.modelBtn,
              selectedModel === type &&
                ARControlsStyles.modelBtnActive,
            ]}
            onPress={() => onSelectModel(type)}
          >
            <Text style={ARControlsStyles.modelBtnText}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Screenshot Button */}
      <TouchableOpacity
        style={ARControlsStyles.sideButton}
        onPress={onTakeScreenshot}
        disabled={placedModels.length === 0}
      >
        <Ionicons
          name="camera"
          size={24}
          color="white"
          style={{ opacity: placedModels.length ? 1 : 0.4 }}
        />
        <Text style={ARControlsStyles.buttonLabel}>Lưu ảnh</Text>
      </TouchableOpacity>
    </View>
  );
};
