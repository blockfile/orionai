/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        spacemono: ['"Space Mono"', "serif"], // Example custom font
        Staatliches: ["Staatliches", "serif"], // Example custom font
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
