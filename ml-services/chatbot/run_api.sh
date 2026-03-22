#!/bin/sh
# Run the Chatbot API using the project venv (has langchain_groq, etc.).
cd "$(dirname "$0")"
.venv/bin/python -m uvicorn api:app --host 0.0.0.0 --port 8004
