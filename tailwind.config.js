/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F1ECE4',
        ink: { DEFAULT: '#1A1A18', light: '#3D3D3A' },
        forest: { DEFAULT: '#2D4A3E', light: '#3D6B59', dark: '#1A2E27' },
        terra: { DEFAULT: '#8B5E3C', light: '#A87550' },
        gold: { DEFAULT: '#C4932A', light: '#DDB046', dark: '#9E7520' },
        linen: '#E8DED4',
        mist: '#A0B0AC',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
