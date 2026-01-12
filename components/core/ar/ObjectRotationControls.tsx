import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PlacedModel } from '../../../constants/ar-models';
import { ObjectRotationControlsStyles } from '../../../assets/styles';

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
  onDelete: (modelId: number) => void;
  onClose: () => void;
}

export const ObjectRotationControls = ({
  selectedObject,
  onRotationChange,
  onScaleChange,
  onPositionChange,
  onReset,
  onDelete,
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
      <View style={ObjectRotationControlsStyles.axisContainer}>
        <TouchableOpacity
          style={[
            ObjectRotationControlsStyles.axisButton,
            { borderLeftColor: color },
            expandedAxis === axis &&
              ObjectRotationControlsStyles.axisButtonActive,
          ]}
          onPress={() =>
            setExpandedAxis(expandedAxis === axis ? null : axis)
          }
        >
          <Text style={ObjectRotationControlsStyles.axisLabel}>
            {label}
          </Text>
          <Text style={ObjectRotationControlsStyles.axisValue}>
            {Math.round(currentValue)}°
          </Text>
        </TouchableOpacity>

        {expandedAxis === axis && (
          <View style={ObjectRotationControlsStyles.rotationControls}>
            <TouchableOpacity
              style={ObjectRotationControlsStyles.rotateButton}
              onPress={() => rotateAxis(axis, -45)}
            >
              <Ionicons
                name="remove-circle"
                size={28}
                color="#FF6B6B"
              />
              <Text style={ObjectRotationControlsStyles.rotateLabel}>
                -45°
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ObjectRotationControlsStyles.rotateButton}
              onPress={() => rotateAxis(axis, -15)}
            >
              <Ionicons name="play-back" size={24} color="#FFB800" />
              <Text style={ObjectRotationControlsStyles.rotateLabel}>
                -15°
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ObjectRotationControlsStyles.rotateButton}
              onPress={() => rotateAxis(axis, 15)}
            >
              <Ionicons
                name="play-forward"
                size={24}
                color="#00C851"
              />
              <Text style={ObjectRotationControlsStyles.rotateLabel}>
                +15°
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ObjectRotationControlsStyles.rotateButton}
              onPress={() => rotateAxis(axis, 45)}
            >
              <Ionicons name="add-circle" size={28} color="#33B5E5" />
              <Text style={ObjectRotationControlsStyles.rotateLabel}>
                +45°
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={ObjectRotationControlsStyles.container}
      pointerEvents="box-none"
    >
      <View style={ObjectRotationControlsStyles.headerRow}>
        <View style={ObjectRotationControlsStyles.header}>
          <Text style={ObjectRotationControlsStyles.title}>
            {selectedObject.type.toUpperCase()}
          </Text>
        </View>
        <View style={ObjectRotationControlsStyles.headerActions}>
          <TouchableOpacity
            style={ObjectRotationControlsStyles.resetButton}
            onPress={() => onReset(selectedObject.id)}
          >
            <Ionicons name="refresh" size={18} color="#FFB800" />
          </TouchableOpacity>
          <TouchableOpacity
            style={ObjectRotationControlsStyles.deleteButton}
            onPress={() => onDelete(selectedObject.id)}
          >
            <Ionicons name="trash" size={18} color="#FF3B30" />
          </TouchableOpacity>
          <TouchableOpacity
            style={ObjectRotationControlsStyles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close-circle" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rotation Section - Collapsed by default */}
      <View style={ObjectRotationControlsStyles.section}>
        <TouchableOpacity
          style={ObjectRotationControlsStyles.sectionHeader}
          onPress={() => setExpandedAxis(expandedAxis ? null : 'x')}
        >
          <Ionicons
            name={expandedAxis ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color="#fff"
          />
          <Text style={ObjectRotationControlsStyles.sectionTitle}>
            Rotate
          </Text>
        </TouchableOpacity>
        {expandedAxis && (
          <View style={ObjectRotationControlsStyles.axesContainer}>
            <RotationAxis axis="x" label="X" color="#FF6B6B" />
            <RotationAxis axis="y" label="Y" color="#00C851" />
            <RotationAxis axis="z" label="Z" color="#33B5E5" />
          </View>
        )}
      </View>

      {/* Move Section */}
      <View style={ObjectRotationControlsStyles.section}>
        <Text style={ObjectRotationControlsStyles.sectionTitle}>
          Move
        </Text>
        <View style={ObjectRotationControlsStyles.moveControlsRow}>
          <View style={ObjectRotationControlsStyles.moveAxis}>
            <Ionicons name="arrow-back" size={14} color="#FF6B6B" />
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'x', -0.1)
              }
            >
              <Text style={ObjectRotationControlsStyles.moveButton}>
                ←
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'x', 0.1)
              }
            >
              <Text style={ObjectRotationControlsStyles.moveButton}>
                →
              </Text>
            </TouchableOpacity>
          </View>

          <View style={ObjectRotationControlsStyles.moveAxis}>
            <Ionicons name="arrow-up" size={14} color="#00C851" />
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'y', 0.1)
              }
            >
              <Text style={ObjectRotationControlsStyles.moveButton}>
                ↑
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'y', -0.1)
              }
            >
              <Text style={ObjectRotationControlsStyles.moveButton}>
                ↓
              </Text>
            </TouchableOpacity>
          </View>

          <View style={ObjectRotationControlsStyles.moveAxis}>
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
              <Text style={ObjectRotationControlsStyles.moveButton}>
                ⤶
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onPositionChange(selectedObject.id, 'z', 0.1)
              }
            >
              <Text style={ObjectRotationControlsStyles.moveButton}>
                ⤷
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scale Section */}
      <View style={ObjectRotationControlsStyles.section}>
        <Text style={ObjectRotationControlsStyles.sectionTitle}>
          Scale
        </Text>
        <View style={ObjectRotationControlsStyles.scaleControls}>
          <TouchableOpacity
            onPress={() => {
              const currentScale = selectedObject.scale[0] || 1;
              const newScale = Math.max(0.1, currentScale - 0.1);
              onScaleChange(selectedObject.id, newScale);
            }}
          >
            <Text style={ObjectRotationControlsStyles.moveButton}>
              −
            </Text>
          </TouchableOpacity>
          <View style={ObjectRotationControlsStyles.scaleDisplayBox}>
            <Text style={ObjectRotationControlsStyles.scaleValue}>
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
            <Text style={ObjectRotationControlsStyles.moveButton}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
