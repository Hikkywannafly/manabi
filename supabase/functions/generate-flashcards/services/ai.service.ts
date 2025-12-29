import { OPENROUTER_CONFIG } from "../config.ts";
import type { AIResponse, FlashcardGenerationParams } from "../types.ts";
import { Logger } from "../utils/logger.ts";

export class AIService {
  constructor(private apiKey: string) {}

  async generateFlashcards(
    content: string,
    mimeType: string,
    params?: FlashcardGenerationParams,
  ): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(params);
    const userPrompt = this.buildUserPrompt(content, mimeType, params);

    Logger.info("Calling OpenRouter API for flashcard generation");

    const response = await fetch(OPENROUTER_CONFIG.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": "https://manabi.app",
        "X-Title": "Manabi Flashcard Generator",
      },
      body: JSON.stringify({
        model: OPENROUTER_CONFIG.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: OPENROUTER_CONFIG.maxTokens,
        temperature: OPENROUTER_CONFIG.temperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No content returned from AI");
    }

    Logger.info("AI response received, parsing flashcards");

    // Parse JSON response
    const parsed = this.parseAIResponse(aiContent);
    return parsed;
  }

  private buildSystemPrompt(params?: FlashcardGenerationParams): string {
    const difficulty = params?.difficulty || "Medium";
    const language = params?.language || "english";

    return `You are an expert educational content creator specializing in flashcard generation.

Your task is to create high-quality flashcards from the provided content.

FLASHCARD GUIDELINES:
- Front: Ask a clear, concise question or show a term/concept
- Back: Provide a complete, accurate answer or definition
- Difficulty: ${difficulty} level
- Language: ${language}
- Each flashcard should test ONE specific concept
- Use simple, clear language
- Avoid ambiguous questions

OUTPUT FORMAT (JSON only):
{
  "title": "Deck title based on content topic",
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

${
  params?.customInstructions
    ? `CUSTOM INSTRUCTIONS: ${params.customInstructions}`
    : ""
}

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no explanatory text.`;
  }

  private buildUserPrompt(
    content: string,
    mimeType: string,
    params?: FlashcardGenerationParams,
  ): string {
    const numberOfCards = params?.numberOfCards || 10;
    const parsingMode = params?.parsingMode || "fast";

    let prompt = `Generate exactly ${numberOfCards} flashcards from the following content.\n\n`;

    if (parsingMode === "fast") {
      prompt +=
        "PARSING MODE: Fast (focus on text only, skip complex formatting)\n\n";
    } else {
      prompt +=
        "PARSING MODE: Balanced (include information from tables and images if mentioned)\n\n";
    }

    if (mimeType === "text/plain" || !mimeType.includes("pdf")) {
      // Plain text content
      prompt += `CONTENT:\n${content}`;
    } else {
      // Binary content (PDF, DOCX) encoded as base64
      prompt += `CONTENT (base64 encoded ${mimeType}):\n${content}`;
    }

    return prompt;
  }

  private parseAIResponse(content: string): AIResponse {
    try {
      // Remove markdown code blocks if present
      let cleaned = content.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/```json\s*/g, "").replace(/```\s*$/g, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/```\s*/g, "");
      }

      const parsed = JSON.parse(cleaned);

      if (!(parsed.title && Array.isArray(parsed.flashcards))) {
        throw new Error("Invalid flashcard format");
      }

      // Validate flashcards
      for (const card of parsed.flashcards) {
        if (!(card.front && card.back)) {
          throw new Error("Flashcard missing front or back");
        }
      }

      return parsed as AIResponse;
    } catch (_error) {
      Logger.error("Failed to parse AI response", _error);
      const errorMessage =
        _error instanceof Error ? _error.message : String(_error);
      throw new Error(`Failed to parse flashcards: ${errorMessage}`);
    }
  }
}
