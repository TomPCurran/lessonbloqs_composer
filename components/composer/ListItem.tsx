"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface ListItemProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "onClick"> {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ListItem = React.forwardRef<HTMLButtonElement, ListItemProps>(
  ({ className, title, icon: Icon, children, ...props }, ref) => (
    <button
      type="button" // Critical: prevents form submission
      ref={ref}
      className={cn(
        "group flex select-none items-start gap-3 rounded-lg border border-border/30",
        "google-surface p-grid-3 transition-all duration-200 text-left w-full",
        "hover:elevation-1 hover:bg-accent/5 hover:border-accent/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
        "active:scale-95 cursor-pointer",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 transition-colors duration-200 group-hover:bg-accent/20 group-focus:bg-accent/20">
          <Icon className="h-4 w-4 text-accent" />
        </div>
      )}
      <div className="flex-1 min-w-0 space-grid-1">
        <div className="text-label-large text-foreground transition-colors duration-200 group-hover:text-accent">
          {title}
        </div>
        <p className="text-body-small text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80">
          {children}
        </p>
      </div>
    </button>
  )
);

ListItem.displayName = "ListItem";

export default ListItem;
// "use client";
// import React from "react";
// import { cn } from "@/lib/utils";

// interface ListItemProps
//   extends Omit<React.ComponentPropsWithoutRef<"div">, "onClick"> {
//   icon?: React.ComponentType<{ className?: string }>;
//   title: string;
//   onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
// }

// const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
//   ({ className, title, icon: Icon, children, ...props }, ref) => (
//     <div
//       ref={ref}
//       className={cn(
//         "group flex select-none items-start gap-grid-3 rounded-lg border border-border/30",
//         "google-surface p-grid-3 transition-all duration-200",
//         "hover:elevation-1 hover:bg-accent/5 hover:border-accent/20",
//         "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
//         "active:scale-95 cursor-pointer",
//         className
//       )}
//       {...props}
//     >
//       {Icon && (
//         <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 transition-colors duration-200 group-hover:bg-accent/20 group-focus:bg-accent/20">
//           <Icon className="h-4 w-4 text-accent" />
//         </div>
//       )}
//       <div className="flex-1 min-w-0 space-grid-1">
//         <div className="text-label-large text-foreground transition-colors duration-200 group-hover:text-accent">
//           {title}
//         </div>
//         <p className="text-body-small text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80">
//           {children}
//         </p>
//       </div>
//     </div>
//   )
// );

// ListItem.displayName = "ListItem";

// export default ListItem;
