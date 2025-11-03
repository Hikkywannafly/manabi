import type { Feature } from "@/components/features/features";
import { cn } from "@/lib/utils";

type FeatureDetailsProps = {
  feature: Feature;
  isActive: boolean;
};

export function FeatureDetails({ feature, isActive }: FeatureDetailsProps) {
  const { icon, title, description } = feature;

  return (
    <>
      <div
        className={cn(
          "w-fit rounded-sm bg-secondary p-3 text-foreground transition-colors",
          isActive && "bg-foreground text-background",
        )}
      >
        {icon}
      </div>
      <div className="text-center">
        <p className="mb-2 font-medium text-base">{title}</p>
        <p className="text-wrap text-muted-foreground text-sm">{description}</p>
      </div>
    </>
  );
}
