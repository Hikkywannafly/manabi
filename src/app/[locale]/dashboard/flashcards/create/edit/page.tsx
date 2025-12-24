import { DashboardPage } from "@/components/layouts";
import { FlashcardEditPage } from "@/features/flashcards/components/edit/flashcard-edit-page";

export default function EditFlashcardsPage() {
  return (
    <DashboardPage
      title="Edit Flashcard Deck"
      description="Review and edit your AI-generated flashcards"
    >
      <FlashcardEditPage />
    </DashboardPage>
  );
}
