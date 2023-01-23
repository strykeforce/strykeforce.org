/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./website/templates/*.html", "./website/templates/**/*.html"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      yellow: {
        200: "#FFE8A4",
        300: "#FFD047",
        400: "#FFD047",
        500: "#F3BB17",
        DEFAULT: "#F3BB17",
        600: "#D8A716",
        700: "#BD9213",
      },
      blue: {
        100: "#BBE4FF",
        200: "#91D3FF",
        300: "#5EB1E9",
        400: "#3292D2",
        500: "#0E76BC",
        DEFAULT: "#0E76BC",
        600: "#0D619A",
        700: "#0B4C77",
        800: "#093755",
        900: "#062133",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
