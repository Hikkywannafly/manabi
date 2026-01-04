import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { Logger } from "./logger.ts";

export class ProgressTracker {
  constructor(
    private supabase: SupabaseClient,
    private quizId: string,
  ) {}

  async update(percent: number, message: string): Promise<void> {
    try {
      // Update quiz status in database
      await this.supabase
        .from("quizzes")
        .update({
          processing_progress: percent,
          processing_message: message,
        })
        .eq("id", this.quizId);

      // Broadcast realtime progress for UI
      const channel = this.supabase.channel(`quiz:${this.quizId}`);
      await channel.send({
        type: "broadcast",
        event: "progress",
        payload: { progress: percent, message },
      });

      Logger.info(`Progress: ${percent}% - ${message}`);
    } catch (error) {
      Logger.error("Failed to update progress", error);
      // Don't throw - progress updates shouldn't break the main flow
    }
  }
}
