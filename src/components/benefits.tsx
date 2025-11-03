"use client";

import { Cloud, ImageUp, Palette, Sparkles, Wand2, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Benefits() {
  const t = useTranslations("benefits");

  const features = [
    {
      icon: Wand2,
      titleKey: "features.0.title",
      descriptionKey: "features.0.description",
      color: "text-primary",
    },
    {
      icon: ImageUp,
      titleKey: "features.1.title",
      descriptionKey: "features.1.description",
      color: "text-accent",
    },
    {
      icon: Palette,
      titleKey: "features.2.title",
      descriptionKey: "features.2.description",
      color: "text-primary",
    },
    {
      icon: Cloud,
      titleKey: "features.3.title",
      descriptionKey: "features.3.description",
      color: "text-accent",
    },
    {
      icon: Sparkles,
      titleKey: "features.4.title",
      descriptionKey: "features.4.description",
      color: "text-primary",
    },
    {
      icon: Zap,
      titleKey: "features.5.title",
      descriptionKey: "features.5.description",
      color: "text-accent",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-background py-24">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section header */}
        <div className="mb-16 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground text-sm">
              {t("subtitle")}
            </span>
          </div>
          <h2 className="font-bold text-4xl text-foreground md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
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
                className="group hover:-translate-y-2 overflow-hidden rounded-2xl border-border bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-500 hover:shadow-xl"
              >
                <CardHeader className="space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary transition-transform duration-300 group-hover:scale-110">
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="font-semibold text-card-foreground text-xl">
                    {t(`${feature.titleKey}`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {t(`${feature.descriptionKey}`)}
                  </CardDescription>
                </CardContent>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-accent/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section divider bottom */}
      <div className="absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t from-secondary to-transparent" />
    </section>
  );
}
