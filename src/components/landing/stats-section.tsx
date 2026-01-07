"use client";

import { motion, useInView } from "framer-motion";
import { BookOpen, LayoutGrid, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({
  end,
  duration = 2,
}: {
  end: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min(
        (currentTime - startTime) / (duration * 1000),
        1,
      );
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}+</span>;
}

const stats = [
  {
    icon: Users,
    value: 5000,
    label: "Active Users",
  },
  {
    icon: BookOpen,
    value: 12000,
    label: "Quizzes Created",
  },
  {
    icon: LayoutGrid,
    value: 45000,
    label: "Flashcards Made",
  },
];

export function StatsSection() {
  return (
    <div className="container max-w-6xl py-12">
      <div className="mt-4 grid grid-cols-2 gap-8 px-0 text-center md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`mx-auto w-full ${index === 2 ? "col-span-full md:col-span-1" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <stat.icon className="size-6 text-primary" />
            </div>
            <div className="font-bold text-4xl">
              <AnimatedCounter end={stat.value} />
            </div>
            <p className="mt-2 text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
