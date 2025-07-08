import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aurasense Brand Colors (Accessibility-First)
        primary: {
          50: '#FFF5E6',
          100: '#FFE5CC',
          200: '#FFCC99',
          300: '#FFB366',
          400: '#FF9933',
          500: '#FF6B35', // Primary Orange
          600: '#E85A2A',
          700: '#CC4A1F',
          800: '#B33914',
          900: '#99280A',
        },
        secondary: {
          50: '#E6F4F8',
          100: '#CCE8F0',
          200: '#99D1E2',
          300: '#66BAD3',
          400: '#33A3C5',
          500: '#004E89', // Secondary Blue
          600: '#003D6B',
          700: '#002C4E',
          800: '#001B30',
          900: '#000A13',
        },
        accent: {
          50: '#FFFACD',
          100: '#FFF59B',
          200: '#FFEB38',
          300: '#FFE135',
          400: '#FFD700', // Accent Gold
          500: '#DAA520',
          600: '#B8891B',
          700: '#966D16',
          800: '#745211',
          900: '#52360C',
        },
        earth: {
          50: '#F5F2F0',
          100: '#EBE5E0',
          200: '#D7CBC1',
          300: '#C3B1A2',
          400: '#AF9783',
          500: '#8B4513', // Earth Brown
          600: '#70370F',
          700: '#54290B',
          800: '#381B07',
          900: '#1C0D04',
        },
        fresh: {
          50: '#F0F8F5',
          100: '#E0F1EB',
          200: '#C2E3D7',
          300: '#A3D5C3',
          400: '#85C7AF',
          500: '#2E8B57', // Fresh Green
          600: '#256F46',
          700: '#1C5334',
          800: '#123623',
          900: '#091A11',
        },
        health: {
          warning: '#F39C12',
          error: '#E74C3C',
          success: '#27AE60',
          info: '#3498DB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'default': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '96': '24rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'microphone-pulse': 'microphonePulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        microphonePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};

export default config;
