/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        royal: '#1b3a6b',
        gold:  '#c9941a',
        'lesson-bg': '#f8f9fa',
        'teal-primary': '#00a3a3',
        'teal-dark': '#008080',
        'terracotta-primary': '#f08a6a',
        'terracotta-dark': '#e2725b',
      },
      fontFamily: {
        arabic: ['var(--font-amiri)', 'Amiri', 'serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      animation: {
        'fadeUp':   'fadeUp 0.3s ease both',
        'bounceIn': 'bounceIn 0.4s ease both',
        'shakeX':   'shakeX 0.35s ease both',
        'matchPop': 'matchPop 0.3s ease both',
        'float':    'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from:{opacity:'0',transform:'translateY(14px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        bounceIn: { '0%':{transform:'scale(0.85)'}, '60%':{transform:'scale(1.08)'}, '100%':{transform:'scale(1)'} },
        shakeX:   { '0%,100%':{transform:'translateX(0)'}, '20%':{transform:'translateX(-6px)'}, '40%':{transform:'translateX(6px)'}, '60%':{transform:'translateX(-4px)'}, '80%':{transform:'translateX(4px)'} },
        matchPop: { '0%':{transform:'scale(1)'}, '50%':{transform:'scale(1.06)'}, '100%':{transform:'scale(1)'} },
        float:    { '0%,100%':{transform:'translateY(0px)'}, '50%':{transform:'translateY(-8px)'} },
      },
    },
  },
  plugins: [],
};
