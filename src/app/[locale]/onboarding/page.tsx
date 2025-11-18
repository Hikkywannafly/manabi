"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  completeOnboarding,
  skipOnboarding,
} from "@/app/api/actions/onboarding";
import { OnboardingStepper } from "@/components/onboarding";
import { TIMING } from "@/constants/timing";
import { useAuth } from "@/contexts/auth-provider";

export default function GettingStartedPage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

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

        // Refresh profile state để middleware có thể check onboarding_completed
        await refreshProfile();

        // Force router refresh để middleware re-run
        router.refresh();

        // Small delay để đảm bảo state đã update (database replication)
        await new Promise((resolve) =>
          setTimeout(resolve, TIMING.PROFILE_REFRESH_DELAY),
        );
        handleNavigate("Welcome to Manabi! Let's get started.");
      } catch (error) {
        console.error("Error completing onboarding:", error);
        handleError("", "Something went wrong");
      }
    },
    [
      user?.user_metadata?.full_name,
      handleError,
      handleNavigate,
      refreshProfile,
      router,
    ],
  );

  const handleSkip = useCallback(async () => {
    try {
      const result = await skipOnboarding();

      if (result.error) {
        handleError(result.error, "Oops!");
        return;
      }

      // Refresh profile state
      await refreshProfile();
      router.refresh();

      await new Promise((resolve) =>
        setTimeout(resolve, TIMING.PROFILE_REFRESH_DELAY),
      );
      handleNavigate("Skipping onboarding...");
    } catch (error) {
      console.error("Error skipping onboarding:", error);
      handleError("", "Something went wrong");
    }
  }, [handleError, handleNavigate, refreshProfile, router]);

  return (
    <OnboardingStepper
      onComplete={handleComplete}
      onSkip={handleSkip}
      googleName={googleName}
    />
  );
}
