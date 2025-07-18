"use client";

import React, { useState, useCallback, useRef } from "react";
import { X, Grip } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLessonPlanMutations } from "@/lib/hooks/useLessonplanHooks";
import { Editor } from "@/components/editor/Editor";
import { getUserColor } from "@/lib/utils";
import { Bloq as BloqType, UserData } from "@/types";
import { BloqComments } from "@/components/lessonplans/BloqComment";
import { ClientSideSuspense } from "@liveblocks/react/suspense";

interface BloqProps {
  bloq: BloqType;
  currentUser: UserData;
  currentUserType: "creator" | "editor" | "viewer";
}

function Bloq({ bloq, currentUser, currentUserType }: BloqProps) {
  console.log("🧱 [Bloq] Rendering bloq", {
    bloqId: bloq.id,
    bloqTitle: bloq.title,
    userId: currentUser.id,
    currentUserType,
    timestamp: new Date().toISOString(),
  });

  const [isFocused, setIsFocused] = useState(false);
  // Memoize the mutations to prevent unnecessary re-renders
  const mutations = useLessonPlanMutations();
  const { updateBloq, removeBloq } = mutations;
  const bloqRef = useRef<HTMLDivElement>(null);
  const canEdit = currentUserType === "creator" || currentUserType === "editor";

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
    console.log("🧱 [Bloq] Remove bloq clicked", { bloqId: bloq.id, canEdit });
    if (!canEdit) return; // Prevent removing if user is viewer
    console.log("🧱 [Bloq] Calling removeBloq", { bloqId: bloq.id });
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
      ref={bloqRef}
      id={`bloq-${bloq.id}`}
      className={cn(
        "group relative w-full google-card transition-all duration-200",
        canEdit && "hover:elevation-2 focus-within:elevation-3",
        "border-2 border-border/30",
        isFocused && canEdit && "border-primary/50 elevation-3",
        !canEdit && "opacity-90"
      )}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      {/* Action buttons */}
      <div className="absolute top-grid-2 right-grid-2 flex items-center gap-grid-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <ClientSideSuspense fallback={<div className="w-8 h-8" />}>
          {() => <BloqComments bloqId={bloq.id} bloqRef={bloqRef} />}
        </ClientSideSuspense>

        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove bloq"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Drag handle */}
      {canEdit && (
        <div className="absolute top-grid-2 left-grid-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <Grip className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      )}

      {/* Focus indicator */}
      {canEdit && (
        <div
          className={cn(
            "absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-200",
            "bg-gradient-to-r from-primary/5 via-transparent to-primary/5",
            isFocused ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Content */}
      <div className="relative p-grid-4 space-grid-3">
        {/* Title section */}
        <div className="space-grid-1">
          <div className="relative group/title">
            <Input
              value={bloq.title}
              onChange={handleTitleChange}
              placeholder={canEdit ? "Block title..." : "Untitled Block"}
              disabled={!canEdit}
              className={cn(
                "w-full text-headline-medium font-medium bg-transparent border-none px-0 py-1 h-auto",
                "text-foreground placeholder:text-muted-foreground/60",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                canEdit &&
                  "hover:bg-surface-variant/30 focus:bg-surface-variant/50",
                canEdit && "rounded-md px-grid-1 transition-all duration-200",
                !canEdit && "cursor-default opacity-80"
              )}
            />

            {/* Title focus indicator */}
            {canEdit && (
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-200",
                  "scale-x-0 group-focus-within/title:scale-x-100"
                )}
              />
            )}
          </div>
        </div>

        {/* Content separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

        {/* Editor section */}
        <div className="min-h-[200px] relative">
          <div
            className={cn(
              "google-surface rounded-lg p-grid-3 min-h-[180px]",
              !canEdit && "bg-surface-variant/30"
            )}
          >
            <Editor
              key={bloq.id}
              bloqId={bloq.id}
              userName={userName}
              userColor={userColor}
              initialContent={bloq.content}
              canEdit={canEdit}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default React.memo(Bloq);
