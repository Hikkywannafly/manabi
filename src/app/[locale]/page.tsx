"use client";
import { Benefits } from "@/components/benefits";
import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { Hero } from "@/components/hero/hero";
import { Pricing } from "@/components/pricing/pricing";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F6F2] dark:bg-[#2A1810]">
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
