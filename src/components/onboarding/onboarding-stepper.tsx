"use client";

import { useCallback, useState } from "react";
import { PageLayout } from "@/components/layouts";
import { StepFooter } from "./step-footer";
import { StepHeader } from "./step-header";
import { Discovery, Goal, HowItWorks, Nickname, Role, Welcome } from "./steps";

interface OnboardingStepperProps {
  onComplete?: (answers: Record<string, string>) => void | Promise<void>;
  onSkip?: () => void | Promise<void>;
  googleName?: string;
}

export function OnboardingStepper({
  onComplete,
  onSkip,
  googleName,
}: OnboardingStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [nickname, setNickname] = useState<string>("");

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
        const finalAnswers = { ...answers, nickname };
        await onComplete(finalAnswers);
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
      <StepHeader currentStep={currentStep} totalSteps={6} />

      <Welcome
        isVisible={currentStep === 1}
        onNext={handleNext}
        onSkip={handleSkip}
        onBack={handleBack}
        loading={loading}
        direction={direction}
      />

      <HowItWorks
        isVisible={currentStep === 2}
        answers={answers}
        onAnswer={(value) => handleAnswer("settings", value)}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        loading={loading}
        direction={direction}
      />

      <Goal
        isVisible={currentStep === 3}
        answers={answers}
        onAnswer={(value) => handleAnswer("goal", value)}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        loading={loading}
        direction={direction}
      />

      <Role
        isVisible={currentStep === 4}
        answers={answers}
        onAnswer={(value) => handleAnswer("role", value)}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        loading={loading}
        direction={direction}
      />

      <Nickname
        isVisible={currentStep === 5}
        nickname={nickname}
        googleName={googleName || ""}
        onNicknameChange={setNickname}
        onBack={handleBack}
        loading={loading}
        direction={direction}
      />

      <Discovery
        isVisible={currentStep === 6}
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
        onNext={currentStep === 6 ? handleComplete : handleNext}
        onSkip={handleSkip}
        loading={loading}
        hasAnswer={true}
        isLastStep={currentStep === 6}
        showBack={currentStep > 1}
      />
    </PageLayout>
  );
}
