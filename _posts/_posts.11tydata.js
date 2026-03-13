const path = require("path");

module.exports = {
  layout: "post",
  eleventyComputed: {
    date: (data) => {
      const basename = path.basename(data.page.inputPath, path.extname(data.page.inputPath));
      const match = basename.match(/^(\d{4})-(\d{2})-(\d{2})-/);
      if (!match) {
        return data.page.date;
      }
      return new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00Z`);
    },
    permalink: (data) => {
      const basename = path.basename(data.page.inputPath, path.extname(data.page.inputPath));
      const slug = basename.replace(/^\d{4}-\d{2}-\d{2}-/, "");
      return `/${slug}/`;
    },
    tags: (data) => {
      const rawTags = data.tags;
      let tags = [];

      if (Array.isArray(rawTags)) {
        tags = rawTags.slice();
      } else if (typeof rawTags === "string") {
        tags = rawTags.split(/\s+/).filter(Boolean);
      } else if (rawTags) {
        tags = [String(rawTags)];
      }

      if (!tags.includes("post")) {
        tags.push("post");
      }

      return tags;
    },
  },
};
