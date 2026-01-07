"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const AnimatedWord = ({ word }: { word: string }) => {
  return (
    <span className="flex flex-wrap whitespace-pre-wrap">
      <span className="sr-only">{word}</span>
      <motion.div
        className="flex flex-wrap"
        aria-hidden="true"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {word.split("").map((char, index) => (
          <span
            key={index}
            className="inline-flex overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "100%" },
                visible: { y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            >
              {char}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </span>
  );
};

export function HeroSection() {
  return (
    <section className="relative overflow-x-hidden py-12 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] bg-primary/10 dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-primary/10" />

      <div className="container relative z-10 max-w-6xl">
        {/* Announcement Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center justify-center"
        >
          <Link
            href="/blog/introducing-ai-tutor"
            className="flex w-auto items-center space-x-2 whitespace-pre rounded-full bg-primary/40 px-2 py-1 ring-1 ring-accent"
          >
            <div className="w-fit rounded-full bg-accent px-2 py-0.5 text-center font-medium text-accent-foreground text-xs sm:text-sm">
              🎉 New
            </div>
            <p className="font-medium text-primary-foreground text-xs sm:text-sm">
              AI Tutor is now available for all users!
            </p>
            <ArrowRight className="ml-1 size-3" />
          </Link>
        </motion.div>

        {/* Main Content */}
        <div className="text-center">
          <motion.h1
            className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="mb-1">Ace your studies with </span>
              <AnimatedWord word="quizzes" />
            </div>
            <div className="relative mt-4 ml-4 inline-block font-bold tracking-tight md:mt-6">
              <span className="relative z-10 text-primary-foreground leading-none">
                made in seconds
              </span>
              <div className="-inset-x-2 -bottom-1 md:-bottom-3 md:-top-2 absolute top-0 rounded-md bg-primary" />
            </div>
          </motion.h1>

          <motion.p
            className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Tired of drowning in notes? Our AI turns them into quick, fun
            quizzes and flashcards so you can study smarter, remember more, and
            stress less.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/login">
              <Button
                size="lg"
                className="mt-8 rounded-2xl px-8 transition-transform duration-100 active:scale-[0.98]"
              >
                Make studying easier now
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Preview */}
        <motion.div
          className="mt-16 h-auto rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-border md:ring-inset"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative rounded-xl border md:rounded-lg">
            <video
              src="/_static/landing/hero-preview.mp4"
              className="flex size-full rounded-lg object-contain object-center"
              width={1500}
              height={750}
              autoPlay
              loop
              muted
              playsInline
            />

            {/* Mascot */}
            <div className="-right-12 absolute bottom-[calc(100%-2rem)] z-50 hidden aspect-[1536/1024] w-64 lg:block">
              <Image
                alt="StudyOn Mascot"
                className="rounded-lg"
                fill
                sizes="100vw"
                src="/_static/landing/hero-mascot.png"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
