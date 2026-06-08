/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: { base: '#080d1a', surface: 'rgba(255,255,255,0.04)' },
        accent: { blue: '#3b82f6', gold: '#f59e0b' },
        risk: { critical: '#dc2626', high: '#f97316', medium: '#f59e0b', low: '#22c55e' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4)',
        'risk-high': '0 0 20px rgba(239,68,68,0.5)',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
}
