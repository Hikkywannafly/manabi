"use client";

import { BookOpen, Brain, CheckSquare, Clock, Trophy, Zap } from "lucide-react";

import { FeatureGrid } from "../feature-grid";
import { StepFooter } from "../step-footer";
import { StepLayout } from "../step-layout";
import { StepWrapper } from "../step-wrapper";

interface Step1WelcomeProps {
  isVisible: boolean;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  loading?: boolean;
  direction?: "forward" | "backward";
}

export function Step1Welcome({
  isVisible,
  onNext,
  onSkip,
  onBack,
  loading = false,
  direction = "forward",
}: Step1WelcomeProps) {
  const features = [
    {
      id: "flashcards",
      icon: Zap,
      title: "AI Flashcards",
      description: "Generate smart flashcards from your notes",
    },
    {
      id: "quizzes",
      icon: BookOpen,
      title: "AI Quizzes",
      description: "Create practice tests automatically",
    },
    {
      id: "tutor",
      icon: Brain,
      title: "AI Tutor",
      description: "Get personalized help and explanations",
    },
    {
      id: "timer",
      icon: Clock,
      title: "Pomodoro Timer",
      description: "Stay focused with time management",
    },
    {
      id: "kanban",
      icon: CheckSquare,
      title: "Kanban Board",
      description: "Organize tasks and track progress",
    },
    {
      id: "gamification",
      icon: Trophy,
      title: "Gamification",
      description: "Earn XP, streaks, and achievements",
    },
  ];

  return (
    <StepWrapper
      isVisible={isVisible}
      direction={direction}
      onBack={onBack}
      showBackButton={false}
      isLoading={loading}
    >
      <StepLayout
        title="Welcome to Manabi"
        currentStep={1}
        totalSteps={5}
        showIndicator={false}
      >
        <p className="text-center text-muted-foreground text-sm">
          Manabi helps you learn smarter with AI-powered tools to personalize
          your study journey.
        </p>

        <FeatureGrid features={features} />

        <StepFooter
          onBack={onBack}
          onNext={onNext}
          onSkip={onSkip}
          loading={loading}
          hasAnswer={true}
          showBack={false}
        />
      </StepLayout>
    </StepWrapper>
  );
}
