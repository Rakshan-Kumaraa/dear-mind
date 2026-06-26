/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgStart: 'var(--bg-gradient-start)',
        bgEnd: 'var(--bg-gradient-end)',
        accentStart: 'var(--accent-start)',
        accentEnd: 'var(--accent-end)',
        textMain: 'var(--text-main)',
      },
    },
  },
  plugins: [],
}