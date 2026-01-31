/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotter': {
          bg: '#1a2e35',
          'bg-dark': '#152428',
          'bg-card': '#1e3a42',
          'bg-card-hover': '#234850',
          border: '#2d4a54',
          'border-light': '#3d5a64',
          teal: '#2dd4bf',
          'teal-dark': '#14b8a6',
          coral: '#f87171',
          gold: '#fbbf24',
          'text-primary': '#ffffff',
          'text-secondary': '#94a3b8',
          'text-muted': '#64748b',
        },
        'eld': {
          'off': '#22c55e',
          'sleeper': '#fbbf24',
          'driving': '#2dd4bf',
          'on': '#f87171',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'display': ['Outfit', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'spotter-gradient': 'linear-gradient(135deg, #1a2e35 0%, #152428 100%)',
        'card-gradient': 'linear-gradient(180deg, #1e3a42 0%, #1a3038 100%)',
      },
      boxShadow: {
        'spotter': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'spotter-lg': '0 8px 40px rgba(0, 0, 0, 0.4)',
        'glow-teal': '0 0 20px rgba(45, 212, 191, 0.3)',
      },
    },
  },
  plugins: [],
}
