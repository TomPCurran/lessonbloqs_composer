import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import NavBar from "@/components/NavBar";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/lib/providers/Provider";
import "@blocknote/core/fonts/inter.css";
// import "@blocknote/mantine/style.css";
// import "@liveblocks/react-ui/styles.css";
// import "@liveblocks/react-ui/styles/dark/media-query.css";
// import "@liveblocks/react-tiptap/styles.css";

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
              <NavBar />
              <main className="container mx-auto px-4 md:px-8 lg:px-16 pt-16 pb-8">
                {children}
              </main>
            </Provider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
