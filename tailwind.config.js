/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High contrast color palette for accessibility
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#2563eb',
        success: '#16a34a',
        warning: '#ca8a04',
        error: '#dc2626',
      },
      fontSize: {
        // Large font sizes for accessibility
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],
        'sm': ['1rem', { lineHeight: '1.5rem' }],
        'base': ['1.125rem', { lineHeight: '1.75rem' }],
        'lg': ['1.25rem', { lineHeight: '1.875rem' }],
        'xl': ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        // Larger touch targets for accessibility
        '18': '4.5rem',
        '20': '5rem',
      },
    },
  },
  plugins: [],
}
