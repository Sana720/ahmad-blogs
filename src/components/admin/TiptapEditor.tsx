"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import React from 'react';

export default function TiptapEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded bg-white text-[#232946]">
      <EditorContent editor={editor} />
    </div>
  );
}
