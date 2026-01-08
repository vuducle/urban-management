// Reexport the native module. On web, it will be resolved to MyArScreenshotModule.web.ts
// and on native platforms to MyArScreenshotModule.ts
import { Platform } from 'react-native';
export * from './src/MyArScreenshot.types';

let MyArScreenshotModule: any = null;

// Only load native module on Android
if (Platform.OS === 'android') {
  try {
    MyArScreenshotModule =
      require('./src/MyArScreenshotModule').default;
  } catch (e) {
    console.warn(
      'MyArScreenshot module not available on this platform'
    );
  }
}

export { MyArScreenshotModule as default };

export async function captureScreen(): Promise<string> {
  if (Platform.OS !== 'android' || !MyArScreenshotModule) {
    throw new Error(
      'Screenshot capture is only supported on Android'
    );
  }
  return await MyArScreenshotModule.captureScreen();
}
