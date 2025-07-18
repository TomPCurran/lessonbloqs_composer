"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { bloqTypes } from "@/constants";
import ListItem from "@/components/composer/ListItem";
import { useLessonPlanMutations } from "@/lib/hooks/useLessonplanHooks";
import { useStorage } from "@liveblocks/react";
import ShareModal from "./ShareModal";
import { UserData, RoomMetadata } from "@/types";

interface FloatingToolbarProps {
  roomId: string;
  currentUserType: "creator" | "editor" | "viewer";
  roomMetadata: RoomMetadata;
  currentUser: UserData;
}

export const FloatingToolbar = React.memo(function FloatingToolbar({
  roomId,
  currentUserType,
  roomMetadata,
  currentUser,
}: FloatingToolbarProps) {
  console.log("🔧 [FloatingToolbar] Rendering", {
    roomId,
    currentUserType,
    userId: currentUser.id,
    timestamp: new Date().toISOString(),
  });

  // Memoize the mutations to prevent unnecessary re-renders
  const mutations = useLessonPlanMutations();
  const { addBloq } = mutations;

  const bloqs = useStorage((root) => root.bloqs);
  const isStorageReady = bloqs !== undefined;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log("🔧 [FloatingToolbar] Storage state", {
    isStorageReady,
    bloqsLength: bloqs?.length || 0,
  });

  // Check if user can add bloqs (creators and editors can, viewers cannot)
  const canAddBloqs = currentUserType !== "viewer" && isStorageReady;

  return (
    <div
      className={cn(
        "flex items-center gap-grid-2",
        "glass elevation-2 hover:elevation-3",
        "p-grid-2 sm:p-grid-3 border border-border/50 rounded-2xl text-foreground",
        "z-50 transition-all duration-200",
        "max-w-[95vw] sm:max-w-none"
      )}
    >
      {/* Add Bloqs Menu */}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (canAddBloqs) setIsMenuOpen(!isMenuOpen);
          }}
          className={cn(
            "google-button-ghost h-10 px-grid-3 rounded-lg",
            "text-body-medium font-medium",
            "hover:bg-primary/10 hover:text-primary",
            "focus-visible:ring-2 focus-visible:ring-primary/30",
            "transition-all duration-200",
            (!canAddBloqs || !isStorageReady) &&
              "opacity-50 cursor-not-allowed pointer-events-none"
          )}
          disabled={!canAddBloqs}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Bloqs</span>
          <svg
            className={cn(
              "ml-1 h-3 w-3 transition-transform duration-200",
              isMenuOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isMenuOpen && (
          <div
            className={cn(
              "absolute mt-2 rounded-lg border border-border/50 z-50",
              "glass elevation-3 animate-scale-in",
              "bg-surface/98 backdrop-blur-md"
            )}
          >
            <div className="p-grid-3">
              <div className="mb-grid-2">
                <h3 className="text-label-large text-foreground mb-1">
                  Add Content Block
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Choose a block type to add to your lesson plan
                </p>
              </div>

              <ul className="grid w-[300px] gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {bloqTypes.map((bloq) => (
                  <ListItem
                    key={bloq.key}
                    title={bloq.title}
                    icon={bloq.icon}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("🔧 [FloatingToolbar] Bloq clicked", {
                        bloqType: bloq.title,
                        canAddBloqs,
                        timestamp: new Date().toISOString(),
                      });
                      if (canAddBloqs) {
                        console.log("🔧 [FloatingToolbar] Calling addBloq", {
                          bloqType: bloq.title,
                        });
                        try {
                          addBloq(bloq);
                          console.log(
                            "🔧 [FloatingToolbar] addBloq called successfully"
                          );
                        } catch (error) {
                          console.error(
                            "🔧 [FloatingToolbar] Error calling addBloq:",
                            error
                          );
                        }
                        setIsMenuOpen(false); // Close menu after adding
                      }
                    }}
                    className={cn(
                      "google-card p-grid-3 cursor-pointer",
                      "hover:elevation-2 hover:bg-primary/5",
                      "transition-all duration-200",
                      "border border-border/30 hover:border-primary/20",
                      !canAddBloqs && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {bloq.description}
                  </ListItem>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <ShareModal
        roomId={roomId}
        creatorId={roomMetadata?.creatorId}
        currentUserType={currentUserType}
        currentUser={currentUser}
      />
    </div>
  );
});
