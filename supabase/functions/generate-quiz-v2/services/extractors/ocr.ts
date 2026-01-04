/**
 * OCR Extractor - Handles OCR-based text extraction using Tesseract
 */

import { ERROR_MESSAGES } from "../../config.ts";
import { Logger } from "../../utils/logger.ts";

export class OCRExtractor {
  /**
   * Extract text from image using Tesseract OCR
   * Falls back to simple preprocessing if Tesseract is not available
   */
  async extractFromBuffer(
    arrayBuffer: ArrayBuffer,
    mimeType: string,
  ): Promise<string> {
    Logger.info("Using Tesseract OCR for image extraction...");

    try {
      // Import tesseract from deno.json imports
      const Tesseract = await import("tesseract.js");

      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = new Blob([uint8Array], { type: mimeType });

      Logger.info("Initializing Tesseract worker...");
      const worker = await Tesseract.createWorker("eng", 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            Logger.info(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      Logger.info("Running OCR on image...");
      const {
        data: { text },
      } = await worker.recognize(blob);

      await worker.terminate();

      // Validate extracted text
      if (!text || text.trim().length < 10) {
        Logger.error("OCR extracted text too short", {
          length: text?.length || 0,
        });
        throw new Error(
          "OCR could not extract meaningful text from the image. The image may be too blurry, low quality, or contain no readable text.",
        );
      }

      Logger.success(`OCR extracted ${text.length} characters`);
      return text.trim();
    } catch (error) {
      Logger.error("OCR extraction failed", error);

      // Check if it's our validation error
      if (
        error instanceof Error &&
        error.message.includes("could not extract meaningful text")
      ) {
        throw error;
      }

      // Generic OCR failure
      throw new Error(
        ERROR_MESSAGES.extractionFailed(
          `OCR extraction failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }. Try using Vision API mode instead.`,
        ),
      );
    }
  }

  /**
   * Extract text from image URL using Tesseract OCR
   */
  async extractFromUrl(imageUrl: string, mimeType: string): Promise<string> {
    Logger.info("Fetching image for OCR extraction...");
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return await this.extractFromBuffer(arrayBuffer, mimeType);
  }
}
