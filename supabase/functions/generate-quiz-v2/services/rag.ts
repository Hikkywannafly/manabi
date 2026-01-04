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

  private async getEmbedding(text: string): Promise<number[]> {
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
      throw new Error(
        `GitHub Models Embeddings API error: ${response.status} - ${
          JSON.stringify(errorData)
        }`,
      );
    }

    const data = await response.json();
    return data.data?.[0]?.embedding || [];
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
        // Generate embeddings for batch using GitHub Models API
        const embeddingsResults = await Promise.all(
          batch.map((chunk: DocumentChunk) =>
            this.getEmbedding(chunk.pageContent)
          ),
        );

        // Prepare rows for insertion
        const rows: VectorDocument[] = batch.map((
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

        storedCount += batch.length;
        Logger.success(
          `Stored batch ${batchNum}/${totalBatches} (${storedCount}/${chunks.length} chunks)`,
        );
      } catch (error) {
        Logger.error(`Batch ${batchNum} failed`, error);
        throw error;
      }
    }

    Logger.celebrate(`All ${storedCount} chunks stored in vector DB!`);
    return storedCount;
  }

  async retrieveContext(query: string, limit = 10): Promise<string> {
    Logger.step(5, "Retrieving relevant context");
    Logger.search(`Query: "${query.substring(0, 100)}..."`);

    // Generate query embedding using GitHub Models API
    const embedding = await this.getEmbedding(query);

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
