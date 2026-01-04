/**
 * Generator Service - Handles quiz generation with AI
 * Uses GitHub Models API
 */

import { AI_CONFIG, ERROR_MESSAGES } from "../config.ts";
import { Logger } from "../utils/logger.ts";
import type { GenerationParams, QuizResponse } from "../types.ts";

export class GeneratorService {
  constructor(private githubToken: string) {}

  async generateQuiz(
    context: string,
    params: GenerationParams,
  ): Promise<QuizResponse> {
    Logger.step(6, "Generating quiz with AI");

    const task = params.task || "generate";
    const prompt = task === "extract"
      ? this.buildExtractPrompt(context, params)
      : this.buildGeneratePrompt(context, params);

    Logger.info(
      `Task: ${task}, Difficulty: ${params.difficulty}, Questions: ${params.numberOfQuestions}`,
    );

    try {
      const response = await fetch(AI_CONFIG.chatUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_CONFIG.generationModel,
          messages: [{ role: "user", content: prompt }],
          temperature: AI_CONFIG.generation.temperature,
          max_tokens: AI_CONFIG.generation.max_tokens,
          top_p: AI_CONFIG.generation.top_p,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `GitHub Models API error: ${response.status} - ${
            JSON.stringify(errorData)
          }`,
        );
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("No content in API response");
      }

      Logger.success(`AI response received: ${text.length} characters`);
      return this.parseResponse(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      Logger.error("AI generation failed", error);
      throw new Error(ERROR_MESSAGES.aiGenerationFailed(message));
    }
  }

  private buildGeneratePrompt(
    context: string,
    params: GenerationParams,
  ): string {
    const difficulty = params.difficulty || AI_CONFIG.defaults.difficulty;
    const numberOfQuestions = params.numberOfQuestions ||
      AI_CONFIG.defaults.numberOfQuestions;
    const mode = params.mode || "quiz";
    const language = params.language || AI_CONFIG.defaults.language;

    // Handle question types
    let questionType: string;
    const questionTypes = params.questionTypes;

    if (!questionTypes || questionTypes.length === 0) {
      questionType = AI_CONFIG.defaults.questionType;
    } else if (questionTypes.includes("mixed") || questionTypes.length > 1) {
      const types = questionTypes
        .filter((t) => t !== "mixed")
        .map((t) => t.replace(/_/g, " "))
        .join(", ");
      questionType = types ? `Mixed (${types})` : "Mixed";
    } else {
      questionType = questionTypes[0].replace(/_/g, " ");
    }

    const modeGuide = mode === "exam"
      ? "This is a formal EXAM. Questions should be comprehensive and test deep understanding."
      : "This is a practice QUIZ. Questions should help reinforce learning.";

    const difficultyGuide: Record<string, string> = {
      easy: "Focus on recall, basic definitions, and straightforward facts.",
      medium:
        "Test understanding, application of concepts, and connections between ideas.",
      hard:
        "Require analysis, synthesis, critical thinking, and complex problem-solving.",
    };

    return `You are an expert educational content generator.
${modeGuide}

Task: Create a quiz based on the provided context.

CONTEXT:
${context}

Settings:
- Difficulty: ${difficulty}
- ${difficultyGuide[difficulty.toLowerCase()] || ""}
- Number of Questions: ${numberOfQuestions}
- Question Type: ${questionType}
- Language: ${language}
${
      params.customInstructions
        ? `- Custom Instructions: ${params.customInstructions}`
        : ""
    }

Output Format: JSON Object ONLY.
Schema:
{
  "title": "A short, descriptive title for this quiz (max 10 words)",
  "questions": [
    {
      "question_text": "string",
      "question_type": "multiple_choice" | "true_false" | "fill_in_blank" | "short_answer",
      "options": ["Option A", "Option B", "Option C", "Option D"] (or null if not MCQ),
      "correct_answer": "string" (or index for MCQ like "0"),
      "explanation": "string"
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object
- No markdown code blocks
- All questions must be based on the context
- If language is specified, translate everything to that language`;
  }

  private buildExtractPrompt(
    context: string,
    params: GenerationParams,
  ): string {
    const language = params.language || "Keep original";

    return `You are an expert educational content extractor.
Task: Extract quiz questions and answers from the provided content.
The content contains existing questions. Parse them into structured JSON format.

CONTENT:
${context}

Settings:
- Language: ${language}

Output Format: JSON Object ONLY.
Schema:
{
  "title": "A title extracted from the content or generated based on topic",
  "questions": [
    {
      "question_text": "string",
      "question_type": "multiple_choice" | "true_false" | "fill_in_blank" | "short_answer",
      "options": ["Option A", "Option B", "Option C", "Option D"] (or null if not MCQ),
      "correct_answer": "string" (or index for MCQ like "0"). If not found, leave empty string.
      "explanation": "string" (if found)
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object
- No markdown code blocks
- Extract questions exactly as they appear
- Map multiple choices to options array
- Identify correct answers if marked`;
  }

  private parseResponse(text: string): QuizResponse {
    Logger.info("Parsing AI response...");

    // Clean markdown code blocks
    const cleanedText = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanedText);

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Response is not an object");
      }

      if (!Array.isArray(parsed.questions)) {
        if (Array.isArray(parsed)) {
          return { title: "Generated Quiz", questions: parsed };
        }
        throw new Error("Response missing 'questions' array");
      }

      Logger.success(
        `Parsed ${parsed.questions.length} questions, Title: "${parsed.title}"`,
      );
      return {
        title: parsed.title || "Generated Quiz",
        questions: parsed.questions,
      };
    } catch (error) {
      Logger.error("JSON parsing failed", {
        text: cleanedText.substring(0, 200),
        error,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(ERROR_MESSAGES.parseResponseFailed(message));
    }
  }
}
