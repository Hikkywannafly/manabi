"""
Pydantic Response Models
"""

from typing import Any, Optional
from pydantic import BaseModel


class GenerationResponse(BaseModel):
    """Response for generation requests"""
    status: str  # processing, completed, failed
    item_id: str
    message: str
    data: Optional[Any] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str


class ExplainResponse(BaseModel):
    """Response for AI explanation"""
    explanation: str
    suggested_questions: list[str] = []
