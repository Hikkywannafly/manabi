/**
 * Webpage Extractor - Handles webpage content extraction
 */

import * as cheerio from "cheerio";
import { ERROR_MESSAGES } from "../../config.ts";
import { Logger } from "../../utils/logger.ts";

export type ParsingMode = "fast" | "balanced" | "premium";

export class WebpageExtractor {
  async extract(url: string, parsingMode: ParsingMode): Promise<string> {
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
        text = this.extractFast($);
      } else if (parsingMode === "balanced") {
        text = this.extractBalanced($);
      } else {
        text = this.extractPremium($);
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

  private extractFast($: cheerio.CheerioAPI): string {
    $("nav").remove();
    $("footer").remove();
    $("header").remove();
    $("aside").remove();
    $("iframe").remove();
    $("img").remove();
    return $("body").text().replace(/\s+/g, " ").trim();
  }

  private extractBalanced($: cheerio.CheerioAPI): string {
    $("nav").remove();
    $("footer").remove();
    return $("main, article, .content, body")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();
  }

  private extractPremium($: cheerio.CheerioAPI): string {
    // Premium: Extract everything including alt text
    const altTexts = $("img")
      .map((_, el) => $(el).attr("alt"))
      .get()
      .filter(Boolean)
      .join(". ");

    let text = $("body").text().replace(/\s+/g, " ").trim();
    if (altTexts) {
      text += `\n\nImage descriptions: ${altTexts}`;
    }

    return text;
  }
}
