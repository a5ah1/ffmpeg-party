module.exports = function (eleventyConfig) {
  // Enable showing network IPs for remote access
  eleventyConfig.setServerOptions({
    showAllHosts: true,
    port: 8080
  });

  // Copy CSS, JS, and static assets to output
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/images');

  // Copy favicons and web app manifest
  eleventyConfig.addPassthroughCopy('src/favicon.ico');
  eleventyConfig.addPassthroughCopy('src/icons');
  eleventyConfig.addPassthroughCopy('src/site.webmanifest');

  // Copy GitHub Pages configuration files
  eleventyConfig.addPassthroughCopy('src/CNAME');
  eleventyConfig.addPassthroughCopy('src/.nojekyll');
  eleventyConfig.addPassthroughCopy('src/robots.txt');

  // Watch CSS files for changes
  eleventyConfig.addWatchTarget('src/css/output.css');
  eleventyConfig.addWatchTarget('src/css/cropper.css');
  eleventyConfig.addWatchTarget('src/css/anamorphic-crop.css');

  // Watch JavaScript files for changes
  eleventyConfig.addWatchTarget('src/js/**/*.js');

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_includes'
    },
    pathPrefix: '/',
    templateFormats: ['md', 'html', 'liquid'],
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid'
  };
};
