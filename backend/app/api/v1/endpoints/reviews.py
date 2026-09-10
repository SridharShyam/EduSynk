from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.db.mongodb import get_database
from app.utils.bson_util import fix_id

router = APIRouter()

class CreateReviewSchema(BaseModel):
    exchangeId: str
    reviewerId: str
    revieweeId: str
    rating: int = Field(..., ge=1, le=5)
    comment: str

@router.get("")
async def get_reviews(revieweeId: Optional[str] = None):
    db = get_database()
    query = {}
    if revieweeId:
        query["revieweeId"] = revieweeId
        
    reviews = await db.reviews.find(query).to_list(length=100)
    return {"success": True, "results": len(reviews), "data": fix_id(reviews)}

@router.post("")
async def create_review(payload: CreateReviewSchema):
    db = get_database()
    if payload.reviewerId == payload.revieweeId:
        raise HTTPException(status_code=400, detail="Cannot review yourself.")
        
    existing = await db.reviews.find_one({
        "exchangeId": payload.exchangeId,
        "reviewerId": payload.reviewerId
    })
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted a review for this skill exchange.")
        
    review_doc = {
        "reviewId": f"rev_{int(datetime.now(timezone.utc).timestamp())}",
        "exchangeId": payload.exchangeId,
        "reviewerId": payload.reviewerId,
        "revieweeId": payload.revieweeId,
        "rating": payload.rating,
        "comment": payload.comment,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    
    res = await db.reviews.insert_one(review_doc)
    review_doc["_id"] = str(res.inserted_id)
    review_doc["id"] = str(res.inserted_id)
    
    # Increment reviewee reputation
    await db.users.update_one(
        {"$or": [{"userId": payload.revieweeId}, {"id": payload.revieweeId}]},
        {"$inc": {"reputationScore": payload.rating}}
    )
    
    return {"success": True, "data": fix_id(review_doc)}
