import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import * as mammoth from "https://esm.sh/mammoth@1.8.0";
import { STORAGE_CONFIG } from "../config.ts";
import { Logger } from "../utils/logger.ts";

export class StorageService {
  constructor(private supabase: SupabaseClient) {}

  async downloadFile(filePath: string): Promise<{
    data: Blob;
    mimeType: string;
  }> {
    Logger.info("Downloading file from storage...");

    const { data, error } = await this.supabase.storage
      .from(STORAGE_CONFIG.bucket)
      .download(filePath);

    if (error || !data) {
      throw new Error(
        `File download failed: ${error?.message || "No data received"}`,
      );
    }

    const mimeType = data.type || STORAGE_CONFIG.defaultMimeType;

    Logger.success(`File downloaded: ${data.size} bytes, type: ${mimeType}`);

    return { data, mimeType };
  }

  async convertToBase64(blob: Blob): Promise<string> {
    Logger.info("Converting file to base64...");

    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Convert in chunks to avoid stack overflow with large files
    const chunkSize = 8192; // 8KB chunks
    let binary = "";

    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    const base64 = btoa(binary);

    Logger.success(`Converted to base64: ${base64.length} characters`);
    return base64;
  }

  async extractTextFromDocx(blob: Blob): Promise<string> {
    Logger.info("Extracting text from DOCX...");

    try {
      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      if (result.messages && result.messages.length > 0) {
        Logger.warn("Mammoth messages:", result.messages);
      }

      Logger.success(`Extracted ${result.value.length} characters from DOCX`);
      return result.value;
    } catch (error) {
      Logger.error("Failed to extract text from DOCX", error);
      throw new Error(
        "Failed to parse DOCX file. Please try converting to PDF or using a simple text file.",
      );
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    Logger.info(`Deleting temporary file: ${filePath}`);

    try {
      const { error } = await this.supabase.storage
        .from(STORAGE_CONFIG.bucket)
        .remove([filePath]);

      if (error) {
        Logger.error("Failed to delete file", error);
      } else {
        Logger.success(`File deleted: ${filePath}`);
      }
    } catch (error) {
      Logger.error("Exception during file deletion", error);
    }
  }
}
