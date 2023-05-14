/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
   
  theme: {
    extend: {
      fontFamily:{
        RampartOne:['Rampart One'," cursive"],
        BarlowCondensed: ['Barlow Condensed',' sans-serif'],
        Bellefair: ['Bellefair', 'serif'],
        Barlow: ['Barlow', 'sans-serif'],

    },
   

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
