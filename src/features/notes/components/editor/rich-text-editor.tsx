"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { EditorToolbar } from "./toolbar";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing your thoughts...",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[60vh] px-2 py-4 selection:bg-primary/20",
      },
    },
  });

  // Update content when it changes externally (e.g., when selecting a different note)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-5 py-6">
          <style jsx global>{`
            .tiptap p.is-editor-empty:first-child::before {
              color: #adb5bd;
              content: attr(data-placeholder);
              float: left;
              height: 0;
              pointer-events: none;
            }
            .tiptap ul[data-type="taskList"] {
              list-style: none;
              padding: 0;
            }
            .tiptap ul[data-type="taskList"] li {
              display: flex;
              align-items: flex-start;
              margin-bottom: 0.5rem;
            }
            .tiptap ul[data-type="taskList"] li > label {
              flex: 0 0 auto;
              margin-right: 0.75rem;
              user-select: none;
            }
            .tiptap ul[data-type="taskList"] li > div {
              flex: 1 1 auto;
            }
            .tiptap ul[data-type="taskList"] input[type="checkbox"] {
              cursor: pointer;
              width: 1.4rem;
              height: 1.4rem;
              margin-top: 0.2rem;
              border-radius: 4px;
              border: 2px solid var(--primary);
            }
            .tiptap ul:not([data-type="taskList"]) {
              list-style-type: disc;
              padding-left: 1.5rem;
              margin: 1.25rem 0;
            }
            .tiptap ol {
              list-style-type: decimal;
              padding-left: 1.5rem;
              margin: 1.25rem 0;
            }
            .tiptap blockquote {
              border-left: 4px solid var(--primary);
              background: rgba(var(--primary-rgb), 0.05);
              padding: 1rem 1.5rem;
              font-style: italic;
              margin: 1.5rem 0;
              border-radius: 0 8px 8px 0;
            }
            .tiptap a {
              color: var(--primary);
              text-decoration: underline;
              text-underline-offset: 4px;
              transition: all 0.2s;
            }
            .tiptap a:hover {
              opacity: 0.8;
            }
            .tiptap h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem; color: var(--foreground); }
            .tiptap h2 { font-size: 2rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1.5rem; color: var(--foreground); }
            .tiptap h3 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; color: var(--foreground); }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
