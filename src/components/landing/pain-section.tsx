"use client";

import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import Image from "next/image";

const painPoints = [
  {
    emoji: "🤯",
    text: "You spend hours making study notes and questions instead of learning.",
  },
  {
    emoji: "❌",
    text: "Books, PDFs, and slides are overwhelming. It's hard to focus on the key points.",
  },
  {
    emoji: "🤦",
    text: "Without testing, you won't know what you don't understand until it's too late.",
  },
];

export function PainSection() {
  return (
    <section className="bg-muted py-12 md:py-20">
      <div className="container max-w-6xl">
        <div className="text-center">
          <motion.span
            className="mb-8 inline-block rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TriangleAlert className="mr-2 inline-block size-4" />
            <span>Poor study habits = poor grades</span>
          </motion.span>

          <motion.div
            className="flex w-full flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="max-w-3xl font-bold text-3xl tracking-tight sm:text-4xl">
              Over 50% of students waste time and struggle with ineffective
              study habits
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-muted-foreground">
              Bad study habits waste time, make it hard to remember things, and
              cause stress, leaving students feeling stuck and unprepared
            </p>
          </motion.div>
        </div>

        {/* Pain Image */}
        <motion.div
          className="relative my-24 w-full"
          style={{ aspectRatio: "1.352577319587629" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Image
            alt="Students struggling with study habits"
            fill
            className="w-full object-contain"
            sizes="100vw"
            src="/_static/landing/pain-image.png"
          />
        </motion.div>

        <motion.div
          className="flex w-full flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="max-w-3xl text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Wasting time, forgetting what you study, and feeling stressed
          </h2>
        </motion.div>

        {/* Pain Point Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              className="rounded-2xl border bg-tertiary p-8 text-tertiary-foreground shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
            >
              <p className="mb-2 text-center text-4xl">{point.emoji}</p>
              <p className="mt-2 text-center">{point.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
