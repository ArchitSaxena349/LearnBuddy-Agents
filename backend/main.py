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

# ---------- Models ----------
class PlannerRequest(BaseModel):
    query: str

class SubjectRequest(BaseModel):
    subject: str

class FeedbackRequest(BaseModel):
    input: str

class MotivationRequest(BaseModel):
    mood: str

class ARPromptRequest(BaseModel):
    prompt: str


# ---------- Agents ----------
@app.post("/planner")
async def planner_agent(payload: PlannerRequest):
    if not groq_client:
        return {
            "plan": "The learning planner feature requires a GROQ_API_KEY to be set in the .env file.\n\n" +
                   "For now, here's a sample learning plan for your topic:\n" +
                   "1. Introduction to the topic\n" +
                   "2. Core concepts and fundamentals\n" +
                   "3. Practical applications\n" +
                   "4. Advanced topics and next steps"
        }
    
    try:
        # --- 1. VALIDATION STEP ---
        # We ask a fast model to classify the input query first.
        validation_prompt = f"""
        Analyze the user's query: "{payload.query}"
        
        Is this query a valid educational subject, academic topic, or a skill that someone can create a learning plan for?
        
        Respond in JSON format with two keys:
        1. "is_topic": boolean (true if it is a valid topic, false otherwise)
        2. "reason": string (a brief explanation for your decision)
        
        Examples:
        - Query: "Quantum Physics" -> {{"is_topic": true, "reason": "This is a valid field of study."}}
        - Query: "How to bake bread" -> {{"is_topic": true, "reason": "This is a valid skill to learn."}}
        - Query: "asdfghjkl" -> {{"is_topic": false, "reason": "This appears to be random nonsense."}}
        - Query: "what is the time" -> {{"is_topic": false, "reason": "This is a question, not a learning topic."}}
        """
        
        validation_response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Use the fast model for validation
            messages=[{"role": "user", "content": validation_prompt}],
            max_tokens=150,
            response_format={"type": "json_object"}  # Force the model to output JSON
        )
        
        # Parse the JSON response from the validation model
        validation_result = json.loads(validation_response.choices[0].message.content)

        # --- 2. CHECK THE RESULT ---
        if not validation_result.get("is_topic", True):  # Default to True if key doesn't exist
            # If it's NOT a topic, return a 400 Bad Request error
            raise HTTPException(
                status_code=400, 
                detail=f"Input is not a valid learning topic. Reason: {validation_result.get('reason', 'Invalid input')}"
            )

        # --- 3. PLANNER STEP (if validation passed) ---
        # If is_topic was true, we proceed with the big model
        
        planner_prompt = f"""
        Act as an expert learning advisor. A user wants to learn the following subject: '{payload.query}'.

        Create a comprehensive, step-by-step learning roadmap for them to master this topic.
        
        Your plan must:
        1.  Break down the subject into logical modules or sections (e.g., "Module 1: The Basics", "Module 2: Core Concepts", etc.).
        2.  For each module, list the key concepts or skills they need to learn.
        3.  Suggest a realistic study schedule, such as how many hours to dedicate per week and how long each module might take.
        4.  Provide a clear path that guides them from the fundamentals to more advanced topics.
        
        Make the roadmap encouraging and easy for a beginner to follow.
        """
        
        planner_response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Use the powerful model for the plan
            messages=[{"role": "user", "content": planner_prompt}],
            max_tokens=1024,
        )
        
        return {"plan": planner_response.choices[0].message.content}

    except HTTPException as he:
        # This makes sure our 400 error is sent correctly
        raise he
    except Exception as e:
        print("Error in planner_agent:", e)
        # This catches any other errors (e.g., Groq API is down)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/subject")
# CHANGE THIS: Use the Pydantic model 'SubjectRequest'
async def subject_agent(payload: SubjectRequest):
    try:
        prompt = f"Explain the subject {payload.subject} in a concise, beginner-friendly way with examples."
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
        )
        return {"subject_explanation": response.choices[0].message.content}
    except Exception as e:
        print("Error in subject_agent:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/feedback")
# CHANGE THIS: Use the Pydantic model 'FeedbackRequest'
async def feedback_agent(payload: FeedbackRequest):
    try:
        prompt = f"Provide constructive feedback for this student response: {payload.input}"
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
        )
        return {"feedback": response.choices[0].message.content}
    except Exception as e:
        print("Error in feedback_agent:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/motivation")
# CHANGE THIS: Use the Pydantic model 'MotivationRequest'
async def motivation_agent(payload: MotivationRequest):
    try:
        prompt = f"Motivate a learner who is feeling {payload.mood}. Give a short, encouraging message."
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
        )
        return {"motivation": response.choices[0].message.content}
    except Exception as e:
        print("Error in motivation_agent:", e)
        raise HTTPException(status_code=500, detail=str(e))


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