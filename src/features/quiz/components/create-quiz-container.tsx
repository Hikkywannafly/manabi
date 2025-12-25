"use client";

import { useState } from "react";
import { DashboardPage } from "@/components/layouts";
import { CreateQuizForm } from "./create-quiz-form";

export function CreateQuizContainer() {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <DashboardPage
      title={isGenerating ? undefined : "Generate Quiz"}
      description={
        isGenerating
          ? undefined
          : "Quickly create a new quiz from your study materials!"
      }
    >
      <CreateQuizForm onGeneratingChange={setIsGenerating} />
    </DashboardPage>
  );
}
