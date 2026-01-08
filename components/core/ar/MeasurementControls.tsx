import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface MeasurementControlsProps {
  isTracking: boolean;
  pointsCount: number;
  onAddPoint: () => void;
  onSwitchMode: () => void;
  onSaveScreenshot: () => void;
}

export const MeasurementControls = ({
  isTracking,
  pointsCount,
  onAddPoint,
  onSwitchMode,
  onSaveScreenshot,
}: MeasurementControlsProps) => {
  return (
    <View style={styles.bottomBar} pointerEvents="auto">
      {!isTracking ? (
        <View style={styles.instructionPanel}>
          <Text style={styles.instructionText}>
            Di chuyển thiết bị để quét các khu vực cần thiết.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.instructionPanel}>
            {pointsCount === 0 && (
              <Text style={styles.instructionText}>
                Nhắm vào điểm bắt đầu, sau đó nhấn +
              </Text>
            )}
            {pointsCount === 1 && (
              <Text style={styles.instructionText}>
                Nhắm vào điểm kết thúc, sau đó nhấn +
              </Text>
            )}
            {pointsCount === 2 && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={onSaveScreenshot}
              >
                <Ionicons
                  name="download-outline"
                  size={20}
                  color="white"
                />
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
            )}
          </View>

          {pointsCount < 2 && (
            <TouchableOpacity
              style={styles.addPointButton}
              onPress={onAddPoint}
            >
              <Ionicons name="add" size={32} color="#333" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  instructionPanel: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  addPointButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
