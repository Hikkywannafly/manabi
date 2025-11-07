"use client";

import { useRouter } from "next/navigation";
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

  const handleComplete = async (answers: Record<string, string>) => {
    try {
      const result = await completeOnboarding({
        nickname: answers.nickname?.trim() || "",
        full_name: user?.user_metadata?.full_name,
        answers,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

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
  };

  const handleSkip = async () => {
    try {
      const result = await skipOnboarding();

      if (result.error) {
        toast.error(result.error);
        return;
      }

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
  };

  return (
    <OnboardingStepper
      onComplete={handleComplete}
      onSkip={handleSkip}
      googleName={googleName}
    />
  );
}
