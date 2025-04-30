const { MODE } = require('./library/constants/global');

 
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    ...(MODE === 'production' && { autoprefixer: {} }),
  },
};
