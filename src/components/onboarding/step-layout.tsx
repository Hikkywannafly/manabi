"use client";

import type React from "react";
import { StepIndicator } from "./step-indicator";

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showIndicator?: boolean;
}

export function StepLayout({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  showIndicator = true,
}: StepLayoutProps) {
  return (
    <div className="flex flex-col justify-center pb-24">
      <div className="relative mb-16 flex items-center justify-between">
        {/* Back button placeholder - handled by parent */}
        <div className="flex-1" />

        {/* Step Indicator - centered */}
        {showIndicator && (
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
            <StepIndicator totalSteps={totalSteps} currentStep={currentStep} />
          </div>
        )}

        {/* Step counter - right side */}
        <div className="text-muted-foreground text-sm">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
}
