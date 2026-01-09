"use client";

import { Progress } from "@/components/ui/progress";
import { LoadingCardGrid } from "./loading-card-grid";

interface FlashcardLoadingProps {
  progress: number;
  status: string;
}

export function FlashcardLoading({ progress, status }: FlashcardLoadingProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-xl space-y-4">
        <Progress value={progress} className="h-2 w-full" />
        <div className="text-center">
          <p className="font-medium text-lg">
            {status || "Analyzing your study materials..."}
          </p>
          <p className="text-muted-foreground text-sm">
            {Math.round(progress)}% complete
          </p>
          <p className="mt-2 text-muted-foreground text-sm italic">
            Save frequently used materials to speed up future generations
          </p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-md">
        <LoadingCardGrid />
      </div>
    </div>
  );
}
