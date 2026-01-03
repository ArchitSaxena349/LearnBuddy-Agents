from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import quote as urlquote
import httpx
import asyncio
import os
from dotenv import load_dotenv
from groq import Groq

# Load .env variables
load_dotenv()

# --- API Keys ---
MESHY_API_KEY = os.getenv("MESHY_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# --- FastAPI app setup ---
app = FastAPI(title="AI 3D Model Generator (Groq + Meshy.ai)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Data model for incoming prompt ---
class ModelPrompt(BaseModel):
    prompt: str


# --- Main endpoint: Generate 3D Model ---
@app.post("/api/generate-model")
async def generate_model(payload: ModelPrompt, request: Request):
    """
    1️⃣ User provides a text prompt.
    2️⃣ Groq AI enhances it into a detailed 3D description.
    3️⃣ Meshy.ai (v2 Preview) generates a 3D model.
    4️⃣ Returns a proxy URL to display the model in the browser.
    """
    if not MESHY_API_KEY:
        raise HTTPException(status_code=500, detail="Missing MESHY_API_KEY in environment.")
    if not groq_client:
        raise HTTPException(status_code=500, detail="Missing GROQ_API_KEY in environment.")

    # Step 1: Enhance the prompt with Groq
    try:
        refined_prompt = await enhance_prompt_with_groq(payload.prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq prompt enhancement failed: {e}")

    # Step 2: Send to Meshy.ai (v2) for 3D generation
    try:
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {MESHY_API_KEY}",
                "Content-Type": "application/json",
            }
            
            # Use Meshy v2 "preview" mode for faster generation
            payload_data = {
                "mode": "preview",
                "prompt": refined_prompt,
                "negative_prompt": "low quality, distorted, deformed, incomplete, blurry",
                "art_style": "realistic",
                "ai_model": "meshy-4" # or "latest"
            }

            start_resp = await client.post(
                "https://api.meshy.ai/openapi/v2/text-to-3d",
                headers=headers,
                json=payload_data,
                timeout=30.0,
            )

            if start_resp.status_code // 100 != 2:
                detail = await _safe_json(start_resp)
                raise HTTPException(status_code=start_resp.status_code, detail=f"Meshy start failed: {detail}")

            job = start_resp.json()
            # v2 usually returns "result" -> "id" or just "result" as ID in some versions, 
            # but based on standard openapi/v2 it returns a task object.
            # Let's inspect 'result' keyword closely if documented, but usually it's 'result' key containing the ID.
            # However, looking at standard async APIs, it often returns "result": "task_id" string or "result": { id: ... }
            # Let's handle generic 'result' or 'id'.
            # Reviewing search structure: Response is "result": "task_id" (string) for some calls, or object.
            # Let's assume standard structure: {"result": "task_id_string"}
            
            job_id = job.get("result")
            if not job_id:
                # Fallback check
                job_id = job.get("id")
            
            if not job_id:
                raise HTTPException(status_code=500, detail=f"Meshy.ai did not return a job ID. Response: {job}")

            # Step 3: Poll job until success
            # v2 polling: GET https://api.meshy.ai/openapi/v2/text-to-3d/{job_id}
            for _ in range(30):  # up to ~150 seconds
                await asyncio.sleep(5)
                status_resp = await client.get(
                    f"https://api.meshy.ai/openapi/v2/text-to-3d/{job_id}",
                    headers=headers,
                    timeout=30.0,
                )

                if status_resp.status_code // 100 != 2:
                    continue

                status_data = status_resp.json()
                # v2 status keys: "status": "SUCCEEDED" / "FAILED" / "IN_PROGRESS"
                status = status_data.get("status", "").upper()

                if status == "SUCCEEDED":
                    model_urls = status_data.get("model_urls", {})
                    # v2 preview often returns glb in 'glb' key inside model_urls
                    model_url = model_urls.get("glb")
                    
                    if not model_url:
                        raise HTTPException(status_code=500, detail=f"Meshy succeeded but no GLB url found. Data: {status_data}")
                        
                    proxy_url = str(request.url_for("proxy_model")) + f"?url={urlquote(model_url, safe='')}"
                    return {
                        "refinedPrompt": refined_prompt,
                        "modelUrl": proxy_url
                    }

                if status in ("FAILED", "EXPIRED", "REJECTED"):
                     raise HTTPException(status_code=500, detail=f"Meshy job failed: {status_data}")

            raise HTTPException(status_code=504, detail="Meshy.ai job timed out.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Meshy request failed: {e}")


# --- Proxy Route ---
@app.get("/api/proxy-model")
async def proxy_model(url: str):
    """
    Proxies a 3D model file (GLB/GLTF) to avoid CORS issues in browser-based 3D viewers.
    """
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=60.0)
            if resp.status_code != 200:
                raise HTTPException(status_code=502, detail="Failed to fetch model from upstream.")
            content_type = resp.headers.get("content-type", "application/octet-stream")
            return StreamingResponse(resp.aiter_bytes(), media_type=content_type)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Proxy error: {e}")


# --- Helper: Call Groq API to enhance user prompt ---
async def enhance_prompt_with_groq(user_prompt: str) -> str:
    """
    Sends a user prompt to Groq to generate a detailed, descriptive version for 3D model creation.
    """
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a 3D prompt enhancement assistant. Expand short prompts into detailed 3D object descriptions suitable for Meshy.ai text-to-3D generation."
                },
                {
                    "role": "user",
                    "content": f"Expand this into a vivid 3D description: '{user_prompt}'"
                }
            ],
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=True,
            stop=None
        )

        # Collect streaming response
        refined_text = ""
        for chunk in completion:
            content = chunk.choices[0].delta.content or ""
            refined_text += content

        return refined_text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API failed: {e}")


# --- Helper: safely extract JSON or text ---
async def _safe_json(resp: httpx.Response):
    try:
        return resp.json()
    except Exception:
        return resp.text


# --- Root route ---
@app.get("/")
async def root():
    return {"message": "Welcome to the AI 3D Model Generator API (Groq + Meshy.ai) 🚀"}
