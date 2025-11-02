from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from urllib.parse import quote as urlquote
import os
import json
import httpx
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Initialize app ONCE ---
app = FastAPI(title="LearnBuddy Multi-Agent API")

# --- Use an environment variable for your key! ---
# It's safer than hardcoding it.
# Set this in your .env file: GROQ_API_KEY="your_real_key"
# For now, we'll make it optional since we're focusing on 3D model generation
api_key = os.getenv("GROQ_API_KEY")

# Initialize Groq client only if API key is provided
groq_client = Groq(api_key=api_key) if api_key else None

# --- Delete this line, it's a duplicate ---
# app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class ARPromptRequest(BaseModel):
    prompt: str


# ---------- Agents ----------

@app.post("/api/ar/generate")
async def generate_ar_model(payload: ARPromptRequest, request: Request):
    """
    Generate a 3D model based on a text prompt using Meshy.ai
    """
    try:
        meshy_api_key = os.getenv("MESHY_API_KEY")
        if not meshy_api_key:
            # Fallback to a sample model if API key is not set
            fallback_model = "https://models.readyplayer.me/64e6d623a91e79002003b8b9.glb"
            # Return a proxied URL so the frontend loads the model through this backend (avoids CORS issues)
            return {"modelUrl": str(request.base_url) + f"api/ar/proxy?url={urlquote(fallback_model, safe='')}"}

        # Call Meshy.ai text-to-3D API
        async with httpx.AsyncClient() as client:
            # Start the text-to-3D job
            response = await client.post(
                "https://api.meshy.ai/v1/text-to-3d",
                headers={
                    "Authorization": f"Bearer {meshy_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "prompt": payload.prompt,
                    "negative_prompt": "low quality, blurry, distorted, deformed, extra limbs, missing limbs",
                    "art_style": "realistic",
                    "resolution": "1024"
                },
                timeout=30.0
            )

            if response.status_code != 200:
                error_detail = response.json().get('detail', 'Unknown error')
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to start Meshy.ai job: {error_detail}"
                )
            
            job_id = response.json().get('id')
            if not job_id:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to get job ID from Meshy.ai response"
                )
            
            # Poll for job completion (with timeout)
            max_attempts = 30  # 30 attempts * 10 seconds = 5 minutes max
            attempt = 0
            
            while attempt < max_attempts:
                await asyncio.sleep(10)  # Check every 10 seconds
                
                job_status = await client.get(
                    f"https://api.meshy.ai/v1/text-to-3d/{job_id}",
                    headers={
                        "Authorization": f"Bearer {meshy_api_key}"
                    },
                    timeout=30.0
                )
                
                job_data = job_status.json()
                status = job_data.get('status')
                
                if status == 'SUCCEEDED':
                    model_url = job_data.get('model_url')
                    if not model_url:
                        raise HTTPException(
                            status_code=500,
                            detail="Model URL not found in successful response"
                        )
                    # Return a proxied URL to avoid CORS issues when loading from the browser
                    return {"modelUrl": str(request.base_url) + f"api/ar/proxy?url={urlquote(model_url, safe='') }"}
                    
                elif status in ['FAILED', 'CANCELLED']:
                    error_msg = job_data.get('error', 'Unknown error')
                    raise HTTPException(
                        status_code=500,
                        detail=f"Meshy.ai job {status.lower()}: {error_msg}"
                    )
                
                attempt += 1
            
            # If we get here, the job timed out
            raise HTTPException(
                status_code=504,
                detail="Timed out waiting for 3D model generation. The model is still being processed."
            )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Request to Meshy.ai API timed out. Please try again later."
        )
    except Exception as e:
        print(f"Error in generate_ar_model: {str(e)}")
        # Fallback to sample model in case of any error
        fallback_model = "https://models.readyplayer.me/64e6d623a91e79002003b8b9.glb"
        return {"modelUrl": fallback_model}


@app.get("/")
async def home():
    return {"message": "Welcome to LearnBuddy Multi-Agent API!"}


@app.get("/api/ar/proxy")
async def ar_proxy(url: str):
    """
    Proxy a remote model URL through the backend to avoid CORS issues for the browser GLTF loader.
    Example: /api/ar/proxy?url=https%3A%2F%2Fexample.com%2Fmodel.glb
    """
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=30.0)
            if resp.status_code != 200:
                raise HTTPException(status_code=502, detail="Upstream fetch failed")
            content_type = resp.headers.get("content-type", "application/octet-stream")
            return StreamingResponse(resp.aiter_bytes(), media_type=content_type)
    except httpx.RequestError as e:
        print(f"Error proxying URL {url}: {e}")
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        print(f"Unexpected error in ar_proxy: {e}")
        raise HTTPException(status_code=500, detail=str(e))