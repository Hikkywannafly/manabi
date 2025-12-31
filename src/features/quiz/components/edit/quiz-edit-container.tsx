"use client";

import { ArrowLeft, Plus, Save, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { QuizService } from "../../services/quiz-service";
import type { Quiz, QuizQuestion } from "../../types";
import { QuestionEditor } from "./question-editor";

interface QuizEditContainerProps {
  quiz: Quiz;
  questions: QuizQuestion[];
}

export function QuizEditContainer({
  quiz,
  questions: initialQuestions,
}: QuizEditContainerProps) {
  const router = useRouter();
  const [title, setTitle] = useState(quiz.title);
  const [questions, setQuestions] = useState(initialQuestions);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteQuizDialog, setShowDeleteQuizDialog] = useState(false);

  const handleDeleteQuiz = async () => {
    try {
      await QuizService.deleteQuiz(quiz.id);
      toast.success("Quiz deleted successfully");
      router.push("/dashboard/quiz");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setShowDeleteQuizDialog(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Partial<QuizQuestion> = {
      id: `temp-${Date.now()}`,
      quiz_id: quiz.id,
      question_text: "",
      options: JSON.stringify([
        { id: "option-0", text: "" },
        { id: "option-1", text: "" },
      ]),
      correct_answer: "option-0",
      order_index: questions.length,
      question_type: "multiple_choice",
    };
    setQuestions([...questions, newQuestion as QuizQuestion]);
  };

  const handleUpdateQuestion = useCallback(
    (id: string, updates: Partial<QuizQuestion>) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...updates } : q)),
      );
    },
    [],
  );

  const handleDeleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      // Update order indices
      return updated.map((q, i) => ({ ...q, order_index: i }));
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await QuizService.updateQuiz(quiz.id, { title, questions });
      toast.success("Quiz saved successfully");
      router.push(`/dashboard/quiz/${quiz.id}/${quiz.slug}/take?mode=test`);
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="relative min-h-screen bg-background">
        {/* Sticky Action Bar - Full Width */}
        <div className="sticky top-0 z-20 flex w-full items-center justify-end gap-2 border-b bg-background/95 px-3 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:gap-3 md:px-8">
          <Link href={`/dashboard/quiz/${quiz.id}/${quiz.slug}/take?mode=test`}>
            <Button
              variant="outline"
              className="h-10 min-h-10 min-w-10 rounded-2xl px-4 py-2"
              type="button"
            >
              <ArrowLeft className="size-4 md:mr-2" />
              <span className="hidden md:inline">Back to Quiz</span>
            </Button>
          </Link>

          <Button
            variant="destructive"
            className="h-9 rounded-2xl px-3"
            onClick={() => setShowDeleteQuizDialog(true)}
          >
            <Trash className="size-4 md:mr-2" />
            <span className="hidden md:block">Delete Quiz</span>
          </Button>

          <Button
            variant="secondary"
            className="h-10 min-h-10 min-w-10 rounded-2xl px-4 py-2"
            onClick={handleAddQuestion}
          >
            <Plus className="size-4 md:mr-2" />
            <span className="hidden md:inline">Add Question</span>
          </Button>

          <Button
            className="h-10 min-h-10 min-w-10 rounded-2xl px-4 py-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="size-4 md:mr-2" />
            <p className="hidden md:inline">
              {isSaving ? "Saving..." : "Save changes"}
            </p>
          </Button>
        </div>

        {/* Content Container - Centered */}
        <div className="container mx-auto max-w-7xl py-8 md:px-0">
          {/* Quiz Title Editor */}
          <div className="rounded-xl bg-secondary/50 p-4">
            <div className="mb-4 block font-semibold text-lg">Quiz title</div>
            <RichTextEditor
              content={title}
              onUpdate={setTitle}
              placeholder="Enter quiz title..."
              className="rounded-md border border-input bg-secondary/80"
            />
          </div>

          {/* Questions List */}
          <div className="mt-4">
            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                onUpdate={handleUpdateQuestion}
                onDelete={handleDeleteQuestion}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Delete Quiz Dialog */}
      <AlertDialog
        open={showDeleteQuizDialog}
        onOpenChange={setShowDeleteQuizDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz and all associated questions and attempts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuiz}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
