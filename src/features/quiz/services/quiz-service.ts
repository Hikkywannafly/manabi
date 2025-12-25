import { createClient } from "@/lib/supabase/client";
import type { QuizCreationValues } from "../schema";
import type { Quiz } from "../types";

export const QuizService = {
  async getQuizzes() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Quiz[];
  },

  async createQuiz(
    user_id: string,
    title: string,
    sourceType: "file" | "text",
    sourceContent: string,
    values: QuizCreationValues,
  ) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quizzes")
      .insert({
        owner_id: user_id,
        title: title,
        status: "generating",
        source_type: sourceType,
        source_content: sourceContent,
        generation_params: values,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Quiz;
  },
};
