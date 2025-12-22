"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface FlashcardData {
  question: string;
  answer: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
}

export interface CreateDeckInput {
  title: string;
  description: string;
  flashcards: FlashcardData[];
  isPublic?: boolean;
}

export async function createDeck(input: CreateDeckInput) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Create deck
    const { data: deck, error: deckError } = await supabase
      .from("decks")
      .insert({
        user_id: user.id,
        title: input.title,
        description: input.description,
        is_public: input.isPublic,
      })
      .select()
      .single();

    if (deckError || !deck) {
      console.error("Error creating deck:", deckError);
      return {
        success: false,
        error: "Failed to create deck",
      };
    }

    // Create flashcards
    const flashcardsToInsert = input.flashcards.map((fc, index) => ({
      deck_id: deck.id,
      question: fc.question,
      answer: fc.answer || fc.options?.[fc.correctAnswer || 0] || "",
      options: fc.options || null,
      order_index: index,
    }));

    const { error: flashcardsError } = await supabase
      .from("flashcards")
      .insert(flashcardsToInsert);

    if (flashcardsError) {
      console.error("Error creating flashcards:", flashcardsError);
      // Rollback: delete the deck
      await supabase.from("decks").delete().eq("id", deck.id);
      return {
        success: false,
        error: "Failed to create flashcards",
      };
    }

    // Increment user's flashcard creation count
    const { error: updateError } = await supabase.rpc(
      "increment_flashcard_stats",
      {
        user_id: user.id,
        count: input.flashcards.length,
      },
    );

    if (updateError) {
      console.warn("Failed to update user stats:", updateError);
      // Don't fail the whole operation for this
    }

    revalidatePath("/dashboard/flashcards");

    return {
      success: true,
      deckId: deck.id,
      message: "Deck created successfully",
    };
  } catch (error) {
    console.error("Unexpected error in createDeck:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function getDeck(deckId: string) {
  try {
    const supabase = await createClient();

    const { data: deck, error: deckError } = await supabase
      .from("decks")
      .select("*")
      .eq("id", deckId)
      .single();

    if (deckError || !deck) {
      return {
        success: false,
        error: "Deck not found",
      };
    }

    const { data: flashcards, error: flashcardsError } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", deckId)
      .order("order_index", { ascending: true });

    if (flashcardsError) {
      return {
        success: false,
        error: "Failed to fetch flashcards",
      };
    }

    return {
      success: true,
      deck,
      flashcards: flashcards || [],
    };
  } catch (error) {
    console.error("Unexpected error in getDeck:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
