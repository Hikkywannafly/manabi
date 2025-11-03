import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function BackgroundBlur({ className }: Props) {
  return (
    <div
      className={cn(
        "-z-10 pointer-events-none absolute top-0 left-0 h-full w-full bg-[url('/background-blur-mobile.png')] bg-center bg-cover bg-no-repeat md:bg-[url('/background-blur-desktop.png')]",
        className,
      )}
    />
  );
}
