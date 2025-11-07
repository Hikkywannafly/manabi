"use client";

import { CardOption } from "../card-option";
import { StepLayout } from "../step-layout";
import { StepWrapper } from "../step-wrapper";

interface Step5DiscoveryProps {
  isVisible: boolean;
  answers: Record<string, string>;
  onAnswer: (value: string) => void;
  onBack: () => void;
  onComplete: () => void;
  onSkip: () => void;
  loading?: boolean;
  direction?: "forward" | "backward";
}

export function Step5Discovery({
  isVisible,
  answers,
  onAnswer,
  onBack,
  onComplete,
  onSkip,
  loading = false,
  direction = "forward",
}: Step5DiscoveryProps) {
  const selectedSource = answers["source"] || "";

  const sources = [
    { label: "Google", icon: "🔍" },
    { label: "YouTube", icon: "▶️" },
    { label: "TikTok", icon: "🎵" },
    { label: "ChatGPT", icon: "🤖" },
    { label: "Friend", icon: "👥" },
    { label: "Other", icon: "✨" },
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
              icon={source.icon}
              isSelected={selectedSource === source.label}
              onClick={() => onAnswer(source.label)}
            />
          ))}
        </div>
      </StepLayout>
    </StepWrapper>
  );
}
