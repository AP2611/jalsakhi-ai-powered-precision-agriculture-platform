# 🌊 JalSakhi - Smart Water Management System

A comprehensive water management solution for farmers and village administrators, built with Expo and React Native.

## 📱 Quick Start

### For Development (Expo Go)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Run on device**
   - Scan QR code with Expo Go app (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web

### For Debugging (Development Build)

**Want full debugging capabilities?** See **[DEBUG_GUIDE.md](./DEBUG_GUIDE.md)** for instructions on building and installing a debug version on your Android device.

**Quick debug build:**
```bash
# Connect your Android device via USB, then:
npm run android:dev
```

This gives you:
- ✅ Chrome DevTools debugging
- ✅ React Native Debugger support
- ✅ Network inspector
- ✅ Hot reload & Fast Refresh
- ✅ Error overlays with stack traces

## 🏗️ Project Structure

```
JalSakhi/
├── app/                    # App screens (file-based routing)
│   ├── (auth)/            # Authentication screens
│   ├── farmer/            # Farmer dashboard & features
│   └── admin/             # Admin dashboard & features
├── components/            # Reusable UI components
├── services/              # API services (auth, ML, weather)
├── utils/                 # Utility functions (API, Logger)
├── constants/             # Theme and constants
└── assets/                # Images and static files
```

## 🎯 Features

### For Farmers
- 🌾 Crop water requirement prediction
- 💧 Soil moisture forecasting
- 🌤️ Weather updates and alerts
- 📊 Usage history tracking
- 🚜 Farm management
- ⏰ Irrigation scheduling

### For Administrators
- 👥 Farmer management
- 💾 Water reservoir monitoring
- 📈 Village analytics
- ⚡ Water allocation optimization
- 🔔 Anomaly detection
- 📊 Simulation and planning tools

## 🛠️ Available Scripts

### Development
```bash
npm start              # Start Expo development server
npm run dev            # Same as start
npm run dev:build      # Start with development client
npm run android        # Run on Android (Expo Go)
npm run android:dev    # Run on Android (dev build)
npm run ios            # Run on iOS (Expo Go)
npm run web            # Run in web browser
```

### Building
```bash
npm run build:dev      # Build development APK (EAS)
npm run build:preview  # Build preview APK (EAS)
npm run build:prod     # Build production APK (EAS)
```

### Utilities
```bash
npm run lint           # Run ESLint
npm run reset-project  # Reset to blank project
```

## 📚 Documentation

- **[DEBUG_GUIDE.md](./DEBUG_GUIDE.md)** - Quick start for debugging
- **[BUILD_DEBUG.md](./BUILD_DEBUG.md)** - Comprehensive build guide
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Setup status and configuration

## 🔧 Tech Stack

- **Framework:** Expo SDK 54
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **UI:** React Native
- **State Management:** React Context API
- **API Client:** Axios
- **Charts:** React Native Chart Kit
- **Icons:** Expo Vector Icons

## 🌐 Backend Integration

The app connects to a Node.js backend. Configure the API endpoint in `utils/api.ts`:

```typescript
const API_URL = "http://YOUR_SERVER:3000/api";
```

For local development, use your computer's IP address:
```bash
# Find your IP
ip addr show | grep "inet "

# Update API_URL
const API_URL = "http://192.168.1.X:3000/api";
```

## 🐛 Debugging

### View Logs
```bash
# Device logs
adb logcat | grep -E "ReactNative|JalSakhi"

# Check project health
npx expo-doctor
```

### Common Issues

**Metro bundler issues:**
```bash
npm start -- --clear
```

**Build issues:**
```bash
rm -rf node_modules .expo
npm install
```

**Device not detected:**
```bash
adb kill-server
adb start-server
adb devices
```

## 📦 Key Dependencies

- `expo` - Expo framework
- `expo-router` - File-based routing
- `expo-dev-client` - Development builds with debugging
- `react-native-chart-kit` - Data visualization
- `axios` - HTTP client
- `expo-linear-gradient` - Gradient components
- `expo-location` - Location services

## 🤝 Development Workflow

1. **Start development server:** `npm start`
2. **Make changes** to files in `app/` directory
3. **Fast Refresh** updates automatically
4. **Debug** using Chrome DevTools (with dev build)
5. **Test** on multiple devices simultaneously

## 📱 Testing

- **Expo Go:** Quick testing during development
- **Development Build:** Full debugging and native features
- **Preview Build:** Test production-like builds
- **Production Build:** Final release version

## 🚀 Deployment

See **[BUILD_DEBUG.md](./BUILD_DEBUG.md)** for detailed instructions on:
- Building debug APKs for testing
- Building preview APKs for stakeholders
- Building production APKs for release

## 📄 License

This project is part of the Techathon 2026 competition.

## 👥 Team

JalSakhi Team - Techathon 2026

---

**Need help?** Check the documentation files or run `npx expo-doctor` to diagnose issues.

