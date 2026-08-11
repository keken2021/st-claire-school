/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          DEFAULT: "#C43B6E",
          50: "#FBF5F7",
          100: "#F6E8EE",
          200: "#ECD0DC",
          300: "#E0A8BE",
          400: "#D06B92",
          500: "#C43B6E",
          600: "#A82F5C",
          700: "#88264B",
          800: "#6B1E3C",
          900: "#4A1529",
        },
        blush: {
          DEFAULT: "#D06B92",
          light: "#ECD0DC",
        },
        cream: "#FAF7F5",
        gold: {
          DEFAULT: "#B8973A",
          light: "#D4BC6A",
          // Darkened from #8F7429 so gold text on a gold/10 tint clears WCAG AA.
          dark: "#6B5716",
        },
        ink: "#1C1917",
        mist: "#F3F0EE",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        display: "-0.025em",
        brand: "0.18em",
      },
      backgroundImage: {
        spotlight:
          "radial-gradient(circle at 50% 30%, rgba(196,59,110,0.18), rgba(196,59,110,0) 55%)",
        "curtain-fade":
          "linear-gradient(180deg, rgba(250,247,245,0) 0%, #FAF7F5 100%)",
        "hero-veil":
          "linear-gradient(180deg, rgba(28,25,23,0.45) 0%, rgba(28,25,23,0.55) 40%, rgba(28,25,23,0.92) 100%)",
      },
      boxShadow: {
        soft: "0 24px 48px -20px rgba(28,25,23,0.18)",
        card: "0 8px 28px -12px rgba(28,25,23,0.1)",
        gold: "0 10px 28px -10px rgba(184,151,58,0.4)",
        elev: "0 1px 0 rgba(28,25,23,0.04), 0 12px 40px -16px rgba(28,25,23,0.14)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(6deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(-4deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sweep: {
          "0%": { transform: "translateX(-30%) rotate(8deg)", opacity: "0" },
          "15%": { opacity: "0.45" },
          "100%": { transform: "translateX(130%) rotate(8deg)", opacity: "0" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        floatSlow: "floatSlow 9s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        sweep: "sweep 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
