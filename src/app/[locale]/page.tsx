"use client";

import {
  FAQSection,
  FeaturesSection,
  PricingSection,
  QuizMarquee,
  TestimonialsSection,
} from "@/components/landing";
import { PageLayout } from "@/components/layouts";
import { useAuth } from "@/contexts/auth-provider";
import { Hero } from "../../components/hero/hero";

export default function HomePage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    // Optional: returns null or a spinner while checking auth to prevent flash of content
    return null;
  }

  return (
    <PageLayout showFooter>
      <Hero />
      {/* <PainSection/> */}
      <FeaturesSection />
      {/* <StatsSection /> */}
      <TestimonialsSection />
      <FAQSection />
      <QuizMarquee />
      <PricingSection />
    </PageLayout>
  );
}
