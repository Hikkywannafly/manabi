"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  CheckSquare,
  Italic,
  Link,
  List,
  ListOrdered,
  Redo,
  Underline,
  Undo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty URL
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Set link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const setHeading = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number.parseInt(value, 10) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const getCurrentHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "1";
    if (editor.isActive("heading", { level: 2 })) return "2";
    if (editor.isActive("heading", { level: 3 })) return "3";
    return "paragraph";
  };

  return (
    <TooltipProvider>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b bg-muted/30 p-1 backdrop-blur-md">
        <div className="px-1">
          <Select value={getCurrentHeading()} onValueChange={setHeading}>
            <SelectTrigger className="h-8 w-[130px] border-none bg-transparent hover:bg-black/5 focus:ring-0 dark:hover:bg-white/5">
              <SelectValue placeholder="Text Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Normal</SelectItem>
              <SelectItem value="1">Heading 1</SelectItem>
              <SelectItem value="2">Heading 2</SelectItem>
              <SelectItem value="3">Heading 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className="h-8 w-8 p-0"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              className="h-8 w-8 p-0"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("underline")}
              onPressedChange={() =>
                editor.chain().focus().toggleUnderline().run()
              }
              className="h-8 w-8 p-0"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              className="h-8 w-8 p-0"
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Numbered List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("taskList")}
              onPressedChange={() =>
                editor.chain().focus().toggleTaskList().run()
              }
              className="h-8 w-8 p-0"
            >
              <CheckSquare className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Checklist</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("link") && "bg-accent text-accent-foreground",
              )}
              onClick={addLink}
            >
              <Link className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert Link</TooltipContent>
        </Tooltip>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
