"use client";

import React, { useCallback } from "react";
import Bloq from "@/components/lessonplans/Bloq";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStorage } from "@liveblocks/react";
import { useLessonPlanMutations } from "@/lib/hooks/useLessonplanHooks";
import { LiveObject } from "@liveblocks/client";
import { Bloq as BloqType, UserData } from "@/types";
import { FileText, Plus, Eye } from "lucide-react";

interface BloqContainerProps {
  currentUser: UserData;
  currentUserType: "creator" | "editor" | "viewer";
  roomId?: string;
}

// Material Design Loading State
const LoadingState = () => (
  <div className="space-grid-4 animate-fade-in">
    <div className="space-grid-2">
      <div className="h-12 bg-muted rounded-lg animate-pulse" />
      <div className="h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
    </div>
    <div className="space-grid-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="google-card p-grid-4 animate-pulse">
          <div className="space-grid-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Material Design Empty State
const EmptyState = ({ currentUserType }: { currentUserType: string }) => (
  <div className="google-card p-grid-6 text-center animate-fade-in">
    <div className="space-grid-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <FileText className="w-8 h-8 text-primary" />
      </div>

      <div className="space-grid-1">
        <h3 className="text-headline-medium text-foreground">
          {currentUserType === "viewer"
            ? "No content blocks yet"
            : "Start building your lesson plan"}
        </h3>
        <p className="text-body-medium text-muted-foreground max-w-md mx-auto">
          {currentUserType === "viewer"
            ? "This lesson plan doesn't have any content blocks yet."
            : "Add content blocks to structure your lesson. Click the Bloqs button to get started."}
        </p>
      </div>

      {currentUserType !== "viewer" && (
        <div className="flex items-center justify-center gap-grid-1 text-body-small text-muted-foreground">
          <Plus className="w-4 h-4" />
          <span>
            Click <strong>Bloqs</strong> to add your first block
          </span>
        </div>
      )}
    </div>
  </div>
);

const BloqContainer = ({
  currentUser,
  currentUserType,
  roomId,
}: BloqContainerProps) => {
  const lessonPlan = useStorage((root) => root.lessonPlan);
  const bloqs = useStorage((root) => root.bloqs);
  const { updateLessonplan, updateDocumentMetadata } =
    useLessonPlanMutations(roomId);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      updateLessonplan({ title: newTitle });
      updateDocumentMetadata(newTitle);
    },
    [updateLessonplan, updateDocumentMetadata]
  );

  if (!lessonPlan || !bloqs) {
    return <LoadingState />;
  }

  return (
    <div className="space-grid-6 animate-fade-in">
      {/* Title Section */}
      <div className="space-grid-2">
        <div className="relative group">
          <Input
            type="text"
            value={lessonPlan.title}
            onChange={handleTitleChange}
            placeholder="Enter Lesson Plan Title"
            disabled={currentUserType === "viewer"}
            className={cn(
              "w-full text-display-medium font-normal bg-transparent border-none p-0 h-auto",
              "text-foreground placeholder:text-muted-foreground/60",
              "focus-visible:outline-none focus-visible:ring-0",
              "transition-all duration-200",
              currentUserType !== "viewer" &&
                "hover:bg-surface-variant/50 focus:bg-surface-variant/50",
              "rounded-lg px-grid-2 py-grid-1",
              currentUserType === "viewer" && "opacity-60 cursor-not-allowed"
            )}
          />

          {/* Focus indicator */}
          {currentUserType !== "viewer" && (
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-200",
                "scale-x-0 group-focus-within:scale-x-100"
              )}
            />
          )}

          {/* View-only indicator */}
          {currentUserType === "viewer" && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-muted/80 text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span className="text-xs font-medium">Read Only</span>
            </div>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </div>

      {/* Content Section */}
      {bloqs.length > 0 ? (
        <div className="space-grid-4">
          {/* Bloqs counter */}
          <div className="flex items-center gap-grid-2 text-body-small text-muted-foreground">
            <div className="w-1 h-1 rounded-full bg-primary" />
            <span>
              {bloqs.length} content block{bloqs.length !== 1 ? "s" : ""}
            </span>
            {currentUserType === "viewer" && (
              <span className="px-2 py-0.5 rounded-full bg-muted/50 text-xs">
                View Only
              </span>
            )}
          </div>

          {/* Bloqs list */}
          <div className="space-grid-4">
            {bloqs.map((bloq, index) => {
              const bloqData =
                bloq instanceof LiveObject ? bloq.toObject() : bloq;
              return (
                <div
                  key={bloqData.id}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Bloq number indicator */}
                  <div className="absolute -left-8 top-grid-2 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-surface border border-border text-body-small text-muted-foreground font-medium">
                    {index + 1}
                  </div>

                  <div className="google-card hover:elevation-2 transition-all duration-200">
                    <Bloq
                      bloq={bloqData as BloqType}
                      currentUser={currentUser}
                      currentUserType={currentUserType}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState currentUserType={currentUserType} />
      )}

      {/* Document stats footer */}
      <div className="flex items-center justify-between text-body-small text-muted-foreground pt-grid-4 border-t border-border/30">
        <div className="flex items-center gap-grid-4">
          <span>
            Last edited by {currentUser.firstName} {currentUser.lastName}
          </span>
          <span>•</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-grid-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Auto-saved</span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium ml-2",
              currentUserType === "creator" && "bg-primary/10 text-primary",
              currentUserType === "editor" && "bg-secondary/10 text-secondary",
              currentUserType === "viewer" && "bg-muted text-muted-foreground"
            )}
          >
            {currentUserType}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BloqContainer);
