// Bloq.tsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLessonPlanMutations } from "@/lib/hooks/useLessonplanHooks";
import { Editor } from "@/components/editor/Editor";

interface BloqComponentProps {
  id: string;
  title: string;
  onUpdate?: (updates: { title?: string }) => void;
  onRemove?: () => void;
}

export default function Bloq({
  id,
  title,
  onUpdate,
  onRemove,
}: BloqComponentProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { removeBloq } = useLessonPlanMutations();
  const [localTitle, setLocalTitle] = useState(title);

  // Handle title change and call onUpdate if provided
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    if (onUpdate) {
      onUpdate({ title: newTitle });
    }
  };

  // Handle remove with both local mutation and callback
  const handleRemove = () => {
    removeBloq(id);
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <Card
      id={`bloq-${id}`}
      className={cn(
        "group relative w-full rounded-2xl bg-card shadow-lg transition-shadow duration-200",
        "border border-border hover:border-primary/30",
        isFocused && "ring-2 ring-primary/20 border-primary/50 shadow-xl"
      )}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:bg-destructive/10"
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="p-6 space-y-4">
        <Input
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="Block title..."
          className={cn(
            "w-full text-lg font-semibold bg-transparent border-none px-0 py-1",
            "text-foreground placeholder:text-muted-foreground/70",
            "focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md transition-colors hover:bg-muted/10"
          )}
        />

        <div className="min-h-[200px] border-t border-border/20 pt-4">
          <Editor key={id} bloqId={id} />
        </div>
      </div>
    </Card>
  );
}
