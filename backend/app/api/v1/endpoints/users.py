from fastapi import APIRouter, HTTPException, Depends
from app.db.mongodb import get_database
from app.utils.bson_util import fix_id
from app.core.security import get_current_user
from typing import Optional

router = APIRouter()

@router.get("")
async def get_users():
    db = get_database()
    users = await db.users.find({}, {"password": 0}).to_list(length=100)
    return {"success": True, "results": len(users), "data": fix_id(users)}

@router.get("/{user_id}")
async def get_user_by_id(user_id: str):
    db = get_database()
    user = await db.users.find_one({"$or": [{"userId": user_id}, {"id": user_id}]}, {"password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Student user not found.")
    return {"success": True, "data": fix_id(user)}

@router.put("/{user_id}")
async def update_user(user_id: str, payload: dict, current_user: dict = Depends(get_current_user)):
    db = get_database()
    payload.pop("_id", None)
    payload.pop("password", None)
    
    result = await db.users.update_one(
        {"$or": [{"userId": user_id}, {"id": user_id}]},
        {"$set": payload}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found.")
        
    updated_user = await db.users.find_one({"$or": [{"userId": user_id}, {"id": user_id}]}, {"password": 0})
    return {"success": True, "data": fix_id(updated_user)}
