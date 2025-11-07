"use client";

import type React from "react";

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showIndicator?: boolean;
}

export function StepLayout({ title, subtitle, children }: StepLayoutProps) {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="font-bold text-2xl sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
