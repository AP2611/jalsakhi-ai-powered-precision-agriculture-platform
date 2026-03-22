# 🏗️ JalSakhi Architecture

## Overview

JalSakhi is a comprehensive AI-powered precision agriculture platform designed to optimize water management for farmers and village administrators in India.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     End Users                                │
│  👨‍🌾 Farmers        👔 Admin/Planners      📱 Mobile/Web     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Mobile Application Layer                        │
│   React Native (Expo) - TypeScript                          │
│   - Farmer Dashboard    - Admin Dashboard                    │
│   - Farm Management     - Water Allocation                   │
│   - ML Predictions      - Analytics & Reports                │
│   - Multilingual (EN/HI/MR)                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API Layer (Node.js)                     │
│   Express.js + MongoDB Atlas                                 │
│   - Authentication (JWT + Email OTP)                         │
│   - Farm Data Management                                     │
│   - User Management                                          │
│   - Irrigation Logs                                          │
│   - API Gateway to ML Services                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         ML Gateway (Security & Rate Limiting)                │
│   Node.js Express                                            │
│   - API Key Authentication                                   │
│   - Rate Limiting & Request Validation                       │
│   - Proxy to ML Services                                     │
│   - Request Timeout Management                               │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
        ▼            ▼            ▼            ▼
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Crop Water   │ Soil Moisture│ Village Water│  AI ml-services/chatbot  │
│ Prediction   │  Forecasting │  Allocation  │   (Groq)     │
│              │              │              │              │
│ FastAPI      │ FastAPI      │ FastAPI      │ FastAPI      │
│ Random Forest│ Prophet/LSTM │ Optimization │ Llama 3.1    │
│ Scikit-learn │ TensorFlow   │ Heuristic    │ LangChain    │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

## Component Details

### 1. Mobile Application (`app/`)

**Technology Stack:**
- React Native 0.81
- Expo SDK 54
- TypeScript
- Expo Router (file-based routing)
- React Context API (state management)
- AsyncStorage (local data)
- Axios (HTTP client)

**Key Features:**
- Multilingual support (English, Hindi, Marathi)
- Role-based access (Farmer, Admin)
- Real-time weather integration
- Farm and crop management
- Irrigation logging
- ML-powered predictions
- Interactive dashboards

**Screens:**
```
app/
├── (auth)/           # Authentication flow
│   ├── login.tsx
│   ├── register.tsx
│   └── onboarding.tsx
├── farmer/           # Farmer features
│   ├── dashboard.tsx
│   ├── farms.tsx
│   ├── crop-water.tsx
│   └── soil-moisture.tsx
└── admin/            # Admin features
    ├── dashboard.tsx
    ├── users.tsx
    └── allocation.tsx
```

### 2. Backend Server (`server/`)

**Technology Stack:**
- Node.js 18+
- Express.js 4
- MongoDB Atlas (Mongoose ODM)
- JWT Authentication
- Nodemailer (Email OTP)
- Helmet (Security headers)
- CORS middleware

**API Endpoints:**

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login (returns JWT) |
| `/api/auth/send-otp` | POST | Send email OTP |
| `/api/auth/verify-otp` | POST | Verify OTP |
| `/api/user/data` | GET | Get user profile |
| `/api/farms` | GET/POST | Farm CRUD operations |
| `/api/farms/:id` | GET/PUT/DELETE | Individual farm operations |
| `/api/ai/*` | * | Proxy to ML services |

**Database Schema:**
```javascript
User {
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: Enum ['farmer', 'admin'],
  verified: Boolean,
  createdAt: Date
}

Farm {
  userId: ObjectId (ref: User),
  name: String,
  cropType: Enum ['Rice', 'Wheat', 'Sugarcane', ...],
  area: Number (acres),
  soilType: Enum ['Sandy', 'Clay', 'Loamy'],
  location: { lat: Number, lng: Number },
  irrigationHistory: [{ date: Date, amount: Number }]
}
```

### 3. ML Gateway (`gateway/`)

**Technology Stack:**
- Node.js 18+
- Express.js
- HTTP Proxy Middleware
- Express Rate Limit
- Helmet

**Features:**
- API key authentication (`x-internal-key` header)
- Rate limiting (100 req/min per IP)
- Request timeout (60s)
- Body size limit (1MB)
- CORS configuration
- Health check endpoint
- Structured logging

**Protected Endpoints:**
- `/crop-water/*` → Crop Water API (port 8001)
- `/soil-moisture/*` → Soil Moisture API (port 8002)
- `/village-water/*` → Village Allocation API (port 8003)
- `/chatbot/*` → ml-services/chatbot API (port 8004)

### 4. ML Services (`ml-services/models/`)

#### a) Crop Water Prediction
**Model:** Random Forest Regressor  
**Framework:** Scikit-learn  
**Input Features:**
- Crop type (Rice, Wheat, Maize, Cotton, Sugarcane)
- Soil type (Dry, Wet, Humid)
- Agro-climatic zone (15 Indian regions)
- Temperature range
- Weather condition (Normal, Sunny, Windy, Rainy)

**Output:**
- Water requirement (mm/day)
- Water requirement (L/acre/day)

**Endpoints:**
- `GET /health` - Health check
- `GET /config` - Get valid input options
- `POST /predict` - Get water prediction

#### b) Soil Moisture Forecasting
**Models:** 
- Sensor-based: Prophet/LSTM
- Location-based: Random Forest with time series features

**Input Features:**
- **Sensor mode:** PM1, PM2, PM3, AM, Luminosity, Temp, Humidity, Pressure
- **Location mode:** State, District, Historical moisture data

**Output:**
- 7-day moisture forecast (%)
- Days ahead: [3, 4, 5, 6, 7]

