'use client';

import { FAQs } from "@/components/faqs/faqs";
import { Features } from "@/components/features/features";
import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero/hero";
import { Quote } from "@/components/quote/quote";
import { Showcase } from "@/components/showcase/showcase";
import { Testimonials } from "@/components/testimonials/testimonials";
import { useTranslations } from "next-intl";

export default function HomePage() {
    const t = useTranslations('common');

    return (
        <div className="min-h-screen container mx-auto flex flex-col items-center ">
            <Hero />
            <Showcase />
            <Quote />
            <Features />
            <Testimonials />
            <FAQs />
            <Footer />
        </div>

    );
}