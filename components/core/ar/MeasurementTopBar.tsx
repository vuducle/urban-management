import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatDistance } from '../../../hooks/use-measurement';

interface MeasurementTopBarProps {
  mode: string;
  points: any[];
  distance: number;
  onClose: () => void;
  onReset: () => void;
}

export const MeasurementTopBar = ({
  mode,
  points,
  distance,
  onClose,
  onReset,
}: MeasurementTopBarProps) => {
  return (
    <View style={styles.distanceDisplay} pointerEvents="none">
      <Text style={styles.measurementText}>
        {formatDistance(distance)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  distanceDisplay: {
    position: 'absolute',
    top: 150,
    left: '50%',
    transform: [{ translateX: '-50%' }],
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    zIndex: 100,
  },
  measurementText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
