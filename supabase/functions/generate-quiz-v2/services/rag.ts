/**
 * RAG Service - Handles embedding, vector storage, and retrieval
 * Uses GitHub Models API Embeddings and Supabase Vector Store
 */

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseClient } from "@supabase/supabase-js";
import { AI_CONFIG, DATABASE_CONFIG, ERROR_MESSAGES } from "../config.ts";
import { Logger } from "../utils/logger.ts";
import type { DocumentChunk, VectorDocument } from "../types.ts";

export class RagService {
  constructor(
    private supabase: SupabaseClient,
    private githubToken: string,
  ) {}

  private async getEmbedding(
    text: string,
    retries = 3,
  ): Promise<number[]> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(AI_CONFIG.embeddingsUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: AI_CONFIG.embeddingModel,
            input: text,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // If rate limited (429), retry with exponential backoff
          if (response.status === 429 && attempt < retries) {
            const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            Logger.info(
              `Rate limited, retrying in ${
                delay / 1000
              }s (attempt ${attempt}/${retries})...`,
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }

          throw new Error(
            `GitHub Models Embeddings API error: ${response.status} - ${
              JSON.stringify(errorData)
            }`,
          );
        }

        const data = await response.json();
        return data.data?.[0]?.embedding || [];
      } catch (error) {
        if (attempt === retries) throw error;
        Logger.error(`Embedding attempt ${attempt} failed`, error);
      }
    }

    throw new Error("Failed to get embedding after retries");
  }

  async processAndStore(
    text: string,
    metadata: Record<string, unknown>,
  ): Promise<number> {
    Logger.step(3, "Processing content for RAG");

    // 1. Split text into chunks
    Logger.info("Splitting text into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks =
      (await splitter.createDocuments([text], [metadata])) as DocumentChunk[];
    Logger.success(`Created ${chunks.length} chunks`);

    // 2. Embed & Store in batches
    Logger.step(4, "Generating embeddings and storing vectors");

    const batchSize = DATABASE_CONFIG.batchSize;
    let storedCount = 0;

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(chunks.length / batchSize);

      Logger.brain(`Embedding batch ${batchNum}/${totalBatches}...`);

      try {
        // Generate embeddings sequentially to avoid rate limits
        const embeddingsResults: number[][] = [];
        const successfulChunks: DocumentChunk[] = [];
        let rateLimitHit = false;

        for (let j = 0; j < batch.length; j++) {
          const chunk = batch[j];
          Logger.info(
            `Embedding chunk ${j + 1}/${batch.length} in batch ${batchNum}...`,
          );

          try {
            const embedding = await this.getEmbedding(chunk.pageContent);
            embeddingsResults.push(embedding);
            successfulChunks.push(chunk);

            // Add small delay between requests to avoid rate limiting
            if (j < batch.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
            }
          } catch (chunkError) {
            const errorMessage = chunkError instanceof Error
              ? chunkError.message
              : String(chunkError);

            // If rate limited, save what we have so far and stop
            if (errorMessage.includes("429")) {
              Logger.error(
                `Rate limit hit at chunk ${
                  j + 1
                }/${batch.length} in batch ${batchNum}`,
                chunkError,
              );
              rateLimitHit = true;
              break; // Exit chunk loop, save partial batch
            }

            // For other errors, rethrow
            throw chunkError;
          }
        }

        // Save successfully embedded chunks (even if partial)
        if (successfulChunks.length > 0) {
          const rows: VectorDocument[] = successfulChunks.map((
            chunk: DocumentChunk,
            idx: number,
          ) => ({
            content: chunk.pageContent,
            metadata: chunk.metadata,
            embedding: embeddingsResults[idx],
          }));

          // Insert into Supabase
          const { error } = await this.supabase
            .from(DATABASE_CONFIG.tables.documents)
            .insert(rows);

          if (error) {
            Logger.error(`Batch ${batchNum} insert error`, error);
            throw new Error(ERROR_MESSAGES.databaseInsertFailed(error.message));
          }

          storedCount += successfulChunks.length;
          Logger.success(
            `Stored ${successfulChunks.length}/${batch.length} chunks from batch ${batchNum} (total: ${storedCount}/${chunks.length})`,
          );
        }

        // If rate limited, stop processing more batches
        if (rateLimitHit) {
          Logger.info(
            `Successfully stored ${storedCount} chunks before rate limit. Continuing without remaining embeddings...`,
          );
          break; // Exit batch loop
        }
      } catch (error) {
        // For other errors, still throw
        Logger.error(`Batch ${batchNum} failed`, error);
        throw error;
      }
    }

    if (storedCount === 0) {
      Logger.info(
        "No chunks were embedded (rate limited immediately). Will use full text for generation.",
      );
    } else {
      Logger.celebrate(
        `Stored ${storedCount}/${chunks.length} chunks in vector DB!`,
      );
    }
    return storedCount;
  }

  async retrieveContext(query: string, limit = 10): Promise<string> {
    Logger.step(5, "Retrieving relevant context");
    Logger.search(`Query: "${query.substring(0, 100)}..."`);

    // Generate query embedding using GitHub Models API
    let embedding: number[];
    try {
      embedding = await this.getEmbedding(query);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);

      // If rate limited, skip retrieval and return empty (will use full text)
      if (errorMessage.includes("429")) {
        Logger.error(
          "Rate limited during retrieval. Skipping vector search.",
          error,
        );
        return ""; // Caller will use full extracted text as fallback
      }

      throw error;
    }

    Logger.info("Query embedding generated, searching vectors...");

    // Search Supabase using vector similarity
    const { data: documents, error } = await this.supabase.rpc(
      "match_documents",
      {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit,
      },
    );

    if (error) {
      Logger.error("Vector search error", error);
      throw new Error(ERROR_MESSAGES.embeddingFailed(error.message));
    }

    if (!documents || documents.length === 0) {
      Logger.info("No matching documents found, using full context");
      return "";
    }

    Logger.success(`Retrieved ${documents.length} relevant documents`);

    // Combine retrieved documents into context
    const context = documents
      .map((doc: { content: string; similarity: number }) =>
        `[Relevance: ${(doc.similarity * 100).toFixed(1)}%]\n${doc.content}`
      )
      .join("\n\n---\n\n");

    return context;
  }
}
