# JalSakhi - Total Local System Guide

This project has been transformed into a **Total Local System**. All components (Mobile App, Backend Server, and ML Models) now run on your local network.

## Components and Ports

| Service | Port | Description |
| :--- | :--- | :--- |
| **Mobile App (Expo)** | 8081 | The React Native UI |
| **Backend Server** | 3000 | Main Node.js API (Auth, User, Farm) |
| **ML Gateway** | 5000 | Node.js proxy to unify AI services |
| **Unified ML API** | 8000 | Python FastAPI hosting all ML models |

## Quick Start

1. **Open a Terminal** in the project root.
2. **Run the startup script**:
   ```bash
   ./start-local.sh
   ```
3. **Connect your Mobile Phone**:
   - Ensure your phone is on the **same Wi-Fi network** as your computer.
   - Open the **Expo Go** app.
   - Scan the QR code shown in the terminal.

## Key Local Configurations

The platform now uses your local network IP (e.g., `192.168.x.x`) to bridge all services.

### Discovering the local IP
If you need to check your local IP manually:
```bash
ipconfig getifaddr en0
```

### Checking Logs
Background logs are automatically generated for the backend services:
- `logs-ml.txt`: Logs from the Python ML services.
- `logs-gateway.txt`: Logs from the ML Gateway.
- `logs-server.txt`: Logs from the Main Backend.

## Troubleshooting

- **Connection Error**: Double-check that your computer's firewall allows incoming connections on ports 3000 and 8081.
- **ML Services Down**: Ensure you have Python 3.10+ installed and all dependencies in `ml-services/models/unified_api/requirements.txt` are satisfied.
