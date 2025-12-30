"""
API Route Handlers
"""

from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends

from app.models.requests import QuizGenerationRequest, FlashcardGenerationRequest, ExplainRequest
from app.models.responses import GenerationResponse
from app.services.quiz_generator import QuizGeneratorService
from app.services.flashcard_generator import FlashcardGeneratorService
from app.api.dependencies import verify_api_key

router = APIRouter()


@router.post("/generate-quiz", response_model=GenerationResponse)
async def generate_quiz(
    request: QuizGenerationRequest,
    background_tasks: BackgroundTasks,
    _: str = Depends(verify_api_key),
):
    """
    Generate quiz from document content.

    Accepts:
    - file_url: Signed URL to file in Supabase Storage
    - text_content: Direct text content
    - youtube_url: YouTube video URL
    - webpage_url: Web page URL
    """
    # Start background processing
    background_tasks.add_task(
        QuizGeneratorService.process,
        request
    )

    return GenerationResponse(
        status="processing",
        item_id=request.quiz_id,
        message="Quiz generation started"
    )


@router.post("/generate-flashcards", response_model=GenerationResponse)
async def generate_flashcards(
    request: FlashcardGenerationRequest,
    background_tasks: BackgroundTasks,
    _: str = Depends(verify_api_key),
):
    """
    Generate flashcards from document content.

    Accepts:
    - file_url: Signed URL to file in Supabase Storage
    - text_content: Direct text content
    - youtube_url: YouTube video URL
    - webpage_url: Web page URL
    """
    # Start background processing
    background_tasks.add_task(
        FlashcardGeneratorService.process,
        request
    )

    return GenerationResponse(
        status="processing",
        item_id=request.deck_id,
        message="Flashcard generation started"
    )


@router.get("/status/{item_id}")
async def get_status(item_id: str):
    """Get generation status (for debugging)"""
    # In production, this would query Supabase
    return {"item_id": item_id, "message": "Check Supabase Realtime for updates"}


@router.post("/explain")
async def explain_content(
    request: ExplainRequest,
    _: str = Depends(verify_api_key),
):
    """
    Generate AI explanation for quiz question or flashcard.

    This is a synchronous endpoint (not background task)
    since explanations are typically fast and need immediate response.
    """
    from app.services.explanation_service import ExplanationService
    from app.models.responses import ExplainResponse

    try:
        result = await ExplanationService.generate(request)
        return ExplainResponse(
            explanation=result["explanation"],
            suggested_questions=result.get("suggested_questions", [])
        )
    except Exception as e:
        print(f"Error in explain_content: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
