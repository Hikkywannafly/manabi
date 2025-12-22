import { FlashcardViewPage } from "@/features/flashcards/components/view/flashcard-view-page";

export default function ViewFlashcardDeckPage({
  params,
}: {
  params: { id: string };
}) {
  return <FlashcardViewPage deckId={params.id} />;
}
