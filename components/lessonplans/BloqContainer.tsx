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
    </div>
  );
};

export default React.memo(BloqContainer);
