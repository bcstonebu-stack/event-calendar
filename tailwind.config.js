/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          text: '#1F1F1F',
          border: '#E0E0E0',
          accent: '#3B82F6',
        },
        dark: {
          bg: '#0F0F0F',
          surface: '#1E1E1E',
          text: '#E0E0E0',
          border: '#2F2F2F',
          accent: '#60A5FA',
        }
      }
    },
  },
  plugins: [],
}
