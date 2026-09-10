from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.db.mongodb import get_database
from app.services.synergy_service import SynergyService
from app.utils.bson_util import fix_id
from app.core.security import get_current_user

router = APIRouter()

class CalculateSynergySchema(BaseModel):
    studentAId: str
    studentBId: str

@router.post("/calculate")
async def calculate_synergy(payload: CalculateSynergySchema):
    db = get_database()
    student_a = await db.users.find_one({"$or": [{"userId": payload.studentAId}, {"id": payload.studentAId}]})
    student_b = await db.users.find_one({"$or": [{"userId": payload.studentBId}, {"id": payload.studentBId}]})
    
    if not student_a or not student_b:
        raise HTTPException(status_code=404, detail="One or both students not found for synergy calculation.")
        
    synergy_data = SynergyService.calculate_match_synergy(student_a, student_b)
    return {
        "success": True,
        "data": {
            "studentA": fix_id(student_a),
            "studentB": fix_id(student_b),
            "synergy": synergy_data
        }
    }

@router.get("/matches/{student_id}")
async def get_matches(student_id: str):
    db = get_database()
    target_student = await db.users.find_one({"$or": [{"userId": student_id}, {"id": student_id}]})
    if not target_student:
        raise HTTPException(status_code=404, detail="Student not found.")
        
    all_students = await db.users.find({"$and": [{"userId": {"$ne": student_id}}, {"id": {"$ne": student_id}}]}, {"password": 0}).to_list(length=100)
    
    matches = []
    for peer in all_students:
        syn = SynergyService.calculate_match_synergy(target_student, peer)
        matches.append({
            "peer": fix_id(peer),
            "synergy": syn
        })
        
    matches.sort(key=lambda x: x["synergy"]["score"], reverse=True)
    return {
        "success": True,
        "results": len(matches),
        "data": matches
    }
