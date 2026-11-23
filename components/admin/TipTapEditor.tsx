"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-image";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-orange-500/20 text-orange-400"
          : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  // Lets the paste/drop handlers (created once) reach the latest upload function.
  const insertFilesRef = useRef<(files: File[], pos?: number) => void>(() => {});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder: "Start writing your story…" }),
    ],
    content,
    editorProps: {
      handlePaste(_view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (files.length === 0) return false;
        event.preventDefault();
        insertFilesRef.current(files);
        return true;
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (files.length === 0) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        insertFilesRef.current(files, pos);
        return true;
      },
      attributes: {
        class:
          "min-h-[400px] rounded-b-xl border border-t-0 border-zinc-700 bg-zinc-900 px-5 py-4 text-sm leading-relaxed text-zinc-200 outline-none focus:ring-1 focus:ring-orange-500/50 [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-5 [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-400 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-orange-400 [&_pre]:rounded-lg [&_pre]:bg-zinc-800 [&_pre]:p-4 [&_pre]:text-sm [&_a]:text-orange-400 [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-700 [&_td]:p-2 [&_th]:border [&_th]:border-zinc-700 [&_th]:bg-zinc-800 [&_th]:p-2 [&_th]:font-semibold [&_hr]:border-zinc-700 [&_hr]:my-6",
      },
    },
    onUpdate({ editor: e }) {
      onChange(e.getHTML());
    },
    immediatelyRender: false,
  });

  const insertFiles = useCallback(
    async (files: File[], pos?: number) => {
      if (!editor || files.length === 0) return;
      setImageError("");
      setUploading(true);
      try {
        for (const file of files) {
          const src = await uploadImage(file);
          const alt =
            window.prompt("Describe this image (alt text, good for SEO):", "") ?? "";
          const chain = editor.chain().focus();
          if (typeof pos === "number") chain.setTextSelection(pos);
          chain.setImage({ src, alt }).run();
        }
      } catch (e) {
        setImageError(e instanceof Error ? e.message : "Image upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [editor],
  );
  insertFilesRef.current = insertFiles;

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = () => insertFiles(Array.from(input.files ?? []));
    input.click();
  }, [insertFiles]);

  const addImageFromUrl = useCallback(() => {
    if (!editor) return;
    const src = window.prompt("Image URL (https://…)", "");
    if (!src) return;
    const alt = window.prompt("Describe this image (alt text):", "") ?? "";
    editor.chain().focus().setImage({ src: src.trim(), alt }).run();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="h-[460px] animate-pulse rounded-xl border border-zinc-700 bg-zinc-900" />
    );
  }

  return (
    <div>
      <div role="toolbar" aria-label="Text formatting" className="flex flex-wrap gap-1 rounded-t-xl border border-zinc-700 bg-zinc-800/50 px-2 py-1.5">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} label="Strikethrough">
          <s>S</s>
        </ToolbarButton>
        <span className="mx-1 w-px bg-zinc-700" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Heading 2">
          H2
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Heading 3">
          H3
        </ToolbarButton>
        <span className="mx-1 w-px bg-zinc-700" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet list">
          &bull; List
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Ordered list">
          1. List
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Quote">
          &ldquo; Quote
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} label="Code block">
          {"</>"}
        </ToolbarButton>
        <span className="mx-1 w-px bg-zinc-700" />
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} label="Link">
          Link
        </ToolbarButton>
        <ToolbarButton onClick={addImage} label="Upload image from your computer">
          {uploading ? "Uploading…" : "🖼️ Upload image"}
        </ToolbarButton>
        <ToolbarButton onClick={addImageFromUrl} label="Insert image from a URL">
          Image URL
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          active={editor.isActive("table")}
          label="Table"
        >
          Table
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Divider">
          ―
        </ToolbarButton>
      </div>
      {imageError && (
        <p className="border-x border-zinc-700 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {imageError}
        </p>
      )}
      <EditorContent editor={editor} />
      <p className="mt-1 text-xs text-zinc-500">
        Tip: click where you want the picture, then use “Upload image” — or just
        paste / drag an image into the text.
      </p>
    </div>
  );
}
