"use client";

import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { Button } from "@/components/ui/button";

interface StepWrapperProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction?: "forward" | "backward";
  onBack?: () => void;
  showBackButton?: boolean;
  isLoading?: boolean;
}

export function StepWrapper({
  children,
  isVisible,
  onBack,
  showBackButton = true,
  isLoading = false,
  direction = "forward",
}: StepWrapperProps) {
  const getInitialAnimation = () => {
    if (direction === "backward") {
      return { opacity: 0, y: -10 };
    }
    return { opacity: 0, y: 10 };
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="step-content"
          className="w-full"
          exit={{ opacity: 0, y: direction === "backward" ? 10 : -10 }}
          initial={getInitialAnimation()}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div
            className={`container mx-auto flex min-h-screen items-center justify-center px-4 py-8 transition-all duration-300 ${isLoading ? "blur-sm" : ""}`}
          >
            <div className="w-full max-w-2xl">
              <form className="w-full pb-24">
                {showBackButton && onBack && (
                  <div className="relative mb-16 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={onBack}
                      className="rounded-full p-2 hover:bg-muted hover:text-foreground"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-5"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>
                  </div>
                )}

                {children}
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
