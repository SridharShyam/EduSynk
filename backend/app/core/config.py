import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillNexus API Engine (Python)"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    PORT: int = int(os.getenv("PORT", 5000))
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/WEBCRAFT")
    DB_NAME: str = "WEBCRAFT"
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "skillnexus_super_secret_key_2026_webcraft")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    
    AI_LLM_API_KEY: str = os.getenv("AI_LLM_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "meta/llama-3.1-70b-instruct")
    AI_API_ENDPOINT: str = os.getenv("AI_API_ENDPOINT", "https://integrate.api.nvidia.com/v1/chat/completions")

settings = Settings()
