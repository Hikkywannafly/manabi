import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import type { DeckStatus, FlashcardData } from "../types.ts";
import { Logger } from "../utils/logger.ts";

export class DeckService {
  constructor(private supabase: SupabaseClient) {}

  async saveFlashcards(
    deckId: string,
    flashcards: FlashcardData[],
  ): Promise<void> {
    Logger.info(`Saving ${flashcards.length} flashcards to deck ${deckId}`);

    const flashcardInserts = flashcards.map((card, index) => ({
      deck_id: deckId,
      front: card.front,
      back: card.back,
      order_index: index,
    }));

    const { error } = await this.supabase
      .from("flashcards")
      .insert(flashcardInserts);

    if (error) {
      throw new Error(`Failed to save flashcards: ${error.message}`);
    }

    Logger.success(`Saved ${flashcards.length} flashcards`);
  }

  async updateDeckMetadata(deckId: string, title: string): Promise<void> {
    Logger.info(`Updating deck metadata for ${deckId}`);

    const { error } = await this.supabase
      .from("decks")
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deckId);

    if (error) {
      throw new Error(`Failed to update deck: ${error.message}`);
    }

    Logger.success("Deck metadata updated");
  }

  async updateStatus(
    deckId: string,
    status: DeckStatus,
    failureReason?: string,
  ): Promise<void> {
    Logger.info(`Updating deck status to ${status}`);

    const updateData: {
      status: DeckStatus;
      failure_reason?: string;
      updated_at: string;
    } = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (failureReason) {
      updateData.failure_reason = failureReason;
    }

    const { error } = await this.supabase
      .from("decks")
      .update(updateData)
      .eq("id", deckId);

    if (error) {
      throw new Error(`Failed to update status: ${error.message}`);
    }

    Logger.success(`Status updated to ${status}`);
  }
}
