import type { Metadata } from "next";
import { QuizList } from "@/features/quiz/components/quiz-list";

export const metadata: Metadata = {
  title: "Quizzes | Manabi",
  description: "Manage your study quizzes",
};

export default function QuizPage() {
  return (
    <div className="container mx-auto max-w-7xl py-8">
      <QuizList />
    </div>
  );
}
