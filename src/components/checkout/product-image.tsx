import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  imageUrl: string;
  name: string;
}

export function ProductImage(props: Props) {
  const { imageUrl, name, className } = props;

  return (
    <Image
      src={imageUrl}
      alt={name}
      width={34}
      height={34}
      className={cn("h-8.5 w-8.5 object-cover", className)}
    />
  );
}
