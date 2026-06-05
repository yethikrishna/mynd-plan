import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'system-ui', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        glass: 'rgb(var(--glass) / <alpha-value>)',
        hairline: 'rgb(var(--hairline) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)'
      },
      borderRadius: { xl: '14px', '2xl': '20px', '3xl': '28px' },
      boxShadow: {
        glass: '0 1px 0 0 rgb(255 255 255 / 0.05) inset, 0 8px 40px -12px rgb(0 0 0 / 0.35)',
        lift: '0 12px 50px -16px rgb(0 0 0 / 0.45)'
      },
      transitionTimingFunction: { spring: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        rise: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        breathe: { '0%,100%': { opacity: '0.5' }, '50%': { opacity: '1' } }
      },
      animation: { rise: 'rise 0.5s cubic-bezier(0.22,1,0.36,1) both', breathe: 'breathe 2s ease-in-out infinite' }
    }
  },
  plugins: []
};

export default config;
