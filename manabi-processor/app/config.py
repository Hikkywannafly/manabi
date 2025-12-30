"""
Application configuration using Pydantic Settings
"""

from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # API Keys - Shared (fallback)
    openrouter_api_key: str = ""

    # API Keys - Separate for Quiz, Flashcard and Explanation
    openrouter_api_key_quiz: str = ""
    openrouter_api_key_flashcard: str = ""
    openrouter_api_key_explanation: str = ""

    # Supabase
    supabase_url: str = ""
    supabase_service_key: str = ""
    api_secret_key: str = "default-secret-key-change-in-production"

    # Model Configuration
    default_model: str = "google/gemini-2.5-flash-lite"
    default_model_quiz: str = ""
    default_model_flashcard: str = ""
    default_model_explanation: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"

    def get_quiz_api_key(self) -> str:
        """Get API key for quiz generation"""
        return self.openrouter_api_key_quiz or self.openrouter_api_key

    def get_flashcard_api_key(self) -> str:
        """Get API key for flashcard generation"""
        return self.openrouter_api_key_flashcard or self.openrouter_api_key

    def get_explanation_api_key(self) -> str:
        """Get API key for explanation"""
        return self.openrouter_api_key_explanation or self.openrouter_api_key

    def get_quiz_model(self) -> str:
        """Get model for quiz generation"""
        return self.default_model_quiz or self.default_model

    def get_flashcard_model(self) -> str:
        """Get model for flashcard generation"""
        return self.default_model_flashcard or self.default_model

    def get_explanation_model(self) -> str:
        """Get model for explanation"""
        return self.default_model_explanation or self.default_model

    # Generation Settings
    max_tokens: int = 8192
    temperature: float = 0.7

    # Processing Limits
    max_file_size_mb: int = 50
    max_chunks: int = 10

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
