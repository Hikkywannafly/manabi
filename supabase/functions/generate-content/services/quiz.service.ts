import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { DATABASE_CONFIG, ERROR_MESSAGES } from "../config.ts";
import type { QuestionData, QuizQuestion, QuizStatus } from "../types.ts";
import { Logger } from "../utils/logger.ts";

export class QuizService {
  constructor(private supabase: SupabaseClient) {}

  async saveQuestions(
    quizId: string,
    questions: QuestionData[],
  ): Promise<void> {
    Logger.step(3, "Saving questions to database");

    const questionsToInsert: QuizQuestion[] = questions.map((q, index) => ({
      quiz_id: quizId,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options ? JSON.stringify(q.options) : null,
      correct_answer: String(q.correct_answer),
      explanation: q.explanation,
      order_index: index,
    }));

    const { error } = await this.supabase
      .from(DATABASE_CONFIG.tables.questions)
      .insert(questionsToInsert);

    if (error) {
      throw new Error(ERROR_MESSAGES.databaseInsertFailed(error.message));
    }

    Logger.success(`Inserted ${questionsToInsert.length} questions`);
  }

  async updateQuizMetadata(quizId: string, title: string): Promise<string> {
    const slug = this.generateSlug(title);
    Logger.info(`Updating quiz metadata: ${title} -> ${slug}`);

    const { error } = await this.supabase
      .from(DATABASE_CONFIG.tables.quizzes)
      .update({
        title,
        slug,
      })
      .eq("id", quizId);

    if (error) {
      Logger.error("Failed to update quiz metadata", error);
    }
    return slug;
  }

  async updateStatus(quizId: string, status: QuizStatus): Promise<void> {
    Logger.info(`Updating quiz status to: ${status}`);

    const { error } = await this.supabase
      .from(DATABASE_CONFIG.tables.quizzes)
      .update({
        status,
      })
      .eq("id", quizId);

    if (error) {
      Logger.error("Failed to update quiz status", error);
      // Don't throw - this is a non-critical operation
    } else {
      Logger.success(`Quiz status updated to: ${status}`);
    }
  }

  private generateSlug(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start
      .replace(/-+$/, ""); // Trim - from end
  }
}
