/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          light: '#DEB887', // Burlywood
          DEFAULT: '#D2B48C', // Tan
          dark: '#8B4513', // SaddleBrown
          darker: '#5C3A21'
        },
        ink: {
          DEFAULT: '#1a1a1a',
          light: '#2d2d2d'
        },
        xiangqi: {
          red: '#C62828',
          black: '#212121',
          board: '#F5DEB3', // Wheat
          highlight: '#FFD700', // Gold
          primary: '#8B4513'
        }
      },
      backgroundImage: {
        'wood-pattern': "url('/assets/desktop/bg.png')",
        'board-pattern': "url('/assets/desktop/board.png')"
      },
      fontFamily: {
        'serif': ['Noto Serif', 'serif'],
        'sans': ['Be Vietnam Pro', 'sans-serif']
      }
    },
  },
  plugins: [],
}
