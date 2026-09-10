from fastapi import APIRouter, HTTPException
from app.db.mongodb import get_database
from app.utils.bson_util import fix_id

router = APIRouter()

@router.get("")
async def get_skills():
    db = get_database()
    skills = await db.skills.find({}).to_list(length=100)
    return {"success": True, "results": len(skills), "data": fix_id(skills)}

@router.get("/{skill_id}")
async def get_skill(skill_id: str):
    db = get_database()
    skill = await db.skills.find_one({"$or": [{"skillId": skill_id}, {"id": skill_id}]})
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found.")
    return {"success": True, "data": fix_id(skill)}