**Endpoints:**
- `GET /health` - Health check
- `POST /predict/sensor` - Sensor-based prediction
- `POST /predict/location` - Location-based prediction
- `POST /predict` - Unified prediction (auto-detect mode)

#### c) Village Water Allocation
**Algorithm:** Heuristic optimization  
**Approach:** Priority-based fair distribution

**Input:**
- Total reservoir capacity (liters)
- List of farmers with:
  - Crop water demand
  - Soil moisture deficit
  - Priority score (1-3)

**Output:**
- Allocation plan for each farmer
- Allocation percentage
- Allocation status (Full, Partial, Minimal)
- Overall efficiency metrics

**Endpoints:**
- `GET /health` - Health check
- `POST /optimize` - Get allocation plan
- `GET /` - Web UI for visualization

#### d) AI ml-services/chatbot
**Model:** Llama 3.1 (8B) via Groq API  
**Framework:** LangChain  
**Capabilities:**
- Multilingual (English, Hindi, Marathi)
- Context-aware responses
- Integration with other ML services
- Tool calling for real-time data

**Endpoints:**
- `POST /chat` - Send message and get response

## Data Flow

### Farmer Workflow
```
1. Registration → Email OTP → Login
2. Create Farm → Add crop, soil, location data
3. Request Prediction:
   a. Select service (Crop Water / Soil Moisture)
   b. Input parameters
   c. Mobile app → Backend → ML Gateway → ML Service
   d. ML Service processes → Returns prediction
   e. Result displayed to farmer
4. Log Irrigation → Save to database
5. View History & Analytics
```

### Admin Workflow
```
1. Login (Admin role)
2. View Village Dashboard:
   - Total reservoir capacity
   - Total farmer demand
   - Current allocations
3. Run Water Allocation:
   a. Input reservoir capacity
   b. System fetches all farmer demands
   c. Request to ML Gateway → Village Water Service
   d. Optimization algorithm runs
   e. Returns fair allocation plan
4. Review & Approve allocations
5. Notify farmers
```

## Security Measures

1. **Authentication:**
   - JWT tokens for API access
   - Email OTP verification
   - Secure password hashing (bcrypt)

2. **API Protection:**
   - Rate limiting on gateway
   - Request timeout enforcement
   - Body size limits
   - API key validation
   - CORS configuration

3. **Data Security:**
   - Environment variable management
   - Secrets not committed to repo
   - HTTPS in production
   - Helmet security headers

## Deployment Architecture

### Development Environment
```
Mobile: Expo Go / Dev Build
Backend: localhost:3000
Gateway: localhost:5000
ML Services: localhost:8001-8004
```

### Production Environment (Proposed)
```
Mobile: Expo EAS Build → APK/IPA
Backend: Azure App Service (Node.js)
Database: MongoDB Atlas (Shared/Dedicated)
ML Services: Azure Container Instances / Kubernetes
Gateway: Azure App Service (with rate limiting)
```

## Scaling Considerations

1. **Horizontal Scaling:**
   - Deploy multiple ML service instances
   - Load balancer for gateway
   - Redis for distributed rate limiting

2. **Caching:**
   - Cache frequent predictions (Redis)
   - CDN for static assets
   - API response caching

3. **Optimization:**
   - Model quantization for faster inference
   - Batch prediction support
   - Async task processing (Celery/Bull)

## Monitoring & Logging

**Current:**
- Console logging in all services
- Express access logs
- Expo error reporting

**Recommended:**
- Application Performance Monitoring (APM)
- Centralized logging (ELK stack)
- Metrics dashboard (Grafana)
- Error tracking (Sentry)
- API analytics

## Technology Choices & Rationale

| Component | Technology | Why? |
|-----------|-----------|------|
| Mobile | React Native + Expo | Cross-platform, rapid development, OTA updates |
| Backend | Node.js + Express | JavaScript ecosystem, async I/O, easy scaling |
| Database | MongoDB | Flexible schema, JSON-like documents, Atlas hosting |
| ML | Python + FastAPI | Rich ML libraries, FastAPI performance, async support |
| ML Models | Scikit-learn, Prophet | Production-ready, well-documented, performant |
| Gateway | Node.js | Same stack as backend, good proxy libraries |
| LLM | Groq (Llama) | Free tier, fast inference, multilingual |

## Future Enhancements

1. **Features:**
   - Weather API integration (real-time)
   - IoT sensor integration
   - Satellite imagery analysis
   - Pest detection
   - Market price predictions

2. **Technical:**
   - GraphQL API
   - Real-time updates (WebSockets)
   - Progressive Web App (PWA)
   - Offline-first architecture
   - Automated testing (Jest, Pytest)
   - CI/CD pipelines

3. **ML Improvements:**
   - Model versioning (MLflow)
   - A/B testing for models
   - AutoML for hyperparameter tuning
   - Explainable AI (SHAP, LIME)
   - Federated learning

## Development Setup

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed setup instructions.

Quick start:
```bash
# 1. Backend
cd server && npm install && npm start

# 2. ML Services
cd "ml-services/models/unified_api" && pip install -r requirements.txt
uvicorn unified_api.main:app --host 0.0.0.0 --port 8000

# 3. Gateway
cd gateway && npm install && npm start

# 4. Mobile App
cd app && npm install && npm start
```

## Documentation

- [README.md](../README.md) - Project overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [Mobile App README](../app/README.md) - Mobile app details
- [ML Models README](../ml-services/models/README.md) - ML service details
- [Gateway README](../gateway/README.md) - Gateway configuration

---

**Maintained by JalSakhi Team**  
*Building the future of precision agriculture*
