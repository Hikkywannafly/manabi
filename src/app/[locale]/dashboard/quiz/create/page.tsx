import type { Metadata } from "next";
import { CreateQuizForm } from "@/features/quiz/components/create-quiz-form";

export const metadata: Metadata = {
  title: "Generate Quiz | Manabi",
  description: "Create a new quiz from your study materials",
};

export default function CreateQuizPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Generate Quiz</h1>
        <p className="text-muted-foreground">
          Quickly create a new quiz from your study materials!
        </p>
      </div>
      <CreateQuizForm />
    </div>
  );
}
