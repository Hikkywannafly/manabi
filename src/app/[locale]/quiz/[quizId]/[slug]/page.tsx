import { notFound } from "next/navigation";
import { QuizTakeContent } from "@/features/quiz/components/take/quiz-take-content";
import { QuizService } from "@/features/quiz/services/quiz-service";

interface PublicQuizPageProps {
  params: Promise<{
    quizId: string;
    slug: string;
  }>;
}

export default async function PublicQuizPage({ params }: PublicQuizPageProps) {
  const { quizId, slug } = await params;

  try {
    const quiz = await QuizService.getQuizWithQuestions(quizId);

    // Verify slug matches (optional but good for SEO/correctness)
    if (quiz.slug !== slug) {
      notFound();
    }

    // Check visibility
    if (quiz.visibility === "private") {
      // We might want to allow access if the user is the owner, but this page is public route.
      // For now, if it's private, we can show a generic 404 or a "Private Quiz" message.
      // However, the dashboard route handles private quizzes for owners.
      // This public route is specifically for sharing.
      // If we want "Unlisted" behavior (accessible via link), then "private" setting might need clarification.
      // BUT, the requirement says "users can view private quizzes if they have a direct link".
      // So we should ALLOW access here, effectively treating "private" as "unlisted" for this route?
      // OR, does "Private" mean ONLY me?
      // The prompt said: "Ensure that users can view private quizzes if they have a direct link."
      // So we render it.
    }

    return (
      <div className="flex h-screen w-full flex-col bg-background">
        <QuizTakeContent quiz={quiz} mode="test" />
      </div>
    );
  } catch (error) {
    console.error("Error fetching quiz:", error);
    notFound();
  }
}
