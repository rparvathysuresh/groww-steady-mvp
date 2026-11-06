import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00D09C",
          dark: "#00B386",
          light: "#E6FAF5",
        },
        navy: {
          DEFAULT: "#1E222B",
          dark: "#12151B",
          light: "#2C323F",
        },
        surface: {
          canvas: "#F9FAFB",
          card: "#FFFFFF",
          muted: "#F3F4F6",
        },
        border: {
          subtle: "#E5E7EB",
          default: "#D1D5DB",
        },
        finance: {
          gain: "#00B386",
          loss: "#EB5757",
          neutral: "#6B7280",
        },
      },
      maxWidth: {
        "mobile-frame": "420px",
      },
    },
  },
  plugins: [],
};

export default config;

