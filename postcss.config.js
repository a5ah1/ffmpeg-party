module.exports = (ctx) => ({
  plugins: {
    '@tailwindcss/postcss': {},
    ...(ctx.env === 'production' ? { cssnano: {} } : {}),
  },
});
