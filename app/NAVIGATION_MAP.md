# JalSakhi App - Screen Navigation Map

## 📱 App Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Landing Page                            │
│                    app/index.tsx                            │
│                                                             │
│   [JalSakhi Logo]                                          │
│                                                             │
│   ┌─────────────────┐     ┌─────────────────┐            │
│   │  I'm a Farmer   │     │  I'm an Admin   │            │
│   └─────────────────┘     └─────────────────┘            │
└───────────┬────────────────────────┬───────────────────────┘
            │                        │
            v                        v
┌───────────────────────┐  ┌───────────────────────┐
│   Farmer Signup       │  │    Admin Signup       │
│ (auth)/farmer-signup  │  │  (auth)/admin-signup  │
│                       │  │                       │
│ - Email               │  │ - Email               │
│ - Name                │  │ - Name                │
│ - Land Details        │  │ - Village             │
│ - OTP Verification    │  │ - OTP Verification    │
└───────────┬───────────┘  └───────────┬───────────┘
            │                          │
            v                          v
┌───────────────────────────────────────────────────┐
│              FARMER DASHBOARD                      │
│           farmer/dashboard.tsx                     │
│                                                    │
│  [Welcome Header]                                  │
│  [Weather Widget] [Crop Calendar]                 │
│                                                    │
│  🌾 Seasonal Suggestions                          │
│     [Maize] [Bajra] [Onion]                      │
│                                                    │
│  🔧 Smart Farm Tools                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────┐│
│  │ Crop Water   │ │ Soil Moisture│ │  Water   ││
│  │ Prediction   │ │  Forecast    │ │Allocation││
│  └──────┬───────┘ └──────┬───────┘ └────┬─────┘│
│         │                 │                │      │
│         v                 v                v      │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────┐│
│  │ Model 1      │ │ Model 2      │ │ Model 3   ││
│  │ Input Screen │ │ Output Screen│ │Farmer View││
│  └──────────────┘ └──────────────┘ └───────────┘│
│                                                    │
│  💧 Water Management                              │
│     [Credits: 1,250] [Weekly Usage Chart]        │
└────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│              ADMIN DASHBOARD                       │
│             admin/index.tsx                        │
│                                                    │
│  [Village: Shirur]                                │
│                                                    │
│  📊 Village Analysis                              │
│     142 Farmers | 320 Farms | 85% Efficiency     │
│                                                    │
│  ┌─────────────────────────────────────────────┐ │
│  │         Water Allocation                    │ │
│  │  850K L Quota | 520K L Allocated Today     │ │
│  └────────────────┬────────────────────────────┘ │
│                   │                                │
│                   v                                │
│  ┌─────────────────────────────────────────────┐ │
│  │    Water Allocation Optimizer               │ │
│  │  admin/water-allocation-optimizer.tsx       │ │
│  │                                             │ │
│  │  💧 Reservoir: 38,500 L / 50,000 L         │ │
│  │  🌤️ Rainfall: 25mm | Temp: 32°C           │ │
│  │  📅 Period: 7 days                         │ │
│  │                                             │ │
│  │  👨‍🌾 Farmers Priority List:                │ │
│  │  ┌─────────────────────────────────────┐  │ │
│  │  │ Ramesh | 2.5 acres | Rice, Wheat    │  │ │
│  │  │ [High] [Med] [Low]                  │  │ │
│  │  └─────────────────────────────────────┘  │ │
│  │  [Optimize Water Allocation] ──────────┐  │ │
│  └─────────────────────────────────────┬──┘  │ │
│                                        │      │ │
│                                        v      │ │
│  ┌─────────────────────────────────────────┐ │ │
│  │      Allocation Results                 │ │ │
│  │  admin/allocation-results.tsx           │ │ │
│  │                                         │ │ │
│  │  📊 36,200 L Allocated | 86% Efficiency│ │ │
│  │  🎯 92% Fairness Score                 │ │ │
│  │                                         │ │ │
│  │  Individual Allocations:                │ │ │
│  │  ┌───────────────────────────────────┐ │ │ │
│  │  │ Ramesh: 1,650 L (94% satisfied)   │ │ │ │
│  │  │ Schedule: 5 slots over 7 days     │ │ │ │
│  │  └───────────────────────────────────┘ │ │ │
│  │  [Adjust] [Apply Allocation]           │ │ │
│  └─────────────────────────────────────────┘ │ │
│                                                │ │
│  ┌──────────────┐ ┌──────────────┐            │ │
│  │ Reservoir    │ │  Village     │            │ │
│  │   Status     │ │  Analytics   │            │ │
│  │   75% Full   │ │ 68% Efficient│            │ │
│  └──────────────┘ └──────────────┘            │ │
│                                                │ │
│  ┌──────────────────────────────┐             │ │
│  │    Farmer Management         │             │ │
│  │    142 Total Farmers         │             │ │
│  └──────────────────────────────┘             │ │
└────────────────────────────────────────────────┘
```

## 🔄 Navigation Paths

### Farmer Flow
```
Landing → Farmer Signup → OTP → Dashboard
                                    ├─→ Crop Water Input → Results
                                    ├─→ Soil Moisture Forecast
                                    ├─→ Water Allocation View
                                    ├─→ My Farms
                                    ├─→ Weather
                                    ├─→ Alerts
                                    └─→ Usage History
