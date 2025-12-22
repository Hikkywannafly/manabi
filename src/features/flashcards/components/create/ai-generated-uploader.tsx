"use client";

import { Brain, Loader2, Settings, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlashProcessor } from "@/features/flashcards/hooks/use-flash-processor";
import { useGenerateFlashcardTitleDescription } from "@/features/flashcards/hooks/use-generate-flashcard-title-description";
import { FileList } from "./file-list";
import { FileUploadArea } from "./file-upload-area";
import { SupportedFormats } from "./supported-formats";

interface AIGeneratedUploaderProps {
  onProcessingStart?: (fileName: string, label?: string) => void;
  onProcessingDone?: (done: boolean) => void;
  onLimitReached?: () => void;
}

export function AIGeneratedUploader({
  onProcessingStart,
  onProcessingDone,
}: AIGeneratedUploaderProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  // Settings state
  const [generationMode, setGenerationMode] = useState<"GENERATE" | "EXTRACT">(
    "GENERATE",
  );
  const [flashcardType, setFlashcardType] = useState<
    "QUESTIONS" | "VOCABULARY"
  >("QUESTIONS");
  const [fileProcessingMode, setFileProcessingMode] = useState<
    "PARSE_THEN_SEND" | "SEND_DIRECT"
  >("PARSE_THEN_SEND");
  const [visibility, setVisibility] = useState<string>("private");
  const [language, setLanguage] = useState<string>("auto");
  const [numberOfCards, setNumberOfCards] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [parsingMode, setParsingMode] = useState<string>("balanced");

  const {
    uploadedFiles,
    addFiles,
    removeFile,
    generateFromFiles,
    extractFromFilesAI,
    isProcessing,
    hasFiles,
  } = useFlashProcessor();

  const titleGenerator = useGenerateFlashcardTitleDescription();

  const handleGenerateFlashcards = async () => {
    if (uploadedFiles.length === 0) return;

    setIsGenerating(true);
    onProcessingStart?.(
      uploadedFiles[0]?.name || "File",
      generationMode === "GENERATE"
        ? "Generating flashcards..."
        : "Processing file...",
    );

    try {
      const settings = {
        generationMode,
        flashcardType,
        fileProcessingMode,
        visibility,
        language,
        numberOfCards,
        difficulty,
        parsingMode,
      };

      let result: { flashcards: any[] };
      if (generationMode === "GENERATE") {
        result = await generateFromFiles(settings);
      } else {
        result = await extractFromFilesAI(settings);
      }

      // Generate better title/description asynchronously (non-blocking)
      try {
        const fileContent = uploadedFiles[0]?.parsedContent || "";
        await titleGenerator.generateTitleDescription(
          fileContent,
          result.flashcards || [],
          {
            isExtractMode: generationMode === "EXTRACT",
            targetLanguage: language,
            filename: uploadedFiles[0]?.name,
            category: flashcardType === "VOCABULARY" ? "Vocabulary" : undefined,
          },
        );
      } catch (error) {
        console.warn("⚠️ Failed to generate AI title (using fallback):", error);
      }

      setIsGenerating(false);
      onProcessingDone?.(true);
      toast.success(
        `Generated ${result.flashcards.length} flashcards successfully!`,
      );

      // Navigate to edit page
      router.push("/dashboard/flashcards/create/edit");
    } catch (error) {
      setIsGenerating(false);
      onProcessingDone?.(false);

      let errorMessage = "Unknown error";
      let errorTitle = "Failed to generate flashcards";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Customize error messages based on error type
        if (errorMessage.includes("Rate limit")) {
          errorTitle = "Too Many Requests";
        } else if (errorMessage.includes("API quota")) {
          errorTitle = "API Quota Exceeded";
        } else if (errorMessage.includes("Invalid API key")) {
          errorTitle = "Authentication Error";
        } else if (errorMessage.includes("429")) {
          errorTitle = "Rate Limit Exceeded";
          errorMessage =
            "You've made too many requests. Please wait a moment before trying again.";
        }
      }

      toast.error(errorTitle, {
        description: errorMessage,
        duration: 5000,
      });
      console.error("Error generating flashcards:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main area */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upload Area */}
          <FileUploadArea onDrop={addFiles} isDragActive={false} />
          <FileList files={uploadedFiles} onRemoveFile={removeFile} />

          {/* Action */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {generationMode === "GENERATE"
                ? "AI will read your file and generate Q&A flashcards."
                : "AI will extract exact Q&A pairs from your file."}
            </p>
            <div className="flex gap-2">
              <Button
                disabled={!hasFiles || isProcessing || isGenerating}
                onClick={handleGenerateFlashcards}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {generationMode === "GENERATE"
                      ? "Generating..."
                      : "Processing..."}
                  </>
                ) : generationMode === "GENERATE" ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Create Deck
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Create Deck
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings sidebar */}
        <div>
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 border-none text-base">
                <Settings className="h-4 w-4" />
                Settings
              </CardTitle>
              <CardDescription>
                Customize how your flashcards are enhanced.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 border-none">
              <div className="space-y-2">
                <Label>Generation Mode</Label>
                <Select
                  value={generationMode}
                  onValueChange={(value: "GENERATE" | "EXTRACT") =>
                    setGenerationMode(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="GENERATE">
                      🧠 Generate from content
                    </SelectItem>
                    <SelectItem value="EXTRACT">
                      📋 Extract from file
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Flashcard Type - Only show when generation mode is GENERATE */}
              {generationMode === "GENERATE" && (
                <div className="space-y-2">
                  <Label>Flashcard Type</Label>
                  <Select
                    value={flashcardType}
                    onValueChange={(value: "QUESTIONS" | "VOCABULARY") =>
                      setFlashcardType(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="QUESTIONS">❓ Questions</SelectItem>
                      <SelectItem value="VOCABULARY">📚 Vocabulary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>File Processing</Label>
                <Select
                  value={fileProcessingMode}
                  onValueChange={(value: "PARSE_THEN_SEND" | "SEND_DIRECT") =>
                    setFileProcessingMode(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="PARSE_THEN_SEND">
                      📄 Parse text first
                    </SelectItem>
                    <SelectItem value="SEND_DIRECT">
                      🎯 Send file directly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={visibility}
                  onValueChange={(value: string) => setVisibility(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="private">🔒 Private</SelectItem>
                    <SelectItem value="public">🌍 Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="auto">🌐 Auto Detect</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {generationMode === "GENERATE" && (
                <>
                  <div className="space-y-2">
                    <Label>Number of Cards</Label>
                    <Select
                      value={String(numberOfCards)}
                      onValueChange={(val) => setNumberOfCards(Number(val))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {[5, 10, 20, 30, 50].map((val) => (
                          <SelectItem key={val} value={String(val)}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="easy">😊 Easy</SelectItem>
                        <SelectItem value="medium">😐 Medium</SelectItem>
                        <SelectItem value="hard">😤 Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Parsing Mode</Label>
                    <Select value={parsingMode} onValueChange={setParsingMode}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="fast">⚡ Fast</SelectItem>
                        <SelectItem value="balanced">⚖️ Balanced</SelectItem>
                        <SelectItem value="thorough">🔍 Thorough</SelectItem>
                      </SelectContent>
                    </Select>
                    {parsingMode === "fast" && (
                      <p className="text-muted-foreground text-xs">
                        Faster but might miss some details.
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <SupportedFormats />
        </div>
      </div>
    </div>
  );
}
