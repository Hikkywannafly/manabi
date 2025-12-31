import { createClient } from "@/lib/supabase/client";
import type {
  Collection,
  CollectionDeck,
  CollectionDetail,
  CollectionQuiz,
  CollectionStats,
} from "../types";

export const CollectionService = {
  /**
   * Fetch all collections for the current user
   */
  async getCollections(): Promise<Collection[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Collection[];
  },

  /**
   * Fetch a single collection with its items (quizzes and decks)
   */
  async getCollectionDetail(collectionId: string): Promise<CollectionDetail> {
    const supabase = createClient();

    // Fetch collection
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .select("*")
      .eq("id", collectionId)
      .single();

    if (collectionError) {
      throw collectionError;
    }

    // Fetch quizzes in this collection
    const { data: quizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .select("id, title, slug, created_at, visibility, status")
      .eq("collection_id", collectionId)
      .order("created_at", { ascending: false });

    if (quizzesError) {
      throw quizzesError;
    }

    // Fetch decks in this collection
    const { data: decks, error: decksError } = await supabase
      .from("decks")
      .select("id, title, slug, created_at, visibility, status")
      .eq("collection_id", collectionId)
      .order("created_at", { ascending: false });

    if (decksError) {
      throw decksError;
    }

    return {
      ...collection,
      quizzes: (quizzes as CollectionQuiz[]) || [],
      decks: (decks as CollectionDeck[]) || [],
    } as CollectionDetail;
  },

  /**
   * Get collection stats (counts)
   */
  async getCollectionStats(collectionId: string): Promise<CollectionStats> {
    const supabase = createClient();

    // Count quizzes
    const { count: quizCount } = await supabase
      .from("quizzes")
      .select("*", { count: "exact", head: true })
      .eq("collection_id", collectionId);

    // Count decks
    const { count: deckCount } = await supabase
      .from("decks")
      .select("*", { count: "exact", head: true })
      .eq("collection_id", collectionId);

    const totalQuizzes = quizCount || 0;
    const totalDecks = deckCount || 0;

    return {
      totalQuizzes,
      totalDecks,
      totalItems: totalQuizzes + totalDecks,
    };
  },

  /**
   * Create a new collection
   */
  async createCollection(
    userId: string,
    name: string,
    isPublic: boolean,
  ): Promise<Collection> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("collections")
      .insert({
        owner_id: userId,
        name,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Collection;
  },

  /**
   * Update collection name
   */
  async updateCollection(
    collectionId: string,
    name: string,
  ): Promise<Collection> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("collections")
      .update({
        name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", collectionId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Collection;
  },

  /**
   * Delete a collection (items will have collection_id set to null)
   */
  async deleteCollection(collectionId: string, userId: string): Promise<void> {
    const supabase = createClient();

    // First, remove collection_id from all quizzes and decks owned by user
    await supabase
      .from("quizzes")
      .update({ collection_id: null })
      .eq("collection_id", collectionId)
      .eq("owner_id", userId);

    await supabase
      .from("decks")
      .update({ collection_id: null })
      .eq("collection_id", collectionId)
      .eq("owner_id", userId);

    // Then delete the collection
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId);

    if (error) {
      throw error;
    }
  },

  /**
   * Add items to a collection
   */
  async addItemsToCollection(
    collectionId: string,
    userId: string,
    quizIds: string[],
    deckIds: string[],
  ): Promise<void> {
    const supabase = createClient();

    // Use RPC for atomic and secure update
    const { error } = await supabase.rpc("add_items_to_collection", {
      p_collection_id: collectionId,
      p_quiz_ids: quizIds,
      p_deck_ids: deckIds,
    });

    if (error) {
      throw error;
    }
  },

  /**
   * Remove an item from a collection
   */
  async removeItemFromCollection(
    itemId: string,
    itemType: "quiz" | "deck",
    userId: string,
  ): Promise<void> {
    const supabase = createClient();

    const table = itemType === "quiz" ? "quizzes" : "decks";

    const { error } = await supabase
      .from(table)
      .update({ collection_id: null })
      .eq("id", itemId)
      .eq("owner_id", userId);

    if (error) {
      throw error;
    }
  },

  /**
   * Get all available quizzes and decks (not in any collection or in current collection)
   */
  async getAvailableItems(
    userId: string,
    currentCollectionId?: string,
  ): Promise<{
    quizzes: CollectionQuiz[];
    decks: CollectionDeck[];
  }> {
    const supabase = createClient();

    // Fetch quizzes that are either not in a collection or in the current collection
    const quizzesQuery = supabase
      .from("quizzes")
      .select("id, title, slug, created_at, visibility, status")
      .eq("owner_id", userId);

    if (currentCollectionId) {
      quizzesQuery.or(
        `collection_id.is.null,collection_id.eq.${currentCollectionId}`,
      );
    } else {
      quizzesQuery.is("collection_id", null);
    }

    const { data: quizzes, error: quizzesError } = await quizzesQuery.order(
      "created_at",
      { ascending: false },
    );

    if (quizzesError) {
      throw quizzesError;
    }

    // Fetch decks that are either not in a collection or in the current collection
    const decksQuery = supabase
      .from("decks")
      .select("id, title, slug, created_at, visibility, status")
      .eq("owner_id", userId);

    if (currentCollectionId) {
      decksQuery.or(
        `collection_id.is.null,collection_id.eq.${currentCollectionId}`,
      );
    } else {
      decksQuery.is("collection_id", null);
    }

    const { data: decks, error: decksError } = await decksQuery.order(
      "created_at",
      { ascending: false },
    );

    if (decksError) {
      throw decksError;
    }

    return {
      quizzes: (quizzes as CollectionQuiz[]) || [],
      decks: (decks as CollectionDeck[]) || [],
    };
  },
};
