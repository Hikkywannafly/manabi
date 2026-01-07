"use client";

import { motion } from "framer-motion";
import { Check, Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

const plans = [
  {
    name: "Free",
    price: "$0.00",
    originalPrice: null,
    period: "/month",
    popular: false,
    features: [
      { text: "3 quizzes per week", included: true },
      { text: "3 flashcard sets per week", included: true },
      { text: "Up to 20 questions per quiz", included: true },
      { text: "Up to 15 flashcards per set", included: true },
      { text: "PDF & Document uploads (20MB limit)", included: true },
      { text: "Link uploads", included: true },
      { text: "Google Drive uploads", included: true },
      { text: "Pomodoro Timer", included: true },
      { text: "Kanban Board", included: true },
      { text: "AI Tutor", included: false },
      { text: "Image uploads", included: false },
      { text: "YouTube video uploads", included: false },
      { text: "Priority AI generation", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Start for Free",
    href: "/login",
  },
  {
    name: "Monthly",
    price: "$10.00",
    originalPrice: "$20.00",
    period: "/month",
    popular: true,
    features: [
      { text: "Unlimited quizzes", included: true },
      { text: "Unlimited flashcard sets", included: true },
      { text: "Up to 60 questions per quiz", included: true },
      { text: "Up to 60 flashcards per set", included: true },
      { text: "PDF & Document uploads (50MB limit)", included: true },
      { text: "Link uploads", included: true },
      { text: "Google Drive uploads", included: true },
      { text: "Pomodoro Timer", included: true },
      { text: "Kanban Board", included: true },
      { text: "AI Tutor", included: true },
      { text: "Image uploads", included: true },
      { text: "YouTube video uploads", included: true },
      { text: "Priority AI generation", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Get Started",
    href: "/login",
  },
  {
    name: "Yearly",
    price: "$5.00",
    originalPrice: "$10.00",
    period: "/month",
    billedAnnually: "$60.00",
    originalBilledAnnually: "$120.00",
    popular: false,
    features: [
      { text: "Unlimited quizzes", included: true },
      { text: "Unlimited flashcard sets", included: true },
      { text: "Up to 60 questions per quiz", included: true },
      { text: "Up to 60 flashcards per set", included: true },
      { text: "PDF & Document uploads (50MB limit)", included: true },
      { text: "Link uploads", included: true },
      { text: "Google Drive uploads", included: true },
      { text: "Pomodoro Timer", included: true },
      { text: "Kanban Board", included: true },
      { text: "AI Tutor", included: true },
      { text: "Image uploads", included: true },
      { text: "YouTube video uploads", included: true },
      { text: "Priority AI generation", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Get Started",
    href: "/login",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-20">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <h2 className="mt-8 font-bold text-3xl tracking-tight sm:text-4xl">
            Made by students, for students
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Choose the plan that best fits your study needs. All plans come with
            our core features to help you learn effectively.
          </p>

          {/* Discount Banner */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1 rounded-full px-2 py-1 font-medium text-sm sm:gap-2 sm:px-3 sm:text-base lg:text-lg">
            <Gift className="inline-block size-5 animate-pulse text-primary sm:size-6" />
            <span className="text-foreground">Limited-time offer: </span>
            <span className="hover:-rotate-3 text-primary transition-transform duration-200">
              50% off
            </span>
            <span>for life for the first 50 students!</span>
            <span className="text-primary">(7 left)</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative col-span-1 flex h-full flex-col justify-between rounded-2xl bg-background p-8 ring ${
                  plan.popular ? "shadow-lg ring-primary" : "ring-border"
                }`}
              >
                {plan.popular && (
                  <div className="-top-4 absolute inset-x-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-center font-medium text-primary-foreground text-sm">
                    Popular
                  </div>
                )}

                <div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-xl">{plan.name}</h3>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        {plan.originalPrice && (
                          <span className="font-bold text-3xl text-muted-foreground line-through">
                            {plan.originalPrice}
                          </span>
                        )}
                        <span className="font-bold text-3xl">{plan.price}</span>
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                      {plan.billedAnnually && (
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-muted-foreground text-sm line-through">
                            ${plan.originalBilledAnnually}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {plan.billedAnnually} billed annually
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.text}
                        className={`flex items-center ${!feature.included ? "text-muted-foreground" : ""}`}
                      >
                        {feature.included ? (
                          <Check className="mr-3 size-5 text-primary" />
                        ) : (
                          <X className="mr-3 size-5 text-muted-foreground" />
                        )}
                        <span className="text-sm">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={plan.href}>
                  <Button className="mt-8 w-full rounded-2xl">
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
