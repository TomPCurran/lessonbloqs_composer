import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Home = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Tailwind CSS v3.4.17 Class Demonstration
          </h1>
          <p className="text-muted-foreground text-lg text-pretty">
            Showcasing all custom colors, utilities, and components with
            improved typography and animations
          </p>
        </div>

        {/* Dark Mode Toggle Indicator */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <span className="text-muted-foreground text-sm">
              💡 Toggle dark mode to see theme variables in action
            </span>
          </div>
        </section>

        {/* Primary Colors Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Primary Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary-black rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-white font-medium">Primary Black</span>
              </div>
              <p className="text-sm text-muted-foreground">bg-primary-black</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary-blue rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-white font-medium">Primary Blue</span>
              </div>
              <p className="text-sm text-muted-foreground">bg-primary-blue</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary-purple rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-white font-medium">Primary Purple</span>
              </div>
              <p className="text-sm text-muted-foreground">bg-primary-purple</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary-success rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-white font-medium">Success</span>
              </div>
              <p className="text-sm text-muted-foreground">
                bg-primary-success
              </p>
            </div>
          </div>

          {/* Primary Grey Shades */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary-grey-100 rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-primary-black font-medium">Grey 100</span>
              </div>
              <p className="text-sm text-muted-foreground">
                bg-primary-grey-100
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary-grey-200 rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-primary-black font-medium">Grey 200</span>
              </div>
              <p className="text-sm text-muted-foreground">
                bg-primary-grey-200
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary-grey-300 rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-white font-medium">Grey 300</span>
              </div>
              <p className="text-sm text-muted-foreground">
                bg-primary-grey-300
              </p>
            </div>
          </div>

          {/* Warning and Error */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary-warning rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-primary-black font-medium">Warning</span>
              </div>
              <p className="text-sm text-muted-foreground">
                bg-primary-warning
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary-error rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-white font-medium">Error</span>
              </div>
              <p className="text-sm text-muted-foreground">bg-primary-error</p>
            </div>
          </div>
        </section>

        {/* CSS Variables Colors Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            CSS Variables Colors (Light/Dark Mode)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-primary-foreground font-medium">
                  Primary
                </span>
              </div>
              <p className="text-sm text-muted-foreground">bg-primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-secondary rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-secondary-foreground font-medium">
                  Secondary
                </span>
              </div>
              <p className="text-sm text-muted-foreground">bg-secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-accent rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-accent-foreground font-medium">
                  Accent
                </span>
              </div>
              <p className="text-sm text-muted-foreground">bg-accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-destructive rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-destructive-foreground font-medium">
                  Destructive
                </span>
              </div>
              <p className="text-sm text-muted-foreground">bg-destructive</p>
            </div>
          </div>
        </section>

        {/* Chart Colors Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Chart Colors (New in v3.4.17)
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="space-y-2">
                <div
                  className={`h-20 bg-chart-${num} rounded-lg flex items-center justify-center transition-transform hover:scale-105`}
                >
                  <span className="text-white font-medium text-sm">
                    Chart {num}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">bg-chart-{num}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Utility Classes Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Custom Utility Classes
          </h2>

          {/* Input Ring Utility */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Input Ring Utility
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Regular input"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Input with custom ring utility"
                className="input-ring w-full px-3 py-2"
              />
            </div>
          </div>

          {/* No Ring Utility */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              No Ring Utility
            </h3>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90">
                Button with default focus ring
              </button>
              <button className="no-ring px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90">
                Button with no-ring utility
              </button>
            </div>
          </div>

          {/* Right Menu Utilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Right Menu Utilities
            </h3>
            <div className="flex justify-center">
              <div className="right-menu-content">
                <div className="right-menu-item">
                  <span>Menu Item 1</span>
                  <span>→</span>
                </div>
                <div className="right-menu-item">
                  <span>Menu Item 2</span>
                  <span>→</span>
                </div>
                <div className="right-menu-item">
                  <span>Menu Item 3</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Utilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Text Utilities (New in v3.4.17)
            </h3>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Text Balance</h4>
                <p className="text-balance">
                  This text uses text-balance utility for better headline
                  wrapping and more visually pleasing line breaks.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Text Pretty</h4>
                <p className="text-pretty">
                  This text uses text-pretty utility for improved readability by
                  avoiding orphans and improving text flow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Border Radius Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Border Radius Examples
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-sm flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-primary-foreground font-medium">
                  Small
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                rounded-sm (var(--radius) - 4px)
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-md flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-primary-foreground font-medium">
                  Medium
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                rounded-md (var(--radius) - 2px)
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-primary-foreground font-medium">
                  Large
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                rounded-lg (var(--radius))
              </p>
            </div>
          </div>
        </section>

        {/* Animation Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Animation Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-lg flex items-center justify-center animate-accordion-down">
                <span className="text-primary-foreground font-medium">
                  Accordion Down
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                animate-accordion-down
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-lg flex items-center justify-center animate-accordion-up">
                <span className="text-primary-foreground font-medium">
                  Accordion Up
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                animate-accordion-up
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-medium">
                  Caret Blink
                </span>
                <span className="ml-2 animate-caret-blink">|</span>
              </div>
              <p className="text-sm text-muted-foreground">
                animate-caret-blink (New!)
              </p>
            </div>
          </div>
        </section>

        {/* Focused Outline Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Focused Outline Example
          </h2>
          <div className="focused-outline">
            <input
              type="text"
              placeholder="Click to see focused outline effect"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Uses CSS variables for consistent theming
          </p>
        </section>

        {/* Scrollbar Utilities */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Scrollbar Utilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Regular Scrollbar</h4>
              <div className="h-32 bg-muted rounded-lg p-4 overflow-y-auto">
                <div className="space-y-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <p key={i}>Scrollable content line {i + 1}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Hidden Scrollbar (.no-scrollbar)</h4>
              <div className="h-32 bg-muted rounded-lg p-4 overflow-y-auto no-scrollbar">
                <div className="space-y-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <p key={i}>Hidden scrollbar content line {i + 1}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Threads Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Responsive Threads Example
          </h2>
          <div className="relative h-32 bg-muted rounded-lg p-4 overflow-hidden">
            <div className="anchored-threads">
              <div className="bg-card border border-border rounded-lg p-3 shadow-md">
                <p className="text-sm text-card-foreground">Desktop Threads</p>
                <p className="text-xs text-muted-foreground">
                  Visible on desktop (640px+)
                </p>
              </div>
            </div>
            <div className="floating-threads">
              <div className="bg-card border border-border rounded-lg p-3 shadow-md">
                <p className="text-sm text-card-foreground">Mobile Threads</p>
                <p className="text-xs text-muted-foreground">
                  Visible on mobile (&lt;640px)
                </p>
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-8">
              Resize your browser to see the responsive behavior
            </p>
          </div>
        </section>

        {/* Card Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Card Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">Card Component</h3>
              <p className="text-muted-foreground">
                This card uses bg-card and text-card-foreground colors for
                proper theming.
              </p>
            </div>
            <div className="bg-popover text-popover-foreground p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">Popover Component</h3>
              <p className="text-muted-foreground">
                This uses bg-popover and text-popover-foreground colors.
              </p>
            </div>
            <div className="bg-muted text-muted-foreground p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-foreground text-lg font-medium mb-2">
                Muted Component
              </h3>
              <p>This uses bg-muted with text-muted-foreground colors.</p>
            </div>
          </div>
        </section>

        {/* Editor Components Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Editor Components (From globals.css)
          </h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="toolbar">
              <button>Bold</button>
              <button>Italic</button>
              <button>Underline</button>
              <button>Link</button>
            </div>
            <div className="editor bg-background">
              <div className="tiptap">
                <p className="text-foreground">
                  This is a simulated editor interface using the custom
                  component classes from globals.css. The toolbar and editor
                  styles are properly themed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center py-8 border-t border-border">
          <p className="text-muted-foreground">
            All styles are optimized for Tailwind CSS v3.4.17 with proper CSS
            variable usage for light/dark mode support.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Home;
