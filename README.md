# Urban Management AR App

A React Native + Expo + ViroReact application for Augmented Reality urban planning and infrastructure management. Place and visualize 3D models in AR, capture screenshots, and manage AR objects interactively.

## Features

### Core AR Capabilities

- **AR Scene Navigation**: Real-time AR visualization with plane detection and tracking
- **3D Model Placement**: Place multiple 3D models (Cube, Pipeline, CRT TV, Leon character) in AR space
- **Interactive Gestures**: Drag, rotate, and scale objects in real-time
- **Model Management**:
  - Add/remove objects on detected AR planes
  - Undo functionality to remove last placed object
  - Real-time plane visualization toggle

### Supported Models

- **Cube**: Basic geometric primitive (scale: 0.3x)
- **Pipeline**: Industrial pipeline infrastructure (scale: 0.01x, GLB format)
- **CRT TV**: Retro television model (scale: 0.1x)
- **Leon S. Kennedy**: Character model (scale: 1.0x)

### Lighting & Rendering

- Multi-directional lighting system for realistic shadows
- Ambient and directional light sources
- High-accuracy event handling for smooth interactions

### Screenshot Functionality

- **Android (14/15+)**: Native ARCore-based screenshot capture via custom Expo module
- **iOS**: ViroReact native screenshot API
- Automatic save to device gallery
- Handles hardware-protected camera surfaces on Samsung devices

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Android SDK (API 24+) or Xcode for iOS development
- Android Emulator or physical device (Android 14+)
- iOS Simulator or physical device (iOS 14+)

