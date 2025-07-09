import { type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

// Custom keyframes for voice animations
const keyframes = {
  pulse: {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.1)', opacity: 0.8 },
    '100%': { transform: 'scale(1)', opacity: 1 }
  },
  wave: {
    '0%': { transform: 'scaleY(1)' },
    '50%': { transform: 'scaleY(0.5)' },
    '100%': { transform: 'scaleY(1)' }
  },
  fadeIn: {
    '0%': { opacity: 0, transform: 'translateY(10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  }
};

export const theme = {
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900'
      }
    }
  },
  colors: {
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
    },
    voice: {
      idle: '#004E89',
      listening: '#FF6B35',
      processing: '#DAA520',
      speaking: '#2E8B57',
      error: '#E74C3C',
      success: '#27AE60',
    }
  },
  fonts: {
    heading: 'Poppins, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  space: {
    18: '4.5rem',
    88: '22rem',
    96: '24rem',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: '600',
        _focus: {
          boxShadow: '0 0 0 2px #FF6B35',
          outline: 'none',
        },
        _focusVisible: {
          boxShadow: '0 0 0 2px #FF6B35',
          outline: 'none',
        },
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
            transform: 'translateY(-1px)',
            shadow: 'lg',
          },
          _active: {
            bg: 'primary.700',
            transform: 'translateY(0)',
          },
        },
        voice: {
          bg: 'voice.idle',
          color: 'white',
          size: 'lg',
          borderRadius: 'full',
          p: 6,
          _hover: {
            bg: 'voice.listening',
            transform: 'scale(1.05)',
          },
          _active: {
            transform: 'scale(0.95)',
          },
        },
        recording: {
          bg: 'voice.listening',
          color: 'white',
          size: 'lg',
          borderRadius: 'full',
          p: 6,
          animation: 'pulse 1.5s infinite',
          boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)',
        },
      },
      sizes: {
        xs: {
          h: 6,
          minW: 6,
          fontSize: 'xs',
          px: 2,
        },
        sm: {
          h: 8,
          minW: 8,
          fontSize: 'sm',
          px: 3,
        },
        md: {
          h: 10,
          minW: 10,
          fontSize: 'md',
          px: 4,
        },
        lg: {
          h: 12,
          minW: 12,
          fontSize: 'lg',
          px: 6,
        },
        xl: {
          h: 16,
          minW: 16,
          fontSize: 'xl',
          px: 8,
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'sm',
          transition: 'all 0.2s',
          _hover: {
            boxShadow: 'md',
            transform: 'translateY(-2px)',
          },
        },
        header: {
          p: 6,
          borderBottomWidth: '1px',
        },
        body: {
          p: 6,
        },
        footer: {
          p: 6,
          borderTopWidth: '1px',
        },
      },
      variants: {
        elevated: {
          container: {
            bg: 'white',
            boxShadow: 'lg',
          },
        },
        outline: {
          container: {
            borderWidth: '1px',
          },
        },
      },
    },
    VoiceIndicator: {
      baseStyle: {
        container: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'full',
          transition: 'all 0.2s',
        },
        dot: {
          width: '12px',
          height: '12px',
          borderRadius: 'full',
          margin: '2px',
          animation: 'wave 1s infinite',
        },
      },
      variants: {
        listening: {
          dot: {
            bg: 'voice.listening',
          },
        },
        processing: {
          dot: {
            bg: 'voice.processing',
          },
        },
        speaking: {
          dot: {
            bg: 'voice.speaking',
          },
        },
      },
    },
    VoiceTranscript: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: 'xl',
          p: 4,
          boxShadow: 'sm',
        },
      },
    },
  },
};