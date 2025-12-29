import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import type { FlashcardGenerationParams } from "../types.ts";
import { Logger } from "./logger.ts";

export class ProgressTracker {
  constructor(
    private supabase: SupabaseClient,
    private deckId: string,
    public generationParams?: FlashcardGenerationParams,
  ) {}

  async update(
    percent: number,
    message: string,
    data?: Record<string, unknown>,
  ) {
    try {
      // DB Update
      await this.supabase.from("deck_status").upsert({
        deck_id: this.deckId,
        progress: percent,
        message,
        data: data || null,
        updated_at: new Date().toISOString(),
      });

      // Broadcast
      const channel = this.supabase.channel(`deck:${this.deckId}`);
      await channel.send({
        type: "broadcast",
        event: "progress",
        payload: { progress: percent, message, data },
      });

      Logger.info(`Progress: ${percent}% - ${message}`);
    } catch (error) {
      Logger.error("Failed to update progress", error);
    }
  }
}
