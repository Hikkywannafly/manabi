"use client";

import { motion } from "framer-motion";

/*
function _TestimonialCard({
  testimonial,
}: {
  testimonial: any;
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-tertiary p-6 text-tertiary-foreground shadow-lg lg:col-span-2">
      <div>
        <div className="flex justify-between">
          <Quote className="size-10 fill-current text-primary" />
          <div className="relative size-12">
            <Image
              alt="School logo"
              fill
              className="h-16 object-contain"
              sizes="100vw"
              src={testimonial.schoolLogo}
            />
          </div>
        </div>
        <p className="mt-8 text-lg">{testimonial.content}</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 pt-4 md:items-center">
          <Avatar className="size-10 border-2 border-primary">
            <AvatarImage src={testimonial.avatar} />
            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{testimonial.name}</span>
            <span className="text-gray-400 text-sm">{testimonial.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

export function TestimonialsSection() {
  return (
    <section className="overflow-hidden bg-secondary px-4 py-12 md:py-20">
      <motion.div
        className="flex w-full flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="max-w-3xl text-center font-bold text-3xl tracking-tight sm:text-4xl">
          Real students, real results
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Don't just take our word for it. Here's what our users have to say.
        </p>
      </motion.div>

      <div className="w-full p-0 py-12 md:px-4">
        <div className="mx-auto">
          <div className="relative w-full"></div>
        </div>
      </div>
    </section>
  );
}
