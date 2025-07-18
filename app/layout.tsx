// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import NavBar from "@/components/NavBar";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/lib/providers/Provider";
import { NotificationContainer } from "@/components/ui/notifications";

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

// Client component to handle pathname-based layout
function LayoutContent({ children }: { children: React.ReactNode }) {
  // This would normally use usePathname, but we can't use hooks in layout
  // So we'll handle this differently - check if it's the landing page
  const isLandingPage =
    typeof window !== "undefined" && window.location.pathname === "/";

  return (
    <>
      <NavBar />
      {isLandingPage ? (
        // Landing page: full-screen layout
        <main className="min-h-screen">{children}</main>
      ) : (
        // Other pages: container layout with padding
        <main className="container mx-auto px-4 md:px-8 lg:px-16 pt-16 pb-8">
          {children}
        </main>
      )}
    </>
  );
}

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
              <LayoutContent>{children}</LayoutContent>
              <NotificationContainer />
            </Provider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
