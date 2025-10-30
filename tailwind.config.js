module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          red: '#ff0033',
          accent: '#ff3355',
          pink: '#ff6688',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          hover: '#2a2a2a',
        }
      }
    },
  },
  plugins: [],
}
