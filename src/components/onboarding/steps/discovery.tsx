"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CardOption } from "../card-option";
import { StepLayout } from "../step-layout";
import { StepWrapper } from "../step-wrapper";

interface DiscoveryProps {
  isVisible: boolean;
  answers: Record<string, string>;
  onAnswer: (value: string) => void;
  onBack: () => void;
  onComplete: () => void;
  onSkip: () => void;
  loading?: boolean;
  direction?: "forward" | "backward";
}

export function Discovery({
  isVisible,
  answers,
  onAnswer,
  onBack,
  loading = false,
  direction = "forward",
}: DiscoveryProps) {
  const [otherValue, setOtherValue] = useState("");

  const selectedSources = answers.sources
    ? typeof answers.sources === "string"
      ? answers.sources.split(",").filter((s) => s.trim())
      : Array.isArray(answers.sources)
        ? answers.sources
        : []
    : [];

  const sources = [
    { label: "Google" },
    { label: "YouTube" },
    { label: "TikTok" },
    { label: "ChatGPT" },
    { label: "Friend" },
  ];

  const handleSelectSource = (source: string) => {
    const updated = selectedSources.includes(source)
      ? selectedSources.filter((s) => s !== source)
      : [...selectedSources, source];

    onAnswer(updated.join(","));
  };

  const handleOtherChange = (value: string) => {
    setOtherValue(value);

    // Update sources with "Other" if value exists
    if (value.trim()) {
      const otherSource = `Other: ${value.trim()}`;
      const updated = selectedSources.filter((s) => !s.startsWith("Other:"));
      updated.push(otherSource);
      onAnswer(updated.join(","));
    } else {
      // Remove "Other" if input is empty
      const updated = selectedSources.filter((s) => !s.startsWith("Other:"));
      onAnswer(updated.join(","));
    }
  };

  const handleRemoveSource = (source: string) => {
    const updated = selectedSources.filter((s) => s !== source);
    if (source.startsWith("Other:")) {
      setOtherValue("");
    }
    onAnswer(updated.join(","));
  };

  return (
    <StepWrapper
      isVisible={isVisible}
      direction={direction}
      onBack={onBack}
      showBackButton={true}
      isLoading={loading}
    >
      <StepLayout
        title="How Did You Find Manabi?"
        subtitle="Select all that apply. Help us understand how people discover Manabi."
        currentStep={5}
        totalSteps={5}
      >
        <div className="space-y-4">
          {/* Sources Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source) => (
              <CardOption
                key={source.label}
                label={source.label}
                isSelected={selectedSources.includes(source.label)}
                onClick={() => handleSelectSource(source.label)}
              />
            ))}
          </div>

          {/* Other Input */}
          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3">
            <label
              htmlFor="other-source"
              className="mb-2 block font-medium text-muted-foreground text-sm"
            >
              Other (please specify)
            </label>
            <Input
              id="other-source"
              placeholder="Enter another source..."
              value={otherValue}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                handleOtherChange(e.target.value);
              }}
              variant="outline"
            />
          </div>

          {/* Selected Tags */}
          {selectedSources.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Selected ({selectedSources.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSources.map((source) => (
                  <div
                    key={source}
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm"
                  >
                    <span>{source}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(source)}
                      className="inline-flex hover:opacity-70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </StepLayout>
    </StepWrapper>
  );
}
