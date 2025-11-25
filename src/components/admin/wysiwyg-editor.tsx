"use client";

import { Editor, EditorProps } from "react-simple-wysiwyg";
import { cn } from "@/lib/utils";

interface WysiwygEditorProps extends Omit<EditorProps, "containerProps"> {
  className?: string;
}

export function WysiwygEditor({ className, ...props }: WysiwygEditorProps) {
  return (
    <div className={cn("prose-editor", className)}>
      <Editor
        containerProps={{
          style: {
            resize: "vertical",
            minHeight: "300px",
            border: "1px solid #e7e5e4", // stone-200
            borderRadius: "0.5rem",
            fontFamily: "inherit",
          },
        }}
        {...props}
      />
      <style jsx global>{`
        .prose-editor .rsw-toolbar {
          background: #f5f5f4; /* stone-100 */
          border-bottom: 1px solid #e7e5e4; /* stone-200 */
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .prose-editor .rsw-editor {
          background: white;
          border-radius: 0 0 0.5rem 0.5rem;
          padding: 1rem;
          min-height: 300px;
        }
        .prose-editor .rsw-btn {
          color: #57534e; /* stone-600 */
        }
        .prose-editor .rsw-btn:hover {
          background: #e7e5e4; /* stone-200 */
          color: #292524; /* stone-800 */
        }
        .prose-editor .rsw-btn[data-active="true"] {
          background: #e7e5e4; /* stone-200 */
          color: #d97706; /* amber-600 */
        }
      `}</style>
    </div>
  );
}
