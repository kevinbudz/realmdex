module.exports = {
  content: ["./src/renderer/**/*.{js,jsx,ts,tsx}", ],
  theme: {
    extend: {
      colors: {
        'deep-purple': {
          950 : '#0F0014',
          900 : '#140019',
          800 : '#1A001F',
          200 : '#B088C9',
          50 : '#E4D5EA',
        }
      },
      fontFamily: {
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: 0
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: 1
          }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out'
      }
    },
  },
  plugins: [],
}