/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'space-black': '#050510',
        'space-dark': '#0a0a2e',
        'space-mid': '#0d1240',
        'neon-cyan': '#00f5ff',
        'neon-magenta': '#ff00aa',
        'neon-amber': '#ffaa00',
        'neon-green': '#00ff88',
        'neon-purple': '#9d00ff',
        'text-primary': '#e0f7ff',
        'text-muted': '#7ab8c8',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #00f5ff, #9d00ff)',
        'magenta-gradient': 'linear-gradient(135deg, #ff00aa, #9d00ff)',
        'amber-gradient': 'linear-gradient(135deg, #ffaa00, #ff6600)',
      },
      boxShadow: {
        'neon-cyan': '0 0 16px rgba(0, 245, 255, 0.5), 0 0 32px rgba(0, 245, 255, 0.2)',
        'neon-magenta': '0 0 16px rgba(255, 0, 170, 0.5), 0 0 32px rgba(255, 0, 170, 0.2)',
        'neon-amber': '0 0 16px rgba(255, 170, 0, 0.5)',
        'card-dark': '0 4px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 245, 255, 0.1)',
      },
    },
  },
  plugins: [],
};