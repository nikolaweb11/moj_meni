/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F5EBDB',
        ink: { DEFAULT: '#1A1814', light: '#3D3830' },
        forest: { DEFAULT: '#2D4A3E', light: '#3D6B59', dark: '#1A2E27' },
        terra: { DEFAULT: '#8B5033', light: '#A86A48' },
        gold: { DEFAULT: '#C4892A', light: '#DDA040', dark: '#9E7020' },
        linen: '#EAD9C6',
        mist: '#96A89E',
        amber: { warm: '#F0A855' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
