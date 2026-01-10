/**
 * Generator Service - Handles flashcard generation with AI
 * Uses GitHub Models API
 */

import { AI_CONFIG, ERROR_MESSAGES } from "../config.ts";
import { Logger } from "../utils/logger.ts";
import type { DeckResponse, FlashcardGenerationParams } from "../types.ts";

export class GeneratorService {
  constructor(private githubToken: string) {}

  async generateFlashcards(
    context: string,
    params: FlashcardGenerationParams,
  ): Promise<DeckResponse> {
    Logger.step(6, "Generating flashcards with AI");

    const task = params.task || "generate";
    const prompt = task === "extract"
      ? this.buildExtractPrompt(context, params)
      : this.buildGeneratePrompt(context, params);

    Logger.info(
      `Task: ${task}, Type: ${params.flashcardType}, Cards: ${params.numberOfCards}`,
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
    params: FlashcardGenerationParams,
  ): string {
    const difficulty = params.difficulty || AI_CONFIG.defaults.difficulty;
    const numberOfCards = params.numberOfCards ||
      AI_CONFIG.defaults.numberOfCards;
    const flashcardType = params.flashcardType || "QUESTIONS";
    const language = params.language || AI_CONFIG.defaults.language;
    const targetLanguage = params.targetLanguage || "Vietnamese";

    const typeGuide = flashcardType === "VOCABULARY"
      ? `Create VOCABULARY flashcards for language learning:

WORD EXTRACTION RULES:
1. adj+noun → extract the adjective: "coastal city" → "coastal (adj.)"
2. noun+noun / X of Y → extract the core noun: "holiday destination" → "destination (n.)"
3. phrasal verb → extract the verb headword: "stroll along" → "stroll (v.)" (note particle in explanation)

PRIORITY: adjectives > vivid verbs > key nouns
EXCLUDE: proper nouns, very basic words (the, a, is, have, etc.)

FRONT FORMAT: <word> (<pos>) where pos ∈ {adj., v., n., adv.}
- Front: Single word with part of speech tag

BACK FORMAT - Use markdown with ACTUAL LINE BREAKS (newline characters):
Structure each back with 3 lines separated by real newlines:
- Line 1: **<Vietnamese translation>** (bold markdown)
- Line 2: *<Vietnamese definition/explanation>* (italic markdown)
- Line 3: *Ví dụ:* **<English phrase from context>** : <Vietnamese translation of phrase>

CRITICAL: In your JSON output, use actual newline characters (not the escaped string "\\n") to separate the 3 lines.

EXAMPLE OUTPUTS:
{
  "front": "destination (n.)",
  "back": "**điểm đến**\n*Nơi mà người ta hướng tới hoặc muốn đến.*\n*Ví dụ:* **holiday destination** : điểm đến du lịch"
}

{
  "front": "sustainable (adj.)",
  "back": "**bền vững**\n*Có khả năng duy trì lâu dài, không gây hại cho môi trường.*\n*Ví dụ:* **sustainable development** : phát triển bền vững"
}

{
  "front": "stroll (v.)",
  "back": "**đi dạo, tản bộ**\n*Đi bộ chậm rãi, thư thái để thư giãn.*\n*Ví dụ:* **stroll along the beach** : đi dạo dọc bãi biển"
}`
      : `Create Q&A flashcards:
- Front: Question that tests understanding
- Back: Clear, concise answer
- Focus on key concepts and important details`;

    const difficultyGuide: Record<string, string> = {
      easy: "Use simple language, focus on basic recall and definitions.",
      medium: "Test understanding and application of concepts.",
      hard: "Require analysis, synthesis, and critical thinking.",
    };

    return `You are an expert educational flashcard creator.

Task: Create ${numberOfCards} flashcards based on the provided context.

CONTEXT:
${context}

Settings:
- Flashcard Type: ${flashcardType}
- ${typeGuide}
- Difficulty: ${difficulty}
- ${difficultyGuide[difficulty.toLowerCase()] || ""}
- Number of Cards: ${numberOfCards}
- Language: ${language}
${
      flashcardType === "VOCABULARY"
        ? `- Target Language for Translation: ${targetLanguage}`
        : ""
    }
${
      params.customInstructions
        ? `- Custom Instructions: ${params.customInstructions}`
        : ""
    }

Output Format: JSON Object ONLY.
Schema:
{
  "title": "A short, descriptive title for this deck (max 10 words)",
  "description": "Brief description of what this deck covers (optional)",
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition",
      "explanation": "Additional context or explanation (optional)"
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object
- No markdown code blocks
- All flashcards must be based on the context
- Create exactly ${numberOfCards} flashcards
${
      flashcardType === "VOCABULARY"
        ? `- For VOCABULARY: Front MUST be in source language, Back MUST be translation to ${targetLanguage}
- Include part of speech, pronunciation hints, and usage examples in the back`
        : `- If language is specified, translate everything to that language`
    }
- Keep front/back concise and clear`;
  }

  private buildExtractPrompt(
    context: string,
    params: FlashcardGenerationParams,
  ): string {
    const language = params.language || "Keep original";
    const flashcardType = params.flashcardType || "QUESTIONS";

    const typeInstruction = flashcardType === "VOCABULARY"
      ? "Extract VOCABULARY terms and their definitions. Ignore general Q&A unless they define a term."
      : "Extract Q&A pairs. Focus on questions and answers found in the content.";

    return `You are an expert educational content extractor.
Task: Extract ${flashcardType} flashcards from the provided content.
${typeInstruction}
The content contains existing Q&A pairs or vocabulary. Parse them into structured JSON format.

CONTENT:
${context}

Settings:
- Language: ${language}

Output Format: JSON Object ONLY.
Schema:
{
  "title": "A title extracted from the content or generated based on topic",
  "description": "Brief description (optional)",
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition",
      "explanation": "Additional context if found (optional)"
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object
- No markdown code blocks
- Extract flashcards exactly as they appear
- Preserve the original structure
- If language is specified, translate to that language`;
  }

  private parseResponse(text: string): DeckResponse {
    Logger.info("Parsing AI response...");

    // Clean markdown code blocks
    let cleanedText = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Fix: Replace actual newlines inside JSON string values with escaped \\n
    // This handles the case where AI outputs actual newlines instead of escaped ones
    cleanedText = cleanedText.replace(
      /"([^"]*?)"/g,
      (_match, content) => {
        // Replace actual newlines and carriage returns with escaped versions
        const fixed = content
          .replace(/\r\n/g, "\\n")
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\n")
          .replace(/\t/g, "\\t");
        return `"${fixed}"`;
      },
    );

    try {
      const parsed = JSON.parse(cleanedText);

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Response is not an object");
      }

      if (!Array.isArray(parsed.flashcards)) {
        if (Array.isArray(parsed)) {
          return {
            title: "Generated Flashcards",
            flashcards: parsed,
          };
        }
        throw new Error("Response missing 'flashcards' array");
      }

      Logger.success(
        `Parsed ${parsed.flashcards.length} flashcards, Title: "${parsed.title}"`,
      );
      return {
        title: parsed.title || "Generated Flashcards",
        description: parsed.description,
        flashcards: parsed.flashcards,
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
