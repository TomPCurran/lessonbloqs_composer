"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStorage } from "@liveblocks/react";
import {
  useLessonPlanMutations,
  useDocumentActions,
} from "@/lib/hooks/useLessonplanHooks";
import { useDebounce } from "@/lib/hooks/use-debounce";
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
  const { updateLessonplan } = useLessonPlanMutations();
  const { updateDocumentMetadata } = useDocumentActions(roomId);

  // Local state for the input field to provide a responsive UI
  const [title, setTitle] = useState(initialTitle ?? "");

  // Debounce the title to avoid excessive updates
  const debouncedTitle = useDebounce(title, 500); // 500ms delay

  const canEdit = currentUserType === "creator" || currentUserType === "editor";

  // Effect to sync Liveblocks storage with local state on initial load
  // This runs when the component mounts and `lessonPlan` becomes available.
  useEffect(() => {
    if (lessonPlan?.title) {
      setTitle(lessonPlan.title);
    }
  }, [lessonPlan]);

  // Effect to update Liveblocks storage and database when debounced title changes
  useEffect(() => {
    // **FIX**: Add a guard to ensure lessonPlan (storage) is loaded before mutating.
    if (lessonPlan && canEdit && debouncedTitle !== lessonPlan.title) {
      updateLessonplan({ title: debouncedTitle });
      updateDocumentMetadata(debouncedTitle);
    }
  }, [
    debouncedTitle,
    canEdit,
    updateLessonplan,
    updateDocumentMetadata,
    lessonPlan,
  ]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canEdit) return;
      setTitle(e.target.value);
    },
    [canEdit]
  );

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
            "text-display-large font-normal text-foreground",
            "placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:ring-0",
            "transition-all duration-200",
            canEdit &&
              "hover:bg-surface-variant/30 focus:bg-surface-variant/50",
            canEdit && "rounded-lg",
            !canEdit && "cursor-default opacity-80"
          )}
        />

        {canEdit && (
          <div
            className={cn(
              "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-primary transition-all duration-200",
              "scale-x-0 group-focus-within:scale-x-100"
            )}
          />
        )}

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
