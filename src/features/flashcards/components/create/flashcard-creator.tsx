"use client";

import { FileText, Sparkles, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIGeneratedUploader } from "./ai-generated-uploader";
import { ProcessingScreen } from "./processing-screen";

function FileWithAnswersUploaderPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center text-muted-foreground">
      <FileText className="mb-4 h-10 w-10 opacity-50" />
      <p>File with Answers uploader coming soon...</p>
    </div>
  );
}

function TextContentUploaderPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center text-muted-foreground">
      <Type className="mb-4 h-10 w-10 opacity-50" />
      <p>Text Content uploader coming soon...</p>
    </div>
  );
}

export function FlashcardCreator() {
  const [activeTab, setActiveTab] = useState("ai-generated");

  // Centralized processing overlay state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDone, setProcessingDone] = useState(false);
  const [processingLabel, setProcessingLabel] = useState<string | undefined>();
  const [processingFileName, setProcessingFileName] = useState<string>("");

  const handleProcessingStart = (fileName: string, label?: string) => {
    setProcessingFileName(fileName);
    setProcessingLabel(label);
    setProcessingDone(false);
    setIsProcessing(true);
  };

  const handleProcessingDone = (done: boolean) => {
    setProcessingDone(done);
    if (done) {
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingDone(false);
        setProcessingLabel(undefined);
        setProcessingFileName("");
      }, 1500);
    } else {
      // Hide immediately on error
      setIsProcessing(false);
      setProcessingDone(false);
      setProcessingLabel(undefined);
      setProcessingFileName("");
    }
  };

  // Lock background scroll while processing to keep overlay fixed and clean
  useEffect(() => {
    if (isProcessing) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isProcessing]);

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className={`mb-8 text-center ${isProcessing ? "invisible" : ""}`}>
        <h1 className="font-bold text-3xl tracking-tight">
          Generate Flashcards
        </h1>
        <p className="mt-2 text-muted-foreground">
          Upload documents or text to automatically generate flashcards.
        </p>
      </div>

      <div className="relative">
        {isProcessing && (
          <div className="fixed inset-0 z-1000 flex h-screen w-screen items-center justify-center bg-background">
            <ProcessingScreen
              fileName={processingFileName || "File"}
              label={processingLabel}
              isDone={processingDone}
            />
          </div>
        )}

        <div
          className={`${isProcessing ? "invisible overflow-hidden" : ""}`}
          aria-busy={isProcessing}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full border-none"
          >
            <TabsList className="grid w-full grid-cols-3 border-none bg-accent/20">
              <TabsTrigger
                value="ai-generated"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                AI Generated
              </TabsTrigger>

              <TabsTrigger
                value="file-with-answers"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                File with Answers
              </TabsTrigger>

              <TabsTrigger
                value="text-content"
                className="flex items-center gap-2"
              >
                <Type className="h-4 w-4" />
                Text Content
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ai-generated" className="mt-6 border-none">
              <AIGeneratedUploader
                onProcessingStart={handleProcessingStart}
                onProcessingDone={handleProcessingDone}
              />
            </TabsContent>
            <TabsContent value="file-with-answers" className="mt-6 border-none">
              <FileWithAnswersUploaderPlaceholder />
            </TabsContent>
            <TabsContent value="text-content" className="mt-6 border-none">
              <TextContentUploaderPlaceholder />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
