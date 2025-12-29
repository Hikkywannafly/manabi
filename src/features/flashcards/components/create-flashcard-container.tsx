"use client";

import { useState } from "react";
import { DashboardPage } from "@/components/layouts";
import { CreateFlashcardForm } from "./create-flashcard-form";

export function CreateFlashcardContainer() {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <DashboardPage
      title={isGenerating ? undefined : "Generate Flashcards"}
      description={
        isGenerating
          ? undefined
          : "Create flashcards from your study materials to help with memorization!"
      }
    >
      <CreateFlashcardForm onGeneratingChange={setIsGenerating} />
    </DashboardPage>
  );
}
