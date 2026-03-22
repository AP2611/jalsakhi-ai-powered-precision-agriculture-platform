import os
from typing import Any

import streamlit as st
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_groq import ChatGroq

from ml_tools import get_jalsakhi_tools

load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")

if not groq_key:
    st.error("GROQ_API_KEY not found in .env file")
    st.stop()

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

st.title("Jalsakhi Chatbot")
st.caption("Water and agriculture assistant — crop water, soil moisture, village allocation.")
lang = st.selectbox("भाषा / Language", options=list(LANGUAGE_PROMPTS.keys()), index=0)
user_input = st.text_input("Ask something", placeholder="e.g. How much water does maize need? / मक्का को कितना पाणी लागते? / मक्याला किती पाणी लागते?")

tools = get_jalsakhi_tools()
tool_map = {t.name: t for t in tools}

llm = ChatGroq(
    groq_api_key=groq_key,
    model_name="llama-3.1-8b-instant",
)
llm_with_tools = llm.bind_tools(tools)

if user_input:
    try:
        language_instruction = LANGUAGE_PROMPTS.get(lang, LANGUAGE_PROMPTS["English"])
        system_content = f"{JALSAKHI_SYSTEM_BASE}\n\nIMPORTANT: {language_instruction}"
        messages: list[Any] = [
            SystemMessage(content=system_content),
            HumanMessage(content=user_input),
        ]
        tools_used: list[str] = []
        max_rounds = 10
        use_tools = True

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
                    raise

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
                    ToolMessage(content=result if isinstance(result, str) else str(result), tool_call_id=tid)
                )

            messages.append(response)
            messages.extend(tool_messages)

        final_content = getattr(response, "content", None) or ""
        if isinstance(final_content, list):
            final_content = " ".join(
                (c.get("text", "") if isinstance(c, dict) else str(c) for c in final_content)
            )
        st.write(final_content)

        if tools_used:
            st.caption(f"Tools used: {', '.join(tools_used)}")

    except Exception as e:
        st.error(f"Error: {e}")
