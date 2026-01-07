"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Manabi help me learn?",
    answer:
      "Manabi uses AI to transform your notes, PDFs, and documents into interactive quizzes and flashcards. This active learning approach helps you remember more, understand better, and study more efficiently than passive reading.",
  },
  {
    question: "How does the AI Tutor work?",
    answer:
      "The AI Tutor provides personalized explanations for any topic you're struggling with. Simply ask a question, and it will break down complex concepts into easy-to-understand explanations, helping you learn at your own pace.",
  },
  {
    question: "What file formats do you support?",
    answer:
      "We support PDF, Word documents (.docx), text files, images (for OCR extraction), Google Drive files, and even YouTube videos. You can also paste content directly or share links.",
  },
  {
    question: "Does Manabi cost money?",
    answer:
      "Manabi offers a free tier with 3 quizzes and 3 flashcard sets per week. For unlimited access and premium features like AI Tutor, image uploads, and priority support, we offer affordable monthly and yearly plans.",
  },
  {
    question: "Are there usage limits?",
    answer:
      "Free users can create 3 quizzes and 3 flashcard sets per week with up to 20 questions/15 flashcards each. Premium users get unlimited creations with up to 60 questions/flashcards per set.",
  },
  {
    question: "Can I share my study materials?",
    answer:
      "Yes! You can set your quizzes and flashcard sets to public, allowing you to share them via link with classmates and friends. You can also organize materials into collections.",
  },
  {
    question: "Is Manabi available on mobile devices?",
    answer:
      "Manabi is a web application optimized for all devices. Our responsive design works great on smartphones, tablets, and desktops. Access it from any browser, anywhere.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with Manabi, contact our support team within 7 days of purchase for a full refund.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to premium features until the end of your current billing period.",
  },
];

export function FAQSection() {
  return (
    <section id="faqs" className="py-12 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Everything you need to know about our AI-powered learning platform -
            from quizzes to flashcards to personalized tutoring.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b"
              >
                <AccordionTrigger className="flex flex-1 items-center justify-between rounded-xl bg-secondary p-4 text-left font-medium text-lg hover:no-underline max-sm:text-sm [&[data-state=open]>svg]:rotate-180">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="mt-2 overflow-hidden text-sm">
                  <div className="p-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
