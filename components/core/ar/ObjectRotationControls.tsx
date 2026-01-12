import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PlacedModel } from '../../../constants/ar-models';

interface ObjectRotationControlsProps {
  selectedObject: PlacedModel | null;
  onRotationChange: (
    modelId: number,
    axis: 'x' | 'y' | 'z',
    value: number
  ) => void;
  onScaleChange: (modelId: number, value: number) => void;
  onClose: () => void;
}

export const ObjectRotationControls = ({
  selectedObject,
  onRotationChange,
  onScaleChange,
  onClose,
}: ObjectRotationControlsProps) => {
  const [expandedAxis, setExpandedAxis] = useState<
    'x' | 'y' | 'z' | null
  >(null);

  if (!selectedObject) return null;

  const rotateAxis = (axis: 'x' | 'y' | 'z', degrees: number) => {
    const currentRotation =
      selectedObject.rotation[
        axis === 'x' ? 0 : axis === 'y' ? 1 : 2
      ] || 0;
    const newRotation = (currentRotation + degrees) % 360;
    onRotationChange(selectedObject.id, axis, newRotation);
  };

  const RotationAxis = ({
    axis,
    label,
    color,
  }: {
    axis: 'x' | 'y' | 'z';
    label: string;
    color: string;
  }) => {
    const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    const currentValue = selectedObject.rotation[axisIndex] || 0;

    return (
      <View style={styles.axisContainer}>
        <TouchableOpacity
          style={[
            styles.axisButton,
            { borderLeftColor: color },
            expandedAxis === axis && styles.axisButtonActive,
          ]}
          onPress={() =>
            setExpandedAxis(expandedAxis === axis ? null : axis)
          }
        >
          <Text style={styles.axisLabel}>{label}</Text>
          <Text style={styles.axisValue}>
            {Math.round(currentValue)}°
          </Text>
        </TouchableOpacity>

        {expandedAxis === axis && (
          <View style={styles.rotationControls}>
            <TouchableOpacity
              style={styles.rotateButton}
              onPress={() => rotateAxis(axis, -45)}
            >
              <Ionicons
                name="remove-circle"
                size={28}
                color="#FF6B6B"
              />
              <Text style={styles.rotateLabel}>-45°</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rotateButton}
              onPress={() => rotateAxis(axis, -15)}
            >
              <Ionicons name="play-back" size={24} color="#FFB800" />
              <Text style={styles.rotateLabel}>-15°</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rotateButton}
              onPress={() => rotateAxis(axis, 15)}
            >
              <Ionicons
                name="play-forward"
                size={24}
                color="#00C851"
              />
              <Text style={styles.rotateLabel}>+15°</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rotateButton}
              onPress={() => rotateAxis(axis, 45)}
            >
              <Ionicons name="add-circle" size={28} color="#33B5E5" />
              <Text style={styles.rotateLabel}>+45°</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.headerRow}>
        <View style={styles.header}>
          <Text style={styles.title}>Transform Object</Text>
          <Text style={styles.modelType}>
            {selectedObject.type.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons name="close-circle" size={28} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.axesContainer}>
        <RotationAxis axis="x" label="X" color="#FF6B6B" />
        <RotationAxis axis="y" label="Y" color="#00C851" />
        <RotationAxis axis="z" label="Z" color="#33B5E5" />
      </View>

      {/* Scale Controls */}
      <View style={styles.scaleSection}>
        <Text style={styles.scaleTitle}>Scale</Text>
        <View style={styles.scaleControls}>
          <TouchableOpacity
            style={styles.scaleButton}
            onPress={() => {
              const currentScale = selectedObject.scale[0] || 1;
              const newScale = Math.max(0.1, currentScale - 0.1);
              onScaleChange(selectedObject.id, newScale);
            }}
          >
            <Ionicons
              name="remove-circle"
              size={28}
              color="#FF6B6B"
            />
            <Text style={styles.scaleButtonText}>Shrink</Text>
          </TouchableOpacity>

          <View style={styles.scaleDisplayBox}>
            <Text style={styles.scaleValue}>
              {(selectedObject.scale[0] || 1).toFixed(2)}x
            </Text>
          </View>

          <TouchableOpacity
            style={styles.scaleButton}
            onPress={() => {
              const currentScale = selectedObject.scale[0] || 1;
              const newScale = Math.min(5, currentScale + 0.1);
              onScaleChange(selectedObject.id, newScale);
            }}
          >
            <Ionicons name="add-circle" size={28} color="#33B5E5" />
            <Text style={styles.scaleButtonText}>Grow</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>
          Tap an axis to expand rotation controls
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modelType: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  axesContainer: {
    gap: 8,
  },
  axisContainer: {
    marginBottom: 4,
  },
  axisButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftWidth: 4,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  axisButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  axisLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  axisValue: {
    fontSize: 12,
    color: '#aaa',
  },
  rotationControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  rotateButton: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  rotateLabel: {
    fontSize: 10,
    color: '#fff',
    marginTop: 2,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  hint: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  scaleSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  scaleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  scaleControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 8,
  },
  scaleButton: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  scaleButtonText: {
    fontSize: 10,
    color: '#fff',
    marginTop: 2,
  },
  scaleDisplayBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#33B5E5',
  },
});
