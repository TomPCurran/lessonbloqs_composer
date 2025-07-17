"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { bloqTypes } from "@/constants";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
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

export function FloatingToolbar({
  roomId,
  currentUserType,
  roomMetadata,
  currentUser,
}: FloatingToolbarProps) {
  const { addBloq } = useLessonPlanMutations();
  const bloqs = useStorage((root) => root.bloqs);
  const isStorageReady = bloqs !== undefined;

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
      <NavigationMenu>
        <NavigationMenuList className="flex gap-grid-1">
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                "google-button-ghost h-10 px-grid-3 rounded-lg",
                "text-body-medium font-medium",
                "hover:bg-primary/10 hover:text-primary",
                "focus-visible:ring-2 focus-visible:ring-primary/30",
                "data-[state=open]:bg-primary/15 data-[state=open]:text-primary",
                "transition-all duration-200",
                (!canAddBloqs || !isStorageReady) &&
                  "opacity-50 cursor-not-allowed pointer-events-none"
              )}
              disabled={!canAddBloqs}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Bloqs</span>
              <svg
                className="ml-1 h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180"
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
            </NavigationMenuTrigger>
            <NavigationMenuContent
              className={cn(
                "mt-2 rounded-lg border border-border/50",
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
                      onClick={() => {
                        if (canAddBloqs) addBloq(bloq);
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
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ShareModal
        roomId={roomId}
        creatorId={roomMetadata?.creatorId}
        currentUserType={currentUserType}
        currentUser={currentUser}
      />
    </div>
  );
}
