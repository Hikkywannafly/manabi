import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectedFileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function SelectedFileList({ files, onRemove }: SelectedFileListProps) {
  return (
    <div className="w-full space-y-2">
      {files.map((file, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between rounded-md border bg-background p-3"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-muted-foreground text-xs">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(idx)}
            type="button"
          >
            <span className="sr-only">Remove file</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="pt-2 text-center">
        <p className="text-muted-foreground text-xs">
          Supports PDF, DOCX, PPTX, TXT (Max 10MB)
        </p>
      </div>
    </div>
  );
}
