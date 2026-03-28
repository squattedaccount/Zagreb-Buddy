import logging
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Zagreb Buddy Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://zagrebbuddy.vercel.app",
        "http://localhost:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    user_context: dict | None = None


class PlaceResponse(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    one_liner: str
    why_recommended: str
    practical_tip: str
    visit_duration_min: int
    category: str


class ItineraryResponse(BaseModel):
    places: list[PlaceResponse]
    total_duration_min: int
    total_walking_min: int
    weather_note: str | None = None


class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    itinerary: ItineraryResponse | None = None
    follow_ups: list[str] = []
    active_skills: list[str] = []
    needs_more_info: bool = False


from zagreb_agent import ZagrebAgent  # noqa: E402

agent = ZagrebAgent()


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    conversation_id = req.conversation_id or str(uuid.uuid4())

    try:
        result = await agent.chat(
            message=req.message,
            session_id=conversation_id,
            user_context=req.user_context,
        )
    except Exception as e:
        logger.error(f"Agent error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Agent failed to process message")

    return ChatResponse(conversation_id=conversation_id, **result)


@app.get("/health")
async def health():
    skills = agent.skills.list_skills()
    return {
        "status": "running",
        "skills_loaded": len(skills),
        "skill_names": skills,
    }
