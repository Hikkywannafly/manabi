import { createClient } from "@/lib/supabase/client";
import type {
  Deck,
  DeckInsert,
  FlashcardGenerationParams,
  FlashcardWithReview,
} from "../types";

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

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const deckData: DeckInsert = {
      owner_id: userId,
      title,
      slug,
      source_type: sourceType,
      source_content: sourceContent,
      generation_params: generationParams as any,
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

  /**
   * Get all flashcards for a deck, with user's review status
   */
  async getFlashcards(deckId: string): Promise<FlashcardWithReview[]> {
    const supabase = createClient();

    // Determine user ID inside the service or assume RLS handles it?
    // RLS handles filtering flashcard_reviews by user_id if setup correctly.
    // However, we want to fetch cards EVEN IF there is no review? Yes.

    const { data, error } = await supabase
      .from("flashcards")
      .select(`
        *,
        flashcard_reviews(*)
      `)
      .eq("deck_id", deckId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data as FlashcardWithReview[];
  },

  /**
   * Record a review attempt
   */
  async recordReview(
    flashcardId: string,
    rating: "again" | "hard" | "good" | "easy",
  ): Promise<void> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const now = new Date();
    const nextReview = new Date();

    // Simple scheduling (placeholder)
    switch (rating) {
      case "again":
        nextReview.setMinutes(now.getMinutes() + 1);
        break;
      case "hard":
        nextReview.setMinutes(now.getMinutes() + 10);
        break;
      case "good":
        nextReview.setDate(now.getDate() + 1);
        break;
      case "easy":
        nextReview.setDate(now.getDate() + 4);
        break;
    }

    // Map to DB status
    const statusMap = {
      again: "learning",
      hard: "learning",
      good: "review",
      easy: "review",
    };

    // We assume 'flashcard_reviews' has a unique constraint on (flashcard_id, user_id)
    const reviewData = {
      flashcard_id: flashcardId,
      user_id: user.id,
      status: statusMap[rating],
      last_reviewed: now.toISOString(),
      next_review: nextReview.toISOString(),
    };

    const { error } = await supabase
      .from("flashcard_reviews")
      .upsert(reviewData as any, { onConflict: "flashcard_id,user_id" });

    if (error) throw error;
  },
};
