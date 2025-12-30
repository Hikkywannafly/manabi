"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Edit3,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Youtube,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAchievementNotifier } from "@/features/achievements/hooks/use-achievement-notifier";
import { useMissionNotifier } from "@/features/missions/hooks/use-mission-notifier";
import { FileUpload } from "@/features/quiz/components/file-upload";
import { SelectedFileList } from "@/features/quiz/components/selected-file-list";
import { createClient } from "@/lib/supabase/client";
import { AIService } from "@/services/ai-service";

import {
  type FlashcardCreationValues,
  flashcardCreationSchema,
} from "../schema";
import { FlashcardService } from "../services/flashcard-service";
import { FlashcardLoading } from "./flashcard-loading";
import { FlashcardSettingsSidebar } from "./flashcard-settings-sidebar";

interface CreateFlashcardFormProps {
  onGeneratingChange?: (isGenerating: boolean) => void;
}

export function CreateFlashcardForm({
  onGeneratingChange,
}: CreateFlashcardFormProps) {
  const router = useRouter();
  const { checkMissions } = useMissionNotifier();
  const { checkAchievements } = useAchievementNotifier();
  const [files, setFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");
  const [activeTab, setActiveTab] = useState("file");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FlashcardCreationValues>({
    resolver: zodResolver(flashcardCreationSchema),
    defaultValues: {
      visibility: "private",
      language: "auto",
      numberOfCards: "5-10",
      difficulty: "medium",
      parsingMode: "fast",
      customInstructions: "",
    },
  });

  const supabase = createClient();
  const subscriptionRef = useRef<(() => void) | null>(null);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
  }, []);

  const queryClient = useQueryClient();

  const { mutate: createDeck, isPending: isCreating } = useMutation({
    mutationFn: async (values: FlashcardCreationValues) => {
      // 1. Validation & Setup
      let filePath: string | undefined;
      let textContent: string | undefined;
      let youtubeUrl: string | undefined;
      let webpageUrl: string | undefined;

      if (activeTab === "text") {
        textContent = textInput.trim();
        setGenerationStatus("Processing text...");
      } else if (activeTab === "link") {
        webpageUrl = linkInput.trim();
        setGenerationStatus("Processing link...");
      } else if (activeTab === "youtube") {
        youtubeUrl = youtubeInput.trim();
        setGenerationStatus("Processing YouTube URL...");
      } else {
        // file, image, media
        const file = files[0];
        setGenerationStatus("Uploading file...");
        const fileExt = file.name.split(".").pop();
        filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(filePath, file);

        if (uploadError)
          throw new Error(`Upload failed: ${uploadError.message}`);
      }

      setGenerationStatus("Initializing AI Generation...");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let title = "Generated Deck";
      if (["file", "image", "media"].includes(activeTab) && files[0]) {
        const fileExt = files[0].name.split(".").pop();
        title = files[0].name.replace(`.${fileExt}`, "");
      } else if (activeTab === "text") {
        title = "Text Content Deck";
      } else if (activeTab === "link") {
        title = "Webpage Deck";
      } else if (activeTab === "youtube") {
        title = "YouTube Deck";
        if (youtubeInput) {
          // Simple extract video ID or title logic if possible?
          // For now just generic title or use user provided?
          // The user doesn't provide title in this form, it's auto or editing later.
        }
      }

      // Parse number of cards
      const cardRange = values.numberOfCards;
      let numberOfCards = 10; // default
      if (cardRange !== "auto") {
        const [min, max] = cardRange.split("-").map(Number);
        numberOfCards = max || min || 10;
      }

      // 2. Create Deck via Service
      const deck = await FlashcardService.createDeck(
        user.id,
        title,
        activeTab,
        filePath || textContent || webpageUrl || youtubeUrl || "unknown",
        {
          difficulty: (values.difficulty.charAt(0).toUpperCase() +
            values.difficulty.slice(1)) as "Easy" | "Medium" | "Hard",
          numberOfCards,
          language: values.language,
          parsingMode: values.parsingMode,
          customInstructions: values.customInstructions,
        },
      );

      return { deck, filePath, textContent, youtubeUrl, webpageUrl };
    },
    onSuccess: async (
      { deck, filePath, textContent, youtubeUrl, webpageUrl },
      values,
    ) => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ["decks"] });

      // 3. Subscribe to Progress
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }

      subscriptionRef.current = AIService.subscribeToDeckProgress(
        deck.id,
        (payload) => {
          setGenerationProgress(payload.progress);
          setGenerationStatus(payload.message);

          if (payload.progress === 100) {
            toast.success("Flashcards generated successfully!");

            // Check achievements and missions
            checkAchievements();
            checkMissions();

            if (subscriptionRef.current) {
              subscriptionRef.current();
              subscriptionRef.current = null;
            }

            setTimeout(() => {
              router.push(
                `/dashboard/flashcards/${deck.id}/${deck.slug || "view"}`,
              );
            }, 1000);
          }
        },
      );

      // 4. Trigger AI Service
      try {
        // Parse number of cards
        const cardRange = values.numberOfCards;
        let numberOfCards = 10; // default
        if (cardRange !== "auto") {
          const [min, max] = cardRange.split("-").map(Number);
          numberOfCards = max || min || 10;
        }

        await AIService.generateFlashcards(
          filePath,
          textContent,
          youtubeUrl,
          webpageUrl,
          deck.id,
          {
            difficulty: (values.difficulty.charAt(0).toUpperCase() +
              values.difficulty.slice(1)) as "Easy" | "Medium" | "Hard",
            numberOfCards,
            language: values.language,
            parsingMode: values.parsingMode,
            customInstructions: values.customInstructions,
          },
        );
      } catch (error) {
        console.error("AI Generation trigger failed", error);
        toast.error("Failed to start AI generation");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Failed to create flashcard deck");
      setIsGenerating(false);
      onGeneratingChange?.(false);
      setGenerationStatus("");
    },
  });

  const onSubmit = (values: FlashcardCreationValues) => {
    if (activeTab === "file" && files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }
    if (activeTab === "text" && !textInput.trim()) {
      toast.error("Please enter some text.");
      return;
    }
    if (activeTab === "link" && !linkInput.trim()) {
      toast.error("Please enter a URL.");
      return;
    }
    if (activeTab === "youtube" && !youtubeInput.trim()) {
      toast.error("Please enter a YouTube URL.");
      return;
    }

    setIsGenerating(true);
    onGeneratingChange?.(true);
    createDeck(values);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (isGenerating) {
    return (
      <FlashcardLoading
        progress={generationProgress}
        status={generationStatus}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-8 md:grid-cols-3"
      >
        {/* Left Column: Source Input */}
        <div className="space-y-6 md:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-4">
              <TabsTrigger
                value="file"
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="mr-2 h-4 w-4" /> File
              </TabsTrigger>
              <TabsTrigger
                value="text"
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Edit3 className="mr-2 h-4 w-4" /> Text
              </TabsTrigger>
              <TabsTrigger
                value="link"
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <LinkIcon className="mr-2 h-4 w-4" /> Link
              </TabsTrigger>
              <TabsTrigger
                value="drive"
                disabled
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="mr-2 h-4 w-4" /> Drive
              </TabsTrigger>
              <TabsTrigger
                value="material"
                disabled
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="mr-2 h-4 w-4" /> Material
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ImageIcon className="mr-2 h-4 w-4" /> Media
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ImageIcon className="mr-2 h-4 w-4" /> Image
              </TabsTrigger>
              <TabsTrigger
                value="youtube"
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Youtube className="mr-2 h-4 w-4" /> YouTube
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <Card className="min-h-[320px] border-2 border-border border-dashed bg-secondary/50 shadow-none">
                <CardContent className="flex h-full flex-col items-center justify-center p-6">
                  {files.length === 0 ? (
                    <FileUpload
                      onFilesSelected={(newFiles) => setFiles(newFiles)}
                    />
                  ) : (
                    <SelectedFileList files={files} onRemove={removeFile} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="text">
              <Card className="min-h-[320px] border-2 border-border border-dashed bg-secondary/50 shadow-none">
                <CardHeader>
                  <CardTitle>Paste Text Content</CardTitle>
                </CardHeader>
                <CardContent className="border-none">
                  <Textarea
                    placeholder="Paste your study notes, articles, or summary here..."
                    className="min-h-[300px] resize-none border-none bg-transparent focus-visible:ring-0"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="link">
              <Card className="min-h-[320px] border-2 border-border border-dashed bg-secondary/50 shadow-none">
                <CardHeader>
                  <CardTitle>Enter Webpage URL</CardTitle>
                </CardHeader>
                <CardContent className="border-none">
                  <Textarea
                    placeholder="e.g. https://en.wikipedia.org/wiki/Artificial_intelligence"
                    className="min-h-[100px] resize-none border-none bg-transparent focus-visible:ring-0"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="youtube">
              <Card className="min-h-[320px] border-2 border-border border-dashed bg-secondary/50 shadow-none">
                <CardHeader>
                  <CardTitle>Enter YouTube URL</CardTitle>
                </CardHeader>
                <CardContent className="border-none">
                  <Textarea
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="min-h-[100px] resize-none border-none bg-transparent focus-visible:ring-0"
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <Card className="min-h-[320px] border-2 border-border border-dashed bg-secondary/50 shadow-none">
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col items-center justify-center p-6">
                  {files.length === 0 ? (
                    <FileUpload
                      accept={{
                        "image/png": [".png"],
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/webp": [".webp"],
                        "image/heic": [".heic"],
                      }}
                      onFilesSelected={(newFiles) => setFiles(newFiles)}
                    />
                  ) : (
                    <SelectedFileList files={files} onRemove={removeFile} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <Card className="min-h-[320px] border-2 border-border border-dashed bg-secondary/50 shadow-none">
                <CardHeader>
                  <CardTitle>Upload Audio/Video</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col items-center justify-center p-6">
                  {files.length === 0 ? (
                    <FileUpload
                      accept={{
                        "audio/mpeg": [".mp3"],
                        "audio/wav": [".wav"],
                        "audio/m4a": [".m4a"],
                        "video/mp4": [".mp4"],
                        "video/mpeg": [".mpeg"],
                        "video/webm": [".webm"],
                      }}
                      onFilesSelected={(newFiles) => setFiles(newFiles)}
                    />
                  ) : (
                    <SelectedFileList files={files} onRemove={removeFile} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button Area */}
          <div className="mt-8 flex justify-end">
            <div className="flex flex-wrap items-center justify-end gap-4">
              <p className="text-muted-foreground text-sm">
                Use documents with accurate factual information for best
                results.{" "}
              </p>
              <Button
                type="submit"
                disabled={isCreating}
                className="h-10 rounded-2xl px-4 font-semibold"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isCreating ? "Creating..." : "Generate Flashcards"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <FlashcardSettingsSidebar form={form} />
      </form>
    </Form>
  );
}
