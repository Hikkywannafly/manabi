import { createClient } from "@/lib/supabase/client";
import type { QuizCreationValues } from "../schema";
import type { Quiz, QuizQuestion, QuizWithQuestions } from "../types";

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
      const isCorrect =
        question?.correct_answer === answer.selectedOptionIds[0];
      if (isCorrect) correctCount++;

      return {
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionIds[0],
        correctOptionId: question?.correct_answer,
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
};
