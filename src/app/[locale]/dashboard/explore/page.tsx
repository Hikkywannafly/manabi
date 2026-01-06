import { ExploreView } from "@/features/explore/components/explore-view";
import { FlashcardService } from "@/features/flashcards/services/flashcard-service";
import { QuizService } from "@/features/quiz/services/quiz-service";

export const metadata = {
  title: "Explore | Manabi",
  description: "Explore quizzes and flashcards made by other students.",
};

import { DashboardPage } from "@/components/layouts";

export default async function ExplorePage() {
  const [quizzes, decks] = await Promise.all([
    QuizService.getPublicQuizzes(),
    FlashcardService.getPublicDecks(),
  ]);

  return (
    <DashboardPage
      title="Explore"
      description="Explore quizzes and flashcards made by other students."
    >
      <ExploreView quizzes={quizzes || []} decks={decks || []} />
    </DashboardPage>
  );
}
