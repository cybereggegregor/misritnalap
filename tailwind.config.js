/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'primary-bg': 'var(--primary-bg)',
        'secondary-bg': 'var(--secondary-bg)',
        'text-color': 'var(--text-color)',
        'text-color-light': 'var(--text-color-light)',
        'border-color': 'var(--border-color)',
        'accent-color': 'var(--accent-color)',
        'accent-hover-color': 'var(--accent-hover-color)',
        'success-color': 'var(--success-color)',
        'error-color': 'var(--error-color)',
        'info-color': 'var(--info-color)',
        'base': '#0f0f13',
        'accent-reddit': '#ff5700',
        'accent-gemini': '#00d4ff',
        'data-pink': '#ff3e82',
        'data-green': '#00ffaa',
        'cyber-green': '#00ffaa', // Alias for consistency
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
        'ibm-plex-mono': ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}