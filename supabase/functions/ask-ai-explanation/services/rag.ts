/**
 * RAG Service - Simplified for AI Explanation
 * Only handles context retrieval from existing vectors
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { Logger } from "../utils/logger.ts";

export interface RAGConfig {
  embeddingsUrl: string;
  embeddingModel: string;
  matchThreshold: number;
  matchCount: number;
}

export class RagService {
  constructor(
    private supabase: SupabaseClient,
    private githubToken: string,
    private config: RAGConfig,
  ) {}

  /**
   * Retrieve context from vector DB using quiz/deck metadata
   */
  async retrieveContextByMetadata(
    quizId?: string,
    deckId?: string,
    questionText?: string,
  ): Promise<string> {
    // If no metadata provided, return empty context
    if (!quizId && !deckId) {
      Logger.info("No quiz/deck ID provided, skipping RAG retrieval");
      return "";
    }

    try {
      // If we have question text, use semantic search
      if (questionText) {
        Logger.info("Retrieving context using semantic search...");
        return await this.retrieveContextByQuery(
          questionText,
          quizId,
          deckId,
        );
      }

      // Otherwise, get all chunks for this quiz/deck
      Logger.info(
        `Retrieving all context for ${
          quizId ? `quiz: ${quizId}` : `deck: ${deckId}`
        }`,
      );
      return await this.retrieveAllContext(quizId, deckId);
    } catch (error) {
      Logger.error("RAG retrieval failed, continuing without context", error);
      return ""; // Graceful degradation
    }
  }

  /**
   * Retrieve context using semantic search
   */
  private async retrieveContextByQuery(
    query: string,
    quizId?: string,
    deckId?: string,
  ): Promise<string> {
    // Generate query embedding
    const embedding = await this.getEmbedding(query);

    // Build metadata filter
    const metadataFilter: Record<string, string> = {};
    if (quizId) metadataFilter.quiz_id = quizId;
    if (deckId) metadataFilter.deck_id = deckId;

    // Search vectors with metadata filter
    const { data: documents, error } = await this.supabase.rpc(
      "match_documents",
      {
        query_embedding: embedding,
        match_threshold: this.config.matchThreshold,
        match_count: this.config.matchCount,
        filter: metadataFilter,
      },
    );

    if (error) {
      Logger.error("Vector search error", error);
      throw error;
    }

    if (!documents || documents.length === 0) {
      Logger.info("No matching documents found");
      return "";
    }

    Logger.success(`Retrieved ${documents.length} relevant documents`);

    // Combine retrieved documents
    return documents
      .map((doc: { content: string; similarity: number }) =>
        `[Relevance: ${(doc.similarity * 100).toFixed(1)}%]\n${doc.content}`
      )
      .join("\n\n---\n\n");
  }

  /**
   * Retrieve all context for a quiz/deck (no semantic search)
   */
  private async retrieveAllContext(
    quizId?: string,
    deckId?: string,
  ): Promise<string> {
    const { data: documents, error } = await this.supabase
      .from("documents")
      .select("content")
      .or(
        quizId
          ? `metadata->>quiz_id.eq.${quizId}`
          : `metadata->>deck_id.eq.${deckId}`,
      )
      .limit(this.config.matchCount);

    if (error) {
      Logger.error("Document retrieval error", error);
      throw error;
    }

    if (!documents || documents.length === 0) {
      Logger.info("No documents found for this quiz/deck");
      return "";
    }

    Logger.success(`Retrieved ${documents.length} document chunks`);

    return documents.map((doc: { content: string }) => doc.content).join(
      "\n\n---\n\n",
    );
  }

  /**
   * Generate embedding for query
   */
  private async getEmbedding(text: string): Promise<number[]> {
    const response = await fetch(this.config.embeddingsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.embeddingModel,
        input: text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Embeddings API error: ${response.status} - ${
          JSON.stringify(errorData)
        }`,
      );
    }

    const data = await response.json();
    return data.data?.[0]?.embedding || [];
  }
}
