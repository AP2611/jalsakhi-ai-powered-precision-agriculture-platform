# API Documentation

## Overview

This document describes the APIs exposed by the JalSakhi backend server and ML services.

## Base URLs

- **Backend API (Production):** `https://jalsakhi-server-cxd2egdzgyghafd2.centralindia-01.azurewebsites.net`
- **Backend API (Development):** `http://localhost:3000`
- **ML Services (Development):** `http://localhost:8000`
- **ML Gateway (Development):** `http://localhost:5000`

## Authentication

Most API endpoints require authentication using JWT tokens.

### Headers
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## Backend API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "+919876543210",
  "role": "farmer"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

#### POST /api/auth/login
Login and receive JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

#### POST /api/auth/send-otp
Send email OTP for verification.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

#### POST /api/auth/verify-otp
Verify email OTP.

**Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### User Management

#### GET /api/user/data
Get current user profile (requires authentication).

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "farmer",
    "verified": true,
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

### Farm Management

#### GET /api/farms
Get all farms for the authenticated user.

**Response:** `200 OK`
```json
{
  "success": true,
  "farms": [
    {
      "id": "507f191e810c19729de860ea",
      "name": "North Field",
      "cropType": "Rice",
      "area": 5.5,
      "soilType": "Clay",
      "location": {
        "lat": 19.0760,
        "lng": 72.8777
      },
      "irrigationHistory": []
    }
  ]
}
```

#### POST /api/farms
Create a new farm.

**Request:**
```json
{
  "name": "North Field",
  "cropType": "Rice",
  "area": 5.5,
  "soilType": "Clay",
  "location": {
    "lat": 19.0760,
    "lng": 72.8777
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "farm": {
    "id": "507f191e810c19729de860ea",
    "name": "North Field",
    "cropType": "Rice",
    "area": 5.5,
    "soilType": "Clay"
  }
}
```

#### GET /api/farms/:id
Get a specific farm by ID.

**Response:** `200 OK`

#### PUT /api/farms/:id
Update a farm.

**Request:**
```json
{
  "name": "North Field Updated",
  "area": 6.0
}
```

**Response:** `200 OK`

#### DELETE /api/farms/:id
Delete a farm.

**Response:** `200 OK`

---

## ML Service Endpoints

### Crop Water Prediction

#### POST /crop-water/predict
Predict crop water requirements.

**Request:**
```json
{
  "crop_type": "MAIZE",
  "soil_type": "DRY",
  "region": "Trans-Gangetic Plain Region",
  "temperature": "20-30",
  "weather_condition": "SUNNY"
}
```

**Response:** `200 OK`
```json
{
  "water_requirement": 7.9062,
  "unit": "mm/day",
  "water_requirement_litre_per_acre": 31988.52,
  "unit_litre_per_acre": "L/acre/day"
}
```

#### GET /crop-water/config
Get valid input options.

**Response:** `200 OK`
```json
{
  "crop_types": ["RICE", "WHEAT", "MAIZE", "COTTON", "SUGARCANE"],
  "soil_types": ["DRY", "WET", "HUMID"],
  "regions": ["Western Himalayan Region", "Trans-Gangetic Plain Region", ...],
  "temperature_ranges": ["10-20", "20-30", "30-40"],
  "weather_conditions": ["NORMAL", "SUNNY", "WINDY", "RAINY"]
}
```

### Soil Moisture Forecasting

#### POST /soil-moisture/predict/sensor
Predict soil moisture using sensor data.

**Request:**
```json
{
  "avg_pm1": 45.2,
  "avg_pm2": 48.5,
  "avg_pm3": 50.1,
  "avg_am": 42.0,
  "avg_lum": 650.0,
  "avg_temp": 28.5,
  "avg_humd": 65.0,
  "avg_pres": 1013.25
}
```

**Response:** `200 OK`
```json
{
  "predictions": [46.2, 45.8, 45.3, 44.9, 44.5],
  "days_ahead": [3, 4, 5, 6, 7]
}
```

#### POST /soil-moisture/predict/location
Predict soil moisture using location data.

**Request:**
```json
{
  "state": "Maharashtra",
  "district": "Pune",
  "sm_history": [45.0, 46.2, 44.8, 45.5, 46.0, 45.7, 45.9],
  "month": 3
}
```

**Response:** `200 OK`
```json
{
  "predictions": [45.5, 45.2, 44.9, 44.6, 44.3],
  "days_ahead": [3, 4, 5, 6, 7]
}
```

### Village Water Allocation

#### POST /village/optimize
Optimize water allocation across farmers.

**Request:**
```json
{
  "total_reservoir_capacity": 1000000,
  "farmers": [
    {
      "farmer_id": "F001",
      "crop_water_demand": 50000,
      "soil_moisture_deficit": 15.5,
      "priority": 2
    },
    {
      "farmer_id": "F002",
      "crop_water_demand": 75000,
      "soil_moisture_deficit": 20.0,
      "priority": 3
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "allocations": [
    {
      "farmer_id": "F001",
      "allocated_water": 50000,
      "allocation_percentage": 100.0,
      "status": "Full"
    },
    {
      "farmer_id": "F002",
      "allocated_water": 75000,
      "allocation_percentage": 100.0,
      "status": "Full"
    }
  ],
  "total_allocated": 125000,
  "total_requested": 125000,
  "efficiency": 100.0
}
```

### AI ml-services/chatbot

#### POST /chatbot/chat
Chat with the AI assistant.

**Request:**
```json
{
  "message": "How much water does my rice crop need?",
  "language": "English",
  "context": {
    "crop": "Rice",
    "region": "Central Plateau"
  }
}
```

**Response:** `200 OK`
```json
{
  "response": "Based on your rice crop in the Central Plateau region...",
  "language": "English",
  "timestamp": "2026-02-23T10:30:00Z"
}
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input parameters",
  "details": "Crop type must be one of: RICE, WHEAT, MAIZE, COTTON, SUGARCANE"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required",
  "message": "Please provide a valid JWT token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "message": "Farm with id 507f191e810c19729de860ea not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

The ML Gateway implements rate limiting:

- **Limit:** 100 requests per minute per IP
- **Header:** `X-RateLimit-Remaining` shows remaining requests
- **Response (429):** Too Many Requests

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Testing with cURL

### Example: Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Farmer",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+919876543210",
    "role": "farmer"
  }'
```

### Example: Get Crop Water Prediction
```bash
curl -X POST http://localhost:8000/crop-water/predict \
  -H "Content-Type: application/json" \
  -d '{
    "crop_type": "RICE",
    "soil_type": "WET",
    "region": "Trans-Gangetic Plain Region",
    "temperature": "20-30",
    "weather_condition": "NORMAL"
  }'
```

---

## Postman Collection

Import the Postman collection for easy API testing:

[Download Postman Collection](docs/JalSakhi-API.postman_collection.json) (To be added)

---

**For more details, see:**
- [Backend Source](server/)
- [ML Services Source](ml-services/models/)
- [Architecture Documentation](docs/ARCHITECTURE.md)
