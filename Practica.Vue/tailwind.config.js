/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Puedes definir colores personalizados aquí para que sea más elegante
        primary: '#2563eb', 
        secondary: '#64748b'
      }
    },
  },
  plugins: [],
}