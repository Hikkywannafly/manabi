import { Star } from "@/components/showcase/star";
import type { Testimonial } from "@/components/testimonials/testimonials";

type Props = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: Props) {
  return (
    <div className="flex h-auto w-xs flex-col gap-2 rounded-xl bg-card p-7 shadow-md md:w-[24rem] md:p-8">
      <div className="mb-1 font-semibold text-lg">{testimonial.title}</div>
      <div className="mb-2 flex items-center gap-px">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={18} className="text-yellow-400" />
        ))}
        <span className="ps-1 text-xs">{testimonial.date}</span>
        <span className="mx-1 h-1 w-1 rounded-full bg-foreground" />
        <span className="text-xs">{testimonial.name}</span>
      </div>
      <div className="text-wrap text-sm md:font-medium md:text-base">
        {testimonial.content}
      </div>
    </div>
  );
}
