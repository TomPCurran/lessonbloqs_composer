import React from "react";
import { cn } from "@/lib/utils";

interface ListItemProps extends React.ComponentPropsWithoutRef<"div"> {
  icon?: React.ComponentType<any>;
  title: string;
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({ className, title, icon: Icon, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group flex select-none items-start gap-3 rounded-lg border border-transparent",
        "bg-surface p-4 transition hover:bg-accent/5 hover:border-accent/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "active:scale-95",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
          <Icon className="h-5 w-5 text-accent" />
        </div>
      )}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-sm font-medium text-foreground transition-colors group-hover:text-accent">
          {title}
        </div>
        <p className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
          {children}
        </p>
      </div>
    </div>
  )
);

ListItem.displayName = "ListItem";

export default ListItem;
