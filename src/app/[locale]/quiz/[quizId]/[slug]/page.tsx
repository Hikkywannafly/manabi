import { notFound } from "next/navigation";
import { QuizTakeContent } from "@/features/quiz/components/take/quiz-take-content";
import { QuizService } from "@/features/quiz/services/quiz-service";
import { createClient } from "@/lib/supabase/server";

interface PublicQuizPageProps {
  params: Promise<{
    quizId: string;
    slug: string;
  }>;
}

export default async function PublicQuizPage({ params }: PublicQuizPageProps) {
  const { quizId, slug } = await params;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const quiz = await QuizService.getQuizWithQuestions(quizId);
    if (quiz.slug !== slug) {
      notFound();
    }
    if (quiz.visibility === "private") {
      // Add logic if needed, e.g. check if user claims ownership or just deny
      if (quiz.owner_id !== user?.id) {
        // handle private access denied
      }
    }

    return (
      <div className="flex h-screen w-full flex-col bg-background">
        <QuizTakeContent quiz={quiz} mode="test" userId={user?.id} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching quiz:", error);
    notFound();
  }
}
