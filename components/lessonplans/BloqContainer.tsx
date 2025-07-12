"use client";

import React, { memo, useEffect } from "react";
import Bloq from "@/components/lessonplans/Bloq";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStorage, useMutation, useStatus } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";

interface BloqData {
  id: string;
  title: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  order: number;
}

interface BloqContainerProps {
  bloqs: readonly BloqData[];
  title: string;
  onTitleChange: (newTitle: string) => void;
  onUpdate: (id: string, updates: Partial<BloqData>) => void;
  onRemove: (id: string) => void;
  currentUser: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
}

const BloqContainer = memo(function BloqContainer({
  bloqs,
  title,
  onTitleChange,
  onUpdate,
  onRemove,
  currentUser,
}: BloqContainerProps) {
  const lessonPlan = useStorage((root) => root.lessonPlan);
  const liveBloqs = useStorage((root) => root.bloqs);
  const status = useStatus();

  // Mutations for updating lesson plan and bloqs
  const updateLessonPlan = useMutation(
    ({ storage }, updates: { title?: string; description?: string }) => {
      const lessonPlan = storage.get("lessonPlan");
      if (lessonPlan) {
        lessonPlan.update({
          ...updates,
          updatedAt: Date.now(),
        });
      }
    },
    []
  );

  const updateBloq = useMutation(
    ({ storage }, bloqId: string, updates: Partial<BloqData>) => {
      const bloqs = storage.get("bloqs");
      const bloqIndex = bloqs.findIndex((bloq) => bloq.get("id") === bloqId);

      if (bloqIndex !== -1) {
        const bloq = bloqs.get(bloqIndex);
        if (bloq) {
          bloq.update({
            ...updates,
            updatedAt: Date.now(),
          });
        }
      }
    },
    []
  );

  const removeBloq = useMutation(({ storage }, bloqId: string) => {
    const bloqs = storage.get("bloqs");
    const bloqIndex = bloqs.findIndex((bloq) => bloq.get("id") === bloqId);

    if (bloqIndex !== -1) {
      bloqs.delete(bloqIndex);
    }
  }, []);

  // Debug: Check for duplicate bloq IDs
  useEffect(() => {
    const ids = (bloqs || []).map((b) => b.id);
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    console.log("[BloqContainer] Current bloq IDs:", ids);
    if (duplicates.length > 0) {
      console.warn("[BloqContainer] Duplicate bloq IDs detected!", duplicates);
    }
  }, [bloqs]);

  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    updateLessonPlan({ title: newTitle });
    onTitleChange(newTitle);
  };

  // Handle bloq updates
  const handleBloqUpdate = (id: string, updates: Partial<BloqData>) => {
    updateBloq(id, updates);
    onUpdate(id, updates);
  };

  // Handle bloq removal
  const handleBloqRemove = (id: string) => {
    removeBloq(id);
    onRemove(id);
  };

  // Use live bloqs if available, otherwise fall back to props
  const displayBloqs = liveBloqs || bloqs;
  const displayTitle = lessonPlan?.title || title;

  if (status !== "connected") {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Connecting to collaboration room...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Input
          type="text"
          value={displayTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
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

      {/* Bloqs List or Empty State */}
      {displayBloqs && displayBloqs.length > 0 ? (
        <div className="space-y-6">
          {displayBloqs.map((bloq) => {
            const bloqData =
              bloq instanceof LiveObject ? bloq.toObject() : bloq;
            console.log("Bloq ID:", bloqData.id);
            return (
              <div key={bloqData.id} className="relative group">
                <Bloq
                  id={bloqData.id}
                  title={bloqData.title}
                  onUpdate={(updates) => handleBloqUpdate(bloqData.id, updates)}
                  onRemove={() => handleBloqRemove(bloqData.id)}
                  currentUser={currentUser}
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 space-y-3 rounded-lg border-2 border-dashed border-border/50 bg-muted/20">
          <p className="text-sm font-medium text-muted-foreground">
            Start building your lesson plan
          </p>
          <p className="text-xs text-muted-foreground/80">
            Click <span className="font-semibold">+ Bloqs</span> above to add
            your first block
          </p>
        </div>
      )}
    </div>
  );
});

BloqContainer.displayName = "BloqContainer";
export default BloqContainer;
