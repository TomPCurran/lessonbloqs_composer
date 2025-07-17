"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStorage } from "@liveblocks/react";
import { useLessonPlanMutations } from "@/lib/hooks/useLessonplanHooks";

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
    <div className="w-full flex flex-col items-center">
      <h1 className="w-full flex justify-center mt-24">
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter Lesson Plan Title"
          disabled={!canEdit}
          className={cn(
            "w-full text-center", // center text in input
            "text-xl sm:text-2xl lg:text-3xl font-extrabold", // smaller but still prominent
            "bg-transparent border-none p-0 m-0",
            "text-foreground placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:ring-0",
            "transition-colors hover:bg-muted/10 rounded-md",
            !canEdit && "cursor-not-allowed opacity-70"
          )}
        />
      </h1>
    </div>
  );
};

export default EditableTitle;
