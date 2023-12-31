/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}", './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
  safelist: ['bg-green-500']
};

module.exports = config;
