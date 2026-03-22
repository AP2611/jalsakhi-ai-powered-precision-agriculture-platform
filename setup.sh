#!/bin/bash

# JalSakhi - Quick Setup Script
# This script helps set up the development environment for all components

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     JalSakhi Development Environment Setup      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section headers
print_section() {
    echo ""
    echo -e "${GREEN}▶ $1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check prerequisites
print_section "Checking Prerequisites"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm is not installed."
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python installed: $PYTHON_VERSION"
else
    print_error "Python 3 is not installed. Please install Python 3.10+ from https://www.python.org/"
    exit 1
fi

# Check pip
if command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version)
    print_success "pip installed: $PIP_VERSION"
else
    print_error "pip is not installed."
    exit 1
fi

# Optional: Check for Expo CLI
if command -v expo &> /dev/null; then
    print_success "Expo CLI installed"
else
    print_warning "Expo CLI not found. Install with: npm install -g expo-cli"
fi

# Setup Backend Server
print_section "Setting up Backend Server"
if [ -d "server" ]; then
    cd server
    
    # Copy .env.example to .env if it doesn't exist
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
        print_warning "Please update server/.env with your configuration"
    fi
    
    print_success "Installing backend dependencies..."
    npm install
    print_success "Backend dependencies installed"
    
    cd ..
else
    print_warning "server/ directory not found, skipping"
fi

# Setup Mobile App
print_section "Setting up Mobile App"
if [ -d "app" ]; then
    cd app
    
    # Copy .env.example to .env if it doesn't exist
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
        print_warning "Please update app/.env with your API URL"
    fi
    
    print_success "Installing mobile app dependencies..."
    npm install
    print_success "Mobile app dependencies installed"
    
    cd ..
else
    print_warning "app/ directory not found, skipping"
fi

# Setup Gateway
print_section "Setting up ML Gateway"
if [ -d "gateway" ]; then
    cd gateway
    
    # Copy .env.example to .env if it doesn't exist
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
        print_warning "Please update gateway/.env with your API key and ML service URLs"
    fi
    
    print_success "Installing gateway dependencies..."
    npm install
    print_success "Gateway dependencies installed"
    
    cd ..
else
    print_warning "gateway/ directory not found, skipping"
fi

# Setup ML Models
print_section "Setting up ML Services"
if [ -d "ml-services/models" ]; then
    cd ml-models
    
    # Setup unified API
    if [ -f "unified_api/requirements.txt" ]; then
        print_success "Installing ML dependencies..."
        pip3 install -r unified_api/requirements.txt
        print_success "ML dependencies installed"
    fi
    
    # Check if models need training
    if [ -d "Crop_Water_Model" ] && [ ! -f "Crop_Water_Model/model.joblib" ]; then
        print_warning "Crop Water model not found. Run: cd ml-models/Crop_Water_Model && python train.py"
    fi
    
    if [ -d "soil_moisture_model" ] && [ ! -f "soil_moisture_model/model_sensor.joblib" ]; then
        print_warning "Soil Moisture model not found. Run: cd ml-models/soil_moisture_model && python train.py"
    fi
    
    cd ..
else
    print_warning "ml-models/ directory not found, skipping"
fi

# Setup Chatbot
print_section "Setting up Chatbot Service"
if [ -d "chatbot" ]; then
    cd chatbot
    
    if [ -f "requirement.txt" ]; then
        print_success "Installing chatbot dependencies..."
        pip3 install -r requirement.txt
        print_success "Chatbot dependencies installed"
    fi
    
    cd ..
else
    print_warning "chatbot/ directory not found, skipping"
fi

# Final Summary
print_section "Setup Complete!"
echo ""
echo -e "${GREEN}✓ Development environment is ready!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Configure environment files:"
echo "   - server/.env (Database, JWT secret, Email config)"
echo "   - app/.env (API URL)"
echo "   - gateway/.env (API keys, ML service URLs)"
echo ""
echo "2. Train ML models (if needed):"
echo "   cd ml-models/Crop_Water_Model && python train.py"
echo "   cd ml-models/soil_moisture_model && python train.py"
echo ""
echo "3. Start services:"
echo "   Terminal 1: cd server && npm start"
echo "   Terminal 2: cd ml-models && uvicorn unified_api.main:app --host 0.0.0.0 --port 8000"
echo "   Terminal 3: cd gateway && npm start"
echo "   Terminal 4: cd app && npm start"
echo ""
echo "4. For detailed documentation, see:"
echo "   - README.md - Project overview"
echo "   - CONTRIBUTING.md - Development guidelines"
echo "   - docs/ARCHITECTURE.md - System architecture"
echo ""
echo -e "${YELLOW}⚠ Remember to configure MongoDB connection in server/.env${NC}"
echo ""
