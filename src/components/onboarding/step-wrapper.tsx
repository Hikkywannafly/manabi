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
  direction = "forward",
  isLoading = false,
}: StepWrapperProps) {
  const getInitialAnimation = () =>
    direction === "backward" ? { opacity: 0, y: 10 } : { opacity: 0, y: 10 };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <div
          className={`container mx-auto flex h-full items-center justify-center px-4 py-8 transition-all duration-300 ${isLoading ? "blur-sm" : ""}`}
        >
          <motion.div
            key="step"
            exit={{ opacity: 0, y: direction === "backward" ? 10 : 10 }}
            initial={getInitialAnimation()}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
