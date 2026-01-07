"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export function CTASection() {
  return (
    <section className="py-12 md:py-20">
      <div className="container max-w-6xl">
        <motion.div
          className="relative flex flex-col items-center justify-between overflow-hidden rounded-2xl bg-secondary p-8 text-secondary-foreground sm:p-16 md:flex-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="z-10 max-w-lg text-center md:text-left">
            <h2 className="font-extrabold text-2xl md:text-4xl">
              Want better grades?
            </h2>
            <p className="mt-4 text-lg">
              Study less, learn more with quizzes and flashcards made just for
              you.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4 md:justify-start">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-8 font-medium text-primary-foreground text-sm transition duration-100 hover:bg-primary/90 active:scale-[0.98]"
                href="/login"
              >
                Start now
              </Link>
            </div>
          </div>

          {/* Mascot Image */}
          <div className="lg:-top-10 absolute right-0 hidden aspect-[1536/1024] w-3/4 translate-x-1/3 md:top-0 md:block">
            <Image
              alt="StudyOn Mascot"
              fill
              className="rounded-lg object-contain"
              sizes="100vw"
              src="/_static/landing/cta-mascot.png"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
