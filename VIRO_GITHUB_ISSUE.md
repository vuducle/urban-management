# [Android] Screenshot missing ARCore camera background - only captures AR content

## 🐛 Bug Report / Feature Request

### Current Behavior

On Android, `ViroARSceneNavigator.takeScreenshot()` captures only the AR content (3D models, planes, annotations) but **not the ARCore camera feed**. The camera background appears **black** in the resulting image.

On iOS, `ARSCNView.snapshot()` correctly captures both the camera feed and AR content.

**Screenshot Comparison:**

| Platform | AR Content  | Camera Background |
| -------- | ----------- | ----------------- |
| iOS      | ✅ Captured | ✅ Captured       |
| Android  | ✅ Captured | ❌ Black          |

### Expected Behavior

Android screenshots should include the ARCore camera feed as the background, composited with AR content on top - matching iOS behavior.

### Environment

- **react-viro version:** `@reactvision/react-viro@2.50.1`
- **React Native version:** `0.76.5`
- **Platform:** Android (ARCore)
- **Android SDK:** 24+ (tested on SDK 34)
- **Device/Emulator:** Physical devices (Pixel, Samsung) and emulators with ARCore support

### Reproduction

1. Create an AR scene with 3D models or planes
2. Call `takeScreenshot()` on the ViroARSceneNavigator ref:

```typescript
import { ViroARSceneNavigator } from '@reactvision/react-viro';

const navigatorRef = useRef<any>(null);

const takeScreenshot = async () => {
  const result = await navigatorRef.current?.takeScreenshot(
    'capture',
    false
  );
  const uri = result.url || result;
  console.log('Screenshot saved:', uri);
  // Result: AR content visible, camera background is BLACK
};

return (
  <ViroARSceneNavigator
    ref={navigatorRef}
    initialScene={{ scene: MyARScene }}
    style={{ flex: 1 }}
  />
);
```

3. Open the saved image → AR content is visible, camera feed is black

### Minimal Reproducible Example

```typescript
import React, { useRef } from 'react';
import { Button } from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
} from '@reactvision/react-viro';

const ARScene = () => (
  <ViroARScene>
    <ViroBox
      position={[0, 0, -1]}
      scale={[0.3, 0.3, 0.3]}
      materials={['red']}
    />
  </ViroARScene>
);

export default function App() {
  const navigatorRef = useRef(null);

  const handleScreenshot = async () => {
    const result = await navigatorRef.current?.takeScreenshot(
      'test',
      false
    );
    console.log('Screenshot:', result);
    // AR Box is captured, camera feed is BLACK
  };

  return (
    <>
      <ViroARSceneNavigator
        ref={navigatorRef}
        initialScene={{ scene: ARScene }}
        style={{ flex: 1 }}
      />
      <Button title="Take Screenshot" onPress={handleScreenshot} />
    </>
  );
}
```

## 🔍 Technical Analysis

### Root Cause

The issue stems from Android's ARCore rendering architecture:

```
Android AR Rendering Pipeline:
┌──────────────────────────────────┐
│  ARCore Camera Texture           │ ← External Texture (not in GL framebuffer)
│  (OES_EGL_image_external)        │    ArSession.setCameraTextureName(texId)
└──────────────────────────────────┘
          ↓ Rendered as background texture
┌──────────────────────────────────┐
│  OpenGL GLSurfaceView            │ ← ViroReact renders AR content here
│  (3D Models, Planes, Overlays)   │    glReadPixels() captures THIS layer only
└──────────────────────────────────┘
```

**Current Implementation** (presumed from behavior):

```java
// In ViroViewARCore.java or similar:
public void takeScreenshot() {
    mGLSurfaceView.queueEvent(() -> {
        IntBuffer pixelBuffer = IntBuffer.allocate(width * height);
        GLES20.glReadPixels(0, 0, width, height,
                           GLES20.GL_RGBA, GLES20.GL_UNSIGNED_BYTE,
                           pixelBuffer);
        Bitmap bitmap = Bitmap.createBitmap(pixelBuffer.array(), ...);
        saveBitmap(bitmap);
    });
}
```

**Problem:** `glReadPixels()` reads the **default framebuffer**, which contains only the AR content. The ARCore camera texture is an **external texture** (`GL_TEXTURE_EXTERNAL_OES`) that's rendered as a background but **not included** in the default framebuffer when using `glReadPixels()`.

## ✅ Proposed Solution

Composite the ARCore camera frame with the GL framebuffer capture:

