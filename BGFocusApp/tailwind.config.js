/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgfocus: {
          primary: '#00D4AA', // Teal
          secondary: '#FFD700', // Yellow
          accent: '#40E0D0', // Turquoise
          dark: '#0A0A0A',
          'dark-surface': '#1A1A1A',
          'dark-card': '#2A2A2A',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px #00D4AA' },
          '100%': { boxShadow: '0 0 30px #00D4AA, 0 0 40px #00D4AA' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
