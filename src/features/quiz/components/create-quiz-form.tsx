"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Crown,
  Edit3,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Scale,
  Sparkles,
  Youtube,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  const [textInput, setTextInput] = useState("");
  const [activeTab, setActiveTab] = useState("file");
  const [uploading, setUploading] = useState(false);
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

  const onSubmit = async (values: QuizCreationValues) => {
    // Validation based on active tab
    if (activeTab === "file" && files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }
    if (activeTab === "text" && !textInput.trim()) {
      toast.error("Please enter some text.");
      return;
    }

    try {
      setUploading(true);
      setIsGenerating(true);
      setGenerationStatus("Preparing content...");

      let filePath: string | undefined;
      let textContent: string | undefined;

      // Handle Text Input (Direct - No Storage)
      if (activeTab === "text") {
        textContent = textInput.trim();
        setGenerationStatus("Processing text...");
      } else {
        // Handle File Upload
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

      setUploading(false);
      setGenerationStatus("Initializing AI Generation...");

      // 2. Create Quiz Record (Draft/Generating)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Default Title
      let title = "Generated Quiz";
      if (activeTab === "file" && files[0]) {
        const fileExt = files[0].name.split(".").pop();
        title = files[0].name.replace(`.${fileExt}`, "");
      } else if (activeTab === "text") {
        title = "Text Content Quiz";
      }

      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          owner_id: user.id,
          title: title,
          status: "generating",
          source_type: activeTab === "file" ? "file" : "text",
          source_content: filePath || "direct_text",
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
            if (payload.data?.slug) {
              router.push(`/dashboard/quiz/${quizId}/${payload.data.slug}`);
            } else {
              router.push(`/dashboard/quiz/${quizId}`);
            }
          }, 1000);
        }
      });

      // 4. Trigger AI Service
      await AIService.generateContent(filePath, textContent, quizId, {
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
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
          <Sparkles className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-8 w-8 animate-pulse text-primary" />
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
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 grid w-full grid-cols-5">
              <TabsTrigger value="file">
                <FileText className="mr-2 h-4 w-4" /> File
              </TabsTrigger>
              <TabsTrigger value="text">
                <Edit3 className="mr-2 h-4 w-4" /> Text
              </TabsTrigger>
              <TabsTrigger value="link" disabled>
                <LinkIcon className="mr-2 h-4 w-4" /> Link
              </TabsTrigger>
              <TabsTrigger value="image" disabled>
                <ImageIcon className="mr-2 h-4 w-4" /> Image
              </TabsTrigger>
              <TabsTrigger value="youtube" disabled>
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
                            ×
                          </Button>
                        </div>
                      ))}
                      <div className="pt-2 text-center">
                        <p className="text-muted-foreground text-xs">
                          Supports PDF, DOCX, PPTX, TXT (Max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="text">
              <Card>
                <CardHeader>
                  <CardTitle>Paste Text Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste your study notes, articles, or summary here..."
                    className="min-h-[300px]"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Parsing Mode */}
              <FormField
                control={form.control}
                name="parsingMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parsing Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fast">
                          <div className="flex items-center">
                            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>Fast (Text Only)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="balanced">
                          <div className="flex items-center">
                            <Scale className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Balanced (Recommended)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="premium">
                          <div className="flex items-center">
                            <Crown className="mr-2 h-4 w-4 text-purple-500" />
                            <span>Premium (Deep Analysis)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Task */}
              <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="generate">Generate Quiz</SelectItem>
                        <SelectItem value="extract">
                          Extract Quiz (from existing)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

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
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Mode */}
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quiz">
                          Quiz (Immediate Feedback)
                        </SelectItem>
                        <SelectItem value="exam">
                          Exam (End Feedback)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Language */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="vietnamese">Vietnamese</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="auto">Auto Detect</SelectItem>
                      </SelectContent>
                    </Select>
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
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Question Type */}
              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="multiple_choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                        <SelectItem value="fill_in_blank">
                          Fill in Blank
                        </SelectItem>
                        <SelectItem value="short_answer">
                          Short Answer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Number of Questions */}
              <FormField
                control={form.control}
                name="numberOfQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Questions Count</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                        <SelectItem value="20">20 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Custom Instructions */}
              <FormField
                control={form.control}
                name="customInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. 'Focus on strict definitions'"
                        className="h-20 resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? "Uploading..." : "Generate Quiz"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
