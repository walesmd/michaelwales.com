const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { rssPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // Syntax highlighting plugin (replaces highlight.js)
  eleventyConfig.addPlugin(syntaxHighlight);

  // RSS/Atom feed filters (dateToRfc3339, getNewestCollectionItemDate, absoluteUrl, htmlToAbsoluteUrls)
  eleventyConfig.addPlugin(rssPlugin);

  // Date formatting filters (replaces moment.js)
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-MM-dd");
  });

  // Custom collection: articles sorted by date descending
  eleventyConfig.addCollection("articles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/articles/*/index.md")
      .sort((a, b) => b.date - a.date);
  });

  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Copy article images (co-located with posts)
  eleventyConfig.addPassthroughCopy("src/articles/**/*.{png,jpg,jpeg,gif,svg,webp}");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
