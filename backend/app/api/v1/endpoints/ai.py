from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.ai_service import AIService

router = APIRouter()

class AIChatSchema(BaseModel):
    message: str
    userContext: Optional[Dict[str, Any]] = None
    language: Optional[str] = 'en'

@router.post("/chat")
async def chat_with_ai(payload: AIChatSchema):
    result = await AIService.get_chat_response(
        user_message=payload.message,
        user_context=payload.userContext or {},
        language=payload.language or 'en'
    )
    return {
        "success": True,
        "reply": result["reply"],
        "source": result["source"]
    }
