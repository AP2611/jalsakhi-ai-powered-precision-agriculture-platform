# JalSakhi Debug Build Guide

This guide will help you build and install a debug version of JalSakhi on your Android device.

## Prerequisites

- Android device with USB debugging enabled
- `adb` installed on your computer
- For local builds: Android Studio and Android SDK installed

## Method 1: Local Debug Build (Recommended for quick testing)

### Step 1: Connect your Android device
```bash
# Enable USB debugging on your Android device
# Connect via USB and verify connection
adb devices
```

### Step 2: Build and install directly
```bash
# Build and install debug APK directly to connected device
npm run android:dev

# Or if you prefer the standard build
npm run android
```

This will:
- Start Metro bundler in dev-client mode
- Build the debug APK
- Install it on your connected device
- Start the app automatically

## Method 2: EAS Cloud Build (For full development client)

### Step 1: Install EAS CLI globally
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```

### Step 3: Configure your project
```bash
# Configure EAS for your project (first time only)
eas build:configure
```

### Step 4: Build development client
```bash
# Build a development APK
npm run build:dev

# Or directly:
eas build --profile development --platform android
```

This will:
- Build in Expo's cloud
- Generate a downloadable APK
- Take about 10-15 minutes

### Step 5: Download and install
1. Once the build completes, download the APK to your device
2. Install it (may need to enable "Install from unknown sources")
3. Open the JalSakhi Dev app

### Step 6: Connect to Metro bundler
```bash
# Start the dev server
npm run dev:build

# The app will connect automatically if on the same network
# Or scan the QR code from the app
```

## Method 3: Local Android Build (Full control)

### Prerequisites
- Android Studio installed
- Android SDK tools configured
- ANDROID_HOME environment variable set

### Build locally
```bash
# Generate native Android project
npx expo prebuild --platform android

# Build debug APK using Gradle
cd android
./gradlew assembleDebug

# The APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

### Install the APK
```bash
# Install via adb
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or manually copy to device and install
```

## Running the Debug Build

### Start the development server
```bash
# Start Metro bundler for dev client
npm run dev:build
```

### On your device
1. Open the JalSakhi Dev app
2. It will show a connection screen
3. Either:
   - Scan the QR code displayed in terminal
   - Enter the URL manually (exp://YOUR_IP:8081)
   - Shake device and enter URL

## Features of Debug Build

✅ **Full debugging capabilities**
- React Native Debugger support
- Chrome DevTools integration
- Network inspector
- Performance monitor

✅ **Hot reload**
- Fast refresh enabled
- See changes instantly
- No need to rebuild

✅ **Error overlay**
- Detailed error messages
- Stack traces
- Helpful suggestions

✅ **Developer menu**
- Shake device to open
- Reload, debug, performance tools
- Toggle inspector

## Troubleshooting

### Can't connect to Metro bundler
```bash
# Make sure your device and computer are on the same network
# Try using ngrok tunnel
npm install -g @expo/ngrok
npx expo start --tunnel --dev-client
```

### Build fails
```bash
# Clear all caches
npm run clean
rm -rf android .expo node_modules
npm install
```

### App crashes on start
```bash
# Check logs
adb logcat | grep -E "ReactNative|JalSakhi"
```

## Quick Commands Reference

```bash
# Start dev server for development build
npm run dev:build

# Build locally and run on Android
npm run android:dev

# Build cloud development APK
npm run build:dev

# Build preview APK (for testing)
npm run build:preview

# Build production APK
npm run build:prod
```

## Network Configuration

If you need to test with a specific backend server, you can configure it in `utils/api.ts`.

For local development:
```typescript
const API_URL = "http://YOUR_LOCAL_IP:3000/api";
```

For production:
```typescript
const API_URL = "https://your-production-api.com/api";
```

## Tips

1. **Keep Metro bundler running** - Don't close the terminal window
2. **Same network** - Device and computer must be on same WiFi
3. **Firewall** - Make sure port 8081 is not blocked
4. **Fresh start** - If issues occur, restart Metro with `--clear` flag
5. **USB debugging** - Works even without WiFi connection

## Need Help?

Check the logs:
```bash
# Terminal logs (Metro bundler)
# Device logs
adb logcat | grep -E "ReactNative|JalSakhi|AndroidRuntime"

# Expo doctor (check for issues)
npx expo-doctor
```
