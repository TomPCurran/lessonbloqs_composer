"use client";

import React, { memo } from "react";
import Bloq from "./Bloq";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BloqData {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BloqContainerProps {
  bloqs: BloqData[];
  title: string;
  onTitleChange: (newTitle: string) => void;
  onUpdate: (id: string, updates: Partial<BloqData>) => void;
  onRemove: (id: string) => void;
}

const BloqContainer = memo(function BloqContainer({
  bloqs,
  title,
  onTitleChange,
  onUpdate,
  onRemove,
}: BloqContainerProps) {
  return (
    <div className="space-y-8">
      {/* Title Input */}
      <div className="space-y-2">
        <Input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
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
      {bloqs.length > 0 ? (
        <div className="space-y-6">
          {bloqs.map((bloq, idx) => (
            <div key={bloq.id} className="relative group">
              {/* Bloq Number */}
              <span className="absolute -left-8 top-4 text-xs text-muted-foreground">
                {idx + 1}
              </span>
              {/* Bloq Component */}
              <Bloq
                id={bloq.id}
                title={bloq.title}
                onUpdate={(updates) => onUpdate(bloq.id, updates)}
                onRemove={() => onRemove(bloq.id)}
              />
            </div>
          ))}
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
