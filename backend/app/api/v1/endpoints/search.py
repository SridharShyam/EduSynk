import re
from fastapi import APIRouter, Query
from app.db.mongodb import get_database
from app.utils.bson_util import fix_id

router = APIRouter()

@router.get("")
async def search_students_and_skills(
    q: str = Query("", description="Search query in English"),
    category: str = Query("All", description="Filter by category"),
    level: str = Query("All", description="Filter by level"),
    format: str = Query("All", description="Filter by format")
):
    db = get_database()
    search_query = q.strip()
    regex_pattern = re.escape(search_query) if search_query else ""
    
    # 1. Search Skills
    skill_filter = {}
    if search_query:
        skill_filter["$or"] = [
            {"name": {"$regex": regex_pattern, "$options": "i"}},
            {"category": {"$regex": regex_pattern, "$options": "i"}},
            {"description": {"$regex": regex_pattern, "$options": "i"}}
        ]
    if category != "All":
        skill_filter["category"] = category
        
    skills = await db.skills.find(skill_filter).to_list(length=50)
    
    # 2. Search Students
    student_filter = {}
    if search_query:
        student_filter["$or"] = [
            {"name": {"$regex": regex_pattern, "$options": "i"}},
            {"major": {"$regex": regex_pattern, "$options": "i"}},
            {"university": {"$regex": regex_pattern, "$options": "i"}},
            {"skillsToTeach.name": {"$regex": regex_pattern, "$options": "i"}},
            {"skillsToTeach": {"$regex": regex_pattern, "$options": "i"}},
            {"skillsToLearn.name": {"$regex": regex_pattern, "$options": "i"}},
            {"skillsToLearn": {"$regex": regex_pattern, "$options": "i"}}
        ]
    if format != "All":
        student_filter["learningFormat"] = format
        
    students = await db.users.find(student_filter, {"password": 0}).to_list(length=50)
    
    return {
        "success": True,
        "query": q,
        "results": {
            "students": fix_id(students),
            "skills": fix_id(skills),
            "totalStudents": len(students),
            "totalSkills": len(skills)
        }
    }
