"""
API Route Handlers
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal

from app.services.document_loader import DocumentLoaderService
from app.services.preprocessor import PreprocessorService

class ExtractRequest(BaseModel):
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    text_content: Optional[str] = None
    youtube_url: Optional[str] = None
    webpage_url: Optional[str] = None
    parsing_mode: Literal["fast", "balanced", "premium"] = "balanced"

class ExtractResponse(BaseModel):
    content: str
    metadata: dict

router = APIRouter()

@router.post("/extract", response_model=ExtractResponse)
async def extract_content(request: ExtractRequest):
    """
    Extract and preprocess text from various sources.
    Returns cleaned text ready for AI processing.
    """
    try:
        # 1. Load Documents
        documents = await DocumentLoaderService.load(
            file_url=request.file_url,
            file_type=request.file_type,
            text_content=request.text_content,
            youtube_url=request.youtube_url,
            webpage_url=request.webpage_url,
        )

        if not documents:
            raise HTTPException(status_code=400, detail="No content could be loaded")

        # 2. Preprocess (Clean & Chunk)
        processed_text = PreprocessorService.process(
            documents,
            request.parsing_mode
        )

        # 3. Aggregate Metadata
        metadata = {
            "source_count": len(documents),
            "char_count": len(processed_text),
            "parsing_mode": request.parsing_mode
        }

        return ExtractResponse(
            content=processed_text,
            metadata=metadata
        )

    except Exception as e:
        print(f"Error in extract_content: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- New RAG Endpoint ---
from app.services.rag_service import RAGService
from app.models.requests import QuizGenerationRequest

@router.post("/generate-quiz")
async def generate_quiz(request: QuizGenerationRequest):
    """
    Generate a quiz using RAG pipeline (Load -> Split -> Embed -> Retrieve -> Generate).
    """
    try:
        service = RAGService()
        result = await service.generate_quiz(request)
        return result
    except Exception as e:
        print(f"Error in generate_quiz: {e}")
        # Return error but don't crash whole server if possible, or raise HTTP exc
        raise HTTPException(status_code=500, detail=str(e))

