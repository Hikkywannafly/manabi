import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { DATABASE_CONFIG } from "../config.ts";
import type { GenerationParams } from "../types.ts";
import { Logger } from "./logger.ts";

export class ProgressTracker {
  constructor(
    private supabase: SupabaseClient,
    private quizId: string,
    public generationParams?: GenerationParams,
  ) {}

  async update(
    percentage: number,
    message: string,
    data?: unknown,
  ): Promise<void> {
    try {
      // Update database with persistent progress
      await this.supabase
        .from(DATABASE_CONFIG.tables.quizzes)
        .update({
          generation_params: {
            ...this.generationParams,
            progress: percentage,
            step: message,
          },
        })
        .eq("id", this.quizId);

      // Broadcast realtime progress for UI
      const channel = this.supabase.channel(`quiz:${this.quizId}`);
      await channel.send({
        type: "broadcast",
        event: "progress",
        payload: { progress: percentage, message, data },
      });

      Logger.info(`Progress: ${percentage}% - ${message}`);
    } catch (error) {
      Logger.error("Failed to update progress", error);
      // Don't throw - progress updates shouldn't break the main flow
    }
  }
}
