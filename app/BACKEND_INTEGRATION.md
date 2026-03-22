# 🔧 Backend Integration Checklist

## Overview
This checklist helps you integrate the JalSakhi mobile app with your backend server and ML models.

## 📋 Pre-requisites

### Server Setup
- [ ] Node.js/Python server running
- [ ] Database configured (MongoDB recommended)
- [ ] API endpoint structure defined
- [ ] CORS enabled for mobile app

### ML Models
- [ ] Model 1: Crop Water Requirement model deployed
- [ ] Model 2: Soil Moisture Forecast model deployed
- [ ] Model 3: Water Allocation Optimizer deployed
- [ ] Models accessible via HTTP endpoints

### Services
- [ ] Email service configured (SendGrid/AWS SES/Nodemailer)
- [ ] OTP generation logic ready
- [ ] JWT authentication set up

## 🔌 API Endpoints to Implement

### 1. Authentication APIs

#### POST /api/auth/send-otp
Send OTP to email during signup
```json
Request:
{
  "email": "farmer@example.com",
  "role": "farmer"
}

Response:
{
  "success": true,
  "message": "OTP sent to email",
  "expiresIn": 300
}
```

#### POST /api/auth/verify-otp
Verify OTP code
```json
Request:
{
  "email": "farmer@example.com",
  "otp": "123456",
  "userData": {
    "name": "Ramesh Kumar",
    "phone": "9876543210",
    "landSize": 2.5,
    "village": "Khadki"
  }
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "farmer@example.com",
    "role": "farmer",
    "name": "Ramesh Kumar"
  }
}
```

#### POST /api/auth/resend-otp
Resend OTP
```json
Request:
{
  "email": "farmer@example.com"
}

Response:
{
  "success": true,
  "message": "OTP resent"
}
```

#### POST /api/auth/login
Login with credentials
```json
Request:
{
  "email": "farmer@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "farmer@example.com",
    "role": "farmer",
    "name": "Ramesh Kumar"
  }
}
```

### 2. Farmer APIs

#### POST /api/predict/crop-water-requirement
Get crop water requirement prediction (Model 1)
```json
Request:
{
  "cropType": "Rice",
  "growthStage": "Vegetative",
  "soilType": "Clay",
  "soilMoisture": "45",
  "temperature": "32",
  "humidity": "65",
  "rainfallLast5Days": "25",
  "rainfallForecast": "10",
  "windSpeed": "15",
  "solarRadiation": "20"
}

Response:
{
  "waterRequirement": 45.5,
  "recommendation": "Irrigate in next 24 hours",
  "schedule": [
    {
      "day": "Today",
      "amount": 25,
      "time": "Morning 6-8 AM"
    },
    {
      "day": "Day 3",
      "amount": 20,
      "time": "Evening 5-7 PM"
    }
  ],
  "confidence": 92
}
```

#### GET /api/forecast/soil-moisture
Get soil moisture forecast (Model 2)
```json
Request: (Bearer token in header)

Response:
{
  "currentMoisture": 42,
  "forecast": [
    {
      "day": "Today",
      "date": "2025-01-15",
      "moisture": 42,
      "trend": "stable",
      "rain": 0
    },
    {
      "day": "Tomorrow",
      "date": "2025-01-16",
      "moisture": 38,
      "trend": "down",
      "rain": 0
    }
    // ... 5 more days
  ],
  "recommendations": [
    {
      "type": "warning",
      "message": "Low moisture expected on Day 2. Plan irrigation."
    }
  ],
  "lastUpdated": "2025-01-15T10:30:00Z"
}
```

#### GET /api/farmer/water-allocation
Get farmer's water allocation (Model 3 output)
```json
Request: (Bearer token in header)

Response:
{
  "farmerId": "F001",
  "farmerName": "Ramesh Kumar",
  "village": "Khadki",
  "totalLand": 2.5,
  "currentAllocation": {
    "amount": 1250,
    "validFrom": "2025-01-15",
    "validUntil": "2025-01-21",
    "status": "active"
  },
  "schedule": [
    {
      "date": "Jan 15",
      "slot": "Morning 6-8 AM",
      "amount": 200,
      "status": "completed"
    },
    {
      "date": "Jan 16",
      "slot": "Morning 6-8 AM",
      "amount": 200,
      "status": "pending"
    }
  ],
  "reservoirStatus": {
    "capacity": 50000,
    "currentLevel": 38500,
    "percentage": 77
  },
  "priority": "medium",
  "crops": ["Rice", "Wheat"],
  "lastUpdated": "2025-01-15T10:30:00Z"
}
```

### 3. Admin APIs

#### GET /api/admin/farmers
Get all farmers in village
```json
Request: (Bearer token in header)

Response:
[
  {
    "id": "F001",
    "name": "Ramesh Kumar",
    "landSize": 2.5,
    "crops": ["Rice", "Wheat"],
    "priority": "high",
    "soilType": "Clay",
    "avgWaterRequirement": 250
  },
  {
    "id": "F002",
    "name": "Suresh Patil",
    "landSize": 1.8,
    "crops": ["Vegetables"],
    "priority": "medium",
    "soilType": "Loamy",
    "avgWaterRequirement": 180
  }
]
```

