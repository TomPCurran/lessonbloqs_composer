// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../lib/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/lib/providers/Provider";
import AppStateManager from "@/components/providers/AppStateManager";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import "./globals.css";
import "../styles/blocknote-light-theme-fix.css";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LessonBloqs Composer",
  description: "A modern collaborative document editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <head>
          <link rel="icon" type="image/svg+xml" href="/assets/logo.svg" />
        </head>
        <body
          className={cn(
            inter.variable,
            "antialiased bg-background text-foreground min-h-screen transition-colors duration-200"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            storageKey="lessonbloqs-theme"
          >
            <Provider>
              <AppStateManager />
              {children}
            </Provider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
