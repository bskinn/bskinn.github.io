const RESERVED_TAGS = new Set([
  "all",
  "nav",
  "post",
  "posts",
  "tag",
  "tagList",
  "tags",
]);

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("notes");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("style.css.map");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add("_drafts/**");
  eleventyConfig.ignores.add("_tagpages/**");
  eleventyConfig.ignores.add(".jekyll-cache/**");
  eleventyConfig.ignores.add("_site/**");
  eleventyConfig.ignores.add("_old/**");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("notes/**");

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();

    for (const item of collectionApi.getFilteredByTag("post")) {
      const itemTags = Array.isArray(item.data.tags) ? item.data.tags : [];
      for (const tag of itemTags) {
        if (!RESERVED_TAGS.has(tag)) {
          tags.add(tag);
        }
      }
    }

    return [...tags].sort((a, b) => a.localeCompare(b));
  });

  eleventyConfig.addFilter("initial", (value) => {
    if (!value) {
      return "";
    }
    return String(value).slice(0, 1);
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
    dataTemplateEngine: "liquid",
  };
};