#### POST /api/admin/optimize-allocation
Run water allocation optimization (Model 3)
```json
Request:
{
  "reservoirCapacity": "50000",
  "currentWaterLevel": "38500",
  "rainfallForecast": "25",
  "temperature": "32",
  "evaporationRate": "5.5",
  "timeHorizon": "7",
  "farmers": [
    {
      "id": "F001",
      "name": "Ramesh Kumar",
      "landSize": 2.5,
      "crops": ["Rice", "Wheat"],
      "priority": "high",
      "avgWaterRequirement": 250
    }
  ]
}

Response:
{
  "totalAvailable": 38500,
  "totalAllocated": 36200,
  "totalRequired": 42000,
  "efficiency": 86.2,
  "fairnessScore": 92,
  "allocations": [
    {
      "farmerId": "F001",
      "farmerName": "Ramesh Kumar",
      "priority": "high",
      "required": 1750,
      "allocated": 1650,
      "satisfactionRate": 94.3,
      "schedule": [
        {
          "day": "Jan 15",
          "amount": 250,
          "slot": "Morning 6-8 AM"
        }
      ]
    }
  ]
}
```

#### POST /api/admin/save-allocation
Save optimized allocation
```json
Request:
{
  "allocations": [/* allocation data from optimizer */]
}

Response:
{
  "success": true,
  "message": "Allocation saved successfully",
  "notificationsSent": 4
}
```

## 🔧 Backend Integration Steps

### Step 1: Update API Base URL
```typescript
// In each screen file, replace:
const API_BASE = 'http://YOUR_SERVER_IP:5000';
// With:
const API_BASE = 'https://your-production-server.com';

// Or create a config file:
// services/config.ts
export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
```

### Step 2: Add Authentication Headers
```typescript
// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function apiRequest(endpoint: string, options = {}) {
  const token = await AsyncStorage.getItem('authToken');
  
  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
}
```

### Step 3: Test Each Endpoint
Create a test file to verify each API:
```typescript
// tests/api-test.ts
async function testCropWaterPrediction() {
  const response = await fetch(`${API_BASE}/api/predict/crop-water-requirement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cropType: 'Rice',
      growthStage: 'Vegetative',
      // ... other fields
    }),
  });
  
  const data = await response.json();
  console.log('Prediction:', data);
}
```

### Step 4: Handle Errors
```typescript
async function fetchWithErrorHandling(url: string, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    Alert.alert('Error', 'Failed to connect to server. Please try again.');
    throw error;
  }
}
```

## 🗄️ Database Schema Suggestions

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String, // 'farmer' | 'admin'
  name: String,
  phone: String,
  village: String,
  landSize: Number,
  crops: [String],
  createdAt: Date
}
```

### Allocations Collection
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId,
  amount: Number,
  validFrom: Date,
  validUntil: Date,
  schedule: [{
    date: String,
    slot: String,
    amount: Number,
    status: String
  }],
  priority: String,
  createdAt: Date
}
```

### Predictions Collection
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId,
  type: String, // 'crop-water' | 'soil-moisture'
  input: Object,
  output: Object,
  timestamp: Date
}
```

## 🔐 Security Checklist

- [ ] Hash passwords with bcrypt
- [ ] Validate JWT tokens
- [ ] Sanitize user inputs
- [ ] Rate limit OTP requests
- [ ] Use HTTPS in production
- [ ] Store sensitive data in env variables
- [ ] Implement refresh tokens
- [ ] Add request logging

## 📧 Email Service Setup

### Using Nodemailer
```javascript
// server/config/nodemailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: 'JalSakhi <noreply@jalsakhi.com>',
    to: email,
    subject: 'Your JalSakhi OTP',
    html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes</p>`
  });
}
```

## 🧪 Testing Workflow

1. **Unit Tests**: Test each API endpoint separately
2. **Integration Tests**: Test complete flows (signup → login → dashboard)
3. **Load Tests**: Test with multiple concurrent users
4. **UI Tests**: Test all screen interactions

## 📊 Monitoring

- [ ] Log all API requests
- [ ] Track prediction accuracy
- [ ] Monitor allocation efficiency
- [ ] Track user engagement
- [ ] Set up error alerts

## 🚀 Deployment

### Mobile App
```bash
# Update API URLs in config
# Build production APK
eas build --platform android --profile production
```

### Backend
```bash
# Deploy to cloud (Heroku/AWS/DigitalOcean)
# Set environment variables
# Run migrations
# Start server
```

---

## ✅ Final Checklist

Before going live:
- [ ] All API endpoints tested
- [ ] Authentication working
- [ ] ML models returning predictions
- [ ] Email OTP sending
- [ ] Database connected
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Production builds tested
- [ ] User documentation ready
- [ ] Support system ready

---

**Need Help?** Check the implementation files:
- `services/auth.ts` - Auth service methods
- `services/api.ts` - API helper functions
- Screen files - API integration examples
