/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // Deep Indigo/Slate (Dark Mode Default)
        foreground: "#f8fafc",
        card: "#1e293b",
        "card-foreground": "#f8fafc",
        primary: "#4f46e5", // Indigo 600
        "primary-foreground": "#f8fafc",
        secondary: "#2dd4bf", // Teal 400
        "secondary-foreground": "#0f172a",
        muted: "#334155",
        "muted-foreground": "#94a3b8",
        destructive: "#ef4444",
        "destructive-foreground": "#f8fafc",
        border: "#334155",
        input: "#334155",
      },
    },
  },
  plugins: [],
};
