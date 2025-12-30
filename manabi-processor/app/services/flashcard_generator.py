"""
Flashcard Generator Service
Main orchestration for flashcard generation pipeline
"""

import json
import re
from typing import Any

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

from app.config import settings
from app.models.requests import FlashcardGenerationRequest
from app.services.document_loader import DocumentLoaderService
from app.services.preprocessor import PreprocessorService
from app.services.supabase_client import get_supabase
from app.prompts.flashcard_prompts import (
    FLASHCARD_PROMPT_TEMPLATE,
    FLASHCARD_DIFFICULTY_GUIDELINES,
)


class FlashcardGeneratorService:
    """Service for generating flashcards from documents"""

    @staticmethod
    async def process(request: FlashcardGenerationRequest):
        """
        Main processing pipeline for flashcard generation.
        This runs as a background task.
        """
        supabase = get_supabase()
        deck_id = request.deck_id

        try:
            # Step 1: Load document
            await supabase.update_progress(
                "deck", deck_id, 10, "Loading document..."
            )

            documents = await DocumentLoaderService.load(
                file_url=request.file_url,
                file_type=request.file_type,
                text_content=request.text_content,
                youtube_url=request.youtube_url,
                webpage_url=request.webpage_url,
            )

            print(f"✅ Loaded {len(documents)} document(s)")

            # Step 2: Preprocess
            await supabase.update_progress(
                "deck", deck_id, 30, "Processing content..."
            )

            processed_content = PreprocessorService.process(
                documents,
                request.params.parsing_mode
            )

            print(f"✅ Processed content: {len(processed_content)} characters")

            # Step 3: Generate flashcards with LLM
            await supabase.update_progress(
                "deck", deck_id, 50, "Generating flashcards with AI..."
            )

            flashcard_data = await FlashcardGeneratorService._generate_with_llm(
                processed_content,
                request.params
            )

            print(f"✅ Generated {len(flashcard_data.get('flashcards', []))} flashcards")

            # Step 4: Validate
            await supabase.update_progress(
                "deck", deck_id, 80, "Validating flashcards..."
            )

            validated = FlashcardGeneratorService._validate_flashcards(flashcard_data)

            print(f"✅ Validated: {len(validated['flashcards'])} flashcards")

            # Step 5: Save to database
            await supabase.update_progress(
                "deck", deck_id, 90, "Saving to database..."
            )

            await supabase.save_flashcards(deck_id, validated["flashcards"])
            await supabase.update_deck_metadata(
                deck_id,
                validated["title"],
                "ready"
            )

            # Step 6: Complete
            await supabase.update_progress(
                "deck", deck_id, 100, "Done!",
                {"title": validated["title"]}
            )

            print(f"🎉 Flashcard generation complete: {validated['title']}")

        except Exception as e:
            print(f"❌ Flashcard generation failed: {str(e)}")
            await supabase.update_deck_status(deck_id, "failed")
            raise

    @staticmethod
    async def _generate_with_llm(content: str, params) -> dict[str, Any]:
        """Generate flashcards using LLM via OpenRouter"""

        # Initialize LLM with flashcard-specific settings
        llm = ChatOpenAI(
            model=settings.get_flashcard_model(),
            openai_api_key=settings.get_flashcard_api_key(),
            openai_api_base=settings.openrouter_base_url,
            temperature=settings.temperature,
            max_tokens=settings.max_tokens,
            default_headers={
                "HTTP-Referer": "https://manabi.app",
                "X-Title": "Manabi Flashcard Generator",
            }
        )

        prompt = ChatPromptTemplate.from_template(FLASHCARD_PROMPT_TEMPLATE)

        # Format custom instructions
        custom_inst = ""
        if params.custom_instructions:
            custom_inst = f"- Custom Instructions: {params.custom_instructions}"

        response = await llm.ainvoke(
            prompt.format_messages(
                content=content,
                difficulty=params.difficulty,
                num_cards=params.number_of_cards,
                language=params.language,
                custom_instructions=custom_inst,
                difficulty_guidelines=FLASHCARD_DIFFICULTY_GUIDELINES[params.difficulty],
            )
        )

        # Parse response
        return FlashcardGeneratorService._parse_response(response.content)

    @staticmethod
    def _parse_response(text: str) -> dict[str, Any]:
        """Parse LLM response to JSON"""

        # Clean markdown code blocks if present
        cleaned = text.strip()
        cleaned = re.sub(r'^```json\s*', '', cleaned)
        cleaned = re.sub(r'^```\s*', '', cleaned)
        cleaned = re.sub(r'\s*```$', '', cleaned)
        cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            print(f"Raw text: {cleaned[:500]}...")

            # Try to extract JSON from the text
            json_match = re.search(r'\{[\s\S]*\}', cleaned)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except:
                    pass

            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")

    @staticmethod
    def _validate_flashcards(flashcard_data: dict) -> dict:
        """Validate and clean flashcard output"""

        validated_cards = []
        seen_fronts = set()

        for card in flashcard_data.get("flashcards", []):
            front = card.get("front", "").strip()
            back = card.get("back", "").strip()

            # Skip empty cards
            if not front or not back:
                continue

            # Skip duplicates (based on front)
            front_key = front.lower()[:100]
            if front_key in seen_fronts:
                continue
            seen_fronts.add(front_key)

            # Clean up the card
            validated_cards.append({
                "front": front,
                "back": back,
            })

        return {
            "title": flashcard_data.get("title", "Generated Flashcards"),
            "flashcards": validated_cards,
        }
