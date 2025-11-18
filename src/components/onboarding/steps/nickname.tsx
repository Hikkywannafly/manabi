"use client";

import { Input } from "../../ui/input";
import { StepLayout } from "../step-layout";
import { StepWrapper } from "../step-wrapper";

interface NicknameProps {
  isVisible: boolean;
  nickname: string;
  googleName: string;
  onNicknameChange: (value: string) => void;
  onBack: () => void;
  loading?: boolean;
  direction?: "forward" | "backward";
}

export function Nickname({
  isVisible,
  nickname,
  googleName,
  onNicknameChange,
  onBack,
  loading = false,
  direction = "forward",
}: NicknameProps) {
  return (
    <StepWrapper
      isVisible={isVisible}
      direction={direction}
      onBack={onBack}
      showBackButton={false}
      isLoading={loading}
    >
      <StepLayout
        title="Create Your Profile"
        subtitle="Choose a nickname to personalize your experience"
        currentStep={0}
        totalSteps={6}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="nickname" className="block font-medium text-sm">
              Nickname
            </label>
            <Input
              id="nickname"
              type="text"
              placeholder={googleName || "Enter your nickname"}
              value={nickname}
              onChange={(e) => onNicknameChange(e.target.value)}
              disabled={loading}
              variant="outline"
            />
            {googleName && !nickname && (
              <p className="text-muted-foreground text-sm">
                Leave empty to use your Google name:{" "}
                <strong>{googleName}</strong>
              </p>
            )}
          </div>
        </div>
      </StepLayout>
    </StepWrapper>
  );
}
