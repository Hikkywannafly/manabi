"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Clock, Kanban, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

// Animated word component that alternates between "Manabi" and "学び"
function AnimatedWord() {
  const words = ["Manabi", "学び"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-flex min-w-[140px] justify-start md:min-w-[180px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const FEATURE_CARDS = [
  {
    id: 0,
    icon: Clock,
    title: "Pomodoro Timer",
    description: "Stay focused with time-boxed study sessions",
    color: "primary",
  },
  {
    id: 1,
    icon: BookOpen,
    title: "Quiz Generator",
    description: "Create personalized quizzes to test your understanding",
    color: "accent",
  },
  {
    id: 2,
    icon: Kanban,
    title: "Kanban Board",
    description: "Organize tasks and track your learning progress",
    color: "primary",
  },
  {
    id: 3,
    icon: Lightbulb,
    title: "Cornell Notes",
    description: "Structure your notes for better retention and recall",
    color: "accent",
  },
];

export function Hero() {
  const t = useTranslations("hero");
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section className="relative flex min-h-[98vh] w-full items-center justify-center overflow-hidden">
      {/* Subtle vignette background */}
      <div className="absolute inset-0 bg-gradient-radial from-background via-secondary to-muted opacity-80" />

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-primary backdrop-blur-sm">
              <span className="font-semibold text-xs uppercase tracking-wide">
                {t("badge")}
              </span>
            </div>

            <h1 className="flex flex-wrap items-baseline gap-x-3 font-bold text-4xl text-foreground leading-tight md:text-5xl lg:text-6xl">
              <span>Learning Smart with</span>
              <AnimatedWord />
            </h1>

            <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed md:text-xl lg:mx-0">
              {t("subtitle")}
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/get-started">
                <Button
                  size="lg"
                  className="hover:-translate-y-1 rounded-2xl bg-primary px-8 py-6 text-lg text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90"
                >
                  {t("ctaPrimary")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Interactive Fan Cards */}
          <div className="relative">
            <div className="relative mx-auto h-[500px] w-full max-w-md">
              {/* Fan Cards */}
              <div className="relative h-full w-full">
                {FEATURE_CARDS.map((card, index) => {
                  const Icon = card.icon;
                  const isActive = activeCard === index;

                  // Cascading stack layout - cards offset to show titles
                  const totalCards = FEATURE_CARDS.length;
                  const centerIndex = (totalCards - 1) / 2;

                  // Rotation for each card (increased for maximum visibility)
                  const rotationStep = 10; // degrees
                  const baseRotation = (index - centerIndex) * rotationStep;
                  const rotation = isActive ? 0 : baseRotation;

                  // Large offset positioning to clearly show all cards
                  const offsetX = isActive ? 0 : (index - centerIndex) * 120;
                  const offsetY = isActive ? 0 : (index - centerIndex) * 70;

                  // Z-index: active card on top (50), otherwise reverse order (higher index = higher z-index)
                  // Cornell Notes (3) > Kanban (2) > Quiz (1) > Pomodoro (0)
                  const zIndex = isActive ? 50 : index + 1;
                  const scale = isActive ? 1.05 : 1;

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 50, rotate: baseRotation }}
                      animate={{
                        opacity: 1,
                        x: offsetX,
                        y: offsetY,
                        rotate: rotation,
                        scale: scale,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      style={{
                        zIndex,
                        transformOrigin: "center center",
                      }}
                      onClick={() => setActiveCard(index)}
                      className="group -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-80 cursor-pointer space-y-3 overflow-hidden rounded-2xl bg-card p-6 shadow-xl transition-shadow hover:shadow-2xl"
                    >
                      {/* Decorative gradient blobs - different color for each card */}
                      {/* Bottom-right blob */}
                      {index === 0 && (
                        <>
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                            className="-bottom-6 -right-6 sm:-bottom-8 sm:-right-8 absolute size-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 transition-transform group-hover:scale-110 sm:size-24"
                          />
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 1.5,
                            }}
                            className="-top-6 -left-6 sm:-top-8 sm:-left-8 absolute size-16 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 transition-transform group-hover:scale-110 sm:size-20"
                          />
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                            className="-bottom-6 -right-6 sm:-bottom-8 sm:-right-8 absolute size-20 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 transition-transform group-hover:scale-110 sm:size-24"
                          />
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 2,
                            }}
                            className="-top-6 -left-6 sm:-top-8 sm:-left-8 absolute size-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 transition-transform group-hover:scale-110 sm:size-20"
                          />
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                            className="-bottom-6 -right-6 sm:-bottom-8 sm:-right-8 absolute size-20 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 transition-transform group-hover:scale-110 sm:size-24"
                          />
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 2.5,
                            }}
                            className="-top-6 -left-6 sm:-top-8 sm:-left-8 absolute size-16 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 transition-transform group-hover:scale-110 sm:size-20"
                          />
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 1.5,
                            }}
                            className="-bottom-6 -right-6 sm:-bottom-8 sm:-right-8 absolute size-20 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 transition-transform group-hover:scale-110 sm:size-24"
                          />
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                              delay: 3,
                            }}
                            className="-top-6 -left-6 sm:-top-8 sm:-left-8 absolute size-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-green-500/10 transition-transform group-hover:scale-110 sm:size-20"
                          />
                        </>
                      )}

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${card.color}/10`}
                      >
                        <Icon className={`h-6 w-6 text-${card.color}`} />
                      </div>
                      <h3 className="font-bold text-card-foreground text-lg">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {card.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Decorative elements */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="-top-4 -right-4 absolute h-24 w-24 rounded-full bg-accent/20 blur-2xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="-bottom-8 -left-8 absolute h-32 w-32 rounded-full bg-primary/10 blur-3xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-secondary to-transparent" />
    </section>
  );
}
