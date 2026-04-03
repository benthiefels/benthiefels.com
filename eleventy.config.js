const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("logos");
  eleventyConfig.addPassthroughCopy("photos");
  eleventyConfig.addPassthroughCopy("Headshot.jpg");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.addGlobalData("testimonials", () => {
    return readJsonFolder("content/testimonials");
  });
  eleventyConfig.addGlobalData("workItems", () => {
    return readJsonFolder("content/work");
  });
  eleventyConfig.addGlobalData("engagementCards", () => {
    return readJsonFolder("content/engagements");
  });
  eleventyConfig.addGlobalData("site", () => {
    return JSON.parse(fs.readFileSync("content/site.json", "utf8"));
  });
  eleventyConfig.addGlobalData("logos", () => {
    return JSON.parse(fs.readFileSync("content/logos.json", "utf8"));
  });

  eleventyConfig.addNunjucksFilter("split", (str, sep) => {
    if (!str) return [];
    return str.split(sep || "\n").filter(s => s.trim());
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  };
};

function readJsonFolder(folder) {
  const dir = path.join(__dirname, folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}
