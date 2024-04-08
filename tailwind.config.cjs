// @ts-check
const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`;
};

const backgroundColor = {
  primary: generateColorClass("bg-primary"),
  secondary: generateColorClass("bg-secondary"),
  tertiary: generateColorClass("bg-tertiary"),
  success: generateColorClass("bg-success"),
};

const textColor = {
  primary: generateColorClass("text-primary"),
  secondary: generateColorClass("text-secondary"),
  tertiary: generateColorClass("text-tertiary"),
  success: generateColorClass("text-success"),
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn",
      },
      keyframes: (theme) => ({
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 100 },
        },
      }),
      screens: {
        md: "800px", // navbar
        lg: "1024px",
        xl: "1290px",
        "2xl": "1536px",
      },
      fontFamily: {
        sans: "Inter",
        display: ["Inter", ...fontFamily.sans],
        body: ["Inter", ...fontFamily.sans],
      },
      fontSize: {
        "2xs": ["0.6rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      colors: {
        brand: colors.blue,
      },
      backgroundColor,
      textColor,
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "2.5rem",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
};
