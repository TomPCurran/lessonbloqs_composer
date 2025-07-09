"use client";

import React from "react";
import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function ActiveCollaborators() {
  const others = useOthers();
  const collaborators = others.map((other) => other.info);

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <ul className="flex -space-x-2">
          {collaborators.map(({ id, avatar, name, color }) => (
            <li key={id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Image
                      src={avatar}
                      alt={name}
                      width={32}
                      height={32}
                      className={cn(
                        "h-8 w-8 rounded-full ring-2 ring-border",
                        "transition-transform duration-200",
                        "hover:scale-110 hover:ring-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      )}
                      style={{ borderColor: color }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="px-2 py-1">
                  <span className="text-sm text-foreground">{name}</span>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>

        {collaborators.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {collaborators.length} online
          </span>
        )}
      </div>
    </TooltipProvider>
  );
}
