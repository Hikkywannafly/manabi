"use client";

import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FileUploadAreaProps {
  onDrop: (acceptedFiles: File[]) => void;
  isDragActive?: boolean;
}

export function FileUploadArea({
  onDrop,
  isDragActive: externalIsDragActive,
}: FileUploadAreaProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive: internalIsDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/plain": [".txt"],
      "application/json": [".json"],
      "text/markdown": [".md"],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const isDragActive = externalIsDragActive ?? internalIsDragActive;

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 border-none">
          <Upload className="h-5 w-5" />
          AI Generated
        </CardTitle>
        <CardDescription>
          Upload files to generate flashcards automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="border-none">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-2 font-medium text-lg">
            {isDragActive
              ? "Drop files here..."
              : "Drag & drop files here, or click to select"}
          </p>
          <p className="mb-4 text-muted-foreground text-xs">
            Supported formats: PDF, DOC, PPT, XLS, TXT, JSON, MD
          </p>
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            <Badge variant="outline">PDF</Badge>
            <Badge variant="outline">DOC(X)</Badge>
            <Badge variant="outline">PPT(X)</Badge>
            <Badge variant="outline">XLS(X)</Badge>
            <Badge variant="outline">TXT</Badge>
            <Badge variant="outline">JSON</Badge>
            <Badge variant="outline">MD</Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            Up to 5 files, 10MB each
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
