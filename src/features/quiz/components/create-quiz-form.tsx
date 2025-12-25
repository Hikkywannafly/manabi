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
import { createClient } from "@/lib/supabase/client";
import { AIService } from "@/services/ai-service";
import { type QuizCreationValues, quizCreationSchema } from "../schema";
import { QuizService } from "../services/quiz-service";
import { FileUpload } from "./file-upload";
import { QuizLoading } from "./quiz-loading";
import { QuizSettingsSidebar } from "./quiz-settings-sidebar";
import { SelectedFileList } from "./selected-file-list";

interface CreateQuizFormProps {
  onGeneratingChange?: (isGenerating: boolean) => void;
}

export function CreateQuizForm({ onGeneratingChange }: CreateQuizFormProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState("");
  const [activeTab, setActiveTab] = useState("file");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<QuizCreationValues>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      visibility: "private",
      language: "english",
      questionType: "mixed",
      numberOfQuestions: "5",
      mode: "quiz",
      difficulty: "medium",
      task: "generate",
      parsingMode: "fast",
      customInstructions: "",
    },
  });

  const supabase = createClient();

  // Subscription cleanup ref
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

  const { mutate: createQuiz, isPending: isCreating } = useMutation({
    mutationFn: async (values: QuizCreationValues) => {
      // 1. Validation & Setup
      let filePath: string | undefined;
      let textContent: string | undefined;

      if (activeTab === "text") {
        textContent = textInput.trim();
        setGenerationStatus("Processing text...");
      } else {
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

      let title = "Generated Quiz";
      if (activeTab === "file" && files[0]) {
        const fileExt = files[0].name.split(".").pop();
        title = files[0].name.replace(`.${fileExt}`, "");
      } else if (activeTab === "text") {
        title = "Text Content Quiz";
      }

      // 2. Create Quiz via Service
      const quiz = await QuizService.createQuiz(
        user.id,
        title,
        activeTab === "file" ? "file" : "text",
        filePath || "direct_text",
        values,
      );

      return { quiz, filePath, textContent };
    },
    onSuccess: async ({ quiz, filePath, textContent }, values) => {
      // Invalidate list so it updates immediately
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });

      // 3. Subscribe to Progress
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }

      subscriptionRef.current = AIService.subscribeToProgress(
        quiz.id,
        (payload) => {
          setGenerationProgress(payload.progress);
          setGenerationStatus(payload.message);

          if (payload.progress === 100) {
            toast.success("Quiz generated successfully!");
            if (subscriptionRef.current) {
              subscriptionRef.current();
              subscriptionRef.current = null;
            }

            setTimeout(() => {
              if (payload.data?.slug) {
                router.push(`/dashboard/quiz/${quiz.id}/${payload.data.slug}`);
              } else {
                router.push(`/dashboard/quiz/${quiz.id}`);
              }
            }, 1000);
          }
        },
      );

      // 4. Trigger AI Service
      try {
        await AIService.generateContent(filePath, textContent, quiz.id, {
          difficulty: (values.difficulty.charAt(0).toUpperCase() +
            values.difficulty.slice(1)) as "Easy" | "Medium" | "Hard",
          numberOfQuestions: parseInt(values.numberOfQuestions, 10),
          questionType: values.questionType,
          language: values.language,
          mode: values.mode,
          parsingMode: values.parsingMode,
          task: values.task,
          customInstructions: values.customInstructions,
        });
      } catch (error) {
        console.error("AI Generation trigger failed", error);
        toast.error("Failed to start AI generation");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Failed to create quiz");
      setIsGenerating(false);
      onGeneratingChange?.(false);
      setGenerationStatus("");
    },
  });

  const onSubmit = (values: QuizCreationValues) => {
    if (activeTab === "file" && files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }
    if (activeTab === "text" && !textInput.trim()) {
      toast.error("Please enter some text.");
      return;
    }

    setIsGenerating(true);
    onGeneratingChange?.(true);
    createQuiz(values);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (isGenerating) {
    return (
      <QuizLoading progress={generationProgress} status={generationStatus} />
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
                disabled
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <LinkIcon className="mr-2 h-4 w-4" /> Link
              </TabsTrigger>
              <TabsTrigger
                value="drive"
                disabled
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {/* Drive Icon placeholder or use existing */}
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
                disabled
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ImageIcon className="mr-2 h-4 w-4" /> Media
              </TabsTrigger>
              <TabsTrigger
                value="image"
                disabled
                className="h-11 rounded-md border border-input bg-background data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ImageIcon className="mr-2 h-4 w-4" /> Image
              </TabsTrigger>
              <TabsTrigger
                value="youtube"
                disabled
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
                {isCreating ? "Creating..." : "Start making quiz"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <QuizSettingsSidebar form={form} />
      </form>
    </Form>
  );
}
