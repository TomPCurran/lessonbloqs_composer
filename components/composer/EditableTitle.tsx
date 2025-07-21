"use client";

import React, { useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStorage } from "@liveblocks/react";
import {
  useLessonPlanMutations,
  useDocumentActions,
} from "@/lib/hooks/useLessonplanHooks";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Eye } from "lucide-react";
import { useFormStore } from "@/lib/stores/formStore";

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

  // Zustand form store for document editing
  const {
    documentEditing,
    updateDocumentTitle,
    setDocumentEditing,
    resetDocumentEditing,
  } = useFormStore();

  const canEdit = currentUserType === "creator" || currentUserType === "editor";

  // On mount or when lessonPlan changes, sync Zustand title
  useEffect(() => {
    if (lessonPlan?.title) {
      updateDocumentTitle(lessonPlan.title);
    } else if (initialTitle) {
      updateDocumentTitle(initialTitle);
    }
    // Reset editing state on unmount
    return () => {
      resetDocumentEditing();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonPlan, initialTitle]);

  // Debounce the Zustand title value
  const debouncedTitle = useDebounce(documentEditing.title, 500);

  // Effect to update Liveblocks storage and database when debounced title changes
  useEffect(() => {
    if (
      lessonPlan &&
      canEdit &&
      debouncedTitle &&
      debouncedTitle !== lessonPlan.title
    ) {
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
      updateDocumentTitle(e.target.value);
      setDocumentEditing(true);
    },
    [canEdit, updateDocumentTitle, setDocumentEditing]
  );

  return (
    <div className="w-full flex flex-col items-center space-grid-2">
      <div className="relative group w-full max-w-4xl">
        <Input
          type="text"
          value={documentEditing.title ?? ""}
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
