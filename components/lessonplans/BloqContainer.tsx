"use client";

import React, { memo, useMemo } from "react";
import Bloq from "@/components/lessonplans/Bloq";
import { cn } from "@/lib/utils";
import { useStorage } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
import { Bloq as BloqType, UserData } from "@/types";
import { FileText, Plus, Eye } from "lucide-react";

interface BloqContainerProps {
  currentUser: UserData;
  currentUserType: "creator" | "editor" | "viewer";
}

// Material Design Loading State
const LoadingState = memo(() => (
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
));

LoadingState.displayName = "LoadingState";

// Material Design Empty State
const EmptyState = memo(({ currentUserType }: { currentUserType: string }) => (
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
));

EmptyState.displayName = "EmptyState";

// **FIX 5**: Memoized individual bloq renderer to prevent unnecessary re-renders
const BloqRenderer = memo(
  ({
    bloq,
    index,
    currentUser,
    currentUserType,
  }: {
    bloq: LiveObject<BloqType> | BloqType;
    index: number;
    currentUser: UserData;
    currentUserType: "creator" | "editor" | "viewer";
  }) => {
    // **FIX 6**: Memoize bloq data transformation to prevent object recreation
    const bloqData = useMemo(() => {
      return bloq instanceof LiveObject ? bloq.toObject() : bloq;
    }, [bloq]);

    return (
      <div
        key={bloqData.id}
        className="relative group animate-fade-in"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Bloq number indicator */}
        <div className="absolute -left-10 top-grid-2 hidden xl:flex items-center justify-center w-6 h-6 rounded-full bg-surface border border-border text-body-small text-muted-foreground font-medium">
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
  }
);

BloqRenderer.displayName = "BloqRenderer";

const BloqContainer = ({
  currentUser,
  currentUserType,
}: BloqContainerProps) => {
  console.log("📦 [BloqContainer] Rendering", {
    userId: currentUser.id,
    currentUserType,
    timestamp: new Date().toISOString(),
  });

  const lessonPlan = useStorage((root) => root.lessonPlan);
  const bloqs = useStorage((root) => root.bloqs);

  console.log("📦 [BloqContainer] Storage state", {
    hasLessonPlan: !!lessonPlan,
    bloqsLength: bloqs?.length || 0,
  });

  // **FIX 7**: Memoize stable user data to prevent prop drilling re-renders
  const stableCurrentUser = useMemo(
    () => ({
      id: currentUser.id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      imageUrl: currentUser.imageUrl,
    }),
    [
      currentUser.id,
      currentUser.firstName,
      currentUser.lastName,
      currentUser.email,
      currentUser.imageUrl,
    ]
  );

  // **FIX 9**: Memoize bloqs array to prevent unnecessary re-renders when order doesn't change
  const sortedBloqs = useMemo(() => {
    if (!bloqs) return [];

    // Sort by order if available, otherwise maintain array order
    return [...bloqs].sort((a, b) => {
      const aData = a instanceof LiveObject ? a.toObject() : a;
      const bData = b instanceof LiveObject ? b.toObject() : b;
      return (aData.order || 0) - (bData.order || 0);
    });
  }, [bloqs]);

  // **FIX 8**: Early return with stable loading state (moved after all hooks)
  if (!lessonPlan || !bloqs) {
    console.log("📦 [BloqContainer] Storage not ready, showing loading state");
    return <LoadingState />;
  }

  console.log("📦 [BloqContainer] Storage ready, rendering bloqs", {
    sortedBloqsLength: sortedBloqs.length,
  });

  return (
    <div className="space-grid-6 animate-fade-in w-full">
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
      {sortedBloqs.length > 0 ? (
        <div className="space-grid-4 w-full">
          <div className="space-grid-4 w-full">
            {sortedBloqs.map((bloq, index) => (
              <BloqRenderer
                key={bloq instanceof LiveObject ? bloq.get("id") : bloq.id}
                bloq={bloq}
                index={index}
                currentUser={stableCurrentUser}
                currentUserType={currentUserType}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState currentUserType={currentUserType} />
      )}
    </div>
  );
};

export default memo(BloqContainer);
