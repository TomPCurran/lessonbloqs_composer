"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useYjs } from "@/lib/providers/yjsProvider";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { cn } from "@/lib/utils";
import React from "react";

interface EditorProps {
  bloqId: string;
  userName: string;
  userColor: string;
  initialContent?: string; // Optional initial content
  canEdit: boolean; // Whether the user can edit this content
}

export function Editor({
  bloqId,
  userName,
  userColor,
  initialContent,
  canEdit,
}: EditorProps) {
  const { doc, provider } = useYjs();

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

  // Disable editing for viewers
  React.useEffect(() => {
    if (editor) {
      editor.isEditable = canEdit;
    }
  }, [editor, canEdit]);

  // A more robust loading state
  if (!editor) {
    return (
      <div className="min-h-[150px] flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-[150px] border border-border rounded-lg overflow-hidden bg-surface",
        !canEdit && "opacity-90"
      )}
    >
      {/* Only show toolbar for editors and creators */}
      {canEdit && <EditorToolbar editor={editor} />}
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
