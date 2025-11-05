"use client";

import { useCallback, useState } from "react";
import { PageLayout } from "@/components/layouts";
import { StepFooter } from "./step-footer";
import { Step1Welcome } from "./steps/step-1-welcome";
import { Step2HowItWorks } from "./steps/step-2-how-it-works";
import { Step3Goal } from "./steps/step-3-goal";
import { Step4Role } from "./steps/step-4-role";
import { Step5Discovery } from "./steps/step-5-discovery";

interface OnboardingStepperProps {
  onComplete?: (answers: Record<string, string>) => void | Promise<void>;
  onSkip?: () => void | Promise<void>;
}

export function OnboardingStepper({
  onComplete,
  onSkip,
}: OnboardingStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNext = useCallback(() => {
    setDirection("forward");
    setCurrentStep((prev) => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    setDirection("backward");
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (onComplete) {
        await onComplete(answers);
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      if (onSkip) {
        await onSkip();
      }
    } catch (error) {
      console.error("Error skipping onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout variant="gradient" showHeader={false} showFooter={false}>
      <Step1Welcome
        isVisible={currentStep === 1}
        onNext={handleNext}
        onSkip={handleSkip}
        onBack={handleBack}
        loading={loading}
        direction={direction}
      />

      <Step2HowItWorks
        isVisible={currentStep === 2}
        answers={answers}
        onAnswer={(value) => handleAnswer("settings", value)}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        loading={loading}
        direction={direction}
      />

      <Step3Goal
        isVisible={currentStep === 3}
        answers={answers}
        onAnswer={(value) => handleAnswer("goal", value)}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        loading={loading}
        direction={direction}
      />

      <Step4Role
        isVisible={currentStep === 4}
        answers={answers}
        onAnswer={(value) => handleAnswer("role", value)}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        loading={loading}
        direction={direction}
      />

      <Step5Discovery
        isVisible={currentStep === 5}
        answers={answers}
        onAnswer={(value) => handleAnswer("source", value)}
        onBack={handleBack}
        onComplete={handleComplete}
        onSkip={handleSkip}
        loading={loading}
        direction={direction}
      />

      <StepFooter
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        loading={loading}
        hasAnswer={true}
        isLastStep={currentStep === 5}
        showBack={currentStep > 1}
      />
    </PageLayout>
  );
}
