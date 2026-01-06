import { FlashcardViewPage } from "@/features/flashcards/components/view/flashcard-view-page";
import { createClient } from "@/lib/supabase/server";

export default async function ViewFlashcardDeckPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <FlashcardViewPage deckId={id} userId={user?.id} />;
}
