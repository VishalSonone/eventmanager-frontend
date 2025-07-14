/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.3s ease-in-out',
        fade: 'fade 0.4s ease-in',
        successFade: 'successFade 0.6s ease-in-out',
        flashGreen: 'flashGreen 0.6s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        fade: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        successFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flashGreen: {
          '0%': { backgroundColor: '#d1fae5' }, // emerald-100
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
   animation: {
    fade: 'fade 0.3s ease-in-out',
    successFade: 'successFade 1s ease-in-out',
  },
  keyframes: {
    fade: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    successFade: {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
  animation: {
    fade: "fade 0.4s ease-in",
    successFade: "successFade 1s ease-in-out",
  },
  keyframes: {
    fade: {
      from: { opacity: "0" },
      to: { opacity: "1" },
    },
    successFade: {
      "0%": { opacity: "0", transform: "translateY(10px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
  },
  plugins: [],
  extend: {
  animation: {
    successFade: 'successFade 1.2s ease-in-out',
  },
  keyframes: {
    successFade: {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
  },
}

};
