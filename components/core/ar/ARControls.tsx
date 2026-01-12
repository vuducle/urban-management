import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ModelType } from '../../../constants/ar-models';

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
    <View style={styles.bottomControls} pointerEvents="box-none">
      {/* Undo Button */}
      <TouchableOpacity
        style={styles.sideButton}
        onPress={onUndo}
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

      {/* Main Add Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          !isTracking && styles.disabledButton,
        ]}
        onPress={onAddObject}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>

      {/* Model Selector */}
      <View style={styles.modelSelector}>
        {(['cube', 'pipeline'] as ModelType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.modelBtn,
              selectedModel === type && styles.modelBtnActive,
            ]}
            onPress={() => onSelectModel(type)}
          >
            <Text style={styles.modelBtnText}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Screenshot Button */}
      <TouchableOpacity
        style={styles.sideButton}
        onPress={onTakeScreenshot}
        disabled={placedModels.length === 0}
      >
        <Ionicons
          name="camera"
          size={24}
          color="white"
          style={{ opacity: placedModels.length ? 1 : 0.4 }}
        />
        <Text style={styles.buttonLabel}>Lưu ảnh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  disabledButton: {
    backgroundColor: '#555',
  },
  sideButton: {
    alignItems: 'center',
    width: 60,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
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
  modelBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
