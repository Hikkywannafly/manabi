"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Lightbulb, Play, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden">
      {/* Subtle vignette background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#F9F6F2] via-[#F5EFE6] to-[#EDE5DD] opacity-80" />

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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E2B769]/20 bg-[#F5EFE6] px-4 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-[#B35832]" />
              <span className="font-medium text-[#39241A] text-sm">
                {t("badge")}
              </span>
            </div>

            <h1 className="font-bold text-5xl text-[#39241A] leading-tight md:text-6xl lg:text-7xl">
              {t("title")}
            </h1>

            <p className="mx-auto max-w-xl text-[#39241A]/70 text-lg leading-relaxed md:text-xl lg:mx-0">
              {t("subtitle")}
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/get-started">
                <Button
                  size="lg"
                  className="hover:-translate-y-1 rounded-2xl bg-[#B35832] px-8 py-6 text-lg text-white shadow-[0_8px_30px_rgba(179,88,50,0.3)] transition-all duration-300 hover:bg-[#9d4a2a] hover:shadow-[0_8px_40px_rgba(179,88,50,0.4)]"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t("ctaPrimary")}
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-2 border-[#B35832] px-8 py-6 text-[#B35832] text-lg transition-all duration-300 hover:bg-[#B35832]/5"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {t("ctaSecondary")}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="font-bold text-3xl text-[#B35832]">
                  {t("stat1")}
                </div>
                <div className="text-[#39241A]/60 text-sm">
                  {t("stat1Text")}
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-bold text-3xl text-[#B35832]">
                  {t("stat2")}
                </div>
                <div className="text-[#39241A]/60 text-sm">
                  {t("stat2Text")}
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-bold text-3xl text-[#B35832]">
                  {t("stat3")}
                </div>
                <div className="text-[#39241A]/60 text-sm">
                  {t("stat3Text")}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Feature showcase */}
          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-xl">
              {/* Decorative card showcase */}
              <div className="absolute inset-0 space-y-4">
                {/* Card 1 - AI Notes */}
                <div className="absolute top-8 right-0 w-72 rotate-3 space-y-3 rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:scale-105">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B35832]/10">
                    <Lightbulb className="h-6 w-6 text-[#B35832]" />
                  </div>
                  <h3 className="font-semibold text-[#39241A]">AI Notes</h3>
                  <p className="text-[#39241A]/60 text-sm">
                    Transform lecture notes into interactive study materials
                  </p>
                </div>

                {/* Card 2 - Quiz Generator */}
                <div className="-rotate-2 absolute top-48 left-8 w-72 space-y-3 rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:scale-105">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E2B769]/10">
                    <BookOpen className="h-6 w-6 text-[#E2B769]" />
                  </div>
                  <h3 className="font-semibold text-[#39241A]">
                    Quiz Generator
                  </h3>
                  <p className="text-[#39241A]/60 text-sm">
                    Create personalized quizzes to test your understanding
                  </p>
                </div>

                {/* Card 3 - Smart Learning */}
                <div className="absolute right-12 bottom-8 w-72 rotate-1 space-y-3 rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:scale-105">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B35832]/10">
                    <Brain className="h-6 w-6 text-[#B35832]" />
                  </div>
                  <h3 className="font-semibold text-[#39241A]">
                    Smart Flashcards
                  </h3>
                  <p className="text-[#39241A]/60 text-sm">
                    Spaced repetition for optimal memory retention
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="-top-4 -right-4 absolute h-24 w-24 rounded-full bg-[#E2B769]/20 blur-2xl" />
              <div className="-bottom-8 -left-8 absolute h-32 w-32 rounded-full bg-[#B35832]/10 blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-[#F5EFE6] to-transparent" />
    </section>
  );
}
