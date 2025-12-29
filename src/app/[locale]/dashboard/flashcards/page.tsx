import type { Metadata } from "next";
import { DashboardPage } from "@/components/layouts";
import { FlashcardList } from "@/features/flashcards/components/flashcard-list";

export const metadata: Metadata = {
  title: "Flashcards | Manabi",
  description: "Manage your flashcard decks",
};

export default function FlashcardPage() {
  return (
    <DashboardPage>
      <FlashcardList />
    </DashboardPage>
  );
}
