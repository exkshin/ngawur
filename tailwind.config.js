/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js", "./src/*.{tsx}"],
  theme: {
    fontFamily: {
      Asap: ["Asap"],
      Montecarlo: ["Montecarlo", "cursive"],
    },
    fontSize: {
      h1: ["40px", "46px"],
      h2: ["30px", "34px"],
      h3: ["24px", "28px"],
      h4: ["20px", "24px"],
      h5: ["18px", "22px"],
      "16px": ["16px", "20px"],
      "14px": ["14px", "18px"],
      "12px": ["12px", "16px"],
      "11px": ["11px", "15px"],
      "10px": ["10px", "14px"],
    },
    extend: {
      boxShadow: {
        "outline-up":
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
        customForFilter: "0 -2px 4px 0 rgba(0, 0, 0, 0.25)",
      },
      transitionProperty: {
        transform: "transform",
      },
      translate: {
        full: "100%",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        slideUp: "slideUp 0.3s forwards",
        slideDown: "slideDown 0.3s forwards",
      },
      colors: {
        background: "#EAEAEA",
        main: {
          Pressed: "#359F19",
          Hover: "#42CC1F",
          Main: "#A9E06D",
          Border: "#78DF5D",
          Surface: "#ECFFEC",
        },
        neutral: {
          100: "#000000",
          90: "#323F4B",
          80: "#475A6B",
          70: "#7B8794",
          60: "#9AA5B1",
          50: "#CBD2D9",
          40: "#E4E7EB",
          30: "#F2F3F5",
          20: "#F8F9FA",
          10: "#FFFFFF",
        },
        danger: {
          Hover: "#B91919",
          Main: "#D21C1C",
          Border: "#F4D2D2",
          Surface: "#FCF3F2",
          Pressed: "#9D1515",
        },
        success: {
          Main: "#28A138",
          Hover: "#238B31",
          Pressed: "#1D7228",
          Border: "#C3DFC7",
          Surface: "#F0F7F5",
        },
        info: {
          Main: "#0172CB",
          Hover: "#0161AC",
          Pressed: "#01508E",
          Border: "#D0E9FB",
          Surface: "#F2F8FC",
        },
        warning: {
          Main: "#E98305",
          Hover: "#DC7C05",
          Pressed: "#CD7304",
          Border: "#FAE2C7",
          Surface: "#FCF9F2",
        },
      },
      display: ["before", "after"],
      content: ["before", "after"],
    },
  },
  plugins: [require("flowbite/plugin")],
};

