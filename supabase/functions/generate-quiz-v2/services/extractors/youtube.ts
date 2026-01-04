/**
 * YouTube Extractor - Handles YouTube transcript extraction
 */

import { YoutubeTranscript } from "youtube-transcript";
import { ERROR_MESSAGES } from "../../config.ts";
import { Logger } from "../../utils/logger.ts";

export class YoutubeExtractor {
  async extract(url: string): Promise<string> {
    Logger.info("Fetching YouTube transcript...");

    // Extract video ID from URL
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      Logger.error("Invalid YouTube URL", { url });
      throw new Error(
        ERROR_MESSAGES.extractionFailed(
          "Invalid YouTube URL. Please provide a valid YouTube video link (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID).",
        ),
      );
    }

    Logger.info(`Extracted video ID: ${videoId}`);

    try {
      const transcript = await YoutubeTranscript.fetchTranscript(url);

      // Check if transcript is valid
      if (
        !transcript || !Array.isArray(transcript) || transcript.length === 0
      ) {
        Logger.error("Empty transcript returned", { videoId });
        throw new Error("No transcript available for this video");
      }

      const text = transcript.map((t: { text: string }) => t.text).join(" ");

      // Validate extracted text
      if (text.trim().length < 10) {
        Logger.error("Transcript too short", { length: text.length, videoId });
        throw new Error("Transcript is too short or empty");
      }

      Logger.success(
        `Extracted ${text.length} characters from YouTube (${videoId})`,
      );
      return text;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Extract YouTube video ID from various URL formats
   * Supports:
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID
   * - https://www.youtube.com/embed/VIDEO_ID
   * - https://www.youtube.com/v/VIDEO_ID
   */
  private extractVideoId(url: string): string | null {
    try {
      const urlObj = new URL(url);

      // Standard youtube.com/watch?v=VIDEO_ID
      if (
        urlObj.hostname.includes("youtube.com") && urlObj.searchParams.has("v")
      ) {
        return urlObj.searchParams.get("v");
      }

      // Short youtu.be/VIDEO_ID
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1).split("?")[0];
      }

      // Embed or /v/ format
      if (urlObj.hostname.includes("youtube.com")) {
        const pathMatch = urlObj.pathname.match(/\/(embed|v)\/([^/?]+)/);
        if (pathMatch) {
          return pathMatch[2];
        }
      }

      return null;
    } catch {
      // If URL parsing fails, try regex as fallback
      const regexMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      );
      return regexMatch ? regexMatch[1] : null;
    }
  }

  private handleError(error: unknown): never {
    Logger.error("YouTube extraction failed", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("Transcript is disabled")) {
      throw new Error(
        ERROR_MESSAGES.extractionFailed(
          "This video has transcripts/captions disabled by the creator. Please try a different video or use another content source.",
        ),
      );
    }

    if (
      errorMessage.includes("age-restricted") ||
      errorMessage.includes("age restricted")
    ) {
      throw new Error(
        ERROR_MESSAGES.extractionFailed(
          "This video is age-restricted and transcripts cannot be accessed. Please use a different video.",
        ),
      );
    }

    if (
      errorMessage.includes("private") || errorMessage.includes("unavailable")
    ) {
      throw new Error(
        ERROR_MESSAGES.extractionFailed(
          "This video is private or unavailable. Please ensure the video is public and accessible.",
        ),
      );
    }

    if (errorMessage.includes("No transcript available")) {
      throw new Error(
        ERROR_MESSAGES.extractionFailed(
          "No captions/subtitles are available for this video. The video creator needs to add captions or enable auto-generated captions.",
        ),
      );
    }

    // Generic fallback error
    throw new Error(
      ERROR_MESSAGES.extractionFailed(
        `YouTube transcript unavailable: ${errorMessage}. The video may not have captions, is age-restricted, or is private.`,
      ),
    );
  }
}
