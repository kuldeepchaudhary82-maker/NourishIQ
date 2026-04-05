/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1D9E75",
        secondary: "#1A2340",
        accent: "#EF9F27",
        danger: "#E24B4A",
        success: "#1D9E75",
        background: "#F5F5F3",
        card: "#FFFFFF",
        textPrimary: "#1A1A1A",
        textSecondary: "#5F5E5A",
      },
    },
  },
  plugins: [],
};
