import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { DEFAULT: '#1d1d1f', soft: '#6e6e73' },
        surface: { DEFAULT: 'rgba(255,255,255,0.72)', dark: 'rgba(28,28,30,0.72)' },
        accent: { DEFAULT: '#0071e3', hover: '#0077ed' },
      },
      borderRadius: { xl: '1.25rem', '2xl': '1.75rem' },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.08)',
        float: '0 20px 60px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
