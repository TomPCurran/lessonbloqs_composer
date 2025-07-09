"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ComposerSidebar from "@/components/composer/ComposerSidebar";
import Canvas from "@/components/composer/Canvas";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function LessonPlanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn("flex min-h-screen bg-background text-foreground")}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-16 md:h-[calc(100vh-4rem)] md:w-64 md:z-40 md:bg-surface/95 md:backdrop-blur-sm md:shadow-lg md:flex md:flex-col">
        <ComposerSidebar />
      </aside>

      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" aria-label="Open sidebar">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-64 bg-surface/95 backdrop-blur-sm"
          >
            <ComposerSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full md:ml-64 pt-16 px-4 sm:px-6 lg:px-8">
        <Canvas />
      </main>
    </div>
  );
}
