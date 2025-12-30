import { AI_CONFIG, ERROR_MESSAGES, PROMPT_TEMPLATES } from "../config.ts";
import type {
  AIExplanationResult,
  ChatMessage,
  ExplainContext,
} from "../types.ts";
import { Logger } from "../utils/logger.ts";

export class AIService {
  constructor(private apiKey: string) {}

  /**
   * Generate initial explanation for quiz or flashcard
   */
  generateExplanation(context: ExplainContext): Promise<AIExplanationResult> {
    Logger.info("Generating explanation", {
      contentType: context.contentType,
    });

    const prompt = this.buildPrompt(context);
    const messages = [{ role: "user" as const, content: prompt }];

    return this.callAI(messages);
  }

  /**
   * Generate response to follow-up question
   */
  generateFollowUp(
    context: ExplainContext,
    history: ChatMessage[],
    question: string,
  ): Promise<AIExplanationResult> {
    Logger.info("Generating follow-up response", { question });

    const initialPrompt = this.buildPrompt(context);
    const messages: ChatMessage[] = [
      { role: "user", content: initialPrompt },
      ...history,
      { role: "user", content: PROMPT_TEMPLATES.followUp(question) },
    ];

    return this.callAI(messages);
  }

  /**
   * Build prompt based on context type
   */
  private buildPrompt(context: ExplainContext): string {
    if (context.contentType === "quiz") {
      return PROMPT_TEMPLATES.quiz({
        questionText: context.questionText,
        options: context.options,
        correctAnswer: context.correctAnswer,
        userAnswer: context.userAnswer,
        isCorrect: context.isCorrect,
      });
    } else {
      return PROMPT_TEMPLATES.flashcard({
        front: context.front,
        back: context.back,
        questionText: context.questionText,
        correctAnswer: context.correctAnswer,
      });
    }
  }

  /**
   * Call OpenRouter API
   */
  private async callAI(messages: ChatMessage[]): Promise<AIExplanationResult> {
    try {
      const response = await fetch(AI_CONFIG.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://manabi.app",
          "X-Title": "Manabi AI Explanation",
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: messages,
          temperature: AI_CONFIG.generation.temperature,
          max_tokens: AI_CONFIG.generation.max_tokens,
          top_p: AI_CONFIG.generation.top_p,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenRouter API error: ${response.status} - ${JSON.stringify(
            errorData,
          )}`,
        );
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error(ERROR_MESSAGES.emptyResponse);
      }

      Logger.success(`AI response received: ${text.length} characters`);

      return this.parseResponse(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(ERROR_MESSAGES.aiGenerationFailed(message));
    }
  }

  /**
   * Parse AI response JSON
   */
  private parseResponse(text: string): AIExplanationResult {
    Logger.info("Parsing AI response...");

    // Clean markdown code blocks
    const cleanedText = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanedText);

      // Validate structure
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Response is not an object");
      }

      Logger.success("Successfully parsed AI response");

      return {
        explanation: parsed.explanation || text,
        suggested_questions: parsed.suggested_questions || [],
      };
    } catch (error) {
      Logger.error("JSON parsing failed", { text: cleanedText, error });

      // Fallback: return raw text as explanation
      Logger.warning("Using fallback: raw text as explanation");
      return {
        explanation: text,
        suggested_questions: [],
      };
    }
  }
}
