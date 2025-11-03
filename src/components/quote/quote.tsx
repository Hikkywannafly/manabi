export function Quote() {
  return (
    <figure className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12 text-center">
      <blockquote className="text-balance font-medium text-3xl leading-[1.1] tracking-tighter md:text-wrap md:text-5xl">
        <span>&quot;Since the first day we us</span>
        <span className="text-muted-foreground/50">
          ed Acme, we knew we&apos;d never go back to spreadsheets again.&quot;
        </span>
      </blockquote>
      <figcaption className="mt-10">
        <span className="block font-semibold tracking-tight md:text-xl">
          Daniel Rees
        </span>
        <span className="mt-1 block text-muted-foreground text-xs tracking-tighter md:text-xl">
          VP of Operations · Acme Inc.
        </span>
      </figcaption>
    </figure>
  );
}
