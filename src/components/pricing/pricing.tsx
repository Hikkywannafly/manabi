"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function Pricing() {
  const t = useTranslations("pricing");
  const tFooter = useTranslations("footer");

  const plans = [
    {
      nameKey: "plans.0.name",
      priceKey: "plans.0.price",
      periodKey: "plans.0.period",
      descriptionKey: "plans.0.description",
      featuresKey: "plans.0.features",
      ctaKey: "plans.0.cta",
      popular: false,
    },
    {
      nameKey: "plans.1.name",
      priceKey: "plans.1.price",
      periodKey: "plans.1.period",
      descriptionKey: "plans.1.description",
      featuresKey: "plans.1.features",
      ctaKey: "plans.1.cta",
      popular: true,
    },
    {
      nameKey: "plans.2.name",
      priceKey: "plans.2.price",
      periodKey: "plans.2.period",
      descriptionKey: "plans.2.description",
      featuresKey: "plans.2.features",
      ctaKey: "plans.2.cta",
      popular: false,
    },
  ];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#F5EFE6] py-24"
      id="pricing"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#E2B769]/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-[#B35832]/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section header */}
        <div className="mb-16 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2B769]/20 bg-white px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#B35832]" />
            <span className="font-medium text-[#39241A] text-sm">
              {t("subtitle")}
            </span>
          </div>
          <h2 className="font-bold text-4xl text-[#39241A] md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-[#39241A]/70 text-lg">
            {t("description")}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`hover:-translate-y-2 relative overflow-hidden rounded-3xl border-2 bg-white/80 backdrop-blur-sm transition-all duration-500 ${
                plan.popular
                  ? "scale-105 border-[#B35832] shadow-[0_0_40px_rgba(179,88,50,0.2)]"
                  : "border-[#E2B769]/20 shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(179,88,50,0.15)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0">
                  <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-[#B35832] to-[#E2B769] py-2 text-center font-semibold text-sm text-white">
                    <Sparkles className="h-4 w-4" />
                    {t("popular")}
                  </div>
                </div>
              )}

              <CardHeader
                className={`space-y-4 ${plan.popular ? "pt-16" : "pt-8"}`}
              >
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-[#39241A]">
                    {t(`${plan.nameKey}`)}
                  </CardTitle>
                  <CardDescription className="text-[#39241A]/70">
                    {t(`${plan.descriptionKey}`)}
                  </CardDescription>
                </div>

                <div className="flex items-end gap-1">
                  <span className="font-bold text-5xl text-[#B35832]">
                    {t(`${plan.priceKey}`)}
                  </span>
                  <span className="mb-2 text-[#39241A]/60">
                    {t(`${plan.periodKey}`)}
                  </span>
                </div>
              </CardHeader>

              <CardFooter className="pt-4 pb-8">
                <Link
                  href={
                    plan.nameKey.includes("0")
                      ? "/get-started"
                      : plan.nameKey.includes("2")
                        ? "/contact"
                        : "/subscribe/pro"
                  }
                  className="w-full"
                >
                  <Button
                    className={`w-full rounded-xl py-6 font-semibold text-base transition-all duration-300 ${
                      plan.popular
                        ? "hover:-translate-y-1 bg-[#B35832] text-white shadow-[0_6px_20px_rgba(179,88,50,0.3)] hover:bg-[#9d4a2a] hover:shadow-[0_8px_30px_rgba(179,88,50,0.4)]"
                        : "border-2 border-[#E2B769] bg-[#F5EFE6] text-[#B35832] hover:bg-[#E2B769]/30"
                    }`}
                  >
                    {t(`${plan.ctaKey}`)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>

              {/* Decorative corner */}
              {plan.popular && (
                <div className="absolute right-0 bottom-0 h-32 w-32 rounded-tl-full bg-gradient-to-tl from-[#E2B769]/20 to-transparent" />
              )}
            </Card>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 space-y-2 text-center">
          <p className="text-[#39241A]/60">{tFooter("allInclusive")}</p>
          <p className="text-[#39241A]/50 text-sm">{tFooter("securePay")}</p>
        </div>
      </div>
    </section>
  );
}
