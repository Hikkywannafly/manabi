import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { FlashcardEditPage } from "@/features/flashcards/components/edit/flashcard-edit-page";

export default function EditFlashcardsPage() {
  return (
    <DashboardLayout
      title="Edit Flashcard Deck"
      description="Review and edit your AI-generated flashcards"
    >
      <FlashcardEditPage />
    </DashboardLayout>
  );
}
