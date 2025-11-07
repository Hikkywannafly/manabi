"use client";

import { CardOption } from "../card-option";
import { StepLayout } from "../step-layout";
import { StepWrapper } from "../step-wrapper";

interface DiscoveryProps {
  isVisible: boolean;
  answers: Record<string, string>;
  onAnswer: (value: string) => void;
  onBack: () => void;
  onComplete: () => void;
  onSkip: () => void;
  loading?: boolean;
  direction?: "forward" | "backward";
}

export function Discovery({
  isVisible,
  answers,
  onAnswer,
  onBack,
  loading = false,
  direction = "forward",
}: DiscoveryProps) {
  const selectedSource = answers["source"] || "";

  const sources = [
    { label: "Google" },
    { label: "YouTube" },
    { label: "TikTok" },
    { label: "ChatGPT" },
    { label: "Friend" },
    { label: "Other" },
  ];

  return (
    <StepWrapper
      isVisible={isVisible}
      direction={direction}
      onBack={onBack}
      showBackButton={true}
      isLoading={loading}
    >
      <StepLayout
        title="How Did You Find Manabi?"
        subtitle="Help us understand how people discover Manabi."
        currentStep={5}
        totalSteps={5}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <CardOption
              key={source.label}
              label={source.label}
              // icon={source.icon}
              isSelected={selectedSource === source.label}
              onClick={() => onAnswer(source.label)}
            />
          ))}
        </div>
      </StepLayout>
    </StepWrapper>
  );
}
