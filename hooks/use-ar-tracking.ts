import { ViroTrackingStateConstants } from '@reactvision/react-viro';
import { useEffect, useRef, useState } from 'react';

interface UseARTrackingProps {
  onARPlaneDetected: (anchor: any) => void;
}

export const useARTracking = ({
  onARPlaneDetected,
}: UseARTrackingProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [arError, setArError] = useState<string | null>(null);
  const [planesDetected, setPlanesDetected] = useState(false);
  const [detectedPlaneAnchors, setDetectedPlaneAnchors] = useState<
    any[]
  >([]);

  const trackingTimeoutRef = useRef<number | null>(null);
  const initializationStartRef = useRef<number>(Date.now());

  const resetTracking = () => {
    setIsTracking(false);
    setArError(null);
    setPlanesDetected(false);
    setDetectedPlaneAnchors([]);
    if (trackingTimeoutRef.current) {
      clearTimeout(trackingTimeoutRef.current);
      trackingTimeoutRef.current = null;
    }
  };

  const onInitialized = (state: any, reason: any) => {
    const elapsedTime = (
      (Date.now() - initializationStartRef.current) /
      1000
    ).toFixed(1);

    const stateNames: Record<number, string> = {
      1: 'TRACKING_UNAVAILABLE',
      2: 'TRACKING_LIMITED',
      3: 'TRACKING_NORMAL',
    };
    const stateName = stateNames[state] || `UNKNOWN(${state})`;

    console.log(
      `⏱️  [${elapsedTime}s] AR State: ${stateName} (${state}), Reason: ${reason}`
    );

    if (trackingTimeoutRef.current) {
      clearTimeout(trackingTimeoutRef.current);
      trackingTimeoutRef.current = null;
    }

    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log('✅ AR Tracking NORMAL achieved');
      setIsTracking(true);
      setArError(null);
    } else if (
      state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE
    ) {
      console.warn(
        '⚠️ AR UNAVAILABLE - giving ARCore more time to initialize...'
      );
      setIsTracking(false);

      // Increase this to 15 or 20 seconds
      trackingTimeoutRef.current = setTimeout(() => {
        // Extra check: If it reached NORMAL in the meantime, don't set error
        if (!isTracking) {
          console.error('❌ AR still unavailable after 15s');
          setArError(
            'Không thể theo dõi AR. Vui lòng di chuyển thiết bị...'
          );
        }
      }, 15000);
    } else if (
      state === ViroTrackingStateConstants.TRACKING_LIMITED
    ) {
      console.warn('⚠️  AR Tracking LIMITED - need more features');
      setIsTracking(true);
    }
  };

  const handleARPlaneDetected = (anchor: any) => {
    console.log('🔍 AR Plane detected:', {
      position: anchor?.position,
      center: anchor?.center,
      extent: anchor?.extent,
      alignment: anchor?.alignment,
    });

    if (!planesDetected) {
      setPlanesDetected(true);
    }

    if (anchor?.position) {
      setDetectedPlaneAnchors((prev) => {
        const updated = [...prev, anchor];
        return updated.slice(-10);
      });
    }

    onARPlaneDetected(anchor);
  };

  useEffect(() => {
    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    arError,
    planesDetected,
    detectedPlaneAnchors,
    onInitialized,
    handleARPlaneDetected,
    resetTracking,
  };
};
