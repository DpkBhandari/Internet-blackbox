/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        void: '#070810',
        ink: '#0D0F1A',
        surface: '#12151F',
        panel: '#181C2A',
        border: '#1F2435',
        muted: '#2A3045',
        ghost: '#3D4560',
        dim: '#6B7A9F',
        neutral: '#9BA8C4',
        bright: '#C8D3F0',
        signal: '#E8F0FF',
        
        // Accent colors
        cyan: {
          DEFAULT: '#00D4FF',
          dim: '#0099BB',
          glow: 'rgba(0,212,255,0.15)',
        },
        violet: {
          DEFAULT: '#7C3AED',
          bright: '#A78BFA',
          glow: 'rgba(124,58,237,0.2)',
        },
        amber: {
          DEFAULT: '#F59E0B',
          bright: '#FCD34D',
          glow: 'rgba(245,158,11,0.2)',
        },
        rose: {
          DEFAULT: '#F43F5E',
          bright: '#FB7185',
          glow: 'rgba(244,63,94,0.2)',
        },
        emerald: {
          DEFAULT: '#10B981',
          bright: '#34D399',
          glow: 'rgba(16,185,129,0.15)',
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), 
                         linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'data-stream': 'dataStream 20s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,212,255,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.2)' },
        },
        dataStream: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      boxShadow: {
        'cyan-sm': '0 0 10px rgba(0,212,255,0.2)',
        'cyan-md': '0 0 20px rgba(0,212,255,0.3)',
        'cyan-lg': '0 0 40px rgba(0,212,255,0.4)',
        'violet-sm': '0 0 10px rgba(124,58,237,0.2)',
        'panel': '0 4px 24px rgba(0,0,0,0.4)',
        'panel-lg': '0 8px 48px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
