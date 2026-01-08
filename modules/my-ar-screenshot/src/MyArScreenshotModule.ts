import { NativeModule, requireNativeModule } from 'expo';

import { MyArScreenshotModuleEvents } from './MyArScreenshot.types';

declare class MyArScreenshotModule extends NativeModule<MyArScreenshotModuleEvents> {
  captureScreen(): Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MyArScreenshotModule>(
  'MyArScreenshot'
);
