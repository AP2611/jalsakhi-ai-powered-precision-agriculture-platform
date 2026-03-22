# ✅ JalSakhi Debug Build Setup Complete!

## What's Been Configured

### 1. Development Client Installed ✓
- `expo-dev-client` added for full debugging capabilities
- All SDK versions matched correctly
- Project passed all health checks

### 2. Build Configurations Added ✓
- **eas.json** - Cloud build profiles (development, preview, production)
- **app.json** - Development client plugin configured
- **package.json** - New scripts for debug builds

### 3. Helper Scripts Created ✓
- `build-debug.sh` - Interactive build script
- `DEBUG_GUIDE.md` - Quick start guide
- `BUILD_DEBUG.md` - Comprehensive documentation

## 🚀 Quick Start (3 Options)

### Option 1: Fastest - Direct Build (Recommended)
```bash
# Connect your Android device via USB, then:
npm run android:dev
```
**Time:** ~2-5 minutes  
**Pros:** Quick, automatic installation, works offline  
**Cons:** Requires USB connection initially

### Option 2: Interactive Script
```bash
./build-debug.sh
```
Choose from menu:
1. Quick build & install
2. Prebuild & install (full native code)
3. Just start dev server

### Option 3: Cloud Build (EAS)
```bash
# First time only: install EAS CLI
npm install -g eas-cli
eas login

# Build debug APK in cloud
npm run build:dev
```
**Time:** ~10-15 minutes  
**Pros:** No local Android SDK needed, downloadable APK  
**Cons:** Requires internet, Expo account

## 📱 After Building

Once the app is installed on your device:

```bash
# Start the dev server
npm run dev:build
```

The app will:
- ✅ Connect to Metro bundler automatically
- ✅ Support hot reload (instant updates)
- ✅ Enable Chrome DevTools debugging
- ✅ Show detailed error overlays
- ✅ Allow network inspection

## 🔍 Debugging Features

**Shake your device** to access:
- Reload app
- Debug with Chrome
- Toggle Performance Monitor
- Toggle Inspector
- Fast Refresh settings

**Chrome DevTools:**
1. Shake device → "Debug with Chrome"
2. Visit `chrome://inspect` in Chrome
3. Select your app to start debugging

**View logs in terminal:**
```bash
adb logcat | grep -E "ReactNative|JalSakhi"
```

## 🎯 New NPM Scripts

```bash
npm run dev:build          # Start Metro for dev build
npm run android:dev        # Build & run on Android (dev mode)
npm run ios:dev            # Build & run on iOS (dev mode)
npm run build:dev          # Build development APK via EAS
npm run build:preview      # Build preview APK via EAS
npm run build:prod         # Build production APK via EAS
```

## 📋 Prerequisites Checklist

- [x] expo-dev-client installed
- [x] Android package name configured
- [x] EAS build profiles configured
- [x] Development plugin enabled
- [x] All SDK versions matched
- [ ] USB debugging enabled on device
- [ ] Device connected (for local builds)
- [ ] Same WiFi network (device & computer)

## 🛠️ Configuration Files

### Updated Files:
- ✅ `package.json` - Added expo-dev-client & build scripts
- ✅ `app.json` - Added package name & dev-client plugin
- ✅ `eas.json` - Build profiles for all environments

### New Files:
- ✅ `build-debug.sh` - Interactive build helper
- ✅ `DEBUG_GUIDE.md` - Quick reference
- ✅ `BUILD_DEBUG.md` - Full documentation
- ✅ `SETUP_COMPLETE.md` - This file

## 🌐 Network Setup

To connect your app to a local backend:

1. Find your computer's IP address:
```bash
ip addr show | grep "inet "
```

2. Update `utils/api.ts`:
```typescript
const API_URL = "http://YOUR_IP:3000/api";
```

3. Or use USB reverse proxy:
```bash
adb reverse tcp:3000 tcp:3000
# Then use: http://localhost:3000/api
```

## 🐛 Common Issues & Solutions

### "Device not found"
```bash
adb kill-server && adb start-server
adb devices
```

### "Build failed"
```bash
rm -rf node_modules .expo android
npm install
```

### "Can't connect to Metro"
```bash
# Use tunnel mode
npm run dev:build -- --tunnel

# Or USB reverse proxy
adb reverse tcp:8081 tcp:8081
```

### "App keeps crashing"
```bash
# Clear app data on device
adb shell pm clear com.jalsakhi.app

# Or reinstall
adb uninstall com.jalsakhi.app
npm run android:dev
```

## 📚 Documentation

- **Quick Start:** `DEBUG_GUIDE.md`
- **Detailed Guide:** `BUILD_DEBUG.md`
- **Expo Docs:** https://docs.expo.dev/develop/development-builds/introduction/

## ✨ What's Next?

1. **Connect your device** via USB
2. **Run the build:** `npm run android:dev`
3. **Start debugging!**

---

**Status:** ✅ Ready to build and debug!  
**Date:** February 20, 2026  
**Version:** 1.0.0  

Happy debugging! 🐛🔍
