import type { Metadata } from "next";
import { CreateFlashcardContainer } from "@/features/flashcards/components/create-flashcard-container";

export const metadata: Metadata = {
  title: "Generate Flashcards | Manabi",
  description: "Create new flashcards from your study materials",
};

export default function FlashcardCreatePage() {
  return <CreateFlashcardContainer />;
}
