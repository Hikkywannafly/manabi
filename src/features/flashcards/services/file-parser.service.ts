export interface ParsingOptions {
  mode?: "FAST" | "BALANCED" | "THOROUGH";
  maxPages?: number;
  includeImages?: boolean;
  skipTables?: boolean;
}

export interface ParseResult {
  content: string;
  metadata?: {
    totalPages?: number;
    processedPages?: number;
    skippedContent?: string[];
    processingTime?: number;
  };
}

export class FileParserService {
  /**
   * Parse file to extract text content
   */
  async parseFile(file: File, options?: ParsingOptions): Promise<string> {
    const startTime = Date.now();
    const mode = options?.mode || "BALANCED";
    const extension = file.name.split(".").pop()?.toLowerCase();

    const parseOptions = this.getParsingOptions(mode);
    let result: string;

    switch (extension) {
      case "txt":
      case "text":
        result = await this.parseText(file, parseOptions);
        break;
      case "md":
      case "markdown":
        result = await this.parseMarkdown(file, parseOptions);
        break;
      case "json":
        result = await this.parseJSON(file, parseOptions);
        break;
      default:
        // For unsupported types, try to read as text
        result = await this.parseText(file, parseOptions);
        break;
    }

    const _processingTime = Date.now() - startTime;

    return result;
  }

  private getParsingOptions(
    mode: "FAST" | "BALANCED" | "THOROUGH",
  ): ParsingOptions {
    switch (mode) {
      case "FAST":
        return {
          mode,
          maxPages: 10,
          includeImages: false,
          skipTables: true,
        };
      case "BALANCED":
        return {
          mode,
          maxPages: 50,
          includeImages: false,
          skipTables: false,
        };
      case "THOROUGH":
        return {
          mode,
          maxPages: undefined,
          includeImages: true,
          skipTables: false,
        };
      default:
        return {
          mode: "BALANCED",
          maxPages: 50,
          includeImages: false,
          skipTables: false,
        };
    }
  }

  private async parseText(
    file: File,
    options: ParsingOptions,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          let content = reader.result;

          // Apply mode-based truncation
          if (options.mode === "FAST" && content.length > 10000) {
            content = content.slice(0, 10000);
          } else if (options.mode === "BALANCED" && content.length > 50000) {
            content = content.slice(0, 50000);
          }

          resolve(content);
        } else {
          reject(new Error("Failed to read file as text"));
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  private async parseMarkdown(
    file: File,
    options: ParsingOptions,
  ): Promise<string> {
    const content = await file.text();

    if (options.mode === "FAST") {
      // Remove code blocks, inline code, images, and links for faster processing
      return content
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`[^`]+`/g, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/[#*_~]/g, "")
        .slice(0, 5000);
    }

    return content;
  }

  private async parseJSON(
    file: File,
    options: ParsingOptions,
  ): Promise<string> {
    const text = await file.text();
    const json = JSON.parse(text);

    // Check if it's a flashcard/quiz format
    if (json.flashcards && Array.isArray(json.flashcards)) {
      let content = `Flashcards: ${json.title || "Untitled"}\n`;
      content += `Description: ${json.description || ""}\n\n`;

      const cardsToProcess =
        options.mode === "FAST"
          ? json.flashcards.slice(0, 20)
          : json.flashcards;

      cardsToProcess.forEach((card: any, index: number) => {
        content += `${index + 1}. ${card.front}\n`;
        content += `   Answer: ${card.back}\n\n`;
      });

      return content;
    }

    // Return formatted JSON for other formats
    return JSON.stringify(json, null, 2);
  }
}
