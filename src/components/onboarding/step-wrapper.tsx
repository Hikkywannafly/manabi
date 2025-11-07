"use client";

import { AnimatePresence, motion } from "motion/react";
import type React from "react";

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
            className={`container mx-auto flex min-h-screen items-start justify-center px-4 py-44 transition-all duration-300 ${isLoading ? "blur-sm" : ""}`}
          >
            <div className="w-full max-w-2xl">
              <form className="w-full">{children}</form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
