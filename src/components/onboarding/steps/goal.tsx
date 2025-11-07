"use client";

import { CardOption } from "../card-option";
import { StepLayout } from "../step-layout";
import { StepWrapper } from "../step-wrapper";

interface GoalProps {
  isVisible: boolean;
  answers: Record<string, string>;
  onAnswer: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  loading?: boolean;
  direction?: "forward" | "backward";
}

export function Goal({
  isVisible,
  answers,
  onAnswer,
  onBack,
  loading = false,
  direction = "forward",
}: GoalProps) {
  const selectedGoal = answers["goal"] || "";

  const goals = [
    { label: "Exam Prep" },
    { label: "Daily Study" },
    { label: "Language Learning" },
    { label: "Knowledge Review" },
    { label: "Skill Improvement" },
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
              // icon={goal.icon}
              isSelected={selectedGoal === goal.label}
              onClick={() => onAnswer(goal.label)}
            />
          ))}
        </div>
      </StepLayout>
    </StepWrapper>
  );
}
