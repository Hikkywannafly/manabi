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




class QuizGenerationRequest(BaseModel):
    """Request model for quiz generation"""
    quiz_id: str
    user_id: str

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




class QuestionOption(BaseModel):
    """Option for quiz question"""
    id: str
    text: str


class ExplainContextRequest(BaseModel):
    """Context for explanation request"""
    content_type: Literal["quiz"] = Field(..., alias="contentType")
    question_text: str = Field(..., alias="questionText")
    options: Optional[list[QuestionOption]] = None
    correct_answer: str = Field(..., alias="correctAnswer")
    user_answer: Optional[str] = Field(None, alias="userAnswer")
    is_correct: Optional[bool] = Field(None, alias="isCorrect")

    class Config:
        populate_by_name = True


class ExplainMessageRequest(BaseModel):
    """Chat message in history"""
    role: Literal["user", "assistant"]
    content: str


class ExplainRequest(BaseModel):
    """Request model for AI explanation"""
    context: ExplainContextRequest
    history: list[ExplainMessageRequest] = []
    question: Optional[str] = None  # Follow-up question
