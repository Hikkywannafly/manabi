"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { OnboardingStepper } from "@/components/onboarding";

export default function GettingStartedPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleComplete = async (_answers: Record<string, string>) => {
    startTransition(async () => {
      try {
        // TODO: Save onboarding data to database
        // const result = await saveOnboardingData(answers);

        toast.success("Welcome to Manabi! Let's get started.", {
          description: "Redirecting to your dashboard...",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error) {
        console.error("Error completing onboarding:", error);
        toast.error("Something went wrong", {
          description: "Please try again later.",
        });
      }
    });
  };

  const handleSkip = async () => {
    startTransition(async () => {
      try {
        // TODO: Handle skip action (track user skipped onboarding)
        toast.success("Skipping onboarding...", {
          description: "Redirecting to your dashboard...",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error) {
        console.error("Error skipping onboarding:", error);
        toast.error("Something went wrong", {
          description: "Please try again later.",
        });
      }
    });
  };

  return <OnboardingStepper onComplete={handleComplete} onSkip={handleSkip} />;
}
