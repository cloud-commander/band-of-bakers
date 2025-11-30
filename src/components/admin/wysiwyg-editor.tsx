"use client";

import { Editor } from "@tinymce/tinymce-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface WysiwygEditorProps {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  className?: string;
  id?: string;
}

export function WysiwygEditor({ value, onChange, className, id }: WysiwygEditorProps) {
  const editorRef = useRef<unknown>(null);

  return (
    <div id={id} className={cn("min-h-[300px]", className)}>
      <Editor
        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.6.0/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt: unknown, editor: unknown) => (editorRef.current = editor)}
        value={value}
        onEditorChange={(content: string) => {
          onChange({ target: { value: content } });
        }}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          skin: "oxide", // Use default skin
        }}
      />
    </div>
  );
}
