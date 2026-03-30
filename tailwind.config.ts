import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        black_secondary: "#333",        
        gray_primary: "#4E4E4E",        
        gray_secondary: "#838383",        
      },      
      fontFamily: {        
        inter: ["var(--font-inter)"],
        urbanist: ["var(--font-urbanist)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
