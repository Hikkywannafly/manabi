"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            index + 1 < currentStep
              ? "w-8 bg-primary"
              : index + 1 === currentStep
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/30",
          )}
          initial={false}
        />
      ))}
    </div>
  );
}
