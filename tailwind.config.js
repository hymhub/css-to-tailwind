/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '!./npm/**/*'
  ],
  theme: {
    extend: {
      height: {
        'dom-height': 'var(--dom-height)'
      },
      screens: {
        'lgx': '1180px'
      }
    }
  },
  plugins: []
}
