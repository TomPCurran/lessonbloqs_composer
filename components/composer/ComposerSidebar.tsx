import React from "react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { FileText, Layers, Settings, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const contentItems = [
  { icon: Layers, label: "Text Block", desc: "Add rich text content" },
  { icon: BookOpen, label: "Activity", desc: "Interactive exercises" },
  { icon: FileText, label: "Assessment", desc: "Quizzes & tests" },
];

export default function ComposerSidebar() {
  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col bg-surface/50 backdrop-blur-sm",
        "border-r border-border shadow-sm"
      )}
    >
      {/* Header */}
      <SidebarHeader className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Lesson Builder
            </h2>
            <p className="text-xs text-muted-foreground">Compose & organize</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Content Blocks */}
      <SidebarContent className="flex-1 space-y-6 p-4">
        <SidebarGroup>
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Content Blocks
          </h3>
          <div className="space-y-2">
            {contentItems.map((item, idx) => (
              <Card
                key={idx}
                className={cn(
                  "flex cursor-pointer items-center gap-3",
                  "border border-border/50 p-3 transition hover:border-accent",
                  "hover:bg-accent/10"
                )}
              >
                <div className="rounded-md bg-accent/10 p-1.5">
                  <item.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full items-center justify-start gap-2"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground hover:text-foreground">
                Template Settings
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full items-center justify-start gap-2"
            >
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground hover:text-foreground">
                Layer Manager
              </span>
            </Button>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-4 py-3 border-t border-border">
        <p className="text-center text-xs text-muted-foreground">
          Tip: Drag & drop to reorder blocks
        </p>
      </SidebarFooter>
    </aside>
  );
}
