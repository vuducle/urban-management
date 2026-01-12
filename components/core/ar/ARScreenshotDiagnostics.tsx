import React, { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useARScreenshotDebug } from '../../../hooks/use-ar-screenshot-debug';

interface ARScreenshotDiagnosticsProps {
  visible?: boolean;
  onDismiss?: () => void;
}

/**
 * Development diagnostic panel for AR screenshot capture
 * Shows available methods, device info, and test buttons
 *
 * Usage:
 * ```tsx
 * <ARScreenshotDiagnostics visible={debugMode} onDismiss={() => setDebugMode(false)} />
 * ```
 */
export const ARScreenshotDiagnostics: React.FC<
  ARScreenshotDiagnosticsProps
> = ({ visible = false, onDismiss }) => {
  const { getDeviceInfo, logCaptureMethods } = useARScreenshotDebug();

  useEffect(() => {
    if (visible) {
      console.log('\n🔧 ARScreenshot Diagnostics Panel Opened\n');
      logCaptureMethods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const deviceInfo = getDeviceInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AR Screenshot Diagnostics</Text>
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Device Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Device Info</Text>
          <View style={styles.infoBox}>
            <InfoRow
              label="Platform"
              value={deviceInfo.platform.toUpperCase()}
            />
            <InfoRow
              label="API Level"
              value={`${deviceInfo.version}`}
            />
            <InfoRow
              label="PixelCopy Support"
              value={
                deviceInfo.isAndroid13Plus
                  ? '✅ Yes'
                  : '❌ No (API 24+ required)'
              }
            />
            <InfoRow
              label="Android 15+"
              value={deviceInfo.isAndroid15Plus ? '⚠️ Yes' : '✅ No'}
            />
          </View>
        </View>

        {/* Capture Methods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📷 Capture Methods</Text>

          <View
            style={[
              styles.methodBox,
              deviceInfo.isAndroid
                ? styles.methodActive
                : styles.methodInactive,
            ]}
          >
            <Text
              style={[
                styles.methodTitle,
                deviceInfo.isAndroid
                  ? styles.methodTitleActive
                  : styles.methodTitleInactive,
              ]}
            >
              Method A: Native PixelCopy (Recommended)
            </Text>
            <Text style={styles.methodDesc}>
              {deviceInfo.isAndroid
                ? '✅ Available on this device'
                : '❌ Android only'}
            </Text>
            <Text style={styles.methodDetail}>
              Direct GL frame buffer capture. Full AR content
              preserved.
            </Text>
            {deviceInfo.isAndroid15Plus && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  ⚠️ Note: May fail on Samsung S21 Ultra with error:
                  &quot;ERROR_SOURCE_INVALID&quot;
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.methodBox, styles.methodActive]}>
            <Text
              style={[styles.methodTitle, styles.methodTitleActive]}
            >
              Method B: ViewShot Fallback
            </Text>
            <Text style={styles.methodDesc}>
              ✅ Available on all platforms
            </Text>
            <Text style={styles.methodDetail}>
              UI overlay only. AR content will be transparent.
            </Text>
          </View>
        </View>

        {/* Common Issues Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Common Issues</Text>

          <View style={styles.issueBox}>
            <Text style={styles.issueName}>
              ERROR_SOURCE_INVALID (Android 15, Samsung)
            </Text>
            <Text style={styles.issueDesc}>
              Cause: ViroReact GLSurfaceView is not rendering or
              hardware protection is blocking access.
            </Text>
            <Text style={styles.issueDesc}>
              Solution: (1) Verify AR is initialized (check isTracking
              state) (2) Disable Samsung Knox protection in dev
              settings (3) Try on a different device
            </Text>
          </View>

          <View style={styles.issueBox}>
            <Text style={styles.issueName}>ERROR_TIMEOUT</Text>
            <Text style={styles.issueDesc}>
              Cause: ARCore is still calibrating or GPU is too busy.
            </Text>
            <Text style={styles.issueDesc}>
              Solution: Wait for AR tracking to stabilize. Check
              isTracking before calling capture.
            </Text>
          </View>

          <View style={styles.issueBox}>
            <Text style={styles.issueName}>
              No GLSurfaceView Found
            </Text>
            <Text style={styles.issueDesc}>
              Cause: ViroReact failed to initialize or view is hidden.
            </Text>
            <Text style={styles.issueDesc}>
              Solution: Check console logs. Verify
              ViroARSceneNavigator is mounted and visible.
            </Text>
          </View>
        </View>

        {/* Debug Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Debug Logs</Text>
          <View style={styles.debugBox}>
            <Text style={styles.debugText}>
              Check Android Studio logcat for tags:
            </Text>
            <Text style={[styles.debugText, styles.code]}>
              AR_SHOT
            </Text>
            <Text style={styles.debugText}>Example filter:</Text>
            <Text style={[styles.debugText, styles.code]}>
              adb logcat | grep AR_SHOT
            </Text>
          </View>
        </View>

        {/* Test Button */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            Alert.alert(
              'Test PixelCopy',
              'This would call MyArScreenshot.captureScreen() in a real integration.\n\nCheck console output and logcat for: AR_SHOT'
            );
          }}
        >
          <Text style={styles.testButtonText}>🧪 Test Capture</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 10000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#999',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  methodBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  methodActive: {
    borderLeftColor: '#4CAF50',
  },
  methodInactive: {
    borderLeftColor: '#666',
    opacity: 0.6,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  methodTitleActive: {
    color: '#4CAF50',
  },
  methodTitleInactive: {
    color: '#999',
  },
  methodDesc: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 4,
  },
  methodDetail: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  warningBox: {
    backgroundColor: '#332200',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 11,
    color: '#FFB74D',
  },
  issueBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  issueName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 6,
  },
  issueDesc: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 4,
    lineHeight: 18,
  },
  debugBox: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  debugText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 6,
    fontFamily: 'Menlo',
  },
  code: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
  testButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  spacer: {
    height: 20,
  },
});
