"use client";
import { Benefits } from "@/components/benefits";
import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { Hero } from "@/components/hero/hero";
import { Pricing } from "@/components/pricing/pricing";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
