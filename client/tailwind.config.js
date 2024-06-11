/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0b2447',
      },
    },
  },
  plugins: [],
  // Disables Tailwind CSS preflight styles to allow us to use both Antd components and Tailwind classes
  corePlugins: {
    preflight: false,
  },
};
