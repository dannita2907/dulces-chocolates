import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cacao: {
          50: "#faf5f0",
          100: "#f1e4d6",
          200: "#e0c6a9",
          300: "#c9a07a",
          400: "#a97a52",
          500: "#8a5a37",
          600: "#6f4529",
          700: "#573520",
          800: "#3f261a",
          900: "#2b1810",
        },
        gold: {
          300: "#e6c77a",
          400: "#d9b25a",
          500: "#c8963e",
          600: "#a87a2c",
        },
        cream: "#fbf6ec",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
