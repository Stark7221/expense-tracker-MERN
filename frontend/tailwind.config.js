/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
        },
      },
      backgroundImage: {
        'auth-bg-img': "url('/src/assets/images/auth-bg.jpg')",
      },
    },
  },
  plugins: [],
} 