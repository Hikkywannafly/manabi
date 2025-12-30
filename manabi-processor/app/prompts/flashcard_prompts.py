"""
Flashcard Generation Prompt Templates
"""

# Difficulty guidelines for flashcards
FLASHCARD_DIFFICULTY_GUIDELINES = {
    "Easy": """
**EASY FLASHCARDS**:
- Focus on basic definitions, terms, and simple facts
- Front: Single concept or term
- Back: Clear, concise definition or explanation
- One fact per card
- Use simple language""",

    "Medium": """
**MEDIUM FLASHCARDS**:
- Include concepts, processes, and relationships
- Front: Concept questions ("What is...", "Explain...")
- Back: Detailed explanations with examples
- May include comparisons
- Connect related ideas""",

    "Hard": """
**HARD FLASHCARDS**:
- Focus on complex relationships, analysis, and synthesis
- Front: Analytical questions ("Why...", "How does X relate to Y...")
- Back: In-depth explanations with multiple points
- Include edge cases and exceptions
- Require critical thinking to remember"""
}

# Main flashcard generation prompt
FLASHCARD_PROMPT_TEMPLATE = """You are an expert educational content creator specializing in effective flashcard design.

## YOUR TASK
Create flashcards based on the provided content. Flashcards should help with active recall and spaced repetition learning.

## SOURCE CONTENT
{content}

## GENERATION SETTINGS
- Difficulty: {difficulty}
- Number of Cards: {num_cards}
- Language: {language}
{custom_instructions}

## DIFFICULTY GUIDELINES
{difficulty_guidelines}

## FLASHCARD DESIGN PRINCIPLES
1. ✅ Each card tests ONE specific concept (atomic knowledge)
2. ✅ Front should be a clear question or prompt
3. ✅ Back should be a concise, memorable answer
4. ✅ Avoid overly long answers (max 2-3 sentences)
5. ✅ Use formatting for clarity (bullet points if needed)
6. ✅ Include context when necessary
7. ❌ Don't create cards for trivial information
8. ❌ Don't repeat concepts across multiple cards

## CARD TYPE VARIETY
Mix these types for better learning:
- Definition cards: "What is [term]?" → Definition
- Concept cards: "Explain [concept]" → Explanation
- Example cards: "Give an example of..." → Example
- Comparison cards: "What's the difference between X and Y?" → Comparison
- Application cards: "When would you use...?" → Use case

## OUTPUT FORMAT
Return ONLY valid JSON (no markdown, no code blocks):

{{
    "title": "Deck title based on content topic (max 10 words)",
    "flashcards": [
        {{
            "front": "Question or prompt (what you want to remember)",
            "back": "Answer or explanation (the knowledge to recall)"
        }}
    ]
}}

Generate exactly {num_cards} flashcards now:"""
