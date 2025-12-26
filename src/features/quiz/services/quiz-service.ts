import { createClient } from "@/lib/supabase/client";
import type { QuizCreationValues } from "../schema";
import type { Quiz, QuizQuestion, QuizWithQuestions } from "../types";

export const QuizService = {
  async getQuizzes() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quizzes")
      .select(
        "id, title, status, generation_params, created_at, slug, owner_id",
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Quiz[];
  },

  async getQuizWithQuestions(quizId: string): Promise<QuizWithQuestions> {
    const supabase = createClient();

    // Fetch quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    if (quizError) {
      throw quizError;
    }

    // Fetch questions
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_index", { ascending: true });

    if (questionsError) {
      throw questionsError;
    }

    return {
      ...quiz,
      questions: questions as QuizQuestion[],
    } as QuizWithQuestions;
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

  async submitQuizAttempt(
    quizId: string,
    userId: string,
    answers: Array<{
      questionId: string;
      selectedOptionIds: string[];
      timeSpent: number;
    }>,
    totalTimeSpent: number,
  ) {
    const supabase = createClient();

    // Calculate score
    const { data: questions } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId);

    if (!questions) {
      throw new Error("Questions not found");
    }

    let correctCount = 0;
    const answersLog = answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) {
        return { ...answer, isCorrect: false, correctOptionId: null };
      }

      const selectedId = answer.selectedOptionIds[0] || "";
      const correctId = question.correct_answer || "";
      let isCorrect = false;

      // Robust comparison logic matching client-side
      if (
        question.question_type === "fill_in_blank" ||
        question.question_type === "short_answer"
      ) {
        // Text-based: Case-insensitive trim check
        isCorrect =
          selectedId.trim().toLowerCase() === correctId.trim().toLowerCase();
      } else {
        // Choice-based: Normalize "0" to "option-0" if needed
        const normalizedCorrect = correctId.startsWith("option-")
          ? correctId
          : `option-${correctId}`;
        const normalizedSelected = selectedId.startsWith("option-")
          ? selectedId
          : selectedId; // Assuming client sends correct format, but good to keep in mind

        isCorrect = normalizedCorrect === normalizedSelected;
      }

      if (isCorrect) correctCount++;

      return {
        questionId: answer.questionId,
        selectedOptionId: selectedId,
        correctOptionId: correctId, // Store raw correct ID
        isCorrect,
        timeSpent: answer.timeSpent,
      };
    });

    const score = (correctCount / questions.length) * 100;

    const { data, error } = await supabase
      .from("quiz_attempts")
      .insert({
        quiz_id: quizId,
        user_id: userId,
        score,
        duration_seconds: totalTimeSpent,
        answers_log: answersLog,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      attemptId: data.id,
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: questions.length - correctCount,
      timeSpent: totalTimeSpent,
      answers: answersLog,
    };
  },

  async getQuizHistory(quizId: string) {
    const supabase = createClient();

    // 1. Fetch quiz info with specific fields
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id, title, slug, generation_params, created_at, status")
      .eq("id", quizId)
      .single();

    if (quizError) throw quizError;

    // 2. Fetch all attempts for this quiz
    const { data: attempts, error: attemptsError } = await supabase
      .from("quiz_attempts")
      .select("id, score, duration_seconds, completed_at, answers_log")
      .eq("quiz_id", quizId)
      .order("completed_at", { ascending: false });

    if (attemptsError) throw attemptsError;

    return {
      quiz: quiz as Quiz,
      attempts: attempts || [],
    };
  },
};
