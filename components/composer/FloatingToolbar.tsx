"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Save, Share2, ArrowUpFromLine, Plus } from "lucide-react";
import { bloqTypes, exportOptions } from "@/constants";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import ListItem from "@/components/composer/ListItem";
import { Button } from "@/components/ui/button";
import ShareModal from "@/components/composer/ShareModal";

interface BloqType {
  key: string;
  title: string;
  icon: React.ComponentType;
  description: string;
}

interface FloatingToolbarProps {
  addBloq: (bloq: BloqType) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function FloatingToolbar({
  addBloq,
  onSave,
  isSaving,
}: FloatingToolbarProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "bg-surface/95 backdrop-blur-md",
        "p-2 shadow-lg border border-border/50 rounded-2xl text-foreground"
      )}
    >
      {/* Add Bloqs Menu */}
      <NavigationMenu>
        <NavigationMenuList className="flex gap-1">
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                "flex items-center h-10 px-4 rounded-xl font-medium",
                "transition-all duration-200",
                "hover:bg-primary/10 hover:text-primary",
                "focus-visible:ring-2 focus-visible:ring-primary/20",
                "data-[state=open]:bg-primary/15 data-[state=open]:text-primary"
              )}
            >
              <Plus className="h-4 w-4 mr-2" /> Bloqs
            </NavigationMenuTrigger>
            <NavigationMenuContent className="mt-2 rounded-xl border border-border/50 bg-surface shadow-xl">
              <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {bloqTypes.map((bloq) => (
                  <ListItem
                    key={bloq.key}
                    title={bloq.title}
                    icon={bloq.icon}
                    onClick={() => addBloq(bloq)}
                    className="rounded-xl hover:bg-primary/10 hover:border-primary/20"
                  >
                    {bloq.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Export Menu */}
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                "flex items-center h-10 px-4 rounded-xl font-medium",
                "transition-all duration-200",
                "hover:bg-primary/10 hover:text-primary",
                "focus-visible:ring-2 focus-visible:ring-primary/20",
                "data-[state=open]:bg-primary/15 data-[state=open]:text-primary"
              )}
            >
              Export
            </NavigationMenuTrigger>
            <NavigationMenuContent className="mt-2 rounded-xl border border-border/50 bg-surface shadow-xl">
              <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {exportOptions.map((opt) => (
                  <ListItem
                    key={opt.key}
                    title={opt.title}
                    icon={opt.icon}
                    className="rounded-xl hover:bg-primary/10 hover:border-primary/20"
                  >
                    {opt.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Assign Action */}
      <div className="h-6 w-px bg-border/60 mx-2" />

      <Button
        variant="ghost"
        className={cn(
          "flex items-center h-10 px-4 rounded-xl font-medium",
          "transition-all duration-200",
          "hover:bg-accent/80 hover:text-accent-foreground",
          "focus-visible:ring-2 focus-visible:ring-primary/20"
        )}
      >
        <ArrowUpFromLine className="h-4 w-4 mr-2" /> Assign
      </Button>

      {/* Share Action */}
      <Button
        variant="ghost"
        onClick={() => setShareOpen(true)}
        className={cn(
          "flex items-center h-10 px-4 rounded-xl font-medium",
          "transition-all duration-200",
          "hover:bg-accent/80 hover:text-accent-foreground",
          "focus-visible:ring-2 focus-visible:ring-primary/20"
        )}
      >
        <Share2 className="h-4 w-4 mr-2" /> Share
      </Button>

      {/* Save Action */}
      <Button
        variant="ghost"
        onClick={onSave}
        disabled={isSaving}
        className={cn(
          "relative flex items-center h-10 px-4 rounded-xl font-medium",
          "transition-all duration-200",
          "hover:bg-primary/10 hover:text-primary",
          "focus-visible:ring-2 focus-visible:ring-primary/20",
          isSaving && "text-primary"
        )}
      >
        <Save
          className={cn(
            "h-4 w-4 mr-2 transition-all duration-200",
            isSaving && "animate-pulse"
          )}
        />
        {isSaving ? "Saving..." : "Save"}
        {isSaving && (
          <span className="absolute -top-1 -right-1 inline-block w-2 h-2 bg-primary rounded-full animate-ping" />
        )}
      </Button>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
