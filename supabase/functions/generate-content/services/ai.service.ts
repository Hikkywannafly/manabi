import { AI_CONFIG, ERROR_MESSAGES, PROMPT_TEMPLATES } from "../config.ts";
import type { GenerationParams, QuestionData } from "../types.ts";
import { Logger } from "../utils/logger.ts";

export interface AIQuizResponse {
  title: string;
  questions: QuestionData[];
}

export class AIService {
  constructor(private apiKey: string) {}

  async generateQuiz(
    contentData: string, // Can be base64 image OR plain text
    mimeType: string,
    params?: GenerationParams,
  ): Promise<AIQuizResponse> {
    Logger.step(2, "Generating quiz with AI");

    const prompt = this.buildPrompt(params);
    Logger.info("Prompt prepared", { task: params?.task });

    try {
      // Determine if content is text or image based on mimeType
      const isTextContent =
        mimeType === "text/plain" ||
        mimeType.includes("document") ||
        mimeType.includes("json");

      // Build message content
      const messageContent: {
        type: string;
        text?: string;
        image_url?: { url: string };
      }[] = [
        {
          type: "text",
          text: prompt,
        },
      ];

      if (isTextContent) {
        // For text content (DOCX, TXT), append the text directly
        messageContent[0].text = `${prompt}\n\nDocument Content:\n${contentData}`;
      } else {
        // For images/PDFs, use image_url with base64
        messageContent.push({
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${contentData}`,
          },
        });
      }

      // Call OpenRouter API
      const response = await fetch(AI_CONFIG.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://manabi.app", // Optional: your site URL
          "X-Title": "Manabi Quiz Generator", // Optional: your app name
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [
            {
              role: "user",
              content: messageContent,
            },
          ],
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
        throw new Error("No content in API response");
      }

      Logger.success(`AI response received: ${text.length} characters`);

      return this.parseResponse(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(ERROR_MESSAGES.aiGenerationFailed(message));
    }
  }

  private buildPrompt(params?: GenerationParams): string {
    const task = params?.task || AI_CONFIG.defaults.task;

    if (task === "extract") {
      return PROMPT_TEMPLATES.extract({
        language: params?.language || AI_CONFIG.defaults.language,
      });
    }

    const difficulty = params?.difficulty || AI_CONFIG.defaults.difficulty;
    const numberOfQuestions =
      params?.numberOfQuestions || AI_CONFIG.defaults.numberOfQuestions;

    // Handle questionTypes array - convert to formatted string for prompt
    let questionType: string;
    const questionTypes = params?.questionTypes;

    if (!questionTypes || questionTypes.length === 0) {
      // Use default if not provided
      questionType = AI_CONFIG.defaults.questionType;
    } else if (questionTypes.includes("mixed") || questionTypes.length > 1) {
      // If "mixed" is selected or multiple types, format as "Mixed (type1, type2, ...)"
      const types = questionTypes
        .filter((t) => t !== "mixed")
        .map((t) => t.replace(/_/g, " "))
        .join(", ");
      questionType = types ? `Mixed (${types})` : "Mixed";
    } else {
      // Single type selected - format it nicely
      questionType = questionTypes[0].replace(/_/g, " ");
    }

    const language = params?.language || AI_CONFIG.defaults.language;
    const customInstructions = params?.customInstructions;

    return PROMPT_TEMPLATES.quiz({
      difficulty,
      numberOfQuestions,
      questionType,
      language,
      customInstructions,
    });
  }

  private parseResponse(text: string): AIQuizResponse {
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

      if (!Array.isArray(parsed.questions)) {
        // Fallback: if AI returned just array (old behavior), wrap it
        if (Array.isArray(parsed)) {
          return {
            title: "Generated Quiz",
            questions: parsed,
          };
        }
        throw new Error("Response missing 'questions' array");
      }

      Logger.success(
        `Parsed ${parsed.questions.length} questions, Title: ${parsed.title}`,
      );
      return {
        title: parsed.title || "Generated Quiz",
        questions: parsed.questions,
      };
    } catch (error) {
      Logger.error("JSON parsing failed", { text: cleanedText, error });
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(ERROR_MESSAGES.parseResponseFailed(message));
    }
  }
}
