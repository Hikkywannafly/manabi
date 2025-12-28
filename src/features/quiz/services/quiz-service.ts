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
        return {
          questionId: answer.questionId,
          questionText: "Unknown Question",
          selectedOptionId: "",
          correctOptionId: "",
          isCorrect: false,
          timeSpent: answer.timeSpent,
          options: [],
        };
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
          : selectedId;

        isCorrect = normalizedCorrect === normalizedSelected;
      }

      if (isCorrect) correctCount++;

      // Provide options for the result view
      let options: any[] = [];
      try {
        const rawOptions =
          typeof question.options === "string"
            ? JSON.parse(question.options)
            : question.options;

        if (Array.isArray(rawOptions)) {
          if (typeof rawOptions[0] === "string") {
            options = rawOptions.map((text, idx) => ({
              id: `option-${idx}`,
              text,
            }));
          } else {
            options = rawOptions;
          }
        }
      } catch (e) {
        console.error("Error parsing options for result:", e);
      }

      return {
        questionId: answer.questionId,
        questionText: question.question_text || "",
        selectedOptionId: selectedId,
        correctOptionId: correctId, // Store raw correct ID
        isCorrect,
        timeSpent: answer.timeSpent,
        options,
      };
    });

    const score = (correctCount / questions.length) * 100;

    // Use a lighter version of answers log for DB to save space if needed,
    // but strict typing suggests we might want to store it all if the DB column type is JSONB.
    // For now, we store the detailed log to enable full history review.

    // We need to strip 'options' and 'questionText' if we want to save space in DB,
    // but the UI 'QuizHistory' likely relies on fetching this from questions table again
    // OR we store it in attempt. Let's store a simplified version in DB and return the FULL version to the client.

    const dbAnswersLog = answersLog.map((a) => ({
      questionId: a.questionId,
      selectedOptionId: a.selectedOptionId,
      correctOptionId: a.correctOptionId,
      isCorrect: a.isCorrect,
      timeSpent: a.timeSpent,
    }));

    const { data, error } = await supabase
      .from("quiz_attempts")
      .insert({
        quiz_id: quizId,
        user_id: userId,
        score,
        duration_seconds: totalTimeSpent,
        answers_log: dbAnswersLog,
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
      answers: answersLog, // Return the full log including options/text for immediate display
      performanceLevel: "Learning", // Fallback, will be recalculated/overwritten by client helper
      personalizedFeedback: "",
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
      .select("*")
      .eq("quiz_id", quizId)
      .order("completed_at", { ascending: false });

    if (attemptsError) throw attemptsError;

    return {
      quiz: quiz as Quiz,
      attempts: attempts || [],
    };
  },
};
