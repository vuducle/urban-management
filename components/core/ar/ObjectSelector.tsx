import { Ionicons } from '@expo/vector-icons';
import { ObjectSelectorStyles } from '../../../assets/styles';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  MODEL_CONFIGS,
  PlacedModel,
} from '../../../constants/ar-models';

interface ObjectSelectorProps {
  placedModels: PlacedModel[];
  selectedObjectId: number | null;
  onSelectObject: (modelId: number | null) => void;
}

export const ObjectSelector = ({
  placedModels,
  selectedObjectId,
  onSelectObject,
}: ObjectSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (placedModels.length === 0) return null;

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'cube':
        return 'cube-outline';
      case 'pipeline':
        return 'git-network-outline';
      default:
        return 'shapes-outline';
    }
  };

  const getModelName = (model: PlacedModel) => {
    const config = MODEL_CONFIGS[model.type];
    return `${config.type} #${model.id}`;
  };

  return (
    <View
      style={ObjectSelectorStyles.container}
      pointerEvents="box-none"
    >
      {/* Toggle Button */}
      <TouchableOpacity
        style={ObjectSelectorStyles.toggleButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Ionicons
          name={isExpanded ? 'chevron-down' : 'list'}
          size={24}
          color="#fff"
        />
        <Text style={ObjectSelectorStyles.toggleText}>
          {isExpanded ? 'Ẩn' : `Đối tượng (${placedModels.length})`}
        </Text>
      </TouchableOpacity>

      {/* Object List */}
      {isExpanded && (
        <View style={ObjectSelectorStyles.listContainer}>
          <ScrollView style={ObjectSelectorStyles.scrollView}>
            {placedModels.map((model) => {
              const isSelected = model.id === selectedObjectId;
              return (
                <TouchableOpacity
                  key={model.id}
                  style={[
                    ObjectSelectorStyles.objectItem,
                    isSelected &&
                      ObjectSelectorStyles.objectItemSelected,
                  ]}
                  onPress={() =>
                    onSelectObject(isSelected ? null : model.id)
                  }
                >
                  <View style={ObjectSelectorStyles.objectInfo}>
                    <Ionicons
                      name={getModelIcon(model.type) as any}
                      size={20}
                      color={isSelected ? '#fff' : '#007AFF'}
                    />
                    <Text
                      style={[
                        ObjectSelectorStyles.objectName,
                        isSelected &&
                          ObjectSelectorStyles.objectNameSelected,
                      ]}
                    >
                      {getModelName(model)}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#fff"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
