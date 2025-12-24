/**************************************************************
 * Tailwind configuration for Vite + React.
 **************************************************************/
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eaf8ff',
          100: '#d5f0ff',
          200: '#aee6ff',
          300: '#7cd7ff',
          400: '#34bfff',
          500: '#0b88c8',
          600: '#096f9e',
          700: '#074f6f',
          800: '#053748',
          900: '#021827'
        }
      }
    }
  },
  plugins: []
};
