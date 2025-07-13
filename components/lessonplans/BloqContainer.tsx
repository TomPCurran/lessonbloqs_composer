"use client";

import React, { useCallback } from "react";
import Bloq from "@/components/lessonplans/Bloq";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStorage } from "@liveblocks/react";
import { useLessonPlanMutations } from "@/lib/hooks/useLessonplanHooks";
import { LiveObject } from "@liveblocks/client";
import { Bloq as BloqType, UserData } from "@/types"; // Assuming UserData is in your types

interface BloqContainerProps {
  currentUser: UserData;
  roomId?: string;
}

const BloqContainer = ({ currentUser, roomId }: BloqContainerProps) => {
  // Directly use live data from Liveblocks storage
  const lessonPlan = useStorage((root) => root.lessonPlan);
  const bloqs = useStorage((root) => root.bloqs);
  const { updateLessonplan, updateDocumentMetadata } =
    useLessonPlanMutations(roomId);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      updateLessonplan({ title: newTitle });
      // Also update the document metadata in the database
      updateDocumentMetadata(newTitle);
    },
    [updateLessonplan, updateDocumentMetadata]
  );

  // Render a loading or empty state until data is available
  if (!lessonPlan || !bloqs) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading lesson plan...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Input
          type="text"
          value={lessonPlan.title}
          onChange={handleTitleChange}
          placeholder="Enter Lesson Plan Title"
          className={cn(
            "w-full text-3xl font-bold bg-transparent border-none p-0",
            "text-foreground placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:ring-0",
            "transition-colors hover:bg-muted/10 rounded-md"
          )}
        />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {bloqs.length > 0 ? (
        <div className="space-y-6">
          {bloqs.map((bloq) => {
            // Ensure we are working with a plain object
            const bloqData =
              bloq instanceof LiveObject ? bloq.toObject() : bloq;
            return (
              <div key={bloqData.id} className="relative group">
                <Bloq bloq={bloqData as BloqType} currentUser={currentUser} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3 rounded-lg border-2 border-dashed border-border/50 bg-muted/20">
          <p className="text-sm font-medium text-muted-foreground">
            Start building your lesson plan
          </p>
          <p className="text-xs text-muted-foreground/80">
            Click <span className="font-semibold">+ Bloqs</span> to add your
            first block.
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(BloqContainer);
