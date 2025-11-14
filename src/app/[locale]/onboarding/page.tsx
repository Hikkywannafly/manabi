"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  completeOnboarding,
  skipOnboarding,
} from "@/app/api/actions/onboarding";
import { OnboardingStepper } from "@/components/onboarding";
import { useAuth } from "@/contexts/auth-provider";

export default function GettingStartedPage() {
  const router = useRouter();
  const { user } = useAuth();

  const googleName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "";

  const handleNavigate = useCallback(
    (message: string) => {
      toast.success(message);
      router.push("/dashboard");
    },
    [router],
  );

  const handleError = useCallback((error: string, title: string) => {
    toast.error(title, {
      description: error || "Please try again later.",
    });
  }, []);

  const handleComplete = useCallback(
    async (finalAnswers: Record<string, string>) => {
      try {
        const nickname = finalAnswers.nickname?.trim() || "";

        const { nickname: _, ...otherAnswers } = finalAnswers;

        const result = await completeOnboarding({
          nickname,
          full_name: user?.user_metadata?.full_name,
          answers: otherAnswers,
        });

        if (result.error) {
          handleError(result.error, "Oops!");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        handleNavigate("Welcome to Manabi! Let's get started.");
      } catch (error) {
        console.error("Error completing onboarding:", error);
        handleError("", "Something went wrong");
      }
    },
    [user?.user_metadata?.full_name, handleError, handleNavigate],
  );

  const handleSkip = useCallback(async () => {
    try {
      const result = await skipOnboarding();

      if (result.error) {
        handleError(result.error, "Oops!");
        return;
      }

      handleNavigate("Skipping onboarding...");
    } catch (error) {
      console.error("Error skipping onboarding:", error);
      handleError("", "Something went wrong");
    }
  }, [handleError, handleNavigate]);

  return (
    <OnboardingStepper
      onComplete={handleComplete}
      onSkip={handleSkip}
      googleName={googleName}
    />
  );
}
