import heroUINativePlugin from 'heroui-native/tailwind-plugin'

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/heroui-native/lib/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand colors
        'color-brand': '#00b96b',

        // Purple variants
        purple: {
          100: '#9c96f9',
          20: '#9c96f933'
        },

        // Orange variants
        orange: {
          100: '#ffb26e',
          20: '#ffb26e33',
          10: '#ffb26e1a'
        },

        // Blue variants
        blue: {
          100: '#6fb1fa',
          20: '#6fb1fa33',
          10: '#6fb1fa1a'
        },

        // Pink variants
        pink: {
          100: '#e398c9',
          20: '#e398c933'
        },

        // Red variants
        red: {
          100: '#ff0000',
          20: '#ff000033',
          10: '#ff00001a'
        },

        // Gray variants
        gray: {
          80: '#a0a1b0cc',
          60: '#a0a1b099',
          40: '#a0a1b066',
          20: '#a0a1b033',
          10: '#a0a1b01a'
        },

        // Yellow variants
        yellow: {
          100: '#F9EA42',
          20: '#F9EA4233'
        },

        // Green variants (from themes)
        green: {
          100: '#81df94', // light theme
          20: '#8de59e4d',
          10: '#8de59e26'
        },

        // Text colors
        'text-delete': '#dc3e42',
        'text-link': '#0090ff',
        'text-primary': '#202020', // light theme
        'text-secondary': '#646464', // light theme

        // Background colors
        'background-primary': '#f7f7f7', // light theme
        'background-secondary': '#ffffff99', // light theme
        'background-opacity': '#ffffff', // light theme

        // UI colors
        'ui-card': '#ffffff', // light theme
        'ui-card-background': '#ffffff', // light theme

        // Border colors
        'border-color': 'rgba(0, 0, 0, 0.1)',
        'color-border-linear': '#000000' // light theme
      }
    }
  },
  darkMode: 'class',
  plugins: [heroUINativePlugin]
}
