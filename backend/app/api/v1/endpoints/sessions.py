from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db.mongodb import get_database
from app.utils.bson_util import fix_id

router = APIRouter()

class CreateSessionSchema(BaseModel):
    exchangeId: str
    hostId: str
    attendeeId: str
    topic: str
    date: str
    durationMinutes: Optional[int] = 60
    notes: Optional[str] = "Live 1-on-1 peer session logged."

@router.get("")
async def get_sessions(exchangeId: Optional[str] = None):
    db = get_database()
    query = {}
    if exchangeId:
        query["exchangeId"] = exchangeId
        
    sessions = await db.sessions.find(query).to_list(length=100)
    return {"success": True, "results": len(sessions), "data": fix_id(sessions)}

@router.post("")
async def create_session(payload: CreateSessionSchema):
    db = get_database()
    session_doc = {
        "sessionId": f"ses_{int(datetime.now(timezone.utc).timestamp())}",
        "exchangeId": payload.exchangeId,
        "hostId": payload.hostId,
        "attendeeId": payload.attendeeId,
        "topic": payload.topic,
        "date": payload.date,
        "durationMinutes": payload.durationMinutes,
        "notes": payload.notes,
        "status": "completed",
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    
    res = await db.sessions.insert_one(session_doc)
    session_doc["_id"] = str(res.inserted_id)
    session_doc["id"] = str(res.inserted_id)
    
    # Increment exchange progress
    await db.exchanges.update_one(
        {"$or": [{"exchangeId": payload.exchangeId}, {"id": payload.exchangeId}]},
        {"$inc": {"progress": 25}}
    )
    
    return {"success": True, "data": fix_id(session_doc)}
