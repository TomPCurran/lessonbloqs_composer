"use client";

import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLessonPlanMutations } from "@/lib/hooks/useLessonplanHooks";
import { Editor } from "@/components/editor/Editor";
import { getUserColor } from "@/lib/utils";
import { Bloq as BloqType, UserData } from "@/types";

interface BloqProps {
  bloq: BloqType;
  currentUser: UserData;
  currentUserType: "creator" | "editor" | "viewer";
}

export default function Bloq({
  bloq,
  currentUser,
  currentUserType,
}: BloqProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { updateBloq, removeBloq } = useLessonPlanMutations();

  // Check if user can edit (creators and editors can edit, viewers cannot)
  const canEdit = currentUserType === "creator" || currentUserType === "editor";

  // Memoize the user details to prevent unnecessary recalculations
  const userName = React.useMemo(
    () => `${currentUser.firstName} ${currentUser.lastName}`,
    [currentUser.firstName, currentUser.lastName]
  );
  const userColor = React.useMemo(
    () => getUserColor(currentUser.id),
    [currentUser.id]
  );

  // Use useCallback for event handlers to prevent re-creation on re-renders
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canEdit) return; // Prevent editing if user is viewer
      updateBloq(bloq.id, { title: e.target.value });
    },
    [bloq.id, updateBloq, canEdit]
  );

  const handleRemove = useCallback(() => {
    if (!canEdit) return; // Prevent removing if user is viewer
    removeBloq(bloq.id);
  }, [bloq.id, removeBloq, canEdit]);

  const handleFocus = useCallback(() => {
    if (!canEdit) return; // Prevent focus if user is viewer
    setIsFocused(true);
  }, [canEdit]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
    }
  }, []);

  return (
    <Card
      id={`bloq-${bloq.id}`}
      className={cn(
        "group relative w-full rounded-2xl bg-card shadow-lg transition-shadow duration-200",
        "border border-border hover:border-primary/30",
        isFocused &&
          canEdit &&
          "ring-2 ring-primary/20 border-primary/50 shadow-xl",
        !canEdit && "opacity-90 cursor-not-allowed"
      )}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      {/* Remove button - only show for editors and creators */}
      {canEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:bg-destructive/10 z-10"
          aria-label="Remove bloq"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <div className="p-6 space-y-4">
        <Input
          value={bloq.title}
          onChange={handleTitleChange}
          placeholder="Block title..."
          disabled={!canEdit}
          className={cn(
            "w-full text-lg font-semibold bg-transparent border-none px-0 py-1",
            "text-foreground placeholder:text-muted-foreground/70",
            canEdit &&
              "focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md transition-colors hover:bg-muted/10",
            !canEdit && "cursor-not-allowed opacity-70"
          )}
        />

        <div className="min-h-[200px] border-t border-border/20 pt-4">
          <Editor
            key={bloq.id} // Ensure editor re-mounts if bloqId changes unexpectedly
            bloqId={bloq.id}
            userName={userName}
            userColor={userColor}
            initialContent={bloq.content}
            canEdit={canEdit}
          />
        </div>
      </div>
    </Card>
  );
}
