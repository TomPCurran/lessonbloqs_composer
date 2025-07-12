"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FloatingToolbar } from "@/components/composer/FloatingToolbar";
import { useStatus, useStorage } from "@liveblocks/react";
import { LessonbloqsLogoAnimated } from "@/components/AnimatedLogo";
import BloqContainer from "@/components/lessonplans/BloqContainer";
import { updateDocument } from "@/lib/actions/room.actions";
import { YjsProvider } from "@/lib/providers/yjsProvider";

export default function Canvas({
  documentId,
  currentUser,
  collaborators = [],
  currentUserType = "editor",
  roomMetadata,
}: {
  documentId: string;
  currentUser: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
  collaborators?: any[];
  currentUserType?: string;
  roomMetadata?: any;
}) {
  const status = useStatus();
  const isReady = status === "connected";
  const lessonPlan = useStorage((root) => root.lessonPlan);
  const bloqs = useStorage((root) => root.bloqs);

  if (status !== "connected") {
    return (
      <div className="flex items-center justify-center h-full w-full py-16">
        <LessonbloqsLogoAnimated />
      </div>
    );
  }

  const onTitleChange = async (newTitle: string) => {
    await updateDocument(documentId, newTitle);
  };

  return (
    <YjsProvider>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        <div className="flex gap-4 justify-center">
          <FloatingToolbar
            disabled={!isReady}
            roomId={documentId}
            users={[]} // We'll fix this in the next step
            currentUserType="editor" // We'll fix this too
            roomMetadata={lessonPlan}
          />
        </div>

        <Card
          className={cn(
            "relative border border-border bg-surface shadow-lg rounded-2xl",
            "min-h-[700px] transition-shadow duration-300 hover:shadow-xl"
          )}
        >
          <div className="relative z-10 p-8 flex flex-col min-h-[650px]">
            {!isReady ? (
              <div className="text-center text-muted-foreground text-lg py-12">
                Connecting to collaboration room...
              </div>
            ) : (
              <BloqContainer
                bloqs={bloqs || []}
                title={lessonPlan?.title ?? "Untitled Lesson Plan"}
                onTitleChange={onTitleChange}
                onUpdate={() => {}}
                onRemove={() => {}}
                currentUser={currentUser}
              />
            )}
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/10 via-transparent to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 border-transparent" />
        </Card>

        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/20 rounded-2xl px-4 py-3 border border-border"></div>
      </div>
    </YjsProvider>
  );
}
