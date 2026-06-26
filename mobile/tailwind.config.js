/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#002D56",
        secondary: "#ffffff",
        background: "#ffffff",
        foreground: "#000000",
        muted: "#8E8E93",
        "muted-foreground": "#8E8E93",
        // card: "#ffffff",
        // "card-foreground": "#002D56",
      },
    },
  },
  plugins: [],
};
