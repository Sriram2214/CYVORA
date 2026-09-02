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
        cyvora: {
          bg: '#F4F6FA',
          card: '#FFFFFF',
          cardHover: '#F8FAFC',
          border: '#E2E8F0',
          borderGlow: '#0284C7',
          accent: '#0284C7',
          accentGlow: 'rgba(2, 132, 199, 0.12)',
          primary: '#0284C7',
          success: '#059669',
          warning: '#D97706',
          danger: '#DC2626',
          critical: '#DB2777',
          muted: '#64748B',
          text: '#0F172A',
          subtext: '#475569'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        '3d': '0 10px 25px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)',
        '3d-hover': '0 20px 35px -5px rgba(2, 132, 199, 0.12), 0 8px 12px -6px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 1)',
        '3d-cyan': '0 12px 28px -4px rgba(2, 132, 199, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        '3d-rose': '0 12px 28px -4px rgba(225, 29, 72, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        '3d-emerald': '0 12px 28px -4px rgba(5, 150, 105, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        '3d-purple': '0 12px 28px -4px rgba(147, 51, 234, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }
    },
  },
  plugins: [],
}
