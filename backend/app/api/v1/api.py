from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, skills, search, synergy, exchanges, sessions, reviews, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(skills.router, prefix="/skills", tags=["skills"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(synergy.router, prefix="/synergy", tags=["synergy"])
api_router.include_router(exchanges.router, prefix="/exchanges", tags=["exchanges"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])

@api_router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "engine": "FastAPI (Python 3.13)",
        "database": "MongoDB (WEBCRAFT)",
        "version": "2.0.0"
    }
