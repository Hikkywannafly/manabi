import { FlashcardStudyMode } from "@/features/flashcards/components/study/flashcard-study-mode";

export default function StudyFlashcardPage({
  params,
}: {
  params: { id: string };
}) {
  return <FlashcardStudyMode deckId={params.id} />;
}
