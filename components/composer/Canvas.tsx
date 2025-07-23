"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import BloqContainer from "@/components/lessonplans/BloqContainer";
import { YjsProvider } from "@/lib/providers/yjsProvider";
import { UserData } from "@/types";
import { CommentPanelProvider } from "@/components/lessonplans/BloqComment";
import { useAppStore } from "@/lib/stores/appStore";

interface CanvasProps {
  currentUser: UserData;
  currentUserType: "creator" | "editor" | "viewer";
}

const Canvas = React.memo(function Canvas({
  currentUser,
  currentUserType,
}: CanvasProps) {
  const setGlobalLoading = useAppStore((s) => s.setGlobalLoading);



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
