/** @type {import('tailwindcss').Config} */
const catppuccin = require('@catppuccin/tailwindcss');
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...catppuccin.mocha,
        ...catppuccin.macchiato,
        ...catppuccin.frappe,
        ...catppuccin.latte
      }
    },
  },
  plugins: [
    require("@catppuccin/tailwindcss")({
    // prefix to use, e.g. `text-pink` becomes `text-ctp-pink`.
    // default is `false`, which means no prefix
    prefix: "ctp",
    // which flavour of colours to use by default, in the `:root`
    // defaultFlavour: "macchiato",
    }),
  ],
}

