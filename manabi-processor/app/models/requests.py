"""
Pydantic Request Models
"""

from typing import Literal, Optional
from pydantic import BaseModel, Field


class QuizGenerationParams(BaseModel):
    """Parameters for quiz generation"""
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"
    number_of_questions: int = Field(default=10, ge=1, le=50)
    question_types: list[Literal["mixed", "multiple_choice", "true_false", "fill_in_blank", "short_answer"]] = ["mixed"]
    language: str = "english"
    parsing_mode: Literal["fast", "balanced", "premium"] = "balanced"
    task: Literal["generate", "extract"] = "generate"
    custom_instructions: Optional[str] = None


class FlashcardGenerationParams(BaseModel):
    """Parameters for flashcard generation"""
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"
    number_of_cards: int = Field(default=20, ge=1, le=100)
    language: str = "english"
    parsing_mode: Literal["fast", "balanced", "premium"] = "balanced"
    custom_instructions: Optional[str] = None


class QuizGenerationRequest(BaseModel):
    """Request model for quiz generation"""
    quiz_id: str

    # Content sources (one required)
    file_url: Optional[str] = None
    file_type: Optional[str] = None  # pdf, docx, xlsx, etc.
    text_content: Optional[str] = None
    youtube_url: Optional[str] = None
    webpage_url: Optional[str] = None

    # Generation parameters
    params: QuizGenerationParams = Field(default_factory=QuizGenerationParams)

    def get_source_type(self) -> str:
        """Determine the content source type"""
        if self.file_url:
            return "file"
        elif self.youtube_url:
            return "youtube"
        elif self.webpage_url:
            return "webpage"
        elif self.text_content:
            return "text"
        return "unknown"


class FlashcardGenerationRequest(BaseModel):
    """Request model for flashcard generation"""
    deck_id: str

    # Content sources (one required)
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    text_content: Optional[str] = None
    youtube_url: Optional[str] = None
    webpage_url: Optional[str] = None

    # Generation parameters
    params: FlashcardGenerationParams = Field(default_factory=FlashcardGenerationParams)

    def get_source_type(self) -> str:
        """Determine the content source type"""
        if self.file_url:
            return "file"
        elif self.youtube_url:
            return "youtube"
        elif self.webpage_url:
            return "webpage"
        elif self.text_content:
            return "text"
        return "unknown"
