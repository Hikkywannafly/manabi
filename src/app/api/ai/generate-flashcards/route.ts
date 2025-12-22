import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const GenerateFlashcardsRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  apiKey: z.string(),
  fileContent: z.string().optional(),
  modelName: z.string().default("google/gemini-2.0-flash-exp:free"),
  availableCategories: z.string().optional(),
  settings: z
    .object({
      visibility: z.string().optional(),
      language: z.string().optional(),
      numberOfCards: z.number().int().min(1).max(10).optional(),
      difficulty: z.string().optional(),
      generationMode: z.enum(["GENERATE", "EXTRACT"]).optional(),
      fileProcessing: z.string().optional(),
      parsingMode: z.string().optional(),
      includeCategories: z.boolean().optional(),
    })
    .optional(),
  // Add support for file object
  file: z
    .object({
      fileName: z.string(),
      mimeType: z.string(),
      data: z.string(),
      size: z.number(),
      type: z.string(),
    })
    .optional(),
});

const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1";

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Only retry on rate limit errors (429)
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        const delay = retryAfter
          ? Number.parseInt(retryAfter, 10) * 1000
          : baseDelay * 2 ** attempt;

        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      // Don't retry on other errors
      throw error;
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = GenerateFlashcardsRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request parameters",
          details: validated.error.issues,
        },
        { status: 400 },
      );
    }

    const {
      title,
      description,
      apiKey,
      fileContent = "",
      modelName,
      settings = {},
      file,
    } = validated.data;

    // Parse number of cards from settings
    const numberOfCards = settings.numberOfCards || 5;
    const generationMode = settings.generationMode || "GENERATE";
    // const isExtractMode = generationMode === "EXTRACT";

    // Prompt generate flashcards (MCQ style)
    const prompt = `
You are an expert flashcard generator. You MUST return EXACTLY ${numberOfCards} flashcards in multiple-choice format.

REQUIREMENTS:
- Title: ${title}
- Description: ${description}
- Language: ${settings.language} (if "auto", detect and generate using the language of ${fileContent})
- Difficulty: ${settings.difficulty || "EASY"}
- Number of Cards: ${numberOfCards}

Content to generate flashcards from:
${fileContent.slice(0, 8000)}

CRITICAL RULES:
1. Return EXACTLY ${numberOfCards} flashcards
2. Each flashcard has:
   - "question": string
   - "choices": array of 4 options
   - "correctAnswer": index of the correct option (0–3)
   - "explanation": detailed explanation of why the answer is correct
3. ONLY ONE correct answer per flashcard
4. Response MUST be a valid JSON object with format {"title": "...", "description": "...", "flashcards": [...]}

FORMAT:
{
  "title": "${title}",
  "description": "${description}",

  "flashcards": [
    {
      "id": "fc1",
      "question": "What is 2 + 2?",
      "choices": ["3", "4", "5", "6"],
      "correctAnswer": 1,
      "explanation": "2 + 2 equals 4"
    }
  ],
  "metadata": {
    "total_cards": ${numberOfCards},
    "difficulty": "${settings.difficulty || "EASY"}",
    "estimated_study_time": ${Math.ceil(numberOfCards * 0.5)},
    "generated_from": "${file ? "file" : "text"}",
    "generation_mode": "${generationMode}"
  }
}

RETURN ONLY THE JSON OBJECT ABOVE.`.trim();

    // Call OpenRouter API with retry logic
    const response = await retryWithBackoff(
      () =>
        axios.post(
          `${OPENROUTER_API_BASE}/chat/completions`,
          {
            model: modelName,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 4000,
            response_format: { type: "json_object" },
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://manabi.vercel.app",
              "X-Title": "Manabi Flashcard Generator",
            },
            timeout: 90000,
          },
        ),
      3, // max retries
      2000, // base delay (2 seconds)
    );

    const aiResponse = response.data.choices?.[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No content returned from AI");
    }

    // Parse and validate response
    const parsed = JSON.parse(aiResponse);

    if (!Array.isArray(parsed.flashcards)) {
      throw new Error("Invalid AI response format");
    }

    return NextResponse.json({
      success: true,
      title: parsed.title || title,
      description: parsed.description || description,
      flashcards: parsed.flashcards,
      metadata: parsed.metadata,
    });
  } catch (error) {
    console.error("Generate flashcards API error:", error);

    let errorMessage = "Failed to generate flashcards";
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      if (status === 401) {
        errorMessage = "Invalid API key";
      } else if (status === 429) {
        const quotaExhausted = errorData?.error?.code === "insufficient_quota";
        const retryAfter = error.response?.headers["retry-after"];

        if (quotaExhausted) {
          errorMessage =
            "API quota exhausted - please check your billing or upgrade your plan";
        } else if (retryAfter) {
          errorMessage = `Rate limit exceeded. Please try again in ${retryAfter} seconds`;
        } else {
          errorMessage =
            "Rate limit exceeded. Please wait a moment and try again";
        }
      } else if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
