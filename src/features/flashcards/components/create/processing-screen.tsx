"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface ProcessingScreenProps {
  fileName: string;
  label?: string;
  isDone: boolean;
}

export function ProcessingScreen({
  fileName,
  label,
  isDone,
}: ProcessingScreenProps) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (isDone) {
      setShowCheck(true);
    }
  }, [isDone]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        {/* Animated spinner or checkmark */}
        {!isDone ? (
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        ) : (
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full bg-green-500 transition-all duration-300 ${
              showCheck ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <Check className="h-8 w-8 text-white" />
          </div>
        )}
      </div>

      <div className="text-center">
        <h2 className="font-semibold text-2xl">
          {isDone ? "Complete!" : label || "Processing..."}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {isDone ? "Your flashcards are ready" : `Processing ${fileName}`}
        </p>
      </div>
    </div>
  );
}
