"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { FloatingToolbar } from "@/components/composer/FloatingToolbar";
import BloqContainer from "@/components/lessonplans/BloqContainer";

interface Bloq {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Canvas() {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("Untitled Lesson Plan");
  const [bloqs, setBloqs] = useState<Bloq[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const addBloq = (bloqType: any) => {
    const newBloq: Bloq = {
      id: Date.now().toString(),
      title: bloqType.title,
      content: `Add your ${bloqType.title.toLowerCase()} content here...`,
      type: bloqType.key,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBloqs((prev) => [...prev, newBloq]);
  };

  const updateBloq = (id: string, updates: Partial<Bloq>) => {
    setBloqs((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
      )
    );
  };

  const removeBloq = (id: string) => {
    setBloqs((prev) => prev.filter((b) => b.id !== id));
  };

  const handleTitleChange = (newTitle: string) => {
    setLessonTitle(newTitle);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const wordCount = bloqs.reduce(
    (count, b) => count + (b.content?.split(/\s+/).length || 0),
    0
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <div className="flex justify-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <FileText className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            {lessonTitle}
          </h1>
        </div>
      </div>

      <div className="sticky top-20 z-30 flex justify-center w-full">
        <FloatingToolbar
          addBloq={addBloq}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>

      <Card
        className={cn(
          "relative border border-border bg-surface shadow-lg rounded-2xl",
          "min-h-[700px] transition-shadow duration-300 hover:shadow-xl"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative z-10 p-8 flex flex-col min-h-[650px]">
          {bloqs.length === 0 ? (
            <>
              <div className="absolute inset-8 opacity-5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-6 border-b border-muted/20", {
                      "mt-6": i > 0,
                    })}
                  />
                ))}
              </div>
              <div className="relative z-20 flex flex-col items-center justify-center flex-1 space-y-8">
                <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-accent/5 border-2 border-dashed border-accent/20 transition hover:border-accent/40 hover:bg-accent/10">
                  <FileText className="w-12 h-12 text-accent/60" />
                </div>
                <div className="text-center space-y-3 max-w-md">
                  <h3 className="text-xl font-semibold text-foreground">
                    Start creating your lesson plan
                  </h3>
                  <p className="text-muted-foreground text-balance leading-relaxed">
                    Add content blocks, text, images, and interactive elements
                    to build engaging lessons for your students.
                  </p>
                </div>
                {isHovered && (
                  <div className="absolute top-6 right-6 animate-in fade-in-0 zoom-in-95 duration-300">
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="relative z-20">
              <BloqContainer
                bloqs={bloqs}
                title={lessonTitle}
                onTitleChange={handleTitleChange}
                onUpdate={updateBloq}
                onRemove={removeBloq}
              />
            </div>
          )}
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/10 via-transparent to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 border-transparent" />
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/20 rounded-2xl px-4 py-3 border border-border">
        <div className="flex items-center gap-4">
          <span className="font-medium">Page 1 of 1</span>
          <span className="w-1 h-1 bg-muted/50 rounded-full" />
          <span>{wordCount} words</span>
          <span className="w-1 h-1 bg-muted/50 rounded-full" />
          <span>
            Last saved: {lastSaved ? lastSaved.toLocaleTimeString() : "Never"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Ready</span>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
