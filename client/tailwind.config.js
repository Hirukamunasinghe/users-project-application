/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        bgcolor: "#212A3E",
        bordercolor: "#404B58",
        searchcolor: " #A2AAB6"
      }
    },
  },
  plugins: [],
}