/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D2D73',
          light: '#3f3f9e',
          dark: '#1e1e4f',
        },
        secondary: {
          DEFAULT: '#68C247',
          light: '#82d962',
          dark: '#4f9b31',
        },
        valoBg: '#F7F9FC',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass-sm': '0 4px 12px 0 rgba(45, 45, 115, 0.03), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
        'glass': '0 8px 32px 0 rgba(45, 45, 115, 0.05), inset 0 1px 1px 0 rgba(255, 255, 255, 0.7)',
        'glass-lg': '0 20px 40px 0 rgba(45, 45, 115, 0.08), inset 0 1px 2px 0 rgba(255, 255, 255, 0.6)',
      }
    },
  },
  plugins: [],
}

