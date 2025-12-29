import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

export class StorageService {
  constructor(private supabase: SupabaseClient) {}

  async downloadFile(
    filePath: string,
  ): Promise<{ data: Blob; mimeType: string }> {
    const { data, error } = await this.supabase.storage
      .from("uploads")
      .download(filePath);

    if (error) {
      throw new Error(`File download failed: ${error.message}`);
    }

    // Get MIME type from blob
    const mimeType = data.type || "application/octet-stream";

    return { data, mimeType };
  }

  async convertToBase64(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async extractTextFromDocx(blob: Blob): Promise<string> {
    // For DOCX files, we need text extraction
    // For now, convert to base64 and let AI handle it
    return await this.convertToBase64(blob);
  }

  async deleteFile(filePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from("uploads")
      .remove([filePath]);

    if (error) {
      console.warn(`Failed to delete file ${filePath}:`, error.message);
    }
  }
}
