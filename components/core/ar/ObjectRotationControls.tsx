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
  onPositionChange: (
    modelId: number,
    axis: 'x' | 'y' | 'z',
    delta: number
  ) => void;
  onReset: (modelId: number) => void;
  onClose: () => void;
}

export const ObjectRotationControls = ({
  selectedObject,
  onRotationChange,
  onScaleChange,
  onPositionChange,
  onReset,
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
          <Text style={styles.title}>
            {selectedObject.type.toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => onReset(selectedObject.id)}
          >
            <Ionicons name="refresh" size={18} color="#FFB800" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close-circle" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rotation Section - Collapsed by default */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setExpandedAxis(expandedAxis ? null : 'x')}
        >
          <Ionicons
            name={expandedAxis ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color="#fff"
          />
          <Text style={styles.sectionTitle}>Rotate</Text>
        </TouchableOpacity>
        {expandedAxis && (
          <View style={styles.axesContainer}>
            <RotationAxis axis="x" label="X" color="#FF6B6B" />
            <RotationAxis axis="y" label="Y" color="#00C851" />
            <RotationAxis axis="z" label="Z" color="#33B5E5" />
          </View>
        )}
      </View>

      {/* Move Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Move</Text>
        <View style={styles.moveControlsRow}>
          <View style={styles.moveAxis}>
            <Ionicons name="arrow-back" size={14} color="#FF6B6B" />
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'x', -0.1)
              }
            >
              <Text style={styles.moveButton}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'x', 0.1)
              }
            >
              <Text style={styles.moveButton}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.moveAxis}>
            <Ionicons name="arrow-up" size={14} color="#00C851" />
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'y', 0.1)
              }
            >
              <Text style={styles.moveButton}>↑</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'y', -0.1)
              }
            >
              <Text style={styles.moveButton}>↓</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.moveAxis}>
            <Ionicons
              name="swap-horizontal"
              size={14}
              color="#33B5E5"
            />
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'z', -0.1)
              }
            >
              <Text style={styles.moveButton}>⤶</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'z', 0.1)
              }
            >
              <Text style={styles.moveButton}>⤷</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scale Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scale</Text>
        <View style={styles.scaleControls}>
          <TouchableOpacity
            onPress={() => {
              const currentScale = selectedObject.scale[0] || 1;
              const newScale = Math.max(0.1, currentScale - 0.1);
              onScaleChange(selectedObject.id, newScale);
            }}
          >
            <Text style={styles.moveButton}>−</Text>
          </TouchableOpacity>
          <View style={styles.scaleDisplayBox}>
            <Text style={styles.scaleValue}>
              {(selectedObject.scale[0] || 1).toFixed(1)}x
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              const currentScale = selectedObject.scale[0] || 1;
              const newScale = Math.min(5, currentScale + 0.1);
              onScaleChange(selectedObject.id, newScale);
            }}
          >
            <Text style={styles.moveButton}>+</Text>
          </TouchableOpacity>
        </View>
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
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetButton: {
    padding: 4,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  axesContainer: {
    gap: 4,
    marginTop: 4,
  },
  axisContainer: {
    marginBottom: 2,
  },
  axisButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftWidth: 3,
    padding: 6,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  axisButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  axisLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  axisValue: {
    fontSize: 11,
    color: '#aaa',
  },
  rotationControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  rotateButton: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  rotateLabel: {
    fontSize: 9,
    color: '#fff',
    marginTop: 1,
  },
  moveControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
    marginTop: 6,
  },
  moveAxis: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  moveButton: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    minWidth: 32,
    textAlign: 'center',
  },
  scaleControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  scaleDisplayBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  scaleValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#33B5E5',
  },
});
