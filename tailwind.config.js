/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          deep: '#0a0e1a',
          midnight: '#1a1f3a',
          surface: '#141829',
          amber: '#d4a574',
          gold: '#f0d9a8',
          rain: '#6b7280',
          fog: 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'rain': 'rain 1s linear infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'fade-in': 'fadeIn 1.5s ease-out forwards',
        'text-reveal': 'textReveal 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', boxShadow: '0 0 20px rgba(212,165,116,0.1)' },
          '50%': { opacity: '1', boxShadow: '0 0 40px rgba(212,165,116,0.3)' },
        },
        rain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        textReveal: {
          '0%': { opacity: '0', filter: 'blur(8px)', transform: 'translateY(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
