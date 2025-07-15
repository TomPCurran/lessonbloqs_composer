"use client";

import React, { useCallback } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLessonPlanMutations } from "@/lib/hooks/useLessonplanHooks";
import { Editor } from "@/components/editor/Editor";
import { getUserColor } from "@/lib/utils";
import { Bloq as BloqType, UserData } from "@/types";
import { useUser } from "@clerk/nextjs";

interface BloqProps {
  bloq: BloqType;
  currentUser: UserData;
}

// Use React.memo to prevent unnecessary re-renders
const Bloq = React.memo(function Bloq({ bloq, currentUser }: BloqProps) {
  const { updateBloq, removeBloq } = useLessonPlanMutations();
  const { user } = useUser();

  const userName = React.useMemo(
    () => `${currentUser.firstName} ${currentUser.lastName}`,
    [currentUser.firstName, currentUser.lastName]
  );
  const userColor = React.useMemo(
    () => getUserColor(currentUser.id),
    [currentUser.id]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateBloq(bloq.id, { title: e.target.value });
    },
    [bloq.id, updateBloq]
  );

  const handleRemove = useCallback(() => {
    removeBloq(bloq.id);
  }, [bloq.id, removeBloq]);

  return (
    <Card
      id={`bloq-${bloq.id}`}
      // We now use `focus-within` to apply styles, which doesn't cause a re-render.
      className={cn(
        "group relative w-full rounded-2xl bg-card shadow-lg transition-shadow duration-200",
        "border border-border hover:border-primary/30",
        "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 focus-within:shadow-xl"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:bg-destructive/10 z-10"
        aria-label="Remove bloq"
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="p-6 space-y-4">
        <Input
          value={bloq.title}
          onChange={handleTitleChange}
          placeholder="Block title..."
          className={cn(
            "w-full text-lg font-semibold bg-transparent border-none px-0 py-1",
            "text-foreground placeholder:text-muted-foreground/70",
            "focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md transition-colors hover:bg-muted/10"
          )}
        />

        <div className="w-full h-full">
          {user && (
            <Editor
              key={bloq.id}
              bloqId={bloq.id}
              userName={userName}
              userColor={userColor}
              initialContent={bloq.content}
            />
          )}
        </div>
      </div>
    </Card>
  );
});

export default Bloq;
