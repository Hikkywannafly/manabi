import { DashboardPage } from "@/components/layouts";
import { CreateCollectionForm } from "@/features/collections/components/create-collection-form";

export default function NewCollectionPage() {
  return (
    <DashboardPage
      title="Create Collection"
      description="Give your collection a name and add quizzes or flashcard sets to organize your studies."
    >
      <CreateCollectionForm />
    </DashboardPage>
  );
}
