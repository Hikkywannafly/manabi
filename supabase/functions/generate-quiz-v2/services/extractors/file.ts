/**
 * File Extractor - Handles file content extraction (PDF, DOCX, TXT, Images)
 */

import * as mammoth from "mammoth";
import { extractText } from "unpdf";
import { ERROR_MESSAGES } from "../../config.ts";
import { Logger } from "../../utils/logger.ts";
import type { ParsingMode } from "./webpage.ts";
import { OCRExtractor } from "./ocr.ts";

export type ImageExtractionMode = "ocr" | "vision" | "auto";

export class FileExtractor {
  constructor(
    private visionExtractor: VisionExtractor,
    private ocrExtractor: OCRExtractor,
  ) {}

  async extract(
    url: string,
    fileType: string,
    parsingMode: ParsingMode,
  ): Promise<string> {
    Logger.info(`Downloading file (${fileType})...`);

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    Logger.success(`Downloaded ${arrayBuffer.byteLength} bytes`);

    // Route to appropriate extractor based on file type
    if (fileType === "docx" || fileType === "doc") {
      return this.extractDocx(arrayBuffer);
    }

    if (fileType === "txt") {
      return this.extractTxt(arrayBuffer);
    }

    if (fileType === "pdf") {
      return this.extractPdf(arrayBuffer);
    }

    if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)) {
      return this.extractImage(arrayBuffer, fileType, parsingMode);
    }

    throw new Error(
      ERROR_MESSAGES.extractionFailed(`Unsupported file type: ${fileType}`),
    );
  }

  private async extractDocx(arrayBuffer: ArrayBuffer): Promise<string> {
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

  private extractTxt(arrayBuffer: ArrayBuffer): string {
    const text = new TextDecoder().decode(arrayBuffer);
    Logger.success(`Read ${text.length} characters from TXT`);
    return text;
  }

  private async extractPdf(arrayBuffer: ArrayBuffer): Promise<string> {
    Logger.info("Extracting text from PDF with unpdf...");
    try {
      const { text: textPages, totalPages } = await extractText(
        new Uint8Array(arrayBuffer),
      );
      // unpdf returns text as string[] (one per page), join them
      const text = textPages.join("\n");
      Logger.success(
        `Extracted ${text.length} characters from ${totalPages} PDF pages`,
      );

      // If text is too short, likely a scanned PDF
      if (text.trim().length < 50) {
        Logger.error(
          "PDF appears to be scanned/image-based with minimal text",
        );
        throw new Error(
          ERROR_MESSAGES.extractionFailed(
            "This PDF appears to be a scanned document with no extractable text. Please convert it to a text-based PDF or use images instead.",
          ),
        );
      }

      return text;
    } catch (error) {
      // Check if it's our own error (scanned PDF message)
      if (
        error instanceof Error && error.message.includes("scanned document")
      ) {
        throw error;
      }
      Logger.error("PDF extraction failed", error);
      throw new Error(
        ERROR_MESSAGES.extractionFailed(
          "Failed to extract text from PDF. Please ensure the PDF contains selectable text.",
        ),
      );
    }
  }

  private async extractImage(
    arrayBuffer: ArrayBuffer,
    fileType: string,
    parsingMode: ParsingMode,
    extractionMode: ImageExtractionMode = "auto",
  ): Promise<string> {
    const mimeType = `image/${fileType === "jpg" ? "jpeg" : fileType}`;

    // Auto mode: Try OCR first (free), fallback to Vision if fails
    if (extractionMode === "auto") {
      Logger.info(
        "Auto mode: Trying OCR first, will fallback to Vision API if needed",
      );
      try {
        const text = await this.ocrExtractor.extractFromBuffer(
          arrayBuffer,
          mimeType,
        );
        Logger.success("OCR extraction successful");
        return text;
      } catch (error) {
        Logger.error("OCR failed, falling back to Vision API", error);
        return await this.visionExtractor.extractFromBuffer(
          arrayBuffer,
          mimeType,
          parsingMode,
        );
      }
    }

    // Explicit OCR mode
    if (extractionMode === "ocr") {
      Logger.info("Using OCR mode for image extraction");
      return await this.ocrExtractor.extractFromBuffer(arrayBuffer, mimeType);
    }

    // Explicit Vision mode
    Logger.info("Using Vision API mode for image extraction");
    return await this.visionExtractor.extractFromBuffer(
      arrayBuffer,
      mimeType,
      parsingMode,
    );
  }
}

/**
 * Vision Extractor - Handles image/vision-based extraction using GitHub Models
 */
export class VisionExtractor {
  constructor(
    private githubToken: string,
    private chatUrl: string,
    private generationModel: string,
  ) {}

  async extractFromUrl(
    imageUrl: string,
    mimeType: string,
    parsingMode: ParsingMode,
  ): Promise<string> {
    Logger.info("Fetching image for vision extraction...");
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return await this.extractFromBuffer(arrayBuffer, mimeType, parsingMode);
  }

  async extractFromBuffer(
    arrayBuffer: ArrayBuffer,
    mimeType: string,
    parsingMode: ParsingMode,
  ): Promise<string> {
    Logger.brain("Using GitHub Models Vision API for extraction...");

    const base64 = this.convertToBase64(arrayBuffer);
    Logger.info(`Converted to base64: ${base64.length} characters`);

    const prompt = this.getPrompt(parsingMode);

    try {
      const response = await fetch(this.chatUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.generationModel,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
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

  private convertToBase64(arrayBuffer: ArrayBuffer): string {
    // Convert to base64 in chunks to avoid stack overflow
    const uint8Array = new Uint8Array(arrayBuffer);
    const chunkSize = 8192;
    let binary = "";

    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  private getPrompt(parsingMode: ParsingMode): string {
    const prompts = {
      fast:
        "Extract the main text content from this document. Focus on readable text only.",
      balanced:
        "Extract all text content from this document, including text from tables. Preserve structure.",
      premium:
        "Extract ALL content comprehensively. Include text, table data, image descriptions, equations.",
    };

    return prompts[parsingMode];
  }
}
