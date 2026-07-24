import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* =========================
         YOUR ORIGINAL COLORS
      ========================= */
      colors: {
        primary: "#063312",
        secondary: "#CBFF99",
        secondarySurface: "#F0F0E8",
        info: "#204877",
        success: "#CBFF99",
        warning: "#FFFC83",
        error: "#721426",
        accent: "#D5F3FF",
        neutralText: "#848484",
        neutralBg: "#CCCABC",
        whiteBg: "#ffffff",
        leave: "#ff3131",
        weekOff: "#cb6ce6",
        onLate: "#aa276e",


        /* =========================
           NEW SHADCN COLORS
        ========================= */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        bgLemon:"#527a66",

        primaryTheme: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        secondaryTheme: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground":
            "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground":
            "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      /* =========================
         ORIGINAL FONT SIZES
      ========================= */
      fontSize: {
        heading1: ["48px", { lineHeight: "130%", fontWeight: "700" }],
        heading2: ["36px", { lineHeight: "130%", fontWeight: "500" }],
        heading3: ["28px", { lineHeight: "130%", fontWeight: "500" }],
        heading4: ["22px", { lineHeight: "130%", fontWeight: "500" }],
        bodyLarge: ["18px", { lineHeight: "130%", fontWeight: "500" }],
        bodyRegular: ["16px", { lineHeight: "130%", fontWeight: "400" }],
        bodySmall: ["14px", { lineHeight: "130%", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "130%", fontWeight: "400" }],
        smallCaption: ["10px", { lineHeight: "130%", fontWeight: "400" }],
        btn1: ["16px", { lineHeight: "130%", fontWeight: "400" }],
        btn2: ["14px", { lineHeight: "130%", fontWeight: "400" }],
        btnAction: ["16px", { lineHeight: "130%", fontWeight: "500" }],
      },

      /* =========================
         ORIGINAL SHADOWS
      ========================= */
      boxShadow: {
        custom: "5px 5px 15px -5px rgba(0, 0, 0, 0.25)",
        inset: "inset 5px 5px 15px -5px rgba(0, 0, 0, 0.25)",
      },

      dropShadow: {
        custom: "0px 1px 4px rgba(0, 0, 0, 0.25)",
        outerCustom: [
          "0 2px 2px rgba(0, 0, 0, 0.25)",
          "0 5px 5px rgba(0, 0, 0, 0.25)",
        ],
      },

      /* =========================
         ORIGINAL FONT FAMILY
      ========================= */
      fontFamily: {
        regular: ["fact-regular", "sans-serif"],
        bold: ["fact-bold", "sans-serif"],
        medium: ["fact-medium", "sans-serif"],
      },

      padding: {
        paddingX: "30px",
      },

      /* =========================
         MERGED BORDER RADIUS
      ========================= */
      borderRadius: {
        primaryRadius: "20px",
        secondaryRadius: "15px",

        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* =========================
         NEW ANIMATIONS
      ========================= */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: {
            height:
              "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height:
              "var(--radix-accordion-content-height)",
          },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down":
          "accordion-down 0.2s ease-out",
        "accordion-up":
          "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
