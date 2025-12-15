"use client";

import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FlashcardCreator } from "@/features/flashcards/components/create/flashcard-creator";
import { Link } from "@/i18n/routing";

export default function FlashcardCreatePage() {
  return (
    <DashboardLayout
      title="Create Flashcard"
      description="Create new flashcards or generate them using AI."
      actions={
        <Link href="/dashboard/flashcards">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Flashcards
          </Button>
        </Link>
      }
    >
      <FlashcardCreator />
    </DashboardLayout>
  );
}
