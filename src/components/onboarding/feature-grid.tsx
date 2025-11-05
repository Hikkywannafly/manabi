"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.id}
            className="flex flex-col items-start gap-3 rounded-lg border border-input bg-card p-4 transition-all hover:border-primary/50 hover:bg-accent/20"
          >
            <Icon className="h-6 w-6 text-primary" />
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-muted-foreground text-xs">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
