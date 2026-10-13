/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#234B35",
          secondary: "#D6A75C",
          brass: "#8A6416",
          cream: "#F9F5EC",
          sand: "#EFE7D6",
          dark: "#17251D",
          // Darkened from #7B827C so small text passes contrast on the cream background
          muted: "#5C645E",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
