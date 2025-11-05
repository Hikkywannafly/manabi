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
            index < currentStep
              ? "w-8 bg-primary"
              : index === currentStep
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/30",
          )}
          initial={false}
          animate={{
            width: index < currentStep ? 32 : index === currentStep ? 32 : 8,
            backgroundColor:
              index < currentStep
                ? "hsl(217, 91%, 60%)"
                : index === currentStep
                  ? "hsl(217, 91%, 60%)"
                  : "hsla(0, 0%, 0%, 0.3)",
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
