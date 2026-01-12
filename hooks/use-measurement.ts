import { useState } from 'react';

export interface MeasurementPoint {
  id: number;
  position: number[];
}

export const useMeasurement = () => {
  const [points, setPoints] = useState<MeasurementPoint[]>([]);
  const [distance, setDistance] = useState<number>(0);

  const addPoint = (position: number[]) => {
    const newPoint: MeasurementPoint = {
      id: Date.now(),
      position,
    };

    setPoints((prev) => {
      const updated = [...prev, newPoint];

      // Calculate distance if we have 2 points
      if (updated.length === 2) {
        const [x1, y1, z1] = updated[0].position;
        const [x2, y2, z2] = updated[1].position;

        const dist = Math.sqrt(
          Math.pow(x2 - x1, 2) +
            Math.pow(y2 - y1, 2) +
            Math.pow(z2 - z1, 2)
        );

        setDistance(dist);
      }

      return updated;
    });
  };

  const resetMeasurement = () => {
    setPoints([]);
    setDistance(0);
  };

  const removeLast = () => {
    setPoints((prev) => {
      const updated = prev.slice(0, -1);
      if (updated.length < 2) {
        setDistance(0);
      }
      return updated;
    });
  };

  return {
    points,
    distance,
    addPoint,
    resetMeasurement,
    removeLast,
  };
};

export const formatDistance = (meters: number): string => {
  if (meters < 1) return `${(meters * 100).toFixed(0)} cm`;
  return `${meters.toFixed(2)} m`;
};
