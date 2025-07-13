"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useYjs } from "@/lib/providers/yjsProvider";
import { EditorToolbar } from "@/components/editor/EditorToolbar";

interface EditorProps {
  bloqId: string;
  userName: string;
  userColor: string;
  initialContent?: string; // Optional initial content
}

export function Editor({
  bloqId,
  userName,
  userColor,
  initialContent,
}: EditorProps) {
  const { doc, provider, awareness } = useYjs();

  const editor = useCreateBlockNote({
    collaboration: provider
      ? {
          provider,
          // Attach the editor to a specific XML fragment for this bloq
          fragment: doc.getXmlFragment(`blocknote-${bloqId}`),
          // User details for collaboration cursors
          user: {
            name: userName,
            color: userColor,
          },
        }
      : undefined,
    initialContent:
      // Only use initialContent if collaboration is not yet ready and content exists
      !provider && initialContent ? JSON.parse(initialContent) : undefined,
  });

  // A more robust loading state
  if (!editor) {
    return (
      <div className="min-h-[150px] flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-[150px] border border-border rounded-lg overflow-hidden bg-surface">
      <EditorToolbar editor={editor} />
      <div className="p-4 relative">
        <BlockNoteView
          editor={editor}
          className="editor"
          // We can disable these and use our custom toolbar
          sideMenu={false}
          slashMenu={false}
          formattingToolbar={false}
        />
      </div>
    </div>
  );
}
