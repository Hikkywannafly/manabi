import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OptionButtonProps {
  option: string;
  isSelected: boolean;
  onClick: () => void;
  showCheckbox?: boolean;
}

export function OptionButton({
  option,
  isSelected,
  onClick,
  showCheckbox = true,
}: OptionButtonProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="flex w-full items-center gap-3 rounded-lg border border-input bg-background px-4 py-3 text-left transition-all duration-200 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
    >
      {showCheckbox && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onClick}
          className="cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <Label className="flex-1 cursor-pointer truncate">{option}</Label>
    </button>
  );
}
