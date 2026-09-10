from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.db.mongodb import get_database
from app.utils.bson_util import fix_id
from app.core.security import get_current_user

router = APIRouter()

class ProposeExchangeSchema(BaseModel):
    requesterId: str
    providerId: str
    skillOffered: str
    skillRequested: str
    message: Optional[str] = "Hello! I would love to start a 1-on-1 skill exchange with you."

class UpdateExchangeStatusSchema(BaseModel):
    status: str

@router.get("")
async def get_exchanges(userId: Optional[str] = None):
    db = get_database()
    query = {}
    if userId:
        query = {"$or": [{"requesterId": userId}, {"providerId": userId}]}
        
    exchanges = await db.exchanges.find(query).to_list(length=100)
    return {"success": True, "results": len(exchanges), "data": fix_id(exchanges)}

@router.post("")
async def create_exchange(payload: ProposeExchangeSchema):
    db = get_database()
    if payload.requesterId == payload.providerId:
        raise HTTPException(status_code=400, detail="Cannot request a skill exchange with yourself.")
        
    existing = await db.exchanges.find_one({
        "requesterId": payload.requesterId,
        "providerId": payload.providerId,
        "status": {"$in": ["pending", "active"]}
    })
    if existing:
        raise HTTPException(status_code=400, detail="An active or pending exchange request already exists between you two.")
        
    exchange_doc = {
        "exchangeId": f"exc_{int(datetime.now(timezone.utc).timestamp())}",
        "requesterId": payload.requesterId,
        "providerId": payload.providerId,
        "skillOffered": payload.skillOffered,
        "skillRequested": payload.skillRequested,
        "message": payload.message,
        "status": "pending",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "goals": [
            {"id": "g1", "title": f"Master basics of {payload.skillRequested}", "completed": False},
            {"id": "g2", "title": f"Teach core concepts of {payload.skillOffered}", "completed": False}
        ],
        "progress": 0
    }
    
    res = await db.exchanges.insert_one(exchange_doc)
    exchange_doc["_id"] = str(res.inserted_id)
    exchange_doc["id"] = str(res.inserted_id)
    
    return {"success": True, "data": fix_id(exchange_doc)}

@router.get("/{exchange_id}")
async def get_exchange_by_id(exchange_id: str):
    db = get_database()
    exchange = await db.exchanges.find_one({"$or": [{"exchangeId": exchange_id}, {"id": exchange_id}]})
    if not exchange:
        raise HTTPException(status_code=404, detail="Exchange workspace not found.")
    return {"success": True, "data": fix_id(exchange)}

@router.put("/{exchange_id}/status")
async def update_exchange_status(exchange_id: str, payload: UpdateExchangeStatusSchema):
    db = get_database()
    valid_statuses = ["pending", "active", "completed", "declined", "cancelled"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Allowed values: {valid_statuses}")
        
    res = await db.exchanges.update_one(
        {"$or": [{"exchangeId": exchange_id}, {"id": exchange_id}]},
        {"$set": {"status": payload.status, "updatedAt": datetime.now(timezone.utc).isoformat()}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Exchange not found.")
        
    updated = await db.exchanges.find_one({"$or": [{"exchangeId": exchange_id}, {"id": exchange_id}]})
    return {"success": True, "data": fix_id(updated)}