```

### Admin Flow
```
Landing → Admin Signup → OTP → Dashboard
                                  ├─→ Water Allocation Optimizer → Results
                                  ├─→ Reservoir Status
                                  ├─→ Village Analytics
                                  └─→ Farmer Management
```

## 📂 File Locations

### Farmer Screens
| Screen Name | File Path | Type |
|------------|-----------|------|
| Farmer Dashboard | `app/farmer/dashboard.tsx` | Main |
| Crop Water Input | `app/farmer/crop-water-input.tsx` | Input |
| Crop Water Results | `app/farmer/crop-water-results.tsx` | Output |
| Soil Moisture Forecast | `app/farmer/soil-moisture-forecast.tsx` | Output |
| Water Allocation View | `app/farmer/water-allocation-view.tsx` | Output |
| My Farms | `app/farmer/my-farms.tsx` | Existing |
| Weather | `app/farmer/weather.tsx` | Existing |
| Alerts | `app/farmer/alerts.tsx` | Existing |
| Usage History | `app/farmer/usage-history.tsx` | Existing |

### Admin Screens
| Screen Name | File Path | Type |
|------------|-----------|------|
| Admin Dashboard | `app/admin/index.tsx` | Main |
| Water Allocation Optimizer | `app/admin/water-allocation-optimizer.tsx` | Input |
| Allocation Results | `app/admin/allocation-results.tsx` | Output |
| Reservoir Status | `app/admin/reservoir-status.tsx` | Existing |
| Village Analytics | `app/admin/village-analytics.tsx` | Existing |
| Farmer Management | `app/admin/farmer-management.tsx` | Existing |

### Auth Screens
| Screen Name | File Path | Type |
|------------|-----------|------|
| Landing Page | `app/index.tsx` | Entry |
| Role Selection | `app/(auth)/role.tsx` | Auth |
| Language Selection | `app/(auth)/language.tsx` | Auth |
| Farmer Signup | `app/(auth)/farmer-signup.tsx` | Auth |
| Admin Signup | `app/(auth)/admin-signup.tsx` | Auth |
| OTP Verification | `app/(auth)/otp.tsx` | Auth |
| Login | `app/(auth)/login.tsx` | Auth |

## 🔗 Navigation Commands

### From Code
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Farmer Navigation
router.push('/farmer/dashboard');
router.push('/farmer/crop-water-input');
router.push('/farmer/crop-water-results');
router.push('/farmer/soil-moisture-forecast');
router.push('/farmer/water-allocation-view');

// Admin Navigation
router.push('/admin');
router.push('/admin/water-allocation-optimizer');
router.push('/admin/allocation-results');

// Auth Navigation
router.push('/(auth)/farmer-signup');
router.push('/(auth)/admin-signup');
router.push('/(auth)/otp');
router.push('/(auth)/login');

// Back Navigation
router.back();
```

### With Parameters
```typescript
// Navigate to results with data
router.push({
  pathname: '/farmer/crop-water-results',
  params: { 
    prediction: JSON.stringify(predictionData),
    inputData: JSON.stringify(formData)
  }
});

// Navigate to allocation results
router.push({
  pathname: '/admin/allocation-results',
  params: { 
    optimization: JSON.stringify(optimizationData),
    inputData: JSON.stringify({ farmersCount: 4 })
  }
});
```

## 🎨 Screen Relationships

### Model 1: Crop Water Requirement
```
Input Screen (Farmer) ──API──> Results Screen (Farmer)
  ↓                              ↓
Form Data                    Prediction + Schedule
```

### Model 2: Soil Moisture Forecast
```
Auto-fetch (Farmer) ──API──> Output Screen (Farmer)
                               ↓
                          7-day Forecast
```

### Model 3: Water Allocation
```
Optimizer (Admin) ──API──> Results (Admin) ──Save──> View (Farmer)
      ↓                        ↓                         ↓
  Farm Priorities        Optimized Plan           Weekly Quota
```

## 📊 Data Flow

### Farmer Side
1. **Crop Water**: Farmer inputs crop/weather data → Model predicts → Shows schedule
2. **Soil Moisture**: Auto-fetch sensor data → Model forecasts → Shows 7-day trend
3. **Water Allocation**: View allocation set by admin → See schedule → Track usage

### Admin Side
1. **Optimization**: Input reservoir + weather → Adjust priorities → Run optimizer
2. **Results**: Review allocations → Check fairness → Apply to all farmers
3. **Management**: Monitor reservoir → Track village efficiency → Manage farmers

---
**Quick Reference**: Use this map to understand screen flow and navigation structure.
