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
        "flex items-center gap-2",
        "bg-muted/90 backdrop-blur-md",
        "p-2 sm:p-3 shadow-lg border border-border/50 rounded-2xl text-foreground",
        "z-50 transition-all duration-200",
        "hover:bg-muted/95 hover:shadow-xl",
        "max-w-[95vw] sm:max-w-none"
      )}
    >
      {/* Add Bloqs Menu */}
      <NavigationMenu>
        <NavigationMenuList className="flex gap-1">
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                "flex items-center h-9 sm:h-10 px-3 sm:px-4 rounded-xl font-medium text-sm sm:text-base",
                "transition-all duration-200",
                "hover:bg-primary/10 hover:text-primary",
                "focus-visible:ring-2 focus-visible:ring-primary/20",
                "data-[state=open]:bg-primary/15 data-[state=open]:text-primary",
                "bg-muted/90",
                (!canAddBloqs || !isStorageReady) &&
                  "opacity-50 cursor-not-allowed pointer-events-none"
              )}
              disabled={!canAddBloqs}
            >
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Bloqs</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="mt-2 rounded-xl border border-border/50 bg-muted/90 shadow-xl">
              <ul className="grid w-[300px] gap-2 p-4 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {bloqTypes.map((bloq) => (
                  <ListItem
                    key={bloq.key}
                    title={bloq.title}
                    icon={bloq.icon}
                    onClick={() => {
                      if (canAddBloqs) addBloq(bloq);
                    }}
                    className={cn(
                      "rounded-xl hover:bg-primary/10 hover:border-primary/20",
                      !canAddBloqs && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {bloq.description}
                  </ListItem>
                ))}
              </ul>
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
