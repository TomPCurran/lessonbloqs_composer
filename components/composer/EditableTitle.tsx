"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStorage } from "@liveblocks/react";
import { useLessonPlanMutations } from "@/lib/hooks/useLessonplanHooks";
import { Eye } from "lucide-react";

interface EditableTitleProps {
  roomId: string;
  initialTitle?: string;
  currentUserType: "creator" | "editor" | "viewer";
}

const EditableTitle = ({
  roomId,
  initialTitle,
  currentUserType,
}: EditableTitleProps) => {
  const lessonPlan = useStorage((root) => root.lessonPlan);
  const { updateLessonplan, updateDocumentMetadata } =
    useLessonPlanMutations(roomId);

  // Check if user can edit (creators and editors can edit, viewers cannot)
  const canEdit = currentUserType === "creator" || currentUserType === "editor";

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canEdit) return; // Prevent editing if user is viewer
      const newTitle = e.target.value;
      updateLessonplan({ title: newTitle });
      // Also update the document metadata in the database
      updateDocumentMetadata(newTitle);
    },
    [updateLessonplan, updateDocumentMetadata, canEdit]
  );

  // Use the title from Liveblocks storage if available, otherwise fall back to initial title (but allow empty string)
  const title = lessonPlan?.title ?? initialTitle ?? "";

  return (
    <div className="w-full flex flex-col items-center space-grid-2">
      <div className="relative group w-full max-w-4xl">
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder={
            canEdit ? "Enter Lesson Plan Title" : "Untitled Document"
          }
          disabled={!canEdit}
          className={cn(
            "w-full text-center bg-transparent border-none p-grid-2 h-auto",
            "text-display-medium font-normal text-foreground",
            "placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:ring-0",
            "transition-all duration-200",
            canEdit &&
              "hover:bg-surface-variant/30 focus:bg-surface-variant/50",
            canEdit && "rounded-lg",
            !canEdit && "cursor-default opacity-80"
          )}
        />

        {/* Focus indicator - only for editable */}
        {canEdit && (
          <div
            className={cn(
              "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-primary transition-all duration-200",
              "scale-x-0 group-focus-within:scale-x-100"
            )}
          />
        )}

        {/* Read-only indicator */}
        {!canEdit && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-muted/80 text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span className="text-xs font-medium">View Only</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableTitle;
