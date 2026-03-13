/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#4A90E2',
          orange: '#FF8C42',
          light: '#F5F7FA',
          dark: '#2C3E50'
        },
        warm: {
          yellow: '#FFD93D',
          pink: '#FF6B9D',
          green: '#6BCB77',
          purple: '#9B59B6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Comic Neue', 'cursive', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'hover': '0 8px 30px rgba(0, 0, 0, 0.12)'
      }
    }
  },
  plugins: [],
}