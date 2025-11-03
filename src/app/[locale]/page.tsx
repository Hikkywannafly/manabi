"use client";
import { Benefits } from "@/components/benefits";
import { Hero } from "@/components/hero/hero";
import { PageLayout } from "@/components/layouts";
import { Pricing } from "@/components/pricing/pricing";

export default function HomePage() {
  return (
    <PageLayout showFooter>
      <Hero />
      <Benefits />
      <Pricing />
    </PageLayout>
  );
}
