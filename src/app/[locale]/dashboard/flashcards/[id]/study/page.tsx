import { use } from "react";
import { FlashcardStudyMode } from "@/features/flashcards/components/study/flashcard-study-mode";

export default function StudyFlashcardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <FlashcardStudyMode deckId={id} />;
}
