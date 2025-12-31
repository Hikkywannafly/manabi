import { redirect } from "next/navigation";
import { DashboardPage } from "@/components/layouts";
import { QuizEditContainer } from "@/features/quiz/components/edit/quiz-edit-container";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ quizId: string; locale: string }>;
}

export default async function QuizEditPage({ params }: PageProps) {
  const { quizId } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // Fetch quiz with questions
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    redirect("/dashboard/quiz");
  }

  // Check ownership
  if (quiz.owner_id !== user.id) {
    redirect("/dashboard/quiz");
  }

  // Fetch questions
  const { data: questions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });

  if (questionsError) {
    redirect("/dashboard/quiz");
  }

  return (
    <DashboardPage title="Edit quiz">
      <QuizEditContainer quiz={quiz} questions={questions || []} />
    </DashboardPage>
  );
}
