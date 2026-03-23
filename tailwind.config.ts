import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        honey: {
          DEFAULT: "#F5A623",
          light: "#FFD07A",
          dark: "#D4891A",
        },
        navy: {
          DEFAULT: "#1A2B4A",
          light: "#243761",
          dark: "#111E33",
        },
        pollen: "#FFD700",
        warm: {
          gray: "#F7F5F2",
          dark: "#E8E4DF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "wave-1": "wave 1.2s ease-in-out infinite",
        "wave-2": "wave 1.2s ease-in-out infinite 0.15s",
        "wave-3": "wave 1.2s ease-in-out infinite 0.3s",
        "wave-4": "wave 1.2s ease-in-out infinite 0.45s",
        "wave-5": "wave 1.2s ease-in-out infinite 0.6s",
        "wave-6": "wave 1.2s ease-in-out infinite 0.75s",
        "wave-7": "wave 1.2s ease-in-out infinite 0.9s",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 166, 35, 0)" },
          "50%": { boxShadow: "0 0 20px 6px rgba(245, 166, 35, 0.3)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
