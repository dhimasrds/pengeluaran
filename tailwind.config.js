/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#fafafa',
        surface: '#ffffff',
        border: {
          DEFAULT: '#e4e4e7',
          dark: '#d4d4d8',
        },
        text: {
          primary: '#18181b',
          secondary: '#52525b',
          muted: '#a1a1aa',
        },
        accent: {
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
          pressed: '#3730a3',
          fg: '#ffffff',
          light: '#eef2ff',
        },
        destructive: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          fg: '#ffffff',
        },
        success: {
          DEFAULT: '#16a34a',
          light: '#f0fdf4',
        },
        warning: {
          DEFAULT: '#ea580c',
          light: '#fff7ed',
        },
        info: {
          DEFAULT: '#0284c7',
          light: '#f0f9ff',
        },
      },
      borderRadius: {
        sm: '0.25rem',   // 4px
        md: '0.375rem',  // 6px
        lg: '0.5rem',    // 8px
        xl: '0.75rem',   // 12px
        '2xl': '1rem',   // 16px
      },
      spacing: {
        2: '0.125rem',   // 2px
        4: '0.25rem',    // 4px
        6: '0.375rem',   // 6px
        8: '0.5rem',     // 8px
        12: '0.75rem',   // 12px
        16: '1rem',      // 16px
        24: '1.5rem',    // 24px
        32: '2rem',      // 32px
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.08)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.08)',
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
      },
    },
  },
  plugins: [],
}

