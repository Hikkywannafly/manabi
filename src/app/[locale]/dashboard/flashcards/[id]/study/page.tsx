import { use } from "react";
import { FlashcardViewPage } from "@/features/flashcards/components/view/flashcard-view-page";

export default function StudyFlashcardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <FlashcardViewPage deckId={id} />;
}
