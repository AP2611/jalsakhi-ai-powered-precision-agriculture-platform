#!/bin/bash

# JalSakhi Local Debug Build Script
# This script helps you quickly build and install a debug APK on your Android device

echo "🌊 JalSakhi - Local Debug Build Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if adb is installed
if ! command -v adb &> /dev/null; then
    echo -e "${RED}❌ adb is not installed or not in PATH${NC}"
    echo "Please install Android SDK Platform Tools"
    exit 1
fi

echo -e "${GREEN}✅ adb found${NC}"
echo ""

# Check for connected devices
echo "📱 Checking for connected Android devices..."
DEVICES=$(adb devices | grep -w "device" | wc -l)

if [ "$DEVICES" -eq 0 ]; then
    echo -e "${RED}❌ No Android devices connected${NC}"
    echo ""
    echo "Please:"
    echo "1. Connect your Android device via USB"
    echo "2. Enable USB debugging in Developer Options"
    echo "3. Run this script again"
    exit 1
fi

echo -e "${GREEN}✅ Found $DEVICES device(s)${NC}"
adb devices
echo ""

# Ask user which method to use
echo "Choose build method:"
echo "1) Quick build & install (uses expo run:android)"
echo "2) Prebuild & install (generates native code)"
echo "3) Just start dev server (if app already installed)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}🔨 Building and installing debug APK...${NC}"
        echo ""
        npm run android:dev
        ;;
    2)
        echo ""
        echo -e "${YELLOW}🔨 Generating native Android project...${NC}"
        npx expo prebuild --platform android --clean
        
        echo ""
        echo -e "${YELLOW}🔨 Building debug APK with Gradle...${NC}"
        cd android
        ./gradlew assembleDebug
        cd ..
        
        echo ""
        echo -e "${YELLOW}📲 Installing APK...${NC}"
        adb install -r android/app/build/outputs/apk/debug/app-debug.apk
        
        echo ""
        echo -e "${GREEN}✅ APK installed!${NC}"
        echo ""
        echo -e "${YELLOW}🚀 Starting Metro bundler...${NC}"
        npm run dev:build
        ;;
    3)
        echo ""
        echo -e "${YELLOW}🚀 Starting Metro bundler in dev-client mode...${NC}"
        npm run dev:build
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Done!${NC}"
echo ""
echo "📱 To debug:"
echo "1. Open JalSakhi app on your device"
echo "2. Shake device to open developer menu"
echo "3. Enable 'Debug with Chrome' for debugging"
echo ""
