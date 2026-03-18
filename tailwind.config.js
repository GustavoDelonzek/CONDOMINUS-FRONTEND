/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F7FA', // Pale Blue-Gray
        surface: '#FFFFFF',    // Pure White
        primary: '#3057F2',    // Royal Blue
        sidebar: '#1E1F25',    // Dark Gunmetal
        dark: '#1E1F25',
        success: '#5CB85C',    // Green
        error: '#DC2F1C',      // Red
        warning: '#FFBD00',    // Yellow
        'gray-text': '#64748b',
        'gray-blue': {
          100: '#F9FBFD',
        }
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}