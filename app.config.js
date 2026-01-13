module.exports = {
  expo: {
    name: 'urban-management',
    slug: 'urban-management',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'urban-management',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.vuducle.urbanmanagement',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'App cần quyền truy cập vị trí để báo cáo vị trí chính xác của vấn đề.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'App cần quyền truy cập vị trí để báo cáo vị trí chính xác của vấn đề.',
        NSCameraUsageDescription:
          'App cần quyền truy cập camera để chụp ảnh các vấn đề và đo lường AR.',
        NSPhotoLibraryUsageDescription:
          'App cần quyền truy cập thư viện ảnh để tải lên hình ảnh.',
        NSPhotoLibraryAddUsageDescription:
          'App cần quyền lưu ảnh vào thư viện.',
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage:
          './assets/images/android-icon-foreground.png',
        backgroundImage:
          './assets/images/android-icon-background.png',
        monochromeImage:
          './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.vuducle.urbanmanagement',
      permissions: [
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.RECORD_AUDIO',
      ],
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'App cần quyền truy cập thư viện ảnh để tải lên hình ảnh.',
          cameraPermission:
            'App cần quyền truy cập camera để chụp ảnh các vấn đề.',
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'App cần quyền truy cập vị trí để báo cáo vị trí chính xác của vấn đề.',
          locationWhenInUsePermission:
            'App cần quyền truy cập vị trí để báo cáo vị trí chính xác của vấn đề.',
        },
      ],
      [
        'expo-sensors',
        {
          motionPermission:
            'App cần quyền truy cập cảm biến chuyển động để cải thiện trải nghiệm người dùng.',
        },
      ],
      [
        '@reactvision/react-viro',
        {
          cameraUsagePermission:
            'Allow AR to access camera for measurements',
          microphoneUsagePermission: 'Allow AR to access microphone',
          photosUsagePermission: 'Allow AR to save screenshots',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'a8074838-5215-4ebb-9050-787bb47d9775',
      },
    },
    owner: 'vuducle',
    updates: {
      url: 'https://u.expo.dev/a8074838-5215-4ebb-9050-787bb47d9775',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};