```java
// In ViroViewARCore.java (pseudocode):

public void takeScreenshot(String fileName, boolean saveToCameraRoll) {
    try {
        // 1. Capture current ARCore camera frame
        Frame currentFrame = mArSession.update();
        Image cameraImage = currentFrame.acquireCameraImage();

        // 2. Convert YUV420_888 to ARGB Bitmap
        Bitmap cameraBitmap = convertYUVToBitmap(cameraImage);
        cameraImage.close();

        // 3. Capture GL content (existing code)
        final Bitmap glBitmap = captureGLSurface();

        // 4. Composite: camera as background, GL content on top
        Canvas canvas = new Canvas(cameraBitmap);
        Paint paint = new Paint();
        paint.setAlpha(255);
        canvas.drawBitmap(glBitmap, 0, 0, paint);

        // 5. Save composite bitmap
        saveBitmapToFile(cameraBitmap, fileName, saveToCameraRoll);

        // 6. Cleanup
        glBitmap.recycle();
        cameraBitmap.recycle();

    } catch (Exception e) {
        Log.e("ViroReact", "Screenshot failed", e);
        // Fallback to GL-only capture
        captureGLSurfaceOnly();
    }
}

private Bitmap convertYUVToBitmap(Image image) {
    // Convert YUV_420_888 to ARGB_8888
    Image.Plane[] planes = image.getPlanes();
    ByteBuffer yBuffer = planes[0].getBuffer();
    ByteBuffer uBuffer = planes[1].getBuffer();
    ByteBuffer vBuffer = planes[2].getBuffer();

    int width = image.getWidth();
    int height = image.getHeight();

    // YUV to RGB conversion
    int[] rgbData = new int[width * height];
    // ... conversion logic (standard YUV420 to RGB)

    return Bitmap.createBitmap(rgbData, width, height,
                               Bitmap.Config.ARGB_8888);
}

private Bitmap captureGLSurface() {
    // Existing glReadPixels() implementation
    final IntBuffer pixelBuffer = IntBuffer.allocate(mWidth * mHeight);
    GLES20.glReadPixels(0, 0, mWidth, mHeight,
                       GLES20.GL_RGBA, GLES20.GL_UNSIGNED_BYTE,
                       pixelBuffer);

    int[] pixels = pixelBuffer.array();
    Bitmap bitmap = Bitmap.createBitmap(mWidth, mHeight,
                                       Bitmap.Config.ARGB_8888);
    bitmap.setPixels(pixels, 0, mWidth, 0, 0, mWidth, mHeight);

    // Flip vertically (OpenGL is bottom-up)
    Matrix matrix = new Matrix();
    matrix.preScale(1.0f, -1.0f);
    return Bitmap.createBitmap(bitmap, 0, 0, mWidth, mHeight,
                               matrix, false);
}
```

### Implementation Notes

1. **Thread Safety**: Ensure ARCore frame capture and GL capture happen on appropriate threads
2. **Synchronization**: Camera frame should match the GL render frame (use same timestamp)
3. **Performance**: YUV conversion can be expensive - consider caching/reusing buffers
4. **Memory**: Both bitmaps can be large - handle OOM gracefully
5. **Fallback**: If ARCore frame unavailable, fall back to GL-only capture

## 🔄 Alternative Solutions

### Option A: Render Camera to Framebuffer

Instead of external texture, render camera to an FBO:

```java
// Render camera texture to FBO first
GLES20.glBindFramebuffer(GLES20.GL_FRAMEBUFFER, cameraFBO);
renderCameraTexture();

// Then render AR content on top
renderARContent();

// Screenshot captures the complete FBO
GLES20.glReadPixels(...); // Now includes camera!
```

**Pros:** Single capture, consistent with current flow  
**Cons:** Requires rendering pipeline changes, potential performance impact

### Option B: Configuration Flag

Add option to enable/disable camera capture:

```typescript
<ViroARSceneNavigator
  screenshotIncludesCamera={true} // Default: true for iOS, false for Android
  // ...
/>
```

```java
public void takeScreenshot(String fileName, boolean includeCamera) {
    if (includeCamera) {
        takeCompositeScreenshot(fileName);
    } else {
        takeGLScreenshot(fileName); // Current behavior
    }
}
```

**Pros:** Backward compatible, flexible  
**Cons:** Inconsistent cross-platform by default

### Option C: Use PixelCopy API (Android N+)

```java
// For Android 7.0+
PixelCopy.request(mSurfaceView, screenshotBitmap,
    copyResult -> {
        if (copyResult == PixelCopy.SUCCESS) {
            // Should include camera, but currently doesn't for GLSurfaceView
            saveBitmap(screenshotBitmap);
        }
    },
    handler);
```

**Note:** PixelCopy on GLSurfaceView has the same limitation - doesn't capture ARCore external texture.

## 🎯 Impact

This issue affects **all Android AR applications** using ViroReact that need screenshot functionality. Common use cases:

- 📸 **Social sharing** - Users want to share AR experiences with camera context
- 📊 **Documentation** - Industrial/enterprise apps capturing AR measurements
- 🎨 **AR filters/effects** - Apps that apply AR overlays to real-world scenes
- 🏗️ **Construction/Architecture** - Capturing AR models in real environments

Currently, developers have **no workaround** except:

1. Telling users to use device screenshot (Power + Volume Down) - poor UX
2. Accepting black background - unprofessional appearance
3. Forking ViroReact - significant maintenance burden

## 📚 References

- ARCore Camera Image API: https://developers.google.com/ar/reference/java/arcore/reference/com/google/ar/core/Frame#acquireCameraImage()
- OpenGL External Textures: https://www.khronos.org/registry/OpenGL/extensions/OES/OES_EGL_image_external.txt
- iOS ARSCNView.snapshot(): https://developer.apple.com/documentation/arkit/arscnview/2875733-snapshot
- Related Issue (if any): #XXX

## ✨ Benefits of Fix

- ✅ **Cross-platform parity** - Android matches iOS behavior
- ✅ **Better UX** - Users get complete screenshots with context
- ✅ **Professional output** - No black backgrounds
- ✅ **Feature completeness** - Screenshot API works as expected
- ✅ **Reduces support burden** - Developers don't need workarounds

## 🤝 I'm Happy To Help

If this solution approach looks good, I can:

- Contribute a PR with the implementation
- Test on multiple Android devices
- Write unit tests for the YUV conversion
- Update documentation

Let me know if you need any clarification or have alternative approaches in mind!

---

**Labels:** `bug`, `android`, `screenshot`, `arcore`, `help-wanted`, `good-first-issue`  
**Priority:** `high` (core feature, affects all Android AR apps)
