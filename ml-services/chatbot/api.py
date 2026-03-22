"""
FastAPI app for Jalsakhi Chatbot — headless API for the unified gateway.
Reuses logic from app.py and ml_tools.py.

Run with the project venv (required for /chat — langchain_groq, etc.):
  ./run_api.sh
  or: .venv/bin/python -m uvicorn api:app --host 0.0.0.0 --port 8004

LangChain/Groq imports are lazy so /health works without them; /chat needs the venv.
"""
import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

load_dotenv()

JALSAKHI_SYSTEM_BASE = """You are Jalsakhi, a helpful water and agriculture assistant for farmers and village planners in India.

You have access to these tools when needed:

1. **predict_crop_water**: Use when the user asks how much water a crop needs. Use EXACT values: crop_type (MAIZE, RICE, WHEAT, etc.), soil_type (DRY, WET, HUMID), region (use exact: "Central Plateau & Hills Region", "Trans-Gangetic Plain Region", "Western Himalayan Region", etc.—copy from the tool schema), temperature (10-20, 20-30, 30-40, 40-50), weather_condition (NORMAL, SUNNY, WINDY, RAINY). Explain mm/day and L/acre/day.

2. **predict_soil_moisture_sensor**: Use when the user has sensor readings (PM1, PM2, PM3, AM, luminosity, temp, humidity, pressure) and wants soil moisture forecast for days 3–7. Optional: avg_sm_lag1, avg_sm_lag2.

3. **predict_soil_moisture_location**: Use when the user gives state, district, and last 7 soil moisture values, wanting forecast for days 3–7. sm_history must be 7 numbers, most recent last; use JSON array e.g. "[25,26,27,28,29,30,31]".

4. **optimize_village_water**: Use when the user wants to distribute reservoir water across farms. Need total_available_water_liters and farms_json (array of farms: farm_id, area_ha or area_acre, crop_type, soil_type, region, temperature, weather_condition, priority_score 1-3). Explain allocations and efficiency.

If a tool returns an error, say so clearly. Do not invent numbers. Be concise."""

LANGUAGE_PROMPTS = {
    "English": "Respond only in English.",
    "हिंदी (Hindi)": "Respond only in Hindi (हिंदी). Use Devanagari script for all Hindi text. Keep technical terms (e.g. mm/day, crop names) in English when needed for clarity.",
    "मराठी (Marathi)": "Respond only in Marathi (मराठी). Use Devanagari script for all Marathi text. Keep technical terms (e.g. mm/day, crop names) in English when needed for clarity.",
}

app = FastAPI(title="Jalsakhi Chatbot API", description="Water and agriculture assistant — crop water, soil moisture, village allocation.")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User message")
    language: str = Field(default="English", description="One of: English, हिंदी (Hindi), मराठी (Marathi)")


class ChatResponse(BaseModel):
    reply: str
    tools_used: list[str] = []


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
    from langchain_groq import ChatGroq
    from ml_tools import get_jalsakhi_tools

    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY not set")
    tools = get_jalsakhi_tools()
    tool_map = {t.name: t for t in tools}
    lang_instruction = LANGUAGE_PROMPTS.get(req.language, LANGUAGE_PROMPTS["English"])
    system_content = f"{JALSAKHI_SYSTEM_BASE}\n\nIMPORTANT: {lang_instruction}"
    messages: list[Any] = [
        SystemMessage(content=system_content),
        HumanMessage(content=req.message.strip()),
    ]
    tools_used: list[str] = []
    llm = ChatGroq(groq_api_key=groq_key, model_name="llama-3.1-8b-instant")
    llm_with_tools = llm.bind_tools(tools)
    max_rounds = 10
    use_tools = True
    response = None

    while max_rounds > 0:
        max_rounds -= 1
        try:
            response = llm_with_tools.invoke(messages) if use_tools else llm.invoke(messages)
        except Exception as api_err:
            err_str = str(api_err).lower()
            if use_tools and ("tool_use_failed" in err_str or "400" in str(api_err)):
                use_tools = False
                response = llm.invoke(messages)
            else:
                raise HTTPException(status_code=502, detail=f"LLM error: {api_err}")

        if not getattr(response, "tool_calls", None):
            break

        tool_messages = []
        for tc in response.tool_calls:
            if hasattr(tc, "get"):
                name = tc.get("name", "")
                args = tc.get("args") or {}
                tid = tc.get("id", "")
            else:
                name = getattr(tc, "name", "")
                args = getattr(tc, "args", None) or {}
                tid = getattr(tc, "id", "")
            if name in tool_map:
                tools_used.append(name)
                try:
                    result = tool_map[name].invoke(args)
                except Exception as e:
                    result = str(e)
            else:
                result = f"Unknown tool: {name}"
            tool_messages.append(
                ToolMessage(
                    content=result if isinstance(result, str) else str(result),
                    tool_call_id=tid,
                )
            )
        messages.append(response)
        messages.extend(tool_messages)

    if response is None:
        raise HTTPException(status_code=500, detail="No response from model")
    final_content = getattr(response, "content", None) or ""
    if isinstance(final_content, list):
        final_content = " ".join(
            (c.get("text", "") if isinstance(c, dict) else str(c) for c in final_content)
        )
    return ChatResponse(reply=final_content, tools_used=tools_used)
