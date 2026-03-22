# Quick Reference - New Structure

## 🚀 Quick Start Commands

### Starting the Full Stack

```bash
# 1. Start Backend API
cd server && npm start

# 2. Start ML Services (in new terminal)
cd ml-services/models && uvicorn unified_api.main:app --host 0.0.0.0 --port 8000

# 3. Start Gateway (in new terminal)
cd ml-services/gateway && npm start

# 4. Start Mobile App (in new terminal)
cd app && npm start
```

### One-Time Setup

```bash
# Run the automated setup
./setup.sh

# Or manually:
cd server && npm install
cd ../app && npm install
cd ../ml-services/gateway && npm install
cd ../models && pip install -r unified_api/requirements.txt
cd ../chatbot && pip install -r requirements.txt
```

## 📁 New Folder Structure

- **app/** - Mobile app (was: jalsakhi-expo-app/)
- **server/** - Backend API (unchanged)
- **ml-services/** - All ML code:
  - **models/** - ML models (was: ML models/)
  - **gateway/** - API gateway (was: local-model-gateway/)
  - **chatbot/** - AI chatbot (was: Chatbot/)
- **docs/** - Documentation
- **images/** - Screenshots

## 🔧 Common Tasks

### Train ML Models
```bash
cd ml-services/models/Crop_Water_Model && python train.py
cd ../soil_moisture_model && python train.py
```

### Test APIs
```bash
# ML Services API docs
open http://localhost:8000/docs

# Test backend
curl http://localhost:3000/api/health
```

### Mobile Development
```bash
cd app
npm start    # Start Expo
# Then scan QR code with Expo Go app
```

## 📝 Git Commands

### View Changes
```bash
git status
git diff --staged
```

### Commit Restructuring
```bash
git add -A
git commit -m "refactor: reorganize repository into cleaner structure

- Group all ML services under ml-services/
- Rename app for clarity
- Update all documentation
- Preserve git history"

git push origin main
```

## 🔍 Finding Files

### Old Location → New Location

| Old Path | New Path |
|----------|----------|
| `jalsakhi-expo-app/` | `app/` |
| `ML models/` | `ml-services/models/` |
| `Chatbot/` | `ml-services/chatbot/` |
| `local-model-gateway/` | `ml-services/gateway/` |
| `server/` | `server/` (unchanged) |
| `images/` | `images/` (unchanged) |

---

**See [RESTRUCTURE_COMPLETE.md](RESTRUCTURE_COMPLETE.md) for full details**
