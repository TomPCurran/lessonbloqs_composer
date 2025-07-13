"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useStatus } from "@liveblocks/react";
import BloqContainer from "@/components/lessonplans/BloqContainer";
import { YjsProvider } from "@/lib/providers/yjsProvider";
import LessonbloqsLogoAnimated from "@/components/AnimatedLogo";
import { FloatingToolbar } from "@/components/composer/FloatingToolbar";
import ActiveCollaborators from "@/components/lessonplans/ActiveCollaborators";
import { UserData, RoomMetadata } from "@/types"; // Assuming these types are correctly defined

interface CanvasProps {
  documentId: string;
  currentUser: UserData;
  roomMetadata: RoomMetadata;
  collaborators: UserData[];
}

export default function Canvas({
  documentId,
  currentUser,
  roomMetadata,
  collaborators,
}: CanvasProps) {
  const status = useStatus();
  const isReady = status === "connected";

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full w-full py-16">
        <LessonbloqsLogoAnimated />
      </div>
    );
  }

  return (
    <YjsProvider>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        <div className="flex gap-4 justify-center items-center">
          <FloatingToolbar
            roomId={documentId}
            users={collaborators}
            currentUserType={
              roomMetadata.creatorId === currentUser.id ? "creator" : "editor"
            }
            roomMetadata={roomMetadata}
            currentUser={currentUser}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active:</span>
            <ActiveCollaborators />
          </div>
        </div>

        <Card
          className={cn(
            "relative border border-border bg-surface shadow-lg rounded-2xl",
            "min-h-[700px] transition-shadow duration-300 hover:shadow-xl"
          )}
        >
          <div className="relative z-10 p-8 flex flex-col min-h-[650px]">
            <BloqContainer currentUser={currentUser} roomId={documentId} />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/10 via-transparent to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 border-transparent" />
        </Card>
      </div>
    </YjsProvider>
  );
}
