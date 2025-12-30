"""
AI Explanation Service
Generates explanations for quiz questions and flashcards
"""

import json
import re
from typing import Any

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

from app.config import settings
from app.models.requests import ExplainRequest


# Prompt templates
QUIZ_EXPLANATION_PROMPT = """You are an expert educational tutor. A student has answered a quiz question and needs an explanation.

**Question:** {question_text}

**Options:**
{options_text}

**Correct Answer:** {correct_answer}
**Student's Answer:** {user_answer}
**Was Correct:** {is_correct}

Your task:
1. Explain WHY the correct answer is correct
2. If the student was wrong, explain what they might have misunderstood
3. Provide additional context that helps understanding
4. Be encouraging and educational

After your explanation, suggest 2-3 follow-up questions the student might want to ask to deepen their understanding.

Respond in JSON format:
{{
  "explanation": "Your detailed explanation here...",
  "suggested_questions": ["Question 1?", "Question 2?", "Question 3?"]
}}

IMPORTANT: Return ONLY the JSON object, no markdown code blocks."""

FLASHCARD_EXPLANATION_PROMPT = """You are an expert educational tutor. A student is studying a flashcard and needs help understanding it.

**Front (Question/Term):** {front}
**Back (Answer/Definition):** {back}

Your task:
1. Explain the concept in simple terms
2. Provide examples or mnemonics to help remember
3. Add context about why this is important

After your explanation, suggest 2-3 follow-up questions the student might want to ask.

Respond in JSON format:
{{
  "explanation": "Your detailed explanation here...",
  "suggested_questions": ["Question 1?", "Question 2?", "Question 3?"]
}}

IMPORTANT: Return ONLY the JSON object, no markdown code blocks."""

FOLLOW_UP_PROMPT = """The student has a follow-up question: "{question}"

Please answer this question in the context of the previous explanation. Be helpful and educational.

Respond in JSON format:
{{
  "explanation": "Your answer here...",
  "suggested_questions": ["Related question 1?", "Related question 2?"]
}}

IMPORTANT: Return ONLY the JSON object, no markdown code blocks."""


class ExplanationService:
    """Service for generating AI explanations"""

    @staticmethod
    async def generate(request: ExplainRequest) -> dict[str, Any]:
        """
        Generate explanation for quiz question or flashcard.
        """
        context = request.context

        # Initialize LLM
        llm = ChatOpenAI(
            model=settings.get_explanation_model(),
            openai_api_key=settings.get_explanation_api_key(),
            openai_api_base=settings.openrouter_base_url,
            temperature=0.7,
            max_tokens=2048,
            default_headers={
                "HTTP-Referer": "https://manabi.app",
                "X-Title": "Manabi AI Explanation",
            }
        )

        # Build messages
        messages = []

        if context.content_type == "quiz":
            # Build options text
            options_text = ""
            if context.options:
                options_text = "\n".join([f"- {opt.text}" for opt in context.options])

            system_prompt = QUIZ_EXPLANATION_PROMPT.format(
                question_text=context.question_text,
                options_text=options_text or "No options provided",
                correct_answer=context.correct_answer,
                user_answer=context.user_answer or "Not provided",
                is_correct="Yes" if context.is_correct else "No",
            )
        else:
            # Flashcard
            system_prompt = FLASHCARD_EXPLANATION_PROMPT.format(
                front=context.front or context.question_text,
                back=context.back or context.correct_answer,
            )

        messages.append(("system", system_prompt))

        # Add history
        for msg in request.history:
            messages.append((msg.role, msg.content))

        # Add follow-up question if present
        if request.question:
            follow_up = FOLLOW_UP_PROMPT.format(question=request.question)
            messages.append(("user", follow_up))

        # Call LLM
        prompt = ChatPromptTemplate.from_messages(messages)
        response = await llm.ainvoke(prompt.format_messages())

        # Parse response
        return ExplanationService._parse_response(response.content)

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
            result = json.loads(cleaned)
            return {
                "explanation": result.get("explanation", cleaned),
                "suggested_questions": result.get("suggested_questions", []),
            }
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e.msg}, in text: {text}")
            # If parsing fails, return raw content as explanation
            return {
                "explanation": cleaned,
                "suggested_questions": [],
            }
