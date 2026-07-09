/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pays-basque': {
          green: '#2d6a4f',
          'green-light': '#52b788',
          red: '#c1121f',
          sand: '#f4e9d5',
          dark: '#1b263b',
        },
      },
    },
  },
  plugins: [],
};
