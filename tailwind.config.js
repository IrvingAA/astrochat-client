/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  darkMode: 'class',
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#13322B',
        secondary: '#691C32',
        accent: '#B79F83',
        dark: '#393C3E',
        'dark-page': '#121212',
        positive: '#235B4E',
        negative: '#C10015',
        info: '#3498DB',
        warning: '#F2C037',
        white: '#f1f5f9',
        bluegrey: '#DCDFE6',
        grey: '#393c3e',
        blue: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#93c5fd',
        },
        wine: '#722F37',
        teal: '#008080',
        slate: {
          dark: '#0f172a',
          light: '#1e293b',
        },
        text: '#94a3b8',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #1e293b, #0f172a)',
      },
      animation: {
        slideIn: 'slideIn 1.5s ease-out',
        fadeIn: 'fadeIn 2.5s ease-in-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require('tailwindcss-animated')],
};
