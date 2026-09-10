from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.db.mongodb import get_database
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.utils.bson_util import fix_id

router = APIRouter()

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    university: Optional[str] = "Global University"
    major: Optional[str] = "Computer Science"

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register(payload: RegisterSchema):
    db = get_database()
    existing_user = await db.users.find_one({"email": payload.email.lower()})
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists.")
        
    hashed_pwd = get_password_hash(payload.password)
    user_doc = {
        "userId": f"std_{payload.email.split('@')[0]}",
        "name": payload.name,
        "email": payload.email.lower(),
        "password": hashed_pwd,
        "role": "student",
        "university": payload.university,
        "major": payload.major,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={payload.name}",
        "reputationScore": 95,
        "skillsToTeach": ["Python", "JavaScript"],
        "skillsToLearn": ["UI/UX Design", "React"],
        "learningFormat": "Online",
        "availability": "Flexible"
    }
    
    res = await db.users.insert_one(user_doc)
    user_doc["_id"] = str(res.inserted_id)
    user_doc["id"] = str(res.inserted_id)
    user_doc.pop("password", None)
    
    token = create_access_token({"userId": user_doc["userId"], "email": user_doc["email"], "role": user_doc["role"]})
    return {
        "success": True,
        "data": {
            "user": fix_id(user_doc),
            "token": token
        }
    }

@router.post("/login")
async def login(payload: LoginSchema):
    db = get_database()
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    user_dict = fix_id(user)
    user_dict.pop("password", None)
    
    token = create_access_token({"userId": user_dict.get("userId", user_dict.get("id")), "email": user_dict.get("email"), "role": user_dict.get("role", "student")})
    return {
        "success": True,
        "data": {
            "user": user_dict,
            "token": token
        }
    }

@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user.get("userId")
    user = await db.users.find_one({"$or": [{"userId": user_id}, {"id": user_id}]})
    if not user:
        return {"success": True, "data": current_user}
    user_dict = fix_id(user)
    user_dict.pop("password", None)
    return {"success": True, "data": user_dict}
