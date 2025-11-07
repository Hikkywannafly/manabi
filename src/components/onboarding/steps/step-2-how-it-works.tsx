"use client";

import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { CardOption } from "../card-option";
import { StepFooter } from "../step-footer";
import { StepLayout } from "../step-layout";
import { StepWrapper } from "../step-wrapper";

interface Step2HowItWorksProps {
  isVisible: boolean;
  answers: Record<string, string>;
  onAnswer: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  loading?: boolean;
  direction?: "forward" | "backward";
}

export function Step2HowItWorks({
  isVisible,
  answers,
  onAnswer,
  onBack,
  onNext,
  onSkip,
  loading = false,
  direction = "forward",
}: Step2HowItWorksProps) {
  const selectedSettings = answers["settings"] || "";

  return (
    <StepWrapper
      isVisible={isVisible}
      direction={direction}
      onBack={onBack}
      showBackButton={true}
      isLoading={loading}
    >
      <StepLayout
        title="How Manabi Works"
        subtitle="Transform your notes into interactive learning experiences in 3 steps."
        currentStep={2}
        totalSteps={5}
      >
        <div className="space-y-6">
          {/* Upload Section */}

          <Label className="font-semibold text-muted-foreground text-xs uppercase">
            Upload Your Materials
          </Label>
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-input border-dashed bg-muted/30 px-4 py-6 transition-all hover:border-primary/50">
            <Upload className="h-6 w-6 text-primary" />
            <div className="text-center">
              <p className="font-semibold text-xs">Drag & drop your files</p>
              <p className="text-muted-foreground text-xs">
                PDF, Word, Image, or Text
              </p>
            </div>
          </div>

          {/* Settings Options */}

          <Label className="font-semibold text-muted-foreground text-xs uppercase">
            Choose Your Settings
          </Label>
          <div className="space-y-3">
            <CardOption
              label="Flashcard Settings"
              isSelected={selectedSettings === "flashcard"}
              onClick={() => onAnswer("flashcard")}
              icon="🎯"
            />
            <CardOption
              label="Quiz Settings"
              isSelected={selectedSettings === "quiz"}
              onClick={() => onAnswer("quiz")}
              icon="📝"
            />
          </div>

          <StepFooter
            onBack={onBack}
            onNext={onNext}
            onSkip={onSkip}
            loading={loading}
            hasAnswer={!!selectedSettings}
            showBack={true}
          />
        </div>
      </StepLayout>
    </StepWrapper>
  );
}
