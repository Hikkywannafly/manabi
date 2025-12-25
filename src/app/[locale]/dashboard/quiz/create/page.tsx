import type { Metadata } from "next";
import { CreateQuizContainer } from "@/features/quiz/components/create-quiz-container";

export const metadata: Metadata = {
  title: "Generate Quiz | Manabi",
  description: "Create a new quiz from your study materials",
};

export default function CreateQuizPage() {
  return <CreateQuizContainer />;
}
