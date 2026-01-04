/**
 * Extractor Service - Main orchestrator for content extraction
 * Delegates to specialized extractors based on source type
 */

import { AI_CONFIG } from "../config.ts";
import { Logger } from "../utils/logger.ts";
import { YoutubeExtractor } from "./extractors/youtube.ts";
import { WebpageExtractor } from "./extractors/webpage.ts";
import { FileExtractor, VisionExtractor } from "./extractors/file.ts";
import { OCRExtractor } from "./extractors/ocr.ts";
import type { ParsingMode } from "./extractors/webpage.ts";

type SourceType = "file" | "text" | "youtube" | "webpage" | "image";

export class ExtractorService {
  private youtubeExtractor: YoutubeExtractor;
  private webpageExtractor: WebpageExtractor;
  private fileExtractor: FileExtractor;
  private visionExtractor: VisionExtractor;
  private ocrExtractor: OCRExtractor;

  constructor(githubToken: string) {
    // Initialize specialized extractors
    this.youtubeExtractor = new YoutubeExtractor();
    this.webpageExtractor = new WebpageExtractor();
    this.visionExtractor = new VisionExtractor(
      githubToken,
      AI_CONFIG.chatUrl,
      AI_CONFIG.generationModel,
    );
    this.ocrExtractor = new OCRExtractor();
    this.fileExtractor = new FileExtractor(
      this.visionExtractor,
      this.ocrExtractor,
    );
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
        return this.extractText(content);

      case "youtube":
        return await this.youtubeExtractor.extract(content);

      case "webpage":
        return await this.webpageExtractor.extract(content, parsingMode);

      case "image":
        return await this.visionExtractor.extractFromUrl(
          content,
          "image/png",
          parsingMode,
        );

      case "file":
        if (!fileType) throw new Error("File type required for file source");
        return await this.fileExtractor.extract(content, fileType, parsingMode);

      default:
        throw new Error("Unknown source type");
    }
  }

  private extractText(content: string): string {
    Logger.success(`Text content: ${content.length} characters`);
    return content;
  }
}
