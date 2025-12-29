import { createClient } from "@/lib/supabase/client";
import type { Deck, DeckInsert, FlashcardGenerationParams } from "../types";

export const FlashcardService = {
  /**
   * Create a new deck record
   */
  async createDeck(
    userId: string,
    title: string,
    sourceType: "file" | "text",
    sourceContent: string,
    generationParams: FlashcardGenerationParams,
  ): Promise<Deck> {
    const supabase = createClient();

    const deckData: DeckInsert = {
      owner_id: userId,
      title,
      source_type: sourceType,
      source_content: sourceContent,
      generation_params: generationParams as unknown as Record<string, unknown>,
      status: "generating",
      visibility: "private",
    };

    const { data, error } = await supabase
      .from("decks")
      .insert(deckData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all decks for the current user
   */
  async getDecks(): Promise<Deck[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("decks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single deck by ID
   */
  async getDeck(deckId: string): Promise<Deck | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("decks")
      .select("*")
      .eq("id", deckId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update deck status
   */
  async updateDeckStatus(
    deckId: string,
    status: "draft" | "generating" | "ready" | "failed",
    failureReason?: string,
  ): Promise<void> {
    const supabase = createClient();

    const updateData: Partial<Deck> = { status };
    if (failureReason) {
      updateData.failure_reason = failureReason;
    }

    const { error } = await supabase
      .from("decks")
      .update(updateData)
      .eq("id", deckId);

    if (error) throw error;
  },
};