### Local Development Setup

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository-url>
   cd urban-management
   npm install
   ```

2. **Configure Environment Variables**

   ```bash
   cp .env.example .env
   ```

   Add your Google Maps API Key:

   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **Install Expo CLI** (if not already installed)

   ```bash
   npm install -g expo-cli
   ```

4. **Start Development Server**

   ```bash
   npm run start
   ```

   Or with cache clearing:

   ```bash
   npx expo start --clear
   ```

### Running on Physical Devices

#### Android Device

```bash
npx expo run:android
```

Or create a development build:

```bash
eas build --profile development --platform android
```

#### iOS Device

```bash
npx expo run:ios
```

Or with development build:

```bash
eas build --profile development --platform ios
```

### Running on Emulators

#### Android Emulator

```bash
npm run start
# Then press 'a' in terminal or select Android emulator option
```

#### iOS Simulator (macOS only)

```bash
npm run start
# Then press 'i' in terminal or select iOS simulator option
```

## Project Structure

```
urban-management/
├── app/                          # Expo Router screens (file-based routing)
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Home/Dashboard screen
│   │   ├── explore.tsx          # Explore screen
│   │   ├── lich-su.tsx          # History screen
│   │   ├── ho-so.tsx            # Profile screen
│   │   └── _layout.tsx          # Tab layout
│   ├── _layout.tsx              # Root layout with theme
│   ├── modal.tsx                # Modal screen
│   └── notifications.tsx        # Notifications screen
├── components/
│   ├── core/                    # AR core components
│   │   ├── ARModelView.tsx      # Main AR view container
│   │   ├── ARCameraView.tsx     # Camera integration
│   │   └── ar/
│   │       ├── ModelScene.tsx   # Viro AR scene with models
│   │       ├── ARControls.tsx   # Bottom control panel
│   │       ├── AROverlay.tsx    # AR status overlay
│   │       └── ARPlacement.tsx  # Placement logic
│   └── dashboard/              # Dashboard components
├── constants/
│   ├── ar-models.ts            # 3D model configurations
│   ├── colors.ts               # Color scheme
│   └── theme.ts                # Theme definitions
├── hooks/
│   ├── use-ar-tracking.ts      # AR plane detection and tracking
│   ├── use-ar-placement.ts     # Object placement logic
│   ├── use-measurement.ts      # Distance/measurement utilities
│   └── use-color-scheme.ts     # Theme management
├── modules/
│   └── my-ar-screenshot/       # Native screenshot module
│       ├── android/            # Android implementation (Kotlin + ARCore)
│       ├── ios/                # iOS implementation (Swift)
│       └── src/                # TypeScript definitions
├── assets/
│   ├── models/                 # 3D model files (GLB/GLTF)
│   └── images/                 # UI images and icons
├── app.json                    # Expo configuration
├── eas.json                    # EAS build configuration
└── package.json                # Dependencies and scripts
```

## Development Guide

### Adding New 3D Models

1. Place the model file in `assets/models/` (support: GLB, GLTF, OBJ)
2. If using GLTF with external buffers, convert to GLB:
   ```bash
   npx gltf-pipeline -i input.gltf -o output.glb
   ```
3. Update `constants/ar-models.ts`:

   ```typescript
   export type ModelType = 'cube' | 'pipeline' | 'tv' | 'leon' | 'new_model';

   new_model: {
     source: require('../assets/models/new_model.glb'),
     type: 'GLB',
     scale: [1, 1, 1], // Adjust as needed
   },
   ```

4. The model will appear in the model selector UI automatically

### State Management

- **AR State**: Managed via `useARTracking` and `useARPlacement` hooks
- **Theme State**: `useColorScheme` hook for light/dark mode
- **Global State**: App-level state in `_layout.tsx`

## Screenshot Feature Details

### Current Architecture

The screenshot functionality uses a **native Android module** (`expo-modules-myarscreenshot`) to handle capture on Android due to hardware protection issues on Android 14/15.

#### Android Implementation

- **Primary Method**: ARCore direct frame capture
  - Accesses `Session.update()` and `frame.acquireCameraImage()`
  - Converts YUV camera buffer to JPEG bitmap
  - Eliminates black screen issues on Samsung devices
- **Fallback Method**: System-level MediaProjection API
  - Requires user to allow screen recording
  - Works when ARCore frame capture unavailable
  - Full screen including UI elements

#### iOS Implementation

- Uses ViroReact's native `takeScreenshot()` API
- No permission dialogs required
- Works directly with Metal rendering

### Known Issues & Workarounds

**Issue**: Black screen or missing camera background on Android 15

- **Cause**: Hardware protection (DRM) on modern Samsung devices blocks SurfaceView capture
- **Solution**: Native ARCore frame capture implemented as primary method
- **Status**: ✅ Resolved for ARCore-enabled devices

**Issue**: Models not visible after placement

- **Cause**: Relative buffer references in GLTF files not resolved by Metro bundler
- **Solution**: Convert GLTF files to GLB format (single binary file)
- **Status**: ✅ Pipeline model converted to GLB

## Build & Deployment

### Local Build

#### Android APK

```bash
eas build --platform android --profile development
```

#### iOS IPA (requires Apple Developer account)

```bash
eas build --platform ios --profile development
```

### Production Deployment

```bash
npm run deploy
```

This uses EAS Workflows to submit to both Google Play and Apple App Store.

## Debugging

### React Native DevTools

```bash
npx expo start --dev-client
```

Then use the React Native DevTools for:

- Component inspection
- State/props debugging
- Network monitoring
- Performance profiling

### Logging

- `console.log()`: General debugging
- `console.warn()`: Deprecation warnings
- `console.error()`: Error handling (combined with Error Boundaries)

### AR Debugging

- Toggle plane visualization: Use the plane icon in bottom controls
- Check logs for ARCore state: Filter for "AR_SHOT", "AR Plane", "Model load"
- Test on physical device for accurate AR tracking

## Known Limitations

- **iOS**: Requires development certificate for camera access
- **Android**: ARCore requires Google Play Services
- **Models**: GLTF format must be converted to GLB for bundling compatibility
- **Screenshot**: ARCore method only captures camera feed (not GL composited rendering yet)

## Troubleshooting

### App crashes on startup

1. Clear cache: `npx expo start --clear`
2. Rebuild: `eas build --profile development --platform <android|ios>`
3. Check camera permissions in device settings

### AR not initializing

- Ensure ARCore is installed (Android only)
- Verify Google Play Services is up to date
- Check camera permissions are granted

### Models not appearing

- Verify model file exists in `assets/models/`
- Check model type is correctly configured in `ar-models.ts`
- Ensure scale values are reasonable (very large/small values hide models)
- Check native logs for model loading errors

### Screenshot returns black image

- Android: Device must support ARCore (most modern phones do)
- Grant screen recording permission if prompted
- Try fallback method (System Recorder)

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [ViroReact Documentation](https://viromedia.com/docs/)
- [ARCore Developer Guide](https://developers.google.com/ar/develop)

## License

[Add your license information here]

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review logs using `npm run start` and checking console output
3. Open an issue on the repository
