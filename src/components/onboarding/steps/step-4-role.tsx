"use client";

import { CardOption } from "../card-option";
import { StepFooter } from "../step-footer";
import { StepLayout } from "../step-layout";
import { StepWrapper } from "../step-wrapper";

interface Step4RoleProps {
  isVisible: boolean;
  answers: Record<string, string>;
  onAnswer: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  loading?: boolean;
  direction?: "forward" | "backward";
}

export function Step4Role({
  isVisible,
  answers,
  onAnswer,
  onBack,
  onNext,
  onSkip,
  loading = false,
  direction = "forward",
}: Step4RoleProps) {
  const selectedRole = answers["role"] || "";

  const roles = [
    { label: "Student", icon: "🎓" },
    { label: "Teacher", icon: "👨‍🏫" },
    { label: "Tutor", icon: "📖" },
    { label: "Researcher", icon: "🔬" },
    { label: "Institution", icon: "🏫" },
    { label: "Mentor", icon: "🤝" },
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
        title="Who Are You?"
        subtitle="This helps us tailor Manabi to your needs."
        currentStep={4}
        totalSteps={5}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {roles.map((role) => (
            <CardOption
              key={role.label}
              label={role.label}
              icon={role.icon}
              isSelected={selectedRole === role.label}
              onClick={() => onAnswer(role.label)}
            />
          ))}
        </div>

        <StepFooter
          onBack={onBack}
          onNext={onNext}
          onSkip={onSkip}
          loading={loading}
          hasAnswer={!!selectedRole}
          showBack={true}
        />
      </StepLayout>
    </StepWrapper>
  );
}
