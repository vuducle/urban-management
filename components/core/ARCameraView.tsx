import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Camera } from 'expo-camera';

import ErrorBoundary from '../ErrorBoundary';
import ARModelView from './ARModelView';

export default function ARCameraView({
  onClose,
}: {
  onClose: () => void;
}) {
  const viewRef = useRef<View>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [isARReady, setIsARReady] = useState(false);

  // Initialize camera and AR
  useEffect(() => {
    console.log('🚀 ARCameraView mounted');
    requestCameraPermission();

    if (Platform.OS === 'android') {
      console.log('📱 Checking ARCore availability...');
    }

    const arReadyTimer = setTimeout(() => setIsARReady(true), 500);

    return () => {
      clearTimeout(arReadyTimer);
      setIsARReady(false);
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');

      if (status !== 'granted') {
        Alert.alert(
          'Yêu cầu quyền truy cập camera',
          'Tính năng AR yêu cầu quyền truy cập camera.',
          [
            { text: 'Cancel', onPress: onClose, style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                Linking.openSettings();
                onClose();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      Alert.alert('Error', 'Could not request camera permission');
    }
  };

  // Show loading screen while waiting for permissions and AR initialization
  if (hasCameraPermission === null || !isARReady) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.loadingText}>Đang khởi tạo AR...</Text>
        </View>
      </View>
    );
  }

  // Show error if camera permission denied
  if (hasCameraPermission === false) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Camera permission is required for AR features
          </Text>
        </View>
      </View>
    );
  }

  // Show Model View
  return (
    <View style={styles.fullScreen} ref={viewRef} collapsable={false}>
      <ErrorBoundary
        onError={(error) => {
          console.error('🚨 ARModelView CRASHED:', error.message);
          Alert.alert('Model Mode Error', error.message);
          setTimeout(() => onClose(), 100);
        }}
      >
        <ARModelView onClose={onClose} />
      </ErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
