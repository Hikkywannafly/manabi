import type { Metadata } from "next";
import { DashboardPage } from "@/components/layouts";
import { CreateQuizForm } from "@/features/quiz/components/create-quiz-form";

export const metadata: Metadata = {
  title: "Generate Quiz | Manabi",
  description: "Create a new quiz from your study materials",
};

export default function CreateQuizPage() {
  return (
    <DashboardPage
      title="Generate Quiz"
      description="Quickly create a new quiz from your study materials!"
    >
      <CreateQuizForm />
    </DashboardPage>
  );
}
