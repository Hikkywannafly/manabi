"use client";

import { FileText, Sparkles, Type } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIGeneratedUploader } from "./ai-generated-uploader";

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

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="mb-8 text-center">
        <h1 className="font-bold text-3xl tracking-tight">
          Generate Flashcards
        </h1>
        <p className="mt-2 text-muted-foreground">
          Upload documents or text to automatically generate flashcards.
        </p>
      </div>

      <div className="relative">
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
            <AIGeneratedUploader />
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
  );
}
