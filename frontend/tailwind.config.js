export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f0',
          100: '#e5eddb',
          300: '#a9bd89',
          500: '#748b5d',
          700: '#4e6042'
        },
        sand: '#e8dcc6',
        cream: '#fbf7ee',
        charcoal: '#1f211d',
        lavender: '#c8bedb'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(74, 85, 64, 0.12)'
      }
    }
  },
  plugins: []
};
