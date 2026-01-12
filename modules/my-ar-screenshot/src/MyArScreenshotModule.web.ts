import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './MyArScreenshot.types';

type MyArScreenshotModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class MyArScreenshotModule extends NativeModule<MyArScreenshotModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(MyArScreenshotModule, 'MyArScreenshotModule');
