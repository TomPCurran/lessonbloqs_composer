"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useYjs } from "@/lib/providers/yjsProvider";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { cn } from "@/lib/utils";
import React from "react";
import { FileText, Eye } from "lucide-react";

interface EditorProps {
  bloqId: string;
  userName: string;
  userColor: string;
  initialContent?: string; // Optional initial content
  canEdit: boolean; // Whether the user can edit this content
}

// Material Design Loading State
const EditorLoadingState = () => (
  <div className="min-h-[150px] flex items-center justify-center space-grid-3">
    <div className="text-center space-grid-2">
      <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
        <FileText className="w-6 h-6 text-primary animate-pulse" />
      </div>
      <div className="space-grid-1">
        <div className="h-2 bg-muted rounded w-24 mx-auto animate-pulse" />
        <p className="text-body-small text-muted-foreground">
          Loading editor...
        </p>
      </div>
    </div>
  </div>
);

export function Editor({
  bloqId,
  userName,
  userColor,
  initialContent,
  canEdit,
}: EditorProps) {
  const yjsContext = useYjs();
  const doc = yjsContext?.doc;
  const provider = yjsContext?.provider;

  const editor = useCreateBlockNote({
    collaboration:
      provider && doc
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
      (!provider || !doc) && initialContent
        ? JSON.parse(initialContent)
        : undefined,
  });

  // Disable editing for viewers
  React.useEffect(() => {
    if (editor) {
      editor.isEditable = canEdit;
    }
  }, [editor, canEdit]);

  // A more robust loading state
  if (!editor) {
    return <EditorLoadingState />;
  }

  return (
    <div
      className={cn(
        "google-card overflow-hidden transition-all duration-200",
        canEdit && "focus-within:elevation-2 focus-within:border-primary/30",
        "group relative",
        !canEdit && "opacity-90"
      )}
    >
      {/* Toolbar - only show for editable editors */}
      {canEdit && (
        <div className="google-surface border-b border-border/30">
          <EditorToolbar editor={editor} />
        </div>
      )}

      {/* Read-only indicator */}
      {!canEdit && (
        <div className="google-surface border-b border-border/30 px-grid-3 py-grid-2">
          <div className="flex items-center gap-grid-2 text-body-small text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>Read-only mode</span>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative min-h-[150px]">
        {/* Focus indicator - only for editable editors */}
        {canEdit && (
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-opacity duration-200",
              "bg-gradient-to-r from-primary/2 via-transparent to-primary/2",
              "opacity-0 group-focus-within:opacity-100"
            )}
          />
        )}

        <div className="relative p-grid-3">
          <BlockNoteView
            editor={editor}
            className={cn(
              "editor-container bg-transparent",
              "prose prose-sm max-w-none",
              "text-body-large text-foreground",
              "[&_.bn-editor]:bg-transparent",
              "[&_.bn-editor]:border-none",
              "[&_.bn-editor]:shadow-none",
              "[&_.bn-editor]:outline-none",
              // Read-only styling
              !canEdit && "[&_.bn-editor]:cursor-default",
              !canEdit && "select-text"
            )}
            sideMenu={false}
            slashMenu={false}
            formattingToolbar={false} // We use custom toolbar
          />
        </div>

        {/* User indicator */}
        <div
          className={cn(
            "absolute bottom-grid-1 right-grid-2 transition-opacity duration-200",
            canEdit ? "opacity-0 group-focus-within:opacity-100" : "opacity-60"
          )}
        >
          <div className="flex items-center gap-grid-1 text-body-small text-muted-foreground">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: userColor }}
            />
            <span>
              {canEdit ? `Editing as ${userName}` : `Viewing as ${userName}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
