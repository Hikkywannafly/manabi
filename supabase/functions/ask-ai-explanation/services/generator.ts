/**
 * Generator Service - Handles AI explanation generation
 * Uses GitHub Models API (aligned with generate-quiz-v2 architecture)
 */

import { AI_CONFIG, ERROR_MESSAGES, PROMPT_TEMPLATES } from "../config.ts";
import type {
  AIExplanationResult,
  ChatMessage,
  ExplainContext,
} from "../types.ts";
import { Logger } from "../utils/logger.ts";
import type { RagService } from "./rag.ts";

export class GeneratorService {
  constructor(
    private githubToken: string,
    private ragService?: RagService,
  ) {}

  /**
   * Generate initial explanation for quiz or flashcard (non-streaming)
   */
  async generateExplanation(
    context: ExplainContext,
  ): Promise<AIExplanationResult> {
    Logger.info("Generating explanation", {
      contentType: context.contentType,
    });

    // Retrieve RAG context if available
    let ragContext = "";
    if (this.ragService && AI_CONFIG.rag.enabled) {
      ragContext = await this.ragService.retrieveContextByMetadata(
        context.quizId,
        context.deckId,
        context.questionText,
      );
    }

    // Detect language from context
    const detectedLanguage = this.detectLanguage(context);

    const prompt = this.buildPrompt(context, ragContext, detectedLanguage);
    const messages = [
      { role: "system" as const, content: PROMPT_TEMPLATES.system() },
      { role: "user" as const, content: prompt },
    ];

    return this.callAI(messages);
  }

  /**
   * Generate initial explanation with streaming (real-time)
   */
  async *generateExplanationStream(
    context: ExplainContext,
  ): AsyncGenerator<string, string[], void> {
    Logger.info("Generating explanation (streaming)", {
      contentType: context.contentType,
    });

    // Retrieve RAG context if available
    let ragContext = "";
    if (this.ragService && AI_CONFIG.rag.enabled) {
      ragContext = await this.ragService.retrieveContextByMetadata(
        context.quizId,
        context.deckId,
        context.questionText,
      );
    }

    // Detect language from context
    const detectedLanguage = this.detectLanguage(context);

    const prompt = this.buildPrompt(context, ragContext, detectedLanguage);
    const messages = [
      { role: "system" as const, content: PROMPT_TEMPLATES.system() },
      { role: "user" as const, content: prompt },
    ];

    return yield* this.callAIStream(messages);
  }

  /**
   * Generate response to follow-up question (non-streaming)
   */
  async generateFollowUp(
    context: ExplainContext,
    history: ChatMessage[],
    question: string,
  ): Promise<AIExplanationResult> {
    Logger.info("Generating follow-up response", { question });

    const initialPrompt = this.buildPrompt(context);
    const messages: ChatMessage[] = [
      { role: "system", content: PROMPT_TEMPLATES.system() },
      { role: "user", content: initialPrompt },
      ...history,
      { role: "user", content: PROMPT_TEMPLATES.followUp(question) },
    ];

    return this.callAI(messages);
  }

  /**
   * Generate response to follow-up question with streaming
   */
  async *generateFollowUpStream(
    context: ExplainContext,
    history: ChatMessage[],
    question: string,
  ): AsyncGenerator<string, string[], void> {
    Logger.info("Generating follow-up response (streaming)", { question });

    const initialPrompt = this.buildPrompt(context);
    const messages: ChatMessage[] = [
      { role: "system", content: PROMPT_TEMPLATES.system() },
      { role: "user", content: initialPrompt },
      ...history,
      { role: "user", content: PROMPT_TEMPLATES.followUp(question) },
    ];

    return yield* this.callAIStream(messages);
  }

  /**
   * Build prompt based on context type
   */
  private buildPrompt(
    context: ExplainContext,
    ragContext = "",
    language = "English",
  ): string {
    // Prepend RAG context if available
    const contextPrefix = ragContext
      ? `## Additional Context from Source Material\n\n${ragContext}\n\n---\n\n`
      : "";

    // Add language instruction
    const languageInstruction = language !== "English"
      ? `\n\n**IMPORTANT**: You MUST respond in ${language}. All explanations and suggested questions must be in ${language}.`
      : "";

    if (context.contentType === "quiz") {
      return contextPrefix + PROMPT_TEMPLATES.quiz({
        questionText: context.questionText,
        options: context.options,
        correctAnswer: context.correctAnswer,
        userAnswer: context.userAnswer,
        isCorrect: context.isCorrect,
      }) + languageInstruction;
    } else {
      return contextPrefix + PROMPT_TEMPLATES.flashcard({
        front: context.front,
        back: context.back,
        questionText: context.questionText,
        correctAnswer: context.correctAnswer,
      }) + languageInstruction;
    }
  }

  /**
   * Detect language from context
   */
  private detectLanguage(context: ExplainContext): string {
    const text = context.questionText + " " + context.correctAnswer;

    // Simple language detection based on character sets
    // Vietnamese: Contains Vietnamese-specific characters
    if (
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i
        .test(text)
    ) {
      return "Vietnamese";
    }

    // Japanese: Contains Hiragana, Katakana, or Kanji
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
      return "Japanese";
    }

    // Korean: Contains Hangul
    if (/[\uAC00-\uD7AF]/.test(text)) {
      return "Korean";
    }

    // Chinese: Contains Chinese characters (but not Japanese Kanji context)
    if (
      /[\u4E00-\u9FFF]/.test(text) && !/[\u3040-\u309F\u30A0-\u30FF]/.test(text)
    ) {
      return "Chinese";
    }

    // Default to English
    return "English";
  }

  /**
   * Call GitHub Models API
   */
  private async callAI(
    messages: ChatMessage[],
  ): Promise<AIExplanationResult> {
    try {
      const response = await fetch(AI_CONFIG.chatUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_CONFIG.generationModel,
          messages: messages,
          temperature: AI_CONFIG.generation.temperature,
          max_tokens: AI_CONFIG.generation.max_tokens,
          top_p: AI_CONFIG.generation.top_p,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `GitHub Models API error: ${response.status} - ${
            JSON.stringify(
              errorData,
            )
          }`,
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
   * Call GitHub Models API with streaming
   */
  private async *callAIStream(
    messages: ChatMessage[],
  ): AsyncGenerator<string, string[], void> {
    try {
      const response = await fetch(AI_CONFIG.chatUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_CONFIG.generationModel,
          messages: messages,
          temperature: AI_CONFIG.generation.temperature,
          max_tokens: AI_CONFIG.generation.max_tokens,
          top_p: AI_CONFIG.generation.top_p,
          stream: true, // Enable streaming
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

      if (!response.body) {
        throw new Error("No response body");
      }

      // Parse SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;

              if (delta) {
                fullText += delta;
                yield delta; // Yield each chunk progressively
              }
            } catch (_e) {
              // Skip invalid JSON
            }
          }
        }
      }

      Logger.success(`Streaming completed: ${fullText.length} characters`);

      // Parse final response to extract suggested questions
      const result = this.parseResponse(fullText);
      return result.suggested_questions;
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
