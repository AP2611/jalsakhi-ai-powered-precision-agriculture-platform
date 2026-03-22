# 🌊 JalSakhi Mobile App - Quick Start

## Development Builds for Debugging

### 🚀 Fastest Way (Recommended)

Connect your Android device via USB and run:

```bash
./build-debug.sh
```

Or manually:

```bash
npm run android:dev
```

This will build, install, and start the app on your connected device with full debugging support.

### 📱 What You Get

- ✅ **Full debugging** - Chrome DevTools, React Native Debugger
- ✅ **Fast Refresh** - See changes instantly without rebuild
- ✅ **Error overlay** - Detailed error messages with stack traces
- ✅ **Network inspector** - Monitor API calls in real-time
- ✅ **Performance tools** - Profile your app's performance
- ✅ **Developer menu** - Shake device to access debug options

### 📋 Prerequisites

1. **Enable USB Debugging** on your Android device:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"

2. **Install adb** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt install android-tools-adb
   
   # macOS
   brew install android-platform-tools
   ```

3. **Connect device and verify**:
   ```bash
   adb devices
   ```

### 🛠️ Available Commands

```bash
# Quick build and run on connected device
npm run android:dev

# Start dev server (if app already installed)
npm run dev:build

# Build via EAS Cloud (takes 10-15 min, generates downloadable APK)
npm run build:dev

# Regular Expo Go mode (no debugging features)
npm run android
```

### 🔍 Debugging

1. **Open Chrome DevTools**:
   - Shake device → "Debug with Chrome"
   - Or visit: chrome://inspect

2. **View device logs**:
   ```bash
   adb logcat | grep -E "ReactNative|JalSakhi"
   ```

3. **Reload app**:
   - Shake device → "Reload"
   - Or press `r` in terminal

4. **Clear cache and restart**:
   ```bash
   npm start -- --clear
   ```

### 🐛 Troubleshooting

**Device not detected?**
```bash
adb kill-server
adb start-server
adb devices
```

**Build fails?**
```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules .expo
npm install
```

**Can't connect to Metro?**
- Ensure device and computer are on same WiFi
- Try USB connection: `adb reverse tcp:8081 tcp:8081`
- Use tunnel: `npm run dev:build -- --tunnel`

**App crashes?**
```bash
# Check crash logs
adb logcat | grep -E "AndroidRuntime"
```

### 📚 Full Documentation

See [BUILD_DEBUG.md](./BUILD_DEBUG.md) for detailed instructions and advanced options.

### 🌐 Network Configuration

To connect to your local backend server, update `utils/api.ts`:

```typescript
// For local server (use your computer's IP)
const API_URL = "http://192.168.1.X:3000/api";
```

Get your IP:
```bash
# Linux/Mac
ip addr show | grep "inet "

# Windows
ipconfig
```

---

**Need help?** Check the logs or run `npx expo-doctor` to diagnose issues.
