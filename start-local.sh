#!/bin/bash

# JalSakhi - Total Local System Startup Script
# This script launches all 4 components of the platform locally.

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}       JalSakhi Total Local System Startup        ${NC}"
echo -e "${BLUE}==================================================${NC}"

# 1. Detect Local IP Address
echo -e "${YELLOW}Step 1: Detecting Local IP...${NC}"
LOCAL_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || hostname -I | awk '{print $1}')

if [ -z "$LOCAL_IP" ]; then
    echo -e "${RED}Error: Could not detect local IP address.${NC}"
    exit 1
fi
echo -e "Detected IP: ${GREEN}$LOCAL_IP${NC}"

# 2. Update App Environment with current IP
echo -e "${YELLOW}Step 2: Syncing App configuration...${NC}"
if [ -f "app/.env" ]; then
    # Create a fresh app/.env with the detected IP for consistency
    sed -i '' "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=http://$LOCAL_IP:3000|g" app/.env
    echo -e "Updated app/.env to point to http://$LOCAL_IP:3000"
else
    echo -e "${RED}Warning: app/.env not found. Please ensure it exists.${NC}"
fi

# 3. Cleanup Function
cleanup() {
    echo -e "\n${YELLOW}Shutting down all services...${NC}"
    kill $ML_PID $GATEWAY_PID $SERVER_PID $APP_PID 2>/dev/null
    echo -e "${GREEN}Cleanup complete. Goodbye!${NC}"
    exit
}
trap cleanup SIGINT SIGTERM

# 4. Start Services
echo -e "${YELLOW}Step 3: Launching Services...${NC}"

# A. Unified ML API (Python FastAPI)
echo -e "Starting ${BLUE}Unified ML API${NC} [Port 8000]..."
cd ml-services/models
python3 unified_api/main.py > ../../logs-ml.txt 2>&1 &
ML_PID=$!
cd ../..

# B. ML Gateway (Node.js)
echo -e "Starting ${BLUE}ML Gateway${NC} [Port 5000]..."
cd ml-services/gateway
npm start > ../../logs-gateway.txt 2>&1 &
GATEWAY_PID=$!
cd ../..

# C. Main Backend Server (Node.js)
echo -e "Starting ${BLUE}Main Server${NC} [Port 3000]..."
cd server
npm start > ../logs-server.txt 2>&1 &
SERVER_PID=$!
cd ..

# D. Expo App
echo -e "Starting ${BLUE}Expo App${NC}..."
cd app
npm start &
APP_PID=$!
cd ..

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}   All services are running!                      ${NC}"
echo -e "   - Main App: http://localhost:8081              ${NC}"
echo -e "   - Local Server: http://$LOCAL_IP:3000          ${NC}"
echo -e "   - Local Gateway: http://localhost:5000         ${NC}"
echo -e "   - Unified ML: http://localhost:8000            ${NC}"
echo -e "   Press Ctrl+C to stop all services.             ${NC}"
echo -e "   Check logs-*.txt for details if something fails.${NC}"
echo -e "${GREEN}==================================================${NC}"

# Wait for processes
wait
