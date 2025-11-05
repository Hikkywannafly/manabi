"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CardOptionProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function CardOption({
  label,
  isSelected,
  onClick,
  icon,
}: CardOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full rounded-lg border-2 px-4 py-3 text-center transition-all duration-200",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-input bg-card hover:border-primary/50",
      )}
    >
      {icon && <div className="mb-2 flex justify-center text-2xl">{icon}</div>}
      <p className="font-semibold text-sm">{label}</p>

      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
          }}
        >
          <span className="text-primary-foreground text-xs">✓</span>
        </motion.div>
      )}
    </motion.button>
  );
}
