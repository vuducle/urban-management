import { Platform } from 'react-native';

/**
 * Diagnostic utility for AR screenshot capture on Android 15+
 * Helps identify which capture method will work on the device
 */
export const useARScreenshotDebug = () => {
  const getDeviceInfo = () => {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      isAndroid: Platform.OS === 'android',
      isAndroid13Plus:
        Platform.OS === 'android' && Platform.Version >= 33,
      isAndroid15Plus:
        Platform.OS === 'android' && Platform.Version >= 35,
    };
  };

  const logCaptureMethods = () => {
    const info = getDeviceInfo();
    console.log('📱 Device Info:', {
      os: info.platform,
      apiLevel: info.version,
      supportsPixelCopy: info.isAndroid13Plus,
      needsDRM_AWARE: info.isAndroid15Plus,
    });

    console.log('📷 Available Capture Methods:');
    if (info.isAndroid) {
      console.log(
        '  ✅ Method A: Native PixelCopy (Recommended) - Requires Android 7.0+ (API 24+)'
      );
      if (info.isAndroid15Plus) {
        console.log(
          '     💡 Tip: On Android 15, PixelCopy may fail on Samsung S21 Ultra due to hardware protection'
        );
        console.log(
          '     🔧 Workaround: Check logcat for "ERROR_SOURCE_INVALID" error code'
        );
      }
      console.log(
        '  ⚠️  Method B: ViewShot Fallback - UI overlay only, no AR content'
      );
    } else {
      console.log(
        '  ℹ️  iOS: Standard screenshot using react-native-view-shot'
      );
    }
  };

  const analyzePixelCopyError = (errorCode: number): string => {
    const errors: Record<number, string> = {
      0: 'SUCCESS - Screenshot captured successfully',
      1: "ERROR_SOURCE_INVALID - SurfaceView invalid or doesn't support PixelCopy. Check if ViroReact is rendering.",
      2: 'ERROR_TIMEOUT - GPU timeout. ARCore may be still initializing. Try again.',
      3: 'CODE_3 (Samsung/Android 15) - Hardware protection detected. Try disabling Samsung Knox in Developer Options.',
    };
    return (
      errors[errorCode] ||
      `UNKNOWN_ERROR - Code: ${errorCode}. May be Samsung/Android 15 extended error. Check Android logs with: adb logcat | grep AR_SHOT`
    );
  };

  return {
    getDeviceInfo,
    logCaptureMethods,
    analyzePixelCopyError,
  };
};
