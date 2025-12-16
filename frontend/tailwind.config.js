/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Electric Blue
        secondary: '#10B981', // Neon Green
        dark: '#0F172A', // Slate-900 (Deep background)
        light: '#F8FAFC', // Slate-50
        accent: '#06B6D4', // Cyan-500
        surface: '#1E293B', // Slate-800 key surface
      },
      boxShadow: {
        'glow': '0 0 20px rgba(37, 99, 235, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(to right bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=2535&auto=format&fit=crop')", // Abstract city
      }
    },
  },
  plugins: [],
};
