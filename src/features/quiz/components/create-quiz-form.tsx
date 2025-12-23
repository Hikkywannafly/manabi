"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit3,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { AIService } from "@/services/ai-service";
import { type QuizCreationValues, quizCreationSchema } from "../schema";
import { FileUpload } from "./file-upload";

export function CreateQuizForm() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<QuizCreationValues>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      visibility: "private",
      language: "auto",
      questionType: "mixed",
      numberOfQuestions: "5",
      mode: "quiz",
      difficulty: "medium",
      task: "generate_quiz",
      parsingMode: "fast",
      customInstructions: "",
    },
  });

  const supabase = createClient();

  const onSubmit = async (values: QuizCreationValues) => {
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    try {
      setUploading(true);
      setIsGenerating(true);
      setGenerationStatus("Uploading files...");

      // 1. Upload File (Supporting single file for MVP, logic can be loop for multiple)
      const file = files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      setUploading(false);
      setGenerationStatus("Initializing AI Generation...");

      // 2. Create Quiz Record (Draft/Generating)
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          owner_id: user.id,
          title: file.name.replace(`.${fileExt}`, ""), // Default title from filename
          status: "generating",
          source_type: "pdf", // Todo: Detect from mime
          source_content: filePath,
          generation_params: values,
        })
        .select()
        .single();

      if (quizError)
        throw new Error(`Quiz creation failed: ${quizError.message}`);

      const quizId = quiz.id;

      // 3. Subscribe to Progress
      const _unsubscribe = AIService.subscribeToProgress(quizId, (payload) => {
        setGenerationProgress(payload.progress);
        setGenerationStatus(payload.message);

        if (payload.progress === 100) {
          toast.success("Quiz generated successfully!");
          // Redirect after a short delay
          setTimeout(() => {
            router.push(`/dashboard/quiz/${quizId}`);
          }, 1000);
        }
      });

      // 4. Trigger AI Service
      await AIService.generateContent(filePath, quizId, {
        difficulty: values.difficulty as any,
        numberOfQuestions: parseInt(values.numberOfQuestions, 10),
        questionType:
          values.questionType === "mixed" ? "Mixed" : "Multiple Choice", // Mapping needed
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
      setIsGenerating(false);
      setGenerationStatus("");
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (isGenerating) {
    return (
      <div className="fade-in zoom-in flex min-h-[400px] animate-in flex-col items-center justify-center space-y-6 text-center duration-500">
        <div className="relative">
          {/* Spinner or Animation */}
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
        </div>
        <div className="w-full max-w-md space-y-2">
          <h3 className="font-semibold text-xl">Generating your quiz...</h3>
          <p className="text-muted-foreground text-sm">
            {generationStatus || "Please wait..."}
          </p>
          <Progress value={generationProgress} className="h-2" />
          <p className="text-right text-muted-foreground text-xs">
            {generationProgress}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {/* Left Column: Source Input */}
        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-5">
              <TabsTrigger value="file">
                <FileText className="mr-2 h-4 w-4" /> File
              </TabsTrigger>
              <TabsTrigger value="text">
                <Edit3 className="mr-2 h-4 w-4" /> Text
              </TabsTrigger>
              <TabsTrigger value="link">
                <LinkIcon className="mr-2 h-4 w-4" /> Link
              </TabsTrigger>
              <TabsTrigger value="image">
                <ImageIcon className="mr-2 h-4 w-4" /> Image
              </TabsTrigger>
              <TabsTrigger value="youtube">
                <Youtube className="mr-2 h-4 w-4" /> YouTube
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  {files.length === 0 ? (
                    <FileUpload
                      onFilesSelected={(newFiles) => setFiles(newFiles)}
                    />
                  ) : (
                    <div className="space-y-2">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md border bg-muted/20 p-3"
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
                            onClick={() => removeFile(idx)}
                            type="button"
                          >
                            This isn't correct x
                          </Button>
                        </div>
                      ))}
                      <div className="pt-2 text-center">
                        <p className="text-muted-foreground text-xs">
                          Up to 10 files, 20 MB total
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Other Tabs Placeholders */}
            <TabsContent value="text">
              <div className="rounded border p-10 text-center">
                Text Input Coming Soon
              </div>
            </TabsContent>
            <TabsContent value="link">
              <div className="rounded border p-10 text-center">
                Link Input Coming Soon
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            {/* Error Summary if needed */}
            <div className="text-red-500 text-sm">
              {Object.keys(form.formState.errors).length > 0 &&
                "Please fix errors on the right."}
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-5">
          {/* Visibility */}
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Language */}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language of the quiz</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="auto">Auto detect</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Vietnamese</SelectItem>
                    <SelectItem value="jp">Japanese</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question Type */}
          <FormField
            control={form.control}
            name="questionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="multiple_choice">MCQs</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="fill_in_blank">Fill in Blank</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Questions */}
          <FormField
            control={form.control}
            name="numberOfQuestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of questions</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="5">5-10</SelectItem>
                    <SelectItem value="10">10-15</SelectItem>
                    <SelectItem value="20">20+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Difficulty */}
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom Instructions */}
          <FormField
            control={form.control}
            name="customInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Instructions (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Focus on definitions', 'Use simple language'"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Start making quiz"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
