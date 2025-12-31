"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useMemo } from "react";
import "./editor.css";

import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorToolbar } from "./editor-toolbar";

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  showToolbar?: boolean;
}

export function RichTextEditor({
  content,
  onUpdate,
  placeholder = "Enter text...",
  editable = true,
  className = "",
  showToolbar = true,
}: RichTextEditorProps) {
  const extensions = useMemo(() => {
    return [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ];
  }, [placeholder]);

  const editor = useEditor({
    extensions,
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate(html);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none md:prose-lg !m-0 !max-w-none px-4 py-3 focus:outline-none min-h-12",
      },
    },
  });

  // Update content when prop changes (for external updates)
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`group flex h-auto w-full flex-col transition-colors ${className}`}
    >
      {showToolbar && (
        <EditorToolbar
          editor={editor}
          className="hidden border-border/50 border-b bg-background/50 p-1 group-focus-within:flex"
        />
      )}
      <div className="minimal-tiptap-editor prose max-w-full touch-manipulation overflow-x-hidden whitespace-pre-wrap break-all md:break-words">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
