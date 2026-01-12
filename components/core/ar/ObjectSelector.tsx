import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
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
      case 'tv':
        return 'tv-outline';
      case 'leon':
        return 'person-outline';
      default:
        return 'shapes-outline';
    }
  };

  const getModelName = (model: PlacedModel) => {
    const config = MODEL_CONFIGS[model.type];
    return `${config.type} #${model.id}`;
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Ionicons
          name={isExpanded ? 'chevron-down' : 'list'}
          size={24}
          color="#fff"
        />
        <Text style={styles.toggleText}>
          {isExpanded ? 'Ẩn' : `Đối tượng (${placedModels.length})`}
        </Text>
      </TouchableOpacity>

      {/* Object List */}
      {isExpanded && (
        <View style={styles.listContainer}>
          <ScrollView style={styles.scrollView}>
            {placedModels.map((model) => {
              const isSelected = model.id === selectedObjectId;
              return (
                <TouchableOpacity
                  key={model.id}
                  style={[
                    styles.objectItem,
                    isSelected && styles.objectItemSelected,
                  ]}
                  onPress={() =>
                    onSelectObject(isSelected ? null : model.id)
                  }
                >
                  <View style={styles.objectInfo}>
                    <Ionicons
                      name={getModelIcon(model.type) as any}
                      size={20}
                      color={isSelected ? '#fff' : '#007AFF'}
                    />
                    <Text
                      style={[
                        styles.objectName,
                        isSelected && styles.objectNameSelected,
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120,
    right: 16,
    alignItems: 'flex-end',
    maxHeight: 400,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: 300,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollView: {
    maxHeight: 300,
  },
  objectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  objectItemSelected: {
    backgroundColor: '#007AFF',
  },
  objectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  objectName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  objectNameSelected: {
    color: '#fff',
  },
});
