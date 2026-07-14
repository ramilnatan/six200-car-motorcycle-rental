/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f7ff', 100: '#e0efff', 200: '#baddff', 300: '#7cc0ff',
          400: '#3aa0ff', 500: '#0e80ef', 600: '#0062cc', 700: '#004fa5',
          800: '#034488', 900: '#093a71', 950: '#062347',
        },
        charcoal: '#2A2A2A',
        silver: '#D9D9D9',
      },
      boxShadow: {
        'luxury': '0 4px 24px rgba(0,0,0,0.08)',
        'luxury-lg': '0 8px 48px rgba(0,0,0,0.12)',
        'luxury-xl': '0 16px 64px rgba(0,0,0,0.16)',
      },
    },
  },
  plugins: [],
}
