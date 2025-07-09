// Bloq.tsx
"use client";

import React, { useState } from "react";
import { X, Users2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BloqEditor } from "./editor/BloqEditor";
import { cn } from "@/lib/utils";
import { useOthers } from "@liveblocks/react";
import { useStatus } from "@liveblocks/react";

interface BloqProps {
  id: string;
  title: string;
  onUpdate: (updates: { title?: string }) => void;
  onRemove: () => void;
}

export default function Bloq({ id, title, onUpdate, onRemove }: BloqProps) {
  const [localTitle, setLocalTitle] = useState(title);
  const [isFocused, setIsFocused] = useState(false);
  const others = useOthers();
  const status = useStatus();

  // Get users currently editing this bloq
  const usersInThisBloq = others.filter(
    (other) => other.presence?.activeBloqId === id
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    onUpdate({ title: newTitle });
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
      {usersInThisBloq.length > 0 && (
        <div className="absolute -top-3 -right-3 flex items-center gap-1 z-10">
          <div className="flex -space-x-1">
            {usersInThisBloq.map((user) => (
              <div
                key={user.connectionId}
                className="w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-white text-xs font-medium shadow-md transition-transform hover:scale-110"
                style={{
                  backgroundColor: user.presence?.user?.color || "#6B4CE6",
                }}
                title={user.presence?.user?.name || "Unknown"}
              >
                {user.presence?.user?.name?.charAt(0) || "U"}
              </div>
            ))}
          </div>
          <div className="bg-primary/10 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-primary font-medium flex items-center">
            <Users2 className="w-3 h-3 mr-1" />
            {usersInThisBloq.length}
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
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
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div
          className={cn(
            "rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4",
            "transition-colors duration-200 hover:border-primary/30",
            isFocused
              ? "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-inner"
              : ""
          )}
        >
          {status === "connected" ? (
            <BloqEditor bloqId={id} isEditable />
          ) : (
            <div className="text-center text-muted-foreground">
              Connecting editor...
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
