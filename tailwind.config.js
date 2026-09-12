/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-primary)',
        'brand-soft': 'var(--color-primary-soft)',
        'brand-contrast': 'var(--color-primary-contrast)',
        accent: 'var(--color-accent)',
        'img-from': 'var(--img-gradient-from)',
        'img-to': 'var(--img-gradient-to)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
