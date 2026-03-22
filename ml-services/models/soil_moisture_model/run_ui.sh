#!/bin/bash
# Run the API and test UI. Use this so the server starts from soil_moisture_model/ and finds static/index.html.
cd "$(dirname "$0")"
echo "Starting server from $(pwd). Open http://localhost:8000 in your browser."
exec python -m uvicorn api:app --host 0.0.0.0 --port 8000
