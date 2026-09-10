import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger("uvicorn")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    logger.info(f"🍃 Connecting to MongoDB at {settings.MONGO_URI}...")
    db.client = AsyncIOMotorClient(settings.MONGO_URI)
    # Ensure database name is WEBCRAFT
    db_name = settings.DB_NAME
    if "/" in settings.MONGO_URI and settings.MONGO_URI.split("/")[-1]:
        db_name = settings.MONGO_URI.split("/")[-1].split("?")[0]
    db.db = db.client[db_name]
    logger.info(f"✅ Connected to MongoDB Database: [{db.db.name}]")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        logger.info("🔌 MongoDB connection closed.")

def get_database():
    return db.db
