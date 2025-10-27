'use client';

import { LofiHeader } from "@/components/lofi-header";
import { LofiHero } from "@/components/hero/lofi-hero";
import { LofiBenefits } from "@/components/lofi-benefits";
import { LofiPricing } from "@/components/lofi-pricing";
import { LofiFAQ } from "@/components/lofi-faq";
import { LofiFooter } from "@/components/footer/lofi-footer";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#F9F6F2]">
            <LofiHeader />
            <main>
                <LofiHero />
                <LofiBenefits />
                <LofiPricing />
                <LofiFAQ />
            </main>
            <LofiFooter />
        </div>
    );
}