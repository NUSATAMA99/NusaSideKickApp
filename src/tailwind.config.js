/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './Frontend/Index.html',
    './Frontend/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#64748b',
        success: '#059669',
        danger: '#dc2626',
        warning: '#d97706',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
      },
      zIndex: {
        '65': '65',
        '75': '75',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
