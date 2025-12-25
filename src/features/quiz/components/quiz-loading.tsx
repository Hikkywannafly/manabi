import { Progress } from "@/components/ui/progress";
import { LoadingCardGrid } from "./loading-card-grid";

interface QuizLoadingProps {
  progress: number;
  status: string;
}

export function QuizLoading({ progress, status }: QuizLoadingProps) {
  return (
    <div className="my-8 px-4 xl:px-8">
      <div className="container max-w-7xl p-0">
        <div className="relative">
          <div className="sticky inset-x-0 top-12 z-50 bg-background p-4">
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto w-full max-w-xl space-y-4">
                {/* <div className="mb-2 flex items-center justify-center gap-4 rounded-md border border-yellow-500 bg-yellow-100 p-2 text-yellow-900 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100">
                  <p className="text-center text-sm">
                    Processing in balanced mode - this might take longer to ensure
                    better results
                  </p>
                </div> */}
                <Progress value={progress} className="h-2 w-full" />
                <div className="text-center">
                  <p className="font-medium text-lg">
                    {status || "Analyzing your study materials..."}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {Math.round(progress)}% complete
                  </p>
                  <p className="mt-2 text-muted-foreground text-sm italic">
                    Save frequently used materials to speed up future quiz and
                    flashcard generations
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <LoadingCardGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
