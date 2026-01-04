/**
 * Extractor Service - Handles content extraction from various sources
 * Uses GitHub Models API (GPT-4o Vision) for PDF/Images
 */

import { YoutubeTranscript } from "youtube-transcript";
import * as cheerio from "cheerio";
import * as mammoth from "mammoth";
import { AI_CONFIG, ERROR_MESSAGES } from "../config.ts";
import { Logger } from "../utils/logger.ts";

type SourceType = "file" | "text" | "youtube" | "webpage" | "image";
type ParsingMode = "fast" | "balanced" | "premium";

export class ExtractorService {
  private githubToken: string;

  constructor(githubToken: string) {
    this.githubToken = githubToken;
  }

  async extract(
    sourceType: SourceType,
    content: string,
    fileType?: string,
    parsingMode: ParsingMode = "balanced",
  ): Promise<string> {
    Logger.step(
      2,
      `Extracting content from ${sourceType} (${parsingMode} mode)`,
    );

    switch (sourceType) {
      case "text":
        Logger.success(`Text content: ${content.length} characters`);
        return content;
      case "youtube":
        return await this.extractYoutube(content);
      case "webpage":
        return await this.extractWebpage(content, parsingMode);
      case "image":
        return await this.extractWithVision(content, "image/png", parsingMode);
      case "file":
        if (!fileType) throw new Error("File type required for file source");
        return await this.extractFile(content, fileType, parsingMode);
      default:
        throw new Error("Unknown source type");
    }
  }

  private async extractYoutube(url: string): Promise<string> {
    Logger.info("Fetching YouTube transcript...");
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(url);
      const text = transcript.map((t: { text: string }) => t.text).join(" ");
      Logger.success(`Extracted ${text.length} characters from YouTube`);
      return text;
    } catch (error) {
      Logger.error("YouTube extraction failed", error);
      throw new Error(
        ERROR_MESSAGES.extractionFailed("YouTube transcript unavailable"),
      );
    }
  }

  private async extractWebpage(
    url: string,
    parsingMode: ParsingMode,
  ): Promise<string> {
    Logger.info(`Fetching webpage: ${url}`);
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Cleanup based on parsing mode
      $("script").remove();
      $("style").remove();

      let text: string;

      if (parsingMode === "fast") {
        $("nav").remove();
        $("footer").remove();
        $("header").remove();
        $("aside").remove();
        $("iframe").remove();
        $("img").remove();
        text = $("body").text().replace(/\s+/g, " ").trim();
      } else if (parsingMode === "balanced") {
        $("nav").remove();
        $("footer").remove();
        text = $("main, article, .content, body")
          .first()
          .text()
          .replace(/\s+/g, " ")
          .trim();
      } else {
        // Premium: Extract everything including alt text
        const altTexts = $("img")
          .map((_, el) => $(el).attr("alt"))
          .get()
          .filter(Boolean)
          .join(". ");
        text = $("body").text().replace(/\s+/g, " ").trim();
        if (altTexts) text += `\n\nImage descriptions: ${altTexts}`;
      }

      Logger.success(`Extracted ${text.length} characters from webpage`);
      return text;
    } catch (error) {
      Logger.error("Webpage extraction failed", error);
      throw new Error(
        ERROR_MESSAGES.extractionFailed("Could not fetch webpage"),
      );
    }
  }

  private async extractFile(
    url: string,
    fileType: string,
    parsingMode: ParsingMode,
  ): Promise<string> {
    Logger.info(`Downloading file (${fileType})...`);

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    Logger.success(`Downloaded ${arrayBuffer.byteLength} bytes`);

    // DOCX - Use mammoth (no API call needed)
    if (fileType === "docx" || fileType === "doc") {
      Logger.info("Extracting text from DOCX with mammoth...");
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        Logger.success(`Extracted ${result.value.length} characters from DOCX`);
        return result.value;
      } catch (error) {
        Logger.error("DOCX extraction failed", error);
        throw new Error(ERROR_MESSAGES.extractionFailed("DOCX parsing error"));
      }
    }

    // TXT - Direct decode
    if (fileType === "txt") {
      const text = new TextDecoder().decode(arrayBuffer);
      Logger.success(`Read ${text.length} characters from TXT`);
      return text;
    }

    // PDF - Use OpenRouter Vision API
    if (fileType === "pdf") {
      const mimeType = "application/pdf";
      return await this.extractWithVisionFromBuffer(
        arrayBuffer,
        mimeType,
        parsingMode,
      );
    }

    // Images - Use OpenRouter Vision API
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)) {
      const mimeType = `image/${fileType === "jpg" ? "jpeg" : fileType}`;
      return await this.extractWithVisionFromBuffer(
        arrayBuffer,
        mimeType,
        parsingMode,
      );
    }

    throw new Error(
      ERROR_MESSAGES.extractionFailed(`Unsupported file type: ${fileType}`),
    );
  }

  private async extractWithVision(
    imageUrl: string,
    mimeType: string,
    parsingMode: ParsingMode,
  ): Promise<string> {
    Logger.info("Fetching image for vision extraction...");
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return await this.extractWithVisionFromBuffer(
      arrayBuffer,
      mimeType,
      parsingMode,
    );
  }

  private async extractWithVisionFromBuffer(
    arrayBuffer: ArrayBuffer,
    mimeType: string,
    parsingMode: ParsingMode,
  ): Promise<string> {
    Logger.brain("Using GitHub Models Vision API for extraction...");

    // Convert to base64 in chunks to avoid stack overflow
    const uint8Array = new Uint8Array(arrayBuffer);
    const chunkSize = 8192;
    let binary = "";

    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    const base64 = btoa(binary);
    Logger.info(`Converted to base64: ${base64.length} characters`);

    // Build prompt based on parsing mode
    const prompts = {
      fast:
        "Extract the main text content from this document. Focus on readable text only.",
      balanced:
        "Extract all text content from this document, including text from tables. Preserve structure.",
      premium:
        "Extract ALL content comprehensively. Include text, table data, image descriptions, equations.",
    };

    try {
      const response = await fetch(AI_CONFIG.chatUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_CONFIG.generationModel,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompts[parsingMode] },
                {
                  type: "image_url",
                  image_url: { url: `data:${mimeType};base64,${base64}` },
                },
              ],
            },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Vision API error: ${response.status} - ${JSON.stringify(errorData)}`,
        );
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";

      Logger.success(`Vision extraction complete: ${text.length} characters`);
      return text;
    } catch (error) {
      Logger.error("Vision extraction failed", error);
      throw new Error(ERROR_MESSAGES.extractionFailed("Vision API error"));
    }
  }
}
