"use client";

import { Benefits } from "@/components/benefits";
import { Hero } from "@/components/hero/hero";
import { PageLayout } from "@/components/layouts";
import { Pricing } from "@/components/pricing/pricing";
import { useAuth } from "@/contexts/auth-provider";

export default function HomePage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    // Optional: returns null or a spinner while checking auth to prevent flash of content
    return null;
  }

  return (
    <PageLayout showFooter>
      <Hero />
      <Benefits />
      <Pricing />
    </PageLayout>
  );
}
