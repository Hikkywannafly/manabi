import { Badge } from "@/components/ui/badge";

const CARDS = [
  "🦊",
  "🐼",
  "🐱",
  "🐶",
  "🐭",
  "🐹",
  "🐰",
  "🐻",
  "🐶",
  "🐱",
  "🐹",
  "🐭",
  "🦊",
  "🐼",
  "🐻",
  "🐰",
];

export function LoadingCardGrid() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-4 flex gap-4">
          <Badge variant="outline" className="py-1 text-lg">
            Moves: 0
          </Badge>
          <Badge variant="outline" className="py-1 text-lg">
            Matches: 0
          </Badge>
        </div>
        <div className="my-8 grid w-full max-w-md grid-cols-4 gap-4">
          {CARDS.map((emoji, index) => (
            <button
              key={index}
              type="button"
              className="relative aspect-[2/3] w-full cursor-pointer transition-transform duration-500 ease-in-out [perspective:1000px] [transform-style:preserve-3d]"
              aria-label="Unflipped card"
              aria-pressed="false"
            >
              <div className="absolute flex size-full items-center justify-center rounded-lg bg-primary/80 text-4xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {emoji}
              </div>
              <div className="absolute flex size-full items-center justify-center rounded-lg bg-secondary text-2xl [backface-visibility:hidden]">
                ?
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
