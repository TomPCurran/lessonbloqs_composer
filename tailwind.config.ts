import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Semantic color system aligned with CSS variables
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          variant: "hsl(var(--surface-variant))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: {
          DEFAULT: "hsl(var(--input))",
          border: "hsl(var(--input-border))",
          focus: "hsl(var(--input-focus))",
        },
        ring: "hsl(var(--ring))",

        // Brand colors - Your palette
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          subtle: "hsl(var(--primary-subtle))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
          subtle: "hsl(var(--secondary-subtle))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
          subtle: "hsl(var(--accent-subtle))",
        },

        // Status colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        // Card and popover
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        // Sidebar
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // Chart colors
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },

      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        mono: ["JetBrains Mono", "Menlo", "Monaco", "Consolas", "monospace"],
      },

      fontSize: {
        // Material Design Typography Scale
        "display-large": ["3rem", { lineHeight: "3.5rem", fontWeight: "400" }],
        "display-medium": ["2.5rem", { lineHeight: "3rem", fontWeight: "400" }],
        "display-small": ["2rem", { lineHeight: "2.5rem", fontWeight: "400" }],
        "headline-large": ["1.5rem", { lineHeight: "2rem", fontWeight: "500" }],
        "headline-medium": [
          "1.25rem",
          { lineHeight: "1.75rem", fontWeight: "500" },
        ],
        "headline-small": [
          "1.125rem",
          { lineHeight: "1.5rem", fontWeight: "500" },
        ],
        "body-large": ["1rem", { lineHeight: "1.75rem", fontWeight: "400" }],
        "body-medium": [
          "0.875rem",
          { lineHeight: "1.5rem", fontWeight: "400" },
        ],
        "body-small": ["0.75rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        "label-large": [
          "0.875rem",
          { lineHeight: "1.25rem", fontWeight: "500" },
        ],
        "label-medium": [
          "0.75rem",
          { lineHeight: "1rem", fontWeight: "500", letterSpacing: "0.05em" },
        ],
        "label-small": [
          "0.6875rem",
          {
            lineHeight: "0.875rem",
            fontWeight: "500",
            letterSpacing: "0.05em",
          },
        ],
      },

      spacing: {
        // 8px grid system
        "grid-1": "0.5rem", // 8px
        "grid-2": "1rem", // 16px
        "grid-3": "1.5rem", // 24px
        "grid-4": "2rem", // 32px
        "grid-5": "2.5rem", // 40px
        "grid-6": "3rem", // 48px
        "grid-7": "3.5rem", // 56px
        "grid-8": "4rem", // 64px
        "grid-9": "4.5rem", // 72px
        "grid-10": "5rem", // 80px
      },

      borderRadius: {
        lg: "0.75rem", // 12px
        md: "0.5rem", // 8px
        sm: "0.375rem", // 6px
        xs: "0.25rem", // 4px
      },

      boxShadow: {
        // Material Design Elevation
        "elevation-1": "var(--elevation-1)",
        "elevation-2": "var(--elevation-2)",
        "elevation-3": "var(--elevation-3)",
        "elevation-4": "var(--elevation-4)",
        "elevation-5": "var(--elevation-5)",
      },

      keyframes: {
        // Material Design Motion
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%, 70%, 100%": { opacity: "1" },
          "20%, 50%": { opacity: "0" },
        },
      },

      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },

      transitionTimingFunction: {
        // Material Design Easing
        "material-standard": "cubic-bezier(0.2, 0, 0, 1)",
        "material-decelerate": "cubic-bezier(0, 0, 0, 1)",
        "material-accelerate": "cubic-bezier(0.3, 0, 1, 1)",
      },

      backdropBlur: {
        xs: "2px",
      },

      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      // Z-index scale for proper layering
      zIndex: {
        "1": "1",
        "10": "10",
        "20": "20",
        "30": "30",
        "40": "40",
        "50": "50",
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // Custom plugin for Material Design utilities
    function ({ addUtilities, theme }: any) {
      const newUtilities = {
        // Elevation utilities
        ".elevation-1": {
          boxShadow: theme("boxShadow.elevation-1"),
        },
        ".elevation-2": {
          boxShadow: theme("boxShadow.elevation-2"),
        },
        ".elevation-3": {
          boxShadow: theme("boxShadow.elevation-3"),
        },
        ".elevation-4": {
          boxShadow: theme("boxShadow.elevation-4"),
        },
        ".elevation-5": {
          boxShadow: theme("boxShadow.elevation-5"),
        },

        // Material motion utilities
        ".motion-standard": {
          transitionTimingFunction: theme(
            "transitionTimingFunction.material-standard"
          ),
        },
        ".motion-decelerate": {
          transitionTimingFunction: theme(
            "transitionTimingFunction.material-decelerate"
          ),
        },
        ".motion-accelerate": {
          transitionTimingFunction: theme(
            "transitionTimingFunction.material-accelerate"
          ),
        },

        // Glass effect utility
        ".glass": {
          backgroundColor: "hsl(var(--surface) / 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        },

        // Surface utilities
        ".surface": {
          backgroundColor: "hsl(var(--surface))",
        },
        ".surface-variant": {
          backgroundColor: "hsl(var(--surface-variant))",
        },
      };

      addUtilities(newUtilities);
    },
  ],
};

export default config;
