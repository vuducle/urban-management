import { requireNativeView } from 'expo';
import * as React from 'react';

import { MyArScreenshotViewProps } from './MyArScreenshot.types';

const NativeView: React.ComponentType<MyArScreenshotViewProps> =
  requireNativeView('MyArScreenshot');

export default function MyArScreenshotView(props: MyArScreenshotViewProps) {
  return <NativeView {...props} />;
}
