/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polar: {
          bg: '#f4f3f0',
          sidebar: '#f8f7f4',
          card: '#ffffff',
          border: '#e5e3dc',
          hover: '#edebe4',
          text: '#1c1917',
          muted: '#78716c',
          950: '#f4f3f0',
          900: '#f8f7f4',
          850: '#eceae4',
          800: '#e2e0d7',
          700: '#d1cec2',
        },
        brand: {
          blue: '#1e40af',
          sky: '#0284c7',
          amber: '#f59e0b',
          rose: '#ef4444',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'polar': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'polar-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
