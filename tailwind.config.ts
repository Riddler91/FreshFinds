import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: soft sage green
        sage: {
          50: "#f4f7f5",
          100: "#e4ece6",
          200: "#c8d9cc",
          300: "#a3bfa9",
          400: "#7C9082",
          500: "#6b7e71",
          600: "#5a6d60",
          700: "#48594e",
          800: "#37453b",
          900: "#263129",
        },
        // Secondary: warm terracotta
        terra: {
          50: "#fdf5f3",
          100: "#fae8e3",
          200: "#f5d2c8",
          300: "#ecb0a0",
          400: "#e08b75",
          500: "#C2765C",
          600: "#b06951",
          700: "#9d5c47",
          800: "#7a4637",
          900: "#5c352a",
        },
        // Accent: golden honey
        honey: {
          50: "#fefaf3",
          100: "#fdf2dd",
          200: "#fbe6bb",
          300: "#f8d590",
          400: "#D4A853",
          500: "#c99a46",
          600: "#b88a3b",
          700: "#987130",
          800: "#735626",
          900: "#52401c",
        },
        // Warm cream background
        cream: {
          50: "#FEF9F0",
          100: "#FDF5E6",
          200: "#FAEED9",
          300: "#F5E5C8",
          400: "#ECD9B0",
          500: "#E0C998",
        },
        // Card white
        card: {
          DEFAULT: "#FFFBF5",
        },
        // Text dark warm brown
        ink: {
          DEFAULT: "#3D2C1E",
          light: "#6B5D4F",
          muted: "#9B8E82",
        },
        // Success: rich green
        success: {
          DEFAULT: "#5B8C5A",
        },
        // Fresh green pulse (for the "Fresh Right Now" indicators)
        fresh: {
          50: "#f0f7f0",
          100: "#dcefdc",
          200: "#b9dfb9",
          300: "#8dcf8d",
          400: "#5B8C5A",
          500: "#4d7a4c",
          600: "#406840",
          700: "#345634",
          800: "#274327",
          900: "#1b301b",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "Times New Roman", "serif"],
        sans: ['"Nunito"', "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        warm: "0 4px 14px rgba(61, 44, 30, 0.06)",
        "warm-md": "0 6px 20px rgba(61, 44, 30, 0.08)",
        "warm-lg": "0 10px 30px rgba(61, 44, 30, 0.10)",
        "warm-xl": "0 20px 50px rgba(61, 44, 30, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
