import { Nav } from "@/components/hero/nav";
import { BackgroundBlur } from "@/components/ui/background-blur";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="z-1 grid w-full place-items-center p-8">
      <BackgroundBlur className="-top-40 md:-top-0" />
      <Nav />
      <div className="mt-16 flex flex-col items-center gap-6">
        <Pill>

          <p className="px-2 font-medium text-muted-foreground text-xs sm:border-l-1 sm:text-sm">
            Join 10,000+ users boosting their productivity with Acme App
          </p>
        </Pill>
        <h1 className="text-center font-medium text-4xl leading-[1.1] tracking-tight sm:text-7xl">
          Meet the App<span className="block text-muted-foreground">That Does It All.</span>
        </h1>
        <p className="max-w-lg text-center leading-6 tracking-tight sm:text-xl">
          Powerful, intuitive, and ready to make your life easier, start using Acme App today.
        </p>
        <Button className="mb-10 w-fit" size="lg" asChild>
          <Link href="/pricing">Get Started</Link>
        </Button>
        <Image src="/app-image-1.png" alt="Hero" width={304} height={445} />
      </div>
    </div>
  );
}
