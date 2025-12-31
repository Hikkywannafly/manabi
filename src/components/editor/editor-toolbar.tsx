"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  ChevronDown,
  Ellipsis,
  Italic,
  Link as LinkIcon,
  Type,
  Underline as UnderlineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface EditorToolbarProps {
  editor: Editor;
  className?: string;
}

export function EditorToolbar({ editor, className = "" }: EditorToolbarProps) {
  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div
      className={`flex w-full flex-wrap items-center gap-1 border-border border-b p-1.5 px-0.5 md:gap-px md:p-2 md:px-0 ${className}`}
    >
      {/* Text Styles Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 w-12 p-0"
            aria-label="Text styles"
          >
            <Type className="size-5" />
            <ChevronDown className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6 md:mx-2 md:h-7" />

      {/* Bold */}
      <Button
        variant="ghost"
        size="sm"
        className="size-8 p-0"
        onClick={() => editor.chain().focus().toggleBold().run()}
        data-state={editor.isActive("bold") ? "on" : "off"}
        aria-label="Bold"
      >
        <Bold className="size-5" />
      </Button>

      {/* Italic */}
      <Button
        variant="ghost"
        size="sm"
        className="size-8 p-0"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        data-state={editor.isActive("italic") ? "on" : "off"}
        aria-label="Italic"
      >
        <Italic className="size-5" />
      </Button>

      {/* Underline */}
      <Button
        variant="ghost"
        size="sm"
        className="size-8 p-0"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        data-state={editor.isActive("underline") ? "on" : "off"}
        aria-label="Underline"
      >
        <UnderlineIcon className="size-5" />
      </Button>

      {/* More Formatting Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            Strikethrough
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            Code
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6 md:mx-2 md:h-7" />

      {/* Link */}
      <Button
        variant="ghost"
        size="sm"
        className="size-8 p-0"
        onClick={setLink}
        data-state={editor.isActive("link") ? "on" : "off"}
      >
        <LinkIcon className="size-5" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6 md:mx-2 md:h-7" />

      {/* Lists Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullet List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            Numbered List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            Quote
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
