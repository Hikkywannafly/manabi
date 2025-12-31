import { DashboardPage } from "@/components/layouts";
import { CollectionListContent } from "@/features/collections/components/collection-list-content";

export default function CollectionsPage() {
  return (
    <DashboardPage
      title="Collections"
      description="Organize your quizzes and flashcards into themed collections."
    >
      <CollectionListContent />
    </DashboardPage>
  );
}
