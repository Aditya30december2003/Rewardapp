/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // ✅ Add NextUI theme files so Tailwind can see their classes
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        storekwiltext: "#AE6AF5",
        "nav-inactive": "#747475",
        "nav-bgactive": "#373737",
        surface: "#FBF9F7",
        primary: "#BD25FF",
        secondary: "#2C45F4",
        light: "#fff",
        bodyColor: "var(--bodyColor)",
        accentColor: "var(--accentColor)",
      },
    },
  },
  // ✅ Add the NextUI plugin
  plugins: [nextui()],
};
