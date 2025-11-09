from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import quote as urlquote
import os
import httpx
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file (if present)
load_dotenv()

app = FastAPI(title="LearnBuddy - 3D Model API (minimal)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ARPromptRequest(BaseModel):
    prompt: str


@app.post("/api/ar/generate")
async def generate_ar_model(payload: ARPromptRequest, request: Request):
    """Generate a 3D model from text using Meshy.ai (or return a fallback proxied model).

    Behavior:
    - If MESHY_API_KEY is not set, return a proxied URL to a sample GLB.
    - If set, start a Meshy.ai job and poll until completion (with timeout).
    """
    meshy_api_key = os.getenv("MESHY_API_KEY")

    # Simple fallback when Meshy API key isn't configured
    if not meshy_api_key:
        fallback_model = "https://models.readyplayer.me/64e6d623a91e79002003b8b9.glb"
        proxy_url = str(request.url_for("ar_proxy")) + f"?url={urlquote(fallback_model, safe='')}"
        return {"modelUrl": proxy_url}

    # If user provided an API key, call Meshy.ai
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.meshy.ai/v1/text-to-3d",
                headers={
                    "Authorization": f"Bearer {meshy_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "prompt": payload.prompt,
                    "negative_prompt": "low quality, blurry, distorted, deformed, extra limbs, missing limbs",
                    "art_style": "realistic",
                    "resolution": "1024",
                },
                timeout=30.0,
            )

            # Accept any 2xx as success (some APIs return 201/202)
            if resp.status_code // 100 != 2:
                # Log response for debugging and return fallback proxied model
                try:
                    detail = resp.json()
                except Exception:
                    detail = resp.text
                print(f"Meshy.ai start job failed: status={resp.status_code}, detail={detail}")
                fallback_model = "https://models.readyplayer.me/64e6d623a91e79002003b8b9.glb"
                proxy_url = str(request.url_for("ar_proxy")) + f"?url={urlquote(fallback_model, safe='')}"
                return {"modelUrl": proxy_url}

            job = resp.json()
            # Support multiple possible job id keys
            job_id = job.get("id") or job.get("job_id") or job.get("job")
            if not job_id:
                print(f"Meshy.ai response missing job id: {job}")
                raise HTTPException(status_code=500, detail="Meshy.ai did not return a job id")

            # Poll for completion
            max_attempts = 30
            for attempt in range(max_attempts):
                await asyncio.sleep(5)
                status_resp = await client.get(
                    f"https://api.meshy.ai/v1/text-to-3d/{job_id}",
                    headers={"Authorization": f"Bearer {meshy_api_key}"},
                    timeout=30.0,
                )
                # Continue polling on non-200, but log for debugging
                if status_resp.status_code // 100 != 2:
                    print(f"Meshy.ai status check returned {status_resp.status_code}: {status_resp.text}")
                    continue
                status_data = status_resp.json()
                status = (status_data.get("status") or "").upper()
                if status == "SUCCEEDED" or status == "SUCCESS":
                    model_url = status_data.get("model_url") or status_data.get("url")
                    if not model_url:
                        print(f"Meshy.ai succeeded but no model_url in: {status_data}")
                        raise HTTPException(status_code=500, detail="Meshy.ai succeeded but no model_url provided")
                    proxy_url = str(request.url_for("ar_proxy")) + f"?url={urlquote(model_url, safe='')}"
                    return {"modelUrl": proxy_url}
                if status in ("FAILED", "CANCELLED", "ERROR"):
                    print(f"Meshy.ai job ended with status: {status}, data: {status_data}")
                    break

            # Timeout or failed - return fallback proxied model
            print("Meshy.ai job timed out or failed; returning fallback model")
            fallback_model = "https://models.readyplayer.me/64e6d623a91e79002003b8b9.glb"
            proxy_url = str(request.url_for("ar_proxy")) + f"?url={urlquote(fallback_model, safe='')}"
            return {"modelUrl": proxy_url}

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Meshy.ai request timed out")
    except Exception as e:
        print(f"Unexpected error contacting Meshy.ai: {e}")
        # On any unexpected error, return fallback proxied model
        fallback_model = "https://models.readyplayer.me/64e6d623a91e79002003b8b9.glb"
        proxy_url = str(request.url_for("ar_proxy")) + f"?url={urlquote(fallback_model, safe='')}"
        return {"modelUrl": proxy_url}


@app.get("/")
async def home():
    return {"message": "Welcome to LearnBuddy - 3D Model API (minimal)"}


@app.get("/api/ar/proxy")
async def ar_proxy(url: str):
    """Proxy a remote GLB/GLTF URL through this backend to avoid CORS issues for browser loaders."""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=30.0)
            if resp.status_code != 200:
                raise HTTPException(status_code=502, detail="Upstream fetch failed")
            content_type = resp.headers.get("content-type", "application/octet-stream")
            return StreamingResponse(resp.aiter_bytes(), media_type=content_type)
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=str(e))
