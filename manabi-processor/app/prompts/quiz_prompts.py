"""
Quiz Generation Prompt Templates
Enhanced with Bloom's Taxonomy and difficulty guidelines
"""

# Difficulty-specific guidelines
DIFFICULTY_GUIDELINES = {
    "Easy": """
**EASY DIFFICULTY RULES**:
- Focus on RECALL and basic UNDERSTANDING (Bloom's Level 1-2)
- Question formats: "What is...", "Which of the following...", "True or False..."
- Use straightforward, simple language
- The correct answer should be clearly distinguishable
- Avoid edge cases, exceptions, or complex scenarios
- Test only ONE concept per question
- Options should have 1 obviously correct and 3 clearly wrong choices""",

    "Medium": """
**MEDIUM DIFFICULTY RULES**:
- Mix of UNDERSTANDING and APPLICATION (Bloom's Level 2-3)
- Question formats: "How does...", "What happens when...", "Compare...", "Why..."
- Require connecting 2 related concepts
- All options should be plausible (no obviously wrong answers)
- Include some analysis and comparison questions
- May include simple scenarios or examples
- Correct answer requires understanding, not just memorization""",

    "Hard": """
**HARD DIFFICULTY RULES**:
- Focus on ANALYSIS and EVALUATION (Bloom's Level 4-5)
- Question formats: "Analyze...", "Evaluate...", "What would happen if...", "Which is the BEST..."
- Require deep understanding and inference
- ALL options must seem reasonable at first glance
- Include edge cases, exceptions, and complex scenarios
- Combine multiple concepts in single questions
- Correct answer requires critical thinking and synthesis
- May include "trick" distinctions between similar concepts"""
}

# Bloom's Taxonomy distribution by difficulty
BLOOM_DISTRIBUTION = {
    "Easy": """
- 60% Remember (definitions, facts, terms)
- 30% Understand (explanations, summaries)
- 10% Apply (simple examples)""",

    "Medium": """
- 20% Remember
- 40% Understand
- 30% Apply
- 10% Analyze""",

    "Hard": """
- 10% Remember
- 20% Understand
- 20% Apply
- 30% Analyze
- 15% Evaluate
- 5% Create/Synthesize"""
}

# Main quiz generation prompt
QUIZ_PROMPT_TEMPLATE = """You are an expert educational content creator specializing in high-quality quiz design.

## YOUR TASK
Create a quiz based on the provided content. The quiz MUST be directly answerable from the content.

## SOURCE CONTENT
{content}

## GENERATION SETTINGS
- Difficulty: {difficulty}
- Number of Questions: {num_questions}
- Question Type: {question_type}
- Language: {language}
{custom_instructions}

## DIFFICULTY GUIDELINES
{difficulty_guidelines}

## BLOOM'S TAXONOMY DISTRIBUTION
{bloom_distribution}

## QUALITY REQUIREMENTS (MUST FOLLOW)
1. ✅ Questions MUST be answerable from the provided content only
2. ✅ Each question tests a UNIQUE concept - NO overlapping or similar questions
3. ✅ Include EXPLANATION for why the correct answer is correct
4. ✅ For MCQ: All 4 options must be plausible, no obviously wrong answers
5. ✅ Avoid trick questions or ambiguous wording
6. ✅ Questions should progress from easier to harder within the set
7. ✅ Use clear, concise language appropriate for the difficulty level
8. ❌ Do NOT include questions that require external knowledge
9. ❌ Do NOT repeat concepts across multiple questions

## OUTPUT FORMAT
Return ONLY valid JSON (no markdown, no code blocks, no explanations):

{{
    "title": "Quiz title based on content topic (max 10 words)",
    "questions": [
        {{
            "question_text": "Clear, specific question text",
            "question_type": "multiple_choice",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "0",
            "explanation": "Why this answer is correct, referencing the source content"
        }}
    ]
}}

IMPORTANT NOTES:
- For multiple_choice: correct_answer is the INDEX (0, 1, 2, or 3)
- For true_false: options should be ["True", "False"], correct_answer is "0" or "1"
- For fill_in_blank: options is null, correct_answer is the word/phrase
- For short_answer: options is null, correct_answer is the expected answer

Generate exactly {num_questions} questions now:"""


# Extract quiz prompt (for extracting existing quizzes from documents)
EXTRACT_QUIZ_PROMPT = """You are an expert at extracting quiz questions from documents.

## YOUR TASK
Extract all quiz questions and answers from the provided content. The document already contains questions - your job is to parse them into structured format.

## SOURCE CONTENT
{content}

## SETTINGS
- Language: {language}

## OUTPUT FORMAT
Return ONLY valid JSON (no markdown):

{{
    "title": "Extracted title or topic-based title",
    "questions": [
        {{
            "question_text": "The question as written",
            "question_type": "multiple_choice|true_false|fill_in_blank|short_answer",
            "options": ["A", "B", "C", "D"] or null,
            "correct_answer": "index or text",
            "explanation": "Explanation if found, otherwise empty string"
        }}
    ]
}}

Extract all questions from the content now:"""
