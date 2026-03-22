# Local Model Gateway

Secure local AI inference gateway for hackathon demo. Exposes three model endpoints behind API key and rate limiting. Designed to run on port 5000 and be exposed via ngrok.

## Security

- **API key**: Every request to `POST /model1`, `POST /model2`, `POST /model3` must include header `x-internal-key` with the value set in `INTERNAL_API_KEY`. Requests without the correct key receive **403 Forbidden**.
- **Helmet**: Security HTTP headers enabled.
- **Rate limiting**: 100 requests per minute per IP (configurable via env).
- **Body limit**: 1 MB max request body.
- **Request timeout**: 60 seconds.

## Endpoints

| Method | Path    | Description                    |
|--------|---------|--------------------------------|
| GET    | /health | Health check. Returns `{ "status": "ok" }`. No auth required. |
| POST   | /model1 | Model 1 inference. Requires `x-internal-key`. JSON body required (non-empty). |
| POST   | /model2 | Model 2 inference. Same as above. |
| POST   | /model3 | Model 3 inference. Same as above. |

Empty or invalid JSON body is rejected with **400 Bad Request**.

### Unified URL: ML model proxies (no API key)

When the Crop Water (8001), Soil Moisture (8000), Village Water (8003), and ml-services/chatbot (8004) APIs are running locally, the gateway proxies them under one base URL so a single ngrok tunnel exposes all four:

| Prefix | Proxied to | Example |
|--------|------------|--------|
| `/crop-water/*` | Crop Water API (default `localhost:8001`) | `POST /crop-water/predict` |
| `/soil-moisture/*` | Soil Moisture API (default `localhost:8000`) | `POST /soil-moisture/predict/sensor` |
| `/village-water/*` | Village Water API (default `localhost:8003`) | `POST /village-water/optimize` |
| `/chatbot/*` | ml-services/chatbot API (default `localhost:8004`) | `POST /chatbot/chat` |

- **GET** `https://your-ngrok-url/crop-water/health` → Crop Water health  
- **POST** `https://your-ngrok-url/crop-water/predict` → Crop Water predict (same body as Model 1)  
- **GET** `https://your-ngrok-url/soil-moisture/health` → Soil Moisture health  
- **POST** `https://your-ngrok-url/soil-moisture/predict/sensor` or `/soil-moisture/predict/location` → Soil Moisture predict  
- **GET** `https://your-ngrok-url/village-water/health` → Village Water health  
- **POST** `https://your-ngrok-url/village-water/optimize` → Village Water optimize  
- **GET** `https://your-ngrok-url/chatbot/health` → ml-services/chatbot health  
- **POST** `https://your-ngrok-url/chatbot/chat` → ml-services/chatbot chat (body: `{"message": "...", "language": "English"}`)  

Proxy targets are configured via `CROP_WATER_API_URL`, `SOIL_MOISTURE_API_URL`, `VILLAGE_WATER_API_URL`, `CHATBOT_API_URL` (see `.env.example`). If a backend is down, the gateway returns **502**.

## Setup

1. Copy `.env.example` to `.env` in this directory.
2. Set `INTERNAL_API_KEY` in `.env` to a strong secret (do not commit `.env`).
3. Install dependencies locally (see commands below).
4. Start the server (see commands below).
5. Optionally expose with ngrok (see commands below).

## Start instructions

- **Initialize**: Create `.env` from `.env.example` and set `INTERNAL_API_KEY`.
- **Install**: From the `ml-services/gateway` directory run `npm install` (dependencies are local to the project).
- **Start server**: From the same directory run `npm start` or `node server.js`. Server listens on port 5000 by default.
- **Expose with ngrok**: In a separate terminal run `ngrok http 5000` (or your configured port). Use the ngrok URL and the same `x-internal-key` value when calling the model endpoints.

## Configuration (environment variables)

All configuration is via environment variables. See `.env.example` for optional overrides (port, body limit, timeout, rate limit window and max).

## Logging

Structured JSON logs to stdout: `timestamp`, `level`, `message`, and optional metadata.

## Graceful shutdown

Server handles `SIGTERM` and `SIGINT` with a graceful shutdown (closes listening socket, then exits). Force-exit after 10 seconds if shutdown does not complete.

---

## Exact terminal commands

**1. Initialize project (create .env from example and set your key)**

```bash
cd ml-services/gateway
cp .env.example .env
# Edit .env and set INTERNAL_API_KEY to a strong secret
```

**2. Install dependencies locally**

```bash
npm install
```

**3. Start server**

```bash
npm start
```

Or:

```bash
node server.js
```

**4. Run ngrok securely on port 5000 (in a separate terminal)**

```bash
ngrok http 5000
```

Use the HTTPS URL ngrok prints (e.g. `https://xxxx.ngrok-free.app`) to call the API. Include the header `x-internal-key: <your INTERNAL_API_KEY value>` on every POST to `/model1`, `/model2`, `/model3`.
