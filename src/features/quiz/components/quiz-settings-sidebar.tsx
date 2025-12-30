"use client";

import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { LanguageCombobox } from "@/components/ui/language-combobox";
import { QuestionTypeMultiSelect } from "@/components/ui/question-type-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { QuizCreationValues } from "../schema";

interface QuizSettingsSidebarProps {
  form: UseFormReturn<QuizCreationValues>;
}

export function QuizSettingsSidebar({ form }: QuizSettingsSidebarProps) {
  return (
    <div className="sticky top-20 h-fit space-y-5">
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="space-y-4 border-none bg-transparent p-0">
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
                    <SelectTrigger className="w-full bg-secondary">
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

          {/* Language - Searchable Combobox */}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language of the quiz</FormLabel>
                <FormControl>
                  <LanguageCombobox
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Question Type - Multi-select */}
          <FormField
            control={form.control}
            name="questionTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Types</FormLabel>
                <FormControl>
                  <QuestionTypeMultiSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
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
                    <SelectTrigger className="w-full bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="5">5-10</SelectItem>
                    <SelectItem value="10">10-15</SelectItem>
                    <SelectItem value="20">20+</SelectItem>
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
                    <SelectTrigger className="w-full bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
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
                    <SelectTrigger className="w-full bg-secondary">
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
                    <SelectTrigger className="w-full bg-secondary">
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
                    <SelectTrigger className="w-full bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fast">
                      <div className="flex w-full items-center">
                        <span>Fast (Text Only)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="balanced">
                      <div className="flex w-full items-center">
                        <span>Balanced (Recommended)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="premium">
                      <div className="flex w-full items-center">
                        <span>Premium (Deep Analysis)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 flex items-center gap-4 rounded-md border border-yellow-500 bg-yellow-100 p-4 text-yellow-900 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100">
                  <p className="text-sm">
                    Fast mode skips images and tables. Use Balanced mode if
                    material has them, but processing will take longer.
                  </p>
                </div>
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
                    placeholder="e.g. 'Focus on strict definitions'"
                    className="min-h-[80px] resize-none bg-secondary"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
