"use client";

import { UploadCloud } from "lucide-react";
import { useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // bytes
  accept?: Record<string, string[]>;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFilesSelected,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "text/plain": [".txt"],
  },
  className,
  disabled = false,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        console.error("Files rejected", fileRejections);
        // Could add toast notification here
      }
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "cursor-pointer rounded-lg p-10 text-center transition-colors hover:bg-muted/50",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <UploadCloud className="h-10 w-10 text-muted-foreground" />
        <div className="space-y-1">
          <p className="font-medium text-sm">
            {isDragActive ? "Drop the files here" : "Drop or select files"}
          </p>
          <p className="text-muted-foreground text-xs">
            Currently supported:{" "}
            {Object.values(accept)
              .flat()
              .map((ext) => ext.replace(".", "").toUpperCase())
              .join(", ")}
            <br />
            Up to {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB total
          </p>
        </div>
      </div>
    </div>
  );
}
