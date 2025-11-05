"use client";

import { CardOption } from "../card-option";
import { StepFooter } from "../step-footer";
import { StepLayout } from "../step-layout";
import { StepWrapper } from "../step-wrapper";

interface Step3GoalProps {
  isVisible: boolean;
  answers: Record<string, string>;
  onAnswer: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  loading?: boolean;
  direction?: "forward" | "backward";
}

export function Step3Goal({
  isVisible,
  answers,
  onAnswer,
  onBack,
  onNext,
  onSkip,
  loading = false,
  direction = "forward",
}: Step3GoalProps) {
  const selectedGoal = answers["goal"] || "";

  const goals = [
    { label: "Exam Prep", icon: "📚" },
    { label: "Daily Study", icon: "📅" },
    { label: "Language Learning", icon: "🌍" },
    { label: "Knowledge Review", icon: "🔄" },
    { label: "Skill Improvement", icon: "⚡" },
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
        title="What's Your Main Goal?"
        subtitle="Help us personalize your learning experience."
        currentStep={3}
        totalSteps={5}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {goals.map((goal) => (
            <CardOption
              key={goal.label}
              label={goal.label}
              icon={goal.icon}
              isSelected={selectedGoal === goal.label}
              onClick={() => onAnswer(goal.label)}
            />
          ))}
        </div>

        <StepFooter
          onBack={onBack}
          onNext={onNext}
          onSkip={onSkip}
          loading={loading}
          hasAnswer={!!selectedGoal}
          showBack={true}
        />
      </StepLayout>
    </StepWrapper>
  );
}
