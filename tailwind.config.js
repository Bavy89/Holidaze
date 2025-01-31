/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-red": "#B71818",
        text: "#2F2F2F",
        "text-light": "#4F4F4F",
        outline: "#A7A7A7",
        background: "#FFFDFC",
        cyan: {
          600: '#007A87'  
        }
      },
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
