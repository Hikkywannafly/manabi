import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import type { FlashcardGenerationParams } from "../types.ts";

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
    await this.supabase.from("deck_status").upsert({
      deck_id: this.deckId,
      progress: percent,
      message,
      data: data || null,
      updated_at: new Date().toISOString(),
    });
  }
}
