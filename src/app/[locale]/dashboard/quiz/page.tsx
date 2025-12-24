import type { Metadata } from "next";
import { DashboardPage } from "@/components/layouts";
import { QuizList } from "@/features/quiz/components/quiz-list";

export const metadata: Metadata = {
  title: "Quizzes | Manabi",
  description: "Manage your study quizzes",
};

export default function QuizPage() {
  return (
    <DashboardPage title="Quizzes" description="Manage your study quizzes">
      <QuizList />
    </DashboardPage>
  );
}
