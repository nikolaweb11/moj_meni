/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#FEF0F4',
        ink: { DEFAULT: '#2E1A24', light: '#7A4060' },
        forest: { DEFAULT: '#C8486E', light: '#D85E82', dark: '#A03058' },
        terra: { DEFAULT: '#E8956D', light: '#F0A882' },
        gold: { DEFAULT: '#C4892A', light: '#DDA040', dark: '#9E7020' },
        linen: '#F8D8E2',
        mist: '#C09AAC',
        amber: { warm: '#F0A855' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
