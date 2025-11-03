"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cloud, ImageUp, Palette, Sparkles, Wand2, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export function Benefits() {
  const t = useTranslations("benefits");

  const features = [
    {
      icon: Wand2,
      titleKey: "features.0.title",
      descriptionKey: "features.0.description",
      color: "text-[#B35832]",
    },
    {
      icon: ImageUp,
      titleKey: "features.1.title",
      descriptionKey: "features.1.description",
      color: "text-[#E2B769]",
    },
    {
      icon: Palette,
      titleKey: "features.2.title",
      descriptionKey: "features.2.description",
      color: "text-[#B35832]",
    },
    {
      icon: Cloud,
      titleKey: "features.3.title",
      descriptionKey: "features.3.description",
      color: "text-[#E2B769]",
    },
    {
      icon: Sparkles,
      titleKey: "features.4.title",
      descriptionKey: "features.4.description",
      color: "text-[#B35832]",
    },
    {
      icon: Zap,
      titleKey: "features.5.title",
      descriptionKey: "features.5.description",
      color: "text-[#E2B769]",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#F9F6F2] py-24 dark:bg-[#2A1810]">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-[#E2B769]/10 blur-3xl dark:bg-[#E2B769]/5" />
      <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-[#B35832]/10 blur-3xl dark:bg-[#B35832]/5" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section header */}
        <div className="mb-16 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2B769]/20 bg-[#F5EFE6] px-4 py-2 shadow-sm dark:border-[#E2B769]/10 dark:bg-[#3D2818]">
            <Sparkles className="h-4 w-4 text-[#B35832] dark:text-[#E2B769]" />
            <span className="font-medium text-[#39241A] text-sm dark:text-[#F9F6F2]">
              {t("subtitle")}
            </span>
          </div>
          <h2 className="font-bold text-4xl text-[#39241A] md:text-5xl dark:text-[#F9F6F2]">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-[#39241A]/70 text-lg dark:text-[#F9F6F2]/70">
            {t("description")}
          </p>
        </div>

        {/* Features grid */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:-translate-y-2 overflow-hidden rounded-2xl border-[#E2B769]/20 bg-white/80 shadow-[0_0_15px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(179,88,50,0.15)] dark:border-[#E2B769]/10 dark:bg-[#3D2818]/80 dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_30px_rgba(226,183,105,0.2)]"
              >
                <CardHeader className="space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#F5EFE6] to-[#E2B769]/20 transition-transform duration-300 group-hover:scale-110 dark:from-[#4D3020] dark:to-[#E2B769]/10">
                    <Icon
                      className={`h-7 w-7 ${feature.color} dark:text-[#E2B769]`}
                    />
                  </div>
                  <CardTitle className="font-semibold text-[#39241A] text-xl dark:text-[#F9F6F2]">
                    {t(`${feature.titleKey}`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[#39241A]/70 leading-relaxed dark:text-[#F9F6F2]/70">
                    {t(`${feature.descriptionKey}`)}
                  </CardDescription>
                </CardContent>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-[#E2B769]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-[#E2B769]/5" />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section divider bottom */}
      <div className="absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t from-[#F5EFE6] to-transparent dark:from-[#332016]" />
    </section>
  );
}
