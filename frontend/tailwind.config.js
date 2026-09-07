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
        forest: {
          bg: '#0B130E',
          card: '#132018',
          surface: '#1B2E23',
          border: '#233C2E',
        },
        tea: {
          dark: '#0E2218',
          primary: '#183B2B',
          emerald: '#225842',
          green: '#2F7A59',
          leaf: '#489D73',
          mint: '#69C496',
          sage: '#8FA89B',
          soft: '#DFF5E1',
          mist: '#EEF8F1',
          cream: '#FAF9F5',
          ivory: '#F4F6F4',
          border: '#E1EAE3',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'tea-sm': '0 2px 10px -2px rgba(24, 59, 43, 0.06)',
        'tea-md': '0 10px 30px -8px rgba(24, 59, 43, 0.10)',
        'tea-lg': '0 20px 40px -12px rgba(24, 59, 43, 0.15)',
        'tea-glow': '0 0 25px rgba(105, 196, 150, 0.3)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}

