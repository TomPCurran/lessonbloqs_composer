"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePreferencesStore } from "@/lib/stores/preferencesStore";

export type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  attribute = "class",
}: ThemeProviderProps) {
  // Use Zustand user preferences store
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    const apply = (value: string) => {
      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(value);
      } else {
        root.setAttribute(attribute, value);
      }
    };

    if (theme === "system") {
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      apply(system);
    } else {
      apply(theme);
    }
  }, [theme, mounted, attribute]);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
