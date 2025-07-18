"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStatus } from "@liveblocks/react";
import BloqContainer from "@/components/lessonplans/BloqContainer";
import { YjsProvider } from "@/lib/providers/yjsProvider";
import LessonbloqsLogoAnimated from "@/components/AnimatedLogo";
import { UserData } from "@/types";
import { CommentPanelProvider } from "@/components/lessonplans/BloqComment";

interface CanvasProps {
  currentUser: UserData;
  currentUserType: "creator" | "editor" | "viewer";
}

// Material Design loading component
const CanvasLoadingState = () => (
  <div className="flex items-center justify-center min-h-[600px] w-full">
    <div className="text-center space-grid-4">
      <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-grid-4">
        <LessonbloqsLogoAnimated />
      </div>
      <div className="space-grid-2">
        <div className="animate-pulse space-grid-1">
          <div className="h-2 bg-muted rounded-full w-32 mx-auto"></div>
          <div className="h-2 bg-muted rounded-full w-24 mx-auto"></div>
        </div>
        <p className="text-body-medium text-muted-foreground">
          Connecting to your workspace...
        </p>
      </div>
    </div>
  </div>
);

const Canvas = React.memo(function Canvas({
  currentUser,
  currentUserType,
}: CanvasProps) {
  console.log("🎨 [Canvas] Rendering Canvas", {
    userId: currentUser.id,
    currentUserType,
    timestamp: new Date().toISOString(),
  });

  const status = useStatus();
  const isReady = status === "connected";

  // Monitor status changes
  useEffect(() => {
    console.log("🎨 [Canvas] Status changed:", {
      status,
      isReady,
      timestamp: new Date().toISOString(),
    });
  }, [status, isReady]);

  console.log(
    "🎨 [Canvas] Status:",
    status,
    "isReady:",
    isReady,
    "Status type:",
    typeof status,
    "Timestamp:",
    new Date().toISOString()
  );

  if (!isReady) {
    console.log("🎨 [Canvas] Showing loading state - Status:", status);
    return (
      <div className="google-card min-h-[600px] animate-fade-in">
        <CanvasLoadingState />
      </div>
    );
  }

  console.log("🎨 [Canvas] Rendering main content with YjsProvider");

  return (
    <YjsProvider>
      <div className="space-grid-4 animate-fade-in">
        {/* Main editor canvas */}
        <div className="relative group">
          <Card
            className={cn(
              "relative google-card overflow-hidden transition-all duration-300",
              "min-h-[700px] border-2 border-border/30",
              "hover:elevation-3 focus-within:border-ring focus-within:elevation-4",
              "bg-surface w-full"
            )}
          >
            {/* Gradient border effect on focus/hover */}
            <div
              className={cn(
                "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500",
                "bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10",
                "group-hover:opacity-100 group-focus-within:opacity-100",
                "pointer-events-none"
              )}
            />

            {/* Editor content */}
            <div className="relative z-10 p-grid-4 lg:p-grid-6 min-h-[650px]">
              <div className="h-full">
                <CommentPanelProvider>
                  <BloqContainer
                    currentUser={currentUser}
                    currentUserType={currentUserType}
                  />
                </CommentPanelProvider>
              </div>
            </div>

            {/* Status indicators */}
            <div className="absolute top-grid-3 right-grid-3 z-20">
              <div className="flex items-center gap-grid-2"></div>
            </div>
          </Card>
        </div>
      </div>
    </YjsProvider>
  );
});

export default Canvas;
