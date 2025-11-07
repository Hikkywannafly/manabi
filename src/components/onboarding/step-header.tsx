"use client";

import { Logo } from "@/components/logo";
import { StepIndicator } from "./step-indicator";

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title?: string;
}

export function StepHeader({ currentStep, totalSteps }: StepHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
        <Logo />
        <StepIndicator totalSteps={totalSteps} currentStep={currentStep} />
        <p className="text-foreground text-md">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </header>
  );
}
