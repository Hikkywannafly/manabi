"""
API Dependencies - Authentication, Supabase client, etc.
"""

from fastapi import Header, HTTPException
from app.config import settings


async def verify_api_key(x_api_key: str = Header(..., alias="X-API-Key")) -> str:
    """Verify API key for authentication"""
    if x_api_key != settings.api_secret_key:
        raise HTTPException(
            status_code=401,
            detail="Invalid API key"
        )
    return x_api_key
