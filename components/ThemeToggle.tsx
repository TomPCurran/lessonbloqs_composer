"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/lib/providers/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "button" | "dropdown";
  className?: string;
}

export function ThemeToggle({
  variant = "button",
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const next =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  const buttonClasses = cn(
    "inline-flex items-center justify-center rounded-md border border-border",
    "bg-background p-2 text-foreground shadow-sm focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
    "transition-colors hover:bg-accent hover:text-accent-foreground",
    className
  );

  const iconSize = "h-5 w-5";

  if (variant === "dropdown") {
    return (
      <div className={cn("relative inline-block text-left", className)}>
        <button
          type="button"
          className={cn(
            "inline-flex w-full items-center justify-center gap-x-1.5 rounded-md",
            "bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm",
            "ring-1 ring-inset ring-border hover:bg-accent hover:text-accent-foreground",
            "transition-colors",
            className
          )}
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setTheme(next)}
        >
          {theme === "light" && <Sun className={iconSize} />}
          {theme === "dark" && <Moon className={iconSize} />}
          {theme === "system" && <Monitor className={iconSize} />}
          <span className="capitalize">{theme}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={buttonClasses}
      title={`Switch to ${next} theme`}
    >
      {theme === "light" && <Sun className={iconSize} />}
      {theme === "dark" && <Moon className={iconSize} />}
      {theme === "system" && <Monitor className={iconSize} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export function ThemeToggleDropdown({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const btnClasses = cn(
    "inline-flex items-center justify-center rounded-md border border-border",
    "bg-background p-2 text-foreground shadow-sm focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
    "transition-colors hover:bg-accent hover:text-accent-foreground",
    className
  );

  return (
    <div className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        className={btnClasses}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme dropdown</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-md bg-background border border-border shadow-lg">
            <div className="py-1">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTheme(t);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {t === "light" && <Sun className="h-4 w-4" />}
                  {t === "dark" && <Moon className="h-4 w-4" />}
                  {t === "system" && <Monitor className="h-4 w-4" />}
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
