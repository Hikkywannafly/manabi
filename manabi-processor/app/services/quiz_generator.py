"""
Quiz Generator Service
Main orchestration for quiz generation pipeline
"""

import json
import re
from typing import Any

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

from app.config import settings
from app.models.requests import QuizGenerationRequest
from app.services.document_loader import DocumentLoaderService
from app.services.preprocessor import PreprocessorService
from app.services.supabase_client import get_supabase
from app.prompts.quiz_prompts import (
    QUIZ_PROMPT_TEMPLATE,
    EXTRACT_QUIZ_PROMPT,
    DIFFICULTY_GUIDELINES,
    BLOOM_DISTRIBUTION,
)


class QuizGeneratorService:
    """Service for generating quizzes from documents"""

    @staticmethod
    async def process(request: QuizGenerationRequest):
        """
        Main processing pipeline for quiz generation.
        This runs as a background task.
        """
        supabase = get_supabase()
        quiz_id = request.quiz_id

        try:
            # Step 1: Load document
            await supabase.update_progress(
                "quiz", quiz_id, 10, "Loading document..."
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
                "quiz", quiz_id, 30, "Processing content..."
            )

            processed_content = PreprocessorService.process(
                documents,
                request.params.parsing_mode
            )

            print(f"✅ Processed content: {len(processed_content)} characters")

            # Step 3: Generate quiz with LLM
            await supabase.update_progress(
                "quiz", quiz_id, 50, "Generating quiz with AI..."
            )

            quiz_data = await QuizGeneratorService._generate_with_llm(
                processed_content,
                request.params
            )

            print(f"✅ Generated {len(quiz_data.get('questions', []))} questions")

            # Step 4: Validate
            await supabase.update_progress(
                "quiz", quiz_id, 80, "Validating questions..."
            )

            validated = QuizGeneratorService._validate_quiz(quiz_data)

            print(f"✅ Validated: {len(validated['questions'])} questions")

            # Step 5: Save to database
            await supabase.update_progress(
                "quiz", quiz_id, 90, "Saving to database..."
            )

            await supabase.save_quiz_questions(quiz_id, validated["questions"])

            # Generate slug from title
            slug = QuizGeneratorService._generate_slug(validated["title"])

            await supabase.update_quiz_metadata(
                quiz_id,
                validated["title"],
                slug,
                "ready"
            )

            # Step 6: Complete
            await supabase.update_progress(
                "quiz", quiz_id, 100, "Done!",
                {"title": validated["title"], "slug": slug}
            )

            print(f"🎉 Quiz generation complete: {validated['title']}")

        except Exception as e:
            print(f"❌ Quiz generation failed: {str(e)}")
            await supabase.update_quiz_status(quiz_id, "failed")
            raise

    @staticmethod
    async def _generate_with_llm(content: str, params) -> dict[str, Any]:
        """Generate quiz using LLM via OpenRouter"""

        # Initialize LLM with quiz-specific settings
        llm = ChatOpenAI(
            model=settings.get_quiz_model(),
            openai_api_key=settings.get_quiz_api_key(),
            openai_api_base=settings.openrouter_base_url,
            temperature=settings.temperature,
            max_tokens=settings.max_tokens,
            default_headers={
                "HTTP-Referer": "https://manabi.app",
                "X-Title": "Manabi Quiz Generator",
            }
        )

        # Select prompt based on task
        if params.task == "extract":
            template = EXTRACT_QUIZ_PROMPT
            prompt = ChatPromptTemplate.from_template(template)

            response = await llm.ainvoke(
                prompt.format_messages(
                    content=content,
                    language=params.language,
                )
            )
        else:
            template = QUIZ_PROMPT_TEMPLATE
            prompt = ChatPromptTemplate.from_template(template)

            # Format custom instructions
            custom_inst = ""
            if params.custom_instructions:
                custom_inst = f"- Custom Instructions: {params.custom_instructions}"

            response = await llm.ainvoke(
                prompt.format_messages(
                    content=content,
                    difficulty=params.difficulty,
                    num_questions=params.number_of_questions,
                    question_type=", ".join(params.question_types),
                    language=params.language,
                    custom_instructions=custom_inst,
                    difficulty_guidelines=DIFFICULTY_GUIDELINES[params.difficulty],
                    bloom_distribution=BLOOM_DISTRIBUTION[params.difficulty],
                )
            )

        # Parse response
        return QuizGeneratorService._parse_response(response.content)

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
    def _validate_quiz(quiz_data: dict) -> dict:
        """Validate and clean quiz output"""

        validated_questions = []
        seen_questions = set()

        for q in quiz_data.get("questions", []):
            question_text = q.get("question_text", "").strip()

            # Skip empty questions
            if not question_text:
                continue

            # Skip duplicates
            question_key = question_text.lower()[:100]
            if question_key in seen_questions:
                continue
            seen_questions.add(question_key)

            # Validate MCQ
            if q.get("question_type") == "multiple_choice":
                options = q.get("options", [])
                answer = q.get("correct_answer", "0")

                # Ensure we have options
                if not options or len(options) < 2:
                    continue

                # Validate answer index
                try:
                    answer_idx = int(answer)
                    if answer_idx < 0 or answer_idx >= len(options):
                        answer_idx = 0
                        q["correct_answer"] = "0"
                except ValueError:
                    # Answer might be text, try to find it in options
                    try:
                        answer_idx = options.index(answer)
                        q["correct_answer"] = str(answer_idx)
                    except ValueError:
                        q["correct_answer"] = "0"

                # Remove duplicate options
                unique_options = list(dict.fromkeys(options))
                if len(unique_options) != len(options):
                    q["options"] = unique_options

            # Ensure explanation exists
            if not q.get("explanation"):
                q["explanation"] = "Review the source material for more details."

            validated_questions.append(q)

        return {
            "title": quiz_data.get("title", "Generated Quiz"),
            "questions": validated_questions,
        }

    @staticmethod
    def _generate_slug(title: str) -> str:
        """Generate URL-safe slug from title"""
        slug = title.lower().strip()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_]+', '-', slug)
        slug = re.sub(r'-+', '-', slug)
        slug = slug.strip('-')
        return slug[:50]  # Limit length
