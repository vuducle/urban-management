import * as React from 'react';

import { MyArScreenshotViewProps } from './MyArScreenshot.types';

export default function MyArScreenshotView(props: MyArScreenshotViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
